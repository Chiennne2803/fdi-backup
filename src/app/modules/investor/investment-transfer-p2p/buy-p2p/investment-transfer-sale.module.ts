import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {InvestmentTransferSaleComponent} from './list-sale/investment-transfer-sale.component';
import {SharedModule} from 'app/shared/shared.module';
import {MatSortModule} from '@angular/material/sort';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import {InvestmentSellResolvers} from './list-sale/sale.resolvers';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {FuseCardModule} from '../../../../../@fuse/components/card';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {MatPaginatorModule} from "@angular/material/paginator";
import {TranslocoModule} from "@ngneat/transloco";
import {DetailInvestmentTransferComponent} from "./detail-investment-transfet/detail-investment-transfer.component";
import {TransferorDetailsComponent} from "./detail-investment-transfet/transferor-details/transferor-details.component";

const investmentTransferSaleRoutes: Route[] = [
    {
        path     : '',
        component: InvestmentTransferSaleComponent,
        resolve: {
            sale: InvestmentSellResolvers
        }
    }
];

@NgModule({
    declarations: [
        InvestmentTransferSaleComponent,
        DetailInvestmentTransferComponent,
        TransferorDetailsComponent
    ],
    imports: [
        RouterModule.forChild(investmentTransferSaleRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        MatDialogModule,
        MatIconModule,
        MatTabsModule,
        MatDividerModule,
        MatTableModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatSelectModule,
        FuseCardModule,
        MatTooltipModule,
        MatButtonModule,
        MatCheckboxModule,
        CurrencyMaskModule,
        MatPaginatorModule,
        TranslocoModule,
    ]
})
export class InvestmentTransferSaleModule
{
}
