import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private readonly cookieName = 'X-Device-ID';

  constructor() {}

  /**
   * Lấy Device ID của thiết bị hiện tại.
   * Nếu chưa có, tự tạo mới và lưu cookie vĩnh viễn.
   */
  getDeviceId(): string {
    // Kiểm tra cookie hiện có
    const match = document.cookie.match(
      new RegExp('(?:^|; )' + this.cookieName + '=([^;]*)')
    );

    if (match) {
      return decodeURIComponent(match[1]);
    }

    // Tạo mới nếu chưa có
    const deviceId =
      window.crypto && 'randomUUID' in window.crypto
        ? crypto.randomUUID()
        : this.generateUUID();

    // Lưu cookie — path=/ để toàn site dùng được, max-age ~100 năm
    const maxAge = 60 * 60 * 24 * 365 * 100; // 100 năm
    document.cookie = `${this.cookieName}=${encodeURIComponent(
      deviceId
    )}; path=/; max-age=${maxAge}; SameSite=Lax`;

    return deviceId;
  }

  /**
   * Fallback nếu trình duyệt không hỗ trợ crypto.randomUUID()
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Xoá cookie device ID nếu cần (hiếm khi dùng)
   */
  clearDeviceId(): void {
    document.cookie = `${this.cookieName}=; path=/; max-age=0`;
  }
}
