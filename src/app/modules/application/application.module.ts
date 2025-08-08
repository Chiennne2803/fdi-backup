import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import {TranslocoModule} from "@ngneat/transloco";



@NgModule({
    declarations: [
        ApplicationComponent
    ],
    imports: [
        SharedModule,
        ApplicationRoutingModule,
        TranslocoModule
    ]
})
export class ApplicationModule { }
