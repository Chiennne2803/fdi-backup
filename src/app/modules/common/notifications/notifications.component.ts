import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatDrawer} from '@angular/material/sidenav';
import {FuseAlertService} from '@fuse/components/alert';
import {FuseConfirmationService} from '@fuse/services/confirmation';
import {BaseRequest} from 'app/models/base';
import {NotificationsService} from "../../../service/common-service/notifications.service";
import {TABLE_ACCOUNT_CONFIG} from "./notifications.config";
import {SpNotificationDTO} from "../../../models/service/SpNotificationDTO.model";
import {MatTableDataSource} from "@angular/material/table";
import {environment} from "../../../../environments/environment";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
    tasksCount = 10;

    // public _tableConfig = TABLE_ACCOUNT_CONFIG;
    public _dataSource = new MatTableDataSource<SpNotificationDTO>();
    public spNotificationDTO: SpNotificationDTO;
    displayedColumns: string[] = ['title', 'createdDate'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    public lengthRecords: number = 0;
    public pageIndex: number = 0;
    public pageSize: number = 0;
    public pageSizeOptions = environment.pageSizeOptions;

    constructor(
        private _notificationsService: NotificationsService,
        private _confirmService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private activatedRoute: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this._dataSource.paginator = this.paginator;
    }

    ngAfterViewInit(): void {
        this._notificationsService.lazyLoad.subscribe(res => {
            if (res) {
                if (res.content) {
                    this._dataSource = new MatTableDataSource(res.content);
                    this.lengthRecords = res.totalElements;
                    this.pageIndex = res.number;
                    this.pageSize = res.size;
                }
            }
        });
    }

    handleCloseDetailPanel(event: boolean): void {
        this.displayedColumns = ['title', 'createdDate'];
        this.matDrawer.close();
    }

    handleRowClick(event: SpNotificationDTO): void {
        event.isRead = true;
        this.spNotificationDTO = event;
        if (this.matDrawer.opened) {
            this.matDrawer.close();
            setTimeout(() => this.matDrawer.open(), 300);
        } else {
            this.matDrawer.open();
        }
        this.displayedColumns = ['title'];
        this._notificationsService.update(this.spNotificationDTO).subscribe()
    }

    handlePageSwitch(event: PageEvent): void {
        const request: BaseRequest = new BaseRequest();
        request.limit = event.pageSize;
        request.page = event.pageIndex;
        this._notificationsService.doSearch(request).subscribe();
    }
}
