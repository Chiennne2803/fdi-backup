import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { FuseModule } from '@fuse';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { FuseConfigModule } from '@fuse/services/config';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { appConfig } from 'app/core/config/app.config';
import { CoreModule } from 'app/core/core.module';
import { LayoutModule } from 'app/layout/layout.module';
import { mockApiServices } from 'app/mock-api';
import { MarkdownModule } from 'ngx-markdown';

import { environment } from 'environments/environment';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireMessagingModule} from "@angular/fire/compat/messaging";
import { IconsModule } from './core/icons/icons.module';
// import { initializeApp } from 'firebase/app';
// initializeApp(environment.firebaseConfig);


const routerConfig: ExtraOptions = {
    preloadingStrategy: PreloadAllModules,
    scrollPositionRestoration: 'enabled'
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        // IconsModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,

        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
        MatDatepickerModule,

        //firebase
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireMessagingModule,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' }
    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
