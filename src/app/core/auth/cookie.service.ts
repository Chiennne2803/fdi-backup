import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CookieService {
    
    constructor() {}

    /**
     * Lấy giá trị cookie theo tên
     * @param name Tên cookie
     * @returns Giá trị cookie hoặc rỗng nếu không tìm thấy
     */
    getCookie(name: string): string {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return '';
    }

    /**
     * Lưu cookie
     * @param name Tên cookie
     * @param value Giá trị cookie
     * @param days Số ngày hết hạn (mặc định 7 ngày)
     * @param path Đường dẫn (mặc định '/')
     * @param secure Chỉ truyền qua HTTPS (mặc định true trong production)
     * @param sameSite Chính sách SameSite (mặc định 'Strict')
     */
    setCookie(
        name: string, 
        value: string, 
        days: number = 7, 
        path: string = '/',
        secure: boolean = true,
        sameSite: 'Strict' | 'Lax' | 'None' = 'Strict'
    ): void {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }

        const secureFlag = secure ? '; Secure' : '';
        const sameSiteFlag = `; SameSite=${sameSite}`;
        
        document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=${path}${secureFlag}${sameSiteFlag}`;
    }

    /**
     * Xóa cookie
     * @param name Tên cookie
     * @param path Đường dẫn (mặc định '/')
     */
    deleteCookie(name: string, path: string = '/'): void {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    }

    /**
     * Kiểm tra cookie có tồn tại không
     * @param name Tên cookie
     * @returns true nếu cookie tồn tại
     */
    hasCookie(name: string): boolean {
        return this.getCookie(name) !== '';
    }

    /**
     * Xóa tất cả cookies
     */
    deleteAllCookies(): void {
        const cookies = document.cookie.split(';');
        
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            this.deleteCookie(name.trim());
        }
    }
}

