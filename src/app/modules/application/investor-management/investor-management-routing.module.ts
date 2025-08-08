import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AddInvestorManagementComponent } from './add-investor-management/add-investor-management.component';
import { DetailInvestorManagementComponent } from './detail-investor-management/detail-investor-management.component';
import { InvestorManagementComponent } from './investor-management.component';

const router: Route[] = [
    {
        path: '', component: InvestorManagementComponent,
    },
    {
        path: 'detail', component: DetailInvestorManagementComponent
    },
    {
        path: 'add', component: AddInvestorManagementComponent
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(router),
    ]
})
export class InvestorManagementRoutingModule { }
