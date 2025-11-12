import { Component, EventEmitter, NgZone, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { ROUTER_CONST } from 'app/shared/constants';
import { FsTopupDTO } from 'app/models/service';
import { TopUpTransactionService } from 'app/service/admin/topup-transaction.service';
import { RechargeRequestDialogsComponent } from 'app/shared/components/dialog/recharge-request/recharge-request-dialogs.component';

@Component({
    selector: 'detail-topup-transaction',
    templateUrl: './detail-wait-topup-transaction.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DetailTopupTransactionComponent implements OnInit {
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();
    public detailRecord: FsTopupDTO;
    isShowBtnUpdate = false;

    constructor(
        private _topupTransactionService: TopUpTransactionService,
        private matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _confirmService: FuseConfirmationService,
        private _router: Router,
        private _route: ActivatedRoute,
          private ngZone: NgZone 
    ) {}

    ngOnInit(): void {
        this._topupTransactionService.selected$.subscribe((res: any) => {
            this.detailRecord = (res && res.payload) ? res.payload : res;
            this.isShowBtnUpdate = false;
        });

        // Try fetch detail by route params if available
        const tryFetchByRoute = (params: any): void => {
            const getVal = (key: string): any => params.get ? params.get(key) : params[key];
            const rawId = getVal('fsTopupId') || getVal('id');
            const rawCode = getVal('fsTopupCode') || getVal('transCode');

            const fsTopupId = rawId != null ? Number(rawId) : undefined;
            if (fsTopupId && !Number.isNaN(fsTopupId)) {
                this._topupTransactionService.getDetail({ fsTopupId }).subscribe();
                return;
            }

            const fsTopupCode = rawCode != null ? String(rawCode) : undefined;
            if (fsTopupCode) {
                this._topupTransactionService.getDetail({ fsTopupCode }).subscribe();
            }
        };

        // Params
        this._route.paramMap.subscribe((paramMap) => { tryFetchByRoute(paramMap); });
        this._route.queryParamMap.subscribe((queryParamMap) => { tryFetchByRoute(queryParamMap); });
    }

    public closeDrawer(): void {
        this._topupTransactionService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

public openDialog(): void {
  const dialogRef = this.matDialog.open(RechargeRequestDialogsComponent, {
    width: '450px',
    disableClose: true,
    data: {
      lstTopupWait: [this.detailRecord],
      title: 'Xử lý yêu cầu nạp tiền',
      status: this.detailRecord.status || 3,
      transCode: this.detailRecord.fsTopupCode,
      isTopupTransaction: false,
      complete: () => {
        dialogRef.close();
      },
    },
  });

  dialogRef.componentInstance.onSubmit.subscribe((response) => {
    console.log("✅ Nhận dữ liệu từ dialog:", response);

    this.ngZone.run(() => {
      // 👉 Cập nhật lại record nếu cần
      if (response.transCode) {
        this.detailRecord.fsTopupCode = response.transCode;
      }
      if (response.amount) {
        this.detailRecord.amount = response.amount;
      }

      // 👉 Ẩn nút Xử lý, hiện nút Lưu / Huỷ
      this.isShowBtnUpdate = true;
    });

    dialogRef.close();
  });
}

    public cancelUpdate(): void {
        this.isShowBtnUpdate = false;
    }

    public openDialogSubmit(): void {
        const config: FuseConfirmationConfig = {
            title: '',
            message: 'Xác nhận cập nhật giao dịch nạp tiền?',
            actions: {
                confirm: { label: 'Đồng ý', color: 'primary' },
                cancel: { label: 'Huỷ' },
            },
        };

        const dialog = this._confirmService.open(config);
        dialog.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                // Sử dụng fsTopupCode mới nếu đã thay đổi từ dialog
                const fsTopupCode = this.detailRecord.fsTopupCode; // Đã cập nhật từ onSubmit
                this._topupTransactionService
                    .update({
                        amount: this.detailRecord.amount,
                        fsTopupCode: fsTopupCode,
                    })
                    .subscribe((updateRes) => {
                        if (updateRes.errorCode === '0') {
                            this._fuseAlertService.showMessageSuccess('Cập nhật thành công');
                            // Refresh list wait transaction tương tự error
                            this._topupTransactionService.doSearchWaitTransaction().subscribe();
                            this.back();
                            this._topupTransactionService.closeDetailDrawer();
                        } else {
                            this._fuseAlertService.showMessageError(updateRes.message.toString());
                        }
                    });
            }
        });
    }

    back(): void {
        this._router.navigate([ROUTER_CONST.config.application.investorChargeTransaction.wait]);
    }
}