import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {FuseConfirmationDialogComponent} from '@fuse/services/confirmation/dialog/dialog.component';
import {AuthService} from 'app/core/auth/auth.service';
import {ConfRateService} from 'app/service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {map, Observable, startWith} from 'rxjs';
import {FsConfRateDTO} from '../../../../../../models/service/FsConfRateDTO.model';
import {FsConfCreditDTO} from '../../../../../../models/service/FsConfCreditDTO.model';

@Component({
    selector: 'app-add-edit-rate-loan-tenure',
    templateUrl: './add-edit-config-rate.component.html',
    styleUrls: ['./add-edit-config-rate.component.scss']
})
export class AddEditConfigRateComponent implements OnInit {
    public creditRateForm: FormGroup = new FormGroup({});
    public detailCredit: FsConfRateDTO;
    public isEditable: boolean = false;
    public creditCodes = new Observable<FsConfCreditDTO[]>();

    private creditCodeFilter: FsConfCreditDTO[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: number,
        private matDialogRef: MatDialogRef<AddEditConfigRateComponent>,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
        private _fuseAlertService: FuseAlertService,
        private _authService: AuthService,
        private _configRate: ConfRateService,
        private _confirmService: FuseConfirmationService,
    ) {
        if (!this.data) {
            this.isEditable = true;
        }
        this.creditCodes = this._configRate._prepareListRank;
        this._configRate._prepareListRank.subscribe((res) => {
            this.creditCodeFilter = res;
        });
    }

    ngOnInit(): void {
        this.initForm();
        this._configRate._confCreditDetail.subscribe((res) => {
            if (res) {
                this.detailCredit = res;
                this.initForm(res);
            }
        });
        this.creditCodes = this.creditRateForm.controls.creditCode.valueChanges.pipe(
            startWith(''),
            map(state => (state ? this._filterCode(state) : this.creditCodeFilter.slice()))
        );
    }

    onOptionSelected(event: MatAutocompleteSelectedEvent): void {
        const value = this.creditCodeFilter.filter(el => el.creditCode === event.option.value);
        if (value.length === 1) {
            this.creditRateForm.controls.fsConfCreditId.setValue(value[0].fsConfCreditId.toString());
        }
    }

    back(): void {
        if (this.creditRateForm.dirty) {
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
                    this.matDialogRef.close(false);
                }
            });
            return;
        }
        this.matDialogRef.close(false);
    }
    submitAndReset(): void {
        this.creditRateForm.markAllAsTouched();
        if (this.creditRateForm.valid) {
            if (this.creditRateForm.dirty) {
                const dialog = this.openDialogConfirm();
                dialog.afterClosed().subscribe((res) => {
                    this.creditRateForm.markAllAsTouched();
                    if (res === 'confirmed' && this.creditRateForm.valid) {
                        const request = this.getParamRequest();
                        this.createData(request);
                    }
                });
            } else {
                this._fuseAlertService.showMessageWarning("Không có thay đổi");
            }
        }
    }
    submit(): void {
        this.creditRateForm.markAllAsTouched();
        if (this.creditRateForm.valid) {
            if (this.creditRateForm.dirty) {
                const dialog = this.openDialogConfirm();
                dialog.afterClosed().subscribe((res) => {
                    this.creditRateForm.markAllAsTouched();
                    const request = this.getParamRequest();
                    if (res === 'confirmed') {
                        if (this.data) {
                            this.updateData(request);
                        } else {
                            this.createData(request, true);
                        }
                    }
                });
            } else {
                this._fuseAlertService.showMessageWarning("Không có thay đổi");
            }
        }
    }

    private initForm(data?: FsConfRateDTO): void {
        this.creditRateForm = this._formBuilder.group({
            fsConfCreditId: new FormControl(data ? data.fsConfCreditId : null),
            fsConfRateId: new FormControl(data ? data.fsConfRateId : null),
            creditCode: new FormControl(data ? data.creditCode : null, [Validators.required]),
            tenor: new FormControl(data ? data.tenor : null, [Validators.required, Validators.maxLength(10)]),
            minMortgateRate: new FormControl(data ? data.minMortgateRate : null, [Validators.required, Validators.min(0)]),
            maxMortgateRate: new FormControl(data ? data.maxMortgateRate : null, [Validators.required, Validators.min(0)]),
            fee: new FormControl(data ? data.fee : null, [Validators.required, Validators.maxLength(4), Validators.min(0)]),
            // periodPay: new FormControl(data ? data.periodPay : '1', [Validators.required]),
            minAmount: new FormControl(data ? data.minAmount : null, [Validators.required, Validators.maxLength(15), Validators.min(0)]),
            note: new FormControl(data ? data.note : null),
            createdByName: new FormControl({
                value: data ? data.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: data ? this._datetimePipe.transform(data.createdDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: data ? data.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: data ? this._datetimePipe.transform(data.lastUpdatedDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
    }

    private _filterCode(value: string): FsConfCreditDTO[] {
        const filterValue = value.toLowerCase();

        return this.creditCodeFilter.filter(state => state.creditCode.toLowerCase().includes(filterValue));
    }

    private openDialogConfirm(): MatDialogRef<FuseConfirmationDialogComponent, any> {
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
        return this._confirmService.open(config);
    }

    private getParamRequest(): FsConfRateDTO {
        let request = new FsConfRateDTO();
        request = this.creditRateForm.value;
        delete request.creditCode;

        return request;
    }

    private updateData(request: FsConfRateDTO): void {
        this._configRate.update(request).subscribe((response) => {
            if (response.errorCode === '0') {
                this.creditRateForm.reset();
                this._configRate.doSearch().subscribe();
                this.matDialogRef.close(true);
            } else {
                this._fuseAlertService.showMessageError(response.message.toString());
            }
        });
    }

    private createData(request: FsConfRateDTO, isClose: boolean = false): void {
        this._configRate.create(request).subscribe((response) => {
            if (response.errorCode === '0') {
                this.creditRateForm.reset();
                this.initForm();
                this._configRate.doSearch().subscribe();
                this._fuseAlertService.showMessageSuccess("Thêm mới thành công ");
                if (isClose) {
                    this.matDialogRef.close(true);
                }
            } else {
                this._fuseAlertService.showMessageError(response.message.toString());
            }
        });
    }

}
