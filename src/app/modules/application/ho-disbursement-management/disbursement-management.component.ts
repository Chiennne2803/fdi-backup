import {Component, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FuseNavigationItem} from '../../../../@fuse/components/navigation';
import {MatDrawer} from '@angular/material/sidenav';
import {RechargeTransactionService} from '../../../service/admin/recharge-transaction.service';
import {ROUTER_CONST} from '../../../shared/constants';

@Component({
    selector     : 'investor-charge-transaction',
    templateUrl  : './disbursement-management.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DisbursementManagementComponent
{
    menuData: FuseNavigationItem[];
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;
    isMobile = false;

    /**
     * Constructor
     */
    constructor(
        private _rechargeTransactionService: RechargeTransactionService,
    ) {
        this.checkScreenSize();
        this.menuData = [
            {
                title   : 'Xử lý giao dịch giải ngân',
                type    : 'group',
                children: [
                    {
                        title: 'Soạn thảo',
                        type : 'basic',
                        link: `${ROUTER_CONST.config.application.disbursementManagement.link}`,
                        exactMatch: true,
                    },
                    {
                        title: 'Chờ xử lý',
                        type : 'basic',
                        link: `${ROUTER_CONST.config.application.disbursementManagement.link}/waiting-process-transaction`,
                    },
                    {
                        title: 'Đã xử lý',
                        type : 'basic',
                        link: `${ROUTER_CONST.config.application.disbursementManagement.link}/success-transaction`,
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

    // ngOnInit(): void {
    //     this._rechargeTransactionService.setDrawer(this.detailDrawer);
    // }
}
