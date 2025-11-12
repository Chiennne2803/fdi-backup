import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subject, Subscription } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { FuseAlertService } from "../../../../../@fuse/components/alert";
import { AdmAccountType, User } from "../../../../core/user/user.types";
import { AuthService } from "../../../../core/auth/auth.service";
import { AlertDTO } from '../../../../models/base/alert';
import { MaintenanceService } from 'app/service';

@Component({
    selector: 'compact-layout',
    templateUrl: './compact.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CompactLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean = false;
    navigation: Navigation;
    userInfo: User | null = null;
    maintenanceMessage: string | null = null;
    maintenanceTime: string | null = null;
    public isShowHeader = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public mainMenu: FuseNavigationItem[];
    public lstNotify: Array<AlertDTO>;
    remindTimes = [30, 20, 10, 5];
    reminded: number[] = [];
    checkInterval: Subscription | null = null;

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseAlertService: FuseAlertService,
        private _authService: AuthService,
        private maintenanceService: MaintenanceService,
        private _changeDetectorRef: ChangeDetectorRef

    ) {
        this._fuseAlertService.lstNotify.subscribe(res => this.lstNotify = res);
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    get navigationByRole(): FuseNavigationItem[] {
        if (this._authService.authenticatedUser) {
            switch (this._authService.authenticatedUser.accountType) {
                case AdmAccountType.ADMIN:
                    this.navigation.compact.forEach((parentMenu: FuseNavigationItem) => {
                        parentMenu.active = false;
                        let isChildrenHiddenAll = true;
                        if (parentMenu.children && parentMenu.children.length > 0) {
                            parentMenu.children.forEach((childrenMenu: FuseNavigationItem) => {

                                let isChildren2HiddenAll = true;

                                if (childrenMenu.children && childrenMenu.children.length > 0) {
                                    // ----
                                    childrenMenu.children.forEach((childrenMenu2: FuseNavigationItem) => {
                                        if (this._router.url.endsWith(childrenMenu2.link)) {
                                            childrenMenu.active = true;
                                        }
                                        if (!this.hasPermission(childrenMenu2.code)) {
                                            childrenMenu2.disabled = true;
                                            childrenMenu2.hidden = () => true;
                                        } else {
                                            childrenMenu2.disabled = false;
                                            childrenMenu2.hidden = () => false;
                                            isChildren2HiddenAll = false;
                                            isChildrenHiddenAll = false;
                                        }
                                    });
                                    if (isChildren2HiddenAll) {
                                        childrenMenu.hidden = () => true;
                                    }
                                    // ----
                                } else {
                                    if (this._router.url.endsWith(childrenMenu.link)) {
                                        parentMenu.active = true;
                                    }
                                    if (!this.hasPermission(childrenMenu.code)) {
                                        childrenMenu.disabled = true;
                                        childrenMenu.hidden = () => true;
                                    } else {
                                        childrenMenu.disabled = false;
                                        childrenMenu.hidden = () => false;
                                        isChildrenHiddenAll = false;
                                    }
                                }
                            });

                            if (isChildrenHiddenAll) {
                                parentMenu.hidden = () => true;
                            }
                        }
                    });
                    return this.navigation.compact;
                case AdmAccountType.INVESTOR:
                    this.navigation.horizontalInvestor.forEach((parentMenu: FuseNavigationItem) => {
                        this.validateMenuRole(parentMenu);
                    });
                    return this.navigation.horizontalInvestor;
                case AdmAccountType.BORROWER:
                    this.navigation.horizontalBorrower.forEach((parentMenu: FuseNavigationItem) => {
                        this.validateMenuRole(parentMenu);
                    });
                    return this.navigation.horizontalBorrower;
            }
        }
        // console.log(this.navigation.compact)
        return this.navigation.compact;
    }

    validateMenuRole(parentMenu: FuseNavigationItem) {
        if (parentMenu.children && parentMenu.children.length > 0) {
            parentMenu.children.forEach((childrenMenu: FuseNavigationItem) => {
                if (childrenMenu.children && childrenMenu.children.length > 0) {
                    // ----
                    childrenMenu.children.forEach((childrenMenu2: FuseNavigationItem) => {
                        if (this._router.url.endsWith(childrenMenu2.link)) {
                            childrenMenu.active = true;
                        }
                        if (!this.hasPermission(childrenMenu2.code)) {
                            childrenMenu2.disabled = true;
                            childrenMenu2.hidden = () => true;
                        } else {
                            childrenMenu2.disabled = false;
                            childrenMenu2.hidden = () => false;
                        }
                    });
                    // ----
                } else {
                    if (this._router.url.endsWith(childrenMenu.link)) {
                        parentMenu.active = true;
                    }
                    if (!this.hasPermission(childrenMenu.code)) {
                        childrenMenu.disabled = true;
                        childrenMenu.hidden = () => true;
                    } else {
                        childrenMenu.disabled = false;
                        childrenMenu.hidden = () => false;
                    }
                }
            });
        } else {
            if (!this.hasPermission(parentMenu.code)) {
                parentMenu.disabled = true;
                parentMenu.hidden = () => true;
            } else {
                parentMenu.disabled = false;
                parentMenu.hidden = () => false;
            }
        }
    }

    public hasPermission(permission: string): boolean {
        if (permission === '' || permission === 'ALL') { return true; }
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
    private formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe()
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });


        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe()
            .subscribe(({ matchingAliases }) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

        this._authService.isAuthenticated.subscribe(res => {
            if (res) {
                this.isShowHeader = !!this._authService.authenticatedUser;
                this.userInfo = this._authService.authenticatedUser;
                this.mainMenu = this.navigationByRole;
            } else {
                if (this._authService.authenticatedUser) {
                    this.isShowHeader = !!this._authService.authenticatedUser;
                    this.userInfo = this._authService.authenticatedUser;
                    this.mainMenu = this.navigationByRole;
                }
            }
        })

        // const dismissed = localStorage.getItem('maintenanceDismissed');
        // if (!dismissed) {
        //     this.maintenanceService.getMaintenance(true).subscribe((res) => {
        //         if (res && res.status && res.status === 1) {
        //             const now = new Date().getTime();
        //             const start = new Date(res.startTime).getTime();
        //             const diffHours = (start - now) / (1000 * 60 * 60);

        //             if (diffHours <= 24 && diffHours > 0) {
        //                 this.maintenanceMessage = res.message;
        //                 // Hiển thị khung thời gian
        //                 const startStr = this.formatDate(res.startTime);
        //                 const endStr = this.formatDate(res.endTime);
        //                 this.maintenanceTime = `<b>${startStr} - ${endStr}</b>`;
        //                 // Kiểm tra ngay lập tức
        //                 this.checkRemind(res.startTime);
        //                 // Kiểm tra mỗi phút
        //                 this.checkInterval = interval(60 * 1000).subscribe(() => {
        //                     this.checkRemind(res.startTime);
        //                 });
        //             }
        //         }
        //     });
        // }
    }

    checkRemind(startTime: string): void {
        const now = new Date().getTime();
        const start = new Date(startTime).getTime();
        const diffMinutes = Math.floor((start - now) / (1000 * 60));

        // Hết thời gian
        if (diffMinutes <= 0) {
            this.clearRemind();
            return;
        }

        // Nếu trùng mốc và chưa nhắc
        if (this.remindTimes.includes(diffMinutes) && !this.reminded.includes(diffMinutes)) {
            this.reminded.push(diffMinutes);
            this.maintenanceTime = `Hệ thống sẽ bảo trì sau <b>${diffMinutes} phút</b>.`;
            this._changeDetectorRef.markForCheck();

            // Tự ẩn sau 10 giây
            setTimeout(() => {
                this.maintenanceTime = null;
                this._changeDetectorRef.markForCheck();
            }, 10000);
        }

        // 🟢 Hiển thị thời gian đếm ngược từng phút còn lại
        // if (diffMinutes <= Math.max(...this.remindTimes) && diffMinutes > 0) {
        //     this.maintenanceTime = `Hệ thống sẽ bảo trì sau <b>${diffMinutes} phút</b>.`;
        //     this._changeDetectorRef.markForCheck();
        // }
    }

    onCloseAlert(): void {
        this.maintenanceMessage = null;
        localStorage.setItem('maintenanceDismissed', 'true');
        this.clearRemind();
    }

    clearRemind(): void {
        if (this.checkInterval) {
            this.checkInterval.unsubscribe();
            this.checkInterval = null;
        }
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
        this.clearRemind();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
