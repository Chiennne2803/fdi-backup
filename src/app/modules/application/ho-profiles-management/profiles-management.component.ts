import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { FuseNavigationItem, } from '../../../../@fuse/components/navigation';
import { ROUTER_CONST } from '../../../shared/constants';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from "@angular/router";
import { Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';

@Component({
    selector: 'profiles-management',
    templateUrl: './profiles-management.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ProfilesManagementComponent implements OnInit, OnDestroy {
    @ViewChild('sidebarDrawer', { static: true }) sidebarDrawer: MatDrawer;
    menuData: FuseNavigationItem[];
    reception: FuseNavigationItem;
    review: FuseNavigationItem;
    reReview: FuseNavigationItem;
    store: FuseNavigationItem;
    drawerOpened: boolean;
    drawerMode: 'side' | 'over';
    private _unsubscribeAll: Subject<any> = new Subject<any>();



    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private router: Router
    ) {
        this.menuData = [
            {
                title: 'Quản lý hồ sơ',
                type: 'group',
                children: []
            },
        ];
        /*this.reception = {
            title: 'Hồ sơ tiếp nhận',
            type: 'basic',
            link: `${ROUTER_CONST.config.application.profile.link}/`,
            exactMatch: true,
        };*/

        this.reception = {
            title: 'Hồ sơ tiếp nhận',
            type: 'collapsable',
            link: `${ROUTER_CONST.config.application.profile.link}/`,
            children: [
                {
                    title: 'Hồ sơ tiếp nhận TP Kinh doanh',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/tpkd`,
                    hidden: () => !this.hasPermission('SFF_PROFILE_RECEIPT_SALE_MANAGER,SFF_PROFILE_RECEIPT_BUSINESS_SALE'),

                },
                {
                    title: 'Hồ sơ tiếp nhận TP Thẩm định',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/tptd`,
                    hidden: () => !this.hasPermission('SFF_PROFILE_RECEIPT_HEAD_OF_APPRAISAL,SFF_PROFILE_RECEIPT_APPRAISAL_STAFF')
                }
            ]
        };

        this.review = {
            title: 'Hồ sơ rà soát',
            type: 'collapsable',
            link: `${ROUTER_CONST.config.application.profile.link}/review`,
            children: [
                {
                    title: 'Hồ sơ rà soát NV Kinh doanh',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/review/nvkd`,
                    hidden: () => !this.hasPermission('SFF_PROFILE_REVIEW_BUSINESS_SALE')
                },
                {
                    title: 'Hồ sơ rà soát NV Thẩm định',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/review/nvtd`,
                    hidden: () => !this.hasPermission('SFF_PROFILE_REVIEW_APPRAISAL_STAFF')
                },
                {
                    title: 'Hồ sơ rà soát TP Thẩm định',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/review/tptd`,
                    hidden: () => !this.hasPermission('SFF_PROFILE_RECEIPT_HEAD_OF_APPRAISAL')
                },
                {
                    title: 'Hồ sơ rà soát CEO',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/review/ceo`,
                    hidden: () => !this.hasPermission('SFF_PROFILE_REVIEW_CEO')
                },
                {
                    title: 'Hồ sơ rà soát Hội đồng tín dụng',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/review/hdtd`,
                    hidden: () => !this.hasPermission('SFF_PROFILE_REVIEW_CREDIT_COMMITTEE')
                }
            ]
        };

        this.reReview = {
            title: 'Hồ sơ rà soát lại',
            type: 'collapsable',
            link: `${ROUTER_CONST.config.application.profile.link}/re-review`,
            children: [
                {
                    title: 'Hồ sơ rà soát lại NV Kinh doanh',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/re-review/nvkd`,
                    hidden: () => !this.hasPermission('SFF_PROFILE_RE_REVIEW_BUSINESS_SALE')
                },
                {
                    title: 'Hồ sơ rà soát lại NV Thẩm định',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/re-review/nvtd`,
                    hidden: () => !this.hasPermission('SFF_PROFILE_RE_REVIEW_APPRAISAL_STAFF')
                },
                {
                    title: 'Hồ sơ rà soát lại TP Thẩm định',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/re-review/tptd`,
                    hidden: () => !this.hasPermission('SFF_PROFILE_RE_REVIEW_HEAD_OF_APPRAISAL')
                }
            ]
        };
        this.store = {
            title: 'Hồ sơ lưu trữ',
            type: 'collapsable',
            link: `${ROUTER_CONST.config.application.profile.link}/archive`,
            children: [
                {
                    title: 'Hồ sơ đã phê duyệt',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/archive/approve`,
                },
                {
                    title: 'Hồ sơ bị từ chối',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/archive/reject`,
                },
                {
                    title: 'Hồ sơ chờ giải ngân',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/archive/disbursement`,
                },
                {
                    title: 'Hồ sơ chờ tất toán khoản vay',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/archive/wait-payment`,
                },
                {
                    title: 'Hồ sơ đã đóng',
                    type: 'basic',
                    link: `${ROUTER_CONST.config.application.profile.link}/archive/archive`,
                },
            ]
        };
        this.menuData.forEach((menu) => {
            if (this.hasPermission('SFF_PROFILE_RECEIPT_SALE_MANAGER,SFF_PROFILE_RECEIPT_HEAD_OF_APPRAISAL,SFF_PROFILE_RECEIPT_BUSINESS_SALE,SFF_PROFILE_RECEIPT_APPRAISAL_STAFF')) {
                menu.children.push(this.reception);
            }
            if (this.hasPermission(
                'SFF_PROFILE_REVIEW_BUSINESS_SALE,' +
                'SFF_PROFILE_REVIEW_APPRAISAL_STAFF,' +
                'SFF_PROFILE_REVIEW_HEAD_OF_APPRAISAL,' +
                'SFF_PROFILE_REVIEW_CEO,' +
                'SFF_PROFILE_REVIEW_CREDIT_COMMITTEE')) {
                menu.children.push(this.review);
            }
            if (this.hasPermission('SFF_PROFILE_RE_REVIEW_BUSINESS_SALE,' +
                'SFF_PROFILE_RE_REVIEW_APPRAISAL_STAFF,' +
                'SFF_PROFILE_RE_REVIEW_HEAD_OF_APPRAISAL')) {
                menu.children.push(this.reReview);
            }
            if (this.hasPermission('SFF_PROFILE_STORE')) {
                menu.children.push(this.store);
            }
        });
    }

    public hasPermission(permission: string): boolean {
        if (permission === '' || permission === 'ALL') {
            return true;
        }
        let _p = false;
        permission.split(',').forEach((item: string) => {
            const strCheck = item + '_VIEW';
            if (this._authService.authenticatedUser.roles.includes(strCheck)) {
                _p = true;
                return;
            }
        });
        return _p;
    }

    ngOnInit(): void {
        // Subscribe to media query change
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Set the drawerMode and drawerOpened
                if (matchingAliases.includes('md')) {
                    this.drawerMode = 'side';
                    this.drawerOpened = true;
                }
                else {
                    this.drawerMode = 'over';
                    this.drawerOpened = false;
                }
            });
    }
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    onClick($event: MouseEvent) {
        this.menuData.forEach((menu) => {
            if (menu.children) {
                menu.children.forEach((children) => {
                    children.active = this.router.url.endsWith(children.link)
                });
            }
        });
    }
}
