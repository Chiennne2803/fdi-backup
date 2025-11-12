import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss']
})
export class PasswordInputComponent {

  @Input() control!: AbstractControl;
  @Input() label = 'Mật khẩu';
  @Input() placeholder = 'Nhập mật khẩu...';
  @Input() required = false;

  showPassword = false;
  isFocused = false; // 👈 Thêm cờ theo dõi focus

  get value(): string {
    return this.control?.value || '';
  }

  // Các tiêu chí
  get hasMinLength() { return this.value.length >= 8 && this.value.length <= 30; }
  get hasLowerCase() { return /[a-z]/.test(this.value); }
  get hasUpperCase() { return /[A-Z]/.test(this.value); }
  get hasSpecialChar() { return /[!@#$%^&*?]/.test(this.value); }

  // Hiển thị lỗi
  // get showRequiredError() {
  //   return this.control?.hasError('required') && (this.control.touched || this.control.dirty);
  // }
  get showRequiredError(): boolean {
        return this.control?.invalid;
    }

  // get showInvalidError() {
  //   return this.control?.hasError('invalidPassword') && (this.control.touched || this.control.dirty);
  // }

  onInput(event: any) {
    this.control.setValue(event.target.value);
  }
}
