import { Component, HostListener, ViewEncapsulation } from '@angular/core';
import { FuseNavigationItem } from '../../../../@fuse/components/navigation';
import { RechargeTransactionService } from '../../../service/admin/recharge-transaction.service';
import { ROUTER_CONST } from '../../../shared/constants';

@Component({
    selector: 'investor-charge-transaction',
    templateUrl: './investor-charge-transaction.component.html',
    encapsulation: ViewEncapsulation.None
})
export class InvestorChargeTransactionComponent {
    menuData: FuseNavigationItem[];
    // @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(
        private _rechargeTransactionService: RechargeTransactionService,
    ) {
        this.checkScreenSize();
        this.menuData = [
            {
                title: 'Xử lý giao dịch nạp tiền',
                type: 'group',
                children: [
                    {
                        title: 'Giao dịch chờ nạp tiền',
                        type: 'basic',
                        link: `${ROUTER_CONST.config.application.investorChargeTransaction.link}/wait`,
                    },
                    {
                        title: 'Giao dịch thành công',
                        type: 'basic',
                        link: `${ROUTER_CONST.config.application.investorChargeTransaction.link}/success`,
                    },
                    {
                        title: 'Giao dịch lỗi',
                        type: 'basic',
                        link: `${ROUTER_CONST.config.application.investorChargeTransaction.link}`,
                        exactMatch: true,
                    },
                ]
            },
        ];
    }

    ngOnInit(): void {
        // this._rechargeTransactionService.setDrawer(this.detailDrawer);
    }

    isMobile = false;

    @HostListener('window:resize', [])
    onResize() {
        this.checkScreenSize();
    }

    private checkScreenSize() {
        this.isMobile = window.innerWidth < 1024; // < 1024px thì coi là mobile/tablet
    }
}
