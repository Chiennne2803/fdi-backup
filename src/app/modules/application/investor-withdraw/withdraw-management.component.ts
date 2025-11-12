import {Component, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
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
    isMobile = false;
    // @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(
        private _withdrawCashManagerService: WithdrawCashManagerService,
    ) {
        this.checkScreenSize();
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

    @HostListener('window:resize', [])
    onResize() {
        this.checkScreenSize();
    }

    private checkScreenSize() {
        this.isMobile = window.innerWidth < 1024; // < 1024px thì coi là mobile/tablet
    }

    ngOnInit(): void {
        // this._withdrawCashManagerService.setDrawer(this.detailDrawer);
    }
}
