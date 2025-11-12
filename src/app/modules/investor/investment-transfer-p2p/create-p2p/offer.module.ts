import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {SharedModule} from '../../../../shared/shared.module';
import {MatSortModule} from '@angular/material/sort';
import {MatSidenavModule} from '@angular/material/sidenav';
import {OfferingComponent} from './list-offering/offering.component';
import {FinishedComponent} from './list-finished/finished.component';
import {FuseNavigationModule} from '@fuse/components/navigation';
import {FinishedResolvers, OfferingResolvers} from './offer.resolvers';
import {CreateTransferDialogComponent} from './create-transfer-dialog/create-transfer-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import {FuseCardModule} from '../../../../../@fuse/components/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {FuseAlertModule} from '../../../../../@fuse/components/alert';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {DetailInvestmentTransferOfferComponent} from "./detail-investment-trasfet/detail-investment-transfer-offer.component";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {TranslocoModule} from "@ngneat/transloco";

const offerRoutes: Route[] = [
    {
        path     : '',
        children: [
            {
                path: '',
                component: OfferingComponent,
                resolve: {
                    error: OfferingResolvers,
                },
            },
            {
                data: { title: 'Đã kết thúc' },
                path: 'finished',
                component: FinishedComponent,
                resolve: {
                    error: FinishedResolvers,
                },
            },
        ],
    }
];

@NgModule({
    declarations: [
        OfferingComponent,
        FinishedComponent,
        CreateTransferDialogComponent,
        DetailInvestmentTransferOfferComponent
    ],
    imports: [
        RouterModule.forChild(offerRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        RouterModule,
        FuseNavigationModule,
        MatIconModule,
        FuseCardModule,
        MatFormFieldModule,
        MatListModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        FuseCardModule,
        MatDialogModule,
        FuseAlertModule,
        CurrencyMaskModule,
        MatTableModule,
        MatPaginatorModule,
        TranslocoModule,
    ]
})
export class OfferModule
{
}
