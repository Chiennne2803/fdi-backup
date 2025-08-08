import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from './../../../shared/shared.module';
import { EmailConfigRoutingModule } from './email-config-routing.module';
import { EmailConfigComponent } from './email-config.component';
import {TranslocoModule} from "@ngneat/transloco";



@NgModule({
    declarations: [
        EmailConfigComponent
    ],
    imports: [
        SharedModule,
        EmailConfigRoutingModule,
        MatFormFieldModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        TranslocoModule
    ]
})
export class EmailConfigModule { }
