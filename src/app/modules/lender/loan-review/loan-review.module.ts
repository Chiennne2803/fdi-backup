import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {LoanReviewComponent} from './loan-review.component';
import {SharedModule} from '../../../shared/shared.module';
import {MatSortModule} from '@angular/material/sort';
import {MatSidenavModule} from '@angular/material/sidenav';
import {LoanDetailComponent} from './loan-detail/loan-detail.component';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";

const loanReviewRoutes: Route[] = [
    {
        path     : '',
        component: LoanReviewComponent,
        children : [
            {
                path         : ':id',
                component    : LoanDetailComponent,
            }
        ]
    }
];

@NgModule({
    declarations: [
        LoanReviewComponent
    ],
    imports: [
        RouterModule.forChild(loanReviewRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        TranslocoModule,
    ]
})
export class LoanReviewModule
{
}
