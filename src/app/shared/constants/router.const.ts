export const ROUTER_CONST = {
    config: {
        base: {
            home: '',
            dashboard: 'dashboard',
        },
        common: {
            error404: {
                root: 'page/error-404'
            },
            error500: {
                root: 'page/error-500'
            },
            profile: {
                root: 'page/profile',
                link: '/page/profile',
                detail: {
                    root: 'detail',
                    link: '/page/profile/detail'
                },
                detailCompany: {
                    root: 'company-info',
                    link: '/page/profile/company-info'
                },
                contactInfo: {
                    root: 'contact-information',
                    link: '/page/profile/contact-information'
                },
                laborContract: {
                    root: 'labor-contract',
                    link: '/page/profile/labor-contract'
                },
                rentalContract: {
                    root: 'rental-contract',
                    link: '/page/profile/rental-contract'
                },
                otherIncome: {
                    root: 'other-income',
                    link: '/page/profile/other-income'
                },
                otherValuablePaper: {
                    root: 'other-valuable-papers',
                    link: '/page/profile/other-valuable-papers'
                },
                closeAccount: {
                    root: 'close-account',
                    link: '/page/profile/close-account'
                },
                representative: {
                    root: 'representative',
                    link: '/page/profile/representative'
                },
                biggestCapitalContributor: {
                    root: 'biggest-capital-contributor',
                    link: '/page/profile/biggest-capital-contributor'
                },
                economicInfo: {
                    root: 'economic-info',
                    link: '/page/profile/economic-info'
                },
                legalDocuments: {
                    root: 'legal-documents',
                    link: '/page/profile/legal-documents'
                },
                financialDocuments: {
                    root: 'financial-documents',
                    link: '/page/profile/financial-documents'
                },
                businessActivity: {
                    root: 'business-activity',
                    link: '/page/profile/business-activity'
                },
            },
            notifications: {
                root: 'page/notifications',
                link: '/page/notifications',
                detail: {
                    root: 'detail',
                    link: '/page/profile/detail'
                },
            }
        },
        auth: {
            root: 'auth',
            login: 'login',
            loginLink: '/auth/login',
            register: 'register',
            registerLink: '/auth/register',
            logout: 'logout',
            forgotPassword: 'forgot-password',
            forgotPasswordLink: '/auth/forgot-password',
            verifyOTP: 'verify-otp',
            verifyOTPLink: '/auth/verify-otp',
            resetPassword: 'reset-password',
            resetPasswordLink: '/auth/reset-password',
            verifyOTPEmail: 'verify-otp-email',
            verifyForgotPassword: 'verify-otp-forgot-password'
        },
        admin: {
            root: 'admin',
            borrower: {
                root: 'borrower',
                add: 'add',
                addLink: '/admin/borrower/add',
                view: 'view',
            },
            borrowerLink: '/admin/borrower/dashboard',
            maintenance: '/maintenance',
            investor: {
                root: 'investor',
                add: 'add',
                addLink: '/admin/investor/add',
                view: 'view',
            },
            emailConfig: {
                root: 'email-config',
                add: 'add',
                addLink: '/admin/investor/add',
                link: '/admin/email-config',
            },
            investorLink: '/admin/investor',
            enterprise: {
                root: 'enterprise',
            },
            enterpriseLink: '/admin/enterprise',
            staff: {
                root: 'staff',
                link: '/admin/staff'
            },
            departments: {
                root: 'departments',
                link: '/admin/departments'
            },
            role: {
                root: 'role',
                link: '/admin/role'
            },
            category: {
                root: 'category',
                link: '/admin/category'
            },
            area: {
                root: 'area',
                link: '/admin/area'
            },
            profile: {
                root: 'profile-management',
                add: 'profile-management/add',
                link: '/admin/profile-management'
            },
            lenderRefund: {
                root: 'lender-refund',
                add: '',
                link: 'admin/lender-refund'
            },
            investorRefund: {
                root: 'investor-refund',
                add: '',
                link: 'admin/investor-refund'
            },
            permissionManagement: {
                root: 'permission-management',
                add: '',
                link: 'admin/permission-management'
            },
            accessLogs: {
                root: 'access-logs',
                link: '/admin/access-logs',
                staff: {
                    root: '',
                    link: '/admin/access-logs/'
                },
                lender: {
                    root: 'lender',
                    link: '/admin/access-logs/lender'
                },
                investor: {
                    root: 'investor',
                    link: '/admin/access-logs/investor'
                },
            },
            notificationConfig: {
                root: 'notification-config',
                link: '/admin/notification-config'
            },
            documentTemplates: {
                root: 'document-templates',
                link: 'admin/document-templates'
            },
            creditModifier: {
                root: 'credit-modifier',
                link: '/admin/credit-modifier'
            },
            processConfig: {
                root: 'process-config',
                link: '/admin/process-config'
            },
            maintenanceConfig: {
                root: 'maintenance-config',
                link: '/admin/maintenance-config'
            },
            emailTemplate: {
                root: 'email-template',
                link: '/admin/email-template'
            },
            customerAppConfig: {
                root: 'customer-app-config',
                link: '/admin/customer-app-config'
            },
            bankAccounts: {
                root: 'bank-accounts',
                link: '/admin/bank-accounts'
            },
            documentConfig: {
                root: 'document-config',
                link: '/admin/document-config'
            },
            profileLink: '/admin/profile-management',
            dashboard: 'dashboard',
            dashboardLink: '/admin/dashboard',
        },
        application: {
            root: 'application',
            profile: {
                root: 'profile-management',
                add: 'profile-management/add',
                link: '/application/profile-management'
            },
            investor: {
                root: 'investor-management',
                link: '/application/investor-management',
                add: '/application/investor-management/add',
                detail: '/application/investor-management/detail'
            },
            borrower: {
                root: 'borrower-management',
                link: '/application/borrower-management',
                add: '/application/borrower-management/add',
            },
            investorWithdraw: {
                root: 'investor-withdraw',
                add: '',
                link: '/application/investor-withdraw'
            },
            investorRefund: {
                root: 'investor-refund',
                link: '/application/investor-refund',
                draftTrans: {
                    root: '',
                    link: '/application/investor-refund'
                },
                waitProcessTransaction: {
                    root: 'wait-process-trans',
                    link: '/application/investor-refund/wait-process-trans'
                },
                processedTrans: {
                    root: 'processed-trans',
                    link: '/application/investor-refund/processed-trans'
                },
            },
            lenderRefund: {
                root: 'lender-refund',
                link: '/application/lender-refund',
                waitPayTransaction: {
                    root: '',
                    link: '/application/lender-refund'
                },
                waitProcessTransaction: {
                    root: 'wait-process-trans',
                    link: '/application/lender-refund/wait-process-trans'
                },
                waitApproveTrans: {
                    root: 'wait-approve-trans',
                    link: '/application/lender-refund/wait-approve-trans'
                },
                processedTrans: {
                    root: 'processed-trans',
                    link: '/application/lender-refund/processed-trans'
                },
                errorTrans: {
                    root: 'error-trans',
                    link: '/application/lender-refund/error-trans'
                },
                timeoutTrans: {
                    root: 'timeout-trans',
                    link: '/application/lender-refund/timeout-trans'
                }
            },
            debt: {
                root: 'debt-management',
                add: 'debt-management/add',
                link: '/application/debt-management'
            },
            investorChargeTransaction: {
                root: 'investor-charge-transaction',
                add: '',
                link: '/application/investor-charge-transaction',
                wait: '/application/investor-charge-transaction/wait'
            },
            disbursementManagement: {
                root: 'disbursement-management',
                link: '/application/disbursement-management',
                waiting: {
                    root: 'disbursement-management-wait',
                    link: '/application/disbursement-management/waiting-process-transaction'
                }
            },
            transactionFeeManagement: {
                root: 'transaction-fee-management',
                link: '/application/transaction-fee-management',
                feeLoanArrangement: {
                    root: 'fee-loan-arrangement',
                    link: '/application/transaction-fee-management/fee-loan-arrangement'
                },
                feeAccountManagement: {
                    root: 'fee-account-management',
                    link: '/application/transaction-fee-management/fee-account-management'
                },
                feeTransferTransaction: {
                    root: 'fee-transfer-transaction',
                    link: '/application/transaction-fee-management/fee-transfer-transaction'
                },
                feeInvestmentTransaction: {
                    root: 'fee-investment-transaction',
                    link: '/application/transaction-fee-management/fee-investment-transaction'
                },
                feeDepositTransaction: {
                    root: 'fee-deposit-transaction',
                    link: '/application/transaction-fee-management/fee-deposit-transaction'
                },
                feeWithdrawTransaction: {
                    root: 'fee-withdraw-transaction',
                    link: '/application/transaction-fee-management/fee-withdraw-transaction'
                },
                personalIncomeTax: {
                    root: 'personal-income-tax',
                    link: '/application/transaction-fee-management/personal-income-tax'
                },
                overdueInterest: {
                    root: 'overdue-interest',
                    link: '/application/transaction-fee-management/overdue-interest'
                }
            },
            transactionManagement: {
                commissionManagement: {
                    root: 'commission-management',
                    link: '/application/commission-management'
                },
                funding: {
                    root: 'funding',
                    link: '/application/funding',
                    detail: '/application/funding/detail'
                },
                withdrawFromHO: {
                    root: 'withdraw-from-ho',
                    link: '/application/withdraw-from-ho',
                    detail: '/application/withdraw-from-ho/detail'
                }
            },
            financeManagement: {
                commissionProcess: {
                    root: 'commission-process',
                    link: '/application/commission-process',
                    detail: '/application/commission-process/detail'
                },
                fundingProcess: {
                    root: 'funding-process',
                    link: '/application/funding-process'
                },
                transferMoneyProcess: {
                    root: 'transfer-money-process',
                    link: '/application/transfer-money-process'
                },
                withdrawFromHOProcess: {
                    root: 'withdraw-from-ho-process',
                    link: '/application/withdraw-from-ho-process'
                }
            },
            personalInfo: {
                root: 'change-id',
                link: '/application/change-id'
            }
        },
        statisticalReport: {
            root: 'statistical-report',
            reportPromotionalStatement: {
                root: 'report-promotional-statement',
                link: '/statistical-report/report-promotional-statement'
            },
            //saleInvestor
            reportAccountInvestor: {
                root: 'report-account-investor',
                link: '/statistical-report/report-account-investor'
            },
            reportNewAccount: {
                root: 'report-new-account',
                link: '/statistical-report/report-new-account'
            },
            reportInvest: {
                root: 'report-invest',
                link: '/statistical-report/report-invest'
            },
            //saleLender
            reportLender: {
                root: 'report-lender',
                link: '/statistical-report/report-lender'
            },
            reportLenderLoan: {
                root: 'report-lender-loan',
                link: '/statistical-report/report-lender-loan'
            },
            reportDebt: {
                root: 'report-debt',
                link: '/statistical-report/report-debt'
            },
            //accountant
            investorChargeReport: {
                root: 'investor-charge-report',
                link: '/statistical-report/investor-charge-report'
            },
            investorWithdrawalReport: {
                root: 'investor-withdrawal-report',
                link: '/statistical-report/investor-withdrawal-report'
            },
            businessReturnReport: {
                root: 'business-return-report',
                link: '/statistical-report/business-return-report'
            },
            reportContractTracking: {
                root: 'report-contract-tracking',
                link: '/statistical-report/report-contract-tracking'
            },
            reportServiceFee: {
                root: 'report-service-fee',
                link: '/statistical-report/report-service-fee'
            },
            reportBusinessLoan: {
                root: 'report-business-loan',
                link: '/statistical-report/report-business-loan'
            },
            reportInvestor: {
                root: 'report-investor',
                link: '/statistical-report/report-investor'
            },
            transferTransaction: {
                root: 'transfer-transaction',
                link: '/statistical-report/transfer-transaction'
            }
        },
        investor: {
            root: 'investor',
            dashboard: {
                root: 'dashboard',
                link: 'investor/dashboard'
            },
            manualInvestment: {
                root: 'manual-investment',
                detail: 'detail',
                detailLink: 'investor/maual-investment/detail',
                link: 'investor/manual-investment'
            },
            autoInvestment: {
                root: 'auto-investment',
                link: '/investor/auto-investment'
            },
            investmentTransfer: {
                root: 'investment-transfer',
                link: 'investor/investment-transfer',
                offer: {
                    root: 'offer',
                    link: 'investor/investment-transfer/offer'
                },
                sale: {
                    root: 'sale',
                    link: 'investor/investment-transfer/sale'
                }
            },
            topupInvestment: {
                root: 'topup-investment',
                link: 'investor/topup-investment'
            },
            withdraw: {
                root: 'withdraw',
                link: 'investor/withdraw'
            },
            investedProfileManagement: {
                root: 'invested-profile-management',
                link: 'investor/invested-profile-management'
            },
            kyc: {
                root: 'kyc',
                link: 'investor/kyc'
            },
            kycSuccess: {
                root: 'kyc-success',
                link: 'investor/kyc-success'
            },
            accountStatement: {
                root: 'account-statement',
                link: 'investor/account-statement'
            }
        },
        borrower: {
            root: 'borrower',
            dashboard: {
                root: 'dashboard',
                link: 'borrower/dashboard'
            },
            loan: {
                create: {
                    root: 'create-loan',
                    link: 'borrower/create-loan'
                },
                review: {
                    root: 'loan-review',
                    link: 'borrower/loan-review'
                },
                calling: {
                    root: 'loan-calling',
                    link: 'borrower/loan-calling'
                },
                archive: {
                    root: 'loan-archive',
                    link: 'borrower/loan-archive'
                }
            },
            kyc: {
                root: 'kyc',
                link: 'borrower/kyc',
            },
            kycSuccess: {
                root: 'kyc-success',
                link: 'borrower/kyc-success'
            }
        },
        staff: {
        },
        kyc: {
            parent: [
                {
                    link: '/investor',
                    pathKyc: 'kyc',
                    linkKyc: '/investor/kyc'
                },
                {
                    link: '/borrower',
                    pathKyc: 'kyc',
                    linkKyc: '/borrower/kyc',
                }
            ],
        }
    }
};
