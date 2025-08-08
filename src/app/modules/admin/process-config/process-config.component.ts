import {Component, OnInit} from '@angular/core';
import {AdmProcessConfigService} from "../../../service/admin/adm-process-config.service";
import {AdmProcessConfigDTO} from "../../../models/admin/AdmProcessConfigDTO.model";
import {DialogService} from "../../../service/common-service/dialog.service";
import {FuseAlertService} from "../../../../@fuse/components/alert";
import {SyncMemoryService} from "../../../service/admin/sys-memory.service";
import {MatTabChangeEvent} from "@angular/material/tabs";

@Component({
    selector: 'app-process-config',
    templateUrl: './process-config.component.html',
    styleUrls: ['./process-config.component.scss']
})
export class ProcessConfigComponent implements OnInit {

    lstApplication: AdmProcessConfigDTO[] = [];
    lstSystem: AdmProcessConfigDTO[] = [];
    activeTab: number = 0

    public tabs = [
        { id: 0, label: 'Tiến trình ứng dụng' },
        { id: 1, label: 'Tiến trình hệ thống' },
        { id: 2, label: 'Đồng bộ dữ liệu' }
    ];
    constructor(
        private _admProcessConfigService: AdmProcessConfigService,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService,
        private _syncMemoryService: SyncMemoryService
    ) {

    }

    ngOnInit(): void {
        this.initDataPage()
    }

    initDataPage(): void {
        this._admProcessConfigService.prepare().subscribe((res) => {
            if(res) {
                this.lstApplication = res.payload.lstApplication
                this.lstSystem = res.payload.lstSystem
            }
        })
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
        this.initDataPage();
    }

    public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
        this.activeTab = tabChangeEvent.index
    }

}
