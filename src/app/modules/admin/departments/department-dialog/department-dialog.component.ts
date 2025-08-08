import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {AuthService} from 'app/core/auth/auth.service';
import {AdmDepartmentsDTO} from 'app/models/admin/AdmDepartmentsDTO.model';
import {DepartmentsService} from 'app/service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {APP_TEXT} from 'app/shared/constants';
import {AdmAccountDetailDTO} from "../../../../models/admin";
import {Observable} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
    selector: 'app-department-dialog',
    templateUrl: './department-dialog.component.html',
    styleUrls: ['./department-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DateTimeformatPipe]
})
export class DepartmentDialogComponent implements OnInit, AfterViewInit {
    public departmentForm: FormGroup = new FormGroup({});
    public all_HeadOffices: AdmAccountDetailDTO[] = [];
    public headOffices: Observable<AdmAccountDetailDTO[]> = new Observable();
    public detail: AdmDepartmentsDTO;
    public isUpdate: boolean = true;

    constructor(
        private matDialogRef: MatDialogRef<DepartmentDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AdmDepartmentsDTO,
        private _departmentsService: DepartmentsService,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
        private _cdf: ChangeDetectorRef,
        private confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) {
        if (data && data.admDepartmentsId > 0) {
            this.isUpdate = true;
        } else {
            this.isUpdate = false;
        }
    }

    ngAfterViewInit(): void {
    }

    ngOnInit(): void {
        this.initForm(this.data);
        this._departmentsService._listUser.subscribe((res) => {
            this.all_HeadOffices = res;
            if (this.data?.admAccountId) {
                const value = this.all_HeadOffices.filter(el => el.admAccountId === this.data.admAccountId);
                if (value.length === 1) {
                    this.departmentForm.controls.admAccountId.setValue(value[0].admAccountId.toString());
                    this.departmentForm.controls.admAccountName.setValue(value[0].fullName.toString());
                }
            }

        });
    }

    discard(): void {
        if (this.departmentForm.dirty) {
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
            const dialog = this.confirmService.open(config);
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this.matDialogRef.close(false);
                }
            });
            return;
        }
        this.matDialogRef.close(false);
    }

    submitUpdateOrCreate(): void {
        this.departmentForm.markAllAsTouched();
        if (this.departmentForm.valid) {
            if (this.departmentForm.dirty) {
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
                const dialog = this.confirmService.open(config);
                dialog.afterClosed().subscribe((res) => {
                    if (res === 'confirmed') {
                        const request = this.departmentForm.value;
                        if (this.isUpdate) {
                            this._departmentsService.update(request).subscribe((result) => {
                                if (result.errorCode === '0') {
                                    this.matDialogRef.close(true);
                                    this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                                } else {
                                    this._fuseAlertService.showMessageError(result.message);
                                }
                            });
                        } else {
                            this._departmentsService.create(request).subscribe((result) => {
                                if (result.errorCode === '0') {
                                    this.matDialogRef.close(true);
                                    this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                                } else {
                                    this._fuseAlertService.showMessageError(result.message);
                                }
                            });
                        }
                    }
                });
                return;
            } else {
                this._fuseAlertService.showMessageWarning("Không có thay đổi");
            }
        }
    }

    private initForm(data?: AdmDepartmentsDTO): void {
        this.departmentForm = this._formBuilder.group({
            admDepartmentsId: new FormControl(data ? data.admDepartmentsId : null),
            admDepartmentsCode: new FormControl(
                data ? data.admDepartmentsCode : null,
                [Validators.required, Validators.maxLength(50), Validators.pattern("[a-zA-Z0-9_]*")]),
            departmentName: new FormControl(data ? data.departmentName : null, [Validators.required, Validators.maxLength(50)]),
            admAccountId: new FormControl(data ? data.admAccountId : null),
            admAccountName: new FormControl(null),
            countStaff: new FormControl(data ? data.countStaff : null),

            createdByName: new FormControl({
                value: this.data ? this.data.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: this.data ? this._datetimePipe.transform(this.data.createdDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: this.data ? this.data.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: this.data ? this._datetimePipe.transform(this.data.lastUpdatedDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
        this.headOffices = this.departmentForm.controls.admAccountName.valueChanges.pipe(
            startWith(''),
            map(value => value ? this.filterAdmAccountDetail(value || '') : this.all_HeadOffices),
        );
    }

    private filterAdmAccountDetail(value: string): AdmAccountDetailDTO[] {
        const filterValue = (value || '').toString().toLowerCase();
        return this.all_HeadOffices.filter(option => option?.fullName?.toLowerCase().includes(filterValue) || option?.admAccountId.toString() == filterValue);
    }

    onOptionSelected(event: MatAutocompleteSelectedEvent): void {
        const value = this.all_HeadOffices.filter(el => el.admAccountId === event.option.value);
        if (value.length === 1) {
            this.departmentForm.controls.admAccountId.setValue(value[0].admAccountId);
            this.departmentForm.controls.admAccountName.setValue(value[0].fullName.toString());
        }
    }
}
