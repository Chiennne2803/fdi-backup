import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {ReportInvestorTopupComponent} from './accountant/report-investor-topup/report-investor-topup.component';
import {ReportTranspayRequestComponent} from './accountant/report-transpay-request/report-transpay-request.component';
import {ReportInvestorWithdrawCashComponent} from './accountant/report-investor-withdraw-cash/report-investor-withdraw-cash.component';
import {MatSortModule} from '@angular/material/sort';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
    InvestorWithdrawalReportResolver,
    InvestorChargeReportResolver,
    ReportTranspayReqResolver,
    ReportBusinessLoanResolver,
    ReportContractTrackingResolver,
    ReportInvestorResolver,
    ReportServiceFeeResolver,
    ReportTransferTransactionResolver,
} from './accountant/resolver-config.resolver';
import {
    ReportAccountInvestorResolver, ReportInvestResolver, ReportNewAccountResolver
} from './saleInvestor/resolver-config.resolver';
import {
    ReportDebtResolver, ReportLenderResolver, ReportLenderLoanResolver
} from './saleLender/resolver-config.resolver';
import {SharedModule} from '../../shared/shared.module';
import {FuseNavigationModule} from '../../../@fuse/components/navigation';
import {ROUTER_CONST} from '../../shared/constants';
import {TranslocoModule} from "@ngneat/transloco";
import {ReportNewAccountComponent} from "./saleInvestor/report-new-account/report-new-account.component";
import {ReportInvestComponent} from "./saleInvestor/report-invest/report-invest.component";
import {ReportAccountInvestorComponent} from "./saleInvestor/report-account-investor/report-account-investor.component";
import {ReportDebtComponent} from "./saleLender/report-debt/report-debt.component";
import {ReportLenderComponent} from "./saleLender/report-lender/report-lender.component";
import {ReportLenderLoanComponent} from "./saleLender/report-lender-loan/report-lender-loan.component";
import {ReportContractTrackingComponent} from "./accountant/report-contract-tracking/report-contract-tracking.component";
import {ReportServiceFeeComponent} from "./accountant/report-service-fee/report-service-fee.component";
import {ReportBusinessLoanComponent} from "./accountant/report-business-loan/report-business-loan.component";
import {ReportInvestorComponent} from "./accountant/report-investor/report-investor.component";
import {ReportTransferTransactionComponent} from "./accountant/report-transfer-transaction/report-transfer-transaction.component";
import {MatTableModule} from "@angular/material/table";

const route: Route[] = [

    //saleInvestor
    {
        path: ROUTER_CONST.config.statisticalReport.reportAccountInvestor.root,
        component: ReportAccountInvestorComponent,
        resolve: { reportAccountInvestor: ReportAccountInvestorResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.reportNewAccount.root,
        component: ReportNewAccountComponent,
        resolve: { reportNewAccount: ReportNewAccountResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.reportInvest.root,
        component: ReportInvestComponent,
        resolve: { reportInvest: ReportInvestResolver }
    },
    //saleLender
    {
        path: ROUTER_CONST.config.statisticalReport.reportLender.root,
        component: ReportLenderComponent,
        resolve: { reportLender: ReportLenderResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.reportLenderLoan.root,
        component: ReportLenderLoanComponent,
        resolve: { reportLenderLoan: ReportLenderLoanResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.reportDebt.root,
        component: ReportDebtComponent,
        resolve: { reportDebt: ReportDebtResolver }
    },
    //accountant
    {
        path: ROUTER_CONST.config.statisticalReport.investorChargeReport.root,
        component: ReportInvestorTopupComponent,
        resolve: { investorChargeReport: InvestorChargeReportResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.investorWithdrawalReport.root,
        component: ReportInvestorWithdrawCashComponent,
        resolve: { investorWithdrawalReport: InvestorWithdrawalReportResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.businessReturnReport.root,
        component: ReportTranspayRequestComponent,
        resolve: { businessReturnReport: ReportTranspayReqResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.reportContractTracking.root,
        component: ReportContractTrackingComponent,
        resolve: { reportContractTracking: ReportContractTrackingResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.reportServiceFee.root,
        component: ReportServiceFeeComponent,
        resolve: { reportServiceFee: ReportServiceFeeResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.reportBusinessLoan.root,
        component: ReportBusinessLoanComponent,
        resolve: { reportBusinessLoan: ReportBusinessLoanResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.reportInvestor.root,
        component: ReportInvestorComponent,
        resolve: { reportInvestor: ReportInvestorResolver }
    },
    {
        path: ROUTER_CONST.config.statisticalReport.transferTransaction.root,
        component: ReportTransferTransactionComponent,
        resolve: { reportTransferTransaction: ReportTransferTransactionResolver }
    },
];

@NgModule({
    declarations: [
        ReportInvestorWithdrawCashComponent,
        ReportTranspayRequestComponent,
        ReportInvestorTopupComponent,
        ReportAccountInvestorComponent,
        ReportNewAccountComponent,
        ReportInvestComponent,
        ReportLenderComponent,
        ReportLenderLoanComponent,
        ReportDebtComponent,
        ReportContractTrackingComponent,
        ReportServiceFeeComponent,
        ReportBusinessLoanComponent,
        ReportInvestorComponent,
        ReportTransferTransactionComponent
    ],
    imports: [
        RouterModule.forChild(route),
        SharedModule,
        MatDialogModule,
        MatIconModule,
        MatSortModule,
        MatSidenavModule,
        FuseNavigationModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        TranslocoModule,
        MatTableModule,
    ]
})
export class StatisticalReportModule { }
