import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {AuthService} from 'app/core/auth/auth.service';
import {FsChargeCashReqDTO} from 'app/models/service/FsChargeCashReqDTO.model';
import {ManagementCashInService} from 'app/service/admin/management-cash-in.service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {APP_TEXT} from 'app/shared/constants';
import {AdmAccountDetailDTO} from "../../../../../models/admin";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {map, startWith} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
    selector: 'app-request-funding-dialog',
    templateUrl: './request-funding-dialog.component.html',
    styleUrls: ['./request-funding-dialog.component.scss'],
    providers: [DateTimeformatPipe]
})
export class RequestFundingDialogComponent implements OnInit {
    public requestFundingForm: FormGroup = new FormGroup({});
    public transTypes = [
        { id: 2, label: 'Tiếp quỹ tiền mặt' },
        { id: 3, label: 'Tiếp quỹ tiền điện tử' }
    ];
    public status = [
        {id: 1, label: 'Soạn thảo'}
    ];
    public toWalletType = [
        {id: 'W_PAY_COM', label: 'Tài khoản thanh toán hoa hồng'},
        {id: 'W_HO_BO', label: 'Tài khoản thanh toán khoản vay'},
    ];

    public transType: number = 2;
    public fsChargeCashReqDTO: FsChargeCashReqDTO;
    public admAccountDetailDTOS: Observable<AdmAccountDetailDTO[]> = new Observable();
    public allAdmAccountDetailDTOS: AdmAccountDetailDTO[];
    public availableBalances: number;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _matDialogRef: MatDialogRef<RequestFundingDialogComponent>,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _manageCashInService: ManagementCashInService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this.initForm();
        const request = new FsChargeCashReqDTO();
        request.transType = 2;//mac dinh la tiep duy tien mat
        this._manageCashInService.initCashInReq(request).subscribe((res) => {
            if (res) {
                this.fsChargeCashReqDTO = res.payload;
                this.initForm();
            }
        });
    }


    discard(): void {
        if (this.requestFundingForm.dirty) {
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
        this._matDialogRef.close(false);
    }

    submit(): void {
        this.requestFundingForm.markAllAsTouched();
        if (this.requestFundingForm.valid) {
            if (this.requestFundingForm.dirty) {
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
                    if (res === 'confirmed' && this.requestFundingForm.valid) {
                        const request = this.requestFundingForm.value;
                        this._manageCashInService.create(request).subscribe((result) => {
                            if (result.errorCode === '0') {
                                this._matDialogRef.close(true);
                                this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                            } else {
                                this._fuseAlertService.showMessageError(result.message.toString());
                            }
                        });
                    }
                });
            } else {
                this._fuseAlertService.showMessageWarning("Không có thay đổi");
            }
        }

    }

    onSelectionChange(event: MatSelectChange): void {
        this.transType = event.value;
        const request = new FsChargeCashReqDTO();
        request.transType = this.transType;
        this._manageCashInService.initCashInReq(request).subscribe((res) => {
            if (res) {
                this.fsChargeCashReqDTO = res.payload;
                this.initForm();
            }
        });
    }


    changeToWallet(event: MatSelectChange): void {
       /* if (this.transType == 3 && event.value == 'W_HO_BO') {
            this.requestFundingForm.get('fromAdmAccountId').setValidators([Validators.required]);
        } else {
            this.requestFundingForm.get('toAdmAccountId').clearValidators();
            this.requestFundingForm.get('toAdmAccountId').updateValueAndValidity();
        }*/
    }

    private initForm(): void {
        if (this.fsChargeCashReqDTO && this.fsChargeCashReqDTO.admAccountDetailDTOS) {
            // this.admAccountDetailDTOS = this.fsChargeCashReqDTO.admAccountDetailDTOS;
            this.allAdmAccountDetailDTOS = this.fsChargeCashReqDTO.admAccountDetailDTOS;
        }
        this.requestFundingForm = this._formBuilder.group({
            transType: new FormControl(this.transType, [Validators.required]),
            transCode: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.transCode : '', [Validators.required]),
            amount: new FormControl(null, [Validators.required, Validators.maxLength(15), Validators.min(1)]),
            availableBalances: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.availableBalances : 0),

            fromAdmAccountId: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.fromAdmAccountId : null),
            fromWallet: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.fromWallet : null),

            status: new FormControl(this.status[0].id),
            toAdmAccountId: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.toAdmAccountId : null),
            toAdmAccountName: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.toAdmAccountName : null),

            fullName: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.fullName : null),
            toBankName: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.toBankName : null),
            toBranchName: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.toBranchName : null),
            toAccNo: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.toAccNo : null),
            toWallet: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.toWallet : null),
            note: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.note : null, [Validators.maxLength(100)]),
            transInfo: new FormControl(this.fsChargeCashReqDTO ? this.fsChargeCashReqDTO.transInfo : null),

            createdByName: new FormControl({
                value: this._authService.authenticatedUser.fullName,
                disabled: true,
            }),
            createdDate: new FormControl({
                value: this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true,
            }),
        });

        this.admAccountDetailDTOS = this.requestFundingForm.controls.toAdmAccountName.valueChanges.pipe(
            startWith(''),
            map(value => value ? this.filterAdmAccountDetail(value || '') : this.allAdmAccountDetailDTOS),
        );
        this.requestFundingForm.get('transType')
            .valueChanges
            .subscribe((value) => {
                if (value == 3) {
                    this.requestFundingForm.get('toWallet').setValidators([Validators.required]);
                } else {
                    this.requestFundingForm.get('toWallet').clearValidators();
                    this.requestFundingForm.get('toWallet').updateValueAndValidity();
                }
                this.requestFundingForm.get('toWallet').updateValueAndValidity();
            });
        this.requestFundingForm.get('toWallet')
            .valueChanges
            .subscribe((value) => {
                if (value == 'W_HO_BO') {
                    this.requestFundingForm.get('toAdmAccountId').setValidators([Validators.required]);
                } else {
                    this.requestFundingForm.get('toAdmAccountId').clearValidators();
                    this.requestFundingForm.get('toAdmAccountId').updateValueAndValidity();
                }
                this.requestFundingForm.get('toAdmAccountId').updateValueAndValidity();
            });
    }

    onOptionProvinceSelected(event: MatAutocompleteSelectedEvent): void {
        const value = this.allAdmAccountDetailDTOS.filter(el => el.admAccountId === event.option.value);
        if (value.length === 1) {
            this.requestFundingForm.controls.toAdmAccountId.setValue(value[0].admAccountId.toString());
            this.requestFundingForm.controls.toAdmAccountName.setValue(value[0].fullName.toString());
        }
    }

    private filterAdmAccountDetail(value: string): AdmAccountDetailDTO[] {
        const filterValue = value.toLowerCase();
        return this.allAdmAccountDetailDTOS.filter(option => option?.fullName?.toString().toLowerCase().includes(filterValue)
            || option?.accountName?.toString().toLowerCase().includes(filterValue));
    }
}
