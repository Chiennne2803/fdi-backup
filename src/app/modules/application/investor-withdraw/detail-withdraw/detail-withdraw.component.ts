import {Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {fuseAnimations} from '@fuse/animations';
import {WithdrawCashManagerService} from 'app/service/admin/withdrawcash-transaction.service';
import {ConfirmProcessingComponent} from 'app/shared/components/confirm-processing/confirm-processing.component';
import {FuseAlertService} from '../../../../../@fuse/components/alert';

@Component({
    selector: 'detail-withdraw',
    templateUrl: './detail-withdraw.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DetailWithdrawComponent {
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();
    public detailWithdraw: any;

    /**
     * Constructor
     */
    constructor(
        private _withdrawCashManagerService: WithdrawCashManagerService,
        private matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
    ) {
    }

    ngOnInit(): void {
         this._withdrawCashManagerService.selectedWithdraw$.subscribe(
            response => (this.detailWithdraw = response)
        ); //<= Always get current value!
    }

    public closeDrawer(): void {
        this._withdrawCashManagerService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

    public openDialog(): void {
        const dialogRef = this.matDialog.open(ConfirmProcessingComponent, {
            width: '450px',
            data: {
                payload: {
                    fsTransWithdrawCashId: this.detailWithdraw.fsTransWithdrawCashId,
                },
                title: 'Xác nhận nội dung xử lý?',
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
                maxlenNote: 200,
                complete: () => {

                    dialogRef.close();
                },
            },
        });

        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                this._withdrawCashManagerService.progressingTransaction(response).subscribe(
                    (res) => {
                        if (res.errorCode === '0') {
                            this._withdrawCashManagerService.doSearchWaitProcessTransaction().subscribe();
                            this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                            dialogRef.close();
                            this.closeDrawer();
                        } else {
                            this._fuseAlertService.showMessageError(res.message.toString());
                        }
                    }
                );
            }
        );
    }
}
