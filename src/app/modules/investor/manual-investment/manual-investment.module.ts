import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { Route, RouterModule } from '@angular/router';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from '../../../shared/shared.module';
import { TopupDialogComponent } from './topup-dialog/topup-dialog.component';
import { ManualInvestmentComponent } from './manual-investment.component';
import { ListProfileComponent } from './profile-list/list-profile.component';
import {ManualInvestmentDetailComponent} from './profile-list/detail/manual-investment-detail.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {InvestDialogComponent} from './invest-dialog/invest-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {A11yModule} from "@angular/cdk/a11y";
import {NgApexchartsModule} from "ng-apexcharts";
import {TranslocoModule} from "@ngneat/transloco";

const manualInvestmentRoutes: Route[] = [
    {
        path: '',
        component: ManualInvestmentComponent,
        children: [
            {
                path: '',
                component: ListProfileComponent,
                children: [
                    {
                        path: ':id',
                        component: ManualInvestmentDetailComponent,
                    }
                ],
            },
        ]
    }
];

@NgModule({
    declarations: [
        ManualInvestmentComponent,
        ListProfileComponent,
        TopupDialogComponent,
        ManualInvestmentDetailComponent,
        InvestDialogComponent,
    ],
    imports: [
        RouterModule.forChild(manualInvestmentRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        FuseCardModule,
        MatIconModule,
        MatButtonModule,
        MatDialogModule,
        MatTabsModule,
        MatDividerModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatCheckboxModule,
        MatInputModule,
        CurrencyMaskModule,
        MatTableModule,
        MatPaginatorModule,
        A11yModule,
        NgApexchartsModule,
        TranslocoModule,
    ]
})
export class ManualInvestmentModule {
}
