import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SettingNotificationComponent } from './setting-notification.component';
import { SettingNotificationResolver } from './setting-notification.resolver';

const route: Route[] = [
    {
        path: '', component: SettingNotificationComponent, resolve: {
            transferMonenyProcess: SettingNotificationResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class SettingNotificationRoutingModule { }
