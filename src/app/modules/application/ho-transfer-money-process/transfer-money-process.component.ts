import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { MatDrawer } from '@angular/material/sidenav';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { FsTranferWalletReqDTO } from 'app/models/service/FsTranferWalletReqDTO.model';
import { ManagementBonusReqService } from 'app/service/admin/management-bonus-req.service';
import { ManagementTranferWalletReqService } from 'app/service/admin/management-tranfer-wallet-req.service';
import { TextColumn } from 'app/shared/models/datatable/display-column.model';
import { Observable, of } from 'rxjs';
import { TABLE_CONFIG_ACCOUNT, TABLE_CONFIG_DEPOSIT, TABLE_CONFIG_INVESTMENT, TABLE_CONFIG_LOAN, TABLE_CONFIG_OVERDUE, TABLE_CONFIG_PERSONAL_INCOME, TABLE_CONFIG_TRANSFER_FEE, TABLE_CONFIG_WITHDRAW } from './config';
import { TABLE_BUTTON_ACTION_CONFIG_TRANSFER_MONEY, TABLE_TRANSFER_MONEY_CONFIG, TASK_BAR_CONFIG_TRANSFER_MONEY } from './transfer-money-process.config';
import {PageEvent} from "@angular/material/paginator";
import {ButtonTableEvent} from "../../../shared/models/datatable/table-config.model";
import {MatDialog} from "@angular/material/dialog";
import {GroupSearchComponent} from "../../../shared/components/group-search/group-search.component";
import {
    DateTimeFromToSearch,
    DropListSearch,
    InputSearch
} from "../../../shared/components/group-search/search-config.models";
import {DataTableButtonConfig} from "../../../shared/models/datatable/task-bar.model";

@Component({
    selector: 'app-transfer-money-process',
    templateUrl: './transfer-money-process.component.html',
    styleUrls: ['./transfer-money-process.component.scss']
})
export class TransferMoneyProcessComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public listTransfer = [
        { id: 1, label: 'Phí kết nối huy động vốn' },
        { id: 2, label: 'Phí quản lý tài khoản' },
        { id: 3, label: 'Phí giao dịch chuyển nhượng' },
        { id: 4, label: 'Phí kết nối đầu tư' },
        { id: 5, label: 'Phí giao dịch nạp tiền' },
        { id: 6, label: 'Phí giao dịch rút tiền' },
        { id: 7, label: 'Thuế thu nhập cá nhân' },
        { id: 8, label: 'Lãi quá hạn' },
    ];

    public _dataSource = new Observable<BaseResponse>();
    public _taskBarConfig = TASK_BAR_CONFIG_TRANSFER_MONEY;
    public _btnConfig: DataTableButtonConfig = TABLE_BUTTON_ACTION_CONFIG_TRANSFER_MONEY;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    public selectedCard = this.listTransfer[0];
    public detailId = 0;
    public _tableConfigDetail;
    public _tableConfig = TABLE_TRANSFER_MONEY_CONFIG;

    private selectedIndex = this.listTransfer[0].id;

    constructor(
        private _matDialog: MatDialog,
        private _managementTranferWalletReqService: ManagementTranferWalletReqService,
        private _tempService: ManagementBonusReqService
    ) { }

    ngOnInit(): void {
        this._dataSource =this._managementTranferWalletReqService.lazyLoad;
        this._managementTranferWalletReqService.setDrawer(this.matDrawer);
        this._tempService.prepare().subscribe();
        this.searchLoanArrangementFee();
        this._tableConfigDetail = TABLE_CONFIG_LOAN;
    }

    onSelectionChange(event?: MatSelectionListChange): void {
        if (event) {
            this._managementTranferWalletReqService.closeDetailDrawer();
            this.selectedIndex = event.options.at(0).value.id;
        }
        this.searchPayload = null;
        this.selectionChangedCard();
        this.handleCloseDetailPanel();
    }

    handleRowClick(event: FsTranferWalletReqDTO): void {
        this.detailId = event.fsTranferWalletReqId;
        this._managementTranferWalletReqService.getDetail( {fsTranferWalletReqId: this.detailId}).subscribe();
        this._managementTranferWalletReqService.openDetailDrawer();
    }
    handleCloseDetailPanel(event?: any): void {
        this.selectionChangedCard();
        this._managementTranferWalletReqService.closeDetailDrawer();
        this._tableConfigDetail.isViewDetail = false;
    }

    private selectionChangedCard(): void {
        switch (this.selectedIndex) {
            // Phí quản lý tài khoản
            case 2:
                this.searchAccountManagementFee(this.searchPayload);
                this._tableConfigDetail = TABLE_CONFIG_ACCOUNT;
                this._btnConfig.commonBtn[0].fileName ='Phi_quan_ly_tai_khoan'
                break;
            // Phí giao dịch chuyển nhượng
            case 3:
                this.searchTransferTransactionFee(this.searchPayload);
                this._tableConfigDetail = TABLE_CONFIG_TRANSFER_FEE;
                this._btnConfig.commonBtn[0].fileName ='Phi_chuyen_nhuong'
                break;
            // Phí kết nối
            case 4:
                this.searchInvestmentTransactionFee(this.searchPayload);
                this._tableConfigDetail = TABLE_CONFIG_INVESTMENT;
                this._btnConfig.commonBtn[0].fileName ='Phi_ket_noi'
                break;
            // Phí giao dịch nạp tiền
            case 5:
                this.searchDepositTransactionFee(this.searchPayload);
                this._tableConfigDetail = TABLE_CONFIG_DEPOSIT;
                this._btnConfig.commonBtn[0].fileName = 'Phi_nap_tien'
                break;
            // Phí giao dịch rút tiền
            case 6:
                this.searchWithdrawalTransactionFee(this.searchPayload);
                this._tableConfigDetail = TABLE_CONFIG_WITHDRAW;
                this._btnConfig.commonBtn[0].fileName = 'Phi_rut_tien'
                break;
            // Thuế thu nhập cá nhân
            case 7:
                this.searchPersonalIncomeTax(this.searchPayload);
                this._tableConfigDetail = TABLE_CONFIG_PERSONAL_INCOME;
                this._btnConfig.commonBtn[0].fileName = 'Thue_thu_nhap_ca_nhan'
                break;
            // Lãi quá hạn
            case 8:
                this.searchOverdueInterest(this.searchPayload);
                this._tableConfigDetail = TABLE_CONFIG_OVERDUE;
                this._btnConfig.commonBtn[0].fileName = 'Lai_qua_han'
                break;
            // Phí thu xếp khoản vay
            default:
                this.searchLoanArrangementFee(this.searchPayload);
                this._tableConfigDetail = TABLE_CONFIG_LOAN;
                this._btnConfig.commonBtn[0].fileName = 'Phi_thu_xep_khoan_vay'
                break;
        }
    }

    //#region Call  to get list item in selection tab
    /**
     * Phi thu xep khoan vay
     */
    private searchLoanArrangementFee(request?: FsTranferWalletReqDTO): void {
        this._managementTranferWalletReqService.searchLoanArrangementFee(request).subscribe((res) => {
            this._dataSource = of(res);
        });
    }
    /**
     * Phi quan ly tai khoan
     */
    private searchAccountManagementFee(request?: FsTranferWalletReqDTO): void {
        this._managementTranferWalletReqService.searchAccountManagementFee(request).subscribe((res) => {
            this._dataSource = of(res);
        });
    }
    /**
     * Phi giao dich chuyen nhuong
     */
    private searchTransferTransactionFee(request?: FsTranferWalletReqDTO): void {
        this._managementTranferWalletReqService.searchTransferTransactionFee(request).subscribe((res) => {
            this._dataSource = of(res);
        });
    }
    /**
     * phi ket noi
     */
    private searchInvestmentTransactionFee(request?: FsTranferWalletReqDTO): void {
        this._managementTranferWalletReqService.searchInvestmentTransactionFee(request).subscribe((res) => {
            this._dataSource = of(res);
        });
    }
    /**
     * phi giao dich nap tien
     */
    private searchDepositTransactionFee(request?: FsTranferWalletReqDTO): void {
        this._managementTranferWalletReqService.searchDepositTransactionFee(request).subscribe((res) => {
            this._dataSource = of(res);
        });
    }
    /**
     * phi giao dich rut tien
     */
    private searchWithdrawalTransactionFee(request?: FsTranferWalletReqDTO): void {
        this._managementTranferWalletReqService.searchWithdrawalTransactionFee(request).subscribe((res) => {
            this._dataSource = of(res);
        });
    }
    /**
     * Thue thu nhap ca nhan
     */
    private searchPersonalIncomeTax(request?: FsTranferWalletReqDTO): void {
        this._managementTranferWalletReqService.searchPersonalIncomeTax(request).subscribe((res) => {
            this._dataSource = of(res);
        });
    }
    /**
     * Lai qua han
     */
    private searchOverdueInterest(request?: FsTranferWalletReqDTO): void {
        this._managementTranferWalletReqService.searchOverdueInterest(request).subscribe((res) => {
            this._dataSource = of(res);
        });
    }
    //#endregion

    public handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            default:
                break;
        }
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('transCode', 'Mã yêu cầu', null, false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Soạn thảo', value: 1},
                            {label: 'Chờ xử lý', value: 2},
                            {label: 'Phê duyệt', value: 3},
                            {label: 'Từ chối', value: 4},
                        ], null),
                        new DateTimeFromToSearch('createdDate', 'Ngày lập', null, false),
                    ]
                },
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.btnSearchClicked.subscribe(
            (response) => {
                if (response.action === 'reset') {
                    this.selectionChangedCard();
                } else if (response.action === 'search') {
                    this.searchPayload = {
                        ...response.form.value,
                    };
                    this.selectionChangedCard();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this.selectionChangedCard();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this.selectionChangedCard();
    }

}
