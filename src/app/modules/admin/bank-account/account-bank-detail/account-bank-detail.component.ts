import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService } from 'app/core/auth/auth.service';
import { FsAccountBankDTO } from 'app/models/service/FsAccountBankDTO.model';
import { AccountBankService } from 'app/service';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { APP_TEXT } from 'app/shared/constants';
import { ISelectModel } from 'app/shared/models/select.model';
import { fuseAnimations } from "../../../../../@fuse/animations";

@Component({
    selector: 'app-account-bank-detail',
    templateUrl: './account-bank-detail.component.html',
    styleUrls: ['./account-bank-detail.component.scss'],
    providers: [DateTimeformatPipe],
    animations: fuseAnimations,
})
export class AccountBankDetailComponent implements OnChanges {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public fsAccountBankId: number;

    public accountBankForm: FormGroup = new FormGroup({});
    public isEditable: boolean = false;
    public detailAccount: FsAccountBankDTO;
    public accTypes: Array<ISelectModel> = [
        { id: 3, label: 'Tài khoản nhà đầu tư' },
        { id: 4, label: 'Tài khoản bên huy động vốn' },
        { id: 5, label: 'Tài khoản Tiếp quỹ tiền mặt' },
        { id: 6, label: 'Tài khoản rút tiền ví HO' },
    ];
    public banks: Array<ISelectModel> = [];

    constructor(
        private _formBuilder: FormBuilder,
        private _accountService: AccountBankService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private _datetimePipe: DateTimeformatPipe,
        private _authService: AuthService,
    ) {
        this._accountService._prepareConfig.subscribe((res) => {
            if (res) {
                this.banks = res.payload.map(el => ({
                    id: el.admCategoriesId,
                    label: el.categoriesName
                }));
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.fsAccountBankId.currentValue !== 0) {
            const request = new FsAccountBankDTO();
            request.fsAccountBankId = changes.fsAccountBankId.currentValue;
            this._accountService.getDetail(request).subscribe((res) => {
                if (res) {

                    this.detailAccount = res.payload;
                    this.initForm();
                }
            });
        }
    }

    onClose(): void {
        if (this.accountBankForm.dirty) {
            const config: FuseConfirmationConfig = {
                title: '',
                message: 'Dữ liệu thao tác trên màn hình sẽ bị mất, xác nhận thực hiện',
                actions: {
                    confirm: {
                        label: 'Đồng ý',
                        color: 'primary'
                    },
                    cancel: {
                        label: 'Huỷ'
                    }
                }
            };
            const dialog = this._confirmService.open(config);
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this.isEditable = false;
                    this.handleCloseDetailPanel.emit(false);
                }
            });
            return;
        } else {
            this.isEditable = false;
            this.handleCloseDetailPanel.emit(false);
        }
    }

    submit(): void {
        const config: FuseConfirmationConfig = {
            title: 'Xác nhận lưu dữ liệu',
            message: '',
            actions: {
                confirm: { label: 'Lưu', color: 'primary' },
                cancel: { label: 'Huỷ' }
            }
        };
        const dialog = this._confirmService.open(config);
        dialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed' && this.accountBankForm.valid) {
                const request = this.accountBankForm.value;
                this._accountService.update(request).subscribe((result) => {
                    if (result.errorCode === '0') {
                        // Sau khi update thành công => gọi lại detail
                        const req = new FsAccountBankDTO();
                        req.fsAccountBankId = this.fsAccountBankId;
                        this._accountService.getDetail(req).subscribe((resDetail) => {
                            if (resDetail) {
                                this.detailAccount = resDetail.payload;
                                this.initForm(); // đồng bộ lại form
                            }
                        });

                        this.isEditable = false;
                        this.handleCloseDetailPanel.emit(true);
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                    } else {
                        this._fuseAlertService.showMessageError(result.message);
                    }
                });
            }
        });
    }


    public getAccType(): string {
        return this.accTypes.filter(x => x.id === this.detailAccount.accType)[0].label;
    }

    private initForm(): void {
        this.accountBankForm = this._formBuilder.group({
            fsAccountBankId: new FormControl(this.detailAccount.fsAccountBankId),
            accNo: new FormControl(this.detailAccount.accNo, [Validators.required, Validators.maxLength(15), Validators.pattern("[a-zA-Z0-9]*")]),
            bankId: new FormControl(this.detailAccount.bankId, [Validators.required]),
            accName: new FormControl(this.detailAccount.accName, [Validators.required, Validators.maxLength(120)]),
            bankBranch: new FormControl(this.detailAccount.bankBranch, [Validators.required, Validators.maxLength(120)]),
            accType: new FormControl(this.detailAccount.accType, [Validators.required]),
            createdByName: new FormControl({
                value: this.detailAccount ? this.detailAccount.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: this.detailAccount ? this._datetimePipe.transform(this.detailAccount.createdDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: this.detailAccount ? this.detailAccount.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: this.detailAccount ? this._datetimePipe.transform(this.detailAccount.lastUpdatedDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
    }
    onEdit(): void {
        this.isEditable = true;
        this.accountBankForm.reset(this.detailAccount)
    }


}
