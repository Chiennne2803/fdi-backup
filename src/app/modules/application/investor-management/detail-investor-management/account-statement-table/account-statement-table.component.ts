import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {environment} from "../../../../../../environments/environment";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {CheckboxColumn, TextColumn} from "../../../../../shared/models/datatable/display-column.model";
import {SelectionModel} from "@angular/cdk/collections";
import {FsTransactionHistoryDTO} from "../../../../../models/service";
import {ExcelService} from "../../../../../service/common-service/excel.service";


@Component({
    selector: 'account-statement-table',
    templateUrl: './account-statement-table.component.html',
    animations: fuseAnimations,
})
export class AccountStatementTableComponent implements OnInit {

    @Input() dataSource = new MatTableDataSource<any>();

    public pageSizeOptions = environment.pageSizeOptions;
    @ViewChild('transHistoryPaginator') transHistoryPaginator: MatPaginator;
    public transHistoryPageSize: number = 0;
    selectionTransactionHistory = new SelectionModel<FsTransactionHistoryDTO>(true, []);

    constructor(
        private _excelService: ExcelService
    ) {
    }

    ngOnInit() {
        setTimeout(() => {
            if(this.dataSource) {
                this.dataSource.paginator = this.transHistoryPaginator
            }
        }, 1000);
    }

    get checkDisplayBtnExport(): boolean {
        return this.selectionTransactionHistory.selected.length > 0;
    }

    masterToggle(): void {
        if (this.isAllSelected()) {
            this.selectionTransactionHistory.clear();
        } else {
            this.dataSource?.data?.forEach(row => this.selectionTransactionHistory.select(row));
        }
    }

    isAllSelected(): boolean {
        const numSelected = this.selectionTransactionHistory.selected.length;
        return numSelected === this.dataSource?.data?.length;
    }

    onExportTrans() {
        let columnDefinition = [
            new CheckboxColumn(),
            new TextColumn('transDate', 'Thời gian giao dịch', 10, false, 'DD/MM/YYYY - HH:mm:ss'),
            new TextColumn('amount', 'Số tiền giao dịch (VNĐ)', 10, false, 3),
            new TextColumn('transTypeName', 'Loại giao dịch', 15),
            new TextColumn('fsLoanProfilesId', ' Số hồ sơ', 10),
            new TextColumn('transCode', 'Mã giao dịch', 10),
            new TextColumn('availableBalance', 'Số dư khả dụng tại thời điểm (VNĐ)', 10, false, 3),
        ]           ;
        this._excelService.exportExcel(columnDefinition,
            [
                'transDate',
                'amount',
                'transTypeName',
                'fsLoanProfilesId',
                'transCode',
                'availableBalance',
            ],
            this.selectionTransactionHistory.selected, 'sao_ke_ndt', 'Sao kê NDT');
    }
}
