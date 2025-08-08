import {NgModule} from '@angular/core';
import {WaitProcessTransComponent} from './wait-process-trans/wait-process-trans.component';
import {ProcessedTransComponent} from './processed-trans/processed-trans.component';
import {DraftTransComponent} from './draft-trans/draft-trans.component';
import {SharedModule} from '../../../shared/shared.module';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {InvestorRefundRoutingModule} from './investor-refund-routing.module';
import {InvestorRefundComponent} from './investor-refund.component';
import {DetailInvestorRefundComponent} from './detail-refund/detail-refund.component';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {MatTableModule} from '@angular/material/table';
import {DocumentSignDialogComponent} from './dialog/sign/document-sign.component';
import {MatDialogModule} from '@angular/material/dialog';
import {AddRefundInvestorComponent} from './dialog/add/add-refund.component';
import {TranslocoModule} from "@ngneat/transloco";
import {MatPaginatorModule} from "@angular/material/paginator";
import {CurrencyMaskModule} from "ng2-currency-mask";

@NgModule({
    declarations: [
        WaitProcessTransComponent,
        ProcessedTransComponent,
        DraftTransComponent,
        InvestorRefundComponent,
        DetailInvestorRefundComponent,
        DocumentSignDialogComponent,
        AddRefundInvestorComponent
    ],
    imports: [
        SharedModule,
        InvestorRefundRoutingModule,
        FuseNavigationModule,
        MatFormFieldModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        FuseCardModule,
        MatTableModule,
        MatDialogModule,
        TranslocoModule,
        MatPaginatorModule,
        CurrencyMaskModule,
    ]
})
export class InvestorRefundModule { }
