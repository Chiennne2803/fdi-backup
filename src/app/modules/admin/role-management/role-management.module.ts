import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { FuseCardModule } from '@fuse/components/card';
import { TranslocoModule } from '@ngneat/transloco';
import { DateTimeformatPipe } from 'app/shared/components/pipe/date-time-format.pipe';
import { SharedModule } from 'app/shared/shared.module';
import { ModuleAdvancedDecentralizationComponent } from './components/module-advanced/module-advanced-decentralization.component';
import { DetailDecentralizationComponent } from './components/detail-decentralization/detail-decentralization.component';
import { ModulesDecentralizationComponent } from './components/modules-roles/modules-decentralization.component';
import { RoleManagementRoutingModule } from './role-management-routing.module';
import { RoleManagementComponent } from './role-management.component';
import {MatExpansionModule} from "@angular/material/expansion";
import {ModuleReportComponent} from "./components/module-report/module-report.component";



@NgModule({
    declarations: [
        RoleManagementComponent,
        ModuleAdvancedDecentralizationComponent,
        ModuleReportComponent,
        ModulesDecentralizationComponent,
        DetailDecentralizationComponent
    ],
    imports: [
        SharedModule,
        FuseCardModule,
        RoleManagementRoutingModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatTabsModule,
        MatTableModule,
        MatPaginatorModule,
        TranslocoModule,
        MatIconModule,
        MatExpansionModule,
    ],
    providers: [
        DateTimeformatPipe
    ]
})
export class RoleManagementModule { }
