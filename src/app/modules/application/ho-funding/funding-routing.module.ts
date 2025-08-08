import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FundingComponent } from './funding.component';
import { FundingResolver } from './funding.resolver';

const route: Route[] = [
    {
        path: '', component: FundingComponent, resolve: {
            funding: FundingResolver,
        },
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class FundingRoutingModule { }
