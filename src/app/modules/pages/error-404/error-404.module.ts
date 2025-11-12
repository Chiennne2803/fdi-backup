import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import {TranslocoModule} from "@ngneat/transloco";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import { Error404Component } from './error-404.component';


const Error404Routes: Route[] = [
    {
        path: '',
        component: Error404Component
    }
];
@NgModule({
    declarations: [
        Error404Component,
    ],
    imports: [
        RouterModule.forChild(Error404Routes),
        MatIconModule,
        SharedModule,
        TranslocoModule,
        NgxTrimDirectiveModule,
    ]
})
export class Error404Module {
}
