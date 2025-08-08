import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { SharedModule } from 'app/shared/shared.module';
import { DetailComponent } from './components/detail/detail.component';
import { ErrorListComponent } from './components/error-list/error-list.component';
import { ResolveErrorCashDialogComponent } from './components/resolve-error-cash-dialog/resolve-error-cash-dialog.component';
import { SuccessListComponent } from './components/success-list/success-list.component';
import { WaitingListComponent } from './components/waiting-list/waiting-list.component';
import { FundingProcessRoutingModule } from './funding-process-routing.module';
import { FundingProcessComponent } from './funding-process.component';
import {CurrencyMaskModule} from "ng2-currency-mask";
import {TranslocoModule} from "@ngneat/transloco";
import {MatSelectModule} from "@angular/material/select";



@NgModule({
    declarations: [
        FundingProcessComponent,
        SuccessListComponent,
        ErrorListComponent,
        WaitingListComponent,
        DetailComponent,
        ResolveErrorCashDialogComponent
    ],
    imports: [
        SharedModule,
        FundingProcessRoutingModule,
        FuseNavigationModule,
        MatTabsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatSelectModule,
        MatListModule,
        MatInputModule,
        MatDialogModule,
        CurrencyMaskModule,
        TranslocoModule
    ]
})
export class FundingProcessModule { }
