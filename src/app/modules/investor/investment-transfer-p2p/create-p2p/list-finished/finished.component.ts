import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { Observable } from 'rxjs';
import {TABLE_INVESTOR_FINISHED_CONFIG, TASK_BAR_CONFIG} from '../offer.config';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {CreateTransferDialogComponent} from '../create-transfer-dialog/create-transfer-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {Router} from '@angular/router';
import {ROUTER_CONST} from 'app/shared/constants';
import {FsReqTransP2PService} from 'app/service/admin/req-trans-p2p.service';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {
    DateTimeFromToSearch, DateTimeSearch, DropListSearch,
    FromToSearch,
    InputSearch
} from 'app/shared/components/group-search/search-config.models';
import {MatDrawer} from "@angular/material/sidenav";

@Component({
    selector: 'investor-waiting-withdraw',
    templateUrl: './finished.component.html',
    encapsulation: ViewEncapsulation.None
})
export class FinishedComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public _dataSource$: Observable<BaseResponse>;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _tableConfig = TABLE_INVESTOR_FINISHED_CONFIG;
    private searchPayload: BaseRequest;
    private _dataSearchDialog: object;
    private _dataTenor = [];
    /**
     * Constructor
     */
    constructor(
        private _fsReqTransP2PService: FsReqTransP2PService,
        private _dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _router: Router,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._fsReqTransP2PService.lazyLoad;
        this._fsReqTransP2PService.setDrawer(this.matDrawer);
        this._fsReqTransP2PService.prepareP2P$.subscribe((res) => {
            res.payload.lstTenor.map((value) => {
                this._dataTenor.push({
                    label: value,
                    value: value
                });
            });
        });
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                const dialogRef = this._dialog.open(CreateTransferDialogComponent, {
                    width: '950px',
                    data: { },
                });
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            default:
                break;
        }
    }

    back(): void {
        this._router.navigate([ROUTER_CONST.config.investor.investmentTransfer.offer.link]);
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        };
        this._fsReqTransP2PService.getListBuyComplete(this.searchPayload).subscribe();
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._fsReqTransP2PService.getListBuyComplete(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._fsReqTransP2PService
            .getDetail({fsReqTransP2PId: row.fsReqTransP2PId})
            .subscribe((res) => {
                this._fsReqTransP2PService.openDetailDrawer();
            });
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this._dialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new InputSearch('fsLoanProfilesId', 'Số hồ sơ', null, false),
                        new FromToSearch('tranferAmount', 'Số tiền chuyển nhượng (VNĐ)', null, 'number'),
                        new DateTimeFromToSearch( 'investorTimeExpried', 'Ngày đáo hạn', null, false),
                        new DropListSearch('loanTimeCycle', 'Kỳ hạn(ngày)', this._dataTenor, null,false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: null},
                            {label: 'Hoàn thành', value: 2},
                            {label: 'Huỷ chủ động', value: 3},
                            {label: 'Hết hạn niêm yết', value: 4},
                            {label: 'Huỷ do hồ sơ đã đóng', value: 5},
                            {label: 'Huỷ do khoản đầu tư đã tất toán', value: 6},
                        ], null),
                        new DateTimeSearch('createdDate', 'Ngày tạo', null, false),
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
                    this._fsReqTransP2PService.getListBuyComplete().subscribe();
                } else if (response.action === 'search') {
                    this._fsReqTransP2PService.getListBuyComplete({
                        ...response.form.value,
                        ...this.searchPayload,
                        createdDate: response.form.value.createdDate ? new Date(response.form.value.createdDate).getTime() : null,
                        investorTimeExpriedForm: response.form.value.investorTimeExpriedForm ? new Date(response.form.value.investorTimeExpriedForm).getTime() : null,
                        investorTimeExpriedTo: response.form.value.investorTimeExpriedTo ? new Date(response.form.value.investorTimeExpriedTo).getTime() : null
                    }).subscribe();
                }
                dialogRef.close();
                this._dataSearchDialog = response.form.value;
            }
        );
    }

    handleCloseDetailPanel($event: Event) {
        this._tableConfig.isViewDetail = false;
    }
}
