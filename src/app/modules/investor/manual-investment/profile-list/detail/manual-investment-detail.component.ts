import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { UserType } from 'app/enum';
import { FsDocuments } from 'app/models/admin';
import { FsLoanProfilesDTO } from 'app/models/service';
import { InvestorService } from 'app/service';
import { FileService } from 'app/service/common-service';
import {first, Observable, tap} from 'rxjs';
import { STATUS_TEXT_MAP } from '../../../Investor-topup.config';
import {MatDialog} from '@angular/material/dialog';
import {InvestDialogComponent} from '../../invest-dialog/invest-dialog.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {fuseAnimations} from '../../../../../../@fuse/animations';

@Component({
    selector: 'manual-investment-detail',
    templateUrl: './manual-investment-detail.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ManualInvestmentDetailComponent implements OnInit, AfterViewInit {
    @ViewChild('fileDrawer', { static: true }) fileDrawer: MatDrawer;
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();
    @ViewChild(MatPaginator) paginator: MatPaginator;

    public profileDetails: Observable<FsLoanProfilesDTO>;
    public statusTextMap = STATUS_TEXT_MAP;
    public reportLoanProfileAtt: FsDocuments[];
    public financialStatement: FsDocuments[];
    public selectedFile: FsDocuments;
    public userType = UserType;
    public avatar: FsDocuments;
    _dataSource = new MatTableDataSource<FsLoanProfilesDTO>();

    constructor(
        private _investorService: InvestorService,
        private _fileService: FileService,
        private _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.profileDetails = this._investorService.profileDetail$.pipe(
             tap((res) => {
                 if(this.fileDrawer !== undefined) {
                     this.fileDrawer.close();
                 }
                 if (res && res.lender.avatar) {
                     this._fileService
                         .getFileFromServer(res.lender.avatar)
                         .subscribe(avatar => this.avatar = avatar.payload);
                 }
                 if (res && res.reportLoanProfileAtt) {
                     this._fileService
                         .getDetailFiles(res.reportLoanProfileAtt)
                         .subscribe(result => this.reportLoanProfileAtt = result.payload);
                 }
                 if (res && res.financialStatement) {
                     this._fileService
                         .getDetailFiles(res.financialStatement)
                         .subscribe(result => this.financialStatement = result.payload);
                 }
                 if (res && res.creditHistory) {
                     this._dataSource = new MatTableDataSource(res.creditHistory);
                     this._dataSource.paginator = this.paginator;
                     setTimeout(() => this._dataSource.paginator = this.paginator, 2000);
                 }
             })
        );
    }

    ngAfterViewInit(): void {
        this._dataSource.paginator = this.paginator;
        setTimeout(() => this._dataSource.paginator = this.paginator, 1000);
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


    public clickViewImage(id: string): void {
        this._fileService
            .getDetailFiles(id)
            .subscribe((res) => {
                if (res !== undefined && res.payload !== undefined) {
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

    public downloadFile(id: string): void {
        this._fileService.downloadFile(id);
    }

    public onInvest(): void {
        this.profileDetails
            .pipe(first())
            .subscribe((profile) => {
            if (profile.fsLoanProfilesId) {
                this._investorService
                    .getInvestInfo({ fsLoanProfilesId: profile.fsLoanProfilesId })
                    .subscribe((res) => {
                        this._matDialog.open(InvestDialogComponent, {
                            disableClose: true,
                            data: {
                                prepareData: res.payload,
                                loanProfile: profile,
                            },
                        });
                    });
            }
        });
    }

    onClose(): void {
        this._investorService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }
}
