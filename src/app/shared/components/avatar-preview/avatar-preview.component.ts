import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { DomSanitizer } from '@angular/platform-browser';
// import { FsDocuments } from 'app/models/admin';
import { ImagePreviewDialogComponent } from '../file-detail/image-preview-dialog.component';

@Component({
  selector: 'avatar-preview',
  templateUrl: './avatar-preview.component.html',
  styles: [
  ]
})
export class AvatarPreviewComponent {
  @Input() avatar = null;
  defaultImage: string = 'assets/images/icon/user-avatar.svg';

  constructor(
    private _dialog: MatDialog,
    // private sanitizer: DomSanitizer
  ) { }

  openPreview(): void {
    if (this.avatar) {
      const imageUrl = this.avatar

      this._dialog.open(ImagePreviewDialogComponent, {
        data: { imageUrl },
        panelClass: 'image-preview-dialog',
        maxWidth: '100vw',
        maxHeight: '100vh',
        width: '100%',
        height: '100%'
      });
    }
  }

}
