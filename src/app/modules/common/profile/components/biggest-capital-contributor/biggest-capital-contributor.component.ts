import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ProfileService} from '../../../../../service/common-service';
import {map, Subscription, tap} from 'rxjs';
import {AdmCategoriesDTO, AdmDeputyContactDTO} from '../../../../../models/admin';
import _ from 'lodash';
import {AccountModel} from '../../../../../models/service/FsAccountBankDTO.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APP_TEXT} from '../../../../../shared/constants';
import {AddressKycDialogComponent} from '../../../../../shared/components/dialog/address-dialog/address-dialog.component';
import {IAddressData} from '../../../../../shared/models/address.model';
import {MatDialog} from '@angular/material/dialog';
import moment from 'moment';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {DeputyType} from '../../../../../enum';
import {forbiddenPhoneNumberValidator} from "../../../../../shared/validator/forbidden";

@Component({
    selector: 'biggest-capital-contributor',
    templateUrl: './biggest-capital-contributor.component.html'
})
export class BiggestCapitalContributorComponent implements OnInit, OnDestroy, AfterViewInit {
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
                    if ( acc && acc.capitalContributors ) {
                        // Filter contact to get type = 2 and sort by alphabet
                        acc.capitalContributors = _.filter(acc.capitalContributors, ['type', DeputyType.CAPITAL_CONTRIBUTOR]);
                        acc.capitalContributors = _.sortBy(acc.capitalContributors,c => c.fullName.toLowerCase());
                        this.contactInfoData = acc.capitalContributors;
                        this.fixedContactInfoData = acc.capitalContributors;
                        this.contactSelected = acc.capitalContributors[0];
                    }
                    this.genders = [...acc.sex];
                })
            ).subscribe()
        );
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Người góp vốn lớn nhất')
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    searchContact(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        if ( this.fixedContactInfoData ) {
            if ( value ) {
                this.contactInfoData = this.fixedContactInfoData.filter(
                    c => c.fullName.toLowerCase().includes(value.toLowerCase().trim())
                );
            }
            else {
                this.contactInfoData = [...this.fixedContactInfoData];
            }
        }
    }

    initFormToEditing(title: string, contact?: AdmDeputyContactDTO): void {
        if ( !contact ) {
            this.contactSelected = null;
        }
        this.isEditing = true;
        this.titleEditing = title;
        this.contactForm = this._fb.group({
            type: DeputyType.CAPITAL_CONTRIBUTOR,
            admDeputyContactId: contact?.admDeputyContactId || null,
            fullName: this._fb.control(contact?.fullName || '', Validators.required),
            dateOfBirth: this._fb.control(contact?.dateOfBirth ? new Date(contact?.dateOfBirth) : '', Validators.required),
            gender: this._fb.control(Number(contact?.gender) || '', Validators.required),
            identification: this._fb.control(contact?.identification || '', Validators.required),
            mobile: this._fb.control(contact?.mobile || '', [Validators.required,  forbiddenPhoneNumberValidator()]),
            email: this._fb.control(contact?.email || '', [Validators.required, Validators.email]),
            address2: this._fb.control(contact?.address2 || '', Validators.required),
            positionCompany: this._fb.control(contact?.positionCompany || '', Validators.required)
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
        this.contactSelected = this.contactSelected ? this.contactSelected : this.contactInfoData?.[0];
        this.contactForm.reset();
    }

    isRequiredFormControl(formControlName: string): boolean {
        return this.contactForm?.get(formControlName)?.hasError('required')
            && this.contactForm?.get(formControlName)?.touched;
    }


    public getErrorMobile(): string {
        if (this.contactForm.get('mobile')?.hasError('required')) {
            return 'HSVV200';
        }
        if (this.contactForm.get('mobile')?.hasError('forbiddenPhoneNumber')) {
            return 'HSVV199';
        }
    }
}
