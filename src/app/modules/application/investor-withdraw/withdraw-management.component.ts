import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {FuseNavigationItem} from '../../../../@fuse/components/navigation';
import {WithdrawCashManagerService} from 'app/service/admin/withdrawcash-transaction.service';
import {ROUTER_CONST} from 'app/shared/constants';

@Component({
    selector     : 'withdraw-management',
    templateUrl  : './withdraw-management.component.html',
    encapsulation: ViewEncapsulation.None
})
export class WithdrawManagementComponent implements OnInit
{
    menuData: FuseNavigationItem[];
    // @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(
        private _withdrawCashManagerService: WithdrawCashManagerService,
    ) {
        this.menuData = [
            {
                title   : 'Giao dịch rút tiền khách hàng',
                type    : 'group',
                children: [
                    {
                        title: 'Giao dịch chờ xử lý',
                        type : 'basic',
                        link: `${ROUTER_CONST.config.application.investorWithdraw.link}`,
                        exactMatch: true,
                    },
                    {
                        title: 'Giao dịch đã xử lý',
                        type : 'basic',
                        link: `${ROUTER_CONST.config.application.investorWithdraw.link}/processed`,
                    },
                ]
            },
        ];
    }

    ngOnInit(): void {
        // this._withdrawCashManagerService.setDrawer(this.detailDrawer);
    }
}
