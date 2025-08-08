import {BooleanInput} from '@angular/cdk/coercion';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input, OnChanges,
    OnDestroy,
    OnInit, SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from 'app/core/user/user.service';
import {User, UserAccountStatus} from 'app/core/user/user.types';
import {Subject, takeUntil, timeout} from 'rxjs';
import {AuthService} from "../../../core/auth/auth.service";
import {DateTimeformatPipe} from "../../../shared/components/pipe/date-time-format.pipe";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user'
})
export class UserComponent implements OnInit, OnDestroy {
    static ngAcceptInputTypeShowAvatar: BooleanInput;

    @Input() showAvatar: boolean = true;
    user: User;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public accStatus: UserAccountStatus;
    // public avatar: string | SafeResourceUrl = 'assets/images/avatars/brian-hughes.jpg';
    public avatar: string | SafeResourceUrl = '';

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _router: Router,
        private _userService: UserService,
        private _authService: AuthService,
        private _domSanitizer: DomSanitizer,
    )
    {
        this._authService.loadAvataLocal();
        this.avatar = this._authService.loadDefaultAvatar();
        this._authService.getAvata.pipe(takeUntil(this._unsubscribeAll)).subscribe(res => {
            if (res) {
                this.avatar = this._domSanitizer.bypassSecurityTrustResourceUrl(res);
                this._changeDetectorRef.markForCheck();
            } else {
                this.avatar = this._authService.loadDefaultAvatar();
                this._authService.loadAvataLocal();
            }
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to user changes
        // this._userService.user$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((user: User) => {
        //         // this.user = user;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
        this.user = this._authService.authenticatedUser;
        this.accStatus = this._authService.authenticatedUser.status;
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */
    updateUserStatus(status: string): void
    {
        // Return if user is not available
        if ( !this.user )
        {
            return;
        }

        // Update the user
        this._userService.update({
            ...this.user,
            status
        }).subscribe();
    }

    /**
     * Sign out
     */
    signOut(): void
    {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('avatar');
        localStorage.clear();
        this._router.navigate(['/sign-out']);
        window.location.reload();
        localStorage.setItem('logout-event', JSON.stringify({ key: 'logout' }));
    }

    goToProfile(): void
    {
        this._router.navigate(['page/profile']);
    }
}
