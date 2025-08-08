import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {SharedModule} from 'app/shared/shared.module';
import {DocumentConfigDetailComponent} from './document-config-detail/document-config-detail.component';
import {DocumentConfigRoutingModule} from './document-config-routing.module';
import {DocumentConfigComponent} from './document-config.component';
import {FuseCardModule} from "../../../../@fuse/components/card";
import {TranslocoModule} from "@ngneat/transloco";

@NgModule({
    declarations: [
        DocumentConfigComponent,
        DocumentConfigDetailComponent
    ],
    imports: [
        SharedModule,
        DocumentConfigRoutingModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        FuseCardModule,
        TranslocoModule
    ]
})
export class DocumentConfigModule {
}
