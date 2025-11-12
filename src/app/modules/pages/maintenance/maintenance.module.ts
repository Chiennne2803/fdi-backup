import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import {TranslocoModule} from "@ngneat/transloco";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import { MaintenanceComponent } from './maintenance.component';


const MaintenanceRoutes: Route[] = [
    {
        path: '',
        component: MaintenanceComponent
    }
];
@NgModule({
    declarations: [
        MaintenanceComponent,
    ],
    imports: [
        RouterModule.forChild(MaintenanceRoutes),
        MatIconModule,
        SharedModule,
        TranslocoModule,
        NgxTrimDirectiveModule,
    ]
})
export class MaintenanceModule {
}
