import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { validateFileSize } from 'app/shared/validator/file';
import { fuseAnimations } from '../../../../@fuse/animations';
import { FsDocuments } from '../../../models/admin';
import { FileService } from '../../../service/common-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FuseAlertService } from '@fuse/components/alert';
import { ImagePreviewDialogComponent } from '../file-detail/image-preview-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
    selector: 'avatar-component-shared',
    templateUrl: './avatar.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AvatarComponent implements OnChanges {
    @Input() styleClass: string;
    @Input() showFileButton: boolean = true;
    @Input() formGroup: FormGroup;
    @Input() field: string;
    @Input() disabled: boolean = false;
    @Input() fileFromServer: string;
    @Output() avatarChanged = new EventEmitter<any>();
    @Output() uploadingChange = new EventEmitter<boolean>();


    previewAvatar: FsDocuments;
    maxFileSize: number = 5;

    constructor(
        private _fileService: FileService,
        private _cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer,
        private _fuseAlertService: FuseAlertService,
        private _dialog: MatDialog
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if ('fileFromServer' in changes) {
            this.downloadFile(this.fileFromServer);
        }

        if ('formGroup' in changes && this.formGroup.get(this.field)) {
            this.downloadFile(this.formGroup.get(this.field).value);
        }
    }


    getSafeImageUrl(base64: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(base64);
    }
    addValidator(): void {
        this.formGroup.get(this.field).addValidators(validateFileSize(this.maxFileSize));
    }

    async uploadFile(event: Event): Promise<void> {
        this.addValidator();

        const input = event.target as HTMLInputElement;
        const files = input.files ? Array.from(input.files) : [];
        if (!files.length) return;

        const file = files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const fileName = file.name.toLowerCase();
        const validExtensions = ['.png', '.jpg', '.jpeg'];
         const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 512,
            useWebWorker: true,
            initialQuality: 1,
        };

        if (
            !validTypes.includes(file.type) ||
            !validExtensions.some(ext => fileName.endsWith(ext))
        ) {
            this._fuseAlertService.showMessageError('Định dạng file cho phép: PNG, JPEG, JPG');
            input.value = '';
            return;
        }

        // 🧩 Nén ảnh trước khi upload
        const compressedFile = await this._fileService.compressImage(file, options);

        // Gửi ảnh đã nén
        this.formGroup.get(this.field)?.patchValue([compressedFile]);
        this.patchValueIfValid([compressedFile]);

        input.value = '';
    }

    openImagePreview(): void {
        const allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        const fileType = this.previewAvatar?.type?.toLowerCase();

        if (this.previewAvatar?.contentBase64 && allowedTypes.includes(fileType)) {
            this._dialog.open(ImagePreviewDialogComponent, {
                data: {
                    // thêm prefix nếu cần
                    imageUrl: this.previewAvatar.contentBase64
                },
                panelClass: 'image-preview-dialog',

                maxWidth: '100vw',
                maxHeight: '100vh',
                width: '100%',
                height: '100%',
            });
        }
    }




    patchValueIfValid(file: File[]): void {
        if (this.formGroup.get(this.field).valid) {
            this.uploadingChange.emit(true); // 🚀 Bắt đầu upload (cha sẽ disable toàn form)

            this._fileService.uploadFile(file[0]).subscribe({
                next: (uploadFile) => {
                    if (uploadFile.payload) {
                        const payload = uploadFile.payload as FsDocuments;
                        this.formGroup?.get(this.field).setValidators([]);
                        this.formGroup.get(this.field).updateValueAndValidity();
                        this.formGroup?.get(this.field)?.patchValue(String(payload.finDocumentsId));
                        this.avatarChanged.emit(String(payload.finDocumentsId));

                        // Download file từ server để preview
                        if (['JPG', 'JPEG', 'PNG', 'PDF', 'JFIF'].includes(payload.type.toUpperCase())) {
                            this.downloadFile(payload.finDocumentsId.toString());
                        }
                    }
                },
                error: () => {
                    this.uploadingChange.emit(false); // ❌ Upload lỗi → enable lại
                },
                complete: () => {
                    this.uploadingChange.emit(false); // ✅ Upload xong → enable lại
                },
            });
        }
    }

    removeAvatar(): void {
        this.previewAvatar = null;
        this.formGroup?.get(this.field)?.patchValue(null);
        this.formGroup?.get(this.field)?.setValidators([]);
        this.formGroup?.get(this.field)?.updateValueAndValidity();
        if (this.avatarChanged) {
            this.avatarChanged.emit(null);
        }
    }
    downloadFile(fileCode: string): void {
        if (fileCode) {
            this._fileService.getFileFromServer(fileCode).subscribe(
                downloadFile => {
                    this.previewAvatar = downloadFile.payload;
                    this._cdr.detectChanges();
                }
            );
        }
    }
}
