import { Route } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { ROUTER_CONST } from 'app/shared/constants';
import { KycGuard } from './core/auth/guards/kyc.guard';
import { RoleGuard } from './core/auth/guards/role.guard';
import { AdmAccountType } from './core/user/user.types';
import {NotificationsModule} from "./modules/common/notifications/notifications.module";

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'admin' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'auth'
        },
        children: [
            // { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password/:token', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) },
        ]
    },

    // Admin routes
    {
        path: ROUTER_CONST.config.admin.root,
        canActivate: [AuthGuard, RoleGuard],
        canActivateChild: [AuthGuard],
        data: {
            layout: 'compact',
            role: AdmAccountType.ADMIN,
        },
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: '', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
        ]
    },

    // Application routes
    {
        path: ROUTER_CONST.config.application.root,
        canActivate: [AuthGuard, RoleGuard],
        canActivateChild: [AuthGuard],
        data: {
            layout: 'compact',
            role: AdmAccountType.ADMIN,
        },
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: '', loadChildren: () => import('./modules/application/application.module').then(m => m.ApplicationModule) },
        ]
    },

    // Statistical Report routes
    {
        path: ROUTER_CONST.config.statisticalReport.root,
        canActivate: [AuthGuard, RoleGuard],
        canActivateChild: [AuthGuard],
        data: {
            layout: 'compact',
            role: AdmAccountType.ADMIN,
        },
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: '', loadChildren: () => import('./modules/report/statistical-report.module').then(m => m.StatisticalReportModule) },
        ]
    },

    // Borrower routes
    {
        path: ROUTER_CONST.config.borrower.root,
        canActivate: [AuthGuard, RoleGuard],
        canActivateChild: [AuthGuard, KycGuard],
        data: {
            layout: 'compact',
            role: AdmAccountType.BORROWER,
        },
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: '', loadChildren: () => import('./modules/lender/borrower.module').then(m => m.BorrowerModule) },
        ]
    },

    // Common routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        data: {
            layout: 'compact'
        },
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: 'page/home', loadChildren: ()=> import('app/modules/pages/home/home.module').then(m => m.PageHomeModule)},
            { path: ROUTER_CONST.config.common.profile.root, loadChildren: () => import('app/modules/common/profile/profile.module').then(m => m.ProfileModule) },
            { path: ROUTER_CONST.config.common.notifications.root, loadChildren: () => import('app/modules/common/notifications/notifications.module').then(m => m.NotificationsModule) },
        ]
    },

    // Investor routes
    {
        path: ROUTER_CONST.config.investor.root,
        canActivate: [AuthGuard, RoleGuard],
        canActivateChild: [AuthGuard, KycGuard],
        data: {
            layout: 'compact',
            role: AdmAccountType.INVESTOR,
        },
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: '', loadChildren: () => import('./modules/investor/investor.module').then(m => m.InvestorModule) },
        ]
    },

];
