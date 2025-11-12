import { NgModule } from '@angular/core';
import {TranslocoModule} from "@ngneat/transloco";
import {CommonModule} from "@angular/common";
import {Route, RouterModule} from "@angular/router";
import {KycSuccessComponent} from "./kyc-success.component";
import { MatButtonModule } from '@angular/material/button';

const route: Route[] = [
    {
        path: '',
        component: KycSuccessComponent,
    }
];

@NgModule({
    declarations: [KycSuccessComponent],
    imports: [
        RouterModule.forChild(route),
        MatButtonModule,
        CommonModule,
        TranslocoModule,
    ]
})
export class KycSuccessModule { }
