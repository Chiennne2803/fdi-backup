import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileService, ProfileService} from '../../../../../service/common-service';
import {Subscription, tap} from 'rxjs';
import {AdmAccountDetailDTO, AdmCategoriesDTO, FsDocuments} from '../../../../../models/admin';
import {MatDrawer} from '@angular/material/sidenav';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {APP_TEXT} from '../../../../../shared/constants';
import {DialogService} from '../../../../../service/common-service/dialog.service';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {UploadFileDialogComponent} from '../../../../../shared/components/dialog/upload-file/upload-file.component';
import {MatDialog} from '@angular/material/dialog';
import {AuthService} from "../../../../../core/auth/auth.service";

@Component({
    selector: 'economic-info',
    templateUrl: './economic-info.component.html',
})
export class EconomicInfoComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    economicInfoFiles: FsDocuments[];
    economicInfo: AdmAccountDetailDTO;
    selectedFile: FsDocuments;
    subscription: Subscription = new Subscription();
    economicForm: FormGroup;
    fileForm: FormGroup;
    isEditable: boolean = false;
    bctcCodeList: AdmCategoriesDTO[];
    bcltList: AdmCategoriesDTO[];
    message = APP_TEXT;

    constructor(
        private _fb: FormBuilder,
        private _fileService: FileService,
        private _profileService: ProfileService,
        private authService: AuthService,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.subscription.add(
            this._profileService.profilePrepare$.pipe(
                tap((res) => {
                    this.economicInfo = res.accountDetail;
                    this.bctcCodeList = res?.bctcCode;
                    this.bcltList = res?.bclt;
                    if (res && res.accountDetail?.economicInfoDocuments) {
                        this._fileService.getDetailFiles(res.accountDetail.economicInfoDocuments).subscribe(
                            files => this.economicInfoFiles = files.payload
                        );
                    }
                    this.initForm();
                })
            ).subscribe()
        );
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Thông tin tài chính chi tiết')
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.economicForm = this._fb.group({
            admAccountDetailId: this.economicInfo.admAccountDetailId,
            financeCheck: this._fb.control({
                value: this.economicInfo?.financeCheck,
                disabled: !this.isEditable
            }, Validators.required),
            moneyTranferReportCheck: this._fb.control({
                value: this.economicInfo?.moneyTranferReportCheck,
                disabled: !this.isEditable
            }, Validators.required),
            financeTime: this._fb.control({
                value: this.economicInfo?.financeTime,
                disabled: !this.isEditable
            }),
            financeLastTime: this._fb.control({
                value: this.economicInfo?.financeLastTime,
                disabled: !this.isEditable
            }),
            economicInfoDocuments: this._fb.control(this.economicInfo.economicInfoDocuments, Validators.required)
        });

        this.fileForm = this._fb.group({
            file1: this._fb.control('', Validators.required)
        });
    }

    public onClickFile(file: FsDocuments): void {
        this.selectedFile = file;
        this.fileDrawer.open();
        if (['JPG', 'JPEG', 'PNG'].includes(file.type.toUpperCase())) {
            this._fileService.getFileFromServer(file.finDocumentsId + '').subscribe(
                res => this.selectedFile = res.payload
            );
        }
    }

    isEditing(): void {
        this.isEditable = true;
        this.changeStateControl();
    }

    cancelEditing(): void {
        if (this.economicForm.dirty) {
            const dialog = this._dialogService.openConfirmDialog('Dữ liệu đang nhập sẽ bị mất');
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this.isEditable = false;
                    this.changeStateControl();
                }
            });
        } else {
            this.isEditable = false;
            this.changeStateControl();
        }
    }

    saveData(): void {
        this.economicForm.markAllAsTouched();
        if (this.economicForm.valid) {
            const dialog = this._dialogService.openConfirmDialog('Xác nhận cập nhật dữ liệu');
            dialog.afterClosed().subscribe((res) => {
                if (res === 'confirmed') {
                    this._profileService.updateEconomicInfo(this.economicForm.value).subscribe((response) => {
                        if (response.errorCode === '0') {
                            this._fuseAlertService.showMessageSuccess('Cập nhật thành công !');
                            this._profileService.getPrepareLoadingPage().subscribe();
                            this.isEditable = false;
                            this.changeStateControl();
                        } else {
                            this._fuseAlertService.showMessageError(response.message.toString());
                        }
                    });
                }
            });
        }
    }

    changeStateControl(): void {
        if (this.isEditable) {
            Object.keys(this.economicForm.controls).forEach((control) => {
                this.economicForm.get(control).enable();
            });
            this.initForm();
        } else {
            Object.keys(this.economicForm.controls).forEach((control) => {
                this.economicForm.get(control).disable();
            });
        }
    }

    uploadEconomicInfoDocuments(): void {
        const dialog = this._matDialog.open(UploadFileDialogComponent,{
                disableClose: true,
                data: {
                    title: 'Cập nhật thông tin tài chính chi tiết',
                    config: [
                        {
                            multiple: false,
                            topTitle: 'Báo cáo tài chính',
                            field: 'file1',
                            styleInput: 'h-24 mt-[3px]',
                            type: 'file',
                            maxFile: 1,
                            accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        },
                    ],
                    formGroup: this.fileForm,
                }
            });

        dialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                const value = this._profileService.chainFileCode(
                    this.economicInfo.economicInfoDocuments,
                    this.fileForm
                );
                this.economicForm.get('economicInfoDocuments').patchValue(this.fileForm.get('file1').value);
                this.updateDocument('Tải lên thành công');
            }
        });
    }

    updateOrCreateData(): void {
        this._profileService.updateAccountDetail({
            ...this.economicForm.value
        }).subscribe((response) => {
            if (response.errorCode === '0') {
                this._fuseAlertService.showMessageSuccess('Tải lên thành công');
                this._profileService.getPrepareLoadingPage().subscribe();
                this.authService.afterUpdateAccountDetail(response.payload);
            } else {
                this._fuseAlertService.showMessageError(response.message.toString());
            }
        });
    }

    updateDocument(msgOk?: string): void {
        this._profileService.updateDocument({
            ...this.economicForm.value
        }).subscribe((response) => {
            if (response.errorCode === '0') {
                this._fuseAlertService.showMessageSuccess(msgOk);
                this._profileService.getPrepareLoadingPage().subscribe();
            } else {
                this._fuseAlertService.showMessageError(response.message.toString());
            }
        });
    }

    onReplaceFile(file: FsDocuments): void {
        this.uploadEconomicInfoDocuments();
    }

    isInvalidForm(control: string): boolean {
        return this.economicForm.get(control).touched && this.economicForm.get(control).hasError('required');
    }
}
