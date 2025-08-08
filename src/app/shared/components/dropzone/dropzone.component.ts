import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation, OnInit, OnDestroy} from '@angular/core';
import {FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {isArray} from 'lodash';
import {BehaviorSubject, Subscription} from 'rxjs';
import {FsDocuments} from '../../../models/admin';
import {FileService} from '../../../service/common-service';
import {APP_TEXT} from '../../constants';
import {validateByPattern, validateFileSize} from '../../validator/file';
import {FileSelectResult} from "ngx-dropzone/lib/ngx-dropzone.service";

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
    // @Input() isCommonFile: boolean = false;
    // @Input() isExcelFile: boolean = false;
    // @Input() isReportFile: boolean = false;
    // @Input() isReportWithExcelFile: boolean = false;
    // @Input() isImageFile: boolean = false;
    // @Input() isImageWithPdfFile: boolean = false;
    @Input() requiredMsg: string;
    @Input() typeMsg: string;
    @Input() sizeMsg: string;

    files: File[] = [];
    // Contains id of files to post api
    finDocumentsId: BehaviorSubject<string[]> = new BehaviorSubject([]);
    appTextConfig = APP_TEXT;
    subscription: Subscription = new Subscription();
    isFistLoad: boolean = true;


    /**
     * Constructor
     */
    constructor(
        private _fileService: FileService,
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

    ngOnInit() {
        this.subscription = this.finDocumentsId.subscribe((valueImage) => {
            if(valueImage && !this.isFistLoad) {
                this.formGroup?.get(this.field).patchValue(valueImage.length > 1 ? valueImage.join(';') : valueImage[0]);
                this.formGroup?.get(this.field).updateValueAndValidity();
            }
            this.isFistLoad = false;
        })


        //fix case edit
        if(this.formGroup?.get(this.field)?.value) {
            const fieldValue = this.formGroup?.get(this.field)?.value;
            if(fieldValue.includes(';')) {
                const fieldValues = fieldValue.split(';').filter(Boolean);
                for (const fileId of fieldValues) {
                    this._fileService.getFileFromServer(String(fileId)).subscribe((file)=> {
                        this.files.push(new File([this._fileService.dataURItoBlob(file.payload.contentBase64)], file.payload.docName))
                        this.finDocumentsId.next([...this.finDocumentsId.getValue(), fileId]);
                    })
                }
            } else {
                this._fileService.getFileFromServer(String(fieldValue)).subscribe((file)=> {
                    this.files.push(new File([this._fileService.dataURItoBlob(file.payload.contentBase64)], file.payload.docName))
                })
                this.finDocumentsId.next([...this.finDocumentsId.getValue(), fieldValue]);
            }
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    checkInputToValidateFile(): void {
        // At each time change/select image, add validations to validate
        if (this.maxFileSize) {
            this.formGroup.get(this.field).addValidators(validateFileSize(this.maxFileSize));
        }

        // pattern
        if (this.pattern) {
            this.formGroup.get(this.field).addValidators(validateByPattern(this.pattern));
        }

        /*// png, jpg, pdf file
        if ( this.isCommonFile ) {
            this.formGroup.get(this.field).addValidators(commonFileType());
        }

        // xls, xlsx file
        if ( this.isExcelFile ) {
            this.formGroup.get(this.field).addValidators(excelFileType());
        }

        // pdf, word file
        if ( this.isReportFile ) {
            this.formGroup.get(this.field).addValidators(reportFileType());
        }

        // pdf, word, xls, xlsx file
        if ( this.isReportWithExcelFile ) {
            this.formGroup.get(this.field).addValidators(reportWithExcelFileType());
        }

        // png, jpg, jpeg
        if ( this.isImageFile ) {
            this.formGroup.get(this.field).addValidators(imageFileType());
        }

        // png, jpg, jpeg, pdf
        if ( this.isImageWithPdfFile ) {
            this.formGroup.get(this.field).addValidators(imageWithPdfFileType());
        }*/
        this.formGroup.get(this.field).markAsTouched();
    }

    updateValueAndValidity(): void {
        if (this.isRequired) {
            this.formGroup.get(this.field).addValidators(Validators.required);
        } else {
            this.formGroup.get(this.field).removeValidators(Validators.required);
        }
        this.formGroup.updateValueAndValidity();
    }

    onSelect(event: FileSelectResult): void {
        this.updateValueAndValidity();
        this.checkInputToValidateFile();
        const result = event.addedFiles;

        if (event.rejectedFiles && event.rejectedFiles.length > 0) {
            event.rejectedFiles.forEach(file => console.log("file type error :" + file.type))
            if (this.formGroup.get(this.field).errors) {
                this.formGroup.get(this.field).setErrors({...this.formGroup.get(this.field).errors, 'fileType': true});
            } else {
                this.formGroup.get(this.field).setErrors({'fileType': true});
            }

            return;
        }

        // Limit number of file to upload
        if (this.maxFile) {
            if (this.files.length === this.maxFile) {
                this.files.pop();
            }

            if (this.finDocumentsId.getValue().length === this.maxFile) {
                this.finDocumentsId.getValue().pop();
            }
        }
        // Push after check max file and only accept numbers of file less than max file
        result.forEach((file, index) => {
            if (index < this.maxFile) {
                this.files.push(file);
            }
        });

        // After upload file, using File object to validate file
        this.formGroup.get(this.field).patchValue(this.files);
        this.patchValueIfValid(result);
        this.formGroup.markAsDirty();
    }

    onClick(): void {
        // this.formGroup?.get(this.field)?.markAsTouched();
    }

    onRemove(event: File, index: number): void {
        this.updateValueAndValidity();
        this.files.splice(this.files.indexOf(event), 1);
        // Value will be an array of object if invalid
        // or be a string chain id of files if valid
        const currentValue = this.formGroup?.get(this.field).getRawValue();
        this.finDocumentsId.getValue().splice(index, 1);
        this.formGroup.get(this.field).updateValueAndValidity();
        // Check form control value is array of object files or string
        if (isArray(currentValue)) {
            const filesToReUpload = this.files.filter((f, i) => !this.finDocumentsId.getValue()[i]);
            this.patchValueIfValid(filesToReUpload);
            if(currentValue.length === 0) {
                this.formGroup?.get(this.field).patchValue(undefined);
            }
            if(filesToReUpload.length === 0 && currentValue.length === 1) {
                const valueToPost = this.finDocumentsId.getValue();
                this.formGroup?.get(this.field).patchValue(valueToPost.length > 1 ? valueToPost.join(';') : valueToPost[0]);
            }
        } else {
            const valueToPost = this.finDocumentsId.getValue();
            this.formGroup?.get(this.field).patchValue(valueToPost.length > 1 ? valueToPost.join(';') : valueToPost[0]);
        }
    }

    patchValueIfValid(result: File[]): void {
        // If file valid, call API to get finDocumentsId to set value for file
        if (this.formGroup?.get(this.field).valid) {
            for (const val of result) {
                this._fileService.uploadFile(val).subscribe((res) => {
                        if (res.payload) {
                            const payload = res.payload as FsDocuments;
                            this.finDocumentsId.next([...this.finDocumentsId.getValue(), String(payload.finDocumentsId)]);
                        }
                    }
                );
            }
        }
        // No need validations (type, size) --> only required value
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
