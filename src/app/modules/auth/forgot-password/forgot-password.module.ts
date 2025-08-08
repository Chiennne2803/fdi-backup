import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import {AuthForgotPasswordComponent, SentUrlDialog} from 'app/modules/auth/forgot-password/forgot-password.component';
import { authForgotPasswordRoutes } from 'app/modules/auth/forgot-password/forgot-password.routing';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {TranslocoModule} from "@ngneat/transloco";
import {MatTableModule} from "@angular/material/table";

@NgModule({
    declarations: [
        AuthForgotPasswordComponent,
        SentUrlDialog,
    ],
    imports: [
        RouterModule.forChild(authForgotPasswordRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule,
        MatDialogModule,
        NgxTrimDirectiveModule,
        TranslocoModule,
        TranslocoModule,
    ]
})
export class AuthForgotPasswordModule
{
}
