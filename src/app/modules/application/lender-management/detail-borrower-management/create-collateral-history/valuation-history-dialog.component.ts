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
import {AdmCollateralDTO} from "../../../../../models/admin/AdmCollateralDTO.model";
import {data} from "autoprefixer";

@Component({
    selector: 'create-collateral-dialog',
    templateUrl: './valuation-history-dialog.component.html',
})
export class ValuationHistoryDialogComponent implements OnInit {
    public formGroup: FormGroup;
    public selectedAdmCollateral: AdmCollateralDTO;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            admCollateralDTO: AdmCollateralDTO
            maxLoan: number;
        },
        private dialogRef: MatDialogRef<ValuationHistoryDialogComponent>,
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
        if (this.data) {
            this.selectedAdmCollateral = this.data.admCollateralDTO;
        }
        this.formGroup = this._fb.group({
            admCollateralId: new FormControl(this.selectedAdmCollateral.admCollateralId, Validators.required),
            admAccountId: new FormControl(this.selectedAdmCollateral.admAccountId, Validators.required),
            admCollateralName: new FormControl({
                value: this.selectedAdmCollateral.collateralName,
                disabled: true
            }),
            amount: new FormControl(null, [Validators.required, Validators.maxLength(15)]),
            guaranteedRate: new FormControl(null, Validators.required),
            valuationName: new FormControl(null),
            fileId: new FormControl(null, Validators.required),

            createdByName: new FormControl(this._authService.authenticatedUser.fullName),
            createdDate: new FormControl(this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY')),
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
                    this._managementLenderService.createCollateralHistory({
                        ...this.formGroup.value, createdDate: null, lastUpdatedDate: null,
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

    upadteGuaranteedRate($event: any) {
        var rate = (Number($event) / this.data.maxLoan * 100).toFixed(3);
        this.formGroup.get('guaranteedRate').patchValue(rate);
        this.formGroup.get('guaranteedRate').updateValueAndValidity();
    }
}
