import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CategoryComponent } from './category.component';
import { CategoryResolvers } from './category.resovers';

const route: Route[] = [
    {
        path: '', component: CategoryComponent, resolve: {
            category: CategoryResolvers,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class CategoryRoutingModule { }
