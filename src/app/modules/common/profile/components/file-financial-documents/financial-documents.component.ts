import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileService, ProfileService} from '../../../../../service/common-service';
import {Subscription, tap} from 'rxjs';
import {AdmAccountDetailDTO, FsDocuments} from '../../../../../models/admin';
import {MatDrawer} from '@angular/material/sidenav';
import {MatDialog} from '@angular/material/dialog';
import {UploadFileDialogComponent} from '../../../../../shared/components/dialog/upload-file/upload-file.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';

@Component({
    selector: 'financial-documents',
    templateUrl: './financial-documents.component.html',
})
export class FinancialDocumentsComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    financialDocumentsForm: FormGroup;
    selectedFile: FsDocuments;
    subscription: Subscription = new Subscription();
    accountDetail: AdmAccountDetailDTO;
    public lstConfig: any[];
    public configFile = [{
        topTitle: 'Báo cáo tài chính thuế 2 năm gần nhất với xác nhận của cơ quan thuế ' +
            'hoặc BCTC đã kiểm toán bao gồm: Bảng cân đối kế toán, Báo cáo kết quả hoạt động kinh doanh, Báo cáo lưu chuyển tiền tệ, Bản thuyết minh BCTC, ...',
        field: 'financialDocuments',
        multiple: true,
        styleInput: 'h-24 mt-[3px]',
        type: 'file',
        maxFile: 10,
        maxFileSize: 10,
        accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf'
    }];
    configFile1 = [{
        topTitle: 'Chi tiết các sổ phải thu, phải trả, hàng tồn kho, tài sản cố định',
        field: 'financialDocuments',
        multiple: true,
        styleInput: 'h-24 mt-[3px]',
        type: 'file',
        maxFile: 10,
        maxFileSize: 10,
        accept: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf'
    }];
    configFile2 = [{
        topTitle: 'Tờ khai VAT',
        field: 'financialDocuments',
        multiple: true,
        styleInput: 'h-24 mt-[3px]',
        type: 'file',
        maxFile: 10,
        maxFileSize: 10,
        accept: 'image/png, image/jpg, image/jpeg, application/pdf'
    }];
    configFile3 = [{
        topTitle: 'Sao kê tài khoản ngân hàng',
        field: 'financialDocuments',
        multiple: true,
        styleInput: 'h-24 mt-[3px]',
        type: 'file',
        maxFile: 10,
        maxFileSize: 20,
        accept: 'image/png, image/jpg, image/jpeg, application/pdf'
    }];

    constructor(
        private _fb: FormBuilder,
        private _fileService: FileService,
        private _profileService: ProfileService,
        private _matDialog: MatDialog,
        private _fuseAlert: FuseAlertService,
    ) {
        this.lstConfig = [
            {
                title: 'Báo cáo tài chính thuế 2 năm gần nhất với xác nhận của cơ quan thuế ' +
                    'hoặc BCTC đã kiểm toán bao gồm: Bảng cân đối kế toán, Báo cáo kết quả hoạt động kinh doanh, Báo cáo lưu chuyển tiền tệ, Bản thuyết minh BCTC, ...',
                config: this.configFile,
                key: 'financialDocuments',
                lstFile: [],
            },
            {
                title: 'Chi tiết các sổ phải thu, phải trả, hàng tồn kho, tài sản cố định',
                config: this.configFile1,
                key: 'financialDocuments1',
                lstFile: [],
            },
            {
                title: 'Tờ khai VAT',
                config: this.configFile2,
                key: 'financialDocuments2',
                lstFile: [],
            },
            {
                title: 'Sao kê tài khoản ngân hàng',
                config: this.configFile3,
                key: 'financialDocuments3',
                lstFile: [],
            },
        ]
    }

    ngOnInit(): void {
        this.subscription.add(
            this._profileService.profilePrepare$.pipe(
                tap((res) => {
                    this.accountDetail = res.accountDetail;
                    if (res && res.accountDetail?.financialDocuments) {
                        this._fileService.getDetailFiles(res.accountDetail?.financialDocuments).subscribe(
                            files => this.lstConfig.map(x => x.key == 'financialDocuments' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.financialDocuments1) {
                        this._fileService.getDetailFiles(res.accountDetail?.financialDocuments1).subscribe(
                            files => this.lstConfig.map(x => x.key == 'financialDocuments1' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.financialDocuments2) {
                        this._fileService.getDetailFiles(res.accountDetail?.financialDocuments2).subscribe(
                            files => this.lstConfig.map(x => x.key == 'financialDocuments2' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.financialDocuments3) {
                        this._fileService.getDetailFiles(res.accountDetail?.financialDocuments3).subscribe(
                            files => this.lstConfig.map(x => x.key == 'financialDocuments3' ? x.lstFile = files.payload : x.lstFile));
                    }
                })
            ).subscribe()
        );
        this.initForm();
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Hồ sơ tài chính')
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.financialDocumentsForm = this._fb.group({
            financialDocuments: '',
        });
    }

    viewDetailFile(file: FsDocuments, colume: string): void {
        this.selectedFile = file;
        this.selectedFile.colume = colume;
        this.fileDrawer.open();
        if (['JPG', 'JPEG', 'PNG'].includes(file.type.toUpperCase())) {
            this._fileService.getFileFromServer(file.finDocumentsId + '').subscribe(
                res => {
                    this.selectedFile = res.payload;
                    this.selectedFile.colume = colume;
                }
            );
        }
    }

    clickUploadFinancialDocuments(config: any, key: string, action?: string): void {
        const dialog = this._matDialog.open(UploadFileDialogComponent, {
            disableClose: true,
            data: {
                title: 'Cập nhật hồ sơ tài chính',
                config: config,
                formGroup: this.financialDocumentsForm,
            }
        });
        dialog.afterClosed().subscribe((res) => {
            if ( res === 'confirmed' ) {
                let filesId = "";
                if (action == 'replace') {
                    let fileId = this.financialDocumentsForm.get('financialDocuments').value;
                    let newFile  = new FsDocuments();
                    newFile.finDocumentsId = fileId;
                    filesId = this._profileService.replaceFile(this.getOldValueByKey(key), this.selectedFile, newFile);
                } else {
                    filesId = this._profileService.chainFileCode(
                        this.getOldValueByKey(key),
                        this.financialDocumentsForm
                    );
                }
                this.updateOrCreateFile({[key]: filesId})
            }
        });
    }

    getOldValueByKey(key): string {
        switch (key) {
            case 'financialDocuments':
                return this.accountDetail.financialDocuments;
            case 'financialDocuments1':
                return this.accountDetail.financialDocuments1;
            case 'financialDocuments2':
                return this.accountDetail.financialDocuments2;
            case 'financialDocuments3':
                return this.accountDetail.financialDocuments3;
            default:
                break;
        }
    }

    onReplaceFile(selectedFile: FsDocuments): void {
        switch (selectedFile.colume) {
            case 'financialDocuments':
                this.clickUploadFinancialDocuments(this.configFile, 'financialDocuments', 'replace');
                break;
            case 'financialDocuments1':
                this.clickUploadFinancialDocuments(this.configFile1, 'financialDocuments1', 'replace');
                break;
            case 'financialDocuments2':
                this.clickUploadFinancialDocuments(this.configFile2, 'financialDocuments2', 'replace');
                break;
            case 'financialDocuments3':
                this.clickUploadFinancialDocuments(this.configFile3, 'financialDocuments3', 'replace');
                break;
            default:
                break;
        }
    }

    updateOrCreateFile(payload): void {
        this._profileService.updateDocument({
            ...payload,
            admAccountDetailId: this.accountDetail.admAccountDetailId,
        }).subscribe((response) => {
            if (response.errorCode === '0') {
                this._fuseAlert.showMessageSuccess('Tải lên thành công');
                this._profileService.getPrepareLoadingPage().subscribe();
            } else {
                this._fuseAlert.showMessageError(response.message.toString());
            }
        });
    }
}
