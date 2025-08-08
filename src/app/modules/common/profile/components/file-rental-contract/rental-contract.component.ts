import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FileService, ProfileService} from '../../../../../service/common-service';
import {Subscription, tap} from 'rxjs';
import {AdmAccountDetailDTO, FsDocuments} from '../../../../../models/admin';
import {MatDrawer} from '@angular/material/sidenav';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {isArray} from 'lodash';
import {UploadFileDialogComponent} from '../../../../../shared/components/dialog/upload-file/upload-file.component';

@Component({
    selector: 'rental-contract',
    templateUrl: './rental-contract.component.html',
})
export class RentalContractComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('fileDrawer', { static: true }) fileDrawer: MatDrawer;
    rentalContactFiles: FsDocuments[];
    rentalDocumentsForm: FormGroup;
    selectedFile: FsDocuments;
    subscription: Subscription = new Subscription();
    accountDetail: AdmAccountDetailDTO;

    constructor(
        private _fb: FormBuilder,
        private _fileService: FileService,
        private _profileService: ProfileService,
        private _matDialog: MatDialog,
        private _fuseAlert: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this.subscription.add(
            this._profileService.profilePrepare$.pipe(
                tap((res) => {
                    this.accountDetail = res.accountDetail;
                    if (res && res.accountDetail?.rentalContract) {
                        this._fileService.getDetailFiles(res.accountDetail.rentalContract).subscribe(
                            files => this.rentalContactFiles = files.payload
                        );
                    }
                })
            ).subscribe()
        );
        this.initForm();
    }

    ngAfterViewInit(): void {
        Promise.resolve().then(
            () => this._profileService.changeTitlePage('Hợp đồng cho thuê tài sản')
        );
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    initForm(): void {
        this.rentalDocumentsForm = this._fb.group({
            file1: '',
        });
    }

    onClickFile(file: FsDocuments): void {
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
                title: 'Cập nhật hợp đồng cho thuê tài sản',
                config: [
                    {
                        topTitle: 'Hợp đồng cho thuê tài sản',
                        field: 'file1',
                        multiple: true,
                        styleInput: 'h-50 mt-[3px]',
                        type: 'file',
                        maxFile: 10,
                        maxFileSize: 5,
                        accept: 'image/png, image/jpg, image/jpeg, application/pdf'
                    },
                ],
                formGroup: this.rentalDocumentsForm,
            }
        });

        dialog.afterClosed().subscribe((res) => {
            if ( res === 'confirmed' ) {
                let filesId = "";
                if (action == 'replace') {
                    let fileId = this.rentalDocumentsForm.get('file1').value;
                    let newFile = new FsDocuments();
                    newFile.finDocumentsId = fileId;
                    filesId = this._profileService.replaceFile(this.accountDetail.rentalContract, this.selectedFile, newFile)
                } else {
                    filesId = this._profileService.chainFileCode(this.accountDetail.rentalContract, this.rentalDocumentsForm);
                }

               this.updateOrCreateFile(filesId);
            }
        });
    }

    onReplaceFile(file: FsDocuments): void {
        this.clickUploadFile('replace');
        // const newFileID = this._profileService.replaceFile(this.accountDetail.rentalContract, this.selectedFile, file);
        // this.updateOrCreateFile(newFileID, file);
    }

    updateOrCreateFile(files: string, fileReplaced?: FsDocuments): void {
        this._profileService.updateDocument({
            admAccountDetailId: this.accountDetail.admAccountDetailId,
            rentalContract: files
        }).subscribe((response) => {
            if ( response.errorCode === '0' ) {
                this._fuseAlert.showMessageSuccess('Tải lên thành công');
                this._profileService.getPrepareLoadingPage().subscribe(() => {
                    if ( fileReplaced ) {
                        this.selectedFile = fileReplaced;
                    }
                });
                this.fileDrawer.close();
            } else {
                this._fuseAlert.showMessageError(response.message.toString());
            }
        });
    }
}
