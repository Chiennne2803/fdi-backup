import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import {BaseRequest, BaseResponse} from 'app/models/base';
import { TopupService } from 'app/service';
import { ButtonTableEvent } from 'app/shared/models/datatable/table-config.model';
import { Observable } from 'rxjs';
import {TABLE_BUTTON_CONFIG, TABLE_TOPUP_CONFIG, TASK_BAR_CONFIG} from '../Investor-topup.config';
import {FuseAlertService} from '../../../../@fuse/components/alert';

@Component({
    selector: 'borrower-loan-review',
    templateUrl: './investment-topup.component.html',
    encapsulation: ViewEncapsulation.None
})
export class InvestmentTopupComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public _tableTopUpConfig = TABLE_TOPUP_CONFIG;
    public _taskbarConfig = TASK_BAR_CONFIG;
    public _dataButtonConfig = TABLE_BUTTON_CONFIG;
    public _dataSource$: Observable<BaseResponse>;
    private searchPayload: BaseRequest = new BaseRequest();
    /**
     * Constructor
     */
    constructor(
        private _topupService: TopupService,
        private _fuseAlertService: FuseAlertService,
        private router: Router,
    ) {
    }

    ngOnInit(): void {
        this._dataSource$ = this._topupService.lazyLoad;
    }

    public handleSearch($event: Event): void {
        this.searchPayload = {
            ...this.searchPayload,
            quickSearch: ($event.target as HTMLInputElement).value,
        };
        this._topupService.doSearch(this.searchPayload).subscribe();
    }

    handleTableEvent(event: ButtonTableEvent): void {
        switch (event.action) {
            case 'add':
                this.submitRecharge();
                break;
            default:
                break;
        }
    }

    public submitRecharge(): void {
        this._topupService.getPrepareLoadingPage().subscribe((res) => {
            if (res.errorCode == '0') {
                this._topupService.create(res.payload).subscribe((resTopUp) => {
                    if (resTopUp.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess('Tạo giao dịch nạp tiền đầu tư thành công');
                        this._topupService.doSearch().subscribe();
                    } else {
                        this._fuseAlertService.showMessageError(resTopUp.message.toString());
                    }
                });
            } else {
                this._fuseAlertService.showMessageError(res.message.toString());
            }
        });
    }

    public handlePageSwitch($event: PageEvent): void {
        this.searchPayload = {
            page: $event.pageIndex,
            limit: $event.pageSize
        };
        this._topupService.doSearch(this.searchPayload).subscribe();
    }

    public handleRowClick(row: any): void {
        this._tableTopUpConfig.isViewDetail = false;
        this.router.navigate(['borrower/loan-review', row.fsLoanProfilesId]);
    }

}
