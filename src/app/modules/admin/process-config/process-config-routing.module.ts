import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ProcessConfigComponent } from './process-config.component';
import { ProcessConfigResolver } from './process-config.resolver';

const route: Route[] = [
    {
        path: '', component: ProcessConfigComponent, resolve: {
            processConfig: ProcessConfigResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class ProcessConfigRoutingModule { }
