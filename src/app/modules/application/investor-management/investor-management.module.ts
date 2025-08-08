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
import { AddInvestorManagementComponent } from './add-investor-management/add-investor-management.component';
import { CorporateInvestorComponent } from './add-investor-management/corporate-investor/corporate-investor.component';
import { PersonalInvestorComponent } from './add-investor-management/personal-investor/personal-investor.component';
import { ConfirmTypeDialogComponent } from './confirm-type-dialog/confirm-type-dialog.component';
import { DetailInvestorManagementComponent } from './detail-investor-management/detail-investor-management.component';
import { AccountStatementTableComponent } from './detail-investor-management/account-statement-table/account-statement-table.component';
import { InvestorManagementRoutingModule } from './investor-management-routing.module';
import { InvestorManagementComponent } from './investor-management.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FuseCardModule} from '../../../../@fuse/components/card';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";
import {ManageStaffDialogsComponent} from "./manager-staff-dialog/manager-staff-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";

@NgModule({
    declarations: [
        InvestorManagementComponent,
        DetailInvestorManagementComponent,
        AccountStatementTableComponent,
        ConfirmTypeDialogComponent,
        AddInvestorManagementComponent,
        PersonalInvestorComponent,
        CorporateInvestorComponent,
        ManageStaffDialogsComponent,
    ],
    imports: [
        SharedModule,
        InvestorManagementRoutingModule,
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
        MatTooltipModule,
        FuseCardModule,
        NgxTrimDirectiveModule,
        MatTableModule,
        TranslocoModule,
        MatDialogModule,
        MatPaginatorModule,
        MatCheckboxModule
    ],
})
export class InvestorManagementModule { }
