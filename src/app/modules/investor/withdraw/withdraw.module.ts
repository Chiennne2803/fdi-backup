import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {WithdrawComponent} from './withdraw.component';
import {SharedModule} from '../../../shared/shared.module';
import {MatSortModule} from '@angular/material/sort';
import {MatSidenavModule} from '@angular/material/sidenav';
import {
    WithdrawInformationDialogComponent
} from './dialog/withdraw-information-dialog/withdraw-information-dialog.component';
import {MatIconModule} from "@angular/material/icon";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";

const loanReviewRoutes: Route[] = [
    {
        path     : '',
        component: WithdrawComponent,
        // children : [
        //     {
        //         path         : ':id',
        //         component    : LoanDetailComponent,
        //     }
        // ]
    }
];

@NgModule({
    declarations: [
        WithdrawComponent,
        WithdrawInformationDialogComponent
    ],
    imports: [
        RouterModule.forChild(loanReviewRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        RouterModule,
        MatIconModule,
        CurrencyMaskModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatButtonModule,
        TranslocoModule,
    ]
})
export class WithdrawModule
{
}
