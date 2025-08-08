import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { EmailConfigComponent } from './email-config.component';
import { EmailConfigResolver } from './email-config.resolver';

const route: Route[] = [
    {
        path: '', component: EmailConfigComponent, resolve: {
            emailConfig: EmailConfigResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class EmailConfigRoutingModule { }
