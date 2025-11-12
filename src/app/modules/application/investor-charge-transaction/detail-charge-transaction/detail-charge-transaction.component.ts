import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { fuseAnimations } from '@fuse/animations';
import { RechargeTransactionService } from 'app/service';
import {
    RechargeRequestDialogsComponent
} from 'app/shared/components/dialog/recharge-request/recharge-request-dialogs.component';
import { FuseAlertService } from '../../../../../@fuse/components/alert';
import { FuseConfirmationConfig, FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { ROUTER_CONST } from "../../../../shared/constants";
import {FsTopupDTO, FsTopupMailTransferDTO} from "../../../../models/service";
import {BaseRequest} from "../../../../models/base";

@Component({
    selector     : 'detail-charge-transaction',
    templateUrl  : './detail-charge-transaction.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DetailChargeTransactionComponent
{
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();
    public detailRecord: FsTopupMailTransferDTO;
    isShowBtnUpdate = false;

    /**
     * Constructor
     */
    constructor(
        private _rechargeTransactionService: RechargeTransactionService,
        private matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _confirmService: FuseConfirmationService,
        private _router: Router,
    ) {
    }

    ngOnInit(): void {
        this._rechargeTransactionService.selected$.subscribe(
            (res) => {
                this.detailRecord = res.payload;
                this.isShowBtnUpdate = false;
            }
        );
    }

    public closeDrawer(): void {
        this._rechargeTransactionService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

    public openDialog(): void {
        const dialogRef = this.matDialog.open(RechargeRequestDialogsComponent, {
            width: '450px',
            disableClose: true,
            data: {
                lstTopupWait: this.detailRecord.lstTopupWait,
                title: 'Xử lý yêu cầu nạp tiền',
                status: this.detailRecord.status,
                transCode: this.detailRecord.transCode,
                complete: () => {
                    dialogRef.close();
                },
            },
        });

        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                if (response.transCode) {
                    this.detailRecord.transCode = response.transCode;
                    this.detailRecord.fsTopupDTO = this.detailRecord.lstTopupWait.filter((topup: FsTopupDTO) => topup.fsTopupCode == response.transCode)[0];
                    this.detailRecord.admAccountName = this.detailRecord.fsTopupDTO.admAccountIdReciveName
                    this.detailRecord.admAccountId = this.detailRecord.fsTopupDTO.admAccountIdRecive
                    this.detailRecord.admAccountIdManager = this.detailRecord.fsTopupDTO.admAccountIdManager
                    this.detailRecord.admAccountIdManagerName = this.detailRecord.fsTopupDTO.admAccountIdManagerName
                }
                if (response.amount) {
                    this.detailRecord.amount = response.amount;
                }
                this.isShowBtnUpdate = true;
                dialogRef.close();
            }
        );
    }


    public cancelUpdate(): void {
        this.isShowBtnUpdate = false;
    }
    public openDialogSubmit(): void {
        const config: FuseConfirmationConfig = {
            title: '',
            message: 'Xác nhận dữ liệu',
            actions: {
                confirm: {
                    label: 'Đồng ý',
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
                this._rechargeTransactionService.update({
                    fsTopupMailTransferId: this.detailRecord.fsTopupMailTransferId,
                    transCode: this.detailRecord.fsTopupDTO.fsTopupCode,
                    amount: this.detailRecord.amount ? this.detailRecord.amount : undefined
                }).subscribe(
                    (res) => {
                        if (res.errorCode === '0') {
                            this._rechargeTransactionService.doSearchErrorTransaction().subscribe();
                            this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                            this.back();
                            this._rechargeTransactionService.closeDetailDrawer();
                        } else {
                            this._fuseAlertService.showMessageError(res.message.toString());
                        }
                    }
                );
            }
        });
    }

    back(): void {
        this._router.navigate([ROUTER_CONST.config.application.investorChargeTransaction.link]);
    }

}
