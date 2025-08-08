import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {AdmAccountDetailDTO, FsDocuments} from 'app/models/admin';
import {ManagementStaffService} from 'app/service';
import {FileService} from 'app/service/common-service';
import {APP_TEXT} from 'app/shared/constants';
import {ISelectModel} from 'app/shared/models/select.model';
import {switchMap} from 'rxjs';
import {ChangePasswordComponent} from '../change-password/change-password.component';
import {UserStatus} from './../../../../../enum/adm-account-detail.enum';
import CryptoJS from "crypto-js";
import {environment} from "../../../../../../environments/environment";
import {TranslocoService} from "@ngneat/transloco";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {
    forbiddenPasswordValidator,
    forbiddenPhoneNumberValidator,
    forbiddenUserNameValidator
} from "../../../../../shared/validator/forbidden";
import {AuthService} from "../../../../../core/auth/auth.service";
import moment from "moment";

@Component({
    selector: 'staff-detail',
    templateUrl: './staff-detail.component.html',
    styleUrls: ['./staff-detail.component.scss'],
    animations: fuseAnimations,
})
export class StaffDetailComponent implements OnInit {
    /**
     * screenMode
     * 0: add
     * 1: update
     * 2: view
     */
    @Input() screenMode: number = 0;
    @Output() backEvent: EventEmitter<boolean> = new EventEmitter(false);
    public staffDetailForm: FormGroup = new FormGroup({});
    public staffDetail: AdmAccountDetailDTO;
    @Input() public genders: Array<ISelectModel> = [];
    @Input() public departments: Array<ISelectModel> = [];
    @Input() public roles: Array<ISelectModel> = [];
    @Input() public positions: Array<ISelectModel> = [];
    oldAvata  = '';

    yearLate = moment().subtract(216, 'months');
    public adminRoles: Array<ISelectModel> = [
        {id: 1, label: 'Trưởng phòng kinh doanh'},
        {id: 2, label: 'Trưởng phòng thẩm định'},
        {id: 3, label: 'Nhân viên thẩm định'},
        {id: 4, label: 'CEO'},
        {id: 5, label: 'Hội đồng tín dụng'},
        {id: 6, label: 'Kế toán'},
        {id: 7, label: 'Sale Doanh nghiệp'},
        {id: 8, label: 'Sale đầu tư'},
        {id: 9, label: 'Admin'},
    ];

    public avatar: string | SafeResourceUrl = 'assets/images/avatars/defaut-avatar.png';

    constructor(
        private _staffService: ManagementStaffService,
        private _formBuilder: FormBuilder,
        private _domSanitizer: DomSanitizer,
        private _fileService: FileService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog,
        private translocoService: TranslocoService,
        private _authService: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this._staffService.staffDetail$.subscribe((res) => {
            this.staffDetail = undefined;
            this.avatar = 'assets/images/avatars/defaut-avatar.png';
            if (res) {
                this.staffDetail = res;
                if (this.staffDetail.role) {
                   let role = this.adminRoles.filter(r => r.id == this.staffDetail.role)[0];
                    if (role) {
                        this.staffDetail.roleName = role.label;
                    }
                }
                this.initForm(this.staffDetail);
                if (this.staffDetail?.avatar) {
                    this._fileService.getFileFromServer(this.staffDetail.avatar).subscribe((result) => {
                        if (!(result.payload as FsDocuments).contentBase64.endsWith(",0")) {
                            this.avatar = this._domSanitizer.bypassSecurityTrustResourceUrl((result.payload as FsDocuments).contentBase64);
                            this.staffDetailForm.controls.avatar.setValue((result.payload as FsDocuments).finDocumentsId);
                        }
                    });
                }

            }
        })
    }

    public onFileInput(event: FileList): void {
        if (!(event[0].size / 1024 / 1024 <= 5)) {
            this._fuseAlertService.showMessageError("QLNV002");
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(event[0]);
        this._fileService.uploadFile(event[0]).pipe(
            switchMap(res => this._fileService.getFileFromServer((res.payload as FsDocuments).finDocumentsId.toString()))
        ).subscribe((result) => {
            if (!(result.payload as FsDocuments).contentBase64.endsWith(",0")) {
                this.avatar = this._domSanitizer.bypassSecurityTrustResourceUrl((result.payload as FsDocuments).contentBase64);
                this.staffDetailForm.controls.avatar.setValue((result.payload as FsDocuments).finDocumentsId);
            }
        });
    }

    public changePassword(): void {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = '40%';
        dialogConfig.data = this.staffDetail.admAccountId;
        setTimeout(() => {
            const dialog = this._matDialog.open(ChangePasswordComponent, dialogConfig);
            dialog.afterClosed().subscribe((res) => {
                if (res) {
                }
            });
        }, 0);
    }

    back(): void {
        if (this.staffDetailForm.dirty) {
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
                    this.backEvent.emit(true);
                }
            });
            return;
        }
        this.backEvent.emit(true);
    }

    doCreate(): void {
        this.staffDetailForm.markAllAsTouched();
        if (this.staffDetailForm.valid) {
            if (this.staffDetailForm.dirty) {
                const config: FuseConfirmationConfig = {
                    title: 'Xác nhận lưu dữ liệu',
                    message: '',
                    actions: {
                        confirm: {
                            label: 'Lưu',
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
                        if (this.staffDetailForm.valid) {
                            const key = CryptoJS.enc.Utf8.parse(environment.encryptKey);
                            const strPasss = CryptoJS.AES.encrypt(this.staffDetailForm.get('passwd').value, key, {
                                mode: CryptoJS.mode.ECB,
                                padding: CryptoJS.pad.Pkcs7
                            }).toString();

                            let request: AdmAccountDetailDTO = this.staffDetailForm.value;
                            request = {
                                ...request,
                                dateOfBirth: new Date(request.dateOfBirth).getTime(),
                                efectiveDate: new Date(request.efectiveDate).getTime(),
                                expirationDate: request.expirationDate ? new Date(request.expirationDate).getTime() : null,
                                passwd: strPasss,
                            };
                                this._staffService.create(request).subscribe((result) => {
                                    if (result.errorCode === '0') {
                                        this.backEvent.emit(true);
                                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                                    } else {
                                        this._fuseAlertService.showMessageError(result.message);
                                    }
                                });
                        }
                    }
                });
            } else {
                this._fuseAlertService.showMessageWarning("Không có thay đổi");
            }
        }
    }

    doUpdate(): void {
        this.staffDetailForm.markAllAsTouched();
        if (this.staffDetailForm.valid) {
            if (!this.staffDetailForm.dirty && this.oldAvata == this.staffDetailForm.get('avatar').value) {
                this._fuseAlertService.showMessageWarning("Không có thay đổi");
                return;
            }
            const config: FuseConfirmationConfig = {
                title: 'Xác nhận cập nhật dữ liệu',
                message: '',
                actions: {
                    confirm: {
                        label: 'Lưu',
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
                    if (this.staffDetailForm.valid) {
                        let request: AdmAccountDetailDTO = this.staffDetailForm.value;
                        request = {
                            ...request,
                            dateOfBirth: new Date(request.dateOfBirth).getTime(),
                            efectiveDate: new Date(request.efectiveDate).getTime(),
                            expirationDate: request.expirationDate ? new Date(request.expirationDate).getTime() : null,
                        };
                        this._staffService.update(request).subscribe((result) => {
                            if (result.errorCode === '0') {
                                this.backEvent.emit(true);
                                this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                            } else {
                                this._fuseAlertService.showMessageError(result.message);
                            }
                        });
                    }
                }
            });
        }
    }

    edit(): void {
        this.screenMode = 1;
    }

    onMobileInput(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        const checkMobile = /^\d*\.?\d*$/.test(value);

        if (!checkMobile) {
            this.staffDetailForm.controls.mobile.setValue(value.slice(0, -1));
        }
    }

    private initForm(data?: AdmAccountDetailDTO): void {
        this.oldAvata = data?.avatar || '';
        this.staffDetailForm = this._formBuilder.group({
            admAccountId: new FormControl(data ? data.admAccountId : null),
            admAccountDetailId: new FormControl(data ? data.admAccountDetailId : null),

            accountName: new FormControl({value: data ? data.accountName : null, disabled: !!data}, [
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(50),
                forbiddenUserNameValidator()]),
            passwd: new FormControl({value: null, disabled: !!data},
                [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.maxLength(50),
                    forbiddenPasswordValidator()]),
            mobile: new FormControl(data ? data.mobile : null, [
                Validators.required,
                Validators.minLength(10),
                Validators.maxLength(11),
                forbiddenPhoneNumberValidator()]),
            email: new FormControl(data ? data.email : null, [Validators.required, Validators.email, Validators.maxLength(100)]),

            avatar: new FormControl(data ? data.avatar : null, []),
            fullName: new FormControl(data ? data.fullName : null, [Validators.required, Validators.maxLength(50)]),
            gender: new FormControl(data ? data.gender : null, [Validators.required]),

            dateOfBirth: new FormControl(data ? new Date(data.dateOfBirth) : null, [Validators.required]),
            admDepartmentsId: new FormControl(data ? data.admDepartmentsId : null, [Validators.required]),
            admCategoriesId: new FormControl(data ? data.admCategoriesId : null, [Validators.required]),
            admGroupRoleId: new FormControl(data ? data.admGroupRoleId : null, [Validators.required]),
            role: new FormControl(data ? data.role : null, [Validators.required]),

            efectiveDate: new FormControl(data ? new Date(data.efectiveDate) : new Date(), [Validators.required]),
            expirationDate: new FormControl((data && data.expirationDate) ? new Date(data.expirationDate) : null),
            note: new FormControl(data ? data.note : null, Validators.maxLength(100)),
            // denyIps: new FormControl(data ? data.denyIps : null),
            // allowIps: new FormControl(data ? data.allowIps : null),
            status: new FormControl(data ? data.status : UserStatus.ACTIVE)
        });
    }

    public getErrorAccount(): string {
        if (this.staffDetailForm.get('accountName')?.hasError('required')) {
            return 'QLNV004';
        }

        if (this.staffDetailForm.get('accountName')?.hasError('forbiddenUserName') ||
            this.staffDetailForm.get('accountName')?.hasError('minlength') ||
            this.staffDetailForm.get('accountName')?.hasError('maxlength')) {
            return 'QLNV005';
        }
    }

    public getErrorPassword(): string {
        if (this.staffDetailForm.get('passwd')?.hasError('required')) {
            return 'QLNV007';
        }

        if (this.staffDetailForm.get('passwd')?.hasError('forbiddenPassword') ||
            this.staffDetailForm.get('passwd')?.hasError('minlength') ||
            this.staffDetailForm.get('passwd')?.hasError('maxlength')) {
            return 'QLNV008';
        }
    }

    public getErrorMobile(): string {
        if (this.staffDetailForm.get('mobile')?.hasError('required')) {
            return 'QLNV013';
        }

        if (this.staffDetailForm.get('mobile')?.hasError('forbiddenPhoneNumber') ||
            this.staffDetailForm.get('mobile')?.hasError('minlength') ||
            this.staffDetailForm.get('mobile')?.hasError('maxlength')) {
            return 'QLNV014';
        }
    }
}
