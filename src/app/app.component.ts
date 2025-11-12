import { Component, OnInit } from '@angular/core';
import { TitleService } from './core/title/title.service';
import { FirebaseNotificationService } from './service/common-service/firebase-notification.service';
import { AuthService } from './core/auth/auth.service';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    constructor(
        private _titleService: TitleService,
        private fcmService: FirebaseNotificationService,
        private _authService: AuthService
    ) {
        this._titleService.init();
    }

    ngOnInit() {
        if (this._authService.authenticatedUser) {
            this.handleFcmSave();
        }

        this._authService.userChanged$
            .pipe(
                filter(user => !!user),
                distinctUntilChanged((a, b) => a?.id === b?.id),
                take(1)
            )
            .subscribe(() => {
                this.handleFcmSave();
            });
    }


    private async handleFcmSave() {
        const fcmToken = await this.fcmService.getFcmToken();
        this.fcmService.saveFcmToken(fcmToken).subscribe({
            next: (res) => console.log('✅ Lưu FCM & device thành công:', res),
            error: (err) => console.error('❌ Lỗi khi lưu FCM & device:', err),
        });
    }
}
