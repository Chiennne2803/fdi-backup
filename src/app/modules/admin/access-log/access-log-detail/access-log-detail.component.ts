import {Component, EventEmitter, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { fuseAnimations } from '@fuse/animations';
import { AdmAccessLogService } from 'app/service';
import { FuseAlertService } from '../../../../../@fuse/components/alert';
import {  FuseConfirmationService } from '../../../../../@fuse/services/confirmation';
import { ROUTER_CONST } from "../../../../shared/constants";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {AdmAccessLogDTO} from "../../../../models/admin/AdmAccessLogDTO.model";
import {environment} from "../../../../../environments/environment";
import {MatTableDataSource} from "@angular/material/table";
import {CategoryDialogComponent} from "../../category/components/category-dialog/category-dialog.component";
import {ActionDetailDialogComponent} from "./dialog/action-detail-dialog.component";

@Component({
    selector: 'detail-investor-refund',
    templateUrl: './access-log-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DetailActionAuditComponent
{
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();
    public detailRecord: AdmAccessLogDTO;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    public dataSource = new MatTableDataSource<any>();
    public lengthRecords: number = 0;
    public pageSize: number = 0;
    public pageSizeOptions = environment.pageSizeOptions;

    /**
     * Constructor
     */
    constructor(
        private _admAccessLogService: AdmAccessLogService,
        private _matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _confirmService: FuseConfirmationService,
        private _router: Router,
    ) {
    }


    ngOnInit(): void {
        this._admAccessLogService.selected$.subscribe(
            (res) => {
                this.detailRecord = res;

                this.dataSource = new MatTableDataSource(this.detailRecord?.lstAdmActionAuditDTOS);
                this.lengthRecords = this.detailRecord?.lstAdmActionAuditDTOS?.length;
                this.dataSource.paginator = this.paginator;

            }
        );
    }

    public closeDrawer(): void {
        this._admAccessLogService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }


    back(): void {
        this._router.navigate([ROUTER_CONST.config.application.investorChargeTransaction.link]);
    }

    public changePageDetail($event: PageEvent): void {
        this._admAccessLogService.doSearchAccessLogInvestor({
            page: $event.pageIndex,
            limit: $event.pageSize
        }).subscribe();
    }

    public onRowClickDetail(row: any): void {
        // console.log(row)
        const dialog = this._matDialog.open(ActionDetailDialogComponent,
    {
            data: row,
            autoFocus: true,
            width: '100%',
            height: '100%',
            disableClose: true
        });
    }
}
