import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {AuthService} from 'app/core/auth/auth.service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {APP_TEXT} from 'app/shared/constants';
import {SpEmailConfigDTO} from '../../../models/service/SpEmailConfigDTO.model';
import {EmailConfigService} from '../../../service/admin/email-config.service';
import {ISelectModel} from './../../../shared/models/select.model';

@Component({
    selector: 'app-email-config',
    templateUrl: './email-config.component.html',
    styleUrls: ['./email-config.component.scss'],
    providers: [DateTimeformatPipe]
})
export class EmailConfigComponent implements OnInit {
    public emailConfigForm: FormGroup = new FormGroup({});
    public encodeTypes: Array<ISelectModel> = [
        { id: 0, label: 'None' },
        { id: 1, label: 'SSL' },
        { id: 2, label: 'TSL' },
    ];

    constructor(
        private _emailService: EmailConfigService,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this.initForm();
        this._emailService.emailConfig$.subscribe((res) => {
            this.initForm(res);
        });
    }

    submit(): void {
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
                const request = this.emailConfigForm.value;
                request.isDefault = this.emailConfigForm.value.isDefault ? 1 : 0;
                request.isUse = this.emailConfigForm.value.isUse ? 1 : 0;
                request.requireAuth = this.emailConfigForm.value.requireAuth ? 1 : 0;
                this._emailService.updateEmailConfig(request).subscribe((result) => {
                    if (result.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                    } else {
                        // this._fuseAlertService.showMessageError(response.message.toString());
                        this._fuseAlertService.showMessageError(result.message);
                    }
                });
            }
        });
    }

    private initForm(data?: SpEmailConfigDTO): void {
        this.emailConfigForm = this._formBuilder.group({
            spEmailConfigId: new FormControl(data ? data.spEmailConfigId : null),
            displayName: new FormControl(data ? data.displayName : null, [Validators.required, Validators.maxLength(100)]),
            username: new FormControl(data ? data.username : null, [Validators.required,
                Validators.maxLength(255)]),
            fromEmail: new FormControl(data ? data.fromEmail : null, [Validators.required, Validators.email, Validators.maxLength(255)]),
            password: new FormControl(data ? data.password : null, [Validators.required]),
            smtpServer: new FormControl(data ? data.smtpServer : null, [Validators.required, Validators.maxLength(50)]),
            smtpPort: new FormControl(data ? data.smtpPort : null, [Validators.required]),
            encodeType: new FormControl(data ? data.encodeType : null),
            requireAuth: new FormControl(data ? data.requireAuth : null),
            isDefault: new FormControl(data ? data.isDefault : null),
            isUse: new FormControl(data ? data.isUse : null),

            createdByName: new FormControl({
                value: data ? data.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: data ? this._datetimePipe.transform(data.createdDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: data ? data.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: data ? this._datetimePipe.transform(data.lastUpdatedDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
    }

}
