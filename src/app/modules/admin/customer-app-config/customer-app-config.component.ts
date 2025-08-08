import {Component, OnInit} from '@angular/core';
import {AdmProcessConfigService} from "../../../service/admin/adm-process-config.service";
import {AdmProcessConfigDTO} from "../../../models/admin/AdmProcessConfigDTO.model";
import {DialogService} from "../../../service/common-service/dialog.service";
import {FuseAlertService} from "../../../../@fuse/components/alert";
import {SyncMemoryService} from "../../../service/admin/sys-memory.service";
import {MatTabChangeEvent} from "@angular/material/tabs";
import {BaseResponse} from "../../../models/base";

@Component({
    selector: 'customer-app-config',
    templateUrl: './customer-app-config.component.html',
    styleUrls: ['./customer-app-config.component.scss']
})
export class CustomerAppConfigComponent implements OnInit {

    activeTab: number = 0

    public tabs = [
        { id: 0, label: 'Nhà đầu tư' },
        { id: 1, label: 'Huy động vốn' },
    ];
    constructor(
        private _admProcessConfigService: AdmProcessConfigService,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService,
        private _syncMemoryService: SyncMemoryService
    ) {

    }

    ngOnInit(): void {
    }



    onCacheSys(): void {
        const confirmDialog = this._dialogService.openConfirmDialog(`Xác nhận đồng bộ dữ liệu?`);
        confirmDialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this._syncMemoryService.sync().subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess('Đồng bộ thành công')
                    } else {
                        this._fuseAlertService.showMessageError(res.message?.toString())
                    }
                })
            }
        });
    }

    onFileSys(): void {
        const confirmDialog = this._dialogService.openConfirmDialog(`Xác nhận đồng bộ dữ liệu?`);
        confirmDialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                this._syncMemoryService.syncConfig().subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess('Đồng bộ thành công')
                    } else {
                        this._fuseAlertService.showMessageError(res.message?.toString())
                    }
                })
            }
        });
    }

    onStatusUpdated(): void {
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.activeTab = tabChangeEvent.index
    }

}
