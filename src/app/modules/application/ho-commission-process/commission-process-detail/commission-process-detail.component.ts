import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { AdmAccountDetailDTO } from 'app/models/admin';
import { BaseResponse } from 'app/models/base';
import { FsChargeCashReqDTO } from 'app/models/service/FsChargeCashReqDTO.model';
import { ManagementBonusReqService } from 'app/service/admin/management-bonus-req.service';
import { ConfirmProcessingComponent } from 'app/shared/components/confirm-processing/confirm-processing.component';
import { of } from 'rxjs';
import { TABLE_COM_CHIDREN_CONFIG } from './commission-prcess-children.config';

@Component({
    selector: 'app-commission-process-detail',
    templateUrl: './commission-process-detail.component.html',
    styleUrls: ['./commission-process-detail.component.scss']
})
export class CommissionProcessDetailComponent implements OnInit, OnChanges {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public hasApproveBtn: boolean = false;
    @Input() public requestId: number = 0;

    public _dataSource;
    public _tableConfig = TABLE_COM_CHIDREN_CONFIG;
    public detail: FsChargeCashReqDTO;

    constructor(
        private _managementBonusReqService: ManagementBonusReqService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.requestId.currentValue !== 0) {
            const request = new FsChargeCashReqDTO();
            request.fsChargeCashReqId = changes.requestId.currentValue;
            // this.initData(request);
        }
    }

    ngOnInit(): void {
        this.initData();
    }

    discard(): void {
        this.handleCloseDetailPanel.emit();
    }
    submit(): void {
        const dialogRef = this._matDialog.open(ConfirmProcessingComponent, {
            disableClose: true,
            width: '450px',
            data: {
                title: 'Xác nhận nội dung xử lý',
                valueDefault: 3,
                valueReject: 4,
                choices: [
                    {
                        value: 3,
                        name: 'Phê duyệt',
                    },
                    {
                        value: 4,
                        name: 'Từ chối(Ghi rõ lý do)',
                    }
                ],
                maxlenNote : 200,
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                const request = new FsChargeCashReqDTO();
                request.fsChargeCashReqId = this.requestId;
                request.status = response.status;
                request.approvalComment = response.approvalComment;
                this._managementBonusReqService.approvalChargeCashReq(request).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                        this.handleCloseDetailPanel.emit(true);
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                });
                dialogRef.close();
            }
        );
    }

    private initData(request?: FsChargeCashReqDTO): void {
        this._managementBonusReqService.selectedProfile$.subscribe((res) => {
            if (res) {
                this.detail = res;
                if (this.detail.transactionFeeDTOS) {
                    const dataTemp: BaseResponse = {
                        content: this.detail.transactionFeeDTOS,
                        empty: false,
                        first: true,
                        last: true,
                        // eslint-disable-next-line id-blacklist
                        number: 0,
                        numberOfElements: this.detail.transactionFeeDTOS.length,
                        size: 10,
                        totalElements: this.detail.transactionFeeDTOS.length,
                        totalPages: 1
                    };
                    this._dataSource = of(dataTemp);
                }
            }
        });
    }
}
