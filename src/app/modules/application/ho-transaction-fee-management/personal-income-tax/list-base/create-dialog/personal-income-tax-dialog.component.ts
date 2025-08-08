import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { BaseResponse } from 'app/models/base';
import { FsManageTransactionFeeDTO } from 'app/models/service/FsManageTransactionFeeDTO.model';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { APP_TEXT } from 'app/shared/constants';
import { Observable, of } from 'rxjs';
import {FsTranferWalletReqDTO} from "../../../../../../models/service/FsTranferWalletReqDTO.model";
import {TextColumn} from "../../../../../../shared/models/datatable/display-column.model";
import {PersonalIncomeTaxService} from "../../../../../../service";

@Component({
    selector: 'app-request-commission-dialog',
    templateUrl: './personal-income-tax-dialog.component.html',
    styleUrls: ['./personal-income-tax-dialog.component.scss'],
    providers: [DateTimeformatPipe]
})
export class PersonalIncomeTaxDialogComponent implements OnInit {
    public requestCommissionForm: FormGroup = new FormGroup({});
    public _dataSource = new Observable<BaseResponse>();
    public _tableConfig = {
        columnDefinition: [
            new TextColumn('admAccountIdPresenterName', 'Khách hàng', 10),
            new TextColumn('fsLoanProfilesId', 'Số hồ sơ', 10),
            new TextColumn('amount', 'Tiền thuế TNCN (VNĐ)', 10, false, 3),
        ],
        isViewDetail: false
    };
    public status = [
        { id: 1, label: 'Soạn thảo' }
    ];
    private request = new FsTranferWalletReqDTO();
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: FsManageTransactionFeeDTO[],
        private _matDialogRef: MatDialogRef<PersonalIncomeTaxDialogComponent>,
        private _formBuilder: FormBuilder,
        private _personalIncomeTaxService: PersonalIncomeTaxService,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.request.transactionFeeDTOS = this.data.map(el => ({
            fsManageTransactionFeeId: el.fsManageTransactionFeeId,
            fsLoanProfilesId: el.fsLoanProfilesId
        }));
        this._personalIncomeTaxService.initTranferWalletReq(this.request).subscribe((res) => {
            this.initForm(res.payload);
        });

        const dataTemp: BaseResponse = {
            content: this.data,
            empty: false,
            first: true,
            last: true,
            // eslint-disable-next-line id-blacklist
            number: 0,
            numberOfElements: this.data.length,
            size: 10,
            totalElements: this.data.length,
            totalPages: 1
        };

        this._dataSource = of(dataTemp);
    }


    discard(): void {
            const config: FuseConfirmationConfig = {
                title: '',
                message: 'Dữ liệu thao tác trên màn hình sẽ bị mất, xác nhận thực hiện',
                actions: {
                    confirm: {
                        label: 'Đồng ý',
                        color: 'primary'
                    },
                    cancel: {
                        label: 'Huỷ'
                    }
                }
            };
            const dialog = this._confirmService.open(config);
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this._matDialogRef.close(false);
                }
            });
            return;
    }

    submit(): void {
        const config: FuseConfirmationConfig = {
            title: 'Xác nhận lưu dữ liệu',
            message: '',
            actions: {
                confirm: {
                    label: 'Lưu',
                    color: 'primary'
                },
                cancel: {
                    label: 'Huỷ'
                }
            }
        };
        const dialog = this._confirmService.open(config);
        dialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed' && this.requestCommissionForm.valid) {
                const request = this.requestCommissionForm.value;
                this._personalIncomeTaxService.create(request).subscribe((result) => {
                    if (result.errorCode === '0') {
                        this._matDialogRef.close(true);
                        this._personalIncomeTaxService.searchPersonalIncomeTax().subscribe();
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                    } else {
                        this._fuseAlertService.showMessageError(result.message);
                    }
                });
            }
        });
    }

    private initForm(data?: FsTranferWalletReqDTO): void {
        this.requestCommissionForm = this._formBuilder.group({
            transCode: new FormControl(data ? data.transCode : null),
            fromWallet: new FormControl(data ? data.fromWallet : null),
            toWalletId: new FormControl(data ? data.toWalletId : null),
            toWallet: new FormControl(data ? data.toWallet : null),
            amount: new FormControl(data ? data.amount : null),
            status: new FormControl(data ? data.status : null),
            createdByName: new FormControl({
                value: this._authService.authenticatedUser.fullName,
                disabled: true,
            }),
            createdDate: new FormControl({
                value: this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true,
            }),
            transactionFeeDTOS: new FormControl(this.request ? this.request.transactionFeeDTOS : null)
        });
    }
}
