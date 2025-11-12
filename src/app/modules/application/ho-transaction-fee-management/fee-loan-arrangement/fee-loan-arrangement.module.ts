import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedUIModule} from '../../../../shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../../@fuse/components/navigation';
import {
    LoanArrangementFeeReqResolver, LoanArrangementFeeResolver,
} from '../transaction-fee-management.resolvers';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FeeLoanArrangementListComponent} from './list-base/fee-loan-arrangement-list.component';
import {FeeLoanArrangementRequestComponent} from './list-request/fee-loan-arrangement-request.component';
import {FeeLoanArrangementDetailComponent} from "./list-request/detail/fee-loan-arrangement-detail.component";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {FeeLoanArrangementDialogComponent} from "./list-base/create-dialog/fee-loan-arrangement-dialog.component";
import {SharedModule} from "../../../../shared/shared.module";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatListModule} from "@angular/material/list";
import {MatSelectModule} from "@angular/material/select";
import {MatDialogModule} from "@angular/material/dialog";
import {MatPaginatorModule} from "@angular/material/paginator";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {TranslocoModule} from "@ngneat/transloco";

const investedProfileRoutes: Route[] = [
    {
        path     : '',
        children: [
            {
                data: { title: 'Danh sách phí kết nối huy động vốn' },
                path: 'list',
                component: FeeLoanArrangementListComponent,
                resolve: {
                    error: LoanArrangementFeeResolver,
                },
            },
            {
                data: { title: 'Yêu cầu phí kết nối huy động vốn' },
                path: 'request',
                component: FeeLoanArrangementRequestComponent,
                resolve: {
                    error: LoanArrangementFeeReqResolver,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        FeeLoanArrangementListComponent,
        FeeLoanArrangementRequestComponent,
        FeeLoanArrangementDetailComponent,
        FeeLoanArrangementDialogComponent
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
export class FeeLoanArrangementModule
{
}
