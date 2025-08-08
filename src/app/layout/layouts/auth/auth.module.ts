import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar';
import { SharedModule } from 'app/shared/shared.module';
import { AuthLayoutComponent } from 'app/layout/layouts/auth/auth.component';

@NgModule({
    declarations: [
        AuthLayoutComponent
    ],
    imports     : [
        RouterModule,
        FuseLoadingBarModule,
        SharedModule
    ],
    exports     : [
        AuthLayoutComponent
    ]
})
export class AuthLayoutModule
{
}
