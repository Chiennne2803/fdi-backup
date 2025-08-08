import {Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {FuseConfirmationDialogComponent} from '@fuse/services/confirmation/dialog/dialog.component';
import {AuthService} from 'app/core/auth/auth.service';
import {AdmGroupRoleDTO} from 'app/models/admin';
import {DecentralizedService} from 'app/service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {APP_TEXT} from 'app/shared/constants';
import {cloneDeep} from 'lodash';
import {ModulesDecentralizationComponent} from '../modules-roles/modules-decentralization.component';
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {AdvancedTab} from "../../../../../models/admin/AdvancedTab.model";
import {ModuleAdvancedDecentralizationComponent} from "../module-advanced/module-advanced-decentralization.component";
import {BaseResponse} from "../../../../../models/base";
import {MatTabGroup} from "@angular/material/tabs";
import moment, {Moment} from "moment";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {ModuleReportComponent} from "../module-report/module-report.component";

export const DATE_FORMATTER: MatDateFormats = {
    parse: {
        dateInput: 'DD/MM/YYYY'
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'YYYY'
    }
};

@Component({
    selector: 'detail-decentralization',
    templateUrl: './detail-decentralization.component.html',
    styleUrls: ['./detail-decentralization.component.scss'],
    animations: fuseAnimations,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATTER },
    ],
    encapsulation: ViewEncapsulation.None,
})
export class DetailDecentralizationComponent implements OnInit {
    @ViewChild(ModulesDecentralizationComponent) moduleDecentralization: ModulesDecentralizationComponent;
    @ViewChild(ModuleAdvancedDecentralizationComponent) moduleAdvanceDecentralization: ModuleAdvancedDecentralizationComponent;
    @ViewChild(ModuleReportComponent) moduleReportComponent: ModuleReportComponent;
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

    public roleForm: FormGroup = new FormGroup({});
    public roles = [];
    public lstAdvancedTabs: AdvancedTab[] = [];
    public lstModuleReportNdt = [];
    public lstModuleReportHdv = [];
    public lstModuleReportAcc = [];
    minTimeStart: Moment;

    constructor(
        private _decentralizedService: DecentralizedService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _formBuilder: FormBuilder
    ) {
        this.minTimeStart = moment().add({'days': 0});
    }

    ngOnInit(): void {
        this.roles = [];
        this.lstAdvancedTabs = [];
        this.lstModuleReportNdt = [];
        this.lstModuleReportHdv = [];
        this.lstModuleReportAcc = [];

        this.initForm();
        this._decentralizedService.initAvance$.subscribe((res: BaseResponse) => {
            if (res) {
                this.initForm();
                this.roles = [];
                this.lstAdvancedTabs = res.payload.lstAdvancedTabs;
            }
        })
        this._decentralizedService.admGroupRoleDetail$.subscribe((res: AdmGroupRoleDTO) => {
            if (res) {
                this.initForm(res);
                this.roles = res.roles;
                this.lstAdvancedTabs = res.lstAdvancedTabs;
            }
        })
    }

    onClose(): void {
        if (this.roleForm.dirty) {
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
                    this.handleCloseDetailPanel.emit();
                }
            });
            return;
        }
        this.handleCloseDetailPanel.emit();
    }

    public disabled: boolean =false;
    onSubmit(): void {
        this.roleForm.get('timeStart').markAllAsTouched();
        this.roleForm.markAllAsTouched();
        if (this.roleForm.invalid) {
            return;
        }
        const roles = cloneDeep(this.moduleDecentralization.dataSource.data);
        if (roles.length <= 0) {
            this._fuseAlertService.showMessageError("Chưa chọn quyền module");
            return;
        }
        const lstAdvancedTabs = cloneDeep(this.moduleAdvanceDecentralization.lstAdvancedTabs);
        if (lstAdvancedTabs.length <= 0) {
            this._fuseAlertService.showMessageError("Lỗi khởi tạo quyền nâng cao");
            return;
        }


        const lstModuleReportNdt = cloneDeep(this.moduleReportComponent.lstModuleReportNdt);
        if (lstModuleReportNdt.length <= 0) {
            this._fuseAlertService.showMessageError("Lỗi khởi tạo quyền report");
            return;
        }
        const lstModuleReportHdv = cloneDeep(this.moduleReportComponent.lstModuleReportHdv);
        if (lstModuleReportHdv.length <= 0) {
            this._fuseAlertService.showMessageError("Lỗi khởi tạo quyền report");
            return;
        }
        const lstModuleReportAcc = cloneDeep(this.moduleReportComponent.lstModuleReportAcc);
        if (lstModuleReportAcc.length <= 0) {
            this._fuseAlertService.showMessageError("Lỗi khởi tạo quyền report");
            return;
        }


        let payload = this.roleForm.value;
        payload = {
            ...payload,
            timeStart: new Date(payload.timeStart).getTime(),
            timeEnd: payload.timeEnd ? new Date(payload.timeEnd).getTime() : null,
            roles: roles,
            lstAdvancedTabs: lstAdvancedTabs,
            lstModuleReportNdt: lstModuleReportNdt,
            lstModuleReportHdv: lstModuleReportHdv,
            lstModuleReportAcc: lstModuleReportAcc,
        };
        const dialog = this.openDialogConfirm();
        dialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed' && this.roleForm.valid) {
                this.roleForm.disable();
                this.disabled = true;
                if (!payload.admGroupRoleId) {
                    this._decentralizedService.create(payload).subscribe((response) => {
                        if (response.errorCode === '0') {
                            this._decentralizedService.doSearch().subscribe();
                            this.handleCloseDetailPanel.emit(true);
                            this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                        } else {
                            this._fuseAlertService.showMessageError(response.message.toString());
                        }
                        this.roleForm.enable();
                        this.disabled = false;
                    });
                } else {
                    this._decentralizedService.update(payload).subscribe((response) => {
                        if (response.errorCode === '0') {
                            this._decentralizedService.doSearch().subscribe();
                            this.handleCloseDetailPanel.emit(true);
                            this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                        } else {
                            this._fuseAlertService.showMessageError(response.message.toString());
                        }
                        this.roleForm.enable();
                        this.disabled = false;
                    });
                }

            }
        });
    }

    private initForm(data?: AdmGroupRoleDTO): void {
        this.roles = [];
        this.roleForm = this._formBuilder.group({
            admGroupRoleId: new FormControl(data ? data.admGroupRoleId : null),
            groupRoleName: new FormControl(data ? data.groupRoleName : null, [Validators.required, Validators.maxLength(50)]),
            timeStart: new FormControl(data ? new Date(data.timeStart) : null, [Validators.required]),
            timeEnd: new FormControl(data && data.timeEnd !== undefined ? new Date(data.timeEnd) : null),
            info: new FormControl(data ? data.info : null),
            createdByName: new FormControl({
                value: data ? data.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true,
            }),
            createdDate: new FormControl({
                value: data ? this._datetimePipe.transform(new Date(data.createdDate).getTime(), 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true,
            }),
            lastUpdatedByName: new FormControl({
                value: data ? data.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: data ? this._datetimePipe.transform(new Date(data.lastUpdatedDate).getTime(), 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
        if (this.matTabGroup) {
            this.matTabGroup.selectedIndex = 0;
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

    getValidatorErrors(keyName) {
        if (this.roleForm.get(keyName).touched) {
            if (this.roleForm.get(keyName).hasError('matDatepickerParse')) {
                return "QLPQ006";
            }
            if (this.roleForm.get(keyName).hasError('biggerThanToday')
                || this.roleForm.get(keyName).hasError('matDatepickerMax')) {
                return "QLPQ005";
            }
            if (this.roleForm.get(keyName).hasError('lessThanToday')
                || this.roleForm.get(keyName).hasError('matDatepickerMin')) {
                return "QLPQ013";
            }
            if (this.roleForm.get(keyName).hasError('required')) {
                return "QLPQ004";
            }
        }
        return null;
    }
    getValidatorErrors2(keyName) {
        if (this.roleForm.get(keyName).touched) {
            if (this.roleForm.get(keyName).hasError('required')) {
                return "QLPQ004";
            }
            if (this.roleForm.get(keyName).hasError('matDatepickerParse')) {
                return "QLPQ006";
            }
            if (this.roleForm.get(keyName).hasError('biggerThanToday')
                || this.roleForm.get(keyName).hasError('matDatepickerMax')) {
                return "QLPQ005";
            }
            if (this.roleForm.get(keyName).hasError('lessThanToday')
                || this.roleForm.get(keyName).hasError('matDatepickerMin')) {
                return "QLPQ013";
            }
        }
        return null;
    }
}
