import {Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {FileService} from 'app/service/common-service';
import {Observable} from 'rxjs';
import {ManagementDebtService} from 'app/service/admin/management-debt.service';
import {ConfirmDebtComponent} from '../confirm-debt/confirm-debt.component';
import {MatDialog} from '@angular/material/dialog';
import {FsDocuments} from 'app/models/admin';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {FsReportDebtManagersDTO} from "../../../../models/service/FsReportDebtManagersDTO.model";
import {FsReportDebtDTO} from "../../../../models/service/FsReportDebtDTO.model";
import {FsReportDebtHistoryDTO} from "../../../../models/service/FsReportDebtHistoryDTO.model";
import {CreateDebtHistoryDialogComponent} from "../create-history/create-debt-history-dialog.component";
import {ValuationHistoryDialogComponent} from "../../lender-management/detail-borrower-management/create-collateral-history/valuation-history-dialog.component";

@Component({
    selector: 'detail-debit-management',
    templateUrl: './detail-debit-management.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DetailDebitManagementComponent implements OnInit {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();
    viewMode = 1;

    public debtManagement: Observable<FsReportDebtManagersDTO>;
    public fsReportDebtManagers: FsReportDebtManagersDTO;
    public fsReportDebtDTO: FsReportDebtDTO;
    public fsReportDebtHistoryDTOS: FsReportDebtHistoryDTO[];
    public indexShow: number;
    displayedColumns: string[] = ['no',
        'transCode',
        'amount',
        'amountInteresAtimate',
        'expirDate',
        'principalAmountDue',
        'interestAmountDue',
        'lastPaidDate',
        'paymentStatus',
        'detail1',
        'detail2'];
    public _taskbarConfig = {
        searchBar: {
            placeholder: 'Nhập để tìm kiếm',
            isShowBtnFilter: true,
        }
    };
    public finDocumentsId: FsDocuments[];
    public selectedFile: FsDocuments;


    /**
     * Constructor
     */
    constructor(
        private _fileService: FileService,
        private _managementDebtService: ManagementDebtService,
        private matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
    ) {
    }

    ngOnInit(): void {

        this.debtManagement = this._managementDebtService.selectedProfile$;
        this.debtManagement.subscribe((res) => {
            if (res) {
                this.viewMode = 1;
                this.fsReportDebtManagers = res;
            }
        });
    }

    public onClose(): void {
        this._managementDebtService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

    public onCloseHistory(): void {
        this.viewMode = 1;
    }

    public onClickApprove(fsLoanProfilesId: any): void {
        this._managementDebtService.initCreateReportDebt({fsLoanProfilesId: fsLoanProfilesId}).subscribe((res) => {
            const dialogRef = this.matDialog.open(ConfirmDebtComponent, {
                width: '50%',
                data: {
                    title: 'Xử lý công nợ',
                    subTitle: 'Xác nhận phê duyệt hồ sơ vay',
                    valueDefault: 1,
                    problemSolution: res.payload.problemSolution,
                    lstFsCardDown: res.payload.fsCardDownDTOS,
                    complete: () => {
                        dialogRef.close();
                    },
                },
            });
            dialogRef.componentInstance.onSubmit.subscribe(
                (response) => {
                    let payload = {
                        ...response,
                        fsLoanProfilesId: this.fsReportDebtManagers.fsLoanProfilesId,
                        fsReportDebtManagersId: this.fsReportDebtManagers.fsReportDebtManagersId
                    }
                    this._managementDebtService.doCreate(payload).subscribe((resDebt) => {
                        if (resDebt.errorCode === '0') {
                            this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                            dialogRef.close();
                            this._managementDebtService.closeDetailDrawer();
                            this.handleCloseDetailPanel.emit();
                            this._managementDebtService.doSearch().subscribe();
                        } else {
                            this._fuseAlertService.showMessageError(resDebt.message.toString());
                        }
                    });
                }
            );
        });
    }
    public onClickCreateHistory(fsReportDebtManagersDTO: FsReportDebtManagersDTO): void {
        this._managementDebtService.initCreateHistoryDebt({fsLoanProfilesId: fsReportDebtManagersDTO.fsLoanProfilesId}).subscribe((res) => {
            this.matDialog.open(CreateDebtHistoryDialogComponent, {disableClose: true, data: {
                    fsReportDebtManagers: fsReportDebtManagersDTO,
                    lstFsCardDown: res.payload.fsCardDownDTOS,
                }});
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

    viewHistoryNote(fsCardDownId: any) {
        this._managementDebtService.viewHistoryNote({
            fsReportDebtManagersId: this.fsReportDebtManagers.fsReportDebtManagersId,
            fsCardDownId: fsCardDownId,
        }).subscribe((res) => {
            if (res) {
                this.viewMode = 2;
                this.fsReportDebtHistoryDTOS = res.payload;
                if (this.fsReportDebtHistoryDTOS?.length > 0) {
                    this.fsReportDebtHistoryDTOS.forEach(fsReportDebtHistory => {
                        if (fsReportDebtHistory.finDocumentsId) {
                            this._fileService
                                .getDetailFiles(fsReportDebtHistory.finDocumentsId)
                                .subscribe(result => fsReportDebtHistory.finDocumentsIds = result.payload);
                        }
                    });
                    this.indexShow = this.fsReportDebtHistoryDTOS.length - 1;
                }
            }
        });
    }

    viewHistoryProcess(fsCardDownId: any) {

        this._managementDebtService.viewHistoryProcess({
            fsReportDebtManagersId: this.fsReportDebtManagers.fsReportDebtManagersId,
            fsCardDownId: fsCardDownId,
        }).subscribe((res) => {
            if (res.errorCode === '0') {
                this.viewMode = 3;
                this.fsReportDebtDTO = res.payload;
                if (res.payload.finDocumentsId) {
                    this._fileService
                        .getDetailFiles(res.payload.finDocumentsId)
                        .subscribe(result => this.finDocumentsId = result.payload);
                }
            } else {
                this._fuseAlertService.showMessageError(res.message.toString());
            }
        });
    }

    setIndexShow(i) {
        this.indexShow = i;
    }
}
