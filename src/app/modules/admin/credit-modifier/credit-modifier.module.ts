import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { SharedModule } from 'app/shared/shared.module';
import { ConfRefundComponent } from './components/conf-refund/conf-refund.component';
import { AddEditConfCreditComponent } from './components/conf-credit/add-edit-conf-credit/add-edit-conf-credit.component';
import { ConfCreditComponent } from './components/conf-credit/conf-credit.component';
import { AddEditConfigRateComponent } from './components/config-rate/add-edit-config-rate/add-edit-config-rate.component';
import { ConfigRateComponent } from './components/config-rate/config-rate.component';
import { UpdateLoanTenureComponent } from './components/config-rate/update-loan-tenure/update-loan-tenure.component';
import { CreditModifierRoutingModule } from './credit-modifier-routing.module';
import { CreditModifierComponent } from './credit-modifier.component';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {ConfigBonusComponent} from './components/config-bonus/config-bonus.component';
import {
    AddEditConfigBonusComponent,
} from './components/config-bonus/add-edit-config-bonus/add-edit-config-bonus.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {TranslocoModule} from "@ngneat/transloco";

@NgModule({
    declarations: [
        CreditModifierComponent,
        ConfCreditComponent,
        ConfigRateComponent,
        ConfRefundComponent,
        UpdateLoanTenureComponent,
        AddEditConfCreditComponent,
        AddEditConfigRateComponent,
        ConfigBonusComponent,
        AddEditConfigBonusComponent
    ],
    imports: [
        SharedModule,
        CreditModifierRoutingModule,
        MatTabsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        MatDialogModule,
        FuseCardModule,
        MatDatepickerModule,
        CurrencyMaskModule,
        TranslocoModule
    ],
    providers: [DateTimeformatPipe]
})
export class CreditModifierModule { }
