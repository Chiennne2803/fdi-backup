import { BooleanInput } from '@angular/cdk/coercion';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User, UserAccountStatus } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from "../../../core/auth/auth.service";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { getInitials } from 'app/shared/utils/utils';

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
    ) {
        // Lắng nghe sự thay đổi avatar từ AuthService
        this._authService.getAvata
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(res => {
                if (res) {
                    // Có avatar -> hiển thị ảnh
                    this.avatar = this._domSanitizer.bypassSecurityTrustResourceUrl(res);
                } else {
                    // Không có avatar -> hiển thị null / mặc định
                    this.avatar = null;
                }
                this._changeDetectorRef.markForCheck();
            });
    }

    getInitials(name: string): string {
        return getInitials(name);
    }

    ngOnInit(): void {
        this.user = this._authService.authenticatedUser;
        this.accStatus = this._authService.authenticatedUser.status;
        let avatarlocalStorage = localStorage.getItem('avatar');

        // Sau khi đăng nhập thành công, gọi API tải avatar nếu có
        if (this.user?.avatar && !avatarlocalStorage) {
            this._authService.loadAvatar(this.user.avatar); // Tải avatar vào localStorage và cập nhật avatar
        } else {
            // Nếu không có avatar, kiểm tra avatar từ localStorage
            this._authService.loadAvatarFromLocalStorage();
        }
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    updateUserStatus(status: string): void {
        if (!this.user) {
            return;
        }
        this._userService.update({
            ...this.user,
            status
        }).subscribe();
    }

    signOut(): void {
        this._authService.signOut(true).subscribe();
    }

    goToProfile(): void {
        this._router.navigate(['page/profile']);
    }
}
