import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationConfig, FuseConfirmationService } from '@fuse/services/confirmation';
import { EmailTemplateDTO } from 'app/models/admin/EmailTemplateDTO.model';
import { EmailTemplateService } from 'app/service/admin/email-template.service';
import { APP_TEXT } from 'app/shared/constants';
import { EmailTemplateProtectionUtil } from 'app/shared/utils/email-template-protection.util';

@Component({
  selector: 'app-email-template-dialog',
  templateUrl: './email-template-dialog.component.html',
  styles: [
  ]
})
export class EmailTemplateDialogComponent implements OnInit {
  public emailTemplateForm: FormGroup = new FormGroup({});
  public detail: EmailTemplateDTO;

  // Properties để xử lý bảo vệ code
  public isSubjectProtected: boolean = false;
  public isHeaderProtected: boolean = false;
  public isBodyProtected: boolean = false;
  public isFooterProtected: boolean = false;

  public subjectDisplayText: string = '';
  public headerDisplayText: string = '';
  public bodyDisplayText: string = '';
  public footerDisplayText: string = '';

  // Properties để lưu trữ các đoạn code được bảo vệ
  public subjectProtectedCodes: string[] = [];
  public headerProtectedCodes: string[] = [];
  public bodyProtectedCodes: string[] = [];
  public footerProtectedCodes: string[] = [];

  constructor(
    private matDialogRef: MatDialogRef<EmailTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmailTemplateDTO,
    private _emailTemplateService: EmailTemplateService,
    private _formBuilder: FormBuilder,
    private confirmService: FuseConfirmationService,
    private _fuseAlertService: FuseAlertService,
    private _cdr: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {
    if (this.data) {
      this.detail = this.data;

      // ✅ Khởi tạo form trống trước
      this.emailTemplateForm = this._formBuilder.group({});

      // ✅ Luôn có các field chính
      this.emailTemplateForm.addControl(
        'admEmailTemplateId',
        new FormControl(this.detail.admEmailTemplateId ?? null)
      );

      // Thêm type nếu có
      if (this.detail.type !== null && this.detail.type !== undefined) {
        this.emailTemplateForm.addControl(
          'type',
          new FormControl(this.detail.type)
        );
      }

      // Thêm status nếu có
      if (this.detail.status !== null && this.detail.status !== undefined) {
        this.emailTemplateForm.addControl(
          'status',
          new FormControl(this.detail.status)
        );
      }

      // Thêm listFileAtt nếu có
      if (this.detail.listFileAtt !== null && this.detail.listFileAtt !== undefined) {
        this.emailTemplateForm.addControl(
          'listFileAtt',
          new FormControl(this.detail.listFileAtt)
        );
      }

      // Thêm actionKey nếu có
      if (this.detail.actionKey !== null && this.detail.actionKey !== undefined) {
        this.emailTemplateForm.addControl(
          'actionKey',
          new FormControl(this.detail.actionKey)
        );
      }

      // Kiểm tra và xử lý subject
      this.processFieldProtection('subject', this.detail.subject ?? '');

      this.emailTemplateForm.addControl(
        'subject',
        new FormControl(this.detail.subject ?? '', Validators.required)
      );

      this.emailTemplateForm.addControl(
        'body',
        new FormControl(this.detail.body ?? '', Validators.required)
      );

      // Kiểm tra và xử lý body
      this.processFieldProtection('body', this.detail.body ?? '');

      // ✅ Chỉ thêm header nếu có trong data
      if (this.detail.header !== null && this.detail.header !== undefined) {
        this.processFieldProtection('header', this.detail.header);
        this.emailTemplateForm.addControl(
          'header',
          new FormControl(this.detail.header, Validators.required)
        );
      }

      // ✅ Chỉ thêm footer nếu có trong data
      if (this.detail.footer !== null && this.detail.footer !== undefined) {
        this.processFieldProtection('footer', this.detail.footer);
        this.emailTemplateForm.addControl(
          'footer',
          new FormControl(this.detail.footer)
        );
      }

    } else {
      // Không có data → form null (ẩn hoàn toàn trong template)
      this.emailTemplateForm = null as any;
    }
  }

  /**
   * Xử lý bảo vệ cho từng field
   */
  private processFieldProtection(fieldName: string, value: string): void {
    const hasProtectedCode = EmailTemplateProtectionUtil.hasProtectedCode(value);
    const displayText = EmailTemplateProtectionUtil.createDisplayTextWithProtection(value);
    const protectedCodes = EmailTemplateProtectionUtil.getProtectedCodes(value);

    switch (fieldName) {
      case 'subject':
        this.isSubjectProtected = hasProtectedCode;
        this.subjectDisplayText = displayText;
        this.subjectProtectedCodes = protectedCodes;
        break;
      case 'header':
        this.isHeaderProtected = hasProtectedCode;
        this.headerDisplayText = displayText;
        this.headerProtectedCodes = protectedCodes;
        break;
      case 'body':
        this.isBodyProtected = hasProtectedCode;
        this.bodyDisplayText = displayText;
        this.bodyProtectedCodes = protectedCodes;
        break;
      case 'footer':
        this.isFooterProtected = hasProtectedCode;
        this.footerDisplayText = displayText;
        this.footerProtectedCodes = protectedCodes;
        break;
    }
  }




  discard(): void {
    if (this.emailTemplateForm.dirty) {
      const config: FuseConfirmationConfig = {
        title: '',
        message: 'Dữ liệu thao tác trên màn hình sẽ bị mất, xác nhận thực hiện',
        actions: {
          confirm: {
            label: 'Đồng ý',
            color: 'primary'
          },
          cancel: {
            label: 'Huỷ'
          }
        }
      };
      const dialog = this.confirmService.open(config);
      dialog.afterClosed().subscribe((res) => {
        if (res === 'confirmed') {
          this.matDialogRef.close(false);
        }
      });
      return;
    }
    this.matDialogRef.close(false);
  }

  submitUpdate(): void {
    // Đánh dấu tất cả field đã được touch
    this.emailTemplateForm.markAllAsTouched();
    
    // Force update validation state
    this.emailTemplateForm.updateValueAndValidity();
    
    // Sử dụng setTimeout với ChangeDetectorRef để đảm bảo validation messages hiển thị
    setTimeout(() => {
      // Force detect changes để hiển thị validation messages
      this._cdr.detectChanges();
      
      // Kiểm tra validation trước
      if (!this.emailTemplateForm.valid) {
        // Hiển thị thông báo lỗi validation
        this._fuseAlertService.showMessageError('Vui lòng kiểm tra lại các trường bắt buộc');
        return;
      }

      // Kiểm tra xem có field nào được bảo vệ và đã bị thay đổi không
      const hasProtectedChanges = this.checkProtectedFieldsChanges();
      if (hasProtectedChanges) {
        this._fuseAlertService.showMessageError('Không thể chỉnh sửa các đoạn code được bảo vệ (bắt đầu bằng {} hoặc thẻ HTML)');
        return;
      }

      // Kiểm tra có thay đổi không
      if (!this.emailTemplateForm.dirty) {
        this._fuseAlertService.showMessageWarning('Không có thay đổi');
        return;
      }

      // Hiển thị dialog xác nhận
      this.showConfirmationDialog();
    }, 50);
  }

  private showConfirmationDialog(): void {
    const config: FuseConfirmationConfig = {
      title: 'Xác nhận lưu dữ liệu',
      message: '',
      actions: {
        confirm: {
          label: 'Lưu',
          color: 'primary'
        },
        cancel: {
          label: 'Huỷ'
        }
      }
    };
    const dialog = this.confirmService.open(config);
    dialog.afterClosed().subscribe((res) => {
      if (res === 'confirmed') {
        // Merge form values với dữ liệu gốc để giữ nguyên các trường không có trong form
        const request = {
          ...this.detail, // Giữ nguyên tất cả dữ liệu gốc
          ...this.emailTemplateForm.value // Override với dữ liệu từ form
        };
        this._emailTemplateService.update(request).subscribe((result) => {
          if (result.errorCode === '0') {
            this.matDialogRef.close(true);
            this._fuseAlertService.showMessageSuccess(APP_TEXT.form.success.message);
          } else {
            this._fuseAlertService.showMessageError(result.message);
          }
        });
      }
    });
  }

  /**
   * Kiểm tra xem có đoạn code được bảo vệ nào bị thay đổi không
   */
  private checkProtectedFieldsChanges(): boolean {
    const formValue = this.emailTemplateForm.value;
    const originalData = this.detail;
    
    // Kiểm tra subject - chỉ kiểm tra các đoạn code được bảo vệ
    if (this.isSubjectProtected && this.hasProtectedCodeChanged(formValue.subject, originalData.subject, this.subjectProtectedCodes)) {
      return true;
    }
    
    // Kiểm tra header
    if (this.isHeaderProtected && this.hasProtectedCodeChanged(formValue.header, originalData.header, this.headerProtectedCodes)) {
      return true;
    }
    
    // Kiểm tra body
    if (this.isBodyProtected && this.hasProtectedCodeChanged(formValue.body, originalData.body, this.bodyProtectedCodes)) {
      return true;
    }
    
    // Kiểm tra footer
    if (this.isFooterProtected && this.hasProtectedCodeChanged(formValue.footer, originalData.footer, this.footerProtectedCodes)) {
      return true;
    }
    
    return false;
  }

  /**
   * Kiểm tra xem các đoạn code được bảo vệ có bị thay đổi không
   */
  private hasProtectedCodeChanged(newValue: string, originalValue: string, protectedCodes: string[]): boolean {
    if (!protectedCodes || protectedCodes.length === 0) {
      return false;
    }
    
    // Kiểm tra từng đoạn code được bảo vệ
    for (const protectedCode of protectedCodes) {
      const originalCount = (originalValue.match(new RegExp(protectedCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      const newCount = (newValue.match(new RegExp(protectedCode.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      
      // Nếu số lượng xuất hiện khác nhau hoặc đoạn code bị thay đổi
      if (originalCount !== newCount || !newValue.includes(protectedCode)) {
        return true;
      }
    }
    
    return false;
  }
}
