import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UploadFileDialog} from '../../../models/files.model';
import {DialogService} from '../../../../service/common-service/dialog.service';
import {data} from "autoprefixer";

@Component({
    templateUrl: './upload-file.component.html'
})
export class UploadFileDialogComponent implements OnInit {
    constructor(
        private _dialogRef: MatDialogRef<UploadFileDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UploadFileDialog,
        private _dialogService: DialogService,
    ) { }

    ngOnInit(): void {
        if(!this.data?.blockResetForm) {
            this.data.formGroup.reset();
        }
    }

    save(): void {
        this.data.formGroup.markAllAsTouched();
        if ( this.data.formGroup.valid ) {
            const dialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            dialog.afterClosed().subscribe((res) => {
                if ( res === 'confirmed' ) {
                    this._dialogRef.close('confirmed');
                }
            });
        }
    }

    cancel(): void {
        if ( this.data.formGroup.dirty ) {
            const dialog = this._dialogService.openConfirmDialog('Dữ liệu đang nhập sẽ bị mất');
            dialog.afterClosed().subscribe((res) => {
                if ( res === 'confirmed' ) {
                    this._dialogRef.close('canceled');
                }
            });
        } else {
            this._dialogRef.close('canceled');
        }
    }
}
