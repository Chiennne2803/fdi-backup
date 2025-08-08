import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationConfig, FuseConfirmationService} from '@fuse/services/confirmation';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {APP_TEXT} from 'app/shared/constants';
import {ISelectModel} from 'app/shared/models/select.model';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {DocumentConfigService} from '../../../../service/admin/document-config.service';
import {AdmDocumentConfigDTO} from '../../../../models/admin/AdmDocumentConfigDTO.model';
import {AuthService} from '../../../../core/auth/auth.service';
import {Observable, tap} from 'rxjs';
import {FileService} from '../../../../service/common-service';
import {MatDrawer} from '@angular/material/sidenav';
import {FsDocuments} from '../../../../models/admin';

@Component({
    selector: 'document-config-detail',
    templateUrl: './document-config-detail.component.html',
    providers: [DateTimeformatPipe],
    animations: fuseAnimations,
})
export class DocumentConfigDetailComponent implements OnInit {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public fsAccountBankId: number;
    public finDocumentsId: FsDocuments;
    public selectedFile: FsDocuments;
    configDocumentForm: UntypedFormGroup;
    isRemoved = false;
    public configDetail: Observable<AdmDocumentConfigDTO>;

    public accTypes: Array<ISelectModel> = [
        {id: 3, label: 'Tài khoản nhà đầu tư'},
        {id: 4, label: 'Tài khoản bên huy động vốn'},
        {id: 5, label: 'Tài khoản Tiếp quỹ tiền mặt'},
    ];
    public banks: Array<ISelectModel> = [];

    constructor(
        private _formBuilder: FormBuilder,
        private _documentConfigService: DocumentConfigService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private _datetimePipe: DateTimeformatPipe,
        private _authService: AuthService,
        private _fileService: FileService,
    ) {
    }

    ngOnInit(): void {
        this.selectedFile = null;
        this.finDocumentsId = null;
        this.configDetail = this._documentConfigService
            .configDetail$.pipe(
                tap((res) => {
                    if (res) {
                        if (this.fileDrawer !== undefined) {
                            this.fileDrawer.close();
                        }
                        if (res.fileId) {
                            this.isRemoved = true
                            this._fileService
                                .getFileFromServer(res.fileId + '')
                                .subscribe(result => this.finDocumentsId = result.payload);
                        }
                        this.initForm(res);
                    }
                })
            );
    }

    onClose(): void {
        this._documentConfigService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

    submit(): void {
        this.configDocumentForm.markAllAsTouched();
        if (this.configDocumentForm.valid) {
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
                    const request = this.configDocumentForm.value;
                    this._documentConfigService.update(request).subscribe((result) => {
                        if (result.errorCode === '0') {
                            this._documentConfigService.getDetail(request).subscribe();
                            this._documentConfigService.doSearch().subscribe();
                            this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                        } else {
                            this._fuseAlertService.showMessageError(result.message.toString());
                        }
                    });
                }
            });
        }
    }

    public clickViewImage(id: string): void {
        this._fileService
            .getDetailFiles(id)
            .subscribe((res) => {
                if (res !== undefined && res.payload !== undefined) {
                    this.selectedFile = res.payload[0];
                    this.fileDrawer.open();
                    if (['JPG', 'JPEG', 'PNG'].includes(this.selectedFile.type.toUpperCase())) {
                        this._fileService.getFileFromServer(this.selectedFile.finDocumentsId + '').subscribe(
                            resFile => this.selectedFile = resFile.payload
                        );
                    }
                }
            });
    }

    initForm(configDetail: AdmDocumentConfigDTO): void {
        this.configDocumentForm = this._formBuilder.group({
            admDocumentConfigId: new FormControl(configDetail.admDocumentConfigId),
            fileId: new FormControl(null , [Validators.required]),
        });
    }
}
