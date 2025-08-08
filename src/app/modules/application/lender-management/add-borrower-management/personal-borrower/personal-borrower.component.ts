import { Component, OnInit, ViewChild } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthService } from 'app/core/auth/auth.service';
import { FileService } from 'app/service/common-service/file.service';
import { AddressDialogComponent } from 'app/shared/components/address-dialog/address-dialog.component';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { ISelectModel } from 'app/shared/models/select.model';
import {UserType} from '../../../../../enum';
import {ManagementLenderService} from '../../../../../service';
import {
    forbiddenPasswordValidator,
    forbiddenPhoneNumberValidator,
    forbiddenUserNameValidator
} from '../../../../../shared/validator/forbidden';
import {MatTabGroup} from '@angular/material/tabs';
import {AdmAccountDetailDTO} from "../../../../../models/admin";

@Component({
    selector: 'app-personal-borrower',
    templateUrl: './personal-borrower.component.html',
    styleUrls: ['./personal-borrower.component.scss'],
    providers: [DateTimeformatPipe]
})
export class PersonalBorrowerComponent implements OnInit {
    @ViewChild(MatTabGroup) tabGroup: MatTabGroup;

    public personForm: FormGroup = new FormGroup({});
    public genders: Array<ISelectModel> = [];
    public businessAreas: Array<ISelectModel> = [];
    public marriageCode: Array<ISelectModel> = [];
    public jobCode: Array<ISelectModel> = [];
    public userType = UserType;
    public lstManagerStaff: AdmAccountDetailDTO[];

    constructor(
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _borrowerService: ManagementLenderService,
        private _matDialog: MatDialog,
        private _fileService: FileService,
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
            this.marriageCode = res.marriageCode.map(el => ({
                id: el.admCategoriesId.toString(),
                label: el.categoriesName
            }));
            this.jobCode = res.jobCode.map(el => ({
                id: el.admCategoriesId.toString(),
                label: el.categoriesName
            }));
            if (res.lstManagerStaff) {
                this.lstManagerStaff = res.lstManagerStaff;
            }
        });
        this.buildPersonalForm();
    }

    private buildPersonalForm(): void {
        this.personForm = this._formBuilder.group({
            accountName: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(50), forbiddenUserNameValidator()]),
            passwd: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(50), forbiddenPasswordValidator()]),
            mobile: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(11), forbiddenPhoneNumberValidator()]),
            email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(100)]),
            manageStaff: new FormControl(null, [Validators.required]),

            avatar: new FormControl(null),
            fullName: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
            identification: new FormControl(null, [Validators.required, Validators.maxLength(12)]),
            dateOfIdnumber: new FormControl(null, [Validators.required, Validators.maxLength(20)]),
            placeOfIdnumber: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
            gender: new FormControl(this.genders[0].id, [Validators.required]),
            marital: new FormControl(null, [Validators.required]),
            job: new FormControl(null, [Validators.required]),
            jobAddress: new FormControl(null),
            taxCode: new FormControl(null, [Validators.maxLength(13)]),
            facebook: new FormControl(null),
            dateOfBirth: new FormControl(null, [Validators.required]),
            address1: new FormControl(null, [Validators.required]),
            address2: new FormControl(null, [Validators.required]),
            frontPhotoIdentication: new FormControl(null, [Validators.required]),
            backsitePhotoIdentication: new FormControl(null, [Validators.required]),
            laborContract: new FormControl(null),
            rentalContract: new FormControl(null),
            fileValues1: new FormControl(null),
            fileValues2: new FormControl(null),
            // deputyContacts: new FormArray([this.buildDeputyForm()]),

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

    private buildDeputyForm(): FormGroup {
        return new FormGroup({
            address2: new FormControl(null, [Validators.required]),
            address1: new FormControl(null, [Validators.required]),
            referenContact: new FormControl(null, [Validators.required]),
            job: new FormControl(null, [Validators.required]),
            mobile: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(11), forbiddenPhoneNumberValidator()]),
            dateOfBirth: new FormControl(null, [Validators.required]),
            gender: new FormControl(null, [Validators.required]),
            placeOfIdnumber: new FormControl(null, [Validators.required]),
            idDate: new FormControl(null, [Validators.required]),
            identification: new FormControl(null, [Validators.required]),
            fullName: new FormControl(null, [Validators.required]),
            email: new FormControl(null, [Validators.email]),
            jobAddress: new FormControl(null, [Validators.maxLength(100)]),
            facebook: new FormControl(null, [Validators.maxLength(100)]),
        });
    }

    get deputyContacts() : FormArray {
        return this.personForm.get("deputyContacts") as FormArray
    }

    addDeputyForm(): void {
        this.deputyContacts.push(this.buildDeputyForm());
        this.tabGroup.selectedIndex = this.deputyContacts.length - 1;
    }

    removeDeputyForm(index): void {
        this.deputyContacts.removeAt(index);
        this.tabGroup.selectedIndex = index - 1;
    }

    public choseAddress(type: string): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '520px';
        dialogConfig.data = type === 'address1' ? this.personForm.controls.address1.value : this.personForm.controls.address2.value;
        const dialog = this._matDialog.open(AddressDialogComponent, dialogConfig);
        dialog.afterClosed().subscribe((res) => {
            if (res) {
                if (type === 'address1') {
                    this.personForm.controls.address1.setValue(res);
                }
                if (type === 'address2') {
                    this.personForm.controls.address2.setValue(res);
                }
            }
        });
    }

    public getErrorAccount(): string {
        if (this.personForm.get('accountName')?.hasError('required')) {
            return 'QLVV012';
        }

        if (this.personForm.get('accountName')?.hasError('forbiddenUserName') ||
            this.personForm.get('accountName')?.hasError('minlength') ||
            this.personForm.get('accountName')?.hasError('maxlength')) {
            return 'QLVV011';
        }
    }
    public getErrorPassword(): string {
        if (this.personForm.get('passwd')?.hasError('required')) {
            return 'QLVV015';
        }

        if (this.personForm.get('passwd')?.hasError('forbiddenPassword') ||
            this.personForm.get('passwd')?.hasError('minlength') ||
            this.personForm.get('passwd')?.hasError('maxlength')) {
            return 'QLVV014';
        }
    }
    public getErrorMobile(): string {
        if (this.personForm.get('mobile')?.hasError('required')) {
            return 'QLVV018';
        }

        if (this.personForm.get('mobile')?.hasError('forbiddenPhoneNumber') ||
            this.personForm.get('mobile')?.hasError('minlength') ||
            this.personForm.get('mobile')?.hasError('maxlength')) {
            return 'QLVV016';
        }
    }
}
