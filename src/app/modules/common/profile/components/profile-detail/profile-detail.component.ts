import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatSelectChange} from '@angular/material/select';
import * as moment from 'moment';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {AdmAccountDetailDTO} from 'app/models/admin/AdmAccountDetailDTO.model';
import {ProfileService} from 'app/service/common-service/profile.service';
import {ISelectModel} from 'app/shared/models/select.model';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {DialogService} from 'app/service/common-service/dialog.service';
import {AdmCategoriesDTO, FsDocuments} from 'app/models/admin';
import {AddressKycDialogComponent} from 'app/shared/components/dialog/address-dialog/address-dialog.component';
import {IAddressData} from 'app/shared/models/address.model';
import {AuthService} from '../../../../../core/auth/auth.service';
import {AdmAccountType} from '../../../../../core/user/user.types';
import {MatDrawer} from "@angular/material/sidenav";
import {FileService} from "../../../../../service/common-service";
@Component({
    selector: 'profile-detail',
    templateUrl: './profile-detail.component.html',
    animations: fuseAnimations
})
export class ProfileDetailComponent implements OnInit, AfterViewInit {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    accountDetail: AdmAccountDetailDTO;
    isEditable: boolean = false;
    accountDetailForm: FormGroup = new FormGroup({});
    genders: Array<ISelectModel> = [];
    yesterday = moment().subtract(216, 'months');
    listJob: AdmCategoriesDTO[] = [];
    marriageList: AdmCategoriesDTO[] = [];
    oldAvata  = '';
    selectedFile: FsDocuments;
    constructor(
        private _profileService: ProfileService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _dialogService: DialogService,
        public authService: AuthService,
        private _fileService: FileService
    ) { }

    ngOnInit(): void {
        this._profileService.profilePrepare$.subscribe((res) => {
            this.accountDetail = res.accountDetail;
            this.listJob = res.jobCode;
            this.marriageList = res.marriageCode;
            this.genders = res.sex.map(el => ({
                id: el.admCategoriesId,
                label: el.categoriesName
            }));
        });
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Thông tin chi tiết')
        );
    }

    edit(): void {
        this.isEditable = true;
        this.initForm(this.accountDetail);
    }

    changeGender(event: MatSelectChange): void {
        const genderId = event.value;
        const genderSelect = this.genders.filter(item => item.id === genderId);
        this.accountDetailForm.controls['genderName'].setValue(genderSelect[0].label);
    }

    update(): void {
        if ((!this.accountDetailForm.dirty) && (this.oldAvata == this.accountDetailForm.value?.avatar)) {
            this._fuseAlertService.showMessageWarning("Không có thay đổi");
            return;
        }
        this.accountDetailForm.markAllAsTouched();
        if (this.accountDetailForm.valid) {
            const payload = {
                ...this.accountDetailForm.value,
                type: this.accountDetail.type,
                admAccountDetailId: this.accountDetail.admAccountDetailId,
                dateOfIdnumber: new Date(this.accountDetailForm.value.dateOfIdnumber).getTime(),
                dateOfBirth: new Date(this.accountDetailForm.value.dateOfBirth).getTime(),
            };
            const cfDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            cfDialog.afterClosed().subscribe(
                (res) => {
                    if ( res === 'confirmed' ) {
                        this._profileService.updateAccountDetail(payload).subscribe((response) => {
                            if (response.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Cập nhật thành công');
                                this._profileService.getPrepareLoadingPage().subscribe(() => {
                                    this.isEditable = false;
                                });
                                this.authService.afterUpdateAccountDetail(response.payload);
                            } else {
                                this._fuseAlertService.showMessageError(response.message.toString());
                            }
                        });
                    }
                }
            );
        }
    }

    cancel(): void {
        if (this.accountDetailForm.dirty) {
            const dialog = this._dialogService.openConfirmDialog('Dữ liệu thao tác trên màn hình sẽ bị mất, xác nhận thực hiện');
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this.isEditable = false;
                }
            });
        } else {
            this.isEditable = false;
        }
    }

    initForm(data?: AdmAccountDetailDTO): void {
        this.oldAvata = data?.avatar || '';
        this.accountDetailForm = this._formBuilder.group({
            avatar: data?.avatar || '',
            fullName: this._formBuilder.control({
                value: data ? data.fullName : null,
                disabled: true
            }),
            mobile: this._formBuilder.control({
                value: data ? data.mobile : null,
                disabled: true
            }, Validators.required),
            email: this._formBuilder.control({
                value: data ? data.email : null,
                disabled: true
            }, [Validators.required, Validators.email]),
            identification: this._formBuilder.control({
                value: data ? data.identification : null,
                disabled: true
            }),
            dateOfIdnumber: this._formBuilder.control({
                value: data ? new Date(data.dateOfIdnumber) : null,
                disabled: true
            }),
            placeOfIdnumber: this._formBuilder.control({
                value: data ? data.placeOfIdnumber : null,
                disabled: true
            }),
            genderName: this._formBuilder.control(data ? data.genderName : null),
            gender: this._formBuilder.control(data ? data.gender : null, [Validators.required]),
            dateOfBirth: this._formBuilder.control(data ? new Date(data.dateOfBirth) : null, Validators.required),
            taxCode: this._formBuilder.control(data ? data.taxCode : null),
            address1: this._formBuilder.control({
                value: data ? data.address1 : null,
                disabled: true,
            }),
            address2: this._formBuilder.control(data ? data.address2 : null, [Validators.required])
        });

        if ( this.authService.authenticatedUser.accountType === AdmAccountType.BORROWER ) {
            this.accountDetailForm.addControl(
                'marital',
                this._formBuilder.control(
                    data ? data.marital : null,
                    Validators.required
                )
            );
            this.accountDetailForm.addControl(
                'job',
                this._formBuilder.control(
                    data ? data.job : null,
                    Validators.required
                )
            );
            this.accountDetailForm.addControl(
                'jobAddress',
                this._formBuilder.control(data ? data.jobAddress : null)
            );
            this.accountDetailForm.addControl(
                'facebook',
                this._formBuilder.control(data ? data.facebook : null)
            );
        }
    }

    openAddressDialog(): void {
        const dialogRef = this._matDialog.open(AddressKycDialogComponent, {
            disableClose: true,
            width: '450px',
            data: this.accountDetailForm.get('address2').value,
        });
        dialogRef.afterClosed().subscribe((res: IAddressData) => {
            if (res && res.payload) {
                this.accountDetailForm.get('address2').patchValue(res.payload);
                this.accountDetailForm.markAsDirty();
            }
        });
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
