import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FuseNavigationItem} from '../../../../@fuse/components/navigation';
import {MatDrawer} from '@angular/material/sidenav';
import {RechargeTransactionService} from '../../../service/admin/recharge-transaction.service';
import {ROUTER_CONST} from '../../../shared/constants';

@Component({
    selector     : 'investor-charge-transaction',
    templateUrl  : './transaction-fee-management.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TransactionFeeManagementComponent
{
    menuData: FuseNavigationItem[];
    @ViewChild('detailDrawer', { static: true }) detailDrawer: MatDrawer;

    /**
     * Constructor
     */
    constructor(
        private _rechargeTransactionService: RechargeTransactionService,
    ) {
        this.menuData = [
            {
                title   : 'Quản lý phí giao dịch',
                type    : 'group',
                children: [
                    {
                        title: 'Phí kết nối huy động vốn',
                        type : 'collapsable',
                        link: `${ROUTER_CONST.config.application.transactionFeeManagement.link}`,
                        exactMatch: true,
                        children: [
                            {
                                title: 'Danh sách giao dịch',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeLoanArrangement.link}/list`,
                                exactMatch: true,
                            },
                            {
                                title: 'Yêu cầu điều chuyển tiền ví',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeLoanArrangement.link}/request`,
                                exactMatch: true,
                            }
                        ]
                    },
                    {
                        title: 'Phí quản lý tài khoản',
                        type : 'collapsable',
                        link: `${ROUTER_CONST.config.application.transactionFeeManagement.link}`,
                        exactMatch: true,
                        children: [
                            {
                                title: 'Danh sách giao dịch',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeAccountManagement.link}/list`,
                                exactMatch: true,
                            },
                            {
                                title: 'Yêu cầu điều chuyển tiền ví',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeAccountManagement.link}/request`,
                                exactMatch: true,
                            }
                        ]
                    },
                    {
                        title: 'Phí giao dịch chuyển nhượng',
                        type : 'collapsable',
                        link: `${ROUTER_CONST.config.application.transactionFeeManagement.link}`,
                        exactMatch: true,
                        children: [
                            {
                                title: 'Danh sách giao dịch',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeTransferTransaction.link}/list`,
                                exactMatch: true,
                            },
                            {
                                title: 'Yêu cầu điều chuyển tiền ví',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeTransferTransaction.link}/request`,
                                exactMatch: true,
                            }
                        ]
                    },
                    {
                        title: 'Phí kết nối đầu tư',
                        type : 'collapsable',
                        link: `${ROUTER_CONST.config.application.transactionFeeManagement.link}`,
                        exactMatch: true,
                        children: [
                            {
                                title: 'Danh sách giao dịch',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeInvestmentTransaction.link}/list`,
                                exactMatch: true,
                            },
                            {
                                title: 'Yêu cầu điều chuyển tiền ví',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeInvestmentTransaction.link}/request`,
                                exactMatch: true,
                            }
                        ]
                    },
                    // {
                    //     title: 'Phí giao dịch nạp tiền',
                    //     type : 'collapsable',
                    //     link: `${ROUTER_CONST.config.application.transactionFeeManagement.link}`,
                    //     exactMatch: true,
                    //     children: [
                    //         {
                    //             title: 'Danh sách giao dịch',
                    //             type : 'basic',
                    //             link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeDepositTransaction.link}/list`,
                    //             exactMatch: true,
                    //         },
                    //         {
                    //             title: 'Yêu cầu điều chuyển tiền ví',
                    //             type : 'basic',
                    //             link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeDepositTransaction.link}/request`,
                    //             exactMatch: true,
                    //         }
                    //     ]
                    // },
                    // {
                    //     title: 'Phí giao dịch rút tiền',
                    //     type : 'collapsable',
                    //     link: `${ROUTER_CONST.config.application.transactionFeeManagement.link}`,
                    //     exactMatch: true,
                    //     children: [
                    //         {
                    //             title: 'Danh sách giao dịch',
                    //             type : 'basic',
                    //             link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeWithdrawTransaction.link}/list`,
                    //             exactMatch: true,
                    //         },
                    //         {
                    //             title: 'Yêu cầu điều chuyển tiền ví',
                    //             type : 'basic',
                    //             link: `${ROUTER_CONST.config.application.transactionFeeManagement.feeWithdrawTransaction.link}/request`,
                    //             exactMatch: true,
                    //         }
                    //     ]
                    // },
                    {
                        title: 'Thuế thu nhập cá nhân',
                        type : 'collapsable',
                        link: `${ROUTER_CONST.config.application.transactionFeeManagement.link}`,
                        exactMatch: true,
                        children: [
                            {
                                title: 'Danh sách giao dịch',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.personalIncomeTax.link}/list`,
                                exactMatch: true,
                            },
                            {
                                title: 'Yêu cầu điều chuyển tiền ví',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.personalIncomeTax.link}/request`,
                                exactMatch: true,
                            }
                        ]
                    },
                    {
                        title: 'Lãi quá hạn',
                        type : 'collapsable',
                        link: `${ROUTER_CONST.config.application.transactionFeeManagement.link}`,
                        exactMatch: true,
                        children: [
                            {
                                title: 'Danh sách giao dịch',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.overdueInterest.link}/list`,
                                exactMatch: true,
                            },
                            {
                                title: 'Yêu cầu điều chuyển tiền ví',
                                type : 'basic',
                                link: `${ROUTER_CONST.config.application.transactionFeeManagement.overdueInterest.link}/request`,
                                exactMatch: true,
                            }
                        ]
                    },
                ]
            },
        ];
    }

    // ngOnInit(): void {
    //     this._rechargeTransactionService.setDrawer(this.detailDrawer);
    // }
}
