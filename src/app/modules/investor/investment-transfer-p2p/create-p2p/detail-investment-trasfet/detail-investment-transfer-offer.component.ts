import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {FsLoanProfilesDTO} from 'app/models/service';
import {FileService} from 'app/service/common-service';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {FsDocuments} from 'app/models/admin';
import {OtpSmsConfirmComponent} from 'app/shared/components/otp-sms-confirm/otp-sms-confirm.component';
import {APP_TEXT, ROUTER_CONST} from 'app/shared/constants';
import {Router} from '@angular/router';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {FsReqTransP2PService} from 'app/service/admin/req-trans-p2p.service';
import {FsReqTransP2PDTO} from 'app/models/service/FsReqTransP2PDTO.model';
import {FormBuilder, FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {FsInvestorTransP2PDTO} from 'app/models/service/FsInvestorTransP2PDTO.model';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {UserType} from 'app/enum';
import FileSaver from 'file-saver';
import {FuseConfirmationService} from '../../../../../../@fuse/services/confirmation';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {environment} from "../../../../../../environments/environment";

@Component({
    selector: 'detail-investment-transfer-offer',
    templateUrl: './detail-investment-transfer-offer.component.html',
    encapsulation: ViewEncapsulation.None,
    animations     : fuseAnimations,
})
export class DetailInvestmentTransferOfferComponent implements OnInit, AfterViewInit {
    @Input() hasApproveBtn: boolean = false;
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();

    buyInvestment: UntypedFormGroup;
    appTextConfig = APP_TEXT;
    public avatar: FsDocuments;
    public reportLoanProfileAtt: FsDocuments[];
    public detailInvestmentTransferData: FsReqTransP2PDTO;

    public pageSizeOptions = environment.pageSizeOptions;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    _dataSource = new MatTableDataSource<FsLoanProfilesDTO>();

    @ViewChild('paginatorInv') paginatorInv: MatPaginator;
    _dataSourceInv = new MatTableDataSource<FsLoanProfilesDTO>();

    public data: {
        payload: object;
    };
    public _taskbarConfig = {
        searchBar: {
            placeholder: 'Nhập để tìm kiếm',
            isShowBtnFilter: true,
        }
    };
    public finDocumentsId: FsDocuments[];
    public selectedFile: FsDocuments;
    public estimateInvestorTrans: FsInvestorTransP2PDTO;
    public initInvestorTransP2PRes = {
        isEnough: false,
        message: ''
    };
    public isClearTerms = false;
    public isValidRequest = false;
    public userType = UserType;


    /**
     * Constructor
     */
    constructor(
        private _fileService: FileService,
        private _fsReqTransP2PService: FsReqTransP2PService,
        private matDialog: MatDialog,
        private _dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _fuseConfirmationService: FuseConfirmationService,
    ) {
    }

    ngOnInit(): void {
        this._fsReqTransP2PService.detail$.subscribe((res) => {
            this.detailInvestmentTransferData = res;
            this._dataSource = undefined;
            this._dataSourceInv = undefined;
            if (res) {
                if (res.fsLoanProfilesDTO?.lender?.avatar) {
                    this._fileService
                        .getFileFromServer(res.fsLoanProfilesDTO.lender.avatar)
                        .subscribe(avatar => this.avatar = avatar.payload);
                }
                if (res.fsLoanProfilesDTO.reportLoanProfileAtt) {
                    this._fileService
                        .getDetailFiles(res.fsLoanProfilesDTO.reportLoanProfileAtt)
                        .subscribe(result => this.reportLoanProfileAtt = result.payload);
                }
                if (res.creditHistory) {
                    this._dataSource = new MatTableDataSource(res.creditHistory);
                    this._dataSource.paginator = this.paginator;
                    setTimeout(() => this._dataSource.paginator = this.paginator, 1000);
                }
                if (res.fsInvestorTransP2PDTOS) {
                    this._dataSourceInv = new MatTableDataSource(res.fsInvestorTransP2PDTOS);
                    this._dataSourceInv.paginator = this.paginatorInv;
                    setTimeout(() => this._dataSourceInv.paginator = this.paginatorInv, 1000);
                }
            }
        });
        this.buyInvestment = this._formBuilder.group({
            transferAmount: new FormControl('', [Validators.required]),
        });
        this.buyInvestment.get('transferAmount').valueChanges.pipe(
            debounceTime(300),
            distinctUntilChanged()
        ).subscribe((value) => {
            this.initInvestorTransP2PRes = {
                isEnough: false,
                message: ''
            };
            this.prepareCreateLoan(value);
        });
    }

    cancelInvest(data): void {
        const dialogConfirm = this._fuseConfirmationService.open({
            title: 'Xác nhận hủy giao dịch chuyển nhượng?',
            message: 'Đây là hành động vĩnh viễn, giao dịch sẽ không thể khôi phục sau khi huỷ.' +
                ' Lập giao dịch chuyển nhượng mới nếu bạn muốn tiếp tục chuyển nhượng khoản đầu tư này',
            actions: {
                confirm: {
                    label: 'Đồng ý huỷ'
                },
                cancel: {
                    label: 'Quay lại',
                }
            }
        });

        dialogConfirm.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._fsReqTransP2PService.cancelInvest({fsReqTransP2PId: data.fsReqTransP2PId}).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this.sendOtp('CANCEL_TRANS_REQ_P2P_OTP', 'Huỷ giao dịch thành công');
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                });
            }
        });
    }

    ngAfterViewInit(): void {
        if (this._dataSource) {
            this._dataSource.paginator = this.paginator;
            setTimeout(() => this._dataSource.paginator = this.paginator, 1000);
        }
    }

    prepareCreateLoan(value: string): void {
        if (value != null) {
            const condition = {
                payload: {
                    transferAmount: this.buyInvestment.get('transferAmount').value,
                    fsReqTransP2PId: this.detailInvestmentTransferData.fsReqTransP2PId
                }
            };
            this._fsReqTransP2PService
                .initInvestorTransP2P(condition)
                .subscribe((res) => {
                    if (res.errorCode === '0') {
                        this.isValidRequest = true;
                        this.estimateInvestorTrans = res.payload;
                        this.initInvestorTransP2PRes = {
                            isEnough: false,
                            message: ''
                        };
                    } else {
                        this.isValidRequest = false;
                        this.initInvestorTransP2PRes = {
                            isEnough: true,
                            message: res.message.toString()
                        };
                    }
                });
        }
    }

    public onClose(): void {
        this._fsReqTransP2PService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

    public submit(): void {
        this.buyInvestment.markAllAsTouched();
        if (this.buyInvestment.valid) {
            this._fsReqTransP2PService.buyInvestment(this.estimateInvestorTrans).subscribe((res) => {
                if (res.errorCode === '0') {
                    this.sendOtp('BUY_INVESTOR_P2P_OTP', 'Mua giao dịch thành công');
                } else {
                    this._fuseAlertService.showMessageError(res.message.toString());
                }
            });
        }
    }

    clearTerms(value): void {
        this.isClearTerms = value;
    }

    sendOtp(otpType: string, message: string): void {
        const dialogRef = this._dialog.open(OtpSmsConfirmComponent, {
            data: {
                payload: {
                    otpType: otpType,
                },
                title: 'Điền mã xác nhận OTP',
                content: 'Hệ thống đã gửi mã OTP xác thực vào email bạn đã đăng ký. Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất!',
                complete: () => {
                    dialogRef.close();
                    this._fuseAlertService.showMessageSuccess(message);
                    this.back();
                },
            }
        });
    };

    back(): void {
        this._router.navigate([ROUTER_CONST.config.investor.investmentTransfer.link+'/sale']);
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

    downloadContract(): void {
        this._fsReqTransP2PService.downloadContract({
            fsReqTransP2PId: this.detailInvestmentTransferData.fsReqTransP2PId,
            fsLoanProfilesId: this.detailInvestmentTransferData.fsLoanProfilesId
        }).subscribe((res) => {
            FileSaver.saveAs(this._fileService.dataURItoBlob(res.payload.contentBase64), res.payload.docName);
        });
    }
}
