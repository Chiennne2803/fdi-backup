import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {FuseConfirmationConfig} from '@fuse/services/confirmation/confirmation.types';
import {FuseConfirmationDialogComponent} from '@fuse/services/confirmation/dialog/dialog.component';
import {AuthService} from 'app/core/auth/auth.service';
import {AdmCategoriesDTO} from 'app/models/admin';
import {CategoriesService} from 'app/service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {APP_TEXT} from 'app/shared/constants';
import {ISelectModel} from 'app/shared/models/select.model';

@Component({
    selector: 'app-parent-category-dialog',
    templateUrl: './parent-category-dialog.component.html',
    styleUrls: ['./parent-category-dialog.component.scss'],
    providers: [DateTimeformatPipe]
})
export class ParentCategoryDialogComponent implements OnInit {
    public parentCategoryForm: FormGroup = new FormGroup({});
    public status: Array<ISelectModel> = [
        { id: 1, label: 'Hoạt động' },
        { id: 2, label: 'Không hoạt động' }
    ];
    public detail: AdmCategoriesDTO = new AdmCategoriesDTO();
    public isUpdate: boolean = true;

    constructor(
        private matDialogRef: MatDialogRef<ParentCategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: AdmCategoriesDTO,
        private _categoryService: CategoriesService,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
        private _cdf: ChangeDetectorRef,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) {
        if (data && data.admCategoriesId > 0) {
            this.isUpdate = true;
        } else {
            this.isUpdate = false;
        }
    }

    ngOnInit(): void {
        this.initForm(this.data);
        this.initData();
    }

    discard(): void {
        if (this.parentCategoryForm.dirty) {
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
        this.parentCategoryForm.markAllAsTouched();
        if (this.parentCategoryForm.dirty) {
            const dialog = this.openDialogConfirm();
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed' && this.parentCategoryForm.valid) {
                    if (this.saveData()) {
                        this.matDialogRef.close(true);
                    }
                }
            });
            return;
        } else {
            this._fuseAlertService.showMessageWarning("Không có thay đổi");
        }
    }

    submitAndReset(): void {
        if (this.parentCategoryForm.dirty) {
            const dialog = this.openDialogConfirm();
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed' && this.parentCategoryForm.valid) {
                    if (this.saveData()) {
                        this.parentCategoryForm.reset();
                    }
                }
            });
            return;
        } else {
            this._fuseAlertService.showMessageWarning("Không có thay đổi");
        }
    }

    private initForm(data?: AdmCategoriesDTO): void {
        this.parentCategoryForm = this._formBuilder.group({
            admCategoriesId: new FormControl(data ? data.admCategoriesId : null),
            categoriesCode: new FormControl(data ? data.categoriesCode : null, [
                Validators.required,
                Validators.maxLength(50),
                Validators.pattern("[a-zA-Z0-9_]*")]),
            categoriesName: new FormControl(data ? data.categoriesName : null, [Validators.required, Validators.maxLength(50)]),
            status: new FormControl({value: data ? data.status : 1, disabled: true}, [Validators.required]),
            value: new FormControl(data ? data.value : null, [Validators.required, Validators.maxLength(50)]),
            info: new FormControl(data ? data.info : null, [Validators.maxLength(250)]),

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

    private initData(): void {
        if (this.data) {
            this.initForm(this.data);
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

    private saveData(): Boolean {
        const request = this.parentCategoryForm.value;
        request.status = 1;
        if (this.data) {
            this._categoryService.updateParrent(request).subscribe((result) => {
                if (result.errorCode === '0') {
                    this.matDialogRef.close(true);
                    this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                    return true;
                } else {
                    this._fuseAlertService.showMessageError(result.message);
                }
            });
        } else {
           /* this._categoryService.create(request).subscribe((result) => {
                if (result.errorCode === '0') {
                    this.matDialogRef.close(true);
                    this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                    return true;
                } else {
                    this._fuseAlertService.showMessageError(result.message);
                }
            });*/
        }
        return false;
    }
}
