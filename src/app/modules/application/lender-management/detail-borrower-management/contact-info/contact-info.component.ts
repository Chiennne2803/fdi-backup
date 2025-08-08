import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProfileService} from '../../../../../service/common-service';
import {Subscription} from 'rxjs';
import {AdmAccountDetailDTO, AdmCategoriesDTO, AdmDeputyContactDTO} from '../../../../../models/admin';
import _ from 'lodash';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APP_TEXT} from '../../../../../shared/constants';
import {
    AddressKycDialogComponent
} from '../../../../../shared/components/dialog/address-dialog/address-dialog.component';
import {IAddressData} from '../../../../../shared/models/address.model';
import {MatDialog} from '@angular/material/dialog';
import moment from 'moment';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {DeputyType} from '../../../../../enum';
import {ManagementLenderService} from '../../../../../service';

@Component({
    selector: 'admin-lender-contact-info',
    templateUrl: './contact-info.component.html'
})
export class ContactInfoComponent implements OnChanges,OnInit {
    @Input() contact: AdmDeputyContactDTO[];
    @Input() contactType: DeputyType = DeputyType.CONTACT;
    @Input() detailLender: AdmAccountDetailDTO;
    @Input() allowAdd: Boolean = true;
    @Input() allowUpdate: Boolean = true;

    public deputyType = DeputyType;
    contactForm: FormGroup;
    titleEditing: string = '';
    contactInfoData: AdmDeputyContactDTO[];
    fixedContactInfoData: AdmDeputyContactDTO[];
    contactSelected: AdmDeputyContactDTO;
    isEditing: boolean = false;
    message = APP_TEXT;
    genders: AdmCategoriesDTO[];
    yesterday = moment().subtract(1, 'days');
    subscription: Subscription = new Subscription();

    constructor(
        private _profileService: ProfileService,
        private _managementLenderService: ManagementLenderService,
        private _fb: FormBuilder,
        private _dialogService: DialogService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
    ) {
    }

    ngOnInit(): void {
        if (this.contact) {
            this.contact = _.filter(this.contact, ['type', this.contactType]);
            this.contact = _.sortBy(this.contact, c => c.fullName.toLowerCase());
            this.contactInfoData = this.contact;
            this.fixedContactInfoData = this.contact;
            this.contactSelected = this.contact[0];
        }
        this._managementLenderService._prepareLender.subscribe((res) => {
            this.genders = res.sexCode.map(el => ({
                admCategoriesId: el.admCategoriesId,
                categoriesName: el.categoriesName
            }));
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.contact) {
            this.contact = changes['contact'].currentValue;
            this.contact = _.filter(this.contact, ['type', this.contactType]);
            this.contact = _.sortBy(this.contact, c => c?.fullName?.toLowerCase());
            this.contactInfoData = this.contact;
            this.fixedContactInfoData = this.contact;
            this.contactSelected = this.contact[0];
        }
    }

    searchContact(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        if (value) {
            this.contactInfoData = this.fixedContactInfoData.filter(
                c => c.fullName.toLowerCase().includes(value.toLowerCase().trim())
            );
        } else {
            this.contactInfoData = [...this.fixedContactInfoData];
        }
    }

    initFormToEditing(title: string, contact?: AdmDeputyContactDTO): void {
        if (!contact) {
            this.contactSelected = null;
        }
        this.isEditing = true;
        this.titleEditing = title;
        this.contactForm = this._fb.group({
            type: this.contactType,
            admDeputyContactId: contact?.admDeputyContactId || null,
            fullName: this._fb.control(contact?.fullName || '', Validators.required),
            referenContact: this._fb.control(contact?.referenContact || '', Validators.required),
            dateOfBirth: this._fb.control(contact?.dateOfBirth ? new Date(contact?.dateOfBirth) : '', Validators.required),
            gender: this._fb.control(Number(contact?.gender) || '', Validators.required),
            identification: this._fb.control(contact?.identification || '', Validators.required),
            idDate: this._fb.control(contact?.idDate ? new Date(contact?.idDate) : '', Validators.required),
            idAddress: this._fb.control(contact?.idAddress || '', Validators.required),
            mobile: this._fb.control(contact?.mobile || '', Validators.required),
            email: this._fb.control(contact?.email || '', [Validators.required, Validators.email]),
            job: this._fb.control(contact?.job || '', Validators.required),
            jobAddress: this._fb.control(contact?.jobAddress || ''),
            facebook: this._fb.control(contact?.facebook || ''),
            address1: this._fb.control(contact?.address1 || '', Validators.required),
            address2: this._fb.control(contact?.address2 || '', Validators.required),
        });
    }

    onSubmit(): void {
        this.contactForm.markAllAsTouched();
        if (this.contactForm.valid) {
            const dialogSubmit = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            dialogSubmit.afterClosed().subscribe((action) => {
                if (action === 'confirmed') {
                    this._managementLenderService.updateDeputyContact({
                        ...this.contactForm.value,
                        admAccountId: this.detailLender.admAccountDetailId,
                        dateOfBirth: new Date(this.contactForm.get('dateOfBirth').value).getTime(),
                        idDate: new Date(this.contactForm.get('idDate').value).getTime(),
                    }).subscribe(
                        (response) => {
                            if (response.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Dữ liệu đã được lưu thành công');
                                this._managementLenderService.getDetail({admAccountDetailId: this.detailLender.admAccountDetailId}).subscribe(() => this.backToViewOnly());
                            } else {
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
        if (this.contactForm.dirty) {
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

    isRequiredFormControl(formControlName: string): boolean {
        return this.contactForm?.get(formControlName)?.hasError('required')
            && this.contactForm?.get(formControlName)?.touched;
    }
}
