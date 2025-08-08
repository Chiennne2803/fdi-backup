import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {DepartmentsComponent} from './departments.component';
import {DepartmentsResolver} from './departments.resolver';
import {MatAutocompleteModule} from "@angular/material/autocomplete";

const route: Route[] = [
    {
        path: '', component: DepartmentsComponent, resolve: {
            category: DepartmentsResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route),
        MatAutocompleteModule,
    ]
})
export class DepartmentsRoutingModule {
}
