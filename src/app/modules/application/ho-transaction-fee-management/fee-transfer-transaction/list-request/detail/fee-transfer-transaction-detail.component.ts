import {
    AfterViewInit,
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {Observable} from 'rxjs';
import {AdmAccountDetailDTO} from 'app/models/admin';
import {AccountManagementFeeService, TransferTransactionFeeService} from 'app/service/admin/managementTransactionFee';
import {MatPaginator} from "@angular/material/paginator";
import {FsTranferWalletReqDTO} from "../../../../../../models/service/FsTranferWalletReqDTO.model";
import {MatTableDataSource} from "@angular/material/table";
import {FsManageTransactionFeeDTO} from "../../../../../../models/service/FsManageTransactionFeeDTO.model";
import {FuseAlertService} from "../../../../../../../@fuse/components/alert";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {SignRequestDialogComponent} from "../../../../../../shared/components/sign-request-dialog/sign-request-dialog.component";
import {APP_TEXT} from "../../../../../../shared/constants";
import {fuseAnimations} from "../../../../../../../@fuse/animations";

@Component({
    selector: 'detail-fee-transfer-transaction',
    templateUrl: './fee-transfer-transaction-detail.component.html',
    styleUrls: ['./fee-transfer-transaction-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class FeeTransferTransactionDetailComponent implements OnInit, AfterViewInit {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public debtManagement: Observable<FsTranferWalletReqDTO>;
    public lstAccountApproval: AdmAccountDetailDTO[];
    public requestId: number = 0;
    displayedColumns: string[] = ['position', 'name', 'weight'];
    _dataSource = new MatTableDataSource<FsManageTransactionFeeDTO>();

    constructor(
        private _transferTransactionFeeService: TransferTransactionFeeService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.debtManagement = this._transferTransactionFeeService.selectedProfile$;
        this.debtManagement.subscribe((res) => {
            if (res) {
                this.requestId = res.fsTranferWalletReqId;
                if (res.transactionFeeDTOS) {
                    this._dataSource = new MatTableDataSource(res.transactionFeeDTOS);
                    this._dataSource.paginator = this.paginator;
                    setTimeout(() => this._dataSource.paginator = this.paginator, 1000);
                }
            }
        });
        this._transferTransactionFeeService.prepare().subscribe((res) => {
            if (res) {
                this.lstAccountApproval = res.payload.lstAccountApproval;
            }
        });
    }


    ngAfterViewInit(): void {
        this._dataSource.paginator = this.paginator;
        setTimeout(() => this._dataSource.paginator = this.paginator, 1000);
    }


    discard(): void {
        this._transferTransactionFeeService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

    submit(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {lstSign : this.lstAccountApproval, permission : '', assignCommentMaxlen: 200};
        dialogConfig.disableClose = true;
        dialogConfig.width = '40%';

        const dialog = this._matDialog.open(SignRequestDialogComponent, dialogConfig);
        dialog.afterClosed().subscribe((result) => {
            if (result) {
                let request = result;
                request = {
                    ...request,
                    assignTo: request.assignTo,
                    fsTranferWalletReqId: this.requestId
                };
                this._transferTransactionFeeService.doSignReq(request).subscribe((response) => {
                    if (response.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                        this._transferTransactionFeeService.getDetail({fsTranferWalletReqId:this.requestId}).subscribe();
                        this._transferTransactionFeeService.searchTransferTransactionFeeReq().subscribe();
                    } else {
                        this._fuseAlertService.showMessageError(response.message.toString());
                    }
                });
            }
        });
    }
}
