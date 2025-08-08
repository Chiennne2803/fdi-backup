import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedUIModule } from 'app/shared/components/shared-ui.module';
import { SharedModule } from 'app/shared/shared.module';
import { SettingNotificationDetailComponent } from './components/setting-notification-detail/setting-notification-detail.component';
import { SettingNotificationRoutingModule } from './setting-notification-routing.module';
import { SettingNotificationComponent } from './setting-notification.component';
import {TranslocoModule} from "@ngneat/transloco";

@NgModule({
    declarations: [
        SettingNotificationComponent,
        SettingNotificationDetailComponent,
    ],
    imports: [
        SharedModule,
        SharedUIModule,
        SettingNotificationRoutingModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatIconModule,
        MatCheckboxModule,
        MatChipsModule,
        MatAutocompleteModule,
        SharedUIModule,
        TranslocoModule
    ]
})
export class SettingNotificationModule { }
