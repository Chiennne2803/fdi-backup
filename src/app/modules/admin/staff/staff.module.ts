import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { StaffDetailComponent } from './components/staff-detail/staff-detail.component';
import { StaffListComponent } from './components/staff-list/staff-list.component';
import { StaffRoutingModule } from './staff-routing.module';
import { StaffComponent } from './staff.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import {TranslocoModule} from "@ngneat/transloco";
import {SharedUIModule} from "../../../shared/components/shared-ui.module";

@NgModule({
    declarations: [
        StaffComponent,
        StaffListComponent,
        StaffDetailComponent,
        ChangePasswordComponent
    ],
    imports: [
        StaffRoutingModule,
        SharedModule,
        SharedUIModule,
        MatFormFieldModule,
        MatIconModule,
        MatSidenavModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatOptionModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatListModule,
        TranslocoModule,
    ],
    providers: [
    ]
})
export class StaffModule { }
