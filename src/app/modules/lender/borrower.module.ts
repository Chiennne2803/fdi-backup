import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BorrowerComponent} from './borrower.component';
import {BorrowerRoutingModule} from './borrower-routing.module';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {
    LoanDetailComponent as LoanDetailCallingComponent
} from './loan-calling/loan-detail/loan-detail.component';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {SharedModule} from '../../shared/shared.module';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTableModule} from '@angular/material/table';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {
    FSCardDownCreateDialog,
    FSCardDownDetailDialog,
    FSTransPayCreateDialog,
    FSTransPayDetailDialog,
} from './loan-calling/loan-detail/dialogs/loan-dialogs.component';
import {LoanDetailComponent as LoanDetailReviewComponent} from './loan-review/loan-detail/loan-detail.component';
import {LoanDetailComponent as LoanDetailArchiveComponent} from './loan-archive/loan-detail/loan-detail.component';
import {FuseCardModule} from "../../../@fuse/components/card";
import {MatCheckboxModule} from '@angular/material/checkbox';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {MatPaginatorModule} from '@angular/material/paginator';
import {TranslocoModule} from "@ngneat/transloco";
import {TranspayReqComponent} from "./transpay-req/transpay-req.component";

@NgModule({
  declarations: [
      BorrowerComponent,
      LoanDetailCallingComponent,
      LoanDetailReviewComponent,
      LoanDetailArchiveComponent,
      FSCardDownDetailDialog,
      FSTransPayDetailDialog,
      FSCardDownCreateDialog,
      FSTransPayCreateDialog,
      TranspayReqComponent
  ],
  imports: [
    BorrowerRoutingModule,
    MatMomentDateModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    CommonModule,
    SharedModule,
    MatTabsModule,
    MatDividerModule,
    MatSidenavModule,
    MatTableModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    FuseCardModule,
    MatCheckboxModule,
    CurrencyMaskModule,
    MatPaginatorModule,
      TranslocoModule,
  ],
})
export class BorrowerModule { }
