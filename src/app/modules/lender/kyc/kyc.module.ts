import {NgModule} from '@angular/core';
import {BorrowerKycComponent} from './kyc.component';
import {Route, RouterModule} from '@angular/router';
import {InvestorKycResolver} from '../../investor/kyc/kyc.resolvers';
import {SharedModule} from '../../../shared/shared.module';
import {MatTableModule} from "@angular/material/table";
import {TranslocoModule} from "@ngneat/transloco";

const route: Route[] = [
    {
        path: '',
        component: BorrowerKycComponent,
        resolve: {
            preparePageLoad: InvestorKycResolver
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(route),
        SharedModule,
        TranslocoModule,
    ],
    declarations: [
        BorrowerKycComponent,
    ]
})
export class BorrowerKycModule { }
