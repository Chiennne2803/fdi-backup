import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { FundingDetailComponent } from './components/funding-detail/funding-detail.component';
import { RequestFundingDialogComponent } from './components/request-funding-dialog/request-funding-dialog.component';
import { FundingRoutingModule } from './funding-routing.module';
import { FundingComponent } from './funding.component';
import {CurrencyMaskModule} from "ng2-currency-mask";
import {TranslocoModule} from "@ngneat/transloco";
import {MatAutocompleteModule} from "@angular/material/autocomplete";



@NgModule({
    declarations: [
        FundingComponent,
        RequestFundingDialogComponent,
        FundingDetailComponent
    ],
    imports: [
        SharedModule,
        FundingRoutingModule,
        MatFormFieldModule,
        MatInputModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatSelectModule,
        MatDialogModule,
        MatSidenavModule,
        CurrencyMaskModule,
        TranslocoModule,
        MatAutocompleteModule,
    ]
})
export class FundingModule { }
