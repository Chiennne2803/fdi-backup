import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { RoleManagementComponent } from './role-management.component';
import { RoleManagementResolver } from './role-management.resolver';

const route: Route[] = [
    {
        path: '',
        component: RoleManagementComponent,
        resolve: {
            role: RoleManagementResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class RoleManagementRoutingModule { }
