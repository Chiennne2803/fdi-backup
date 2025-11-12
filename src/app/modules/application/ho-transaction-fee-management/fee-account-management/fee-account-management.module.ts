import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedUIModule} from '../../../../shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../../@fuse/components/navigation';
import {
    AccountManagementFeeReqResolver,
    AccountManagementFeeResolver,
} from '../transaction-fee-management.resolvers';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FeeAccountManagementListComponent} from './list-base/fee-account-management-list.component';
import {FeeAccountManagementRequestComponent} from './list-request/fee-account-management-request.component';
import {MatTableModule} from "@angular/material/table";
import {MatIconModule} from "@angular/material/icon";
import {FeeAccountManagementDialogComponent} from "./list-base/create-dialog/fee-account-management-dialog.component";
import {SharedModule} from "../../../../shared/shared.module";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatSelectModule} from "@angular/material/select";
import {
    CommissionManagementRoutingModule
} from "../../ho-commission-management/commission-management-routing.module";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {FeeAccountManagementDetailComponent} from "./list-request/detail/fee-account-management-detail.component";
import {MatPaginatorModule} from "@angular/material/paginator";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {TranslocoModule} from "@ngneat/transloco";

const investedProfileRoutes: Route[] = [
    {
        path     : '',
        children: [
            {
                data: { title: 'Danh sách phí quản lý tài khoản' },
                path: 'list',
                component: FeeAccountManagementListComponent,
                resolve: {
                    error: AccountManagementFeeResolver,
                },
            },
            {
                data: { title: 'Yêu cầu phí quản lý tài khoản' },
                path: 'request',
                component: FeeAccountManagementRequestComponent,
                resolve: {
                    error: AccountManagementFeeReqResolver,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        FeeAccountManagementListComponent,
        FeeAccountManagementRequestComponent,
        FeeAccountManagementDialogComponent,
        FeeAccountManagementDetailComponent
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
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        SharedModule,
        CommissionManagementRoutingModule,
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
export class FeeAccountManagementModule
{
}
