import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {FuseConfirmationDialogComponent} from '@fuse/services/confirmation/dialog/dialog.component';
import {AuthService} from 'app/core/auth/auth.service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {FsConfCreditDTO} from '../../../../../../models/service/FsConfCreditDTO.model';
import {FsConfBonusDTO} from '../../../../../../models/admin/FsConfBonusDTO.model';
import {AdmCategoriesDTO} from '../../../../../../models/admin';
import {ConfigBonusService} from '../../../../../../service/admin/config-bonus.service';
import moment from "moment";
import {CustomValidators} from "../../../../../../shared/validator/customValidators";

@Component({
    selector: 'app-add-edit-config-bonus',
    templateUrl: './add-edit-config-bonus.component.html',
    styleUrls: ['./add-edit-config-bonus.component.scss']
})
export class AddEditConfigBonusComponent implements OnInit {
    public configBonusForm: FormGroup = new FormGroup({});
    public confBonusDTO: FsConfBonusDTO;
    public isEditable: boolean = false;
    public scrMode;
    lstCalcMethod: AdmCategoriesDTO[] = [
        {admCategoriesId : 1, value: 'Giá trị cố định'},
        {admCategoriesId : 2, value : 'Tính theo tỷ lệ'}];
    lstConditionsBy: AdmCategoriesDTO[] = [
        {admCategoriesId : 1, value: 'Giao dich đầu tiên'},
        {admCategoriesId : 2, value : 'Khoảng thời gian'}];
    lstTransType: AdmCategoriesDTO[] = [
        {admCategoriesId : 3, value: 'Tất cả'},
        {admCategoriesId : 1, value: 'Giao dịch Đầu tư'},
        {admCategoriesId : 2, value : 'Giao dịch Vay vốn'}];
    lstStatus: AdmCategoriesDTO[] = [
        {admCategoriesId : 1, value: 'Áp dụng'},
        {admCategoriesId : 0, value : 'Ngưng áp dụng'}];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: number,
        private matDialogRef: MatDialogRef<AddEditConfigBonusComponent>,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
        private _fuseAlertService: FuseAlertService,
        private _authService: AuthService,
        private _configBonusService: ConfigBonusService,
        private _confirmService: FuseConfirmationService
    ) {
        if (this.data) {
            this.isEditable = true;
        }
    }

    ngOnInit(): void {
        this.initForm();
        this._configBonusService.confBonusDetail$.subscribe((res: FsConfBonusDTO) => {
            if (res) {
                this.confBonusDTO = res;
                this.initForm(res);
            }
        });
    }

    get startDateBonus() {
        return this.configBonusForm.get("startDateBonus") as FormControl;
    }

    back(): void {
        if (this.configBonusForm.dirty) {
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

    submit(): void {
        this.configBonusForm.markAllAsTouched();
        if (this.configBonusForm.valid) {
            if (this.configBonusForm.dirty) {
                const dialog = this.openDialogConfirm();
                dialog.afterClosed().subscribe((res) => {
                    this.configBonusForm.markAllAsTouched();
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

   get calcMethod() {
        return  this.configBonusForm.get('calcMethod') as FormControl;
    }
   get conditionsBy() {
        return  this.configBonusForm.get('conditionsBy') as FormControl;
    }

    private initForm(data?: FsConfBonusDTO): void {
        this.scrMode = 'add';
        this.configBonusForm = this._formBuilder.group({
            fsConfBonusId: new FormControl(data ? data.fsConfBonusId : null),
            calcMethod: new FormControl(data ? data.calcMethod : 1, [Validators.required]),
            conditionsBy: new FormControl(data ? data.conditionsBy : 1, [Validators.required]),
            transType: new FormControl({
                value: data ? data.transType : 1,
                disabled: data ? true : false
            }, [Validators.required]),
            status: new FormControl(data ? data.status : 1, [Validators.required]),
            amount: new FormControl(data ? data.amount : 0, [Validators.required, Validators.maxLength(15), Validators.min(1)]),
            bonusRate: new FormControl(data ? data.bonusRate : null),
            dateBonusRange: new FormControl(data ? data.dateBonusRange : null),
            startDateBonus: new FormControl(data ? new Date(data.startDateBonus) : moment()),
            endDateBonus: new FormControl(data ? new Date(data.endDateBonus) : moment()),
            startDateActive: new FormControl({
                value: data ? new Date(data.startDateActive) : moment(),
                disabled: true
            }, [Validators.required]),
            endDateActive: new FormControl({
                value: data ? new Date(data.endDateActive) : moment(),
                disabled: true
            }, [Validators.required]),
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

        this.configBonusForm.get('calcMethod').valueChanges.subscribe(data => {
            if (data == 1) {
                //co dinh
                this.configBonusForm.get('amount').addValidators([Validators.required, Validators.maxLength(15), Validators.min(1)]);
                this.configBonusForm.get('bonusRate').clearValidators()
                this.configBonusForm.get('bonusRate').setErrors(null)
            } else {
                //ti le
                this.configBonusForm.get('bonusRate').addValidators([Validators.required, CustomValidators.nonNegativeDecimal]);
                this.configBonusForm.get('amount').clearValidators()
                this.configBonusForm.get('amount').setErrors(null)
            }
        })

        if (data?.fsConfBonusId) {
            this.scrMode = 'edit';
            this.configBonusForm.controls['calcMethod'].disable();
            this.configBonusForm.controls['conditionsBy'].disable();
            this.configBonusForm.controls['amount'].disable();
            this.configBonusForm.controls['transType'].disable();
            this.configBonusForm.controls['bonusRate'].disable();
            this.configBonusForm.controls['startDateBonus'].disable();
            this.configBonusForm.controls['endDateBonus'].disable();
            this.configBonusForm.controls['startDateActive'].disable();
            this.configBonusForm.controls['endDateActive'].disable();
        } else {
            /* this.configBonusForm.controls['calcMethod'].enable();
             this.configBonusForm.controls['conditionsBy'].enable();
             this.configBonusForm.controls['amount'].enable();
             this.configBonusForm.controls['transType'].enable();
             this.configBonusForm.controls['bonusRate'].enable();
             this.configBonusForm.controls['startDateBonus'].enable();
             this.configBonusForm.controls['endDateBonus'].enable();*/
             this.configBonusForm.controls['startDateActive'].enable();
             this.configBonusForm.controls['endDateActive'].enable();
        }
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

    private getParamRequest(): FsConfCreditDTO {
        let request = new FsConfCreditDTO();
        request = this.configBonusForm.value;

        return request;
    }

    private updateData(request: FsConfCreditDTO): void {
        this._configBonusService.update(request).subscribe((response) => {
            if (response.errorCode === '0') {
                this.configBonusForm.reset();
                this._configBonusService.doSearch().subscribe();
                this.matDialogRef.close(true);
            } else {
                this._fuseAlertService.showMessageError(response.message.toString());
            }
        });
    }

    private createData(request: FsConfCreditDTO, isClose: boolean = false): void {
        this._configBonusService.create(request).subscribe((response) => {
            if (response.errorCode === '0') {
                this.configBonusForm.reset();
                this._configBonusService.doSearch().subscribe();
                if (isClose) {
                    this.matDialogRef.close(true);
                }
            } else {
                this._fuseAlertService.showMessageError(response.message.toString());
            }
        });
    }
}
