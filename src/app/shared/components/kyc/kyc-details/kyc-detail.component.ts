import {Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatStepper} from '@angular/material/stepper';
import {
    EXCEL_FILE_NAME_VALIDATOR,
    FILE_NAME_VALIDATOR,
    IMAGE_FILE_VALIDATOR,
    IMAGE_WITH_PDF_FILE_VALIDATOR,
    REPORT_FILE_VALIDATOR,
    REPORT_WITH_EXCEL_FILE_VALIDATOR
} from 'app/shared/validator/file';
import _ from 'lodash';
import moment from 'moment';
import {Subscription} from 'rxjs';
import {DialogService} from '../../../../service/common-service/dialog.service';
import {FileService} from '../../../../service/common-service/file.service';
import {KycServices} from '../../../../service/kyc/kyc.service';
import {APP_TEXT} from '../../../constants';
import {IAddressData} from '../../../models/address.model';
import {AddressKycDialogComponent} from '../../dialog/address-dialog/address-dialog.component';
import {FormsPrepareLoadingPage, PayloadPrepareLoadingPage} from './kyc.types';
import {OtpEmailComponent} from '../../dialog/otp-email/otp-email.component';
import {FuseAlertService} from "../../../../../@fuse/components/alert";
import {AuthService} from "../../../../core/auth/auth.service";
import {UserAccountStatus} from "../../../../core/user/user.types";
import {AdmCategoriesDTO} from "../../../../models/admin";
import {IBaseDataSourceObj} from "../../../models/base.model";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
    selector: 'kyc-details',
    templateUrl: './kyc-detail.component.html',
    styleUrls: ['./kyc-detail.component.scss', '../kyc-starter/kyc-starter.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class KycDetailComponent implements OnInit, OnDestroy {
    @ViewChild('stepper', { static: true }) stepper: MatStepper;

    @Output() isStartContactCustomerService: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() backToKycStarted: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() toKycFinished: EventEmitter<boolean> = new EventEmitter<boolean>();

    isCommonFile = FILE_NAME_VALIDATOR;
    isExcelFile = EXCEL_FILE_NAME_VALIDATOR;
    isReportFile = REPORT_FILE_VALIDATOR;
    isReportWithExcelFile = REPORT_WITH_EXCEL_FILE_VALIDATOR;
    isImageFile = IMAGE_FILE_VALIDATOR;
    isImageWithPdfFile = IMAGE_WITH_PDF_FILE_VALIDATOR;

    formGroup: FormGroup;
    subscription: Subscription = new Subscription();
    kycPayload: PayloadPrepareLoadingPage[] = [];
    previewAvatarUrl: string;
    appConfig = APP_TEXT;
    indexTabActive: number = 0;
    mapSelectListFilter = new Map();
    isScreenSmall: boolean = false;

    constructor(
        public _authService: AuthService,
        private _kycService: KycServices,
        private _fb: FormBuilder,
        private _fileService: FileService,
        private _matDialog: MatDialog,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService,
        private breakpointObserver: BreakpointObserver
    ) {
        this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe(result => {
        this.isScreenSmall = result.matches;
      });
     }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    get prepareLoadingPageFormArray(): FormArray {
        return this.formGroup.get('prepareLoadingPage') as FormArray;
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.initForm();
        this.createDynamicForm();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    // Init form
    initForm(): void {
        this.formGroup = this._fb.group({
            prepareLoadingPage: this._fb.array([])
        });
    }
    isColEmail(colspan: number, name: string){
        return name !== 'admAccountDetailDTO.email' ? colspan : 1
    }

    getDTOFormGroup(indexOfTab: number, formGroupName: string): FormGroup {
        return this.prepareLoadingPageFormArray.at(indexOfTab)?.get('payload')?.get(formGroupName) as FormGroup;
    }

    getFormControlInPayload(indexOfTab: number, formControlName: string): FormControl {
        return this.prepareLoadingPageFormArray.at(indexOfTab)?.get('payload')?.get(formControlName) as FormControl;
    }

    getFormControlInstance(indexOfTab: number, formGroupName: string, formControlName: string): FormControl {
        return this.getDTOFormGroup(indexOfTab, formGroupName)?.get(formControlName) as FormControl;
    }

    // Create dynamic form
    createDynamicForm(): void {
        this.subscription.add(
            this._kycService.kycPayLoad.subscribe(
                (payload) => {
                    this.kycPayload = payload;
                    console.log(payload)
                    this._kycService.createDynamicForm(this.kycPayload, this.prepareLoadingPageFormArray);
                }
            )
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Event click, change to change value for form control to post to the API
    // -----------------------------------------------------------------------------------------------------

    transformDataToPost(): any {
        const valueToPost = _.cloneDeep(this.prepareLoadingPageFormArray.at(this.indexTabActive).value);
        const formGroupName = this.kycPayload.at(this.indexTabActive).formGroupName;
        // const formControlNameShared = this.kycPayload.at(this.indexTabActive).formControlNameShared;
        if ( formGroupName ) {
            const valueOfADMFormObj = valueToPost.payload[formGroupName];
            let lstGroup: [{ key: string; data: any }];
            Object.keys(valueOfADMFormObj).forEach((key: string) => {
                // date fields just accept string --> format moment to string
                if (valueOfADMFormObj[key] instanceof moment) {
                    // valueOfADMFormObj[key] = valueOfADMFormObj[key].format('x');
                    // valueOfADMFormObj[key] = valueOfADMFormObj[key].format('x');
                }
                if (key.startsWith('group_')) {
                    let item = valueOfADMFormObj[key];
                    let keyReal = key.split('_temp')[0].replaceAll('group_', '');
                    if (lstGroup == undefined) {
                        lstGroup = [{key: keyReal, data: item}];
                    } else {
                        let index = lstGroup.findIndex(key => key.key == keyReal);
                        if (index !== -1) {
                            lstGroup.map(key => key.key == keyReal ? key.data += (";" + item): key.data)
                        } else {
                            lstGroup.push({
                                key: keyReal,
                                data: item
                            })
                        }
                    }
                    delete valueOfADMFormObj[key];
                }
            });
            if (lstGroup && lstGroup.length > 0) {
                lstGroup.forEach(item => valueOfADMFormObj[item.key] = item.data)
            }

            /*if ( formControlNameShared ) {
                let stringConcatenation = '';
                Object.keys(valueOfADMFormObj).forEach((key: string) => {
                    // String concatenation to send value to API with form control shared property
                    stringConcatenation += `${valueOfADMFormObj[key]};`;
                    // Remove property after concat
                    delete valueOfADMFormObj[key];
                });
                valueOfADMFormObj[formControlNameShared] = stringConcatenation;
            }*/
        }
        if (valueToPost.payload?.admAccountDetailDTO?.fullName) {
            valueToPost.payload.admAccountDetailDTO.fullName = valueToPost.payload.admAccountDetailDTO.fullName.toUpperCase();
        }
        if (valueToPost.payload?.admDeputyContactDTO?.fullName) {
            valueToPost.payload.admDeputyContactDTO.fullName = valueToPost.payload.admDeputyContactDTO.fullName.toUpperCase();
        }
        return valueToPost;
    }

    onSubmit(isEnd: boolean, formGroupName: string): void {
        // this.prepareLoadingPageFormArray.at(this.indexTabActive).markAllAsTouched();
        const formGroup = this.getDTOFormGroup(this.indexTabActive, formGroupName);
        formGroup.markAllAsTouched();
        if ( this.getDTOFormGroup(this.indexTabActive, formGroupName).valid ) {
            // If data of current tab is posted to api, nav to next tab
            /*if ( this.getFormControlInPayload(this.indexTabActive, 'isPosted').value ) {
                if (this.indexTabActive < this.kycPayload.length - 1) {
                    this.indexTabActive++;
                }
            }
            else */
            // {
                // If data of current tab is valid, show confirm open to post data
                const dialogRef = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');

                dialogRef.afterClosed().subscribe((result) => {
                    if (result === 'confirmed') {
                        this._kycService.postDataKyc(this.transformDataToPost())
                            .subscribe((res) => {
                                if (String(res.errorCode) === '0') {
                                    this.stepper.selected.state = 'done';
                                    if (isEnd) {
                                        this._kycService.sendEmail().subscribe();
                                        const cf = this._matDialog.open(OtpEmailComponent);
                                        // eslint-disable-next-line @typescript-eslint/no-shadow
                                        cf.afterClosed().subscribe((res) => {
                                            if (res) {
                                                let user = this._authService.authenticatedUser;
                                                user.status = UserAccountStatus.WAS_KYC;
                                                localStorage.setItem('userInfo', JSON.stringify(user));
                                                this.toKycFinished.emit(true);
                                            }
                                        });
                                    }
                                    // Auto navigate next tab if post success
                                    else {
                                        this.getFormControlInPayload(this.indexTabActive, 'isPosted').patchValue(true);
                                        if (this.indexTabActive < this.kycPayload.length - 1) {
                                            this.indexTabActive++;
                                        }
                                        this.stepper.next();
                                        this.prepareLoadingPageFormArray.at(this.indexTabActive)?.get('payload')?.get('isPosted').patchValue(true)
                                    }
                                } else {
                                    this._fuseAlertService.showMessageError(res.message.toString());
                                }
                            }
                        );
                    }
                });
            // }
        }
    }
    onBlur(event: Event, form: any): void {
        const input = (event.target as HTMLInputElement).value.trim();
        const control = this.getDTOFormGroup(this.indexTabActive, form.formGroupName)
                            .get(form.formControlName);
        control?.setValue(input);
    }


    openAddressDialog(indexTab: number, formGroupName: string, formControlName: string): void {
        const dialogRef = this._matDialog.open(AddressKycDialogComponent, {
            disableClose: true,
            width: '450px',
            data: this.getFormControlInstance(indexTab, formGroupName, formControlName).value,
        });
        dialogRef.afterClosed().subscribe((res: IAddressData) => {
            if (res && res.payload) {
                this.getFormControlInstance(indexTab, formGroupName, formControlName).patchValue(res?.payload);
            }
        });
    }

    onChangeDate(e: any, indexTab: number, formGroupName: string, formControlName: string): void {
        if (e?._d) {
            const date = new Date(new Date(e._d).toISOString());
            this.getFormControlInstance(indexTab, formGroupName, formControlName).patchValue(date.getTime());
        }
    }

    onClickBackButton(): void {
        // this.indexTabActive = this.indexTabActive === 1 ? 0 : 1
        if (this.indexTabActive === 0) {
            this.backToKycStarted.emit(false);
        } else {
            this.indexTabActive--;
            this.stepper.previous();
        }
    }

    setMaxLength(event: KeyboardEvent, maxLength: number): boolean {
        return maxLength ? (event.target as HTMLInputElement).value.length < maxLength : true;
    }

    onInput(event: Event, type: string, keyName?: string, form?): void {
        let value = (event.target as HTMLInputElement).value;

        if (type === 'number') {
            value = value.replace(/[^\d]/g, '');
        }

        if (form && (form.name === 'admAccountDetailDTO.fullName' || form.name === 'admDeputyContactDTO.fullName')) {
            value = value.toString().toUpperCase();
        }

        (event.target as HTMLInputElement).value = value;

        if (keyName && form?.formGroupName != null) {
            const formGroup = this.getDTOFormGroup(this.indexTabActive, form.formGroupName);
            const control = formGroup.get(keyName);
            control?.setValue(value); // Bạn cũng có thể dùng patchValue
        }
    }


    onClickContactCustomerService(): void {
        this.isStartContactCustomerService.emit(true);
        this._kycService.contactCustomerCare().subscribe();
    }

    trackByFn(step: number, kycPaylod: PayloadPrepareLoadingPage): number {
        return kycPaylod.kycStep;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Check Form Control Has Error ?
    // -----------------------------------------------------------------------------------------------------

    isInvalidRequired(indexTab: number, formGroupName: string, formControlName: string): boolean {
        return this.getFormControlInstance(indexTab, formGroupName, formControlName)?.hasError('required')
            && this.getFormControlInstance(indexTab, formGroupName, formControlName)?.touched;
    };

    isInvalidPattern(indexTab: number, formGroupName: string, formControlName: string): boolean {
        return this.getFormControlInstance(indexTab, formGroupName, formControlName)?.hasError('pattern')
            && this.getFormControlInstance(indexTab, formGroupName, formControlName)?.touched;
    };

    downloadBCCTTemplate() {
        this._kycService.downloadTemplate('downloadTemplateBCTC')
    }

    getSelectListFilter(dateSourceObj: any, key: string): AdmCategoriesDTO[] {
        let source = this.mapSelectListFilter.get(key) ;
        return source || dateSourceObj;
    }

    onKey(target: any, dateSourceObj: any, key: string): void {
        if (target.value) {
            this.mapSelectListFilter.set(key, dateSourceObj.filter(option => option.categoriesName.toLowerCase().includes(target.value.toLowerCase())));
        } else {
            this.mapSelectListFilter.set(key, dateSourceObj);
        }
    }

    checkLength(key: string): boolean {
        let f = this.mapSelectListFilter.get(key);
        return f && f.length === 0;
    }
}
