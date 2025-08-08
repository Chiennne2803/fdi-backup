import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AdmAccountDetailDTO } from 'app/models/admin';
import { FsTransWithdrawCashDTO } from 'app/models/service';
import { ManagementWithdrawHOService } from 'app/service/admin/management-withdraw-ho.service';
import { SignRequestDialogComponent } from 'app/shared/components/sign-request-dialog/sign-request-dialog.component';
import { APP_TEXT } from 'app/shared/constants';

@Component({
    selector: 'app-withdraw-detail',
    templateUrl: './withdraw-detail.component.html',
    styleUrls: ['./withdraw-detail.component.scss']
})
export class WithdrawDetailComponent implements OnInit, OnChanges {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public requestId: number = 0;

    public detail: FsTransWithdrawCashDTO;
    private lstApproveAccoount: AdmAccountDetailDTO;

    constructor(
        private _managementWithdrawHOService: ManagementWithdrawHOService,
        private _matDialog: MatDialog,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.requestId.currentValue !== 0) {
            const payload = new FsTransWithdrawCashDTO();
            payload.fsTransWithdrawCashId = this.requestId;
            this._managementWithdrawHOService.getDetail(payload).subscribe((res) => {
                if (res) {
                    this.detail = res.payload;
                }
            });
        }
    }

    ngOnInit(): void {
        this._managementWithdrawHOService._prepare.subscribe((res) => {
            this.lstApproveAccoount = res.payload.lstAccountApproval;
        });
    }


    discard(): void {
        this.handleCloseDetailPanel.emit();
    }

    doSign(): void {
        const dialog = this._matDialog.open(SignRequestDialogComponent, {
            autoFocus: true,
            data: {lstSign : this.lstApproveAccoount,
                permission : 'SFF_WITHDRAW_WALLET_UPDATE',
                assignCommentMaxlen : 200,
            },
            disableClose: true,
            width: '40%'
        });
        dialog.afterClosed().subscribe((result) => {
            if (result) {
                let request = result;
                request = {
                    ...request,
                    fsTransWithdrawCashId: this.requestId
                };
                this._managementWithdrawHOService.doSignWithdrawReq(request).subscribe((response) => {
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

}
