import {Component, OnInit, ViewChild} from '@angular/core';
import {FuseNavigationItem} from '../../../../@fuse/components/navigation';
import {MatDrawer} from '@angular/material/sidenav';
import {ROUTER_CONST} from '../../../shared/constants';
import {TranspayReqTransactionService} from "../../../service";
import {fuseAnimations} from "../../../../@fuse/animations";

@Component({
    selector: 'app-lender-refund',
    templateUrl: './lender-refund.component.html',
    styleUrls: ['./lender-refund.component.scss'],
    animations: fuseAnimations
})
export class LenderRefundComponent implements OnInit {
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;
    menuData: FuseNavigationItem[];
    public isShowDetail = false;

    constructor(
        private _reqTransactionService: TranspayReqTransactionService,
    ) { }

    ngOnInit(): void {
        this.menuData = [
            {
                title   : 'Xử lý giao dịch hoàn trả khoản huy động',
                type    : 'group',
                children: [
                    {
                        title: 'Lập yêu cầu thanh toán',
                        type : 'basic',
                        link: ROUTER_CONST.config.application.lenderRefund.waitPayTransaction.link,
                        exactMatch: true,
                    },
                    {
                        title: 'Chờ xử lý',
                        type : 'basic',
                        link: ROUTER_CONST.config.application.lenderRefund.waitProcessTransaction.link,
                    },
                    {
                        title: 'Giao dịch lỗi',
                        type : 'basic',
                        link: ROUTER_CONST.config.application.lenderRefund.errorTrans.link,
                    },
                    {
                        title: 'Chờ phê duyệt',
                        type : 'basic',
                        link: ROUTER_CONST.config.application.lenderRefund.waitApproveTrans.link,
                    },
                    {
                        title: 'Đã phê duyệt',
                        type : 'basic',
                        link: ROUTER_CONST.config.application.lenderRefund.processedTrans.link,
                    },
                    {
                        title: 'Giao dịch hết hạn',
                        type: 'basic',
                        link: ROUTER_CONST.config.application.lenderRefund.timeoutTrans.link,
                    },
                ]
            },
        ];
        this._reqTransactionService.isShowDetail$.subscribe((value: boolean) => {
            this.isShowDetail = value;
        })
    }
}
