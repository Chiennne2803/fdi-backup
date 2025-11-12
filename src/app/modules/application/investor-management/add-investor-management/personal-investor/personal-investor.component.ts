import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'app/core/auth/auth.service';
import { ManagementInvestorService } from 'app/service/admin/management-investor.service';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { ISelectModel } from 'app/shared/models/select.model';
import {UserType} from '../../../../../enum';
import {
    forbiddenPasswordValidator,
    forbiddenPhoneNumberValidator,
    forbiddenUserNameValidator
} from '../../../../../shared/validator/forbidden';
import {AdmAccountDetailDTO} from "../../../../../models/admin";
import moment from "moment";
import { AddressKycDialogComponent } from 'app/shared/components/dialog/address-dialog/address-dialog.component';

@Component({
    selector: 'app-personal-investor',
    templateUrl: './personal-investor.component.html',
    styleUrls: ['./personal-investor.component.scss'],
    providers: [DateTimeformatPipe]
})
export class PersonalInvestorComponent implements OnInit {
    @ViewChild('address1') public address1: ElementRef<HTMLInputElement>;
    public personForm: FormGroup = new FormGroup({});
    public genders: Array<ISelectModel> = [];
    public businessAreas: Array<ISelectModel> = [];
    public userType = UserType;
    public lstManagerStaff: AdmAccountDetailDTO[];
    yearLate = moment().subtract(216, 'months');
    yesterday = moment().subtract(1, 'days');
    addressModes: { [key: string]: 'new' | 'old' } = {};


    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _investorService: ManagementInvestorService,
        private _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this._investorService._prepareInvestor.subscribe((res) => {
            this.genders = res.sexCode.map(el => ({
                id: el.admCategoriesId,
                label: el.categoriesName
            }));
            this.businessAreas = res.lvhdCode.map(el => ({
                id: el.admCategoriesId.toString(),
                label: el.categoriesName
            }));
            if (res.lstManagerStaff) {
                this.lstManagerStaff = res.lstManagerStaff;
            }
        });
        this.buildPersonalForm();
    }

    public choseAddress(event: string): void {
        const type = this.addressModes[event] || 'old';
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '450px';
        dialogConfig.data = {
            type,
            value: event === 'address1' ? this.personForm.controls.address1.value : this.personForm.controls.address2.value
        };
        const dialog = this._matDialog.open(AddressKycDialogComponent, dialogConfig);
        dialog.afterClosed().subscribe((res) => {
            if (res) {
                this.addressModes[event] = res.type;
                if (event === 'address1') {
                    this.personForm.controls.address1.setValue(res.payload);
                }
                if (event === 'address2') {
                    this.personForm.controls.address2.setValue(res.payload);
                }
            }
        });
    }

    public getErrorAccount(): string {
        if (this.personForm.get('accountName')?.hasError('required')) {
            return 'Dữ liệu chưa được nhập';
        }

        if (this.personForm.get('accountName')?.hasError('forbiddenUserName') ||
            this.personForm.get('accountName')?.hasError('minlength') ||
            this.personForm.get('accountName')?.hasError('maxlength')) {
            return 'Tên tài khoản từ 6 đến 30 ký tự, không chứa ký tự đặc biệt và dấu hợp lệ';
        }
    }
    public getErrorPassword(): string {
        if (this.personForm.get('passwd')?.hasError('required')) {
            return 'QLDT023';
        }

        if (this.personForm.get('passwd')?.hasError('forbiddenPassword') ||
            this.personForm.get('passwd')?.hasError('minlength') ||
            this.personForm.get('passwd')?.hasError('maxlength')) {
            return 'QLDT024';
        }
    }
    public getErrorMobile(): string {
        if (this.personForm.get('mobile')?.hasError('required')) {
            return 'QLDT025';
        }

        if (this.personForm.get('mobile')?.hasError('forbiddenPhoneNumber') ||
            this.personForm.get('mobile')?.hasError('minlength') ||
            this.personForm.get('mobile')?.hasError('maxlength')) {
            return 'QLDT026';
        }
    }

    private buildPersonalForm(): void {
        this.personForm = this._formBuilder.group({
            accountName: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50), forbiddenUserNameValidator()]),
            passwd: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50), forbiddenPasswordValidator()]),
            mobile: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(11), forbiddenPhoneNumberValidator()]),
            email: new FormControl(null, [Validators.required, Validators.email]),
            manageStaff: new FormControl(null, [Validators.required]),

            avatar: new FormControl(null),
            fullName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            identification: new FormControl(null, [Validators.required, Validators.maxLength(12)]),
            dateOfIdnumber: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
            placeOfIdnumber: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            gender: new FormControl(null, [Validators.required]),
            // gender: new FormControl(this.genders[0].id, [Validators.required]),
            taxCode: new FormControl(null, [Validators.maxLength(13)]),
            dateOfBirth: new FormControl(null, [Validators.required]),
            address1: new FormControl(null, [Validators.required]),
            address2: new FormControl(null, [Validators.required]),
            frontPhotoIdentication: new FormControl(null, [Validators.required]),
            backsitePhotoIdentication: new FormControl(null, [Validators.required]),

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
            type: new FormControl(this.userType.CA_NHAN),
        });
    }
}
