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
    selector: 'legal-documents',
    templateUrl: './legal-documents.component.html',
})
export class LegalDocumentsComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    legalDocumentsForm: FormGroup;
    selectedFile: FsDocuments;
    subscription: Subscription = new Subscription();
    accountDetail: AdmAccountDetailDTO;
    public lstConfig: any[];
    public lstTitle: string[] = [
        'Giấy chứng nhận đăng ký kinh doanh (bản thay đổi gần nhất)',
        'CCCD/Hộ chiếu của Đại diện pháp luật và các cổ đông lớn nhất (mặt trước)',
        'CCCD/Hộ chiếu của Đại diện pháp luật và các cổ đông lớn nhất  ( mặt sau)',
        'Đăng ký mẫu dấu, chứng chỉ ngành nghề hoặc giấy chứng nhận đủ điều kiện kinh doanh',
        'Quyết định bổ nhiệm kế toán trưởng',
        'Điều lệ công ty',
        'Danh sách thành viên Hội đồng quản trị/ Hội đồng thành viên',
        'Quyết định bổ nhiệm Người đại diện trước pháp luật',
        'Bản công bố các cá nhân liên quan (bố mẹ, vợ hoặc chồng) của Người chịu trách nhiệm trước pháp luật hoặc cổ đông lớn nhất',
        'Biên bản /nghị quyết ( Hội đồng quản trị/ hội đồng thành viên)'];

    public configFile;
    public configFile1;
    public configFile2;
    public configFile3;
    public configFile4;
    public configFile5;
    public configFile6;
    public configFile7;
    public configFile8;
    public configFile9;
    constructor(
        private _fb: FormBuilder,
        private _fileService: FileService,
        private _profileService: ProfileService,
        private _matDialog: MatDialog,
        private _fuseAlert: FuseAlertService,
    ) {
        // accept: 'application/VND.ms-excel,application/VND.openxmlformats-officedocument.spreadsheetml.sheet'

        this.configFile = [{
            topTitle: this.lstTitle[0],
            field: 'legalDocuments',
            multiple: false,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 1,
            maxFileSize: 5,
            accept: 'image/png, image/jpg, image/jpeg, application/pdf'
        }];
        this.configFile1 = [{
            topTitle:this.lstTitle[1],
            field: 'legalDocuments',
            multiple: false,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 1,
            maxFileSize: 5,
            accept: 'image/png, image/jpg, image/jpeg, application/pdf'
        }];
        this.configFile2 = [{
            topTitle: this.lstTitle[2],
            field: 'legalDocuments',
            multiple: false,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 1,
            maxFileSize: 5,
            accept: 'image/png, image/jpg, image/jpeg, application/pdf'
        }];
        this.configFile3 = [{
            topTitle: this.lstTitle[3],
            field: 'legalDocuments',
            multiple: true,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 10,
            maxFileSize: 10,
            accept: 'image/png, image/jpg, image/jpeg, application/pdf'
        }];
        this.configFile4 = [{
            topTitle: this.lstTitle[4],
            field: 'legalDocuments',
            multiple: true,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 10,
            maxFileSize: 10,
            accept: 'application/msword, application/VND.openxmlformats-officedocument.wordprocessingml.document, application/pdf'
        }];
        this.configFile5 = [{
            topTitle: this.lstTitle[5],
            field: 'legalDocuments',
            multiple: true,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 10,
            maxFileSize: 20,
            accept: 'application/VND.ms-excel, application/VND.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/VND.openxmlformats-officedocument.wordprocessingml.document, application/pdf'
        }];
        this.configFile6 = [{
            topTitle: this.lstTitle[6],
            field: 'legalDocuments',
            multiple: true,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 10,
            maxFileSize: 10,
            accept: 'application/VND.ms-excel, application/VND.openxmlformats-officedocument.spreadsheetml.sheet, application/msword, application/VND.openxmlformats-officedocument.wordprocessingml.document, application/pdf'
        }];
        this.configFile7 = [{
            topTitle: this.lstTitle[7],
            field: 'legalDocuments',
            multiple: true,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 10,
            maxFileSize: 10,
            accept: 'application/msword, application/VND.openxmlformats-officedocument.wordprocessingml.document, application/pdf'
        }];
        this.configFile8 = [{
            topTitle: this.lstTitle[8],
            field: 'legalDocuments',
            multiple: true,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 10,
            maxFileSize: 10,
            accept: 'application/msword, application/VND.openxmlformats-officedocument.wordprocessingml.document, application/pdf'
        }];
        this.configFile9 = [{
            topTitle: this.lstTitle[9],
            field: 'legalDocuments',
            multiple: true,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 10,
            maxFileSize: 10,
            accept: 'image/png, image/jpg, image/jpeg, application/pdf,application/msword, application/VND.openxmlformats-officedocument.wordprocessingml.document'
        }];

        this.lstConfig = [
            {
                title: this.lstTitle[0],
                config: this.configFile,
                key: 'legalDocuments',
                lstFile: [],
            },
            {
                title: this.lstTitle[1],
                config: this.configFile1,
                key: 'legalDocuments1',
                lstFile: [],
            },
            {
                title: this.lstTitle[2],
                config: this.configFile2,
                key: 'legalDocuments2',
                lstFile: [],
            },
            {
                title: this.lstTitle[3],
                config: this.configFile3,
                key: 'legalDocuments3',
                lstFile: [],
            },
            {
                title: this.lstTitle[4],
                config: this.configFile4,
                key: 'legalDocuments4',
                lstFile: [],
            },
            {
                title: this.lstTitle[5],
                config: this.configFile5,
                key: 'legalDocuments5',
                lstFile: [],
            },
            {
                title: this.lstTitle[6],
                config: this.configFile6,
                key: 'legalDocuments6',
                lstFile: [],
            },
            {
                title: this.lstTitle[7],
                config: this.configFile7,
                key: 'legalDocuments7',
                lstFile: [],
            },
            {
                title: this.lstTitle[8],
                config: this.configFile8,
                key: 'legalDocuments8',
                lstFile: [],
            },
            {
                title: this.lstTitle[9],
                config: this.configFile9,
                key: 'legalDocuments9',
                lstFile: [],
            },
        ]
    }

    ngOnInit(): void {
        this.subscription.add(
            this._profileService.profilePrepare$.pipe(
                tap((res) => {
                    this.accountDetail = res.accountDetail;
                    if (res && res.accountDetail?.legalDocuments) {
                        this._fileService.getDetailFiles(res.accountDetail?.legalDocuments).subscribe(
                            files => this.lstConfig.map(x => x.key == 'legalDocuments' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.legalDocuments1) {
                        this._fileService.getDetailFiles(res.accountDetail?.legalDocuments1).subscribe(
                            files => this.lstConfig.map(x => x.key == 'legalDocuments1' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.legalDocuments2) {
                        this._fileService.getDetailFiles(res.accountDetail?.legalDocuments2).subscribe(
                            files => this.lstConfig.map(x => x.key == 'legalDocuments2' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.legalDocuments3) {
                        this._fileService.getDetailFiles(res.accountDetail?.legalDocuments3).subscribe(
                            files => this.lstConfig.map(x => x.key == 'legalDocuments3' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.legalDocuments4) {
                        this._fileService.getDetailFiles(res.accountDetail?.legalDocuments4).subscribe(
                            files => this.lstConfig.map(x => x.key == 'legalDocuments4' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.legalDocuments5) {
                        this._fileService.getDetailFiles(res.accountDetail?.legalDocuments5).subscribe(
                            files => this.lstConfig.map(x => x.key == 'legalDocuments5' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.legalDocuments6) {
                        this._fileService.getDetailFiles(res.accountDetail?.legalDocuments6).subscribe(
                            files => this.lstConfig.map(x => x.key == 'legalDocuments6' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.legalDocuments7) {
                        this._fileService.getDetailFiles(res.accountDetail?.legalDocuments7).subscribe(
                            files => this.lstConfig.map(x => x.key == 'legalDocuments7' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.legalDocuments8) {
                        this._fileService.getDetailFiles(res.accountDetail?.legalDocuments8).subscribe(
                            files => this.lstConfig.map(x => x.key == 'legalDocuments8' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.legalDocuments9) {
                        this._fileService.getDetailFiles(res.accountDetail?.legalDocuments9).subscribe(
                            files => this.lstConfig.map(x => x.key == 'legalDocuments9' ? x.lstFile = files.payload : x.lstFile));
                    }
                })
            ).subscribe()
        );
        this.initForm();
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Hồ sơ pháp lý')
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.legalDocumentsForm = this._fb.group({
            legalDocuments: '',
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

    clickUploadLegalDocuments(config: any, key: string, action?: string): void {
        const dialog = this._matDialog.open(UploadFileDialogComponent, {
            disableClose: true,
            data: {
                title: 'Cập nhật hồ sơ pháp lý',
                config: config,
                formGroup: this.legalDocumentsForm,
            }
        });

        dialog.afterClosed().subscribe((res) => {
            if ( res === 'confirmed' ) {
                let filesId = "";
                if (action == 'replace') {
                    let fileId = this.legalDocumentsForm.get('legalDocuments').value;
                    let newFile = new FsDocuments();
                    newFile.finDocumentsId = fileId;
                    filesId = this._profileService.replaceFile(this.getOldValueByKey(key), this.selectedFile, newFile);
                } else {
                    filesId = this._profileService.chainFileCode(
                        this.getOldValueByKey(key),
                        this.legalDocumentsForm
                    );
                }
                this.updateOrCreateFile({[key]: filesId})
            }
        });
    }

    getOldValueByKey(key): string {
        switch (key) {
            case 'legalDocuments':
                return this.accountDetail.legalDocuments;
            case 'legalDocuments1':
                return this.accountDetail.legalDocuments1;
            case 'legalDocuments2':
                return this.accountDetail.legalDocuments2;
            case 'legalDocuments3':
                return this.accountDetail.legalDocuments3;
            case 'legalDocuments4':
                return this.accountDetail.legalDocuments4;
            case 'legalDocuments5':
                return this.accountDetail.legalDocuments5;
            case 'legalDocuments6':
                return this.accountDetail.legalDocuments6;
            case 'legalDocuments7':
                return this.accountDetail.legalDocuments7;
            case 'legalDocuments8':
                return this.accountDetail.legalDocuments8;
            case 'legalDocuments9':
                return this.accountDetail.legalDocuments9;
            default:
                break;
        }
    }

    onReplaceFile(selectedFile: FsDocuments): void {
        switch (selectedFile.colume) {
            case 'legalDocuments':
                this.clickUploadLegalDocuments(this.configFile, 'legalDocuments', 'replace');
                break;
            case 'legalDocuments1':
                this.clickUploadLegalDocuments(this.configFile1, 'legalDocuments1', 'replace');
                break;
            case 'legalDocuments2':
                this.clickUploadLegalDocuments(this.configFile2, 'legalDocuments2', 'replace');
                break;
            case 'legalDocuments3':
                this.clickUploadLegalDocuments(this.configFile3, 'legalDocuments3', 'replace');
                break;
            case 'legalDocuments4':
                this.clickUploadLegalDocuments(this.configFile4, 'legalDocuments4', 'replace');
                break;
            case 'legalDocuments5':
                this.clickUploadLegalDocuments(this.configFile5, 'legalDocuments5', 'replace');
                break;
            case 'legalDocuments6':
                this.clickUploadLegalDocuments(this.configFile6, 'legalDocuments6', 'replace');
                break;
            case 'legalDocuments7':
                this.clickUploadLegalDocuments(this.configFile7, 'legalDocuments7', 'replace');
                break;
            case 'legalDocuments8':
                this.clickUploadLegalDocuments(this.configFile8, 'legalDocuments8', 'replace');
                break;
            case 'legalDocuments9':
                this.clickUploadLegalDocuments(this.configFile9, 'legalDocuments9', 'replace');
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
                this.fileDrawer.close();
            } else {
                this._fuseAlert.showMessageError(response.message.toString());
            }
        });
    }
}
