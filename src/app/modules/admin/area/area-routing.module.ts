import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {AreaResolvers} from './area.resovers';
import {AreaListCategoryComponent} from "./components/area-list-category/area-list-category.component";
import {AreaComponent} from "./area.component";

const route: Route[] = [
    {
        path: '',
        component: AreaComponent,
        resolve: {
            category: AreaResolvers,
        },
        children: [
            {
                path: 'province',
                component: AreaListCategoryComponent,
            },{
                path: 'province/:parentCategoriesCode',
                component: AreaListCategoryComponent,
            },
            {
                path: 'district/:parentCategoriesCode',
                component: AreaListCategoryComponent,
            },
            {
                path: 'commune/:parentCategoriesCode',
                component: AreaListCategoryComponent,
            },
        ]
    }
];



@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class AreaRoutingModule { }
