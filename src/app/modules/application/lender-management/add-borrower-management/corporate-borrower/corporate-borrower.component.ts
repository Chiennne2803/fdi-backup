import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'app/core/auth/auth.service';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { ISelectModel } from 'app/shared/models/select.model';
import {ManagementLenderService} from '../../../../../service';
import {
    forbiddenPasswordValidator,
    forbiddenPhoneNumberValidator,
    forbiddenUserNameValidator
} from '../../../../../shared/validator/forbidden';
import {AdmAccountDetailDTO} from "../../../../../models/admin";
import { AddressKycDialogComponent } from 'app/shared/components/dialog/address-dialog/address-dialog.component';

@Component({
    selector: 'app-corporate-borrower',
    templateUrl: './corporate-borrower.component.html',
    styleUrls: ['./corporate-borrower.component.scss'],
})
export class CorporateBorrowerComponent implements OnInit {
    public businessForm: FormGroup = new FormGroup({});
    public genders: Array<ISelectModel> = [];
    public businessAreas: Array<ISelectModel> = [];
    public businessAreasFilter: Array<ISelectModel> = [];
    public lstManagerStaff: AdmAccountDetailDTO[];
    addressModes: { [key: string]: 'new' | 'old' } = {};

    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _borrowerService: ManagementLenderService,
        private _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this._borrowerService._prepareLender.subscribe((res) => {
            this.genders = res.sexCode.map(el => ({
                id: el.admCategoriesId,
                label: el.categoriesName
            }));
            this.businessAreas = res.lvhdCode.map(el => ({
                id: el.admCategoriesId.toString(),
                label: el.categoriesName
            }));
            this.businessAreasFilter = this.businessAreas;
            if (res.lstManagerStaff) {
                this.lstManagerStaff = res.lstManagerStaff;
            }
        });
        this.buildBusinessForm();
    }

    public choseAddress(event: string): void {
        const type = this.addressModes[event] || 'old';

        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '450px';
        let dataInit = null;
        switch (event) {
            case 'address1':
                break;
            case 'address2':
                dataInit = this.businessForm.controls.address2.value;
                break;
            case 'address3':
                dataInit = this.businessForm.controls.address3.value;
                break;
            case 'deputy-address1':
                dataInit = this.deputyContactForm.controls.address1.value;
                break;
            case 'deputy-address2':
                dataInit = this.deputyContactForm.controls.address2.value;
                break;
            default:
                break;
        }
        dialogConfig.data = {
            type,
            value: dataInit,
        };
        const dialog = this._matDialog.open(AddressKycDialogComponent, dialogConfig);
        dialog.afterClosed().subscribe((res) => {
            if (res) {
                this.addressModes[event] = res.type;
                switch (event) {
                    case 'address1':
                        // this.businessForm.controls.address1.setValue(res);
                        break;
                    case 'address2':
                        this.businessForm.controls.address2.setValue(res.payload);
                        break;
                    case 'address3':
                        this.businessForm.controls.address3.setValue(res.payload);
                        break;
                    case 'deputy-address1':
                        this.deputyContactForm.controls.address1.setValue(res.payload);
                        break;
                    case 'deputy-address2':
                        this.deputyContactForm.controls.address2.setValue(res.payload);
                        break;
                    default:
                        break;
                }
            }
        });
    }

    public getErrorAccount(): string {
        if (this.businessForm.get('accountName')?.hasError('required')) {
            return 'QLVV012';
        }

        if (this.businessForm.get('accountName')?.hasError('forbiddenUserName') ||
            this.businessForm.get('accountName')?.hasError('minlength') ||
            this.businessForm.get('accountName')?.hasError('maxlength')) {
            return 'QLVV011';
        }
    }
    public getErrorPassword(): string {
        if (this.businessForm.get('passwd')?.hasError('required')) {
            return 'QLVV015';
        }

        if (this.businessForm.get('passwd')?.hasError('forbiddenPassword') ||
            this.businessForm.get('passwd')?.hasError('minlength') ||
            this.businessForm.get('passwd')?.hasError('maxlength')) {
            return 'QLVV014';
        }
    }
    public getErrorMobile(formControlName: string): string {
        if (this.businessForm.get(formControlName)?.hasError('required')) {
            return 'QLDT025';
        }

        if (this.businessForm.get(formControlName)?.hasError('minlength') ||
            this.businessForm.get(formControlName)?.hasError('maxlength') ||
            this.businessForm.get(formControlName)?.hasError('forbiddenPhoneNumber')
        ) {
            return 'QLDT026';
        }
    }
    public getErrorMobileDeputy(): string {
        if (this.deputyContactForm.get('mobile')?.hasError('required')) {
            return 'QLVV107';
        }

        if (this.deputyContactForm.get('mobile')?.hasError('forbiddenPhoneNumber') ||
            this.deputyContactForm.get('mobile')?.hasError('minlength') ||
            this.deputyContactForm.get('mobile')?.hasError('maxlength')) {
            return 'QLVV106';
        }
    }

    get deputyContactForm() : FormGroup {
        return this.businessForm.get("deputyContact") as FormGroup
    }

    private buildBusinessForm(): void {
        this.businessForm = this._formBuilder.group({
            accountName: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50), forbiddenUserNameValidator()]),
            passwd: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50), forbiddenPasswordValidator()]),
            mobile: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(11), forbiddenPhoneNumberValidator()]),
            email: new FormControl(null, [Validators.required, Validators.email]),
            manageStaff: new FormControl(null, [Validators.required]),

            avatar: new FormControl(null),
            fullName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            businessCode: new FormControl(null, [Validators.required, Validators.maxLength(13)]),
            landline: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(11), forbiddenPhoneNumberValidator()]),
            businessLicense: new FormControl(null, [Validators.required, Validators.maxLength(13)]),
            businessLicenseDate: new FormControl(null, [Validators.required]),
            placeOfBusinessLicense: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            website: new FormControl(null, Validators.maxLength(100)),
            facebook: new FormControl(null, Validators.maxLength(100)),
            address2: new FormControl(null, [Validators.required]),
            address3: new FormControl(null, [Validators.required]),
            photoOfBusiness: new FormControl(null, [Validators.required]),
            admCategoriesId: new FormControl(null, [Validators.required]),

            deputyContact: this._formBuilder.group({
                avatar: new FormControl(null),
                fullName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
                identification: new FormControl(null, [Validators.required, Validators.maxLength(12)]),
                gender: new FormControl(null, [Validators.required]),
                dateOfBirth: new FormControl(null, [Validators.required]),
                taxCode: new FormControl(null, [Validators.maxLength(13)]),
                mobile: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(11), forbiddenPhoneNumberValidator()]),
                positionCompany: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
                email: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.email]),
                facebook: new FormControl(null, Validators.maxLength(100)),

                idDate: new FormControl(null, [Validators.required]),
                idAddress: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
                address1: new FormControl(null, [Validators.required]),
                address2: new FormControl(null, [Validators.required]),
                frontPhotoIdentication: new FormControl(null, [Validators.required]),
                backsitePhotoIdentication: new FormControl(null, [Validators.required]),
            }),

            createdByName: new FormControl({
                value: this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            type: new FormControl(2),
        });
    }

    public onKey(target): void {
        if (target.value) {
            this.businessAreasFilter = this.search(target.value);
        } else {
            this.businessAreasFilter = this.businessAreas;
        }
    }

    public search(value: string): any {
        return this.businessAreas.filter(option => option.label.toLowerCase().includes(value.toLowerCase()));
    }
}
