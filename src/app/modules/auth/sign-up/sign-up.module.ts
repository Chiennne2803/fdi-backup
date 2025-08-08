import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { AuthSignUpComponent } from 'app/modules/auth/sign-up/sign-up.component';
import { authSignupRoutes } from 'app/modules/auth/sign-up/sign-up.routing';
import { SharedModule } from 'app/shared/shared.module';
import {NgxTrimDirectiveModule} from 'ngx-trim-directive';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";
@NgModule({
    declarations: [
        AuthSignUpComponent
    ],
    imports: [
        RouterModule.forChild(authSignupRoutes),
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        NgxTrimDirectiveModule,
        SharedModule,
        TranslocoModule,
    ]
})
export class AuthSignUpModule {
}
