import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { SharedModule } from '../../../shared/shared.module';
import {BorrowerManagementRoutingModule} from './borrower-management-routing.module';
import {BorrowerManagementComponent} from './borrower-management.component';
import {DetailBorrowerManagementComponent} from './detail-borrower-management/detail-borrower-management.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AddBorrowerManagementComponent} from './add-borrower-management/add-borrower-management.component';
import {ConfirmTypeDialogComponent} from './confirm-type-dialog/confirm-type-dialog.component';
import {PersonalBorrowerComponent} from './add-borrower-management/personal-borrower/personal-borrower.component';
import {CorporateBorrowerComponent} from './add-borrower-management/corporate-borrower/corporate-borrower.component';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import {ContactInfoComponent} from './detail-borrower-management/contact-info/contact-info.component';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {
    ValuationHistoryDialogComponent
} from './detail-borrower-management/create-collateral-history/valuation-history-dialog.component';
import {DateTimeformatPipe} from '../../../shared/components/pipe/date-time-format.pipe';
import {
    CreateCreditLimitDialogsComponent
} from './detail-borrower-management/create-credit-limit/create-credit-limit-dialogs.component';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {ContributorInfoComponent} from './detail-borrower-management/contributor-info/contributor-info.component';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {TranslocoModule} from "@ngneat/transloco";
import {MatPaginatorModule} from "@angular/material/paginator";
import {CreateCustomerRankDialogsComponent} from "./detail-borrower-management/create-customer-rank/create-customer-rank-dialogs.component";
import {ArchiveModule} from "../ho-profiles-management/archive/archive.module";

@NgModule({
    declarations: [
        BorrowerManagementComponent,
        DetailBorrowerManagementComponent,
        AddBorrowerManagementComponent,
        ConfirmTypeDialogComponent,
        PersonalBorrowerComponent,
        CorporateBorrowerComponent,
        ContactInfoComponent,
        ValuationHistoryDialogComponent,
        CreateCreditLimitDialogsComponent,
        CreateCustomerRankDialogsComponent,
        ContributorInfoComponent
    ],
    imports: [
        SharedModule,
        BorrowerManagementRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatListModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTabsModule,
        FuseConfirmationModule,
        FuseAlertModule,
        MatChipsModule,
        MatSidenavModule,
        MatTableModule,
        MatDialogModule,
        FuseCardModule,
        CurrencyMaskModule,
        MatCheckboxModule,
        NgxTrimDirectiveModule,
        TranslocoModule,
        MatPaginatorModule,
        ArchiveModule
    ],
    providers: [DateTimeformatPipe]
})
export class BorrowerManagementModule { }
