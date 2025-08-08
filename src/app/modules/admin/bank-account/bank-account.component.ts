import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BaseRequest, BaseResponse } from 'app/models/base';
import { FsAccountBankDTO } from 'app/models/service/FsAccountBankDTO.model';
import { AccountBankService } from 'app/service';
import { TextColumn } from 'app/shared/models/datatable/display-column.model';
import { Observable, of } from 'rxjs';
import { TABLE_ACCOUNT_CONFIG } from './bank-account.config';

@Component({
    selector: 'app-bank-account',
    templateUrl: './bank-account.component.html',
    styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    public _tableConfig = TABLE_ACCOUNT_CONFIG;
    public _dataSource: Observable<BaseResponse>;
    public fsAccountBankId: number = 0;

    constructor(
        private _accountService: AccountBankService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
    ) { }

    ngOnInit(): void {
        this._accountService.doSearch().subscribe((res) => {
            this._dataSource = of(res);
        });
    }

    handleCloseDetailPanel(event: boolean): void {
        if (event) {
            this._accountService.doSearch().subscribe((res) => {
                this._dataSource = of(res);
            });
        }
        this._tableConfig.isViewDetail = false;
        this.matDrawer.close();
    }

    handleRowClick(event: FsAccountBankDTO): void {
        this.fsAccountBankId = event.fsAccountBankId;
        this.matDrawer.open();
    }

    handlePageSwitch(event: PageEvent): void {
        const request: BaseRequest = new BaseRequest();
        request.limit = event.pageSize;
        request.page = event.pageIndex;
        this._accountService.doSearch(request).subscribe((res) => {
            this._dataSource = of(res);
        });
    }
}
