import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {FUNDING_TYPE_STATUS_TEXT_MAP} from 'app/enum';
import {FsTopupMailTransferDTO} from 'app/models/service';
import {FsChargeCashReqDTO} from 'app/models/service/FsChargeCashReqDTO.model';
import {ManagementCashInReqService} from 'app/service/admin/management-cash-in-req.service';
import {ConfirmProcessingComponent} from 'app/shared/components/confirm-processing/confirm-processing.component';
import {ResolveErrorCashDialogComponent} from '../resolve-error-cash-dialog/resolve-error-cash-dialog.component';
import {fuseAnimations} from "../../../../../../@fuse/animations";
import {FuseConfirmationConfig, FuseConfirmationService} from "../../../../../../@fuse/services/confirmation";
import {APP_TEXT} from "../../../../../shared/constants";

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
    animations: fuseAnimations,
})
export class DetailComponent implements OnInit, OnChanges {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public requestId: number = 0;
    @Input() public isErrorTrans: boolean = false;

    public detail: FsChargeCashReqDTO;
    public oldDetail: FsChargeCashReqDTO;
    public lstChargeCashReqDTOS: FsChargeCashReqDTO[];
    public errorDetail: FsTopupMailTransferDTO;
    public transType = FUNDING_TYPE_STATUS_TEXT_MAP;
    public isCash: boolean = false;
    public statusError: number;

    constructor(
        private _manageCashInReqService: ManagementCashInReqService,
        private _fuseAlertService: FuseAlertService,
        private _confirmService: FuseConfirmationService,
        private _matDialog: MatDialog
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        this.statusError = undefined;
        if (changes && changes.requestId.currentValue !== 0) {
            if (!this.isErrorTrans) {
                const request = new FsChargeCashReqDTO();
                request.fsChargeCashReqId = changes.requestId.currentValue;
                this._manageCashInReqService.getDetail(request).subscribe((res) => {
                    if (res) {
                        this.detail = res.payload;
                        this.isCash = parseInt(this.detail.transType.toString(), 10) === 2;
                    }
                });
            } else {
                const payload = new FsTopupMailTransferDTO();
                payload.fsTopupMailTransferId = changes.requestId.currentValue;
                this._manageCashInReqService.getDetailError(payload).subscribe((res) => {
                    this.detail = res.payload.fsChargeCashReqDTO;
                    this.isCash = parseInt(this.detail.transType.toString(), 10) === 2;
                    this.lstChargeCashReqDTOS = res.payload.lstChargeCashReqDTOS
                    this.statusError = 1;
                });
            }
        }
    }

    ngOnInit(): void {
    }

    onClose(): void {
        this.handleCloseDetailPanel.emit();
    }

    onClickApprove(): void {
        this.resolveRequestDialog();
    }

    private resolveRequestDialog(): void {
        const dialogRef = this._matDialog.open(ConfirmProcessingComponent, {
            disableClose: true,
            width: '450px',
            data: {
                title: 'Xác nhận nội dung xử lý',
                valueDefault: 3,
                valueReject: 4,
                choices: [
                    {
                        value: 3,
                        name: 'Phê duyệt',
                    },
                    {
                        value: 4,
                        name: 'Từ chối(Ghi rõ lý do)',
                    }
                ],
                maxlenNote: 200,
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                const request = new FsChargeCashReqDTO();
                request.fsChargeCashReqId = this.requestId;
                request.status = response.status;
                request.approvalComment = response.approvalComment;
                this._manageCashInReqService.approvalCashInReq(request).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                        this.handleCloseDetailPanel.emit(true);
                        dialogRef.close();
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                });
            }
        );
    }

    public resolveErrorDialog(): void {
        const dialogRef = this._matDialog.open(ResolveErrorCashDialogComponent, {
            width: '450px',
            data: {
                lstChargeCashReqDTOS: this.lstChargeCashReqDTOS,
                status: this.detail.topupMailTransferDTO.status,
                fsChargeCashReqDTO: this.detail,
                complete: () => {
                    dialogRef.close();
                },
            },
            disableClose: true
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                this.oldDetail = this.detail;
                if (response.fsChargeCashReqId) {
                    this.detail = this.lstChargeCashReqDTOS.filter(x => x.fsChargeCashReqId == response.fsChargeCashReqId)[0];
                    this.detail.topupMailTransferDTO = this.oldDetail.topupMailTransferDTO;
                    this.statusError = 2;
                }
                if (response.amount) {
                    this.detail.topupMailTransferDTO.amount = response.amount;
                    this.statusError = 2;
                }
                dialogRef.close();
            }
        );
    }

    cancelEdit() {
        this.detail = this.oldDetail;
        this.statusError = 1;
    }

    saveResolveError() {
        const config: FuseConfirmationConfig = {
            title: '',
            message: 'Xác nhận lưu dữ liệu',
            actions: {
                confirm: {
                    label: 'Đồng ý',
                    color: 'primary'
                },
                cancel: {
                    label: 'Huỷ'
                }
            }
        };
        const dialog = this._confirmService.open(config);
        dialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                 this._manageCashInReqService.processErrorReq(this.detail).subscribe(
                      (result) => {
                          if (result.errorCode === '0') {
                              this._manageCashInReqService.getCashInReqError().subscribe();
                              this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                          } else {
                              this._fuseAlertService.showMessageError(result.message);
                          }
                          this.onClose();
                      }
                  );
            }
        });
    }
}
