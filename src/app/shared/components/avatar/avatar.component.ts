import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { validateFileSize } from 'app/shared/validator/file';
import { fuseAnimations } from '../../../../@fuse/animations';
import { FsDocuments } from '../../../models/admin';
import { FileService } from '../../../service/common-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'avatar-component-shared',
    templateUrl: './avatar.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
})
export class AvatarComponent implements OnChanges {
    @Input() styleClass: string;
    @Input() showFileButton: boolean = true;
    @Input() formGroup: FormGroup;
    @Input() field: string;
    @Input() fileFromServer: string;

    previewAvatar:  FsDocuments;
    maxFileSize: number = 5;

    constructor(
        private _fileService: FileService,
        private _cdr: ChangeDetectorRef,
        private sanitizer: DomSanitizer
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if ( 'fileFromServer' in changes ) {
            this.downloadFile(this.fileFromServer);
        }

        if ( 'formGroup' in changes && this.formGroup.get(this.field) ) {
            this.downloadFile(this.formGroup.get(this.field).value);
        }
    }

    getSafeImageUrl(base64: string): SafeUrl {
    // Nếu base64 chưa có tiền tố "data:image/png;base64," thì thêm vào
        // const prefix = 'data:image/png;base64,';
        // const safeUrl = base64.startsWith('data:image') ? base64 : prefix + base64;
        return this.sanitizer.bypassSecurityTrustUrl(base64);
    }
    addValidator(): void {
        this.formGroup.get(this.field).addValidators(validateFileSize(this.maxFileSize));
    }

    uploadFile(event: Event): void {
        this.addValidator();
        const file = Array.from(this._fileService.getElementFile(event));
        // After upload file, using File object to validate file
        this.formGroup.get(this.field).patchValue(file);
        this.patchValueIfValid(file);
    }

    patchValueIfValid(file: File[]): void {
        if ( this.formGroup.get(this.field).valid ) {
            this._fileService.uploadFile(file[0]).subscribe((uploadFile) => {
                if ( uploadFile.payload ) {
                    const payload = uploadFile.payload as FsDocuments;
                    this.formGroup?.get(this.field).setValidators([]);
                    this.formGroup.get(this.field).updateValueAndValidity();
                    this.formGroup?.get(this.field)?.patchValue(String(payload.finDocumentsId));
    
                    // Download file form server to preview
                    if (['JPG', 'JPEG', 'PNG', 'PDF'].includes(payload.type.toUpperCase())) {
                        this.downloadFile(payload.finDocumentsId.toString());
                    }
                }
            });
        }
    }

    downloadFile(fileCode: string): void {
        if ( fileCode ) {
            this._fileService.getFileFromServer(fileCode).subscribe(
                downloadFile => {
                    this.previewAvatar = downloadFile.payload;
                    this._cdr.detectChanges();
                }
            );
        }
    }
}
