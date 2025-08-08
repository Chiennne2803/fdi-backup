import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { BankAccountComponent } from './bank-account.component';
import { BankAccountResolver } from './bank-account.resolver';

const route: Route[] = [
    {
        path: '', component: BankAccountComponent, resolve: {
            category: BankAccountResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class BankAccountRoutingModule { }
