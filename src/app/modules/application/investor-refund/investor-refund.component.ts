import {Component, OnInit, ViewChild} from '@angular/core';
import {FuseNavigationItem} from '../../../../@fuse/components/navigation';
import {MatDrawer} from '@angular/material/sidenav';
import {ROUTER_CONST} from '../../../shared/constants';
import {InvestorListService} from '../../../service/investor/investor-profile-list.service';
import {TranspayInvestorTransactionService} from "../../../service";
import {fuseAnimations} from "../../../../@fuse/animations";

@Component({
  selector: 'app-investor-refund',
  templateUrl: './investor-refund.component.html',
  styleUrls: ['./investor-refund.component.scss'],
    animations: fuseAnimations
})
export class InvestorRefundComponent implements OnInit {
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;
    menuData: FuseNavigationItem[];
    public isShowDetail = false;

    /**
     * constructor
     * @param _investorTransService
     */
    constructor(
        private _investorTransService: TranspayInvestorTransactionService,
    ) { }

    ngOnInit(): void {
        this.menuData = [
            {
                title   : 'Giao dịch hoàn trả khách hàng',
                type    : 'group',
                children: [
                    {
                        title: 'Soạn thảo',
                        type : 'basic',
                        link: ROUTER_CONST.config.application.investorRefund.draftTrans.link,
                        exactMatch: true,
                    },
                    {
                        title: 'Chờ xử lý',
                        type : 'basic',
                        link: ROUTER_CONST.config.application.investorRefund.waitProcessTransaction.link,
                    },
                    {
                        title: 'Đã xử lý',
                        type : 'basic',
                        link: ROUTER_CONST.config.application.investorRefund.processedTrans.link,
                    },
                ]
            },
        ];
        this._investorTransService.isShowDetail$.subscribe((value: boolean) => {
            this.isShowDetail = value;
        })
    }

}
