import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {LoanDetailComponent} from './loan-detail.component';
import {SharedModule} from '../../../../shared/shared.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {FuseCardModule} from "../../../../../@fuse/components/card";
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";

const loanDetailRoutes: Route[] = [
    {
        path     : '',
        component: LoanDetailComponent,
    }
];

@NgModule({
    declarations: [
    ],
    imports: [
        RouterModule.forChild(loanDetailRoutes),
        SharedModule,
        MatButtonModule,
        MatDialogModule,
        FuseCardModule,
        TranslocoModule,
    ]
})
export class LoanDetailModule
{
}
