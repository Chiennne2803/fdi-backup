import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {AccountStatementComponent} from './account-statement.component';
import {SharedModule} from '../../../shared/shared.module';
import {MatSortModule} from '@angular/material/sort';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FuseCardModule} from "../../../../@fuse/components/card";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";
import {MatTabsModule} from "@angular/material/tabs";

const accountStatementRoutes: Route[] = [
    {
        path     : '',
        component: AccountStatementComponent,
        children : [
            {
                path         : ':id',
                component    : AccountStatementComponent,
            }
        ]
    }
];

@NgModule({
    declarations: [
        AccountStatementComponent
    ],
    imports: [
        RouterModule.forChild(accountStatementRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        FuseCardModule,
        MatButtonModule,
        MatIconModule,
        TranslocoModule,
        MatTabsModule,
    ]
})
export class AccountStatementModule
{
}
