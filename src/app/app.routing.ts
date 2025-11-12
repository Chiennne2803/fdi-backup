import { Route } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { ROUTER_CONST } from 'app/shared/constants';
import { KycGuard } from './core/auth/guards/kyc.guard';
import { RoleGuard } from './core/auth/guards/role.guard';
import { AdmAccountType } from './core/user/user.types';
import { StatusGuard } from './core/auth/guards/status.guard';

export const appRoutes: Route[] = [

    // Redirect empty path to '/admin'
    { path: '', pathMatch: 'full', redirectTo: 'admin' },
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'admin'},


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
            { path: 'forgot-password', data: { title: 'Quên mật khẩu' }, loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password/:token', data: { title: 'Đặt lại mật khẩu' }, loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', data: { title: 'Đăng nhập' }, loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', data: { title: 'Đăng ký' }, loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) },
        ]
    },

    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'maintenance', data: { title: 'Bảo trì' }, loadChildren: () => import('app/modules/pages/maintenance/maintenance.module').then(m => m.MaintenanceModule) },
            { path: 'error', data: { title: 'Lỗi hệ thống' }, loadChildren: () => import('app/modules/pages/error-500/error-500.module').then(m => m.Error500Module) },
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
        canActivate: [AuthGuard, StatusGuard],
        canActivateChild: [AuthGuard, StatusGuard],
        data: {
            layout: 'compact'
        },
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'page/home',  data: { title: 'Trang chủ' }, loadChildren: () => import('app/modules/pages/home/home.module').then(m => m.PageHomeModule) },
            { path: ROUTER_CONST.config.common.profile.root,  data: { title: 'Hồ sơ của tôi' }, loadChildren: () => import('app/modules/common/profile/profile.module').then(m => m.ProfileModule) },
            { path: ROUTER_CONST.config.common.notifications.root,  data: { title: 'Thông báo' },loadChildren: () => import('app/modules/common/notifications/notifications.module').then(m => m.NotificationsModule) },
           
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
