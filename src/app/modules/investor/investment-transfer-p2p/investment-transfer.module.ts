import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedUIModule} from '../../../shared/components/shared-ui.module';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {InvestmentTransferComponent} from './investment-transfer.component';
import {AsyncPipe, NgIf, NgStyle} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";

const investmentTransferRoutes: Route[] = [
    {
        path     : '',
        component: InvestmentTransferComponent,
        children: [
            {
                data: { title: 'Đang chuyển nhượng' },
                path: 'offer',
                loadChildren: () => import('./create-p2p/offer.module').then(m => m.OfferModule),
            },
            {
                data: { title: 'Hồ sơ đề nghị chuyển nhượng' },
                path: 'sale',
                loadChildren: () => import('./buy-p2p/investment-transfer-sale.module').then(m => m.InvestmentTransferSaleModule)
            }
        ],
    }
];

@NgModule({
    declarations: [
        InvestmentTransferComponent,
    ],
    imports: [
        RouterModule.forChild(investmentTransferRoutes),
        MatSidenavModule,
        SharedUIModule,
        FuseNavigationModule,
        MatTabsModule,
        MatDividerModule,
        MatButtonModule,
        MatTooltipModule,
        MatTabsModule,
        MatIconModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatDialogModule,
        FuseCardModule,
        NgIf,
        AsyncPipe,
        NgStyle,
        TranslocoModule,
    ]
})
export class InvestmentTransferModule
{
}
