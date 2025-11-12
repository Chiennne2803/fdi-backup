import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { BaseService } from '../base-service';
import { FuseAlertService } from '@fuse/components/alert';
import { initializeApp } from 'firebase/app';
import { environment } from 'environments/environment';
import { getMessaging, getToken, isSupported, onMessage } from 'firebase/messaging';
import { DeviceService } from 'app/core/auth/device.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseNotificationService extends BaseService {
  private messaging: any;
  public message$ = new Subject<any>();
  private supported = false;
  private vapidKey =
    'BN_lTshNeWNL2uenNgGs9sHTB4XzlajcL4pHtQp4vJWvQeJh2hDZDbJrzgnF8TObuFu5s1ZBt8nPgzb7lFd3VR0';

  constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService, private deviceService: DeviceService) {
    super(httpClient, _fuseAlertService, '', 'vsa/service', true);

    const app = initializeApp(environment.firebaseConfig);
    this.messaging = getMessaging(app);
    // // ✅ Kiểm tra xem trình duyệt có hỗ trợ FCM không
    isSupported().then((supported) => {
      this.supported = supported;
      if (supported) {
        this.messaging = getMessaging(app);
        this.listenToMessages();
        this.listenServiceWorkerMessages();
        // console.log('✅ Firebase Messaging initialized');
      } else {
        // console.warn('⚠️ FCM không được hỗ trợ (HTTP hoặc trình duyệt không hỗ trợ).');
      }
    });
  }

  // 🔹 Lắng nghe tin nhắn từ Service Worker (Background)
  private listenServiceWorkerMessages(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const data = event.data;
        // console.log('📬 [SW→Window] message:', event.data);

        if (data?.type === 'FCM_BACKGROUND') {
          this.message$.next({
            data: data.data,
            notification: data.notification
          });
        }
      });
    }
  }

  // 🔹 Lắng nghe tin nhắn Foreground
  private listenToMessages(): void {
    onMessage(this.messaging, (payload) => {
      console.log('📨 Firebase message received (foreground):', payload);
      this.message$.next(payload);
    });
  }
  async ensureServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      // console.warn('⚠️ Trình duyệt không hỗ trợ Service Worker');
      return null;
    }

    // Hủy đăng ký cũ nếu có lỗi
    const existing = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
    if (existing) {
      try {
        await existing.update(); // cập nhật bản mới
        return existing;
      } catch (e) {
        console.warn('⚠️ Lỗi SW cũ, unregister...');
        await existing.unregister();
      }
    }

    // Đăng ký mới
    return navigator.serviceWorker.register('/firebase-messaging-sw.js');
  }



  async getFcmToken(): Promise<string | null> {
    try {
      if (!('Notification' in window) || !('serviceWorker' in navigator)) {
        // console.warn('⚠️ Trình duyệt không hỗ trợ thông báo hoặc service worker');
        return null;
      }

      if (Notification.permission === 'denied') {
        // console.warn('⚠️ Người dùng đã chặn thông báo');
        return null;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        // console.warn('⚠️ Người dùng chưa cho phép thông báo');
        return null;
      }

      const registration = await this.ensureServiceWorker();
      // console.log('🧩 Service Worker sẵn sàng:', registration);

      const token = await getToken(this.messaging, {

        vapidKey: this.vapidKey,
        serviceWorkerRegistration: registration,
      });

      // console.log('✅ FCM token:', token);
      return token;
    } catch (error: any) {
      // console.error('❌ Lỗi lấy FCM Token:', error);
      if (error.code === 'messaging/permission-blocked') {
        // console.warn('🚫 Người dùng đã chặn quyền thông báo.');
      }
      return null;
    }
  }



  saveFcmToken(token: string): Observable<any> {
    const body = token ? { fcmToken: token } : {};
    return this.doPost('account/fcm', body);
  }

}
