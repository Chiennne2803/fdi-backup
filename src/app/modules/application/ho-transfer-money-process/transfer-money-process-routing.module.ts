import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { TransferMoneyProcessComponent } from './transfer-money-process.component';
import { TransferMoneyProcessResolver } from './transfer-money-process.resolver';

const route: Route[] = [
    {
        path: '', component: TransferMoneyProcessComponent, resolve: {
            transferMonenyProcess: TransferMoneyProcessResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class TransferMoneyProcessRoutingModule { }
