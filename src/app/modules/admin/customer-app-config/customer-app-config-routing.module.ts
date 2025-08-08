import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CustomerAppConfigComponent } from './customer-app-config.component';
import { CustomerAppConfigResolver } from './customer-app-config.resolver';

const route: Route[] = [
    {
        path: '', component: CustomerAppConfigComponent, resolve: {
            processConfig: CustomerAppConfigResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class CustomerAppConfigRoutingModule { }
