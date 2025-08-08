import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FsDocuments} from '../../../models/admin/FsDocuments.model';
import {FileService} from '../../../service/common-service/file.service';

@Component({
    selector     : 'file-ui',
    templateUrl  : './file.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class FileComponent {
    @Input() file: FsDocuments;
    @Input() docname: string;
    /**
     * Constructor
     */
    constructor(
        private _fileService: FileService
    ) {
    }

    public downloadFile(id: string): void {
        this._fileService.downloadFile(id);
    }
}
