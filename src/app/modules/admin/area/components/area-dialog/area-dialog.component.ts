import {AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {FuseConfirmationDialogComponent} from '@fuse/services/confirmation/dialog/dialog.component';
import {AuthService} from 'app/core/auth/auth.service';
import {AdmCategoriesDTO} from 'app/models/admin';
import {CategoriesService} from 'app/service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {APP_TEXT} from 'app/shared/constants';
import {ISelectModel} from 'app/shared/models/select.model';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {AreaService} from "../../../../../service/admin/area.service";

@Component({
    selector: 'app-category-dialog',
    templateUrl: './area-dialog.component.html',
    styleUrls: ['./area-dialog.component.scss'],
    providers: [DateTimeformatPipe]
})
export class AreaDialogComponent implements OnInit {
    public categoryForm: FormGroup = new FormGroup({});
    public status: Array<ISelectModel> = [
        { id: 1, label: 'Hoạt động' },
        {id: 0, label: 'Không hoạt động'}
    ];
    public isUpdate: boolean = true;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: AdmCategoriesDTO,
        public areaService: AreaService,
        private matDialogRef: MatDialogRef<AreaDialogComponent>,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _formBuilder: FormBuilder,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private _cdf: ChangeDetectorRef,
    ) {
        if (this.data && data.admCategoriesId > 0) {
            this.isUpdate = true;
        } else {
            this.isUpdate = false;
        }
    }

    ngOnInit(): void {
        this.initForm(this.data);
    }

    ngAfterViewChecked(): void {
        this._cdf.detectChanges();
    }

    ngOnDestroy(): void {
    }

    ngAfterViewInit(): void {
    }

    discard(): void {
        if (this.categoryForm.dirty) {
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
        this.categoryForm.markAllAsTouched();
        if (this.categoryForm.valid) {
            const dialog = this.openDialogConfirm();
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed' && this.categoryForm.valid) {
                    const payload = this.categoryForm.value;
                    if (this.isUpdate) {
                        this.areaService.update(payload).subscribe((result) => {
                            if (result.errorCode === '0') {
                                this.matDialogRef.close(true);
                                // this.areaService.doSearch({parentId: payload.parentId}).subscribe();
                                this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                            } else {
                                this._fuseAlertService.showMessageError(result.message.toString());
                            }
                        });
                    } else {
                        this.areaService.create(payload).subscribe((result) => {
                            if (result.errorCode === '0') {
                                this.matDialogRef.close(true);
                                // this.areaService.doSearch({parentId: payload.parentId}).subscribe();
                                this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                            } else {
                                this._fuseAlertService.showMessageError(result.message.toString());
                            }
                        });
                    }
                }
            });
        }
    }

    private initForm(data?: AdmCategoriesDTO): void {
        this.categoryForm = this._formBuilder.group({
            admCategoriesId: new FormControl(data.admCategoriesId ? data.admCategoriesId : null),
            parentId: new FormControl(data.parentId ? data.parentId : null, [Validators.required]),
            categoriesCode: new FormControl(data.categoriesCode ? data.categoriesCode : null, [Validators.required]),
            categoriesName: new FormControl(data.categoriesName ? data.categoriesName : null, [Validators.required, Validators.maxLength(50)]),
            parentCategoriesCode: new FormControl(data.parentCategoriesCode ? data.parentCategoriesCode : null),
            parentCategoriesName: new FormControl(data.parentCategoriesName ? data.parentCategoriesName : null),
            status: new FormControl((data?.status == 0) ? 0 : 1, [Validators.required]),
            value: new FormControl(data.value ? data.value : '', [Validators.required]),
            info: new FormControl(data.info ? data.info : null),

            createdByName: new FormControl({
                value: data.createdByName ? data.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: data.createdDate ? this._datetimePipe.transform(data.createdDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: data.lastUpdatedByName ? data.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: data.lastUpdatedDate ? this._datetimePipe.transform(data.lastUpdatedDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
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
}
