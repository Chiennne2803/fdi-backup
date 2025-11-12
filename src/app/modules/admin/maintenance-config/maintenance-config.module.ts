import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { TranslocoModule } from "@ngneat/transloco";
import { NgxTrimDirectiveModule } from "ngx-trim-directive";
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAlertModule } from '@fuse/components/alert';
import { MaintenanceConfigComponent } from './maintenance-config.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


const MaintenanceRoutes: Route[] = [
    {
        path: '',
        component: MaintenanceConfigComponent
    }
];
@NgModule({
    declarations: [
        MaintenanceConfigComponent,
    ],
    imports: [
        RouterModule.forChild(MaintenanceRoutes),
        MatButtonModule,
        MatSlideToggleModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseAlertModule,
        SharedModule,
        TranslocoModule,
        NgxTrimDirectiveModule,

    ]
})
export class MaintenanceModule {
}
