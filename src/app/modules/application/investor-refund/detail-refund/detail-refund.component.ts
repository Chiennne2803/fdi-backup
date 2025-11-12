import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTranspayInvestorDTO, FsTranspayReqDTO,} from '../../../../models/service';
import {DialogService} from '../../../../service/common-service/dialog.service';
import {TranspayInvestorTransactionService} from '../../../../service';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {fuseAnimations} from "../../../../../@fuse/animations";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ISelectModel} from "../../../../shared/models/select.model";
import {AuthService} from "../../../../core/auth/auth.service";
import {DateTimeformatPipe} from "../../../../shared/components/pipe/date-time-format.pipe";
import {environment} from "../../../../../environments/environment";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {FsTranspayInvestorDetailDTO} from "../../../../models/service/FsTranspayInvestorDetailDTO.model";
import {SignProcessComponent} from "../../ho-disbursement-management/dialogs/sign-process/sign-process.component";
import {MatDialog} from "@angular/material/dialog";
import {
    ConfirmProcessingComponent
} from "../../../../shared/components/confirm-processing/confirm-processing.component";
import {FuseConfirmationService} from "../../../../../@fuse/services/confirmation";

@Component({
    selector: 'detail-investor-refund',
    templateUrl: './detail-refund.component.html',
    providers: [DateTimeformatPipe],
    animations: fuseAnimations
})
export class DetailInvestorRefundComponent implements OnInit {
    @Output() handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();
    @Input() isCreate: boolean = false;
    isPrepareSave: boolean = false;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    public dataSource = new MatTableDataSource<any>();
    public lengthRecords: number = 0;
    public pageSize: number = 0;
    public pageSizeOptions = environment.pageSizeOptions;

    formGroup: FormGroup = new FormGroup({});
    lstLoanProfile: FsLoanProfilesDTO[];
    lstLoanProfileFilter: FsLoanProfilesDTO[];
    lstCardDowns: FsCardDownDTO[];
    lstTranspayReq: FsTranspayReqDTO[];
    fsTranspayInvestorDTO: FsTranspayInvestorDTO;

    public payTypes: Array<ISelectModel> = [
        { id: 1, label: 'Tự động phân bổ' },
        { id: 2, label: 'Nhân viên phân bổ' },
    ];

    constructor(
        private _transpayInvestorService: TranspayInvestorTransactionService,
        private _dialogService: DialogService,
        private _alertService: FuseAlertService,
        private _formBuilder: FormBuilder,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {
        this.fsTranspayInvestorDTO = null;
    }

    ngOnInit(): void {
        this.initForm();
        this._transpayInvestorService.transpayInvestor$.subscribe(res => {
            if (res) {
                this.fsTranspayInvestorDTO = res;
                //enablePayType = 1, cho phep nhan vien phan bo
                if (this.fsTranspayInvestorDTO.enablePayType == 1) {
                    this.payTypes = [
                        { id: 1, label: 'Tự động phân bổ' },
                        { id: 2, label: 'Nhân viên phân bổ' },
                    ]
                } else {
                    this.payTypes = [
                        { id: 1, label: 'Tự động phân bổ' },
                    ]
                }
                this.initForm(res);

                if (res.fsTransInvestorDTOS?.length > 0) {
                    this.dataSource = new MatTableDataSource(this.fsTranspayInvestorDTO.fsTransInvestorDTOS);
                    this.lengthRecords = this.fsTranspayInvestorDTO.fsTransInvestorDTOS.length;
                    this.dataSource.paginator = this.paginator;
                }

                if (res.lstTranspayInvestorDetail?.length > 0) {
                    const fgs = res.lstTranspayInvestorDetail.map(x => FsTranspayInvestorDetailDTO.asFormGroup(x,this.formGroup.get('payType').value));
                    this.formGroup.setControl('lstTranspayInvestorDetail', new FormArray(fgs));
                }
            } else {
                this.fsTranspayInvestorDTO = null;
                // this.formGroup.setControl('lstTranspayInvestorDetail', []);
            }
        });
        this._transpayInvestorService.loanProfiles$.subscribe(res => {
            if (res) {
                this.lstLoanProfile = res;
                this.lstLoanProfileFilter = res;
                this.dataSource = new MatTableDataSource([]);
                this.lengthRecords = 0;
                this.dataSource.paginator = this.paginator;
                this.initForm();
            }
        });
    }

    get lstTranspayInvestorDetail(): FormArray {
        return this.formGroup.get('lstTranspayInvestorDetail') as FormArray;
    }

    onChangeSelect(event: any, type: string): void {
        switch (type) {
            case 'loanProfile':
                this.lstCardDowns = [];
                this.lstTranspayReq = [];
                this.formGroup.get('fsCardDownId').patchValue(0);
                this.formGroup.get('fsTranspayReqId').patchValue(0);
                this._transpayInvestorService.getCardDownByLoanProfile(event.value).subscribe(
                    res => this.lstCardDowns = res.payload.lstCardDowns
                );
                break;
            case 'cardDown':
                this.lstTranspayReq = [];
                this.formGroup.get('fsTranspayReqId').patchValue(0);
                this._transpayInvestorService.getFsTranspayReqByCardDown({fsCardDownId: event.value}).subscribe(
                    res => this.lstTranspayReq = res.payload.lstTranspayReq
                );
                break;
            case 'transpayReq':
                if (!this.formGroup.get('payType').value) {
                    this.formGroup.get('payType').patchValue(1);
                }
                this.initTranspayInvestor(this.formGroup.value);
                break;
            case 'payType':
                this.initTranspayInvestor(this.formGroup.value);
                break;
            default:
        }
    }

    onClickClose(): void {
        this.handleCloseDetailPanel.emit();
        this.initForm();
    }

    cancelSave(): void {
        this.isPrepareSave = false;
    }

    onClickProcess(): void {
        const dialogRef = this._dialogService.openConfirmProcessingDialog(3, 4);
        dialogRef.componentInstance.onSubmit.subscribe((res) => {
            if (res) {
                const payload = {
                    fsTranspayInvestorId: this.fsTranspayInvestorDTO.fsTranspayInvestorId,
                    status: res.status,
                    approvalComment: res.approvalComment
                };
                this._transpayInvestorService.approvalTranspayInvestor(payload).subscribe(
                    (response) => {
                        if (response.errorCode === '0') {
                            this._alertService.showMessageSuccess('Xử lý thành công');
                            this._transpayInvestorService.getDetail({fsTranspayReqId: this.fsTranspayInvestorDTO.fsTranspayReqId}).subscribe();
                            this.onClickClose();
                        } else {
                            this._alertService.showMessageError(response.message.toString());
                        }
                        dialogRef.close();
                    }
                );
            }
        });
    }

    onClickSave(): void {
        const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
        confirmDialog.afterClosed().subscribe(
            (res) => {
                if ( res === 'confirmed' ) {
                    this._transpayInvestorService.create(this.formGroup.getRawValue()).subscribe(
                        (res) => {
                            if (res.errorCode === '0') {
                                this._alertService.showMessageSuccess('Xử lý thành công');
                                this.onClickClose();
                            } else {
                                this._alertService.showMessageError(res.message.toString());
                            }
                        }
                    );
                }
            }
        );
    }

    doSign(): void {
        this._transpayInvestorService.prepare().subscribe((resPrepare) => {
            const dialogRef = this.matDialog.open(SignProcessComponent, {
                disableClose: true,
                width: '50%',
                data: {
                    lstAccountApproval: resPrepare.payload.lstAccountApproval,
                    complete: () => {
                        dialogRef.close();
                    },
                },
            });
            dialogRef.componentInstance.onSubmit.subscribe(
                (response) => {
                    this._transpayInvestorService.doSignTranspayPay({
                        ...response,
                        fsTranspayInvestorId: this.fsTranspayInvestorDTO.fsTranspayInvestorId
                    })
                        .subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._fuseAlertService.showMessageSuccess('Trình ký thành công');
                                this._transpayInvestorService.doSearchDraftTransaction().subscribe();
                                this.onClickClose();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                            }
                            dialogRef.close();
                        });
                }
            );
        });
    }

    createTranspayReq(): void {
        const confirmDialog = this._dialogService.openConfirmDialog('Xác nhận lưu dữ liệu');
        confirmDialog.afterClosed().subscribe(
            (res) => {
                if (res === 'confirmed') {
                    this._transpayInvestorService.create(this.formGroup.value).subscribe(
                        (res) => {
                            if (res.errorCode === '0') {
                                this._transpayInvestorService.doSearchDraftTransaction();
                                this._alertService.showMessageSuccess('Tạo yêu cầu thanh toán thành công');
                                this.onClickClose();
                            } else {
                                this._alertService.showMessageError(res.message.toString());
                            }
                        }
                    );
                }
            }
        );
    }

    get fsTranspayInvestorId(){
        return this.formGroup.get('fsTranspayInvestorId').value;
    }
    private initForm(data?: FsTranspayInvestorDTO) {
        this.formGroup = this._formBuilder.group({
            fsTranspayInvestorId: new FormControl(data ? data.fsTranspayInvestorId : null, [Validators.required]),
            transCode: new FormControl(data ? data.transCode : null, [Validators.required]),
            fsLoanProfilesId: new FormControl(data ? data.fsLoanProfilesId : null, [Validators.required]),
            amount: new FormControl(data ? data.amount : 0, [Validators.required]),
            interest: new FormControl(data ? data.interest : 0, [Validators.required]),
            amountCapital: new FormControl(data ? data.amountCapital : null, [Validators.required]),
            fee: new FormControl(data ? data.fee : null, [Validators.required]),
            loanCycle: new FormControl(data ? data.loanCycle : null, [Validators.required]),
            exprieDate: new FormControl(data ? data.exprieDate : null, [Validators.required]),
            approvalBy: new FormControl(data ? data.approvalBy : null, [Validators.required]),
            info: new FormControl(data ? data.info : null),
            transComment: new FormControl(data ? data.transComment : null, [Validators.required]),
            feeTax: new FormControl(data ? data.feeTax : null, [Validators.required]),
            fsCardDownId: new FormControl(data ? data.fsCardDownId : null, [Validators.required]),
            fsCardDownCode: new FormControl(data ? data.fsCardDownCode : null, [Validators.required]),
            approvalComment: new FormControl(data ? data.approvalComment : null, [Validators.required]),
            approvalDate: new FormControl(data ? data.approvalDate : null, [Validators.required]),
            payType: new FormControl(data ? data.payType : null, [Validators.required]),
            fsTranspayReqId: new FormControl(data ? data.fsTranspayReqId : null, [Validators.required]),
            transpayReqPrincipal: new FormControl(data ? data.transpayReqPrincipal : null, [Validators.required]),
            transpayReqInterest: new FormControl(data ? data.transpayReqInterest : null, [Validators.required]),
            admAccountId: new FormControl(data ? data.admAccountId : null, [Validators.required]),

            lstTranspayInvestorDetail: this._formBuilder.array([]),

            createdByName: new FormControl({
                value: data ? data.createdByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            createdDate: new FormControl({
                value: data ? this._datetimePipe.transform(data.createdDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
            lastUpdatedByName: new FormControl({
                value: data ? data.lastUpdatedByName : this._authService.authenticatedUser.fullName,
                disabled: true
            }),
            lastUpdatedDate: new FormControl({
                value: data ? this._datetimePipe.transform(data.lastUpdatedDate, 'DD/MM/YYYY') :
                    this._datetimePipe.transform(new Date().getTime(), 'DD/MM/YYYY'),
                disabled: true
            }),
        });
    }

    private initTranspayInvestor(value: any) {
        this._transpayInvestorService.initTranspayInvestor(this.formGroup.value).subscribe(res => {
            if (res.errorCode !== '0') {
                this._transpayInvestorService._transpayInvestor$.next(this.fsTranspayInvestorDTO);
                this._fuseAlertService.showMessageError(res.message, 10000);
            }
        });
    }

    onKey(target): void {
        if (target.value && target.value.trim()) {
            this.lstLoanProfileFilter = this.search(target.value.trim());
        } else {
            this.lstLoanProfileFilter = this.lstLoanProfile;
        }
    }

    search(value: string): any {
        if (!this.lstLoanProfile) return [];
        return this.lstLoanProfile.filter(option => 
            option.fsLoanProfilesId.toString().toLowerCase().includes(value.toLowerCase())
        );
    }


}
