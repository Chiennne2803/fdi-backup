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
import {AccountManagementFeeService, InvestmentTransactionFeeService} from 'app/service/admin/managementTransactionFee';
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
    selector: 'detail-fee-investment-transaction',
    templateUrl: './fee-investment-transaction-detail.component.html',
    styleUrls: ['./fee-investment-transaction-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class FeeInvestmentTransactionDetailComponent implements OnInit, AfterViewInit {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public debtManagement: Observable<FsTranferWalletReqDTO>;
    public lstAccountApproval: AdmAccountDetailDTO[];
    public requestId: number = 0;
    displayedColumns: string[] = ['fsLoanProfilesId', 'admAccountIdPresenterName', 'amount'];
    _dataSource = new MatTableDataSource<FsManageTransactionFeeDTO>();

    constructor(
        private _investmentTransactionFeeService: InvestmentTransactionFeeService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.debtManagement = this._investmentTransactionFeeService.selectedProfile$;
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
        this._investmentTransactionFeeService.prepare().subscribe((res) => {
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
        this._investmentTransactionFeeService.closeDetailDrawer();
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
                this._investmentTransactionFeeService.doSignReq(request).subscribe((response) => {
                    if (response.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                        this._investmentTransactionFeeService.getDetail({fsTranferWalletReqId:this.requestId}).subscribe();
                        this._investmentTransactionFeeService.searchInvestmentTransactionFeeReq().subscribe();
                    } else {
                        this._fuseAlertService.showMessageError(response.message.toString());
                    }
                });
            }
        });
    }
}
