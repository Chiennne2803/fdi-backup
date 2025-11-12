import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FileService, ProfileService } from '../../../../../service/common-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../../../../service/common-service/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '../../../../../../@fuse/components/alert';
import { APP_TEXT } from '../../../../../shared/constants';
import { AdmAccountDetailDTO, AdmCategoriesDTO, FsDocuments } from '../../../../../models/admin';
import { Subscription, tap } from 'rxjs';
import { AddressKycDialogComponent } from '../../../../../shared/components/dialog/address-dialog/address-dialog.component';
import { IAddressData } from '../../../../../shared/models/address.model';
import { AdmAccountType } from '../../../../../core/user/user.types';
import { AuthService } from "../../../../../core/auth/auth.service";
import { MatDrawer } from "@angular/material/sidenav";

@Component({
    selector: 'profile-detail-company',
    templateUrl: './profile-detail-company.component.html'
})
export class ProfileDetailCompanyComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('fileDrawer', { static: true }) fileDrawer: MatDrawer;
    accountDetail: AdmAccountDetailDTO;
    accountType: AdmAccountType;
    formGroup: FormGroup;
    lvhdCodeList: AdmCategoriesDTO[];
    lvhdCodeListFilter: AdmCategoriesDTO[];
    message = APP_TEXT;
    subscription: Subscription = new Subscription();
    isEditable: boolean = false;
    oldAvata = '';
    selectedFile: FsDocuments;
    addressModes: 'new' | 'old';


    constructor(
        private _profileService: ProfileService,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        public authService: AuthService,
        private _fileService: FileService
    ) { }

    ngOnInit(): void {
        this.subscription.add(
            this._profileService.profilePrepare$.pipe(
                tap((res) => {
                    this.accountType = res.accountBank.accType;
                    this.accountDetail = res.accountDetail;
                    this.lvhdCodeList = res.lvhdCode;
                    this.lvhdCodeListFilter = this.lvhdCodeList;
                    this.initForm();
                })
            ).subscribe()
        );
        this.initForm();
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Thông tin chi tiết')
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.oldAvata = this.accountDetail?.avatar || '';
        this.formGroup = this._fb.group({
            admAccountDetailId: this.accountDetail.admAccountDetailId,
            fullName: this._fb.control({
                value: this.accountDetail?.fullName,
                disabled: true,
            }, Validators.required),
            businessLicense: this._fb.control({
                value: this.accountDetail?.businessLicense,
                disabled: true,
            }),
            businessLicenseDate: this._fb.control({
                value: this.accountDetail?.businessLicenseDate
                    ? new Date(this.accountDetail?.businessLicenseDate)
                    : null,
                disabled: true,
            }),
            placeOfBusinessLicense: this._fb.control({
                value: this.accountDetail?.placeOfBusinessLicense,
                disabled: true,
            }),
            businessCode: this._fb.control({
                value: this.accountDetail?.businessCode,
                disabled: true,
            }, Validators.required),
            landline: this._fb.control({
                value: this.accountDetail?.landline,
                disabled: true,
            }),
            facebook: this._fb.control({
                value: this.accountDetail?.facebook,
                disabled: true,
            }),
            admCategoriesId: this._fb.control({
                value: this.accountDetail?.admCategoriesId,
                disabled: true,
            }, Validators.required),
            website: this._fb.control({
                value: this.accountDetail?.website,
                disabled: true,
            }),
            address3: this._fb.control({
                value: this.accountDetail?.address3,
                disabled: true,
            }),
            address2: this._fb.control({
                value: this.accountDetail?.address2,
                disabled: true,
            }, Validators.required),
            avatar: this.accountDetail?.avatar || ''
        });
    }

    openAddressDialog(formControlName: string): void {
        const type = this.addressModes || 'old';

        const dialogRef = this._matDialog.open(AddressKycDialogComponent, {
            disableClose: true,
            width: '450px',
            data: {
                type,
                value: this.formGroup.get(formControlName).value
            },
        });
        dialogRef.afterClosed().subscribe((res: IAddressData) => {
            if (res && res.payload && res.type) {
                this.addressModes = res.type
                this.formGroup.get(formControlName).patchValue(res.payload);
                this.formGroup.markAsDirty();
            }
        });
    }

    isEditing(): void {
        this.isEditable = true;
        this.changeStateControl();
    }

    cancelEditing(): void {
        if (this.formGroup.dirty) {
            const dialog = this._dialogService.openConfirmDialog('Dữ liệu đang nhập sẽ bị mất');
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this.isEditable = false;
                    this.changeStateControl();
                }
            });
        } else {
            this.isEditable = false;
            this.changeStateControl();
        }
    }

    saveData(): void {
        if (!this.formGroup.dirty && (this.oldAvata == this.formGroup.value?.avatar)) {
            this._fuseAlertService.showMessageWarning("Không có thay đổi");
            return;
        }
        this.formGroup.markAllAsTouched();
        if (this.formGroup.valid) {
            const dialog = this._dialogService.openConfirmDialog('Xác nhận cập nhật dữ liệu');
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this._profileService.updateAccountDetail(this.formGroup.value).subscribe((response) => {
                        if (response.errorCode === '0') {
                            // console.log(response, this.formGroup.value)
                            this._fuseAlertService.showMessageSuccess('Cập nhật thành công !');
                            this._profileService.getPrepareLoadingPage().subscribe();
                            this.isEditable = false;
                            this.changeStateControl();
                            this.authService.afterUpdateAccountDetail(response.payload);
                        }
                        else {
                            this._fuseAlertService.showMessageError(response.message.toString());
                        }
                    });
                }
            });
        }
    }

    changeStateControl(): void {
        if (!this.isEditable) {
            this.formGroup.get('landline').disable();
            this.formGroup.get('facebook').disable();
            this.formGroup.get('admCategoriesId').disable();
            this.formGroup.get('website').disable();
            this.formGroup.get('address2').disable();
        }
        else {
            this.formGroup.get('landline').enable();
            this.formGroup.get('facebook').enable();
            this.formGroup.get('admCategoriesId').enable();
            this.formGroup.get('website').enable();
            this.formGroup.get('address2').enable();
        }
    }

    isInvalidForm(control: string): boolean {
        return this.formGroup.get(control).touched && this.formGroup.get(control).hasError('required');
    }

    public onKey(target): void {
        if (target.value) {
            this.lvhdCodeListFilter = this.search(target.value);
        } else {
            this.lvhdCodeListFilter = this.lvhdCodeList;
        }
    }

    public search(value: string): any {
        return this.lvhdCodeList.filter(option => option.categoriesName.toLowerCase().includes(value.toLowerCase()));
    }

    clickViewImage(id: string): void {
        this._fileService
            .getDetailFiles(id)
            .subscribe((res) => {
                if (res != undefined && res.payload != undefined) {
                    this.selectedFile = res.payload[0];
                    this.fileDrawer.open();
                    if (['JPG', 'JPEG', 'PNG'].includes(this.selectedFile.type.toUpperCase())) {
                        this._fileService.getFileFromServer(this.selectedFile.finDocumentsId + '').subscribe(
                            res => this.selectedFile = res.payload
                        );
                    }
                }
            });
    }
}
