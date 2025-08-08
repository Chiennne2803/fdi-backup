import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileService, ProfileService} from '../../../../../service/common-service';
import {Subscription} from 'rxjs';
import {AdmCategoriesDTO, AdmDeputyContactDTO, FsDocuments} from '../../../../../models/admin';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AddressKycDialogComponent} from '../../../../../shared/components/dialog/address-dialog/address-dialog.component';
import {IAddressData} from '../../../../../shared/models/address.model';
import {MatDialog} from '@angular/material/dialog';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {DeputyType} from '../../../../../enum';
import {forbiddenPhoneNumberValidator} from "../../../../../shared/validator/forbidden";
import * as moment from "moment";
import {MatDrawer} from "@angular/material/sidenav";

@Component({
    selector: 'profile-representative',
    templateUrl: './representative.component.html'
})
export class RepresentativeComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    representativeDetail: AdmDeputyContactDTO;
    isEditable: boolean = false;
    representativeDetailForm: FormGroup = new FormGroup({});
    genders: AdmCategoriesDTO[];
    subscription: Subscription = new Subscription();
    yesterday = moment().subtract(1, 'days');
    yearLate = moment().subtract(216, 'months');
    oldAvata = '';
    selectedFile: FsDocuments;

    private photoIdentications = {
        frontPhotoIdentication: 'Ảnh CCCD/Hộ Chiếu mặt trước',
        backsitePhotoIdentication: 'Ảnh CCCD/Hộ Chiếu mặt sau'
    }

    constructor(
        private _profileService: ProfileService,
        private _formBuilder: FormBuilder,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _dialogService: DialogService,
        private _fileService: FileService
    ) {
    }

    ngOnInit(): void {
        this.subscription.add(
            this._profileService.profilePrepare$.subscribe((res) => {
                this.representativeDetail = res?.representative;
                this.genders = res.sex;
            })
        );
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Thông tin người đại diện')
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    edit(): void {
        this.isEditable = true;
        this.initForm(this.representativeDetail);
    }

    update(): void {
        if ((!this.representativeDetailForm.dirty) && (this.oldAvata == this.representativeDetailForm.value?.avatar)) {
            this._fuseAlertService.showMessageWarning("Không có thay đổi");
            return;
        }
        this.representativeDetailForm.markAllAsTouched();
        if (this.representativeDetailForm.valid) {
            const payload = {
                ...this.representativeDetailForm.value,
                type: DeputyType.REPRESENTATIVE,
                admDeputyContactId: this.representativeDetail?.admDeputyContactId || null,
                dateOfBirth: new Date(this.representativeDetailForm.value.dateOfBirth).getTime(),
                idDate: new Date(this.representativeDetailForm.value.idDate).getTime(),
            };
            const cfDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            cfDialog.afterClosed().subscribe(
                (res) => {
                    if ( res === 'confirmed' ) {
                        this._profileService.updateDeputyContact(payload).subscribe((response) => {
                            if (response.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Cập nhật thành công');
                                this._profileService.getPrepareLoadingPage().subscribe(() => {
                                    this.isEditable = false;
                                });
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
        if (this.representativeDetailForm.dirty) {
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

    initForm(data?: AdmDeputyContactDTO): void {
        this.oldAvata = data?.avatar || '';
        this.representativeDetailForm = this._formBuilder.group({
            avatar: data?.avatar || '',
            fullName: this._formBuilder.control(data?.fullName || null, [Validators.required, Validators.maxLength(50)]),
            identification: this._formBuilder.control(data?.identification || null, [Validators.required, Validators.maxLength(12)]),
            idDate: this._formBuilder.control(data?.idDate ? new Date(data?.idDate) : null, [Validators.required]),
            idAddress: this._formBuilder.control(data?.idAddress || null, [Validators.required, Validators.maxLength(100)]),
            gender: this._formBuilder.control(data?.gender || null, [Validators.required]),
            dateOfBirth: this._formBuilder.control(data?.dateOfBirth ? new Date(data?.dateOfBirth) : null, [Validators.required]),
            mobile: this._formBuilder.control(data?.mobile || null, [Validators.required,  forbiddenPhoneNumberValidator()]),
            email: this._formBuilder.control(data?.email || null, [Validators.required, Validators.email, Validators.maxLength(100)]),
            taxCode: this._formBuilder.control(data?.taxCode || null),
            address1: this._formBuilder.control(data?.address1 || null, [Validators.required]),
            address2: this._formBuilder.control(data?.address2 || null, [Validators.required]),
            positionCompany: this._formBuilder.control(data?.positionCompany || null, [Validators.required, Validators.maxLength(100)]),
            facebook: this._formBuilder.control(data?.facebook || null, [Validators.maxLength(100)]),
            frontPhotoIdentication: this._formBuilder.control(data?.frontPhotoIdentication || null, [Validators.required]),
            backsitePhotoIdentication: this._formBuilder.control(data?.backsitePhotoIdentication || null, [Validators.required]),
        });
    }

    openAddressDialog(control: string): void {
        const dialogRef = this._matDialog.open(AddressKycDialogComponent, {
            disableClose: true,
            width: '450px',
            data: this.representativeDetailForm.get(control).value,
        });
        dialogRef.afterClosed().subscribe((res: IAddressData) => {
            if (res && res.payload) {
                this.representativeDetailForm.get(control).patchValue(res.payload);
                this.representativeDetailForm.markAsDirty();
            }
        });
    }

    public getErrorMobile(): string {
        if (this.representativeDetailForm.get('mobile')?.hasError('required')) {
            return 'TKDT100';
        }
        if (this.representativeDetailForm.get('mobile')?.hasError('forbiddenPhoneNumber')) {
            return 'TKDT099';
        }
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
