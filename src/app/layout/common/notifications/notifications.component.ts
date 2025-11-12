import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatButton } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';
import { NotificationsService } from 'app/service/common-service/notifications.service';
import { SpNotificationDTO } from "../../../models/service/SpNotificationDTO.model";
import { fuseAnimations } from "../../../../@fuse/animations";
import { Router } from '@angular/router';
import { ROUTER_CONST } from 'app/shared/constants';
import { FirebaseNotificationService } from 'app/service/common-service/firebase-notification.service';
import { User } from 'app/core/user/user.types';
import { DialogService } from 'app/service/common-service/dialog.service';
import { AuthService } from 'app/core/auth/auth.service';
import { COMMON_NOTIFICATION_TYPES } from './notification-types.constant';

@Component({
    selector: 'notifications',
    templateUrl: './notifications.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'notifications',
    animations: fuseAnimations,
})

export class NotificationsComponent implements OnInit, OnDestroy {
    @ViewChild('notificationsOrigin') private _notificationsOrigin: MatButton;
    @ViewChild('notificationsPanel') private _notificationsPanel: TemplateRef<any>;

    notifications: SpNotificationDTO[];
    alerts: any[] = [];
    unreadCount: number = 0;
    private _overlayRef: OverlayRef;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: User;


    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _notificationsService: NotificationsService,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _router: Router,
        private fcmService: FirebaseNotificationService,
        private _dialogService: DialogService,
        private _authService: AuthService,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    async ngOnInit(): Promise<void> {
        try {
            this._listenToFcmMessages();
            this._listenToNotifications();
        } catch (error) {
            console.error('❌ Lỗi trong ngOnInit NotificationsComponent:', error);
        }
    }

    /** 🧩 Lắng nghe thông báo realtime từ Firebase Cloud Messaging */
    private _listenToFcmMessages(): void {
        this.fcmService.message$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((payload: any) => {
                const data = payload?.data || payload?.payload?.data || {};
                const notification = payload?.notification || payload?.payload?.notification || {};

                console.log(data.type)
                if (COMMON_NOTIFICATION_TYPES.includes(data.type)) {
                    this._handleCommonNotification(data, notification);
                }

                if (data.type === 'WARNING_OTHER_DEVICE') {
                    this._handleOtherDeviceWarning(data, notification);
                }
            });
    }

    /** 🧩 Lắng nghe danh sách thông báo từ API (hoặc local state) */
    private _listenToNotifications(): void {
        this._notificationsService.notifications$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((notifications: SpNotificationDTO[]) => {
                this.notifications = notifications;
                this._calculateUnreadCount();
                this._changeDetectorRef.markForCheck();
            });
    }

    /** 🔔 Xử lý các loại thông báo chung (COMMON_NOTIFICATION_TYPES) */
    private _handleCommonNotification(data: any, notification: any): void {
        const title = notification?.title || 'Thông báo mới';
        const body = this.truncateText(notification?.body || '', 100);
        const spNotificationId = data?.extra || null;
        const createdDate = data?.time ? new Date(data.time.replace(' ', 'T')) : null;

        const messageObj = { title, body, spNotificationId, createdDate };

        // Hiển thị toast / banner
        this.showAlert(title, body);

        // Cập nhật danh sách local
        this.notifications.unshift(messageObj);
        this._calculateUnreadCount();
        this._changeDetectorRef.markForCheck();
    }

    /** ⚠️ Cảnh báo đăng nhập từ thiết bị khác */
    private _handleOtherDeviceWarning(data: any, notification: any): void {
        const title = notification?.title || 'Cảnh báo đăng nhập mới';
        const body = notification?.body || 'Tài khoản của bạn vừa được đăng nhập từ thiết bị khác.';

        const message = `
            <p><strong>Tài khoản:</strong> ${data.account}</p>
            <p><strong>Thời gian:</strong> ${data.time}</p>
            <p><strong>Địa chỉ IP:</strong> ${data.ip}</p>
            <p><strong>Thiết bị:</strong> ${data.device}</p>
        `;

        const dialogRef = this._dialogService.openConfirmSginDialog(message, title);
        dialogRef.afterClosed().subscribe(() => {
            // this._authService.signOut(false).subscribe();
        });
    }



    truncateText(text: string, maxLength: number): string {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
    }
    showAlert(title: string, message: string): void {
        const id = Date.now();
        this.alerts.push({ id, title, message, type: 'info' });
        this._changeDetectorRef.markForCheck();

        setTimeout(() => {
            this.alerts = this.alerts.filter(alert => alert.id !== id);
            this._changeDetectorRef.markForCheck();
        }, 4000);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlay
        if (this._overlayRef) {
            this._overlayRef.dispose();
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Open the notifications panel
     */
    openPanel(): void {
        // Return if the notifications panel or its origin is not defined
        if (!this._notificationsPanel || !this._notificationsOrigin) {
            return;
        }

        // Create the overlay if it doesn't exist
        if (!this._overlayRef) {
            this._createOverlay();
        }

        // Attach the portal to the overlay
        this._overlayRef.attach(new TemplatePortal(this._notificationsPanel, this._viewContainerRef));
    }

    /**
     * Close the notifications panel
     */
    closePanel(): void {
        this._overlayRef.detach();
    }

    /**
     * Mark all notifications as read
     */
    public idx = 0;
    markAllAsRead(): void {        // Mark all as read
        this._notificationsService.markAllAsRead().subscribe(res => {
            this.idx = 0;
            let time = 1000;
            this.notifications.forEach((noti) => {
                time = (time > 500) ? time - 100 : time;
                setTimeout(() => {
                    noti.hide = true;
                }, time);
            })
            setTimeout(() => {
                this._notificationsService.searchNotRead().subscribe();
            }, 1000);

        });
    }

    markAllView(): void {
        this._router.navigate([`/${ROUTER_CONST.config.common.notifications.root}`]);
    }

    /**
     * Toggle read status of the given notification
     */
    toggleRead(notification: SpNotificationDTO): void {
        // Toggle the read status
        notification.isRead = !notification.isRead;

        // Update the notification
        this._notificationsService.update(notification).subscribe();
    }


    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create the overlay
     */
    private _createOverlay(): void {
        // Create the overlay
        this._overlayRef = this._overlay.create({
            hasBackdrop: true,
            backdropClass: 'fuse-backdrop-on-mobile',
            scrollStrategy: this._overlay.scrollStrategies.block(),
            positionStrategy: this._overlay.position()
                .flexibleConnectedTo(this._notificationsOrigin._elementRef.nativeElement)
                .withLockedPosition(true)
                .withPush(true)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top'
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom'
                    },
                    {
                        originX: 'end',
                        originY: 'bottom',
                        overlayX: 'end',
                        overlayY: 'top'
                    },
                    {
                        originX: 'end',
                        originY: 'top',
                        overlayX: 'end',
                        overlayY: 'bottom'
                    }
                ])
        });

        // Detach the overlay from the portal on backdrop click
        this._overlayRef.backdropClick().subscribe(() => {
            this._overlayRef.detach();
        });
    }

    /**
     * Calculate the unread count
     *
     * @private
     */
    private _calculateUnreadCount(): void {
        let count = 0;

        if (this.notifications && this.notifications.length) {
            count = this.notifications.filter(notification => !notification.isRead).length;
        }

        this.unreadCount = count;
    }
}
