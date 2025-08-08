import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {DocumentConfigComponent} from './document-config.component';
import { DocumentConfigResolver } from './document-config.resolver';

const route: Route[] = [
    {
        path: '', component: DocumentConfigComponent, resolve: {
            category: DocumentConfigResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class DocumentConfigRoutingModule { }
