import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-preview-dialog',
  template: `
    <div class="relative flex items-center justify-center w-full h-full bg-black bg-opacity-90">
      <!-- Nút đóng -->
      <button
        class="absolute top-4 right-4  text-3xl font-bold focus:outline-none"
        (click)="close()"
      >
        <mat-icon class="text-white" [svgIcon]="'heroicons_outline:x'"></mat-icon>
      </button>

      <!-- Ảnh -->
      <img
        [src]="safeImageUrl"
        alt="Preview"
        class="max-w-full max-h-full object-contain rounded-lg shadow-lg"
      >
    </div>
  `,
  styles:[ `
    ::ng-deep .image-preview-dialog .mat-dialog-container {
      padding: 0 !important;
      border-radius: 0px !important;
    }
  `]

})
export class ImagePreviewDialogComponent {
  safeImageUrl: SafeUrl;

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageUrl: string },
    private sanitizer: DomSanitizer
  ) {
    this.safeImageUrl = this.sanitizer.bypassSecurityTrustUrl(data.imageUrl);
  }

  close(): void {
    this.dialogRef.close();
  }
}
