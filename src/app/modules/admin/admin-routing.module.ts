import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ROUTER_CONST } from 'app/shared/constants';
import { AdminComponent } from './admin.component';
import { DashBoardResolvers } from './admin.resolvers';
import { AccessLogStaffResolver } from "./action-audit/action-audit.resolvers";

const router: Route[] = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                redirectTo: ROUTER_CONST.config.admin.dashboard,
                pathMatch: 'full'
            },
            {
                data: { title: '' },
                path: 'maintenance',
                loadChildren: () => import('./maintenance/maintenance.module').then(m => m.MaintenanceModule),
            },
            {
                data: { title: 'Quản lý phòng ban' },
                path: ROUTER_CONST.config.admin.departments.root,
                loadChildren: () => import('./departments/departments.module').then(m => m.DepartmentsModule),
            },
            {
                data: { title: 'Quản lý nhân viên' },
                path: ROUTER_CONST.config.admin.staff.root,
                loadChildren: () => import('./staff/staff.module').then(m => m.StaffModule),
            },
            {
                data: { title: 'Quản lý danh mục' },
                path: ROUTER_CONST.config.admin.category.root,
                loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
            },
            {
                // data: { title: '' },
                path: ROUTER_CONST.config.admin.area.root,
                loadChildren: () => import('./area/area.module').then(m => m.AreaModule),
            },
            {
                data: { title: 'Cấu hình email' },
                path: ROUTER_CONST.config.admin.emailConfig.root,
                loadChildren: () => import('./email-config/email-config.module').then(m => m.EmailConfigModule),
            },
            {
                data: { title: 'Tuỳ chỉnh sản phẩm huy động vốn' },
                path: ROUTER_CONST.config.admin.creditModifier.root,
                loadChildren: () => import('./credit-modifier/credit-modifier.module').then(m => m.CreditModifierModule),
            },
            {
                data: { title: 'Cấu hình tài khoản ngân hàng' },
                path: ROUTER_CONST.config.admin.bankAccounts.root,
                loadChildren: () => import('./bank-account/bank-account.module').then(m => m.BankAccountModule),
            },
            {
                data: { title: 'Cấu hình biểu mẫu' },
                path: ROUTER_CONST.config.admin.documentConfig.root,
                loadChildren: () => import('./document-config/document-config.module').then(m => m.DocumentConfigModule),
            },
            {
                data: { title: 'Cấu hình template email/thông báo' },
                path: ROUTER_CONST.config.admin.emailTemplate.root,
                loadChildren: () => import('./email-template/email-template.module').then(m => m.EmailTemplateModule),
            },
            {
                data: { title: 'Cấu hình thông báo/cảnh báo' },
                path: ROUTER_CONST.config.admin.notificationConfig.root,
                loadChildren: () => import('./setting-notification/setting-notification.module').then(m => m.SettingNotificationModule)
            },
            {
                data: { title: 'Giám sát truy cập' },
                path: ROUTER_CONST.config.admin.accessLogs.root,
                // loadChildren: () => import('./action-audit/action-audit.module').then(m => m.ActionAuditModule),
                loadChildren: () => import('./access-log/access-log.module').then(m => m.AccessLogModule),
                resolve: {
                    investedProfileRoutes: AccessLogStaffResolver,
                }
            },
            {
                data: { title: 'Thống kê' },
                path: ROUTER_CONST.config.admin.dashboard,
                loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
                resolve: {
                    dashboard: DashBoardResolvers,
                }
            },
            {
                data: { title: 'Quản lý phân quyền' },
                path: ROUTER_CONST.config.admin.role.root,
                loadChildren: () => import('./role-management/role-management.module').then(m => m.RoleManagementModule)
            },
            {
                data: { title: 'Cấu hình tiến trình' },
                path: ROUTER_CONST.config.admin.processConfig.root,
                loadChildren: () => import('./process-config/process-config.module').then(m => m.ProcessConfigModule),
            },
            // {
            //     data: { title: 'Cấu hình bảo trì' },
            //     path: ROUTER_CONST.config.admin.maintenanceConfig.root,
            //     loadChildren: () => import('./maintenance-config/maintenance-config.module').then(m => m.MaintenanceModule),
            // },
            {
                data: { title: 'Cấu hình ứng dụng khác hàng' },
                path: ROUTER_CONST.config.admin.customerAppConfig.root,
                loadChildren: () => import('./customer-app-config/customer-app-config.module').then(m => m.CustomerAppConfigModule),
            },
            { path: '**', redirectTo: ROUTER_CONST.config.admin.dashboard }
        ]
    }
];

@NgModule({
    exports: [RouterModule],
    imports: [
        RouterModule.forChild(router),
    ]
})
export class AdminRoutingModule {
}
