import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/core/auth/auth.service';
import { UserType } from 'app/enum';
import { AdmCategoriesDTO } from 'app/models/admin';
import { FsConfRateDTO } from 'app/models/service/FsConfRateDTO.model';
import { LoanProfilesService } from 'app/service';
import { APP_TEXT, ROUTER_CONST } from 'app/shared/constants';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { CurrencyFormatPipe } from '../../../shared/components/pipe/string-format.pipe';
import { FuseConfirmationService } from '../../../../@fuse/services/confirmation';
import { OtpSmsConfirmComponent } from '../../../shared/components/otp-sms-confirm/otp-sms-confirm.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FuseAlertService } from '../../../../@fuse/components/alert';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    selector: 'borrower-create-loan',
    templateUrl: './create-loan.component.html',
    styleUrls: ['create-loan.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [CurrencyFormatPipe, CdkScrollable]
})
export class CreateLoanComponent implements OnInit {
    _lstCollateralType: Observable<AdmCategoriesDTO[]>;
    _confRates: Observable<FsConfRateDTO[]>;
    _lstRates: Observable<AdmCategoriesDTO[]>;
    _lstReasons: Observable<AdmCategoriesDTO[]>;
    loanProfileForm: UntypedFormGroup;
    isRemoved = false;
    files: File[] = [];
    userType = UserType;
    appTextConfig = APP_TEXT;
    submitted = false;
    accept: string = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "application/pdf",
        "application/x-zip-compressed",
        "application/zip",
        "application/zip-compressed",
        ".rar",
        "application/rar",
        "application/x-rar-compressed",
        "application/msword",
        "application/VND.openxmlformats-officedocument.wordprocessingml.document",
        "application/VND.ms-excel",
        "application/VND.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/VND.ms-powerpoint",
        "application/VND.openxmlformats-officedocument.presentationml.presentation",
    ].join(",");

    /**
     * Constructor
     */
    constructor(
        private loanProfilesService: LoanProfilesService,
        private _formBuilder: FormBuilder,
        public authService: AuthService,
        public _currencyFormatPipe: CurrencyFormatPipe,
        private _fuseConfirmationService: FuseConfirmationService,
        private _dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _router: Router,
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this._lstCollateralType = this.loanProfilesService.lstCollateralType;
        this._confRates = this.loanProfilesService.confRates;
        this._lstReasons = this.loanProfilesService.lstReasons;
        this._lstRates = this.loanProfilesService.lstRates;
        this.listenToAmountChanges();
        this.loanProfileForm.valueChanges.subscribe(() => {
            this.updateRateError();
        });
    }
    private updateRateError(): void {
        const rateControl = this.loanProfileForm.get('rate');
        const raisingCapital = this.loanProfileForm.get('raisingCapital')?.value;
        const fsConfRateId = this.loanProfileForm.get('fsConfRateId')?.value;

        if (!raisingCapital || !fsConfRateId) {
            // Nếu chưa chọn 2 trường kia → lỗi THSV013
            rateControl.setErrors({ thsv013: true });
        } else if (!rateControl.value) {
            // Nếu 2 trường đã chọn nhưng chưa chọn rate → lỗi required
            rateControl.setErrors({ required: true });
        } else {
            // Nếu hợp lệ → clear lỗi
            rateControl.setErrors(null);
        }
    }

    public getAmountData(typeChange): void {
        this.loanProfileForm.get(typeChange)
            .valueChanges.pipe(
                debounceTime(300),
                distinctUntilChanged(),
            )
            .subscribe(() => {
                this.prepareCreateLoan();
            });
    }
    private listenToAmountChanges(): void {
        this.loanProfileForm.get('amount')?.valueChanges
            .pipe(
                debounceTime(500),           // chờ 0.5s sau khi dừng nhập
                distinctUntilChanged(),      // chỉ gọi nếu giá trị thực sự đổi
            )
            .subscribe(() => {
                this.prepareCreateLoan();
            });
    }

    initForm(): void {
        this.loanProfileForm = this._formBuilder.group({
            raisingCapital: new FormControl(null, [Validators.required]),
            collateralType: new FormControl(null, [Validators.required]),
            fsConfRateId: new FormControl(null, [Validators.required]),
            rate: new FormControl(null, [Validators.required]),
            reasons: new FormControl(null, [Validators.required]),
            amount: new FormControl(0, [Validators.required, Validators.min(1), Validators.maxLength(15)]),
            feePlus: new FormControl(0),
            interest: new FormControl(0),
            totalAmount: new FormControl(0),
            expectedTime: new FormControl(null),
            info: new FormControl(null),
            finDocumentsId: new FormControl(null),
            isTrusted: new FormControl(false, [Validators.requiredTrue]),
            status: new FormControl(null),
            admAccountId: new FormControl(null),
            admAccountDetailId: new FormControl(null),
            fee: new FormControl(null),
            loanProfilesCode: new FormControl(null),
            loanTimeCycle: new FormControl(null),
        });
    }

    getLstRank(): void {
        const condition = {
            raisingCapital: this.loanProfileForm.get('raisingCapital').value,
            fsConfRateId: this.loanProfileForm.get('fsConfRateId').value
        };
        if (this.loanProfileForm.get('raisingCapital').value != null &&
            this.loanProfileForm.get('fsConfRateId').value != null) {
            this.loanProfilesService.getLstRank(condition).subscribe();
        }
    }

    prepareCreateLoan(): void {
        if (this.loanProfileForm.get('amount').value != null &&
            this.loanProfileForm.get('rate').value != null &&
            this.loanProfileForm.get('fsConfRateId').value != null) {
            const condition = {
                amount: this.loanProfileForm.get('amount').value,
                rate: this.loanProfileForm.get('rate').value,
                fsConfRateId: this.loanProfileForm.get('fsConfRateId').value
            };
            this.loanProfilesService
                .prepareCreateLoan(condition)
                .subscribe((res) => {
                    this.loanProfileForm.get('feePlus').setValue(res.payload.feePlus);
                    this.loanProfileForm.get('interest').setValue(res.payload.interest);
                    this.loanProfileForm.get('totalAmount').setValue(res.payload.totalAmount);

                    this.loanProfileForm.get('status').setValue(res.payload.status);
                    this.loanProfileForm.get('admAccountId').setValue(res.payload.admAccountId);
                    this.loanProfileForm.get('admAccountDetailId').setValue(res.payload.admAccountDetailId);
                    this.loanProfileForm.get('fee').setValue(res.payload.fee);
                    this.loanProfileForm.get('loanProfilesCode').setValue(res.payload.loanProfilesCode);
                    this.loanProfileForm.get('loanTimeCycle').setValue(res.payload.loanTimeCycle);
                });
        } else {
            this.loanProfileForm.get('feePlus').setValue(0);
            this.loanProfileForm.get('interest').setValue(0);
            this.loanProfileForm.get('totalAmount').setValue(0);
        }
    }

    onClearForm(): void {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Bạn có chắc chắn muốn xóa hồ sơ này không?',
            message: 'Đây là hành động vĩnh viễn, bạn sẽ không thể hủy bỏ hoặc lấy lại dữ liệu một khi đã bị xóa',
            actions: {
                confirm: {
                    label: 'Xoá'
                },
                cancel: {
                    label: 'Hủy',
                }
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this.isRemoved = true;
                this.initForm();
            }
        });
    }

    onSubmit(): void {
        this.submitted = true;
        this.loanProfileForm.markAllAsTouched();
        if (this.loanProfileForm.valid) {
            const dialogRef = this._fuseConfirmationService.open({
                title: 'Xác nhận trình ký văn bản này?',
                message: 'Đây là hành động vĩnh viễn, bạn sẽ không thể chỉnh sửa một khi đã trình ký.\n' +
                    '\n' +
                    'Chúng tôi sẽ gửi thông báo đến bạn nếu có bất cứ cập nhật nào đối với hồ sơ của bạn!',
                actions: {
                    confirm: {
                        label: 'Trình ký'
                    },
                    cancel: {
                        label: 'Hủy',
                    }
                }
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result === 'confirmed') {
                    this.loanProfilesService.create({
                        ...this.loanProfileForm.value,
                        expectedTime: this.loanProfileForm.get('expectedTime').value != null ? new Date(this.loanProfileForm.get('expectedTime').value).getTime() : null
                    }).subscribe((res) => {
                        if (res.errorCode === '0') {
                            const dialogOtpRef = this._dialog.open(OtpSmsConfirmComponent, {
                                data: {
                                    payload: {
                                        otpType: 'LOAN_PROFILES',
                                    },
                                    title: 'Điền mã xác nhận OTP',
                                    content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. ' +
                                        'Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất tạo hồ sơ huy động!',
                                    complete: () => {
                                        dialogOtpRef.close();
                                        this._fuseAlertService.showMessageSuccess('Tạo hồ sơ huy động thành công');
                                        this._router.navigate([ROUTER_CONST.config.borrower.loan.review.link]);
                                    },
                                }
                            });
                        } else {
                            this._fuseAlertService.showMessageError(res.message.toString());
                        }
                    });
                }
            });
        }
    }

    download(type: string): void {
        this.loanProfilesService.downloadContract(type);
    }
}
