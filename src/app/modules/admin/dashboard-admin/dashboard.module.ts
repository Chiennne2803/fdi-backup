import { NgModule } from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { DashboardAdminComponent } from './dashboard.component';
import {NgApexchartsModule} from "ng-apexcharts";
import {TranslocoModule} from "@ngneat/transloco";

const dashBoardRoute: Route[] = [
    {
        path     : '',
        component: DashboardAdminComponent,
    }
];

@NgModule({
    declarations: [
        DashboardAdminComponent
    ],
    imports     : [
        RouterModule.forChild(dashBoardRoute),
        MatButtonModule,
        MatIconModule,
        SharedModule,
        MatTabsModule,
        MatMenuModule,
        NgApexchartsModule,
        TranslocoModule
    ]
})
export class DashboardModule
{
}
