import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BaseResponse} from 'app/models/base';
import FileSaver from 'file-saver';
import {BehaviorSubject, Observable} from 'rxjs';
import {FsDocuments} from '../../models/admin';
import {IBaseModel} from '../../shared/models/base.model';
import {BaseService} from '../base-service';
import {FuseAlertService} from "../../../@fuse/components/alert";

@Injectable({
    providedIn: 'root'
})

export class FileService extends BaseService {
    previewAvatarUrl$: BehaviorSubject<string> = new BehaviorSubject<string>('');

    /**
     * Constructor
     */
    constructor(httpClient: HttpClient, _fuseAlertService: FuseAlertService) {
        super(httpClient, _fuseAlertService, '', 'file');
    }

    getFileFromServer(id: string):
        Observable<{ payload: FsDocuments }> {
        return this.doPost('download', { finDocumentsId: id }) as Observable<{ payload: FsDocuments }>;
    }

    downloadFileBase64(id: string):
        Observable<{ payload: FsDocuments }> {
        return this.doPost('downloadBase', { finDocumentsId: id }) as Observable<{ payload: FsDocuments }>;
    }

    getDetailFiles(id: string): Observable<BaseResponse> {
        const ids = id.split(';');
        return this.doGetDetail({ finDocumentsIds: ids });
    }
    getDetailFile(id: string): Observable<BaseResponse> {
        return this.doGetDetail({ finDocumentsId: id });
    }

    downloadFile(id: string): void {
        this.getFileFromServer(id).subscribe((res) => {
            FileSaver.saveAs(this.dataURItoBlob(res.payload.contentBase64), res.payload.docName);
        });
    }

    readerFileToPreview(e: Event): Observable<string> {
        const file = this.getElementFile(e)[0];
        const fileReader = new FileReader();

        if (file) {
            fileReader.readAsDataURL(file);
            fileReader.onload = (event): void => {
                this.previewAvatarUrl$.next(event.target.result as string);
            };
        }

        return this.previewAvatarUrl$.asObservable();
    }

    // Get file by event onChange file input
    getElementFile(e: Event): FileList {
        const element = e.currentTarget as HTMLInputElement;
        return element.files;
    }

    uploadFile(file: File): Observable<IBaseModel> {
        const formData = new FormData();
        formData.append('file', file);
        return this.post(`${this.url}/upload`, formData);
    }

    dataURItoBlob(dataURI): Blob {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeString });
    }
}
