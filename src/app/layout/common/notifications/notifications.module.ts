import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { SharedModule } from 'app/shared/shared.module';
import { FuseAlertModule } from "@fuse/components/alert";

@NgModule({
    declarations: [
        NotificationsComponent
    ],
    imports: [
    RouterModule,
    OverlayModule,
    PortalModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    SharedModule,
    FuseAlertModule
],
    exports     : [
        NotificationsComponent
    ]
})
export class NotificationsModule
{
}
