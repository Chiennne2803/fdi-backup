import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation} from "@angular/core";
import {TransferorDetailsDataType} from "./transferor-details.config";
import {UserType} from "../../../../../../enum";
import {FileService} from "../../../../../../service/common-service";
import {MatDrawer} from "@angular/material/sidenav";
import {FsDocuments} from "../../../../../../models/admin";


// Chi tiết bên chuyển nhượng
@Component({
    selector: 'transferor-details',
    templateUrl: './transferor-details.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TransferorDetailsComponent implements OnInit {

    @Input() data: TransferorDetailsDataType;

    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    public selectedFile: FsDocuments;
    public deputyAvatar: FsDocuments;
    public avatar: FsDocuments;

    protected readonly UserType = UserType;

    constructor(
        private _fileService: FileService
    ) {
    }

    ngOnInit(): void {
        if (this.data?.admDeputyContactDTO?.avatar) {
            this._fileService
                .getFileFromServer(this.data?.admDeputyContactDTO?.avatar)
                .subscribe(avatar => this.deputyAvatar = avatar.payload);
        }
        if (this.data?.admAccountDetailDTO.avatar) {
            this._fileService
                .getFileFromServer(this.data?.admAccountDetailDTO.avatar)
                .subscribe(avatar => this.avatar = avatar.payload);
        }
    }


    public clickViewImage(id: string): void {
        this._fileService
            .getDetailFiles(id)
            .subscribe((res) => {
                if (!!res.payload) {
                    this.selectedFile = res.payload[0];
                    this.fileDrawer.open();
                    if (['JPG', 'JPEG', 'PNG'].includes(this.selectedFile.type.toUpperCase())) {
                        this._fileService.getFileFromServer(this.selectedFile.finDocumentsId + '').subscribe(
                            resFile => this.selectedFile = resFile.payload
                        );
                    }
                }
            });
    }
}
