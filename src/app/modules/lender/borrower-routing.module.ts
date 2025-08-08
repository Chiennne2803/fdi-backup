import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ROUTER_CONST } from 'app/shared/constants';
import { BorrowerComponent } from './borrower.component';
import {DashBoardResolvers, LoanArchiveResolvers, LoanCallingResolvers, LoanReviewResolvers} from './loan.resolvers';

const router: Route[] = [
    {
        path: '',
        component: BorrowerComponent,
        children: [
            {
                path: '',
                redirectTo: ROUTER_CONST.config.borrower.dashboard.root,
                pathMatch: 'full'
            },
            {
                path: ROUTER_CONST.config.borrower.loan.create.root,
                loadChildren: () => import('./create-loan/create-loan.module').then(m => m.CreateLoanModule)
            },
            {
                path: ROUTER_CONST.config.borrower.loan.review.root,
                loadChildren: () => import('./loan-review/loan-review.module').then(m => m.LoanReviewModule),
                resolve: {
                    loanReviews: LoanReviewResolvers
                }
            },
            {
                path: ROUTER_CONST.config.borrower.loan.calling.root,
                loadChildren: () => import('./loan-calling/loan-calling.module').then(m => m.LoanCallingModule),
                resolve: {
                    loanCalling: LoanCallingResolvers
                }
            },
            {
                path: ROUTER_CONST.config.borrower.loan.archive.root,
                loadChildren: () => import('./loan-archive/loan-archive.module').then(m => m.LoanArchiveModule),
                resolve: {
                    loanArchive: LoanArchiveResolvers
                }
            },
            {
                path: ROUTER_CONST.config.borrower.dashboard.root,
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                resolve: {
                    dashboard: DashBoardResolvers
                }
            },
            {
                path: ROUTER_CONST.config.borrower.kyc.root,
                loadChildren: () => import('./kyc/kyc.module').then(m => m.BorrowerKycModule),
            },
            {
                path: ROUTER_CONST.config.borrower.kycSuccess.root,
                loadChildren: () => import('../common/kyc-success/kyc-success.module').then(m => m.KycSuccessModule)
            },
            {path: '**', redirectTo: ROUTER_CONST.config.borrower.dashboard.root}
        ]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(router),
    ]
})
export class BorrowerRoutingModule { }
