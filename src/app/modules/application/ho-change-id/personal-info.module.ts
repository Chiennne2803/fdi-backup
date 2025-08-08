import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { PersonalInfoRoutingModule } from './personal-info-routing.module';
import { PersonalInfoComponent } from './personal-info.component';
import { AccountInfoRequestComponent } from './account-info-request/account-info-request.component';
import {TranslocoModule} from "@ngneat/transloco";



@NgModule({
    declarations: [
        PersonalInfoComponent,
        AccountInfoRequestComponent
    ],
    imports: [
        SharedModule,
        PersonalInfoRoutingModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        TranslocoModule
    ]
})
export class PersonalInfoModule { }
