import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';

import {MatDialog} from '@angular/material/dialog';
import {PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {Router} from '@angular/router';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {TransWithdrawCashService} from 'app/service';
import {ButtonTableEvent} from 'app/shared/models/datatable/table-config.model';
import {Observable} from 'rxjs';
import {TABLE_WITHDRAW_CONFIG, TASK_BAR_CONFIG} from '../investor.config';
import {MakeWithdrawDialogsComponent} from 'app/shared/components/dialog/make-withdraw/make-withdraw-dialogs.component';
import {GroupSearchComponent} from 'app/shared/components/group-search/group-search.component';
import {
    DateTimeSearch,
    DropListSearch,
    IDropList,
    InputSearch
} from 'app/shared/components/group-search/search-config.models';
import {WithdrawInformationDialogComponent} from "./dialog/withdraw-information-dialog/withdraw-information-dialog.component";
import {DialogService} from "../../../service/common-service/dialog.service";
import {TABLE_BUTTON_CONFIG} from "../../admin/access-log/staff/staff.config";

@Component({
    selector: 'investor-withdraw',
    templateUrl: './withdraw.component.html',
    encapsulation: ViewEncapsulation.None
})
export class WithdrawComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    public _tableConfig = TABLE_WITHDRAW_CONFIG;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _dataButtonConfig = TABLE_BUTTON_CONFIG;
    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: BaseRequest = new BaseRequest();
    private _dataSearchDialog: object;
    private lstBank: IDropList[] = [];

    /**
     * Constructor
     */
    constructor(
        private _withdrawService: TransWithdrawCashService,
        private router: Router,
        private matDialog: MatDialog,
        private _dialogService: DialogService,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._withdrawService.lazyLoad;
        this._withdrawService.getPrepareLoadingPage().subscribe((res: BaseResponse) => {
            if (res.payload.lstBank != undefined && res.payload.lstBank.length > 0) {
                this.lstBank.push({label: 'Tẩt cả', value: ''});
                res.payload.lstBank.forEach(admCategoriesDTO => {
                    this.lstBank.push({
                        label: admCategoriesDTO.categoriesName,
                        value: admCategoriesDTO.categoriesName
                    });
                })
            }
        });
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value
        };
        this._withdrawService.doSearch(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._tableConfig.isViewDetail = false;
        const dialogRef = this.matDialog.open(WithdrawInformationDialogComponent, {
            data: {
                baseData: row,
                complete: () => {
                    dialogRef.close();
                },
            },
        });
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.openDialog();
                break;
            case 'advanced-search':
                this.handleAdvancedSearch();
                break;
            default:
                break;
        }
    }

    public openDialog(): void {
        this._withdrawService.initTransWithdrawCash().subscribe(
            (res) => {
                if (res.errorCode === '0') {
                    const dialogRef = this.matDialog.open(MakeWithdrawDialogsComponent, {
                        data: {
                            withdrawDetail: res.payload,
                            complete: () => {
                                dialogRef.close();
                            },
                        }
                    });
                } else {
                    const cfDialog = this._dialogService.openWarningDialog(
                        'Tài khoản của bạn chưa được cấu hình tài khoản ngân hàng' +
                        '<a href="page/profile" class="font-medium text-blue-600 dark:text-blue-500 hover:underline">\n' +
                        '            Vui lòng cấu hình tài khoản ngân hàng\n' +
                        '        </a>'
                    );
                }
            }
        );
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            ...this.searchPayload,
            ...this._dataSearchDialog,
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._withdrawService.doSearch(this.searchPayload).subscribe();
    }

    private handleAdvancedSearch(): void {
        const dialogRef = this.matDialog.open(GroupSearchComponent, {
            data: {
                baseData: this._dataSearchDialog,
                searchConfig: {
                    config: [
                        new DateTimeSearch('createdDate', 'Ngày rút tiền', null, false),
                        new InputSearch('amount', 'Số tiền rút (VND)', null, false, 'number'),
                        new InputSearch('accNo', 'Số tài khoản', null, false),
                        new InputSearch('accName', 'Tên tài khoản thụ hưởng', null, false),
                        new DropListSearch('bankName', 'Tên ngân hàng', this.lstBank, '', false),
                        new DropListSearch('status', 'Trạng thái', [
                            {label: 'Tẩt cả', value: ''},
                            {label: 'Chờ xử lý', value: 0},
                            {label: 'Phê duyệt', value: 1},
                            {label: 'Từ chối', value: 2},
                        ], ''),
                        new InputSearch('info', 'Nội dung', null, false),
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
                    this._withdrawService.doSearch({
                        ...this.searchPayload
                    }).subscribe();
                } else if (response.action === 'search') {
                    this._withdrawService.doSearch(response.form.value).subscribe();
                }
                this._dataSearchDialog = response.form.value;
                dialogRef.close();
            }
        );
    }
}
