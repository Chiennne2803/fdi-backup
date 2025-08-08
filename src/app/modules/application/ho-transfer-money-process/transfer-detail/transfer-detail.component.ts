import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { AdmAccountDetailDTO } from 'app/models/admin';
import { BaseResponse } from 'app/models/base';
import { FsTransWithdrawCashDTO } from 'app/models/service';
import { FsTranferWalletReqDTO } from 'app/models/service/FsTranferWalletReqDTO.model';
import { ManagementBonusReqService } from 'app/service/admin/management-bonus-req.service';
import { ManagementTranferWalletReqService } from 'app/service/admin/management-tranfer-wallet-req.service';
import { ConfirmProcessingComponent } from 'app/shared/components/confirm-processing/confirm-processing.component';
import { ITableConfig } from 'app/shared/models/datatable/table-config.model';
import { Observable, of } from 'rxjs';
import {fuseAnimations} from "../../../../../@fuse/animations";

@Component({
    selector: 'app-transfer-detail',
    templateUrl: './transfer-detail.component.html',
    styleUrls: ['./transfer-detail.component.scss'],
    animations: fuseAnimations,
})
export class TransferDetailComponent implements OnInit, OnChanges {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public requestId: number = 0;
    @Input() public _tableConfig: ITableConfig;

    public detail: FsTranferWalletReqDTO;
    public _dataSource = new Observable<BaseResponse>();

    constructor(
        private _managementTranferWalletReqService: ManagementTranferWalletReqService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _tempService: ManagementBonusReqService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes?.requestId?.currentValue !== undefined && changes?.requestId?.currentValue !== 0) {
            const payload = new FsTranferWalletReqDTO();
            payload.fsTranferWalletReqId = changes.requestId.currentValue;
            this.initData(payload);
        }
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.handleCloseDetailPanel.emit();
    }

    onClickApprove(): void {
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
                maxlenNote: 200,
                msgRequireNote: 'XLDC002',
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                const request = new FsTranferWalletReqDTO();
                request.fsTranferWalletReqId = this.requestId;
                request.status = response.status;
                request.approvalComment = response.approvalComment;
                this._managementTranferWalletReqService.approvalTranferWalletReq(request).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                        this.handleCloseDetailPanel.emit(true);
                        dialogRef.close();
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                    this._managementTranferWalletReqService.getDetail({fsTranferWalletReqId: this.requestId}).subscribe();
                });
            }
        );
    }

    private initData(request: FsTranferWalletReqDTO): void {
        this._managementTranferWalletReqService.selectedProfile$.subscribe((res) => {
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
        });
    }

}
