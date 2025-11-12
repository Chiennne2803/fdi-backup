import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {UserType, TRANS_PAY_INV_STATUS_TEXT_MAP} from 'app/enum';
import {FsDocuments} from 'app/models/admin';
import {FsLoanProfilesDTO, FsTransInvestorDTO} from 'app/models/service';
import {InvestorListService} from 'app/service';
import {FileService} from 'app/service/common-service';
import {Observable, tap} from 'rxjs';
import {MatDrawer} from '@angular/material/sidenav';
import {STATUS_TEXT_MAP} from '../../Investor-topup.config';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'profile-investment-detail',
    templateUrl: './detail-profile.component.html',
    styleUrls: ['./detail-profile.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DetailProfileComponent implements OnInit, AfterViewInit {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();


    public profileDetails: Observable<FsLoanProfilesDTO>;
    public investors: FsTransInvestorDTO;
    public statusTextMap = STATUS_TEXT_MAP;
    public reportLoanProfileAtt: FsDocuments[];
    public financialStatement: FsDocuments[];
    public selectedFile: FsDocuments;
    public userType = UserType;
    public avatar: FsDocuments;
    public transPayInvStatusTextMap = TRANS_PAY_INV_STATUS_TEXT_MAP;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    _dataSource = new MatTableDataSource<FsLoanProfilesDTO>();

    @ViewChild(MatPaginator) paginatorP2PHistory: MatPaginator;
    _dataSourceP2PHistory = new MatTableDataSource<FsLoanProfilesDTO>();

    @ViewChild(MatPaginator) paginatorTranpayInvTransaction: MatPaginator;
    _dataSourceTranpayInvTransaction = new MatTableDataSource<FsLoanProfilesDTO>();

    /**
     * Constructor
     */
    constructor(
        private _investorListService: InvestorListService,
        private _fileService: FileService,
    ) {
    }

    ngOnInit(): void {
        this.profileDetails = this._investorListService.profileDetail$.pipe(
            tap((res) => {
                if (this.fileDrawer != undefined) {
                    this.fileDrawer.close();
                }

                this._dataSource = undefined;
                this._dataSourceP2PHistory = undefined;
                this._dataSourceTranpayInvTransaction = undefined;

                if (res) {
                    if (res.lender.avatar) {
                        this._fileService
                            .getFileFromServer(res.lender.avatar)
                            .subscribe(avatar => this.avatar = avatar.payload);
                    }
                    if (res.reportLoanProfileAtt) {
                        this._fileService
                            .getDetailFiles(res.reportLoanProfileAtt)
                            .subscribe(result => this.reportLoanProfileAtt = result.payload);
                    }
                    if (res.financialStatement) {
                        this._fileService
                            .getDetailFiles(res.financialStatement)
                            .subscribe(result => this.financialStatement = result.payload);
                    }
                    if (res.creditHistory) {
                        this._dataSource = new MatTableDataSource(res.creditHistory);
                        this._dataSource.paginator = this.paginator;
                        setTimeout(() => this._dataSource.paginator = this.paginator, 2000);
                    }
                    if (res.fsInvestorTransP2PDTOS) {
                        this._dataSourceP2PHistory = new MatTableDataSource(res.fsInvestorTransP2PDTOS);
                        this._dataSourceP2PHistory.paginator = this.paginatorP2PHistory;
                        setTimeout(() => this._dataSource.paginator = this.paginatorP2PHistory, 2000);
                    }
                    if (res.transpayInvTransactionDTOS) {
                        this._dataSourceTranpayInvTransaction = new MatTableDataSource(res.transpayInvTransactionDTOS);
                        this._dataSourceTranpayInvTransaction.paginator = this.paginatorTranpayInvTransaction;
                        setTimeout(() => this._dataSource.paginator = this.paginatorTranpayInvTransaction, 2000);
                    }
                }
            })
        );
        /*this.transpayPeriods =  this._investorListService.transpayPeriods$.pipe(
            tap((res) => {
                if (res) {
                    this._dataSourceTranspayPeriods = new MatTableDataSource(res);
                }
            })
        );*/
        this._investorListService.investors$.subscribe(
            response => (this.investors = response)
        );
    }

    ngAfterViewInit(): void {
        this._dataSource.paginator = this.paginator;
        setTimeout(() => this._dataSource.paginator = this.paginator, 1000);

        this._dataSourceP2PHistory.paginator = this.paginatorP2PHistory;
        setTimeout(() => this._dataSourceP2PHistory.paginator = this.paginatorP2PHistory, 1000);

        this._dataSourceTranpayInvTransaction.paginator = this.paginatorTranpayInvTransaction;
        setTimeout(() => this._dataSourceTranpayInvTransaction.paginator = this.paginatorTranpayInvTransaction, 1000);
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

    public downloadFile(id: string): void {
        this._fileService.downloadFile(id);
    }

    onClose() {
        this._investorListService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }
}
