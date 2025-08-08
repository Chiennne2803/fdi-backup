import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FsTransWithdrawCashDTO } from 'app/models/service';
import { ManagementWithdrawHOReqService } from 'app/service/admin/management-withdraw-ho-req.service';
import { ConfirmProcessingComponent } from 'app/shared/components/confirm-processing/confirm-processing.component';
import {fuseAnimations} from "../../../../../@fuse/animations";

@Component({
    selector: 'app-withdraw-detail',
    templateUrl: './withdraw-detail.component.html',
    styleUrls: ['./withdraw-detail.component.scss'],
    animations     : fuseAnimations,
})
export class WithdrawDetailComponent implements OnInit, OnChanges {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public requestId: number = 0;

    public detail: FsTransWithdrawCashDTO;
    constructor(
        private _matDialog: MatDialog,
        private _managementWithdrawReqService: ManagementWithdrawHOReqService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes && changes.requestId.currentValue !== 0) {
            const payload = new FsTransWithdrawCashDTO();
            payload.fsTransWithdrawCashId = this.requestId;
            this._managementWithdrawReqService.getDetail(payload).subscribe((res) => {
                if (res) {
                    this.detail = res.payload;
                }
            });
        }
    }

    ngOnInit(): void { }

    onClose(): void {
        this.handleCloseDetailPanel.emit();
    }

    onClickApprove(): void {
        const dialogRef = this._matDialog.open(ConfirmProcessingComponent, {
            disableClose: true,
            width: '450px',
            data: {
                title: 'Xác nhận nội dung xử lý',
                valueDefault: 1,
                valueReject: 2,
                choices: [
                    {
                        value: 1,
                        name: 'Phê duyệt',
                    },
                    {
                        value: 2,
                        name: 'Từ chối(Ghi rõ lý do)',
                    }
                ],
                maxlenNote :200,
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                const request = new FsTransWithdrawCashDTO();
                request.fsTransWithdrawCashId = this.requestId;
                request.status = response.status;
                request.approvalComment = response.approvalComment;
                this._managementWithdrawReqService.approvalWithdrawReq(request).subscribe((res) => {
                    if (res.errorCode === '0') {
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
}
