import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {InvestmentTopupComponent} from './investment-topup.component';
import {SharedModule} from '../../../shared/shared.module';
import {MatSortModule} from '@angular/material/sort';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";

const loanReviewRoutes: Route[] = [
    {
        path     : '',
        component: InvestmentTopupComponent,
    }
];

@NgModule({
    declarations: [
        InvestmentTopupComponent,
    ],
    imports: [
        RouterModule.forChild(loanReviewRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        MatDialogModule,
        TranslocoModule,
    ]
})
export class InvestmentTopupModule
{
}
