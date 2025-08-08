import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { NotificationsDetailComponent } from './notifications-detail/notifications-detail.component';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import {TranslocoModule} from "@ngneat/transloco";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";



@NgModule({
    declarations: [
        NotificationsComponent,
        NotificationsDetailComponent
    ],
    imports: [
        SharedModule,
        NotificationsRoutingModule,
        MatSidenavModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        TranslocoModule,
        MatTableModule,
        MatPaginatorModule,
    ]
})
export class NotificationsModule { }
