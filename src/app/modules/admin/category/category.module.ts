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
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { CategoryDialogComponent } from './components/category-dialog/category-dialog.component';
import { ItemListCategoryComponent } from './components/item-list-category/item-list-category.component';
import { ParentCategoryDialogComponent } from './components/parent-category-dialog/parent-category-dialog.component';
import {TranslocoModule} from "@ngneat/transloco";
import {SharedUIModule} from "../../../shared/components/shared-ui.module";



@NgModule({
    declarations: [
        CategoryComponent,
        ItemListCategoryComponent,
        ParentCategoryDialogComponent,
        CategoryDialogComponent
    ],
    imports: [
        CommonModule,
        CategoryRoutingModule,
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
        TranslocoModule
    ]
})
export class CategoryModule { }
