import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
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
import {InvestorComponent} from './investor.component';
import {InvestorRoutingModule} from './investor-routing.module';
import {TopupDialog} from './investment-topup/dialogs/investor-dialogs.component';
import {FuseAlertModule} from '../../../@fuse/components/alert';
import {FuseCardModule} from '../../../@fuse/components/card';
import {TranslocoModule} from "@ngneat/transloco";

@NgModule({
    declarations: [
        InvestorComponent,
        TopupDialog,
    ],
    imports: [
        InvestorRoutingModule,
        CommonModule,
        MatDialogModule,
        MatDividerModule,
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
        FuseAlertModule,
        FuseCardModule,
        TranslocoModule,
    ]
})
export class InvestorModule { }
