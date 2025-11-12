import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import {
    EXCEL_FILE_NAME_VALIDATOR,
    FILE_NAME_VALIDATOR,
    IMAGE_FILE_VALIDATOR,
    IMAGE_WITH_PDF_FILE_VALIDATOR,
    REPORT_FILE_VALIDATOR,
    REPORT_WITH_EXCEL_FILE_VALIDATOR
} from 'app/shared/validator/file';
import _ from 'lodash';
import { Subscription } from 'rxjs';
import { DialogService } from '../../../../service/common-service/dialog.service';
import { KycServices } from '../../../../service/kyc/kyc.service';
import { APP_TEXT } from '../../../constants';
import { IAddressData } from '../../../models/address.model';
import { AddressKycDialogComponent } from '../../dialog/address-dialog/address-dialog.component';
import { PayloadPrepareLoadingPage } from './kyc.types';
import { OtpEmailComponent } from '../../dialog/otp-email/otp-email.component';
import { FuseAlertService } from "../../../../../@fuse/components/alert";
import { AuthService } from "../../../../core/auth/auth.service";
import { UserAccountStatus } from "../../../../core/user/user.types";
import { AdmCategoriesDTO } from "../../../../models/admin";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { KycLocalStorageService } from 'app/service/kyc/kyc-local-storage.service';

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

    @Output() uploadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    isMobile = false;
    isUploadingFile: boolean = false;
    uploadingCount = 0;
    addressModes: { [key: string]: 'new' | 'old' } = {};


    private readonly oneColumnFileNames = [
        'financialDocuments',
        'financialDocuments1',
        'financialDocuments2',
        'financialDocuments3',
        "businessDocumentation",
        "businessDocumentation1",
        "businessDocumentation2"
    ];
    private _initiallyDisabledMap = new Map<string, string[]>();


    @HostListener('window:resize', [])
    onResize() {
        this.checkScreenSize();
    }

    private checkScreenSize() {
        this.isMobile = window.innerWidth < 1024; // < 1024px thì coi là mobile/tablet
    }
    userId: number;



    constructor(
        public _authService: AuthService,
        private _kycService: KycServices,
        private _fb: FormBuilder,
        private _matDialog: MatDialog,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService,
        private breakpointObserver: BreakpointObserver,
        private _kycLocalStorage: KycLocalStorageService,

    ) {
        this.breakpointObserver.observe([Breakpoints.Small, Breakpoints.XSmall])
            .subscribe(result => {
                this.isScreenSmall = result.matches;
            });
        this.checkScreenSize();

    }


    isOneColumnFile(controlName: string): boolean {
        return this.oneColumnFileNames.includes(controlName);
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
        this.userId = this._authService.authenticatedUser.admAccountId;
        this.initForm();
        this.createDynamicForm();
        this.addressModes = this._kycLocalStorage.getAddressModes(this.userId) || {};
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
    isColEmail(colspan: number, name: string) {
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
                    // console.log(this.kycPayload)
                    this._kycService.createDynamicForm(this.kycPayload, this.prepareLoadingPageFormArray);
                    // Khôi phục dữ liệu từ localStorage
                    this.restoreLocalData();
                    // Gắn validator runtime cho financeLastTime & financeTime
                    this.attachFutureYearValidatorsForAllTabs();
                }
            )
        );
    }

    onUploadingChange(isUploading: boolean, formGroupName: string): void {
        this.uploadingCount += isUploading ? 1 : -1;
        this.uploadingCount = Math.max(this.uploadingCount, 0);

        const isCurrentlyUploading = this.uploadingCount > 0;
        this.isUploadingFile = isCurrentlyUploading;

        const formGroup = this.getDTOFormGroup(this.indexTabActive, formGroupName);

        if (formGroup) {
            if (isCurrentlyUploading) {
                // ✅ Lưu disable ban đầu theo tên formGroup
                const disabledControls = Object.keys(formGroup.controls)
                    .filter(key => formGroup.get(key).disabled);
                this._initiallyDisabledMap.set(formGroupName, disabledControls);

                formGroup.disable({ emitEvent: false });
            } else {
                formGroup.enable({ emitEvent: false });

                // ✅ Disable lại các control ban đầu
                const disabledControls = this._initiallyDisabledMap.get(formGroupName) || [];
                disabledControls.forEach(key => formGroup.get(key)?.disable({ emitEvent: false }));
            }
        }
    }

    // 🔁 Hàm khôi phục dữ liệu khi load form
    private restoreLocalData(): void {
        this.kycPayload.forEach((payload, index) => {
            const localData = this._kycLocalStorage.getForm(this.userId, payload.kycStep);
            if (localData) {
                const formGroup = this.getDTOFormGroup(index, payload.formGroupName);
                formGroup.patchValue(localData);
            }
        });
    }

    // 🟢 Gọi khi blur bất kỳ input nào
    public handleBlur(index: number, payload: any): void {
        const formGroup = this.getDTOFormGroup(index, payload.formGroupName);
        this._kycLocalStorage.saveForm(this.userId, payload.kycStep, formGroup.value);
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Event click, change to change value for form control to post to the API
    // -----------------------------------------------------------------------------------------------------

    transformDataToPost(): any {
        const valueToPost = _.cloneDeep(
            this.prepareLoadingPageFormArray.at(this.indexTabActive).getRawValue()
        );
        const formGroupName = this.kycPayload.at(this.indexTabActive).formGroupName;
        // const formControlNameShared = this.kycPayload.at(this.indexTabActive).formControlNameShared;
        if (formGroupName) {
            const valueOfADMFormObj = valueToPost.payload[formGroupName];
            let lstGroup: [{ key: string; data: any }];
            Object.keys(valueOfADMFormObj).forEach((key: string) => {
                // date fields just accept string --> format moment to string
                // if (valueOfADMFormObj[key] instanceof moment) {
                //     valueOfADMFormObj[key] = valueOfADMFormObj[key].format('x');
                // }
                if (key.startsWith('group_')) {
                    let item = valueOfADMFormObj[key];
                    let keyReal = key.split('_temp')[0].replaceAll('group_', '');
                    if (lstGroup == undefined) {
                        lstGroup = [{ key: keyReal, data: item }];
                    } else {
                        let index = lstGroup.findIndex(key => key.key == keyReal);
                        if (index !== -1) {
                            lstGroup.map(key => key.key == keyReal ? key.data += (";" + item) : key.data)
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
        // console.log(this.formGroup.value)
        const formGroup = this.getDTOFormGroup(this.indexTabActive, formGroupName);
        formGroup.markAllAsTouched();
        if (this.getDTOFormGroup(this.indexTabActive, formGroupName).valid) {
            const dialogRef = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
            dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this._kycService.postDataKyc(this.transformDataToPost())
                        .subscribe((res) => {
                            // console.log(res)
                            const dialogConfig: MatDialogConfig = {
                                autoFocus: true,
                                disableClose: true,
                                width: '450px',
                            };
                            if (String(res.errorCode) === '0') {
                                this.stepper.selected.state = 'done';
                                if (isEnd) {
                                    this._kycService.sendEmail().subscribe();
                                    const cf = this._matDialog.open(OtpEmailComponent, dialogConfig);
                                    cf.afterClosed().subscribe((res) => {
                                        if (res) {
                                            let user = this._authService.authenticatedUser;
                                            user.status = UserAccountStatus.WAS_KYC;
                                            // localStorage.setItem('userInfo',  JSON.stringify(user));
                                            this._kycLocalStorage.clearUserForm(this.userId)
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
                                this._fuseAlertService.showMessageError(res.message);
                            }
                        },
                            (error) => {
                                this._fuseAlertService.showMessageError('Lỗi hệ thống');

                            }
                        );
                }
            });
        } else {
            this._fuseAlertService.showMessageWarning('Vui lòng kiểm tra dữ liệu')
        }

    }

    openAddressDialog(indexTab: number, formGroupName: string, formControlName: string): void {
        const control = this.getFormControlInstance(indexTab, formGroupName, formControlName);
        const value = control.value;
        const key = `${formGroupName}_${formControlName}`;
        const type = this.addressModes[key] || 'old';

        const dialogRef = this._matDialog.open(AddressKycDialogComponent, {
            disableClose: true,
            width: '90vw',
            maxWidth: '450px',
            panelClass: 'address-dialog-responsive',
            data: {
                type,
                value: value || '',
            },
        });

        dialogRef.afterClosed().subscribe((res: IAddressData) => {
            if (res && res.payload && res.type) {
                this.getFormControlInstance(indexTab, formGroupName, formControlName).patchValue(res?.payload);
                this.addressModes[key] = res.type;
                this._kycLocalStorage.saveAddressModes(this.userId, this.addressModes);
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

    onInput(event: Event, type: string, keyName?: string, form?, formGroupName?): void {
        let value = (event.target as HTMLInputElement).value;

        if (type === 'number') {
            value = value.replace(/[^\d]/g, '');
        }

        if (form && (form.name === 'admAccountDetailDTO.fullName' || form.name === 'admDeputyContactDTO.fullName')) {
            value = value.toString().toUpperCase();
        }

        (event.target as HTMLInputElement).value = value;


        if (keyName && formGroupName != null) {
            // console.log(value)
            const formGroup = this.getDTOFormGroup(this.indexTabActive, formGroupName);
            const control = formGroup.get(keyName);
            control?.setValue(value);
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

    // isInvalidPattern(indexTab: number, formGroupName: string, formControlName: string): boolean {
    //     return this.getFormControlInstance(indexTab, formGroupName, formControlName)?.hasError('pattern')
    //         && this.getFormControlInstance(indexTab, formGroupName, formControlName)?.touched;
    // };
    isInvalidPattern(indexTab: number, formGroupName: string, formControlName: string): boolean {
        const control = this.getFormControlInstance(indexTab, formGroupName, formControlName);
        if (!control) return false;
        return (control.hasError('pattern') || control.hasError('futureYear')) && control.touched;
    }
    /**
     * Gắn kiểm tra năm tương lai (futureYear) cho các control financeLastTime và financeTime
     * Cho mỗi tab/formGroup có tồn tại control đó sẽ subscribe valueChanges 1 lần.
     */
    private attachFutureYearValidatorsForAllTabs(): void {
        const controlNames = ['financeLastTime', 'financeTime'];
        const currentYear = new Date().getFullYear();

        this.prepareLoadingPageFormArray.controls.forEach((tabGroup, index) => {
            const formGroupName = this.kycPayload?.[index]?.formGroupName;
            if (!formGroupName) return;

            controlNames.forEach(controlName => {
                const control = this.getFormControlInstance(index, formGroupName, controlName);
                if (!control) return;

                // tránh subscribe nhiều lần vào cùng control
                if ((control as any).__futureYearSubscribed) return;

                const sub = control.valueChanges.subscribe((value: any) => {
                    // không console.log ở đây (tránh in liên tục)
                    // build lại object errors, giữ các lỗi khác (ví dụ pattern)
                    const existingErrors = control.errors ? { ...control.errors } : {};
                    delete existingErrors.futureYear; // xóa lỗi trước đó nếu có

                    if (value && /^[0-9]{4}$/.test(String(value))) {
                        const year = parseInt(String(value), 10);
                        if (year > currentYear) {
                            existingErrors.futureYear = true;
                        }
                    }

                    // Nếu không còn lỗi thì set null, ngược lại setObject
                    const keys = Object.keys(existingErrors);
                    control.setErrors(keys.length ? existingErrors : null);
                });

                this.subscription.add(sub);
                (control as any).__futureYearSubscribed = true;
            });
        });
    }



    downloadBCCTTemplate() {
        this._kycService.downloadTemplate('downloadTemplateBCTC')
    }

    getSelectListFilter(dateSourceObj: any, key: string): AdmCategoriesDTO[] {
        let source = this.mapSelectListFilter.get(key);
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
    signOut(): void {
        this._authService.signOut(true).subscribe();
    }
    // goToStep(index: number, stepper: MatStepper) {
    //     stepper.selectedIndex = index;
    //     this.indexTabActive = index;
    // }

}
