import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {AdmAccountDetailDTO} from 'app/models/admin';
import {BaseResponse} from 'app/models/base';
import {FsChargeCashReqDTO} from 'app/models/service/FsChargeCashReqDTO.model';
import {ManagementBonusService} from 'app/service/admin/management-bonus.service';
import {SignRequestDialogComponent} from 'app/shared/components/sign-request-dialog/sign-request-dialog.component';
import {APP_TEXT} from 'app/shared/constants';
import {Observable, of} from 'rxjs';
import {TABLE_TRANS_COM_CONFIG} from '../request-commission-dialog/transaction-commission.config';

@Component({
    selector: 'app-commission-trans-detail',
    templateUrl: './commission-trans-detail.component.html',
    styleUrls: ['./commission-trans-detail.component.scss']
})
export class CommissionTransDetailComponent implements OnInit, OnChanges {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public hasApproveBtn: boolean = false;
    @Input() public requestId: number = 0;

    public detail: FsChargeCashReqDTO;
    public _dataSource = new Observable<BaseResponse>(null);
    public _tableConfig = TABLE_TRANS_COM_CONFIG;
    lstAccountApproval: AdmAccountDetailDTO[];

    constructor(
        private _manageBonusReqService: ManagementBonusService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.requestId.currentValue !== 0) {
            const request = new FsChargeCashReqDTO();
            request.fsChargeCashReqId = changes.requestId.currentValue;
            this.initData(request);
        }
    }

    ngOnInit(): void {
        this._manageBonusReqService.prepare().subscribe((res) => {
            if (res.errorCode === '0' && res.payload) {
                this.lstAccountApproval = res.payload.lstAccountApproval;
            }
        });
    }

    discard(): void {
        this.handleCloseDetailPanel.emit();
    }

    doSign(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
            lstSign: this.lstAccountApproval,
            permission: 'SFF_COMMISSION_PAYMENT_UPDATE',
            assignCommentMaxlen: 200
        };
        dialogConfig.disableClose = true;
        dialogConfig.width = '40%';

        const dialog = this._matDialog.open(SignRequestDialogComponent, dialogConfig);
        dialog.afterClosed().subscribe((result) => {
            if (result) {
                let request = result;
                request = {
                    ...request,
                    fsChargeCashReqId: this.requestId
                };
                this._manageBonusReqService.doSignReq(request).subscribe((response) => {
                    if (response.errorCode === '0') {
                        this.handleCloseDetailPanel.emit(true);
                        this._manageBonusReqService.getDetail({fsChargeCashReqId: this.requestId}).subscribe();
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                    } else {
                        this._fuseAlertService.showMessageError(response.message.toString());
                    }
                });
            }
        });
    }

    private initData(request: FsChargeCashReqDTO): void {
        this._manageBonusReqService.selectedProfile$.subscribe((res) => {
            if (res) {
                this._dataSource = undefined;
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
