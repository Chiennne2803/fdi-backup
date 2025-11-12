import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedUIModule } from '../../../../shared/components/shared-ui.module';
import { FuseNavigationModule } from '../../../../../@fuse/components/navigation';
import {
    OverdueInterestReqResolver,
    OverdueInterestResolver,
    PersonalIncomeTaxResolver,
} from '../transaction-fee-management.resolvers';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverdueInterestListComponent } from './list-base/overdue-interest-list.component';
import { OverdueInterestRequestComponent } from './list-request/overdue-interest-request.component';
import { OverdueInterestDetailComponent } from './list-request/detail/overdue-interest-detail.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { OverdueInterestDialogComponent } from "./list-base/create-dialog/overdue-interest-dialog.component";
import { SharedModule } from "../../../../shared/shared.module";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from "@angular/material/dialog";
import { MatPaginatorModule } from "@angular/material/paginator";
import { CurrencyMaskModule } from "ng2-currency-mask";
import { TranslocoModule } from "@ngneat/transloco";

const investedProfileRoutes: Route[] = [
    {
        path: '',
        children: [
            {
                data: { title: 'Danh sách lãi quá hạn' },
                path: 'list',
                component: OverdueInterestListComponent,
                resolve: {
                    error: OverdueInterestResolver,
                },
            },
            {
                data: { title: 'Yêu cầu lãi quá hạn' },
                path: 'request',
                component: OverdueInterestRequestComponent,
                resolve: {
                    error: OverdueInterestReqResolver,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        OverdueInterestListComponent,
        OverdueInterestRequestComponent,
        OverdueInterestDetailComponent,
        OverdueInterestDialogComponent
    ],
    imports: [
        RouterModule.forChild(investedProfileRoutes),
        MatSidenavModule,
        SharedUIModule,
        FuseNavigationModule,
        MatTabsModule,
        MatDividerModule,
        MatButtonModule,
        MatTooltipModule,
        MatTabsModule,
        MatIconModule,
        MatTableModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatSelectModule,
        MatDialogModule,
        FuseNavigationModule,
        MatPaginatorModule,
        CurrencyMaskModule,
        TranslocoModule,
    ]
})
export class OverdueInterestModule {
}
