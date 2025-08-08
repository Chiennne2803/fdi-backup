import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {FuseConfirmationDialogComponent} from '@fuse/services/confirmation/dialog/dialog.component';
import {AuthService} from 'app/core/auth/auth.service';
import {ConfCreditService} from 'app/service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {FsConfCreditDTO} from "../../../../../../models/service/FsConfCreditDTO.model";

@Component({
    selector: 'app-add-edit-rank-credit',
    templateUrl: './add-edit-conf-credit.component.html',
    styleUrls: ['./add-edit-conf-credit.component.scss']
})
export class AddEditConfCreditComponent implements OnInit {
    public creditRankForm: FormGroup = new FormGroup({});
    public detailCredit: FsConfCreditDTO;
    public isEditable: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: number,
        private matDialogRef: MatDialogRef<AddEditConfCreditComponent>,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
        private _fuseAlertService: FuseAlertService,
        private _authService: AuthService,
        private _configService: ConfCreditService,
        private _confirmService: FuseConfirmationService
    ) {
        if (!this.data) {
            this.isEditable = true;
        }
    }

    ngOnInit(): void {
        this.initForm();
        this._configService._configCreditDetail.subscribe((res) => {
            if (res) {
                this.detailCredit = res;
                this.initForm(res);
            }
        });
    }

    back(): void {
        if (this.creditRankForm.dirty) {
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
        this.creditRankForm.markAllAsTouched();
        if (this.creditRankForm.valid) {
            if (this.creditRankForm.dirty) {
                const dialog = this.openDialogConfirm();
                dialog.afterClosed().subscribe((res) => {
                    if (res === 'confirmed' && this.creditRankForm.valid) {
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
        this.creditRankForm.markAllAsTouched();
        if (this.creditRankForm.valid) {
            if (this.creditRankForm.dirty) {
                const dialog = this.openDialogConfirm();
                dialog.afterClosed().subscribe((res) => {
                    this.creditRankForm.markAllAsTouched();
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

    private initForm(data?: FsConfCreditDTO): void {
        this.creditRankForm = this._formBuilder.group({
            fsConfCreditId: new FormControl(data ? data.fsConfCreditId : null),
            creditCode: new FormControl(data ? data.creditCode : null, [Validators.required, Validators.maxLength(10)]),
            minValue: new FormControl(data ? data.minValue : null, [Validators.required, Validators.min(1), Validators.maxLength(15)]),
            maxValue: new FormControl(data ? data.maxValue : null, [Validators.required, Validators.min(1), Validators.maxLength(15)]),
            type: new FormControl(data ? data.type : 0, [Validators.required]),
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
        this.creditRankForm.get('minValue').valueChanges.subscribe(value => {
            if (!this.creditRankForm.get('minValue').errors) {
                if (value == this.creditRankForm.get('maxValue').value) {
                    this.creditRankForm.get('minValue').setErrors({duplicate: true});
                } else {
                    this.creditRankForm.get('minValue').setErrors(null);
                }
            }
        })
        this.creditRankForm.get('maxValue').valueChanges.subscribe(value => {
            if (!this.creditRankForm.get('maxValue').errors) {
                if (value == this.creditRankForm.get('minValue').value) {
                    this.creditRankForm.get('maxValue').setErrors({duplicate: true});
                } else {
                    this.creditRankForm.get('maxValue').setErrors(null);
                }
            }
        })
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
        request = this.creditRankForm.value;

        return request;
    }

    private updateData(request: FsConfCreditDTO): void {
        this._configService.update(request).subscribe((response) => {
            if (response.errorCode === '0') {
                this.creditRankForm.reset();
                this._configService.doSearch().subscribe();
                this.matDialogRef.close(true);
                this._fuseAlertService.showMessageSuccess('Cập nhật thành công');
            } else {
                this._fuseAlertService.showMessageError(response.message.toString());
            }
        });
    }

    private createData(request: FsConfCreditDTO, isClose: boolean = false): void {
        this._configService.create(request).subscribe((response) => {
            if (response.errorCode === '0') {
                this.creditRankForm.reset();
                this._configService.doSearch().subscribe();
                this._fuseAlertService.showMessageSuccess('SPTD084');
                if (isClose) {
                    this.matDialogRef.close(true);
                }else {
                    this.initForm();
                }
            } else {
                this._fuseAlertService.showMessageError(response.message.toString());
            }
        });
    }
}
