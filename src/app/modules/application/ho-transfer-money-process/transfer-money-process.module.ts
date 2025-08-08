import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { TransferDetailComponent } from './transfer-detail/transfer-detail.component';
import { TransferMoneyProcessRoutingModule } from './transfer-money-process-routing.module';
import { TransferMoneyProcessComponent } from './transfer-money-process.component';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";



@NgModule({
    declarations: [
        TransferMoneyProcessComponent,
        TransferDetailComponent
    ],
    imports: [
        SharedModule,
        TransferMoneyProcessRoutingModule,
        MatFormFieldModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        TranslocoModule,
    ]
})
export class TransferMoneyProcessModule { }
