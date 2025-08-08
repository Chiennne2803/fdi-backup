import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ROUTER_CONST } from 'app/shared/constants';
import { AutomaticInvestmentResolvers } from './automatic-investment/automatic-investment.resolvers';
import { InvestorComponent } from './investor.component';
import { InvestorResolvers, TopUpResolvers } from './investor.resolvers';
import { WithdrawResolvers } from './withdraw.resolvers';
import {DashBoardResolvers} from "../admin/admin.resolvers";

const route: Route[] = [
    {
        path: '',
        component: InvestorComponent,
        children: [
            {
                path: '',
                redirectTo: ROUTER_CONST.config.investor.dashboard.root,
                pathMatch: 'full'
            },
            {
                path: ROUTER_CONST.config.investor.investedProfileManagement.root,
                loadChildren: () => import('./invested-profile-management/invested-profile.module').then(m => m.InvestedProfileModule)
            },
            {
                path: ROUTER_CONST.config.investor.accountStatement.root,
                loadChildren: () => import('./account-statement/account-statement.module').then(m => m.AccountStatementModule),
                resolve: {investorArchive: InvestorResolvers}
            },
            {
                path: ROUTER_CONST.config.investor.investmentTransfer.root,
                loadChildren: () => import('./investment-transfer-p2p/investment-transfer.module').then(m => m.InvestmentTransferModule),
            },
            {
                path: ROUTER_CONST.config.investor.topupInvestment.root,
                loadChildren: () => import('./investment-topup/investment-topup.module').then(m => m.InvestmentTopupModule),
                resolve: {
                    topUp: TopUpResolvers
                },
            },
            {
                path: ROUTER_CONST.config.investor.withdraw.root,
                loadChildren: () => import('./withdraw/withdraw.module').then(m => m.WithdrawModule),
                resolve: {
                    withdraw: WithdrawResolvers
                }
            },
            {
                path: ROUTER_CONST.config.investor.manualInvestment.root,
                loadChildren: () => import('./manual-investment/manual-investment.module').then(m => m.ManualInvestmentModule)
            },
            {
                path: ROUTER_CONST.config.investor.autoInvestment.root,
                loadChildren: () => import('./automatic-investment/automatic-investment.module').then(m => m.AutomaticInvestmentModule),
                resolve: { autoInvestmentPrepare: AutomaticInvestmentResolvers }
            },
            {
                path: ROUTER_CONST.config.investor.kyc.root,
                loadChildren: () => import('./kyc/kyc.module').then(m => m.InvestorKYCModule)
            },
            {
                path: ROUTER_CONST.config.investor.kycSuccess.root,
                loadChildren: () => import('../common/kyc-success/kyc-success.module').then(m => m.KycSuccessModule)
            },
            {
                path: ROUTER_CONST.config.investor.dashboard.root,
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                resolve: {
                    dashboard: DashBoardResolvers,
                }
            },
            {path: '**', redirectTo: ROUTER_CONST.config.investor.dashboard.root}
        ]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})

export class InvestorRoutingModule { }
