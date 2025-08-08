import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FUNDING_TYPE_STATUS_TEXT_MAP, REQUEST_TRANSFER_TYPE_TEXT_MAP } from 'app/enum';
import { FsChargeCashReqDTO } from 'app/models/service/FsChargeCashReqDTO.model';
import { ManagementCashInService } from 'app/service/admin/management-cash-in.service';
import { SignRequestDialogComponent } from 'app/shared/components/sign-request-dialog/sign-request-dialog.component';
import { APP_TEXT } from 'app/shared/constants';

@Component({
    selector: 'app-funding-detail',
    templateUrl: './funding-detail.component.html',
    styleUrls: ['./funding-detail.component.scss']
})
export class FundingDetailComponent implements OnInit, OnChanges {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public requestId: number = 0;

    public detail: FsChargeCashReqDTO;
    public transType = FUNDING_TYPE_STATUS_TEXT_MAP;
    public status = REQUEST_TRANSFER_TYPE_TEXT_MAP;
    // FAKE DATA STATUS
    public isCash: boolean = true;
    public isApproved: boolean = true;

    constructor(
        private _manageCashInService: ManagementCashInService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog

    ) { }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.requestId.currentValue !== 0) {
            const request = new FsChargeCashReqDTO();
            request.fsChargeCashReqId = changes.requestId.currentValue;
            this._manageCashInService.getDetail(request).subscribe((res) => {
                if (res) {
                    this.detail = res.payload;
                }
            });
        }
    }

    ngOnInit(): void {
    }

    discard(): void {
        this.handleCloseDetailPanel.emit();
    }
    showDialogSign(): void {
        let checkAction = true;
        this._manageCashInService._prepare.subscribe((res) => {
            if (res && checkAction) {
                const dialogConfig = new MatDialogConfig();

                dialogConfig.autoFocus = true;
                dialogConfig.data = {
                    lstSign : res.payload.lstAccountApproval,
                    permission : 'SFF_CASH_CURRENCY_FUNDING_UPDATE',
                    assignCommentMaxlen : 200,
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
                        this._manageCashInService.doSignCashInReq(request).subscribe((response) => {
                            if (response.errorCode === '0') {
                                this.handleCloseDetailPanel.emit(true);
                                this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                            } else {
                                this._fuseAlertService.showMessageError(response.message.toString());
                            }
                        });
                    }
                });
            }
            checkAction = false;
        });
    }
}
