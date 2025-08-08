import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FuseNavigationItem} from '../../../../@fuse/components/navigation';
import {MatDrawer} from '@angular/material/sidenav';
import {RechargeTransactionService} from '../../../service/admin/recharge-transaction.service';
import {ROUTER_CONST} from '../../../shared/constants';

@Component({
    selector     : 'investor-charge-transaction',
    templateUrl  : './investor-charge-transaction.component.html',
    encapsulation: ViewEncapsulation.None
})
export class InvestorChargeTransactionComponent
{
    menuData: FuseNavigationItem[];
    // @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(
        private _rechargeTransactionService: RechargeTransactionService,
    ) {
        this.menuData = [
            {
                title   : 'Xử lý giao dịch nạp tiền',
                type    : 'group',
                children: [
                    {
                        title: 'Giao dịch lỗi',
                        type : 'basic',
                        link: `${ROUTER_CONST.config.application.investorChargeTransaction.link}`,
                        exactMatch: true,
                    },
                    {
                        title: 'Giao dịch thành công',
                        type : 'basic',
                        link: `${ROUTER_CONST.config.application.investorChargeTransaction.link}/success`,
                    },
                ]
            },
        ];
    }

    ngOnInit(): void {
        // this._rechargeTransactionService.setDrawer(this.detailDrawer);
    }
}
