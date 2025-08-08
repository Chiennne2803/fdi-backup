import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { WithdrawFromHOComponent } from './withdraw-from-ho.component';
import { WithdrawFromHOResolver } from './withdraw-from-ho.resolver';

const route: Route[] = [
    {
        path: '', component: WithdrawFromHOComponent, resolve: {
            withdrawFromHO: WithdrawFromHOResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class WithdrawFromHORoutingModule { }
