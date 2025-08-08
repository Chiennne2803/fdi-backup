import {Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {
    FsCardDownDTO,
    FsLoanProfilesDTO
} from 'app/models/service';
import {FileService} from 'app/service/common-service';
import {Observable, tap} from 'rxjs';
import {SignProcessComponent} from '../dialogs/sign-process/sign-process.component';
import {MatDialog} from '@angular/material/dialog';
import {FsDocuments} from 'app/models/admin';
import {DisbursementTransactionService} from 'app/service';
import {FsCardDownInvestorDTO} from 'app/models/service/FsCardDownInvestorDTO.model';
import {OtpSmsConfirmComponent} from 'app/shared/components/otp-sms-confirm/otp-sms-confirm.component';
import {ROUTER_CONST} from 'app/shared/constants';
import {Router} from '@angular/router';
import {ConfirmProcessingComponent} from 'app/shared/components/confirm-processing/confirm-processing.component';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {fuseAnimations} from "../../../../../@fuse/animations";
import {FsChargeCashReqDTO} from "../../../../models/service/FsChargeCashReqDTO.model";
import {FuseConfirmationService} from "../../../../../@fuse/services/confirmation";

@Component({
    selector: 'detail-disbursement-management',
    templateUrl: './detail-disbursement-management.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DetailDisbursementManagementComponent implements OnInit {
    @Input() hasApproveBtn: boolean = false;
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();

    public disbursementManagement: Observable<{ fsCardDown: FsCardDownDTO; fsLoanProfiles: FsLoanProfilesDTO; investors: FsCardDownInvestorDTO[] }>;
    displayedColumns: string[] = ['no', 'createdByName', 'amount', 'interesAtimate'];
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
        private _disbursementTransactionService: DisbursementTransactionService,
        private matDialog: MatDialog,
        private _dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _router: Router,
    ) {
    }

    ngOnInit(): void {
        this.disbursementManagement = this._disbursementTransactionService.selectDisbursement$;
    }

    public onClose(): void {
        this._disbursementTransactionService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

    public signProcess(cardDownDTO: FsCardDownDTO): void {
        this._disbursementTransactionService.prepare().subscribe((res) => {
            const dialogRef = this.matDialog.open(SignProcessComponent, {
                disableClose: true,
                width: '50%',
                data: {
                    lstAccountApproval: res.payload.lstAccountApproval,
                    cardDownDTO: [cardDownDTO],
                    complete: () => {
                        dialogRef.close();
                    },
                },
            });
            dialogRef.componentInstance.onSubmit.subscribe(
                (response) => {
                    const dialogRef2 = this._fuseConfirmationService.open({
                        title: 'Xác nhận trình ký?',
                        message: '',
                        actions: {
                            confirm: {
                                label: 'Đồng ý'
                            },
                            cancel: {
                                label: 'Hủy',
                            }
                        }
                    });
                    dialogRef2.afterClosed().subscribe((result) => {
                        if (result === 'confirmed') {
                            this._disbursementTransactionService.doSignProcess({
                                ...response,
                                fsCardDownIds: [cardDownDTO.fsCardDownId]
                            }).subscribe((resDisbursement) => {
                                if (resDisbursement.errorCode === '0') {
                                    this._disbursementTransactionService.draftTransaction().subscribe();
                                    this._fuseAlertService.showMessageSuccess('Trình ký thành công');
                                    this._disbursementTransactionService.closeDetailDrawer();
                                } else {
                                    this._fuseAlertService.showMessageError(resDisbursement.message.toString());
                                }
                                dialogRef.close();
                            });
                        }

                    });
                }
            );
        });
    }

    public approve(cardDownDTO: FsCardDownDTO): void {
        const dialogRef = this.matDialog.open(ConfirmProcessingComponent, {
            disableClose: true,
            width: '50%',
            data: {
                title: 'Xác nhận nội dung xử lý?',
                valueDefault: 3,
                // valueReject: 4,
                choices: [
                    {
                        value: 3,
                        name: 'Phê duyệt',

                    },
                    // {
                    //     value: 4,
                    //     name: 'Từ chối(Ghi rõ lý do)',
                    // }
                ],
                maxlenNote: 200,
                complete: () => {
                    dialogRef.close();
                },
            },
        });

        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                const dialogRef2 = this._fuseConfirmationService.open({
                    title: 'Xác nhận phê duyệt?',
                    message: '',
                    actions: {
                        confirm: {
                            label: 'Đồng ý'
                        },
                        cancel: {
                            label: 'Hủy',
                        }
                    }
                });
                dialogRef2.afterClosed().subscribe((result) => {
                    if (result === 'confirmed') {
                        this._disbursementTransactionService.approvalCardDown({
                            ...response,
                            fsCardDownIds: [cardDownDTO.fsCardDownId]
                        }).subscribe(
                            (res) => {
                                if (res.errorCode === '0') {
                                    this._disbursementTransactionService.waitProcessTransaction().subscribe();
                                    this._disbursementTransactionService.closeDetailDrawer();
                                    this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                                } else {
                                    this._fuseAlertService.showMessageError(res.message.toString());
                                }
                                dialogRef.close();
                            }
                        );
                    }
                });
            }
        );
    }

    back(): void {
        this._router.navigate([ROUTER_CONST.config.application.disbursementManagement.link]);
    }

}
