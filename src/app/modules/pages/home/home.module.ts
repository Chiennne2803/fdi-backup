import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { SwiperSlideComponent } from './swiper-slide/swiper-slide.component';

@NgModule({
    declarations: [
        HomeComponent,
        SwiperSlideComponent
    ],
    imports: [
        RouterModule.forChild(pageHomeRoutes),
        MatIconModule,
        MatTabsModule,
        // BrowserModule,
        // BrowserAnimationsModule,
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
