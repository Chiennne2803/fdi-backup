import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommissionProcessComponent } from './commission-process.component';
import { CommissionProcessResolver } from './commission-process.resolver';

const route: Route[] = [
    {
        path: '', component: CommissionProcessComponent, resolve: {
            commissionProcess: CommissionProcessResolver,
        },
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class CommissionProcessRoutingModule { }
