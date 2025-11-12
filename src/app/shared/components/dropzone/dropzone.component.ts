import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { isArray } from 'lodash';
import { BehaviorSubject, forkJoin, Subscription } from 'rxjs';
import { FsDocuments } from '../../../models/admin';
import { FileService } from '../../../service/common-service';
import { APP_TEXT } from '../../constants';
import { validateByPattern, validateFileSize } from '../../validator/file';
import { FileSelectResult } from "ngx-dropzone/lib/ngx-dropzone.service";
import { FuseAlertService } from '@fuse/components/alert';
import { TranslocoService } from '@ngneat/transloco';
import imageCompression from 'browser-image-compression';

@Component({
    selector: 'app-dropzone',
    templateUrl: './dropzone.component.html',
    styleUrls: ['./dropzone.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DropzoneComponent implements OnChanges, OnInit, OnDestroy {
    @Input() inputId: string = '';
    @Input() title: string = '';
    @Input() topTitle: string = '';
    @Input() styleClass: string = '';
    @Input() previewClass: string = '';
    @Input() multiple: boolean = false;
    @Input() maxFile: number = 1;
    @Input() formGroup: FormGroup;
    @Input() field: string;
    @Input() accept: string = '*';
    @Input() hasPreview: boolean = false;
    @Input() removeValue: boolean = false;
    @Input() isRequired: boolean = true;
    // Input to validate file
    @Input() maxFileSize: string | number;
    @Input() pattern: string;

    @Input() requiredMsg: string;
    @Input() typeMsg: string;
    @Input() sizeMsg: string;

    @Output() fileChanged = new EventEmitter<any>();
    @Output() uploadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();


    files: File[] = [];
    // Contains id of files to post api
    finDocumentsId: BehaviorSubject<string[]> = new BehaviorSubject([]);
    appTextConfig = APP_TEXT;
    subscription: Subscription = new Subscription();
    isFistLoad: boolean = true;

    isUploading: boolean = false;
    @Input() disabled: boolean = false; // Nhận từ cha truyền xuống

    private readonly _defaultPattern =
        '^.+\\.(([pP][nN][gG])|([jJ][pP][gG])|([jJ][pP][eE][gG])|([xX][lL][sS])|([xX][lL][sS][xX])|([pP][dD][fF])|([dD][oO][cC][xX])|([dD][oO][cC]))$';

    /**
     * Constructor
     */
    constructor(
        private _fileService: FileService,
        private _fuseAlertService: FuseAlertService,
        private translocoService: TranslocoService
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.removeValue) {
            this.files = [];
        }

        if ('isRequired' in changes) {
            let change = changes['isRequired'];
            let curVal = JSON.stringify(change.currentValue);
            if (curVal == 'true') {
                this.formGroup.get(this.field).addValidators(Validators.required);
            } else {
                this.formGroup.get(this.field).removeValidators(Validators.required);
            }
            this.formGroup.updateValueAndValidity();
        }
    }
    regexToExtensions(regexStr: string): string {
        // 1️⃣ Chỉ xử lý nếu regex có dạng ^.+\.((...))$
        const isValidRegexPattern = /^\^\.\+\\\.\(\s*\(.*\)\s*\)\$$/.test(regexStr);
        if (!isValidRegexPattern) {
            return regexStr;
        }
        if (!regexStr || typeof regexStr !== 'string' || regexStr.trim() === '') {
            return '.png,.jpg,.jpeg,.xls,.xlsx,.pdf,.docx,.doc';
        }

        // 2️⃣ Lấy các nhóm định nghĩa phần mở rộng, ví dụ ([pP][nN][gG])
        const matches = regexStr.match(/\(\s*(?:\[[a-zA-Z]+\])+\s*\)/g) || [];

        // 3️⃣ Chuyển từng nhóm thành chữ thường (png, jpg, ...)
        const exts = matches.map(m => {
            const chars = Array.from(m.matchAll(/\[([a-zA-Z]+)\]/g)).map(gr => gr[1][0]);
            return chars.join('').toLowerCase();
        });

        // 4️⃣ Loại trùng, ghép lại thành .png,.jpg,...
        const unique = Array.from(new Set(exts));
        return unique.map(e => '.' + e).join(',');
    }


    ngOnInit() {
        if (!this.pattern || this.pattern.trim() === '') {
            this.pattern = this._defaultPattern;
            this.accept = this._defaultPattern;
        }
        this.subscription = this.finDocumentsId.subscribe((valueImage) => {
            if (valueImage && !this.isFistLoad) {
                this.formGroup?.get(this.field).patchValue(valueImage.length > 1 ? valueImage.join(';') : valueImage[0]);
                this.formGroup?.get(this.field).updateValueAndValidity();
            }
            this.isFistLoad = false;
        })

        //fix case edit
        if (this.formGroup?.get(this.field)?.value) {
            const fieldValue = this.formGroup?.get(this.field)?.value;
            if (fieldValue.includes(';')) {
                const fieldValues = fieldValue.split(';').filter(Boolean);
                for (const fileId of fieldValues) {
                    this._fileService.getFileFromServer(String(fileId)).subscribe((file) => {
                        this.files.push(new File([this._fileService.dataURItoBlob(file.payload.contentBase64)], file.payload.docName))
                        this.finDocumentsId.next([...this.finDocumentsId.getValue(), fileId]);
                    })
                }
            } else {
                this._fileService.getFileFromServer(String(fieldValue)).subscribe((file) => {
                    this.files.push(new File([this._fileService.dataURItoBlob(file.payload.contentBase64)], file.payload.docName))
                })
                this.finDocumentsId.next([...this.finDocumentsId.getValue(), fieldValue]);
            }
        }
        // console.log(this.files)
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    updateValueAndValidity(): void {
        if (this.isRequired) {
            this.formGroup.get(this.field).addValidators(Validators.required);
        } else {
            this.formGroup.get(this.field).removeValidators(Validators.required);
        }
        this.formGroup.updateValueAndValidity();
    }

    checkInputToValidateFile(files: File[]): boolean {
        // const control = this.formGroup.get(this.field);
        // control.setErrors(null); // Xóa lỗi cũ trước khi check

        let hasError = false;
        console.log(files)

        // 1️⃣ Kiểm tra định dạng (pattern)
        if (this.pattern) {
            const regex = new RegExp(this.pattern, 'i');
            // console.log(regex, files)
            for (const f of files) {
                // console.log(f, !regex.test(f.name))
                if (!regex.test(f.name)) {
                    const message = this.translocoService.translate(this.typeMsg);
                    // console.log(message)
                    this._fuseAlertService.showMessageError(message || 'Sai định dạng file');
                    // control.setErrors({ ...(control.errors || {}), validateByPattern: true });
                    hasError = true;
                }
            }
        }

        // 2️⃣ Kiểm tra dung lượng file
        if (this.maxFileSize) {
            const maxBytes = typeof this.maxFileSize === 'number'
                ? this.maxFileSize * 1024 * 1024  // MB → bytes
                : Number(this.maxFileSize) * 1024 * 1024;

            for (const f of files) {
                if (f.size > maxBytes) {
                    const message = `File vượt quá kích thước tối đa (${this.maxFileSize} MB).`;
                    this._fuseAlertService.showMessageError(message);
                    // control.setErrors({ ...(control.errors || {}), validateFileSize: true });
                    hasError = true;
                }
            }
        }

        // 3️⃣ Nếu có lỗi thì return false (dừng upload)
        if (hasError) {
            return false;
        }

        // 4️⃣ Nếu hợp lệ thì clear lỗi
        // control.setErrors(null);
        return true;
    }

    // onSelect(event: FileSelectResult): void {
    //     const result = event.addedFiles;
    //     const control = this.formGroup.get(this.field);

    //     // 1️⃣ Kiểm tra rejectedFiles từ dropzone (loại file không được hỗ trợ)
    //     if (event.rejectedFiles && event.rejectedFiles.length > 0) {
    //         event.rejectedFiles.forEach(file => {
    //             this._fuseAlertService.showMessageError(`Loại file "${file.name}" không được hỗ trợ.`);
    //         });
    //         return; // ❌ Dừng luôn
    //     }

    //     // 2️⃣ Kiểm tra hợp lệ trước khi upload
    //     const isValid = this.checkInputToValidateFile(result);
    //     if (!isValid) return; // ❌ Nếu sai định dạng hoặc dung lượng thì dừng

    //     // 3️⃣ Kiểm tra số lượng file tối đa
    //     // if (this.maxFile && this.files.length >= this.maxFile) {
    //     //     this._fuseAlertService.showMessageError(`Chỉ được tải lên tối đa ${this.maxFile} file.`);
    //     //     return;
    //     // }
    //     if (this.maxFile) {
    //         if (this.files.length === this.maxFile) {
    //             this.files.pop();
    //         }

    //         if (this.finDocumentsId.getValue().length === this.maxFile) {
    //             this.finDocumentsId.getValue().pop();
    //         }
    //     }

    //     // 4️⃣ Nếu hợp lệ → bắt đầu upload (không push file vào ngay)
    //     this.updateValueAndValidity();
    //     // console.log('0')
    //     this.patchValueIfValid(result);
    //     this.formGroup.markAsDirty();
    // }
    async onSelect(event: FileSelectResult): Promise<void> {
        const result = event.addedFiles;
        const control = this.formGroup.get(this.field);

        // 1 Kiểm tra rejectedFiles
        if (event.rejectedFiles && event.rejectedFiles.length > 0) {
            event.rejectedFiles.forEach(file => {
                this._fuseAlertService.showMessageError(`Loại file "${file.name}" không được hỗ trợ.`);
            });
            return;
        }

        // 2 Kiểm tra hợp lệ định dạng & kích thước trước khi nén
        const isValid = this.checkInputToValidateFile(result);
        if (!isValid) return;

        // 3 Giới hạn số lượng file tối đa
        // if (this.maxFile && this.files.length >= this.maxFile) {
        //     this._fuseAlertService.showMessageError(`Chỉ được tải lên tối đa ${this.maxFile} file.`);
        //     return;
        // }
      
        if (this.maxFile) {
            if (this.files.length === this.maxFile) {
                this.files.pop();
            }

            if (this.finDocumentsId.getValue().length === this.maxFile) {
                this.finDocumentsId.getValue().pop();
            }
        }
        // 4 Bật loading sớm (bắt đầu nén)
        this.isUploading = true;
        this.uploadingChange.emit(true);

        // 5 Nén ảnh nếu là file ảnh (jpg/png/jpeg)
        const compressedFiles: File[] = [];
        for (const file of result) {
            const isImage = /\.(jpe?g|png)$/i.test(file.name);
            if (isImage) {
                try {
                    const options = {
                        maxSizeMB: 1,            // Giới hạn ảnh nén còn <= 1MB
                        maxWidthOrHeight: 1920,  // Giữ độ phân giải tối đa
                        useWebWorker: true,
                    };
                    const compressedFile = await this._fileService.compressImage(file, options);
                    // console.log(`📉 Nén ảnh "${file.name}" từ ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
                    compressedFiles.push(compressedFile);
                } catch (error) {
                    console.error('❌ Lỗi khi nén ảnh:', error);
                    compressedFiles.push(file); // fallback
                }
            } else {
                compressedFiles.push(file);
            }
        }

        // 5️⃣ Tiếp tục upload như cũ
        this.updateValueAndValidity();
        this.patchValueIfValid(compressedFiles);
        this.formGroup.markAsDirty();
    }

    onRemove(event: File, index: number): void {
        this.updateValueAndValidity();

        this.files.splice(this.files.indexOf(event), 1);
        // or be a string chain id of files if valid
        const currentValue = this.formGroup?.get(this.field).getRawValue();
        this.finDocumentsId.getValue().splice(index, 1);
        this.formGroup.get(this.field).updateValueAndValidity();
        if (this.fileChanged) {
            const value = this.formGroup.get(this.field)?.value;
            this.fileChanged.emit(value ?? null);
        }
        // Check form control value is array of object files or string
        if (isArray(currentValue)) {
            const filesToReUpload = this.files.filter((f, i) => !this.finDocumentsId.getValue()[i]);
            this.patchValueIfValid(filesToReUpload);

            if (currentValue.length === 0) {
                this.formGroup?.get(this.field).patchValue(undefined);
            }
            if (filesToReUpload.length === 0 && currentValue.length === 1) {
                const valueToPost = this.finDocumentsId.getValue();
                const valueJoin = valueToPost.length > 1 ? valueToPost.join(';') : valueToPost[0];
                this.formGroup?.get(this.field).patchValue(valueJoin);
                if (this.fileChanged) {
                    this.fileChanged.emit(valueJoin ?? null)
                }
            }
        } else {
            const valueToPost = this.finDocumentsId.getValue();
            const valueJoin = valueToPost.length > 1 ? valueToPost.join(';') : valueToPost[0];
            this.formGroup?.get(this.field).patchValue(valueJoin);
            if (this.fileChanged) {
                this.fileChanged.emit(valueJoin ?? null)
            }
        }
    }

    // patchValueIfValid(result: File[]): void {
    //     // If file valid, call API to get finDocumentsId to set value for file
    //     if (this.formGroup?.get(this.field).valid) {
    //         for (const val of result) {
    //             this._fileService.uploadFile(val).subscribe((res) => {
    //                 if (res.payload) {
    //                     const payload = res.payload as FsDocuments;
    //                     this.finDocumentsId.next([...this.finDocumentsId.getValue(), String(payload.finDocumentsId)]);
    //                     if (this.fileChanged) {
    //                         this.fileChanged.emit(String(payload.finDocumentsId))
    //                     }
    //                 } else {
    //                     this._fuseAlertService.showMessageError(res.message);
    //                 }
    //             }
    //             );
    //         }
    //     }
    //     // No need validations (type, size) --> only required value
    //     if (this.isRequired) {
    //         this.formGroup?.get(this.field).setValidators(Validators.required);
    //     }
    // }
    patchValueIfValid(result: File[]): void {
        console.log(result)
        if (!result || result.length === 0) return; // ✅ không có file thì dừng

        // this.isUploading = true;
        // this.uploadingChange.emit(true);

        const uploadObservables = result.map(val => this._fileService.uploadFile(val));

        forkJoin(uploadObservables).subscribe({
            next: (responses) => {
                const successFiles: File[] = [];
                const successIds: string[] = [];

                for (let i = 0; i < responses.length; i++) {
                    const res = responses[i];
                    const file = result[i];

                    if (res?.payload && Number(res?.errorCode) === 0) {
                        const payload = res.payload as FsDocuments;
                        successFiles.push(file);
                        successIds.push(String(payload.finDocumentsId));
                    } else {
                        this._fuseAlertService.showMessageError(res?.message || 'Upload file thất bại.');
                        this.isUploading = false;
                        this.uploadingChange.emit(false);
                        return; // ❌ Dừng luôn, không thêm file nào
                    }
                }

                if (successFiles.length > 0) {
                    const remainingSlots = this.maxFile - this.files.length;
                    const filesToAdd = successFiles.slice(0, remainingSlots);
                    const idsToAdd = successIds.slice(0, remainingSlots);

                    this.files.push(...filesToAdd);
                    this.finDocumentsId.next([
                        ...this.finDocumentsId.getValue(),
                        ...idsToAdd
                    ]);

                    const joinedValue =
                        idsToAdd.length > 1 ? idsToAdd.join(';') : idsToAdd[0];

                    this.formGroup?.get(this.field).patchValue(joinedValue);
                    this.fileChanged.emit(joinedValue);
                }
            },
            error: (err) => {
                console.error(err);
                this._fuseAlertService.showMessageError('Upload file thất bại.');
            },
            complete: () => {
                console.log("complete")
                this.isUploading = false;
                this.uploadingChange.emit(false);
            }
        });

        if (this.isRequired) {
            this.formGroup?.get(this.field).setValidators(Validators.required);
        }
    }

    isInvalidFormControl(): boolean {
        return this.formGroup?.get(this.field)?.invalid
            && this.formGroup?.get(this.field)?.touched;
    }

    isInvalidRequired(): boolean {
        if (!this.isRequired) return false;
        return this.formGroup?.get(this.field)?.hasError('required')
            && this.formGroup?.get(this.field)?.touched;
    }

    validateFileName(type: string): boolean {
        return this.formGroup?.get(this.field)?.hasError(type)
            && this.formGroup?.get(this.field)?.touched;
    }

    validateByPattem(type: string): boolean {
        return this.formGroup?.get(this.field)?.hasError(type)
            && this.formGroup?.get(this.field)?.touched;
    }

    isMaxFileSize(): boolean {
        return this.formGroup?.get(this.field)?.hasError('validateFileSize');
    }
}