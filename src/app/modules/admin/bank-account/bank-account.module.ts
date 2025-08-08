import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { AccountBankDetailComponent } from './account-bank-detail/account-bank-detail.component';
import { BankAccountRoutingModule } from './bank-account-routing.module';
import { BankAccountComponent } from './bank-account.component';
import {TranslocoModule} from "@ngneat/transloco";



@NgModule({
    declarations: [
        BankAccountComponent,
        AccountBankDetailComponent
    ],
    imports: [
        SharedModule,
        BankAccountRoutingModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        TranslocoModule
    ]
})
export class BankAccountModule { }
