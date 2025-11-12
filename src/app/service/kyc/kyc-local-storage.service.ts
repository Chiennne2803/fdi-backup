import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KycLocalStorageService {
  /** 🔒 Dùng tên key được mã hóa để ẩn khỏi DevTools */
  private readonly STORAGE_KEY = this.generateEncryptedKey('kyc_form_data');
  private readonly SECRET_KEY = environment.encryptionKey;

  constructor() { }

  // --------------------------------------------------------
  // Sinh key mã hóa ngẫu nhiên từ chuỗi gốc
  // --------------------------------------------------------
  private generateEncryptedKey(base: string): string {
    const hash = CryptoJS.SHA256(base + this.SECRET_KEY).toString(CryptoJS.enc.Hex);
    // cắt ngắn cho đẹp, nhưng vẫn khó đoán
    return hash.substring(0, 24);
  }

  // --------------------------------------------------------
  // Mã hóa dữ liệu (3 lớp AES)
  // --------------------------------------------------------
  private encrypt(data: any): string {
    try {
      let json = JSON.stringify(data);
      // Mã hóa 3 lần
      for (let i = 0; i < 3; i++) {
        json = CryptoJS.AES.encrypt(json, this.SECRET_KEY).toString();
      }
      return json;
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  }

  // --------------------------------------------------------
  // Giải mã dữ liệu (3 lớp AES ngược lại)
  // --------------------------------------------------------
  private decrypt(cipherText: string): any {
    try {
      let decrypted = cipherText;
      for (let i = 0; i < 3; i++) {
        const bytes = CryptoJS.AES.decrypt(decrypted, this.SECRET_KEY);
        decrypted = bytes.toString(CryptoJS.enc.Utf8);
      }
      // console.log("get", JSON.parse(decrypted))
      return decrypted ? JSON.parse(decrypted) : {};
    } catch (error) {
      console.error('Decryption error:', error);
      return {};
    }
  }

  // --------------------------------------------------------
  // Xử lý sessionStorage
  // --------------------------------------------------------
  private getStorage(): any {
    const data = sessionStorage.getItem(this.STORAGE_KEY);
    if (!data) return {};
    return this.decrypt(data);
  }

  private saveStorage(data: any): void {
    // console.log("Luu", data)
    const encrypted = this.encrypt(data);
    sessionStorage.setItem(this.STORAGE_KEY, encrypted);
  }

  // --------------------------------------------------------
  // Public methods
  // --------------------------------------------------------

  /** Lưu form từng bước theo userId */
  public saveForm(userId: number, step: number, formValue: any): void {
    const storage = this.getStorage();
    if (!storage[userId]) storage[userId] = {};
    storage[userId][`step_${step}`] = formValue;
    this.saveStorage(storage);
  }

  /** Lấy dữ liệu form của user */
  public getForm(userId: number, step: number): any {
    const storage = this.getStorage();
    return storage[userId]?.[`step_${step}`] || null;
  }

  /** Xóa form của user */
  public clearUserForm(userId: number): void {
    const storage = this.getStorage();
    delete storage[userId];
    this.saveStorage(storage);
  }

  /** Xóa toàn bộ dữ liệu */
  public clearAll(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  /** Lưu trạng thái addressModes cho từng user */
  public saveAddressModes(userId: number, addressModes: { [key: string]: 'new' | 'old' }): void {
    const storage = this.getStorage();
    if (!storage[userId]) storage[userId] = {};
    storage[userId]['addressModes'] = addressModes;
    // console.log("saveAddressModes",storage)
    this.saveStorage(storage);
  }

  /** Lấy trạng thái addressModes theo user */
  public getAddressModes(userId: number): { [key: string]: 'new' | 'old' } {
    const storage = this.getStorage();
    // console.log('getAddressModes', storage)
    return storage[userId]?.['addressModes'] || {};
  }
}
