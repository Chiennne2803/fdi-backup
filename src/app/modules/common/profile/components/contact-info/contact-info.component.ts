import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ProfileService} from '../../../../../service/common-service';
import {map, Observable, Subscription, tap} from 'rxjs';
import {AdmCategoriesDTO, AdmDeputyContactDTO} from '../../../../../models/admin';
import _ from 'lodash';
import {AccountModel} from '../../../../../models/service/FsAccountBankDTO.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APP_TEXT} from '../../../../../shared/constants';
import {FuseConfirmationConfig, FuseConfirmationService} from '../../../../../../@fuse/services/confirmation';
import {
    AddressKycDialogComponent
} from '../../../../../shared/components/dialog/address-dialog/address-dialog.component';
import {IAddressData} from '../../../../../shared/models/address.model';
import {MatDialog} from '@angular/material/dialog';
import moment from 'moment';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {DeputyType} from '../../../../../enum';
import {forbiddenPhoneNumberValidator} from "../../../../../shared/validator/forbidden";

@Component({
    selector: 'profile-contact-info',
    templateUrl: './contact-info.component.html'
})
export class ContactInfoComponent implements OnInit, OnDestroy, AfterViewInit {
    contactForm: FormGroup;
    titleEditing: string = '';
    contactInfoData: AdmDeputyContactDTO[];
    fixedContactInfoData: AdmDeputyContactDTO[];
    contactSelected: AdmDeputyContactDTO;
    isEditing: boolean = false;
    message = APP_TEXT;
    genders: AdmCategoriesDTO[];
    yesterday = moment().subtract(1, 'days');
    yearLate = moment().subtract(216, 'months');
    subscription: Subscription = new Subscription();
    listJob: AdmCategoriesDTO[] = [];

    constructor(
        private _profileService: ProfileService,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this.subscription.add(
            this._profileService.profilePrepare$.pipe(
                map(res => _.cloneDeep(res)),
                tap((acc: AccountModel) => {
                    if ( acc && acc.contact ) {
                        // Filter contact to get type = 2 and sort by alphabet
                        acc.contact = _.filter(acc.contact, ['type', 2]);
                        acc.contact = _.sortBy(acc.contact,c => c.fullName.toLowerCase());
                        this.contactInfoData = acc.contact;
                        this.fixedContactInfoData = acc.contact;
                        this.contactSelected = acc.contact[0];
                    }
                    // Map object to get info of genders
                    this.genders = acc.sex.map(el => ({
                        admCategoriesId: el.admCategoriesId,
                        categoriesName: el.categoriesName
                    }));
                    this.listJob = acc.jobCode;
                })
            ).subscribe()
        );
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Thông tin người liên hệ')
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    searchContact(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        if ( value ) {
            this.contactInfoData = this.fixedContactInfoData.filter(
                c => c.fullName.toLowerCase().includes(value.toLowerCase().trim())
            );
        }
        else {
            this.contactInfoData = [...this.fixedContactInfoData];
        }
    }

    initFormToEditing(title: string, contact?: AdmDeputyContactDTO): void {
        if ( !contact ) {
            this.contactSelected = null;
        }
        this.isEditing = true;
        this.titleEditing = title;
        this.contactForm = this._fb.group({
            type: DeputyType.CONTACT,
            admDeputyContactId: contact?.admDeputyContactId || null,
            fullName: this._fb.control(contact?.fullName || '', [Validators.required, Validators.maxLength(50)]),
            referenContact: this._fb.control(contact?.referenContact || '', [Validators.required, Validators.maxLength(50)]),
            dateOfBirth: this._fb.control(contact?.dateOfBirth ? new Date(contact?.dateOfBirth) : '', Validators.required),
            gender: this._fb.control(Number(contact?.gender) || '', Validators.required),
            identification: this._fb.control(contact?.identification || '', [Validators.required, Validators.maxLength(12)]),
            idDate: this._fb.control(contact?.idDate ? new Date(contact?.idDate) : '', Validators.required),
            idAddress: this._fb.control(contact?.idAddress || '', [Validators.required, Validators.maxLength(100)]),
            mobile: this._fb.control(contact?.mobile || '', [Validators.required, Validators.minLength(10), Validators.maxLength(11), forbiddenPhoneNumberValidator()]),
            email: this._fb.control(contact?.email || '', [Validators.required, Validators.email, Validators.maxLength(100)]),
            job: this._fb.control(contact?.job || '', Validators.required),
            jobAddress: this._fb.control(contact?.jobAddress || '', [Validators.maxLength(100)]),
            facebook: this._fb.control(contact?.facebook || '', [Validators.maxLength(100)]),
            address1: this._fb.control(contact?.address1 || '', Validators.required),
            address2: this._fb.control(contact?.address2 || '', Validators.required),
        });
    }

    onSubmit(): void {
        this.contactForm.markAllAsTouched();
        if ( this.contactForm.valid ) {
            const dialogSubmit = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            dialogSubmit.afterClosed().subscribe((action) => {
                if ( action === 'confirmed' ) {
                    this._profileService.updateDeputyContact({
                        ...this.contactForm.value,
                        dateOfBirth: new Date(this.contactForm.get('dateOfBirth').value).getTime(),
                        idDate: new Date(this.contactForm.get('idDate').value).getTime(),
                    }).subscribe(
                        (response) => {
                            if ( response.errorCode === '0' ) {
                                this._fuseAlertService.showMessageSuccess('Dữ liệu đã được lưu thành công');
                                this._profileService.getPrepareLoadingPage().subscribe(() => this.backToViewOnly());
                            }
                            else {
                                this._fuseAlertService.showMessageError(response.message.toString());
                            }
                        }
                    );
                }
            });
        }
    }

    openAddressDialog(formControlName: string): void {
        const dialogRef = this._matDialog.open(AddressKycDialogComponent, {
            disableClose: true,
            width: '450px',
            data: this.contactForm.get(formControlName).value,
        });
        dialogRef.afterClosed().subscribe((res: IAddressData) => {
            if (res && res.payload) {
                this.contactForm.get(formControlName).patchValue(res.payload);
                this.contactForm.markAsDirty();
            }
        });
    }

    cancelEditing(): void {
        if ( this.contactForm.dirty ) {
            const dialog = this._dialogService.openConfirmDialog('Dữ liệu thao tác trên màn hình sẽ bị mất, xác nhận thực hiện');
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this.backToViewOnly();
                }
            });
        } else {
            this.backToViewOnly();
        }
    }

    viewDetail(contact: AdmDeputyContactDTO): void {
        this.contactSelected = contact;
        this.isEditing = false;
    }

    backToViewOnly(): void {
        this.isEditing = false;
        this.titleEditing = '';
        this.contactSelected = this.contactSelected ? this.contactSelected : this.contactInfoData[0];
        this.contactForm.reset();
    }

}
