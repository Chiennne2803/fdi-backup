import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatDrawer} from '@angular/material/sidenav';
import {FuseAlertService} from '@fuse/components/alert';
import {FsDocuments} from 'app/models/admin';
import {FsAccountInfoReqDTO} from 'app/models/service/FsAccountInfoReqDTO.model';
import {ManagementAccountInfoReqService} from 'app/service/admin/management-account-info-req.service';
import {FileService} from 'app/service/common-service';
import {ConfirmProcessingComponent} from 'app/shared/components/confirm-processing/confirm-processing.component';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';

@Component({
    selector: 'account-info-request',
    templateUrl: './account-info-request.component.html',
    styleUrls: ['./account-info-request.component.scss'],
    providers: [DateTimeformatPipe]
})
export class AccountInfoRequestComponent implements OnInit, OnChanges {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;

    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public requestId: number = 0;

    public accountInfoForm: FormGroup = new FormGroup({});
    public detail: FsAccountInfoReqDTO;
    public selectedFile: FsDocuments;

    constructor(
        private _managementAccountInfoReqService: ManagementAccountInfoReqService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _formBuilder: FormBuilder,
        private _datetimePipe: DateTimeformatPipe,
        private _fileService: FileService,
    ) {
        this._managementAccountInfoReqService.selectedProfile$.subscribe(res => {
            this.detail = res;
            this.initForm(this.detail);
        })
    }

    ngOnChanges(changes: SimpleChanges): void {
       /* if (changes && changes.requestId.currentValue !== 0) {
            const payload = new FsAccountInfoReqDTO();
            payload.fsAccountInfoReqId = this.requestId;
            this._managementAccountInfoReqService.getDetail(payload).subscribe((res) => {
                this.detail = res.payload;
                this.initForm(res.payload);
            });
        }*/
    }

    ngOnInit(): void {
        this.initForm();
    }

    onClose(): void {
        this.handleCloseDetailPanel.emit();
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
                            result => this.selectedFile = result.payload
                        );
                    }
                }
            });
    }

    onClickApprove(): void {
        const dialogRef = this._matDialog.open(ConfirmProcessingComponent, {
            disableClose: true,
            // width: '450px',
            data: {
                title: 'Xác nhận nội dung xử lý',
                valueDefault: 2,
                valueReject: 3,
                choices: [
                    {
                        value: 2,
                        name: 'Phê duyệt',
                    },
                    {
                        value: 3,
                        name: 'Từ chối(Ghi rõ lý do)',
                    }
                ],
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                const request = new FsAccountInfoReqDTO();
                request.fsAccountInfoReqId = this.requestId;
                request.status = response.status;
                request.approvalInfo = response.approvalComment;
                this._managementAccountInfoReqService.approvalChangeInfoReq(request).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._managementAccountInfoReqService.search().subscribe();
                        this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                        this.handleCloseDetailPanel.emit(true);
                        dialogRef.close();
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                });
            }
        );
    }

    private initForm(data?: FsAccountInfoReqDTO): void {
        this.accountInfoForm = this._formBuilder.group({
            transCode: new FormControl({value: data ? data.transCode : null, disabled: true}),
            type: new FormControl( {value:data ? data.type === '1' ? 'Thay đổi CCCD/Hộ chiếu' : 'Thay đổi GPKD' : null, disabled: true}),
            createdByName: new FormControl({value:data ? data.createdByName : null,disabled: true}),
            createdDate: new FormControl({value:data ? this._datetimePipe.transform(data.createdDate, 'DD/MM/YYYY') : null, disabled: true}),
            approvalBy: new FormControl({value:data ? data.approvalBy : null, disabled: true}),
            approvalByName: new FormControl({value:data ? data.approvalByName : null, disabled: true}),
            approvalDate: new FormControl({value:data ? this._datetimePipe.transform(data.approvalDate, 'DD/MM/YYYY') : null, disabled: true}),
            status: new FormControl({value:data ? data.status : null, disabled: true}),
            statusName: new FormControl({value:data ? data.statusName : null, disabled: true}),
            approvalInfo: new FormControl({value:data ? data.approvalInfo : null, disabled: true}),
        });
    }
}
