import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { WithdrawFromHOProcessComponent } from './withdraw-from-ho-process.component';
import { WithdrawDetailComponent } from './withdraw-detail/withdraw-detail.component';
import { WithdrawFromHoProcessRoutingModule } from './withdraw-from-ho-process-routing.module';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";
import {MatFormFieldModule} from "@angular/material/form-field";



@NgModule({
    declarations: [
        WithdrawFromHOProcessComponent,
        WithdrawDetailComponent
    ],
    imports: [
        SharedModule,
        WithdrawFromHoProcessRoutingModule,
        MatFormFieldModule,
        MatSidenavModule,
        MatButtonModule,
        TranslocoModule,
    ]
})
export class WithdrawFromHOProcessModule { }
