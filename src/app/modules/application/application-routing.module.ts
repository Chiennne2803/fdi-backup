import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ROUTER_CONST } from 'app/shared/constants';
import { DebtManagementResolvers } from '../admin/admin.resolvers';
import { ApplicationComponent } from './application.component';
import { BorrowerManagementResolver } from './lender-management/borrower-management.resolver';
import { InvestorManagementResolver } from './investor-management/investor-management.resolver';
import { InvestorRefundResolver } from './investor-refund/investor-refund.resolver';
import { LenderRefundResolver } from './lender-refund/lender-refund.resolver';
import {LoanArrangementFeeResolver} from "./ho-transaction-fee-management/transaction-fee-management.resolvers";

const router: Route[] = [
    {
        path: '',
        component: ApplicationComponent,
        children: [
            {
                path: ROUTER_CONST.config.application.profile.root,
                loadChildren: () => import('./ho-profiles-management/profiles-management.module').then(m => m.ProfilesManagementModule),
            },
            {
                path: ROUTER_CONST.config.application.investor.root,
                loadChildren: () => import('./investor-management/investor-management.module').then(m => m.InvestorManagementModule),
                resolve: {
                    investorManagement: InvestorManagementResolver,
                }
            },
            {
                path: ROUTER_CONST.config.application.borrower.root,
                loadChildren: () => import('./lender-management/borrower-management.module').then(m => m.BorrowerManagementModule),
                resolve: {
                    investorManagement: BorrowerManagementResolver,
                }
            },
            {
                path: ROUTER_CONST.config.application.lenderRefund.root,
                loadChildren: () => import('./lender-refund/lender-refund.module').then(m => m.LenderRefundModule),
                resolve: {
                    lenderRefund: LenderRefundResolver
                }
            },
            {
                path: ROUTER_CONST.config.application.debt.root,
                loadChildren: () => import('./ho-debit-management/debit-management.module').then(m => m.DebitManagementModule),
                resolve: {
                    debtManagement: DebtManagementResolvers
                }
            },
            {
                path: ROUTER_CONST.config.application.investorChargeTransaction.root,
                loadChildren: () => import('./investor-charge-transaction/investor-charge-transaction.module').then(m => m.InvestorChargeTransactionModule)
            },
            {
                path: ROUTER_CONST.config.application.disbursementManagement.root,
                loadChildren: () => import('./ho-disbursement-management/disbursement-management.module').then(m => m.DisbursementManagementModule)
            },
            {
                path: ROUTER_CONST.config.application.investorWithdraw.root,
                loadChildren: () => import('./investor-withdraw/withdraw-management.module').then(m => m.WithdrawManagementModule)
            },
            {
                path: ROUTER_CONST.config.application.investorRefund.root,
                loadChildren: () => import('./investor-refund/investor-refund.module').then(m => m.InvestorRefundModule),
                resolve: { investorRefund: InvestorRefundResolver }
            },
            {
                path: ROUTER_CONST.config.application.transactionFeeManagement.root,
                loadChildren: () => import('./ho-transaction-fee-management/transaction-fee-management.module').then(m => m.TransactionFeeManagementModule),
                resolve: { LoanArrangementFeeResolver: LoanArrangementFeeResolver }
            },

            // Transaction Management
            {
                path: ROUTER_CONST.config.application.transactionManagement.commissionManagement.root,
                loadChildren: () => import('./ho-commission-management/commission-management.module').then(m => m.CommissionManagementModule)
            },
            {
                path: ROUTER_CONST.config.application.transactionManagement.funding.root,
                loadChildren: () => import('./ho-funding/funding.module').then(m => m.FundingModule)
            },
            {
                path: ROUTER_CONST.config.application.transactionManagement.withdrawFromHO.root,
                loadChildren: () => import('./ho-withdraw/withdraw-from-ho.module').then(m => m.WithdrawFromHOModule)
            },

            // Finance Management
            {
                path: ROUTER_CONST.config.application.financeManagement.commissionProcess.root,
                loadChildren: () => import('./ho-commission-process/commission-process.module').then(m => m.CommissionProcessModule)
            },
            {
                path: ROUTER_CONST.config.application.financeManagement.fundingProcess.root,
                loadChildren: () => import('./ho-funding-process/funding-process.module').then(m => m.FundingProcessModule)
            },
            {
                path: ROUTER_CONST.config.application.financeManagement.transferMoneyProcess.root,
                loadChildren: () => import('./ho-transfer-money-process/transfer-money-process.module').then(m => m.TransferMoneyProcessModule)
            },
            {
                path: ROUTER_CONST.config.application.financeManagement.withdrawFromHOProcess.root,
                loadChildren: () => import('./ho-withdraw-process/withdraw-from-ho-process.module').then(m => m.WithdrawFromHOProcessModule)
            },

            // Personal Info (Change Id)
            {
                path: ROUTER_CONST.config.application.personalInfo.root,
                loadChildren: () => import('./ho-change-id/personal-info.module').then(m => m.PersonalInfoModule)
            },
        ]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(router),
    ]
})
export class ApplicationRoutingModule { }
