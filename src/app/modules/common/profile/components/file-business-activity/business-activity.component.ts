import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileService, ProfileService} from '../../../../../service/common-service';
import {Subscription, tap} from 'rxjs';
import {AdmAccountDetailDTO, FsDocuments} from '../../../../../models/admin';
import {MatDrawer} from '@angular/material/sidenav';
import {MatDialog} from '@angular/material/dialog';
import {UploadFileDialogComponent} from '../../../../../shared/components/dialog/upload-file/upload-file.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {isArray} from 'lodash';

@Component({
    selector: 'business-activity',
    templateUrl: './business-activity.component.html',
})
export class BusinessActivityComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    businessDocumentsFiles: FsDocuments[];
    businessDocumentsForm: FormGroup;
    selectedFile: FsDocuments;
    subscription: Subscription = new Subscription();
    accountDetail: AdmAccountDetailDTO;

    public lstConfig: any[];
    public lstTitle: string[] = [
        'Ít nhất 03 hợp đồng kinh tế - Hóa đơn mua bán đầu vào với các đối tác tài chính trong vòng 12 tháng gần nhất',
        'Ít nhất 03 hợp đồng kinh tế - Hóa đơn mua bán đầu ra với các đối tác tài chính trong vòng 12 tháng gần nhất',
        'Khác ( Phương án đầu tư, Phương án kinh doanh...)'
    ];
    public configFile;
    public configFile1;
    public configFile2;

    constructor(
        private _fb: FormBuilder,
        private _fileService: FileService,
        private _profileService: ProfileService,
        private _matDialog: MatDialog,
        private _fuseAlert: FuseAlertService,
    ) {
        this.configFile = [{
            topTitle: this.lstTitle[0],
            field: 'businessDocumentation',
            multiple: true,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 10,
            maxFileSize: 20,
            accept: 'image/png, image/jpg, image/jpeg, application/pdf'
        }];
        this.configFile1 = [{
            topTitle:this.lstTitle[1],
            field: 'businessDocumentation',
            multiple: true,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 10,
            maxFileSize: 20,
            accept: 'image/png, image/jpg, image/jpeg, application/pdf'
        }];
        this.configFile2 = [{
            topTitle: this.lstTitle[2],
            field: 'businessDocumentation',
            multiple: true,
            styleInput: 'h-24 mt-[3px]',
            type: 'file',
            maxFile: 10,
            maxFileSize: 20,
            accept: '*'
        }];
        this.lstConfig = [
            {
                title: this.lstTitle[0],
                config: this.configFile,
                key: 'businessDocumentation',
                lstFile: [],
            },
            {
                title: this.lstTitle[1],
                config: this.configFile1,
                key: 'businessDocumentation1',
                lstFile: [],
            },
            {
                title: this.lstTitle[2],
                config: this.configFile2,
                key: 'businessDocumentation2',
                lstFile: [],
            }
        ]
    }

    ngOnInit(): void {
        this.subscription.add(
            this._profileService.profilePrepare$.pipe(
                tap((res) => {
                    this.accountDetail = res.accountDetail;
                    if (res && res.accountDetail?.businessDocumentation) {
                        this._fileService.getDetailFiles(res.accountDetail?.businessDocumentation).subscribe(
                            files => this.lstConfig.map(x => x.key == 'businessDocumentation' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.businessDocumentation1) {
                        this._fileService.getDetailFiles(res.accountDetail?.businessDocumentation1).subscribe(
                            files => this.lstConfig.map(x => x.key == 'businessDocumentation1' ? x.lstFile = files.payload : x.lstFile));
                    }
                    if (res && res.accountDetail?.businessDocumentation2) {
                        this._fileService.getDetailFiles(res.accountDetail?.businessDocumentation2).subscribe(
                            files => this.lstConfig.map(x => x.key == 'businessDocumentation2' ? x.lstFile = files.payload : x.lstFile));
                    }
                })
            ).subscribe()
        );
        this.initForm();
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Tài liệu hoạt động kinh doanh')
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.businessDocumentsForm = this._fb.group({
            businessDocumentation: '',
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

    clickUploadBusinessDocumentation(config: any, key: string, action?: string): void {
        const dialog = this._matDialog.open(UploadFileDialogComponent, {
            disableClose: true,
            data: {
                title: 'Cập nhật tài liệu hoạt động kinh doanh',
                config: config,
                formGroup: this.businessDocumentsForm,
            }
        });

        dialog.afterClosed().subscribe((res) => {
            if ( res === 'confirmed' ) {
                let filesId = "";
                if (action == 'replace') {
                    let fileId = this.businessDocumentsForm.get('businessDocumentation').value;
                    let newFile = new FsDocuments();
                    newFile.finDocumentsId = fileId;
                    filesId = this._profileService.replaceFile(this.getOldValueByKey(key), this.selectedFile, newFile);
                } else {
                    filesId = this._profileService.chainFileCode(
                        this.getOldValueByKey(key),
                        this.businessDocumentsForm
                    );
                }
                this.updateOrCreateFile({[key]: filesId})
            }
        });
    }

    getOldValueByKey(key): string {
        switch (key) {
            case 'businessDocumentation':
                return this.accountDetail.businessDocumentation;
            case 'businessDocumentation1':
                return this.accountDetail.businessDocumentation1;
            case 'businessDocumentation2':
                return this.accountDetail.businessDocumentation2;
            default:
                break;
        }
    }

    onReplaceFile(selectedFile: FsDocuments): void {
        switch (selectedFile.colume) {
            case 'businessDocumentation':
                this.clickUploadBusinessDocumentation(this.configFile, 'businessDocumentation', 'replace');
                break;
            case 'businessDocumentation1':
                this.clickUploadBusinessDocumentation(this.configFile1, 'businessDocumentation1', 'replace');
                break;
            case 'businessDocumentation2':
                this.clickUploadBusinessDocumentation(this.configFile2, 'businessDocumentation2', 'replace');
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
