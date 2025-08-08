import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { StaffComponent } from './staff.component';
import { StaffResolvers } from './staff.resolvers';

const route: Route[] = [
    {
        path: '',
        component: StaffComponent,
        resolve: {
            staff: StaffResolvers,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class StaffRoutingModule { }
