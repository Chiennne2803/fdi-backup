import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ManagementInvestorService} from 'app/service/admin/management-investor.service';
import {Observable, tap} from 'rxjs';
import {AdmAccountDetailDTO, FsDocuments, UserType} from '../../../../models/admin';
import {FileService} from '../../../../service/common-service';
import {AccountDetailStatus} from '../../../../enum';
import {ConfirmProcessingComponent} from '../../../../shared/components/confirm-processing/confirm-processing.component';
import {MatDialog} from '@angular/material/dialog';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {MatDrawer} from "@angular/material/sidenav";
import {BaseRequest} from '../../../../models/base';
import {fuseAnimations} from "../../../../../@fuse/animations";
import {MatTabGroup} from "@angular/material/tabs";
import {ManageStaffDialogsComponent} from "../manager-staff-dialog/manager-staff-dialog.component";
import {environment} from "../../../../../environments/environment";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import { FsTransactionHistoryDTO} from "../../../../models/service";
import {
    CheckboxColumn,
    TextColumn
} from "../../../../shared/models/datatable/display-column.model";
import {ExcelService} from "../../../../service/common-service/excel.service";

@Component({
    selector: 'app-detail-investor-management',
    templateUrl: './detail-investor-management.component.html',
    styleUrls: ['./detail-investor-management.component.scss'],
    animations: fuseAnimations,
})
export class DetailInvestorManagementComponent implements OnInit {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    public detail: Observable<AdmAccountDetailDTO>;
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();
    @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

    public userType = UserType;
    public accountDetailStatus = AccountDetailStatus;
    public admAccountId: number;
    public economicInfoDocuments: FsDocuments[];
    public finDocumentsId: FsDocuments[];
    public legalDocuments: FsDocuments[];
    public businessDocumentation: FsDocuments[];
    public photoOfBusiness: FsDocuments[];
    public cmnd: FsDocuments[];
    public avatar: FsDocuments;
    public deputyAvatar: FsDocuments;
    public selectedFile: FsDocuments;
    lstManagerStaff: AdmAccountDetailDTO[];

    public pageSizeOptions = environment.pageSizeOptions;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    public dataSource = new MatTableDataSource<any>();
    public lengthRecords: number = 0;
    public pageSize: number = 0;

    public transHistoryDataSource = new MatTableDataSource<any>();
    public transHistoryAutoDataSource = new MatTableDataSource<any>();

    constructor(
        private _investorService: ManagementInvestorService,
        private _router: Router,
        private matDialog: MatDialog,
        private _fileService: FileService,
        private _fuseAlertService: FuseAlertService,
        private _matDialog: MatDialog,
        private _excelService: ExcelService,
    ) {
    }

    ngOnInit(): void {
        this.detail = this._investorService.detail$.pipe(
            tap((admAccountDetail) => {
                this.economicInfoDocuments = [];
                this.finDocumentsId = [];
                this.legalDocuments = [];
                this.businessDocumentation = [];
                this.photoOfBusiness = [];
                this.cmnd = [];

                this.dataSource = undefined;
                this.transHistoryDataSource = undefined;
                this.transHistoryAutoDataSource = undefined;
                if (admAccountDetail) {
                    if (this.matTabGroup) {
                        this.matTabGroup.selectedIndex = 0;
                    }
                    if (this.fileDrawer != undefined) {
                        this.fileDrawer.close();
                    }
                    if (admAccountDetail.fsTransInvestorDTOS?.length > 0) {
                        this.dataSource = new MatTableDataSource(admAccountDetail.fsTransInvestorDTOS);
                        this.lengthRecords = admAccountDetail.fsTransInvestorDTOS.length;
                        setTimeout(() => this.dataSource.paginator = this.paginator, 1000);
                    }
                    if (admAccountDetail.fsTransactionHistoryDTOS?.length > 0) {
                        this.transHistoryDataSource = new MatTableDataSource(admAccountDetail.fsTransactionHistoryDTOS);
                        this.transHistoryAutoDataSource = new MatTableDataSource(admAccountDetail.fsTransactionHistoryAutoDTOS);
                    }
                    if (admAccountDetail.admAccountId != undefined) {
                        this.admAccountId = admAccountDetail.admAccountId;
                    }
                    if (admAccountDetail.avatar) {
                        this._fileService
                            .getFileFromServer(admAccountDetail.avatar)
                            .subscribe(avatar => this.avatar = avatar.payload);
                    }
                    if (admAccountDetail.representative?.avatar) {
                        this._fileService
                            .getFileFromServer(admAccountDetail.representative.avatar)
                            .subscribe(avatar => this.deputyAvatar = avatar.payload);
                    }

                    if (admAccountDetail.economicInfoDocuments) {
                        this._fileService
                            .getDetailFiles(admAccountDetail.economicInfoDocuments)
                            .subscribe(result => this.economicInfoDocuments = result.payload);
                    }
                    if (admAccountDetail.legalDocuments) {
                        this._fileService
                            .getDetailFiles(admAccountDetail.legalDocuments)
                            .subscribe(result => this.legalDocuments = result.payload);
                    }
                    if (admAccountDetail.businessDocumentation) {
                        this._fileService
                            .getDetailFiles(admAccountDetail.businessDocumentation)
                            .subscribe(result => this.businessDocumentation = result.payload);
                    }
                    if (admAccountDetail.photoOfBusiness) {
                        this._fileService
                            .getDetailFiles(admAccountDetail.photoOfBusiness)
                            .subscribe(result => this.photoOfBusiness = result.payload);
                    }

                    let idsmnd = admAccountDetail.frontPhotoIdentication + ";" + admAccountDetail.backsitePhotoIdentication;
                    idsmnd = idsmnd.replaceAll('undefined', '');
                    if (idsmnd !== ';') {
                        this._fileService.getDetailFiles(idsmnd).subscribe(result => this.cmnd = result.payload);
                        // this.oldFrontPhotoIdentication = admAccountDetail.frontPhotoIdentication;
                        // this.oldBacksitePhotoIdentication = admAccountDetail.frontPhotoIdentication;
                    }
                }
            })
        );
        this._investorService.prepareInvestor$.subscribe(res => {
            if (res.lstManagerStaff) {
                this.lstManagerStaff = res.lstManagerStaff;
            }
        })
    }

    public onClose(): void {
        this._investorService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

    public downloadFile(id: string): void {
        if (id) {
            this._fileService.downloadFile(id);
        }
    }

    public setManageStaff(): void {
        const dialogManageStaff = this._matDialog.open(ManageStaffDialogsComponent, {
            width: '400px',
            disableClose: true,
            data: {
                lstManagerStaff: this.lstManagerStaff,
            },
        });
        dialogManageStaff.componentInstance.onSubmit.subscribe(
            (response) => {
                this._investorService.setManageStaff({
                    manageStaff: response.managerStaff,
                    admAccountIds: [this.admAccountId]
                }).subscribe(resDto => {
                    if (resDto.errorCode === '0') {
                        this._investorService
                            .detail({admAccountDetailId: this.admAccountId}).subscribe();
                        this._investorService.doSearch().subscribe();
                        this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                    } else {
                        this._fuseAlertService.showMessageError(resDto.message.toString());
                    }
                    dialogManageStaff.close();
                });
            }
        );
    }

    public onClickProcess(): void {
        const dialogRef = this.matDialog.open(ConfirmProcessingComponent, {
            width: '450px',
            disableClose: true,
            data: {
                title: 'Xác nhận nội dung xử lý',
                valueDefault: 2,
                valueReject: 3,
                choices: [
                    {
                        value: 2,
                        name: 'Phê duyệt',
                    },
                    {
                        value: 3,
                        name: 'Từ chối(Ghi rõ lý do)',
                    }
                ],
                maxlenNote : 500,
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                this._investorService.approvalInvestor({
                    ...response,
                    reasonContent: response.approvalComment
                }).subscribe(res => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                        this._investorService.doSearch(new BaseRequest()).subscribe();
                        this.onClose();
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                    dialogRef.close();
                });
            }
        );
    }

    public clickViewImage(id: string): void {
        this._fileService
            .getDetailFiles(id)
            .subscribe((res) => {
                if (res != undefined && res.payload != undefined) {
                    this.selectedFile = res.payload[0];
                    this.fileDrawer.open();
                    if (['JPG', 'JPEG', 'PNG'].includes(this.selectedFile.type.toUpperCase())) {
                        this._fileService.getFileFromServer(this.selectedFile.finDocumentsId + '').subscribe(
                            res => this.selectedFile = res.payload
                        );
                    }
                }
            });
    }

    public onClickFile(file: FsDocuments): void {
        this.selectedFile = file;
        this.fileDrawer.open();
        if (['JPG', 'JPEG', 'PNG'].includes(file.type.toUpperCase())) {
            this._fileService.getFileFromServer(file.finDocumentsId + '').subscribe(
                res => this.selectedFile = res.payload
            );
        }
    }

}

