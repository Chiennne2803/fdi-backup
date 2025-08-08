import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileService, ProfileService} from '../../../../../service/common-service';
import {Subscription, tap} from 'rxjs';
import {AdmAccountDetailDTO, FsDocuments} from '../../../../../models/admin';
import {MatDrawer} from '@angular/material/sidenav';
import {FormBuilder, FormGroup} from '@angular/forms';
import {isArray} from 'lodash';
import {UploadFileDialogComponent} from '../../../../../shared/components/dialog/upload-file/upload-file.component';
import {MatDialog} from '@angular/material/dialog';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';

@Component({
    selector: 'other-valuable-papers',
    templateUrl: './other-valuable-papers.component.html',
})
export class OtherValuablePapersComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('fileDrawer', { static: true }) fileDrawer: MatDrawer;
    otherValuablePaperFiles: FsDocuments[];
    otherValuableForm: FormGroup;
    selectedFile: FsDocuments;
    subscription: Subscription = new Subscription();
    accountDetail: AdmAccountDetailDTO;

    constructor(
        private _fileService: FileService,
        private _profileService: ProfileService,
        private _fb: FormBuilder,
        private _matDialog: MatDialog,
        private _fuseAlert: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this.subscription.add(
            this._profileService.profilePrepare$.pipe(
                tap((res) => {
                    this.accountDetail = res.accountDetail;
                    if (res && res.accountDetail?.fileValues2) {
                        this._fileService.getDetailFiles(res.accountDetail.fileValues2).subscribe(
                            files => this.otherValuablePaperFiles = files.payload
                        );
                    }
                })
            ).subscribe()
        );
        this.initForm();
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Giấy tờ có giá trị khác')
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.otherValuableForm = this._fb.group({
            file1: '',
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

    clickUploadFile(action?: string): void {
        const dialog = this._matDialog.open(UploadFileDialogComponent, {
            disableClose: true,
            data: {
                title: 'Cập nhật giấy tờ có giá trị khác',
                config: [
                    {
                        topTitle: 'Giấy tờ có giá khác',
                        field: 'file1',
                        multiple: true,
                        styleInput: 'h-50 mt-[3px]',
                        type: 'file',
                        maxFile: 10,
                        maxFileSize: 5,
                        accept: 'image/png, image/jpg, image/jpeg, application/pdf'
                    },
                ],
                formGroup: this.otherValuableForm,
            }
        });

        dialog.afterClosed().subscribe((res) => {
            if ( res === 'confirmed' ) {
                let filesId = "";
                if (action == 'replace') {
                    let fileId = this.otherValuableForm.get('file1').value;
                    let newFile = new FsDocuments();
                    newFile.finDocumentsId = fileId;
                    filesId = this._profileService.replaceFile(this.accountDetail.fileValues2, this.selectedFile, newFile)
                } else {
                    filesId = this._profileService.chainFileCode(this.accountDetail.fileValues2, this.otherValuableForm);
                }
                this.updateOrCreateFile(filesId);
            }
        });
    }

    onReplaceFile(file: FsDocuments): void {
        this.clickUploadFile('replace');
        // const newFileID = this._profileService.replaceFile(this.accountDetail.fileValues2, this.selectedFile, file);
        // this.updateOrCreateFile(newFileID, file);
    }

    updateOrCreateFile(files: string, fileReplaced?: FsDocuments): void {
        this._profileService.updateDocument({
            admAccountDetailId: this.accountDetail.admAccountDetailId,
            fileValues2: files.replace('undefined', '').replace(/,/g,';')
        }).subscribe((response) => {
            if ( response.errorCode === '0' ) {
                this._fuseAlert.showMessageSuccess('Tải lên thành công');
                this._profileService.getPrepareLoadingPage().subscribe(() => {
                    if ( fileReplaced ) {
                        this.selectedFile = fileReplaced;
                    }
                });
            } else {
                this._fuseAlert.showMessageError(response.message.toString());
            }
        });
    }
}
