import { NgModule } from '@angular/core';
import {TranslocoModule} from "@ngneat/transloco";
import {SharedUIModule} from "../../../shared/components/shared-ui.module";
import {CommonModule} from "@angular/common";
import {Route, RouterModule} from "@angular/router";
import {KycSuccessComponent} from "./kyc-success.component";

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
        SharedUIModule,
        CommonModule,
        TranslocoModule,
    ]
})
export class KycSuccessModule { }
