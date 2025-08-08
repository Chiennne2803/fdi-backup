import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { WithdrawFromHOProcessComponent } from './withdraw-from-ho-process.component';
import { WithdrawFromHoProcessResolver } from './withdraw-from-ho-process.resolver';

const route: Route[] = [
    {
        path: '', component: WithdrawFromHOProcessComponent, resolve: {
            commissionProcess: WithdrawFromHoProcessResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})

export class WithdrawFromHoProcessRoutingModule { }
