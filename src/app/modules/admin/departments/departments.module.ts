import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedModule} from 'app/shared/shared.module';
import {DepartmentsRoutingModule} from './departments-routing.module';
import {DepartmentsComponent} from './departments.component';
import {TranslocoModule} from "@ngneat/transloco";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {DepartmentDialogComponent} from "./department-dialog/department-dialog.component";
import {MatIconModule} from "@angular/material/icon";
import {SharedUIModule} from "../../../shared/components/shared-ui.module";

@NgModule({
    declarations: [
        DepartmentsComponent,
        DepartmentDialogComponent
    ],
    imports: [
        SharedModule,
        SharedUIModule,
        DepartmentsRoutingModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        TranslocoModule,
        MatAutocompleteModule,
        MatIconModule,
    ]
})
export class DepartmentsModule {
}
