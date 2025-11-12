import {Route} from '@angular/router';
import {EnterpriseComponent} from './profile.component';
import {ProfileResolvers} from './profile.resolvers';
import {MainScreenComponent} from "./components/main-screen/main-screen.component";
export const enterpriseRoutes: Route[] = [
    {
        path: '',
        component: EnterpriseComponent,
        children: [
            {
                path: '',
                component: MainScreenComponent
            }, {
                path: ':key',
                component: MainScreenComponent
            },
        ],
        resolve: { profilePrepare: ProfileResolvers }
    },
];
