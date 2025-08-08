import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PersonalInfoComponent } from './personal-info.component';
import { PersonalInfoResolver } from './personal-info.resolver';


const route: Route[] = [
    {
        path: '', component: PersonalInfoComponent, resolve: {
            transferMonenyProcess: PersonalInfoResolver,
        }
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(route)
    ]
})
export class PersonalInfoRoutingModule { }
