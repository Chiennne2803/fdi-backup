import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { CommissionProcessDetailComponent } from './commission-process-detail/commission-process-detail.component';
import { CommissionProcessRoutingModule } from './commission-process-routing.module';
import { CommissionProcessComponent } from './commission-process.component';
import {TranslocoModule} from "@ngneat/transloco";



@NgModule({
    declarations: [
        CommissionProcessComponent,
        CommissionProcessDetailComponent
    ],
    imports: [
        SharedModule,
        CommissionProcessRoutingModule,
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        TranslocoModule
    ]
})
export class CommissionProcessModule { }
