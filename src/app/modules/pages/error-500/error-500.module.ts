import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import {TranslocoModule} from "@ngneat/transloco";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import { Error500Component } from './error-500.component';


const Error500Routes: Route[] = [
    {
        path: '',
        component: Error500Component
    }
];
@NgModule({
    declarations: [
        Error500Component,
    ],
    imports: [
        RouterModule.forChild(Error500Routes),
        MatIconModule,
        SharedModule,
        TranslocoModule,
        NgxTrimDirectiveModule,
    ]
})
export class Error500Module {
}
