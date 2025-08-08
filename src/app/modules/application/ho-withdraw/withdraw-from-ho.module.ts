import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { SharedModule } from 'app/shared/shared.module';
import { WithdrawFromHOComponent } from './withdraw-from-ho.component';
import { RequestWithdrawComponent } from './components/request-withdraw/request-withdraw.component';
import { WithdrawDetailComponent } from './components/withdraw-detail/withdraw-detail.component';
import { WithdrawFromHORoutingModule } from './withdraw-from-ho-routing.module';
import {CurrencyMaskModule} from "ng2-currency-mask";
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";
import {FuseCardModule} from "../../../../@fuse/components/card";



@NgModule({
    declarations: [
        WithdrawFromHOComponent,
        RequestWithdrawComponent,
        WithdrawDetailComponent
    ],
    imports: [
        SharedModule,
        WithdrawFromHORoutingModule,

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
        FuseCardModule,
    ],
    providers: [
        DateTimeformatPipe
    ]
})
export class WithdrawFromHOModule { }
