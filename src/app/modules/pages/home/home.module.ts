import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import {TranslocoModule} from "@ngneat/transloco";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import { HomeComponent } from './home.component';
import { pageHomeRoutes } from './home.routing';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
    declarations: [
        HomeComponent,
    ],
    imports: [
        RouterModule.forChild(pageHomeRoutes),
        MatIconModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule,
        TranslocoModule,
        NgxTrimDirectiveModule,
    ]
})
export class PageHomeModule {
}
