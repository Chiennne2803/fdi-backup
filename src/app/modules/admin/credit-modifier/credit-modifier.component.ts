import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTabChangeEvent} from '@angular/material/tabs';
import {ConfRefundComponent} from './components/conf-refund/conf-refund.component';
import {ConfCreditService, ConfRateService, ConfRefundService} from '../../../service';
import {ConfigBonusService} from '../../../service/admin/config-bonus.service';

@Component({
    selector: 'app-credit-modifier',
    templateUrl: './credit-modifier.component.html',
    styleUrls: ['./credit-modifier.component.scss']
})
export class CreditModifierComponent implements OnInit {
    @ViewChild(ConfRefundComponent) public disburTab: ConfRefundComponent;
    public tabs = [
        { id: 0, label: 'Quản lý hạn mức xếp hạng khách hàng' },
        { id: 1, label: 'Quản lý lãi suất và kỳ hạn huy động vốn' },
        { id: 2, label: 'Cấu hình hoa hồng' },
        { id: 3, label: 'Quản lý giải ngân và hoàn trả' },
    ];
    public selectedTab = 0;
    constructor(private _confRateService: ConfRateService,
                private _confCreditService: ConfCreditService,
                private _confRefundService: ConfRefundService,
                private _configBonusService: ConfigBonusService) { }

    ngOnInit(): void {
    }

    onTabChanged(event: MatTabChangeEvent): void {
        switch (event.index) {
            case 0:
                this._confCreditService.doSearch().subscribe();
            case 1:
                this._confRateService.doSearch().subscribe();
            case 2:
                this._configBonusService.doSearch().subscribe();
            case 3:
                this._confRefundService.prepare().subscribe();
        }

    }

}
