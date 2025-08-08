import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { LenderRefundRoutingModule } from './lender-refund-routing.module';
import { LenderRefundComponent } from './lender-refund.component';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {WaitPayTransComponent} from './wait-pay-trans/wait-pay-trans.component';
import {WaitApproveTransComponent} from './wait-approve-trans/wait-approve-trans.component';
import {WaitProcessTransComponent} from './wait-process-trans/wait-process-trans.component';
import {ProcessedTransComponent} from './processed-trans/processed-trans.component';
import {ErrorTransComponent} from './error-trans/error-trans.component';
import {TimeoutTransComponent} from './timeout-trans/timeout-trans.component';
import { DetailRightSideComponent } from './detail-right-side/detail-right-side.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FuseCardModule} from '../../../../@fuse/components/card';
import { AddDialogComponent } from './dialog/add-dialog/add-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {ProcessDialogComponent} from "./dialog/process-dialog/process-dialog.component";
import {FuseAlertModule} from "../../../../@fuse/components/alert";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";
import {MatAutocompleteModule} from "@angular/material/autocomplete";

@NgModule({
    declarations: [
        LenderRefundComponent,
        WaitPayTransComponent,
        WaitProcessTransComponent,
        WaitApproveTransComponent,
        ProcessedTransComponent,
        ErrorTransComponent,
        TimeoutTransComponent,
        DetailRightSideComponent,
        AddDialogComponent,
        ProcessDialogComponent
    ],
    imports: [
        SharedModule,
        LenderRefundRoutingModule,
        FuseNavigationModule,
        MatFormFieldModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        FuseCardModule,
        MatDialogModule,
        FuseAlertModule,
        CurrencyMaskModule,
        TranslocoModule,
        MatAutocompleteModule
    ]
})
export class LenderRefundModule { }
