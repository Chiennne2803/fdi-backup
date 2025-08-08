import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FsDocuments} from '../../../models/admin';
import {FileService} from '../../../service/common-service';
import {MatDrawer} from '@angular/material/sidenav';
import {fuseAnimations} from '../../../../@fuse/animations';
import {DialogService} from '../../../service/common-service/dialog.service';
import {FuseAlertService} from '../../../../@fuse/components/alert';

@Component({
    selector: 'file-detail',
    templateUrl: './file-detail.component.html',
    styleUrls: ['./file-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
})
export class FileDetailComponent implements OnInit {
    @Input() containerClass: string;
    @Input() backgroundClass: string;
    @Input() fileDrawer: MatDrawer;
    @Input() selectedFile: FsDocuments;
    @Input() hasReplaceBtn: boolean = false;
    @Input() replaceBtnV2: boolean = false;//ver2
    @Output() handleReplaceFile: EventEmitter<FsDocuments> = new EventEmitter<FsDocuments>();

    constructor(
        private _fileService: FileService,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService,
    ) {
    }

    ngOnInit(): void {
    }

    public downloadFile(id: string): void {
        this._fileService.downloadFile(id);
    }

    toggle(): void {
        this.fileDrawer.toggle();
    }
    reset(): void {

    }

    submit(): void {

    }

    onFileSelected(event): void {
        const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận thay thế tệp');
        confirmDialog.afterClosed().subscribe((res) => {
            if ( res === 'confirmed' ) {
                this._fileService.uploadFile(event.target.files[0]).subscribe((res) => {
                    if (res.payload) {
                        this.handleReplaceFile.emit(res.payload as FsDocuments);
                        this.fileDrawer.close()
                    } else {
                        this._fuseAlertService.showMessageError(res.message);
                    }
                });
            }
        });
    }

    onClickBtnReplace() {
        this.handleReplaceFile.emit(this.selectedFile);
    }
}
