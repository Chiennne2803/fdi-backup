import {Injectable} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FeeTransactionManagementSearchComponent} from '../../modules/application/ho-transaction-fee-management/dialog/search/fee-transaction-management-search.component';
import {AddDialogComponent} from '../../modules/application/lender-refund/dialog/add-dialog/add-dialog.component';
import {FuseConfirmationService} from '../../../@fuse/services/confirmation';
import {FuseConfirmationDialogComponent} from '../../../@fuse/services/confirmation/dialog/dialog.component';
import {ProcessDialogComponent} from '../../modules/application/lender-refund/dialog/process-dialog/process-dialog.component';
import {ConfirmProcessingComponent} from '../../shared/components/confirm-processing/confirm-processing.component';
import {DocumentSignDialogComponent} from '../../modules/application/investor-refund/dialog/sign/document-sign.component';
import {AddRefundInvestorComponent} from '../../modules/application/investor-refund/dialog/add/add-refund.component';
import {FeeTransactionManagementCreateComponent} from '../../modules/application/ho-transaction-fee-management/dialog/create/fee-transaction-management-create.component';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    constructor(
        private _dialog: MatDialog,
        private _fuseConfirmDialog: FuseConfirmationService,
    ) {
    }

    openFeeTransactionManagementSearchAdvancedDialog(): MatDialogRef<any> {
        const dialogRef = this._dialog.open(FeeTransactionManagementSearchComponent, {
            disableClose: true,
            width: '800px',
            data: {},
        });
        return dialogRef;
    }

    openFeeTransactionCreate(): MatDialogRef<any> {
        const dialogRef = this._dialog.open(FeeTransactionManagementCreateComponent, {
            disableClose: true,
            width: '800px',
            data: {}
        });
        return dialogRef;
    }

    openMakeRequestLenderRefundDialog(): MatDialogRef<any> {
        const dialogRef = this._dialog.open(AddDialogComponent, {
            disableClose: true,
            width: '950px',
            data: {},
        });
        return dialogRef;
    }

    openMakeRequestInvestorefundDialog(): MatDialogRef<AddRefundInvestorComponent> {
        const dialogRef = this._dialog.open(AddRefundInvestorComponent, {
            disableClose: true,
            width: '950px',
            data: {},
        });
        return dialogRef;
    }

    openConfirmDialog(message: string, title?: string): MatDialogRef<FuseConfirmationDialogComponent> {
        const cfDialog = this._fuseConfirmDialog.open({
            title: title || 'Xác nhận',
            message: message,
            dismissible: true,
            actions: {
                confirm: {
                    label: 'Đồng ý'
                },
                cancel: {
                    label: 'Hủy',
                }
            }
        });
        return cfDialog;
    }

    openWarningDialog(message: string): MatDialogRef<FuseConfirmationDialogComponent> {
        const cfDialog = this._fuseConfirmDialog.open({
            title: '',
            message: message,
            dismissible: true,
            actions: {
                cancel: {
                    label: 'Đóng'
                },
                confirm: {
                    show : false
                }
            }
        });
        return cfDialog;
    }

    openConfirmProcessingDialog(valueDefault?: number, valueReject?: number): MatDialogRef<ConfirmProcessingComponent> {
        const dialog = this._dialog.open(ConfirmProcessingComponent, {
            width: '450px',
            disableClose: true,
            data: {
                title: 'Xác nhận nội dung xử lý?',
                valueDefault: valueDefault ? valueDefault : 1,
                valueReject: valueReject ? valueReject : 0,
                choices: [
                    {
                        value: valueDefault ? valueDefault : 1,
                        name: 'Phê duyệt',
                    },
                    {
                        value: valueReject ? valueReject : 0,
                        name: 'Từ chối(Ghi rõ lý do)',
                    }
                ],
                complete: (): void => {
                    dialog.close();
                }
            },
        });
        return dialog;
    }

    openProcessDialog(data: any): MatDialogRef<ProcessDialogComponent> {
        const dialog = this._dialog.open(ProcessDialogComponent, {
            data: data,
            disableClose: true,
        });
        return dialog;
    }

    openDocumentSignDialog(data: any): MatDialogRef<DocumentSignDialogComponent> {
        const dialog = this._dialog.open(DocumentSignDialogComponent, {
            data: data,
            disableClose: true,
        });
        return dialog;
    }
}
