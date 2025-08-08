import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { AreaRoutingModule } from './area-routing.module';
import { AreaComponent } from './area.component';
import { AreaDialogComponent } from './components/area-dialog/area-dialog.component';
import { AreaListCategoryComponent } from './components/area-list-category/area-list-category.component';
import { ParentCategoryDialogComponent } from './components/parent-category-dialog/parent-category-dialog.component';
import {TranslocoModule} from "@ngneat/transloco";
import {SharedUIModule} from "../../../shared/components/shared-ui.module";
import {FuseNavigationModule} from "../../../../@fuse/components/navigation";



@NgModule({
    declarations: [
        AreaComponent,
        AreaListCategoryComponent,
        ParentCategoryDialogComponent,
        AreaDialogComponent
    ],
    imports: [
        CommonModule,
        AreaRoutingModule,
        SharedModule,
        SharedUIModule,
        MatFormFieldModule,
        MatIconModule,
        MatSidenavModule,
        MatListModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        TranslocoModule,
        FuseNavigationModule
    ]
})
export class AreaModule { }
