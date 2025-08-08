import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NotificationsComponent } from './notifications.component';
import { NotificationsResolver } from './notifications.resolver';
import {DetailDebitManagementComponent} from "../../application/ho-debit-management/detail-debit-management/detail-debit-management.component";
import {NotificationsDetailComponent} from "./notifications-detail/notifications-detail.component";

const route: Route[] = [
    {
        path: '',
        component: NotificationsComponent,
        resolve: {
            category: NotificationsResolver,
        }
    },
    {
        path: ':id',
        component: NotificationsDetailComponent,
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class NotificationsRoutingModule { }
