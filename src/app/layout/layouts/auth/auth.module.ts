import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { SharedModule } from 'app/shared/shared.module';
import { AuthLayoutComponent } from 'app/layout/layouts/auth/auth.component';
import { FuseAlertModule } from "@fuse/components/alert";
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
    declarations: [
        AuthLayoutComponent
    ],
    imports: [
    RouterModule,
    FuseLoadingBarModule,
    SharedModule,
    FuseAlertModule,
    TranslocoModule
],
    exports     : [
        AuthLayoutComponent
    ]
})
export class AuthLayoutModule
{
}
