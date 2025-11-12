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
                data: { title: 'Quản lý Tỉnh/Thành phố' },
                path: 'province',
                component: AreaListCategoryComponent,
            },{
                data: { title: 'Quản lý Quận/Huyện' },
                path: 'province/:parentCategoriesCode',
                component: AreaListCategoryComponent,
            },
            {
                data: { title: 'Quản lý Phường/Xã' },
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
