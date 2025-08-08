import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject, Observable} from 'rxjs';

import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {AuthService} from 'app/core/auth/auth.service';
import {Status} from 'app/enum';
import {SpNotificationConfigDTO} from 'app/models/service/SpNotificationConfigDTO.model';
import {NotificationConfigService} from 'app/service/admin/notification-config.service';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';

import {AdmAccountDetailDTO} from '../../../../../models/admin';
import {SpNotificationModuleDTO} from '../../../../../models/service/SpNotificationModuleDTO.model';
import {ISelectModel} from '../../../../../shared/models/select.model';

@Component({
    selector: 'app-setting-notification-detail',
    templateUrl: './setting-notification-detail.component.html',
    styleUrls: ['./setting-notification-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DateTimeformatPipe]
})
export class SettingNotificationDetailComponent implements OnInit {

    public notificationForm: FormGroup = new FormGroup({});
    public status: Array<ISelectModel> = [
        { id: 1, label: 'Hoạt động' },
        { id: 2, label: 'Không hoạt động' }
    ];
    public sendTo: Array<ISelectModel> = [
        { id: 1, label: 'Người xử lí' }
    ];
    public conditions: Array<ISelectModel> = [
        { id: 1, label: 'Trước' },
        // { id: 2, label: 'Sau' },
        // { id: 3, label: 'Ngay lập tức' }
    ]

    public _listModule = new Array<SpNotificationModuleDTO>();
    public _listSendExt = new Observable<AdmAccountDetailDTO[]>();
    public _listEvent = new Array<SpNotificationModuleDTO>();
    public _listExtPicked = new Array<AdmAccountDetailDTO>();
    public _listExt = new Array<AdmAccountDetailDTO>();
    public _filteredListExt = new Array<AdmAccountDetailDTO>();

    constructor(
        private matDialogRef: MatDialogRef<SettingNotificationDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: SpNotificationConfigDTO,
        private _settingNotifyService: NotificationConfigService,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
        private _cdf: ChangeDetectorRef,
        private confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) {
    }

    ngOnInit(): void {
        this.initData();
        this.initForm(this.data);
    }

    ngAfterViewInit(): void {
        /* this._settingNotifyService._notificationDetail.subscribe((res) => {
             if (res ) {
                 if (res.spNotificationConfigId > 0) {
                     this.data = res;
                     this.initForm(res);
                     this.initData();
                     this._cdf.detectChanges();
                 }
             }
         });*/
    }



    discard(): void {
        if (this.notificationForm.dirty) {
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
            const dialog = this.confirmService.open(config);
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this.matDialogRef.close(false);
                }
            });
            return;
        }
        this.matDialogRef.close(false);
    }

    submit(): void {
        this.notificationForm.markAllAsTouched();
        if (this.notificationForm.valid && !(this.notificationForm.value.sendNotify == false && this.notificationForm.value.sendEmail == false)) {
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
            const dialog = this.confirmService.open(config);
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed' && this.notificationForm.valid) {
                    const request = this.notificationForm.value;
                    request.sendNotify = this.notificationForm.value.sendNotify? 1: 0;
                    request.sendEmail = this.notificationForm.value.sendEmail? 1: 0;

                    if (this.data?.spNotificationConfigId) {
                        this._settingNotifyService.update(request).subscribe((result) => {
                            if (result.errorCode === '0') {
                                this.matDialogRef.close(true);
                                this._fuseAlertService.showMessageSuccess("CHCB034");
                            } else {
                                this._fuseAlertService.showMessageError(result.message);
                            }
                        });
                    } else {
                        this._settingNotifyService.create(request).subscribe((result) => {
                            if (result.errorCode === '0') {
                                this.matDialogRef.close(true);
                                this._fuseAlertService.showMessageSuccess("CHCB033");
                            } else {
                                this._fuseAlertService.showMessageError(result.message);
                            }
                        });
                    }
                }
            });
        }
    }

    private initForm(data?: SpNotificationConfigDTO): void {
        if (data?.module) {
            this._listEvent = this._listModule.find(value => value.id === data.module)?.listAction;
        }

        this.notificationForm = this._formBuilder.group({
            spNotificationConfigId: new FormControl(data ? data.spNotificationConfigId : null),
            configName: new FormControl(data ? data.configName : null, [
                Validators.required,
                Validators.maxLength(100),
                // Validators.pattern("[a-zA-Z0-9_,\\-]*")
            ]),
            module: new FormControl(data?.module ? data.module : null, [Validators.required]),
            action: new FormControl(data?.action ? data.action : null, [Validators.required]),
            condition: new FormControl(data?.condition ? data.condition : 1, [Validators.required]),
            conditionValue: new FormControl(data?.conditionValue ? data.conditionValue : null,
                [Validators.required, Validators.maxLength(15), Validators.pattern(/^\d+$/)]),
            title: new FormControl(data ? data.title : null, [
                Validators.required,
                Validators.maxLength(120),
                // Validators.pattern("[a-zA-Z0-9_,-]*")
            ]),
            body: new FormControl(data ? data.body : null, [Validators.required, Validators.maxLength(500)]),

            sendEmail: new FormControl((data && data?.sendEmail == 1) ? true : false),
            sendNotify: new FormControl((data && data?.sendNotify == 1) ? true : false),
            status: new FormControl( {
                value: (data?.status == 0) ? Status.INACTIVE : Status.ACTIVE,
                disabled : true
            }),
            sendTo: new FormControl(1, [Validators.required]),
            sendToExt: new FormControl(data?.sendToExt ? data.sendToExt : null, [Validators.required]),

            createdByName: new FormControl({
                value: data && data.createdByName ? data.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: data && data.createdDate ? this._datetimePipe.transform(data.createdDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: data && data.lastUpdatedByName ? data.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: data && data.lastUpdatedDate ? this._datetimePipe.transform(data.lastUpdatedDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
        this.detectPassiveNotification();

        this.notificationForm.get('action').valueChanges.subscribe(res => {
            this.detectPassiveNotification();
        });

        if (data?.spNotificationConfigId) {
            this.notificationForm.controls['module'].disable();
            this.notificationForm.controls['action'].disable();
            this.notificationForm.controls['condition'].disable();
        } else {
            this.notificationForm.controls['module'].enable();
            this.notificationForm.controls['action'].enable();
            this.notificationForm.controls['condition'].enable();
        }
    }

    public detectPassiveNotification() {
        if (this.notificationForm?.get('module')?.value === 1
            && (this.notificationForm?.get('action')?.value === 1 || this.notificationForm?.get('action')?.value === 2)) {
            this.notificationForm.controls['conditionValue'].enable();
            this.notificationForm.controls['condition'].enable();
        } else {
            this.notificationForm.controls['conditionValue'].disable();
            this.notificationForm.controls['condition'].disable();
        }
    }

    private initData(): void {
        this._settingNotifyService.prepare$?.subscribe(res => {
            if (res) {
                this._listModule = res.payload.lstModule;
                this._listSendExt = new BehaviorSubject(res.payload.lstSendExt).asObservable();
            }
        });
        this._listSendExt.subscribe(response => {
            if (response) {
                this._listExt = response;
                this._filteredListExt = this._listExt;
                this.initSendToExtData();
            }
        });

    }

    onSelect(event: any, item: SpNotificationModuleDTO) {
        if (item && event.isUserInput) {
            this.notificationForm.get("module").setValue(item.id);
            this.notificationForm.get("action").reset();
            this._listEvent = item.listAction;
            this._cdf.detectChanges();
        }
    }

    onAddExt(event: any, item: AdmAccountDetailDTO) {
        if (item && event.isUserInput
            && this._listExtPicked.findIndex(account => (account.admAccountDetailId === item.admAccountDetailId)) === -1) {
            this._listExtPicked.push(item);

            this.notificationForm.patchValue({
                sendToExt: this._listExtPicked.map(value => value.admAccountDetailId.toString()).join(',')
            });
        }
    }

    onRemoveExt(item: AdmAccountDetailDTO) {
        this._listExtPicked.splice(this._listExtPicked.findIndex(account => (account.admAccountDetailId === item.admAccountDetailId)), 1);
    }

    onSelectSendTo(event: any, item: ISelectModel) {
        if (item.id === 1) {
            this._listSendExt.subscribe(response => {
                if (response) {
                    this._listExt = response;
                    this._filteredListExt = this._listExt;
                    this.initSendToExtData();
                }
            });
        }
    }

    private initSendToExtData() {
        let rs: string[] = this.data?.sendToExt?.split(',');

        rs?.forEach(r => {
            if (this._listExt.some(item => (item.admAccountDetailId.toString() === r))
                && !this._listExtPicked.some(item => (item.admAccountDetailId.toString() === r)))
                this._listExtPicked.push(this._listExt.find(account => (account.admAccountDetailId.toString() === r)));
        });
    }

    public filterExt(event: any) {
        let input: string = (event.target as HTMLInputElement).value;

        if (input?.length > 0 && this._listExt?.length > 0) {
            let _filterValue = input.toLowerCase();

            this._filteredListExt = this._listExt.filter(option => {
                const optionValue = option.fullName.toLowerCase();
                return optionValue.toLowerCase().indexOf(_filterValue) !== -1;
            });
        } else if (this._listExt?.length > 0) {
            this._filteredListExt = this._listExt;
        }
    }
}
