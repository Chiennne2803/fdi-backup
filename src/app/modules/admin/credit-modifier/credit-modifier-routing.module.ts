import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CreditModifierComponent } from './credit-modifier.component';
import { CreditModifierResolver } from './credit-modifier.resolver';

const route: Route[] = [
    {
        path: '', component: CreditModifierComponent, resolve: {
            creaditModifier: CreditModifierResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class CreditModifierRoutingModule { }
