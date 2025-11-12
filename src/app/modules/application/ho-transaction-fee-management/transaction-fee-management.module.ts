import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedUIModule} from '../../../shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TransactionFeeManagementComponent} from './transaction-fee-management.component';
import {AsyncPipe, NgIf, NgStyle} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDialogModule} from "@angular/material/dialog";
import {FeeTransactionManagementCreateComponent} from "./dialog/create/fee-transaction-management-create.component";
import {MatTableModule} from '@angular/material/table';
import {TranslocoModule} from "@ngneat/transloco";

const investedProfileRoutes: Route[] = [
    {
        path     : '',
        component: TransactionFeeManagementComponent,
        children: [
            {
                path: 'fee-loan-arrangement',
                loadChildren: () => import('./fee-loan-arrangement/fee-loan-arrangement.module').then(m => m.FeeLoanArrangementModule),
            },
            {
                path: 'fee-account-management',
                loadChildren: () => import('./fee-account-management/fee-account-management.module').then(m => m.FeeAccountManagementModule),
            },
            {
                path: 'fee-transfer-transaction',
                loadChildren: () => import('./fee-transfer-transaction/fee-transfer-transaction.module').then(m => m.FeeTransferTransactionModule),
            },
            {
                path: 'fee-investment-transaction',
                loadChildren: () => import('./fee-investment-transaction/fee-investment-transaction.module').then(m => m.FeeInvestmentTransactionModule),
            },
            {
                path: 'fee-deposit-transaction',
                loadChildren: () => import('./fee-deposit-transaction/fee-deposit-transaction.module').then(m => m.FeeDepositTransactionModule),
            },
            {
                path: 'fee-withdraw-transaction',
                loadChildren: () => import('./fee-withdraw-transaction/fee-withdraw-transaction.module').then(m => m.FeeWithdrawTransactionModule),
            },
            {
                path: 'personal-income-tax',
                loadChildren: () => import('./personal-income-tax/personal-income-tax.module').then(m => m.PersonalIncomeTaxModule),
            },
            {
                path: 'overdue-interest',
                loadChildren: () => import('./overdue-interest/overdue-interest.module').then(m => m.OverdueInterestModule),
            },
        ],
    }
];

@NgModule({
    declarations: [
        TransactionFeeManagementComponent,
        FeeTransactionManagementCreateComponent
    ],
    imports: [
        RouterModule.forChild(investedProfileRoutes),
        MatSidenavModule,
        MatTableModule,
        SharedUIModule,
        FuseNavigationModule,
        MatTabsModule,
        MatDividerModule,
        MatButtonModule,
        MatTooltipModule,
        MatTabsModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        NgIf,
        AsyncPipe,
        NgStyle,
        TranslocoModule,
    ]
})
export class TransactionFeeManagementModule
{
}
