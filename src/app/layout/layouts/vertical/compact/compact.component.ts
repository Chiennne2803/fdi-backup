import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { FuseAlertService } from "../../../../../@fuse/components/alert";
import { FuseUtilsService } from "../../../../../@fuse/services/utils";
import { AdmAccountType, User } from "../../../../core/user/user.types";
import { UserService } from "../../../../core/user/user.service";
import { AuthService } from "../../../../core/auth/auth.service";
import { AlertDTO } from '../../../../models/base/alert';

@Component({
    selector: 'compact-layout',
    templateUrl: './compact.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CompactLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean = false;
    navigation: Navigation;
    userInfo: User;
    // showMenu = true;
    // hiddenRoutes = ['/investor/kyc', '/borrower/kyc'];
    public isShowHeader = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public mainMenu: FuseNavigationItem[];
    public lstNotify: Array<AlertDTO>;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseAlertService: FuseAlertService,
        private _fuseUtilsService: FuseUtilsService,
        private _userService: UserService,
        private _authService: AuthService,
    ) {
        this._fuseAlertService.lstNotify.subscribe(res => this.lstNotify = res);
        // this._router.events.pipe(
        //     filter(event => event instanceof NavigationEnd)
        // ).subscribe((event: NavigationEnd) => {
        //     console.log(event.urlAfterRedirects, event)
        //     this.showMenu = !this.hiddenRoutes.includes(event.urlAfterRedirects);
        // });
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
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
