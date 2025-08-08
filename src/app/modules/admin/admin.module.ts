import { NgModule } from '@angular/core';
import { SharedModule } from './../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import {TranslocoModule} from "@ngneat/transloco";


@NgModule({
    declarations: [
        AdminComponent
    ],
    imports: [
        AdminRoutingModule,
        SharedModule,
        TranslocoModule
    ]
})
export class AdminModule { }
