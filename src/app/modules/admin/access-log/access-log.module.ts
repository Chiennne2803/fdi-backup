import {NgModule} from '@angular/core';
import {InvestorComponent} from './investor/investor.component';
import {LenderComponent} from './lender/lender.component';
import {StaffComponent} from './staff/staff.component';
import {SharedModule} from '../../../shared/shared.module';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {AccessLogRoutingModule} from './access-log-routing.module';
import {AccessLogComponent} from './access-log.component';
import {DetailActionAuditComponent} from './access-log-detail/access-log-detail.component';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {TranslocoModule} from "@ngneat/transloco";
import {MatPaginatorModule} from "@angular/material/paginator";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ActionDetailDialogComponent} from "./access-log-detail/dialog/action-detail-dialog.component";

@NgModule({
    declarations: [
        InvestorComponent,
        LenderComponent,
        StaffComponent,
        AccessLogComponent,
        DetailActionAuditComponent,
        ActionDetailDialogComponent
    ],
    imports: [
        SharedModule,
        AccessLogRoutingModule,
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
        MatTooltipModule,
    ]
})
export class AccessLogModule { }
