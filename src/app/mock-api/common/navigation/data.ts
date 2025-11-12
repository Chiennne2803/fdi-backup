/* tslint:disable:max-line-length */
import {FuseNavigationItem} from '@fuse/components/navigation';
import {ROUTER_CONST} from 'app/shared/constants';

export const defaultNavigation: FuseNavigationItem[] = [
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Trang chủ',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/page/home',
        code: 'ALL'
    },
    {
        id: 'admin.dashboad',
        title: 'Thống kê',
        type: 'basic',
        icon: 'heroicons_outline:presentation-chart-line',
        link: '/admin/dashboard',
        code: 'ALL'
    },
    {
        id: 'admin.customer',
        title: 'Quản lý khách hàng',
        type: 'aside',
        icon: 'heroicons_outline:users',
        code: '',
        children: [
            {
                id: 'manage.profile',
                title: 'Quản lý hồ sơ',
                type: 'basic',
                link: ROUTER_CONST.config.application.profile.link,
                code: 'SFF_PROFILE_RECEIPT_SALE_MANAGER,SFF_PROFILE_REVIEW_BUSINESS_SALE,' +
                    'SFF_PROFILE_RE_REVIEW_BUSINESS_SALE,SFF_PROFILE_REVIEW_APPRAISAL_STAFF,' +
                    'SFF_PROFILE_RE_REVIEW_APPRAISAL_STAFF,SFF_PROFILE_RECEIPT_HEAD_OF_APPRAISAL,' +
                    'SFF_PROFILE_REVIEW_HEAD_OF_APPRAISAL,SFF_PROFILE_RE_REVIEW_HEAD_OF_APPRAISAL,' +
                    'SFF_PROFILE_REVIEW_CEO,SFF_PROFILE_REVIEW_CREDIT_COMMITTEE,SFF_PROFILE_STORE',
            },
            {
                id: 'manage.dept',
                title: 'Quản lý công nợ',
                type: 'basic',
                link: ROUTER_CONST.config.application.debt.link,
                code: 'SFF_DEBT_TRACKING'
            },
            {
                id: 'manage.investor',
                title: 'Quản lý nhà đầu tư',
                type: 'basic',
                link: ROUTER_CONST.config.application.investor.link,
                code: 'SFF_INVESTOR'
            },
            {
                id: 'manage.borrower',
                title: 'Quản lý bên huy động vốn',
                type: 'basic',
                link: ROUTER_CONST.config.application.borrower.link,
                code: 'SFF_BORROWER'
            },
            {
                id: 'manage.change-id-info',
                title: 'Thay đổi ID',
                type: 'basic',
                link: ROUTER_CONST.config.application.personalInfo.link,
                code: 'SFF_CHANGE_ID'
            }
        ]
    },
    {
        id: 'admin.transaction',
        title: 'Xử lý giao dịch',
        type: 'aside',
        icon: 'heroicons_outline:switch-vertical',
        children: [
            {
                id: 'manage.recharge-trans',
                title: 'Giao dịch nạp tiền',
                type: 'basic',
                link: `${ROUTER_CONST.config.application.investorChargeTransaction.link}/wait`,
                code: 'SFF_RECHARGE_TRANSACTION'
            },
            {
                id: 'manage.withdrawal-trans',
                title: 'Giao dịch rút tiền',
                type: 'basic',
                link: ROUTER_CONST.config.application.investorWithdraw.link,
                code: 'SFF_WITHDRAW_CASH_TRANSACTION'
            },
            {
                id: 'manage.disbursement-trans',
                title: 'Giao dịch giải ngân',
                type: 'basic',
                link: ROUTER_CONST.config.application.disbursementManagement.link,
                code: 'SFF_DISBURSEMENT_TRANSACTION'
            },
            {
                id: 'manage.loan-repayment',
                title: 'Giao dịch DN hoàn trả',
                type: 'basic',
                link: ROUTER_CONST.config.application.lenderRefund.link,
                code: 'SFF_REFUND_TRANSACTION'
            },
            {
                id: 'manage.investment-return',
                title: 'Giao dịch hoàn trả NĐT',
                type: 'basic',
                link: ROUTER_CONST.config.application.investorRefund.link,
                code: 'SFF_TRANSPAY_INVESTOR_TRANSACTION'
            },
        ]
    },

    {
        id: 'admin.finance',
        title: 'Quản lý tài chính',
        type: 'aside',
        icon: 'attach_money',
        children: [
            {
                id: 'manage.investment-return',
                title: 'Quản lý phí giao dịch',
                type: 'basic',
                link: ROUTER_CONST.config.application.transactionFeeManagement.feeLoanArrangement.link + '/list',
                code: 'SFF_MANAGE_TRANSACTION_FEES'
            },
            {
                id: 'manage.commission-trans',
                title: 'Thanh toán hoa hồng',
                type: 'basic',
                link: ROUTER_CONST.config.application.transactionManagement.commissionManagement.link,
                code: 'SFF_PROCESSING_COMMISSION'
            },
            {
                id: 'manage.loan-repayment',
                title: 'Xử lý Yêu cầu thanh toán hoa hồng',
                type: 'basic',
                link: ROUTER_CONST.config.application.financeManagement.commissionProcess.link,
                code: 'SFF_PROCESSING_COMMISSION'
            },
            {
                id: 'manage.commission-trans',
                title: 'Tiếp quỹ tiền mặt/tiền điện tử',
                type: 'basic',
                link: ROUTER_CONST.config.application.transactionManagement.funding.link,
                code: 'SFF_CASH_CURRENCY_FUNDING'
            },
            {
                id: 'manage.loan-repayment',
                title: 'Xử lý Yêu cầu tiếp quỹ',
                type: 'basic',
                link: ROUTER_CONST.config.application.financeManagement.fundingProcess.link,
                code: 'SFF_PROCESSING_FUNDING'
            },
            {
                id: 'manage.loan-repayment',
                title: 'Xử lý Yêu cầu điều chuyển ví',
                type: 'basic',
                link: ROUTER_CONST.config.application.financeManagement.transferMoneyProcess.link,
                code: 'SFF_TRANSFER_REQUESTS'
            },
            {
                id: 'manage.commission-trans',
                title: 'Rút tiền ví từ tài khoản HO',
                type: 'basic',
                link: ROUTER_CONST.config.application.transactionManagement.withdrawFromHO.link,
                code: 'SFF_WITHDRAW_WALLET'
            },
            {
                id: 'manage.loan-repayment',
                title: 'Xử lý Yêu cầu rút tiền từ tài khoản HO',
                type: 'basic',
                link: ROUTER_CONST.config.application.financeManagement.withdrawFromHOProcess.link,
                code: 'SFF_PROCESSING_WALLET'
            },
        ]
    },
    {
        id: 'admin.statistical-report',
        title: 'Báo cáo thống kê',
        type: 'aside',
        icon: 'mat_outline:report',
        code: 'SFF_STATISTIC',
        children: [
            {
                id: 'manage.investor-charge-report.saleInvestor',
                title: 'Báo cáo sale đầu tư',
                type: 'group',
                code: 'SFF_STATISTIC',
                children: [
                    
                    {
                        id: 'manage.report-account-investor',
                        title: 'Báo cáo tài khoản nhà đầu tư',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportAccountInvestor.link,
                        code: 'Report_sale_invest_1'
                    },
                    {
                        id: 'manage.report-new-account',
                        title: 'Báo cáo tài khoản mở mới',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportNewAccount.link,
                        code: 'Report_sale_invest_2'
                    },
                    {
                        id: 'manage.report-invest',
                        title: 'Báo cáo đầu tư',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportInvest.link,
                        code: 'Report_sale_invest_3'
                    }
                ]
            },
            {
                id: 'manage.investor-charge-report.saleLender',
                title: 'Báo cáo sale doanh nghiệp',
                type: 'group',
                code: 'SFF_STATISTIC',
                children: [
                    {
                        id: 'manage.report-lender',
                        title: 'Báo cáo tổng hợp huy động vốn',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportLender.link,
                        code: 'Report_sale_brow_1'
                    },
                    {
                        id: 'manage.report-lender-loan',
                        title: 'Báo cáo huy động mới',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportLenderLoan.link,
                        code: 'Report_sale_brow_2'
                    },
                    {
                        id: 'manage.report-debt',
                        title: 'Báo cáo công nợ',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportDebt.link,
                        code: 'Report_sale_brow_3'
                    },
                    /*{
                        id: 'manage.business-return-report',
                        title: 'Báo cáo nợ quá hạn',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.businessReturnReport.link,
                        code: 'SFF_STATISTIC'
                    }*/
                ]
            },
            {
                id: 'manage.investor-charge-report.accountant',
                title: 'Báo cáo kế toán',
                type: 'group',
                code: 'SFF_STATISTIC',
                children: [
                    {
                        id: 'manage.report-investor-topup',
                        title: 'Báo cáo nạp tiền',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.investorChargeReport.link,
                        code: 'Report_accountant_1'
                    },
                    {
                        id: 'manage.report-investor-withdraw-cash',
                        title: 'Báo cáo rút tiền',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.investorWithdrawalReport.link,
                        code: 'Report_accountant_2'
                    },
                    {
                        id: 'manage.report-transpay-request',
                        title: 'Báo cáo giải ngân và hoàn trả',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.businessReturnReport.link,
                        code: 'Report_accountant_3'
                    },
                    {
                        id: 'manage.report-contract-tracking',
                        title: 'Báo cáo theo dõi khế ước',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportContractTracking.link,
                        code: 'Report_accountant_4'
                    },
                    // {
                    //     id: 'manage.report-service-fee',
                    //     title: 'Báo cáo thu phí dịch vụ kết nối thành công',
                    //     type: 'basic',
                    //     link: ROUTER_CONST.config.statisticalReport.reportServiceFee.link,
                    //     code: 'Report_accountant_5'
                    // },
                    {
                        id: 'manage.report-business-loan',
                        title: 'Báo cáo dư nợ doanh nghiệp huy động vốn',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportBusinessLoan.link,
                        code: 'Report_accountant_6'
                    },
                    {
                        id: 'manage.report-investor',
                        title: 'Báo cáo nhà đầu tư cá nhân ',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportInvestor.link,
                        code: 'Report_accountant_7'
                    },
                    {
                        id: 'manage.report-transfer-transaction',
                        title: 'Báo cáo giao dịch chuyển nhượng ',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.transferTransaction.link,
                        code: 'Report_accountant_8'
                    },
                    {
                        id: 'manage.report-promotional-statement',
                        title: 'Báo cáo chương trình khuyến mại',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportPromotionalStatement.link,
                        code: 'Report_accountant_7'
                    }
                ]
            },
        ]
    },
    {
        id: 'admin.manage',
        title: 'Quản trị hệ thống',
        type: 'aside',
        icon: 'heroicons_outline:cog',
        children: [
            {
                id: 'manage.employee',
                title: 'Quản lý nhân viên',
                type: 'basic',
                link: ROUTER_CONST.config.admin.staff.link,
                code: 'SFF_EMPLOYEE'
            },
            {
                id: 'manage.departments',
                title: 'Quản lý phòng ban',
                type: 'basic',
                link: ROUTER_CONST.config.admin.departments.link,
                code: 'SFF_DEPARTMENT'
            },
            {
                id: 'manage.role',
                title: 'Quản lý phân quyền',
                type: 'basic',
                link: ROUTER_CONST.config.admin.role.link,
                code: 'SFF_DECENTRALIZED'
            },
            {
                id: 'manage.category',
                title: 'Dữ liệu danh mục',
                type: 'basic',
                link: ROUTER_CONST.config.admin.category.link,
                code: 'SFF_DIRECTORY_DATA'
            },{
                id: 'manage.area',
                title: 'Quản lý địa bàn',
                type: 'basic',
                link: ROUTER_CONST.config.admin.area.link,
                code: 'SFF_DIRECTORY_DATA'
            },
            {
                id: 'manage.email-config',
                title: 'Cấu hình email',
                type: 'basic',
                link: ROUTER_CONST.config.admin.emailConfig.link,
                code: 'SFF_EMAIL_CONFIGURATION'
            },
            {
                id: 'manage.bank-account',
                title: 'Cấu hình tài khoản ngân hàng',
                type: 'basic',
                link: ROUTER_CONST.config.admin.bankAccounts.link,
                code: 'SFF_CONFIGURE_BANK_ACCOUNT'
            },
            {
                id: 'manage.bank-account',
                title: 'Cấu hình biểu mẫu',
                type: 'basic',
                link: ROUTER_CONST.config.admin.documentConfig.link,
                code: 'SFF_FORM_CONFIGURATION'
            },
            {
                id: 'manage.credit',
                title: 'Cấu hình thông báo/cảnh báo',
                type: 'basic',
                link: ROUTER_CONST.config.admin.notificationConfig.link,
                code: 'SFF_CONFIGURING_ALERTS'
            },
            {
                id: 'manage.accessLogs',
                title: 'Giám sát truy cập',
                type: 'basic',
                link: ROUTER_CONST.config.admin.accessLogs.link,
                code: 'SFF_ACCESS_MONITORING'
            },
            {
                id: 'manage.credit',
                title: 'Tuỳ chỉnh sản phẩm huy động vốn',
                type: 'basic',
                link: ROUTER_CONST.config.admin.creditModifier.link,
                code: 'SFF_CUSTOM_CREDIT_PRODUCTS'
            },
            {
                id: 'manage.process',
                title: 'Cấu hình tiến trình',
                type: 'basic',
                link: ROUTER_CONST.config.admin.processConfig.link,
                code: 'SFF_PROCESS_CONFIG'
            },
            // {
            //     id: 'manage.process',
            //     title: 'Cấu hình bảo trì',
            //     type: 'basic',
            //     link: ROUTER_CONST.config.admin.maintenanceConfig.link,
            //     code: 'SFF_PROCESS_CONFIG'
            // },
            {
                id: 'manage.process',
                title: 'Cấu hình Template',
                type: 'basic',
                link: ROUTER_CONST.config.admin.emailTemplate.link,
                code: 'SFF_PROCESS_CONFIG'
            },
            {
                id: 'manage.process',
                title: 'Cấu hình Ứng dụng khách hàng',
                type: 'basic',
                link: ROUTER_CONST.config.admin.customerAppConfig.link,
                code: 'SFF_CUSTOMER_APP_CONFIG'
            },
        ]
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'example',
    //     title: 'Example',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/example'
    // }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Trang chủ',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/page/home',
        code: 'ALL'
    },

    {
        id: 'admin.dashboad',
        title: 'Thống kê',
        type: 'basic',
        icon: 'heroicons_outline:presentation-chart-line',
        link: '/admin/dashboard',
        code: 'ALL'
    },
    {
        id: 'admin.customer',
        title: 'Quản lý khách hàng',
        type: 'group',
        icon: 'heroicons_outline:users',
        code: '',
        children: [
            {
                id: 'manage.profile',
                title: 'Quản lý hồ sơ',
                type: 'basic',
                link: ROUTER_CONST.config.application.profile.link,
                code: 'SFF_PROFILE_RECEIPT_SALE_MANAGER,SFF_PROFILE_REVIEW_BUSINESS_SALE,' +
                    'SFF_PROFILE_RE_REVIEW_BUSINESS_SALE,SFF_PROFILE_REVIEW_APPRAISAL_STAFF,' +
                    'SFF_PROFILE_RE_REVIEW_APPRAISAL_STAFF,SFF_PROFILE_RECEIPT_HEAD_OF_APPRAISAL,' +
                    'SFF_PROFILE_REVIEW_HEAD_OF_APPRAISAL,SFF_PROFILE_RE_REVIEW_HEAD_OF_APPRAISAL,' +
                    'SFF_PROFILE_REVIEW_CEO,SFF_PROFILE_REVIEW_CREDIT_COMMITTEE,SFF_PROFILE_STORE',
            },
            {
                id: 'manage.dept',
                title: 'Quản lý công nợ',
                type: 'basic',
                link: ROUTER_CONST.config.application.debt.link,
                code: 'SFF_DEBT_TRACKING'
            },
            {
                id: 'manage.investor',
                title: 'Quản lý nhà đầu tư',
                type: 'basic',
                link: ROUTER_CONST.config.application.investor.link,
                code: 'SFF_INVESTOR'
            },
            {
                id: 'manage.borrower',
                title: 'Quản lý bên huy động vốn',
                type: 'basic',
                link: ROUTER_CONST.config.application.borrower.link,
                code: 'SFF_BORROWER'
            },
            {
                id: 'manage.change-id-info',
                title: 'Thay đổi ID',
                type: 'basic',
                link: ROUTER_CONST.config.application.personalInfo.link,
                code: 'SFF_CHANGE_ID'
            }
        ]
    },
    {
        id: 'admin.transaction',
        title: 'Xử lý giao dịch',
        type: 'group',
        icon: 'heroicons_outline:switch-vertical',
        children: [
            {
                id: 'manage.recharge-trans',
                title: 'Giao dịch nạp tiền',
                type: 'basic',
                link: `${ROUTER_CONST.config.application.investorChargeTransaction.link}`,
                code: 'SFF_RECHARGE_TRANSACTION'
            },
            {
                id: 'manage.withdrawal-trans',
                title: 'Giao dịch rút tiền',
                type: 'basic',
                link: ROUTER_CONST.config.application.investorWithdraw.link,
                code: 'SFF_WITHDRAW_CASH_TRANSACTION'
            },
            {
                id: 'manage.disbursement-trans',
                title: 'Giao dịch giải ngân',
                type: 'basic',
                link: ROUTER_CONST.config.application.disbursementManagement.link,
                code: 'SFF_DISBURSEMENT_TRANSACTION'
            },
            {
                id: 'manage.loan-repayment',
                title: 'Giao dịch DN hoàn trả',
                type: 'basic',
                link: ROUTER_CONST.config.application.lenderRefund.link,
                code: 'SFF_REFUND_TRANSACTION'
            },
            {
                id: 'manage.investment-return',
                title: 'Giao dịch hoàn trả NĐT',
                type: 'basic',
                link: ROUTER_CONST.config.application.investorRefund.link,
                code: 'SFF_TRANSPAY_INVESTOR_TRANSACTION'
            },
        ]
    },

    {
        id: 'admin.finance',
        title: 'Quản lý tài chính',
        type: 'group',
        icon: 'attach_money',
        children: [
            {
                id: 'manage.investment-return',
                title: 'Quản lý phí giao dịch',
                type: 'basic',
                link: ROUTER_CONST.config.application.transactionFeeManagement.feeLoanArrangement.link + '/list',
                code: 'SFF_MANAGE_TRANSACTION_FEES'
            },
            {
                id: 'manage.commission-trans',
                title: 'Thanh toán hoa hồng',
                type: 'basic',
                link: ROUTER_CONST.config.application.transactionManagement.commissionManagement.link,
                code: 'SFF_PROCESSING_COMMISSION'
            },
            {
                id: 'manage.loan-repayment',
                title: 'Xử lý Yêu cầu thanh toán hoa hồng',
                type: 'basic',
                link: ROUTER_CONST.config.application.financeManagement.commissionProcess.link,
                code: 'SFF_PROCESSING_COMMISSION'
            },
            {
                id: 'manage.commission-trans',
                title: 'Tiếp quỹ tiền mặt/tiền điện tử',
                type: 'basic',
                link: ROUTER_CONST.config.application.transactionManagement.funding.link,
                code: 'SFF_CASH_CURRENCY_FUNDING'
            },
            {
                id: 'manage.loan-repayment',
                title: 'Xử lý Yêu cầu tiếp quỹ',
                type: 'basic',
                link: ROUTER_CONST.config.application.financeManagement.fundingProcess.link,
                code: 'SFF_PROCESSING_FUNDING'
            },
            {
                id: 'manage.loan-repayment',
                title: 'Xử lý Yêu cầu điều chuyển ví',
                type: 'basic',
                link: ROUTER_CONST.config.application.financeManagement.transferMoneyProcess.link,
                code: 'SFF_TRANSFER_REQUESTS'
            },
            {
                id: 'manage.commission-trans',
                title: 'Rút tiền ví từ tài khoản HO',
                type: 'basic',
                link: ROUTER_CONST.config.application.transactionManagement.withdrawFromHO.link,
                code: 'SFF_WITHDRAW_WALLET'
            },
            {
                id: 'manage.loan-repayment',
                title: 'Xử lý Yêu cầu rút tiền từ tài khoản HO',
                type: 'basic',
                link: ROUTER_CONST.config.application.financeManagement.withdrawFromHOProcess.link,
                code: 'SFF_PROCESSING_WALLET'
            },
        ]
    },
    {
        id: 'admin.statistical-report',
        title: 'Báo cáo thống kê',
        type: 'group',
        icon: 'mat_outline:report',
        code: 'SFF_STATISTIC',
        children: [
            {
                id: 'manage.investor-charge-report.saleInvestor',
                title: 'Báo cáo sale đầu tư',
                type: 'group',
                code: 'SFF_STATISTIC',
                children: [
                    
                    {
                        id: 'manage.report-account-investor',
                        title: 'Báo cáo tài khoản nhà đầu tư',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportAccountInvestor.link,
                        code: 'Report_sale_invest_1'
                    },
                    {
                        id: 'manage.report-new-account',
                        title: 'Báo cáo tài khoản mở mới',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportNewAccount.link,
                        code: 'Report_sale_invest_2'
                    },
                    {
                        id: 'manage.report-invest',
                        title: 'Báo cáo đầu tư',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportInvest.link,
                        code: 'Report_sale_invest_3'
                    }
                ]
            },
            {
                id: 'manage.investor-charge-report.saleLender',
                title: 'Báo cáo sale doanh nghiệp',
                type: 'group',
                code: 'SFF_STATISTIC',
                children: [
                    {
                        id: 'manage.report-lender',
                        title: 'Báo cáo tổng hợp huy động vốn',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportLender.link,
                        code: 'Report_sale_brow_1'
                    },
                    {
                        id: 'manage.report-lender-loan',
                        title: 'Báo cáo huy động mới',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportLenderLoan.link,
                        code: 'Report_sale_brow_2'
                    },
                    {
                        id: 'manage.report-debt',
                        title: 'Báo cáo công nợ',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportDebt.link,
                        code: 'Report_sale_brow_3'
                    },
                    /*{
                        id: 'manage.business-return-report',
                        title: 'Báo cáo nợ quá hạn',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.businessReturnReport.link,
                        code: 'SFF_STATISTIC'
                    }*/
                ]
            },
            {
                id: 'manage.investor-charge-report.accountant',
                title: 'Báo cáo kế toán',
                type: 'group',
                code: 'SFF_STATISTIC',
                children: [
                    {
                        id: 'manage.report-investor-topup',
                        title: 'Báo cáo nạp tiền',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.investorChargeReport.link,
                        code: 'Report_accountant_1'
                    },
                    {
                        id: 'manage.report-investor-withdraw-cash',
                        title: 'Báo cáo rút tiền',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.investorWithdrawalReport.link,
                        code: 'Report_accountant_2'
                    },
                    {
                        id: 'manage.report-transpay-request',
                        title: 'Báo cáo giải ngân và hoàn trả',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.businessReturnReport.link,
                        code: 'Report_accountant_3'
                    },
                    {
                        id: 'manage.report-contract-tracking',
                        title: 'Báo cáo theo dõi khế ước',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportContractTracking.link,
                        code: 'Report_accountant_4'
                    },
                    // {
                    //     id: 'manage.report-service-fee',
                    //     title: 'Báo cáo thu phí dịch vụ kết nối thành công',
                    //     type: 'basic',
                    //     link: ROUTER_CONST.config.statisticalReport.reportServiceFee.link,
                    //     code: 'Report_accountant_5'
                    // },
                    {
                        id: 'manage.report-business-loan',
                        title: 'Báo cáo dư nợ doanh nghiệp huy động vốn',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportBusinessLoan.link,
                        code: 'Report_accountant_6'
                    },
                    {
                        id: 'manage.report-investor',
                        title: 'Báo cáo nhà đầu tư cá nhân ',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportInvestor.link,
                        code: 'Report_accountant_7'
                    },
                    {
                        id: 'manage.report-transfer-transaction',
                        title: 'Báo cáo giao dịch chuyển nhượng ',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.transferTransaction.link,
                        code: 'Report_accountant_8'
                    },
                    {
                        id: 'manage.report-promotional-statement',
                        title: 'Báo cáo chương trình khuyến mại',
                        type: 'basic',
                        link: ROUTER_CONST.config.statisticalReport.reportPromotionalStatement.link,
                        code: 'Report_accountant_7'
                    },
                ]
            },
        ]
    },
    {
        id: 'admin.manage',
        title: 'Quản trị hệ thống',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children: [
            {
                id: 'manage.employee',
                title: 'Quản lý nhân viên',
                type: 'basic',
                link: ROUTER_CONST.config.admin.staff.link,
                code: 'SFF_EMPLOYEE'
            },
            {
                id: 'manage.departments',
                title: 'Quản lý phòng ban',
                type: 'basic',
                link: ROUTER_CONST.config.admin.departments.link,
                code: 'SFF_DEPARTMENT'
            },
            {
                id: 'manage.role',
                title: 'Quản lý phân quyền',
                type: 'basic',
                link: ROUTER_CONST.config.admin.role.link,
                code: 'SFF_DECENTRALIZED'
            },
            {
                id: 'manage.category',
                title: 'Dữ liệu danh mục',
                type: 'basic',
                link: ROUTER_CONST.config.admin.category.link,
                code: 'SFF_DIRECTORY_DATA'
            },{
                id: 'manage.area',
                title: 'Quản lý địa bàn',
                type: 'basic',
                link: ROUTER_CONST.config.admin.area.link,
                code: 'SFF_DIRECTORY_DATA'
            },
            {
                id: 'manage.email-config',
                title: 'Cấu hình email',
                type: 'basic',
                link: ROUTER_CONST.config.admin.emailConfig.link,
                code: 'SFF_EMAIL_CONFIGURATION'
            },
            {
                id: 'manage.bank-account',
                title: 'Cấu hình tài khoản ngân hàng',
                type: 'basic',
                link: ROUTER_CONST.config.admin.bankAccounts.link,
                code: 'SFF_CONFIGURE_BANK_ACCOUNT'
            },
            {
                id: 'manage.bank-account',
                title: 'Cấu hình biểu mẫu',
                type: 'basic',
                link: ROUTER_CONST.config.admin.documentConfig.link,
                code: 'SFF_FORM_CONFIGURATION'
            },
            {
                id: 'manage.credit',
                title: 'Cấu hình thông báo/cảnh báo',
                type: 'basic',
                link: ROUTER_CONST.config.admin.notificationConfig.link,
                code: 'SFF_CONFIGURING_ALERTS'
            },
            {
                id: 'manage.accessLogs',
                title: 'Giám sát truy cập',
                type: 'basic',
                link: ROUTER_CONST.config.admin.accessLogs.link,
                code: 'SFF_ACCESS_MONITORING'
            },
            {
                id: 'manage.credit',
                title: 'Tuỳ chỉnh sản phẩm huy động vốn',
                type: 'basic',
                link: ROUTER_CONST.config.admin.creditModifier.link,
                code: 'SFF_CUSTOM_CREDIT_PRODUCTS'
            },
            {
                id: 'manage.process',
                title: 'Cấu hình tiến trình',
                type: 'basic',
                link: ROUTER_CONST.config.admin.processConfig.link,
                code: 'SFF_PROCESS_CONFIG'
            },
            // {
            //     id: 'manage.process',
            //     title: 'Cấu hình bảo trì',
            //     type: 'basic',
            //     link: ROUTER_CONST.config.admin.maintenanceConfig.link,
            //     code: 'SFF_PROCESS_CONFIG'
            // },
            {
                id: 'manage.process',
                title: 'Cấu hình Ứng dụng khách hàng',
                type: 'basic',
                link: ROUTER_CONST.config.admin.customerAppConfig.link,
                code: 'SFF_CUSTOMER_APP_CONFIG'
            },
        ]
    },
];

export const horizontalBorrowerNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Trang chủ',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/page/home',
        code: 'ALL'
    },
    {
        id: 'admin.dashboad',
        title: 'Thống kê',
        type: 'basic',
        icon: 'heroicons_outline:credit-card',
        link: '/borrower/dashboard',
        code: 'ALL'
    },
    {
        id: 'borrower.loan-application.create',
        title: 'Tạo hồ sơ huy động',
        type: 'basic',
        icon: 'mat_outline:rv_hookup',
        link: '/borrower/create-loan',
        code: 'LENDER_LOAN_PROFILE_CREATE_LOAN_PROFILE'
    },
    {
        id: 'borrower.loan-application.review',
        title: 'Hồ sơ đang xem xét',
        type: 'basic',
        icon: 'mat_outline:rv_hookup',
        link: '/borrower/loan-review',
        code: 'LENDER_LOAN_PROFILE_REVIEW_ADVANCED_SEARCH' +
            ',LENDER_LOAN_PROFILE_REVIEW_EXPORT_PENDING_PROFILES'
    },
    {
        id: 'borrower.loan-application.calling-for-capital',
        title: 'Hồ sơ đang huy động',
        type: 'basic',
        icon: 'mat_outline:rv_hookup',
        link: '/borrower/loan-calling',
        code: 'LENDER_LOAN_PROFILE_APPROVED_ADVANCED_SEARCH' +
            ',LENDER_LOAN_PROFILE_APPROVED_EXPORT_PROFILES' +
            ',LENDER_LOAN_PROFILE_APPROVED_USE_CAPITAL_PACKAGE' +
            ',LENDER_LOAN_PROFILE_APPROVED_PROCESS_INVESTMENT' +
            ',LENDER_LOAN_PROFILE_APPROVED_AUTO_APPROVE' +
            ',LENDER_LOAN_PROFILE_APPROVED_CREATE_PAYMENT'
    },
    {
        id: 'borrower.loan-application.archive',
        title: 'Hồ sơ lưu trữ',
        type: 'basic',
        icon: 'mat_outline:rv_hookup',
        link: '/borrower/loan-archive',
        code: 'LENDER_LOAN_PROFILE_STORE_ADVANCED_SEARCH' +
            ',LENDER_LOAN_PROFILE_STORE_EXPORT_ARCHIVED_PROFILES' +
            ',LENDER_LOAN_PROFILE_STORE_PROCESS_INVESTMENT'
    },
];

export const horizontalInvestorNavigation: FuseNavigationItem[] = [
    {
        id: 'home',
        title: 'Trang chủ',
        type: 'basic',
        icon: 'heroicons_outline:home',
        link: '/page/home',
        code: 'ALL'
    },
    {
        id: 'admin.dashboad',
        title: 'Thống kê',
        type: 'basic',
        icon: 'heroicons_outline:credit-card',
        link: '/investor/dashboard',
        code: 'ALL',
    },
    {
        id: 'investor.loan-application.create',
        title: 'Đầu tư tự chọn',
        type: 'basic',
        icon: 'mat_outline:rv_hookup',
        link: '/investor/manual-investment',
        code: 'INVESTOR_MANUAL_MANUAL_INVEST'
    },
    {
        id: 'investor.automatic-investment',
        title: 'Đầu tư tự động',
        type: 'basic',
        icon: 'flash_auto',
        link: ROUTER_CONST.config.investor.autoInvestment.link,
        code: 'INVESTOR_AUTO_AUTO_INVEST' +
            ',INVESTOR_AUTO_AUTO_DEPOSIT' +
            ',INVESTOR_AUTO_EXPORT_AUTO_INVEST' +
            ',INVESTOR_AUTO_CANCEL_AUTO_INVEST'
    },
    {
        id: 'investor.investment-transfer',
        title: 'Chuyển nhượng khoản đầu tư',
        type: 'basic',
        icon: 'mat_outline:rv_hookup',
        link: '/investor/investment-transfer/sale',
        code: 'INVESTOR_P2P_CREATE_TRANSFER_REQUEST' +
            ',INVESTOR_P2P_CREATE_TRANSFER_REQUEST' +
            ',INVESTOR_P2P_SEARCH_FOR_SALE' +
            ',INVESTOR_P2P_CANCEL_TRANSFER' +
            ',INVESTOR_P2P_SEARCH_PROPOSAL' +
            ',INVESTOR_P2P_RECEIVE_TRANSFER'
    },
    {
        id: 'investor.loan-application.review',
        title: 'Nạp tiền đầu tư',
        type: 'basic',
        icon: 'mat_outline:rv_hookup',
        link: '/investor/topup-investment',
        code: 'INVESTOR_TOPUP_CREATE_DEPOSIT_ORDER'
    },
    {
        id: 'investor.loan-application.calling-for-capital',
        title: 'Rút tiền',
        type: 'basic',
        icon: 'mat_outline:rv_hookup',
        link: '/investor/withdraw',
        code: 'INVESTOR_CASHOUT_CREATE_WITHDRAWAL_ORDER'
    },
    {
        id: 'investor.loan-application.calling-for-capital',
        title: 'Các hồ sơ đã đầu tư',
        type: 'basic',
        icon: 'mat_outline:supervisor_account',
        link: '/investor/invested-profile-management',
        code: 'INVESTOR_LOAN_PROFILE_EXPORT,INVESTOR_LOAN_PROFILE_SEARCH'
    },
    {
        id: 'investor.account-statement.calling-for-capital',
        title: 'Sao kê tài khoản',
        type: 'basic',
        icon: 'mat_outline:supervisor_account',
        link: '/investor/account-statement',
        code: 'INVESTOR_STATEMENT_SEARCH_STATEMENT'
    }
];
