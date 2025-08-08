import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,} from '@angular/core';
import {DialogService} from "../../../../../service/common-service/dialog.service";
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import {BaseResponse} from "../../../../../models/base";
import {AdmCustomerAppConfigDTO} from "../../../../../models/admin/AdmCustomerAppConfigDTO.model";
import {CustomerAppConfigService} from "../../../../../service/admin/customer-app-config.service";

/**
 * Danh sách cau hinh
 */
@Component({
    selector: 'customer-app-config-list',
    templateUrl: './customer-app-config-list.component.html',
    styleUrls: ['./customer-app-config-list.component.scss']
})
export class CustomerAppConfigListComponent implements OnInit, OnChanges {
    @Input() public activeTab: Number = 0;
    @Output() onUpdateStatusSuccess: EventEmitter<any> = new EventEmitter();

    lstData: AdmCustomerAppConfigDTO[] = []
    response: BaseResponse;

    constructor(
        private _customerAppConfigDTO: CustomerAppConfigService,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService
    ) {
        this._customerAppConfigDTO.prepare$.subscribe((res) => {
            if (res) {
                this.response = res;
                this.loadInit();
            }
        })
    }

    loadInit() {
        if (this.response) {
            if (this.activeTab == 0) {
                this.lstData = this.response.payload.investor;
            } else {
                this.lstData = this.response.payload.lender;
            }
            if (this.lstData) {
                this.lstData.forEach((cf: AdmCustomerAppConfigDTO, index) => {
                    if (cf.lstFeature == undefined || cf.lstFeature == null) {
                        var clone = Object.assign({}, cf);
                        cf.lstFeature = [];
                        cf.lstFeature.push(clone)
                    }
                })
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const activeTab = changes.activeTab?.currentValue;
        if (activeTab !== undefined) {
            this.activeTab = activeTab;
            this.loadInit();
        }
    }

    ngOnInit(): void {
    }

    onOffFeature($event: any, appConfigDTO: AdmCustomerAppConfigDTO) {
        const confirmDialog = this._dialogService.openConfirmDialog(`Xác nhận cập nhật cấu hình?`);
        confirmDialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                appConfigDTO.status = appConfigDTO.status == 1 ? 0 : 1;
                this._customerAppConfigDTO.update(appConfigDTO).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess(`Cập nhật thành công`);
                    } else {
                        this._fuseAlertService.showMessageError(res.message?.toString());
                        $event.source.checked = (appConfigDTO.status == 1 ? 0 : 1) == 1;
                    }
                })
            } else {
                $event.source.checked = appConfigDTO.status == 1;
            }
        });
    }
}
