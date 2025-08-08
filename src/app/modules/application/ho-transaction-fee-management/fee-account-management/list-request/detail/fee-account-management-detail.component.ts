import {
    AfterContentInit,
    AfterViewInit,
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {Observable, of} from 'rxjs';
import {AccountManagementFeeService} from "../../../../../../service";
import {FsTranferWalletReqDTO} from "../../../../../../models/service/FsTranferWalletReqDTO.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {FsManageTransactionFeeDTO} from "../../../../../../models/service/FsManageTransactionFeeDTO.model";
import {
    SignRequestDialogComponent
} from "../../../../../../shared/components/sign-request-dialog/sign-request-dialog.component";
import {APP_TEXT} from "../../../../../../shared/constants";
import {AdmAccountDetailDTO} from "../../../../../../models/admin";
import {fuseAnimations} from "../../../../../../../@fuse/animations";

@Component({
    selector: 'fee-account-management-detail',
    templateUrl: './fee-account-management-detail.component.html',
    styleUrls: ['./fee-account-management-detail.component.scss'],
    animations: fuseAnimations,
})
export class FeeAccountManagementDetailComponent implements OnInit, AfterViewInit {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public debtManagement: Observable<FsTranferWalletReqDTO>;
    public lstAccountApproval: AdmAccountDetailDTO[];
    public requestId: number = 0;
    displayedColumns: string[] = ['position', 'name', 'weight'];
    _dataSource = new MatTableDataSource<FsManageTransactionFeeDTO>();

    constructor(
        private _accountManagementFeeService: AccountManagementFeeService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.debtManagement = this._accountManagementFeeService.selectedProfile$;
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
        this._accountManagementFeeService.prepare().subscribe((res) => {
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
        this._accountManagementFeeService.closeDetailDrawer();
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
                this._accountManagementFeeService.doSignReq(request).subscribe((response) => {
                    if (response.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
                        this._accountManagementFeeService.getDetail({fsTranferWalletReqId: this.requestId}).subscribe();
                        this._accountManagementFeeService.searchAccountManagementFeeReq().subscribe();
                    } else {
                        this._fuseAlertService.showMessageError(response.message.toString());
                    }
                });
            }
        });
    }
}
