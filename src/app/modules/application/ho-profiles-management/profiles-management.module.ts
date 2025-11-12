import {NgModule} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSortModule} from '@angular/material/sort';
import {Route, RouterModule} from '@angular/router';
import {SharedModule} from '../../../shared/shared.module';
import {ProfilesManagementComponent} from './profiles-management.component';
import {ProfilesReviewingComponent} from './reviewing/profiles-reviewing.component';
import {FuseNavigationModule} from '../../../../@fuse/components/navigation';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDividerModule} from '@angular/material/divider';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {ProfilesReceptionComponent} from './reception/profiles-reception.component';
import {ProfilesReReviewingComponent} from './re-reviewing/profiles-re-reviewing.component';
import {TranslocoModule} from "@ngneat/transloco";
import {MatPaginatorModule} from "@angular/material/paginator";
import {DialogProcess1Component} from "./archive/detail/process-dialogs/dialog-process-1.component";
import {DialogProcess2Component} from "./archive/detail/process-dialogs/dialog-process-2.component";
import {DialogProcess3Component} from "./archive/detail/process-dialogs/dialog-process-3.component";
import {DialogProcess4Component} from "./archive/detail/process-dialogs/dialog-process-4.component";
import {DialogProcess5Component} from "./archive/detail/process-dialogs/dialog-process-5.component";
import {DialogProcess6Component} from "./archive/detail/process-dialogs/dialog-process-6.component";
import {DialogProcess7Component} from "./archive/detail/process-dialogs/dialog-process-7.component";

const profilesManagementRoutes: Route[] = [
    {
        
        path: '',
        component: ProfilesManagementComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'tpkd',
            },
            {
                data: { title: 'Hồ sơ tiếp nhận' },
                path: ':key',
                component: ProfilesReceptionComponent,
            }, {
                data: { title: 'Hồ sơ rà soát' },
                path: 'review/:key',
                component: ProfilesReviewingComponent,
            }, {
                data: { title: 'Hồ sơ rà soát lại' },
                path: 're-review/:key',
                component: ProfilesReReviewingComponent,
            },
            {
                data: { title: 'Hồ sơ lưu trữ' },
                path: 'archive',
                loadChildren: () => import('./archive/archive.module').then(m => m.ArchiveModule),
            },
        ]
    }
];

@NgModule({
    declarations: [
        DialogProcess1Component,
        DialogProcess2Component,
        DialogProcess3Component,
        DialogProcess4Component,
        DialogProcess5Component,
        DialogProcess6Component,
        DialogProcess7Component,
    ],
    imports: [
        RouterModule.forChild(profilesManagementRoutes),
        SharedModule,
        MatSortModule,
        MatSidenavModule,
        FuseNavigationModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        MatDividerModule,
        MatTooltipModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule,
        TranslocoModule,
        MatPaginatorModule
    ]
})
export class ProfilesManagementModule {
}
