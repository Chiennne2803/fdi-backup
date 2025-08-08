import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {APP_TEXT} from '../../../../../shared/constants';
import {AuthService} from '../../../../../core/auth/auth.service';
import {DateTimeformatPipe} from '../../../../../shared/components/pipe/date-time-format.pipe';
import {ManagementLenderService} from '../../../../../service';
import {AdmCategoriesDTO} from '../../../../../models/admin';

@Component({
    selector: 'create-credit-limit-dialog',
    templateUrl: './create-credit-limit-dialog.component.html',
})
export class CreateCreditLimitDialogsComponent implements OnInit {
    formGroup: FormGroup;
    message = APP_TEXT;
    prepare: {
        collateralType: AdmCategoriesDTO[];
    };

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<CreateCreditLimitDialogsComponent>,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _managementLenderService: ManagementLenderService,
    ) {}

    ngOnInit(): void {
        this._managementLenderService._prepareLender.subscribe(res => {
           this.prepare = res;
        });
        this.formGroup = this._fb.group({
            creditLimit: new FormControl(null, [Validators.required, Validators.maxLength(15), Validators.min(0)]),
            finDocumentsId: new FormControl(null, Validators.required),
            createdByName: new FormControl(this._authService.authenticatedUser.fullName),
            createdDate: new FormControl(this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY')),
        });
    }

    onSubmit(): void {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            const confirmDialog = this._dialogService.openConfirmDialog('Bạn sẽ không thể chỉnh sửa hoặc xóa hạn mức tín dụng đã cấp', 'Xác nhận cấp hạn mức tín dụng');
            confirmDialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this._managementLenderService.createOrUpdateCreditLimit({
                        admCreditLimitId: null,
                        creditLimit: this.formGroup.get('creditLimit').value,
                        finDocumentsId: this.formGroup.get('finDocumentsId').value.toString().replace(';', ','),
                    }).subscribe(res => {
                        if (res.errorCode === '0') {
                            this.dialogRef.close();
                            this._fuseAlertService.showMessageSuccess('Dữ liệu đã được lưu thành công');
                            this._managementLenderService.getDetail().subscribe();
                        } else {
                            this._fuseAlertService.showMessageError(res.message.toString());
                        }
                    });
                }
            });
        }
    }

    closeDialog(): void {
        if (this.formGroup.dirty) {
            const confirmDialog = this._dialogService.openConfirmDialog('Dữ liệu đang thao tác trên màn hình sẽ bị mất, xác nhận thực hiện ?');
            confirmDialog.afterClosed().subscribe((res) => {
                if ( res === 'confirmed' ) {
                    this.dialogRef.close();
                }
            });
        } else {
            this.dialogRef.close();
        }
    }
}
