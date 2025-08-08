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
import {FsConfCreditDTO} from "../../../../../models/service/FsConfCreditDTO.model";

@Component({
    selector: 'create-credit-limit-dialog',
    templateUrl: './create-customer-rank-dialog.component.html',
})
export class CreateCustomerRankDialogsComponent implements OnInit {
    formGroup: FormGroup;
    message = APP_TEXT;
    lstConfCredit: FsConfCreditDTO[];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        private dialogRef: MatDialogRef<CreateCustomerRankDialogsComponent>,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
        private _dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _managementLenderService: ManagementLenderService,
    ) {
    }

    ngOnInit(): void {
        this._managementLenderService._prepareLender.subscribe(res => {
            if (res) {
                if (res.lstConfCredit) {
                    this.lstConfCredit = res.lstConfCredit;
                }
            }
        });
        this.formGroup = this._fb.group({
            fsConfCreditId: new FormControl(null, [Validators.required]),
            scores: new FormControl(null, Validators.required),
            createdByName: new FormControl(this._authService.authenticatedUser.fullName),
            createdDate: new FormControl(this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY')),
        });
    }

    onSubmit(): void {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            const confirmDialog = this._dialogService.openConfirmDialog('Bạn sẽ không thể chỉnh sửa hoặc xóa xếp hạng khách hàng', 'Xác nhận xếp hạng khách hàng');
            confirmDialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this._managementLenderService.updateCustomerRank({
                        fsConfCreditId: this.formGroup.get('fsConfCreditId').value,
                        scores: this.formGroup.get('scores').value,
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
                if (res === 'confirmed') {
                    this.dialogRef.close();
                }
            });
        } else {
            this.dialogRef.close();
        }
    }
}
