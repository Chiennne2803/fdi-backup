import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogService} from '../../../../service/common-service/dialog.service';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {AuthService} from '../../../../core/auth/auth.service';
import {DateTimeformatPipe} from '../../../../shared/components/pipe/date-time-format.pipe';
import {ManagementDebtService} from '../../../../service';
import {FsCardDownDTO} from "../../../../models/service";
import {FsReportDebtManagersDTO} from "../../../../models/service/FsReportDebtManagersDTO.model";

@Component({
    selector: 'create-debt-history-dialog',
    templateUrl: './create-debt-history-dialog.component.html',
})
export class CreateDebtHistoryDialogComponent implements OnInit {
    public formGroup: FormGroup;
    public fsReportDebtManagers: FsReportDebtManagersDTO;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            fsReportDebtManagers: FsReportDebtManagersDTO;
            lstFsCardDown: FsCardDownDTO[];
        },
        private dialogRef: MatDialogRef<CreateDebtHistoryDialogComponent>,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _managementDebtService: ManagementDebtService,
    ) {
    }

    ngOnInit(): void {
        if (this.data) {
            this.fsReportDebtManagers = this.data.fsReportDebtManagers;
        }
        this.formGroup = this._fb.group({
            name: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            // fsCardDownId: new FormControl(null, Validators.required),
            fsReportDebtManagersId: new FormControl(this.fsReportDebtManagers.fsReportDebtManagersId, Validators.required),
            fsLoanProfilesId: new FormControl(this.fsReportDebtManagers.fsLoanProfilesId, Validators.required),
            processingContent: new FormControl(null, Validators.required),
            finDocumentsId: new FormControl(null, Validators.required),
            fsCardDownIds: new FormControl('', [Validators.required]),

            createdByName: new FormControl({
                value: this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl(this._authService.authenticatedUser.fullName),
            lastUpdatedDate: new FormControl(this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY')),
        });
    }

    onSubmit(): void {
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            confirmDialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this._managementDebtService.createDebtHistory({
                        ...this.formGroup.value, createdDate: null, lastUpdatedDate: null,
                    }).subscribe(res => {
                        if (res.errorCode === '0') {
                            this.dialogRef.close();
                            this._fuseAlertService.showMessageSuccess('Dữ liệu đã được lưu thành công');
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
