import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseNavigationItem } from '../../../../@fuse/components/navigation';
import { AuthService } from '../../../core/auth/auth.service';
import { AdmAccountType } from '../../../core/user/user.types';
import { ROUTER_CONST } from '../../../shared/constants';
import { UserType } from '../../../models/admin';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class EnterpriseComponent implements OnInit {
    menuData: FuseNavigationItem[];


    constructor(
        public authService: AuthService,
    ) {
        switch (this.authService?.authenticatedUser.accountType) {
            case AdmAccountType.ADMIN:
                this.menuData = [
                    {
                        type: 'group',
                        children: [
                            {
                                title: 'Quản lí tài khoản',
                                type: 'basic',
                                link: ROUTER_CONST.config.common.profile.link,
                                exactMatch: true,
                            },
                        ]
                    },
                ];
                break;
            case AdmAccountType.INVESTOR:
                switch (this.authService.authenticatedUser.type) {
                    case UserType.COMPANY:
                        this.menuData = [
                            {
                                type: 'group',
                                title: "Hồ sơ của tôi",
                                children: [
                                    {
                                        title: 'Quản lí tài khoản',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.link,
                                        exactMatch: true,
                                    },
                                    {
                                        title: 'Thông tin chi tiết',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.detailCompany.link,
                                    },
                                    {
                                        title: 'Thông tin người đại diện',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.representative.link,
                                    }
                                    // ,
                                    // {
                                    //     title: 'Đóng tài khoản',
                                    //     type: 'basic',
                                    //     link: ROUTER_CONST.config.common.profile.closeAccount.link,
                                    // }
                                ]
                            },
                        ];
                        break;
                    case UserType.INDIVIDUAL:
                        this.menuData = [
                            {
                                type: 'group',
                                title: "Hồ sơ của tôi",

                                children: [
                                    {
                                        title: 'Quản lí tài khoản',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.link,
                                        exactMatch: true,
                                    },
                                    {
                                        title: 'Thông tin chi tiết',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.detail.link,
                                    }
                                    // ,
                                    // {
                                    //     title: 'Đóng tài khoản',
                                    //     type: 'basic',
                                    //     link: ROUTER_CONST.config.common.profile.closeAccount.link,
                                    // }
                                ]
                            },
                        ];
                        break;
                }
                break;
            case AdmAccountType.BORROWER:
                switch (this.authService.authenticatedUser.type) {
                    case UserType.COMPANY:
                        this.menuData = [
                            {
                                type: 'group',
                                title: "Hồ sơ của tôi",
                                children: [
                                    {   
                                        title: 'Quản lí tài khoản',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.link,
                                        exactMatch: true,
                                    },
                                    {
                                        title: 'Thông tin chi tiết',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.detailCompany.link,
                                    },
                                    {
                                        title: 'Thông tin người đại diện',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.representative.link,
                                    },
                                    {
                                        title: 'Người góp vốn lớn nhất',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.biggestCapitalContributor.link,
                                    },
                                    {
                                        title: 'Báo cáo tài chính chi tiết',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.economicInfo.link,
                                    },
                                    {
                                        title: 'Hồ sơ pháp lý',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.legalDocuments.link,
                                    },
                                    {
                                        title: 'Hồ sơ tài chính',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.financialDocuments.link,
                                    },
                                    {
                                        title: 'Tài liệu hoạt động kinh doanh',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.businessActivity.link,
                                    },
                                ]
                            },
                        ];
                        break;
                    case UserType.INDIVIDUAL:
                        this.menuData = [
                            {
                                type: 'group',
                                title: "Hồ sơ của tôi",
                                children: [
                                    {
                                        title: 'Quản lí tài khoản',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.link,
                                        exactMatch: true,
                                    },
                                    {
                                        title: 'Thông tin chi tiết',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.detail.link,
                                    },
                                    {
                                        title: 'Thông tin người liên hệ',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.contactInfo.link,
                                    },
                                    {
                                        title: 'Hợp đồng lao động',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.laborContract.link,
                                    },
                                    {
                                        title: 'Hợp đồng cho thuê tài sản',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.rentalContract.link,
                                    },
                                    {
                                        title: 'Giấy chứng minh thu nhập khác',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.otherIncome.link,
                                    },
                                    {
                                        title: 'Giấy tờ có giá trị khác',
                                        type: 'basic',
                                        link: ROUTER_CONST.config.common.profile.otherValuablePaper.link,
                                    },
                                ]
                            },
                        ];
                        break;
                }
                break;
        }
        this.checkScreenSize();

    }
    isMobile = false;

    @HostListener('window:resize', [])
    onResize() {
        this.checkScreenSize();
    }

    private checkScreenSize() {
        this.isMobile = window.innerWidth < 1024; // < 1024px thì coi là mobile/tablet
    }


    ngOnInit(): void {
        // this._profileService.titlePage$.subscribe(t => this.titlePage = t);
    }


}
