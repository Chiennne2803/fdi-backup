import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {InvestorKYCComponent} from './kyc.component';
import {CommonModule} from '@angular/common';
import {InvestorKycResolver} from './kyc.resolvers';
import {SharedUIModule} from '../../../shared/components/shared-ui.module';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";

const route: Route[] = [
    {
        path: '',
        component: InvestorKYCComponent,
        resolve: {
            preparePageLoad: InvestorKycResolver
        }
    }
];

@NgModule({
    declarations: [InvestorKYCComponent],
    imports: [
        RouterModule.forChild(route),
        SharedUIModule,
        CommonModule,
        TranslocoModule,
    ]
})
export class InvestorKYCModule { }
