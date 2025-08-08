import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {BorrowerManagementComponent} from './borrower-management.component';
import {AddBorrowerManagementComponent} from './add-borrower-management/add-borrower-management.component';

const router: Route[] = [
    {
        path: '', component: BorrowerManagementComponent,
    },
    {
        path: 'add', component: AddBorrowerManagementComponent,
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(router),
    ]
})
export class BorrowerManagementRoutingModule { }
