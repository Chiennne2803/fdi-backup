import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {LoanCallingComponent} from './loan-calling.component';
import {SharedModule} from '../../../shared/shared.module';
import {MatSortModule} from '@angular/material/sort';
import {LoanDetailComponent} from './loan-detail/loan-detail.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FuseCardModule} from "../../../../@fuse/components/card";
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";

const loanCallingRoutes: Route[] = [
    {
        path: '',
        component: LoanCallingComponent,
        children: [
            {
                path: ':id',
                component: LoanDetailComponent,
            }
        ]
    }
];

@NgModule({
    declarations: [
        LoanCallingComponent
    ],
    imports: [
        RouterModule.forChild(loanCallingRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        FuseCardModule,
        TranslocoModule,
    ]
})
export class LoanCallingModule {
}
