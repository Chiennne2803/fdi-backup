import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatDrawer} from '@angular/material/sidenav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UserType} from 'app/enum';
import {AdmAccountDetailDTO, FsDocuments} from 'app/models/admin';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTransInvestorDTO, FsTranspayReqDTO} from 'app/models/service';
import {FileService} from 'app/service/common-service';
import {Subscription} from 'rxjs';
import {FSCardDownCreateDialog} from '../../loan-calling/loan-detail/dialogs/loan-dialogs.component';
import {FuseAlertService} from '../../../../../@fuse/components/alert';
import {OtpSmsConfirmComponent} from '../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component';
import {LoanProfilesService, LoanProfilesStoreService} from "../../../../service/borrower";
import {FormBuilder,  FormGroup} from "@angular/forms";
import {MatTabChangeEvent, MatTabGroup} from "@angular/material/tabs";
import {DateTimeformatPipe} from "../../../../shared/components/pipe/date-time-format.pipe";
import {AuthService} from "../../../../core/auth/auth.service";
import {DialogService} from "../../../../service/common-service/dialog.service";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {Clipboard} from "@angular/cdk/clipboard";

@Component({
    selector: 'borrower-loan-detail',
    templateUrl: './loan-detail.component.html',
    styleUrls: ['./loan-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DateTimeformatPipe],
    animations: fuseAnimations
})
export class LoanDetailComponent implements OnInit, OnDestroy {
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    @ViewChild('detailFsCardDown', {static: true}) detailFsCardDown: MatDrawer;
    @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;

    public loanProfile: FsLoanProfilesDTO;
    public admAccountDetail: AdmAccountDetailDTO;
    public investors: FsTransInvestorDTO[];
    public fsCardDown: FsCardDownDTO[];
    public fsTranspayReq: FsTranspayReqDTO[];
    public avatar: FsDocuments;
    public avatar2: FsDocuments;

    //file ca nhan
    public laborContract: FsDocuments[];
    public rentalContract: FsDocuments[];
    public fileValues1: FsDocuments[];
    public fileValues2: FsDocuments[];

    // public financialStatement: FsDocuments[];
    public economicInfoDocuments: FsDocuments[];
    public finDocumentsId: FsDocuments[];
    public legalDocuments: FsDocuments[];
    public businessDocumentation: FsDocuments[];
    public selectedFile: FsDocuments;
    fsTranspayReqDTO: FsTranspayReqDTO;

    public legal_documents_config: any[];
    public legal_documents_lst: string[] = [
        'Giấy chứng nhận đăng ký kinh doanh (bản thay đổi gần nhất)',
        'CCCD/Hộ Chiếu của Đại diện pháp luật và các cổ đông lớn nhất (mặt trước)',
        'CCCD/Hộ Chiếu của Đại diện pháp luật và các cổ đông lớn nhất  ( mặt sau)',
        'Đăng ký mẫu dấu, chứng chỉ ngành nghề hoặc giấy chứng nhận đủ điều kiện kinh doanh',
        'Quyết định bổ nhiệm kế toán trưởng',
        'Điều lệ công ty',
        'Danh sách thành viên Hội đồng quản trị/ Hội đồng thành viên',
        'Quyết định bổ nhiệm Người đại diện trước pháp luật',
        'Bản công bố các cá nhân liên quan (bố mẹ, vợ hoặc chồng) của Người chịu trách nhiệm trước pháp luật hoặc cổ đông lớn nhất'];

    public financial_documents_config: any[];
    public financial_documents_lst: string[] = [
        'Báo cáo tài chính thuế 2 năm gần nhất với xác nhận của cơ quan thuế hoặc BCTC đã kiểm toán bao gồm: Bảng cân đối kế toán, Báo cáo kết quả hoạt động kinh doanh, Báo cáo lưu chuyển tiền tệ, Bản thuyết minh BCTC, ...',
        'Chi tiết các sổ phải thu, phải trả, hàng tồn kho, tài sản cố định',
        'Tờ khai VAT',
        'Sao kê tài khoản ngân hàng',
    ];
    public business_documentation_config: any[];
    public business_documentation_lst: string[] = [
        'Ít nhất 03 hợp đồng kinh tế - Hóa đơn mua bán đầu vào với các đối tác tài chính trong vòng 12 tháng gần nhất',
        'Ít nhất 03 hợp đồng kinh tế - Hóa đơn mua bán đầu ra với các đối tác tài chính trong vòng 12 tháng gần nhất',
        'Khác',
    ];

    public userType = UserType;
    formGroup: FormGroup = new FormGroup({});

    public investorsDisplayColumn = ['index', 'transInvestorName', 'amount', 'createdDate', 'status'];
    public fsCardDownDisplayColumn = ['index', 'transCode', 'amount', 'createdDate', 'status'];
    public fsTranspayReqColumn = ['index',
        'transCode',
        'fsLoanProfilesId',
        'paidAmount',
        'createdByName',
        'createdDate',
        'approveByName',
        'approvalDate',
        'status'];

    private routerSubscription: Subscription;
    private activeTab: number;
    public displayTranspayReq: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _loanProfilesService: LoanProfilesService,
        private _loanProfilesStoreService: LoanProfilesStoreService,
        private _fileService: FileService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _datetimePipe: DateTimeformatPipe,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _dialogService: DialogService,
        private _alertService: FuseAlertService,
        private clipboard: Clipboard
    ) {
        this.routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.getLoanDetail();
            }
        });
    }

    ngOnInit(): void {
        this._loanProfilesStoreService.toggle();
        this.getLoanDetail();

    }

    ngOnDestroy(): void {
        this._loanProfilesStoreService.toggle();
        this.routerSubscription.unsubscribe();
    }

    public openFsCardDownDetailDialog(selectedFsCardDown: FsCardDownDTO): void {
        /*this._loanProfilesStoreService
            .getDetailCardDownDTO({fsCardDownId: selectedFsCardDown.fsCardDownId})
            .subscribe((res) => {
                this.matDialog.open(FSCardDownDetailDialog, {
                    width: '800px',
                    data: res.payload
                });
            });*/
    }

    public openFsTransPayDetailDialog(selectedTransPay: any): void {
        /* this._loanProfilesService
             .getTransPayDetail(selectedTransPay.fsTranspayPeriodId)
             .subscribe((res) => {
                 this.matDialog.open(FSTransPayDetailDialog, {
                     width: '1000px',
                     data: res.payload
                 });
             });*/
    }

    public openFSTransPayCreateDialog(): void {
        /*this._loanProfilesService
            .getCardDownByLoanProfile(this.loanProfile.fsLoanProfilesId)
            .subscribe((res) => {
                const dialogRef = this.matDialog.open(FSTransPayCreateDialog, {
                    width: '1000px',
                    data: {
                        fsLoanProfiles: this.loanProfile,
                        lstCardDowns: res.payload.lstCardDowns,
                    }
                });

                dialogRef.componentInstance.onSubmit.subscribe(
                    (response) => {
                        this._loanProfilesService
                            .createTranspayRequest(response)
                            .subscribe((result) => {
                                if (result.errorCode !== '0') {
                                    this._fuseAlertService.showMessageError(result.message.toString());
                                } else {
                                    this.openDialog(
                                        'LOAN_PROFILES_TRANSPAY_REQ',
                                        'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất lập yêu cầu thanh toán khoản vay',
                                        'Tự động phê duyệt giải ngân thành công!');
                                    dialogRef.close();
                                }
                            });
                    }
                );
            });*/
    }

    public downloadFile(id: string): void {
        this._fileService.downloadFile(id);
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

    private getLoanDetail(): void {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) {
            this._loanProfilesStoreService
                .getDetail(id)
                .subscribe((res) => {
                    this.init_financial_documents_config();
                    this.init_legal_documents_config();
                    this.init_business_documentation_config();
                    this.avatar = undefined;
                    this.laborContract = [];
                    this.rentalContract = [];
                    this.fileValues1 = [];
                    this.fileValues2 = [];
                    if (res && res.payload) {
                        if (this.fileDrawer != undefined) {
                            this.fileDrawer.close();
                        }
                        this.loanProfile = res.payload.fsLoanProfiles;
                        this.admAccountDetail = res.payload.admAccountDetail;
                        this.investors = res.payload.investors;
                        this.fsCardDown = res.payload.fsCardDown;
                        this.fsTranspayReq = res.payload.transpayReq;

                        if (res.payload.admAccountDetail.avatar) {
                            this._fileService
                                .getFileFromServer(res.payload.admAccountDetail.avatar)
                                .subscribe(avatar => this.avatar = avatar.payload);
                        }
                        if (this.admAccountDetail.representative?.avatar) {
                            this._fileService
                                .getFileFromServer(this.admAccountDetail.representative?.avatar)
                                .subscribe(avatar => this.avatar2 = avatar.payload);
                        }
                        /*if (res.payload.fsLoanProfiles.financialStatement) {
                            this._fileService
                                .getDetailFiles(res.payload.fsLoanProfiles.financialStatement)
                                .subscribe(result => this.financialStatement = result.payload);
                        }*/
                        if (res.payload.fsLoanProfiles.finDocumentsId) {
                            this._fileService
                                .getDetailFiles(res.payload.fsLoanProfiles.finDocumentsId)
                                .subscribe(result => this.finDocumentsId = result.payload);
                        }
                        if (res.payload.admAccountDetail.economicInfoDocuments) {
                            this._fileService
                                .getDetailFiles(res.payload.admAccountDetail.economicInfoDocuments)
                                .subscribe(result => this.economicInfoDocuments = result.payload);
                        }

                        //financialDocuments
                        if (res.payload.admAccountDetail?.financialDocuments) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail?.financialDocuments).subscribe(
                                files => this.financial_documents_config.map(x => x.key == 'financialDocuments' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail?.financialDocuments1) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail?.financialDocuments1).subscribe(
                                files => this.financial_documents_config.map(x => x.key == 'financialDocuments1' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail?.financialDocuments2) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail?.financialDocuments2).subscribe(
                                files => this.financial_documents_config.map(x => x.key == 'financialDocuments2' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail?.financialDocuments3) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail?.financialDocuments3).subscribe(
                                files => this.financial_documents_config.map(x => x.key == 'financialDocuments3' ? x.lstFile = files.payload : x.lstFile));
                        }

                        //legalDocuments
                        if (res.payload.admAccountDetail.legalDocuments) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.legalDocuments).subscribe(
                                files => this.legal_documents_config.map(x => x.key == 'legalDocuments' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail.legalDocuments1) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.legalDocuments1).subscribe(
                                files => this.legal_documents_config.map(x => x.key == 'legalDocuments1' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail.legalDocuments2) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.legalDocuments2).subscribe(
                                files => this.legal_documents_config.map(x => x.key == 'legalDocuments2' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail.legalDocuments3) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.legalDocuments3).subscribe(
                                files => this.legal_documents_config.map(x => x.key == 'legalDocuments3' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail.legalDocuments4) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.legalDocuments4).subscribe(
                                files => this.legal_documents_config.map(x => x.key == 'legalDocuments4' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail.legalDocuments5) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.legalDocuments5).subscribe(
                                files => this.legal_documents_config.map(x => x.key == 'legalDocuments5' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail.legalDocuments6) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.legalDocuments6).subscribe(
                                files => this.legal_documents_config.map(x => x.key == 'legalDocuments6' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail.legalDocuments7) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.legalDocuments7).subscribe(
                                files => this.legal_documents_config.map(x => x.key == 'legalDocuments7' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail.legalDocuments8) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.legalDocuments8).subscribe(
                                files => this.legal_documents_config.map(x => x.key == 'legalDocuments8' ? x.lstFile = files.payload : x.lstFile));
                        }

                        //businessDocumentation
                        if (res.payload.admAccountDetail.businessDocumentation) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.businessDocumentation).subscribe(
                                files => this.business_documentation_config.map(x => x.key == 'businessDocumentation' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail.businessDocumentation1) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.businessDocumentation1).subscribe(
                                files => this.business_documentation_config.map(x => x.key == 'businessDocumentation1' ? x.lstFile = files.payload : x.lstFile));
                        }
                        if (res.payload.admAccountDetail.businessDocumentation2) {
                            this._fileService.getDetailFiles(res.payload.admAccountDetail.businessDocumentation2).subscribe(
                                files => this.business_documentation_config.map(x => x.key == 'businessDocumentation2' ? x.lstFile = files.payload : x.lstFile));
                        }

                        //tai lieu cua CA NHAN
                        if (res.payload.admAccountDetail.laborContract) {
                            this._fileService
                                .getDetailFiles(res.payload.admAccountDetail.laborContract)
                                .subscribe(result => this.laborContract = result.payload);
                        }
                        if (res.payload.admAccountDetail.rentalContract) {
                            this._fileService
                                .getDetailFiles(res.payload.admAccountDetail.rentalContract)
                                .subscribe(result => this.rentalContract = result.payload);
                        }
                        if (res.payload.admAccountDetail.fileValues1) {
                            this._fileService
                                .getDetailFiles(res.payload.admAccountDetail.fileValues1)
                                .subscribe(result => this.fileValues1 = result.payload);
                        }
                        if (res.payload.admAccountDetail.fileValues2) {
                            this._fileService
                                .getDetailFiles(res.payload.admAccountDetail.fileValues2)
                                .subscribe(result => this.fileValues2 = result.payload);
                        }
                    }
                });
        }
    }

    init_financial_documents_config() {
        this.financial_documents_config = [{
            title: this.financial_documents_lst[0], key: 'financialDocuments', lstFile: [],
        }, {
            title: this.financial_documents_lst[1], key: 'financialDocuments1', lstFile: [],
        }, {
            title: this.financial_documents_lst[2], key: 'financialDocuments2', lstFile: [],
        }, {
            title: this.financial_documents_lst[3], key: 'financialDocuments3', lstFile: [],
        }]
    }

    init_business_documentation_config() {
        this.business_documentation_config = [{
            title: this.business_documentation_lst[0], key: 'businessDocumentation', lstFile: [],
        }, {
            title: this.business_documentation_lst[1], key: 'businessDocumentation1', lstFile: [],
        }, {
            title: this.business_documentation_lst[2], key: 'businessDocumentation2', lstFile: [],
        }]
    }

    init_legal_documents_config() {
        this.legal_documents_config = [{
            title: this.legal_documents_lst[0], key: 'legalDocuments', lstFile: [],
        }, {
            title: this.legal_documents_lst[1], key: 'legalDocuments1', lstFile: [],
        }, {
            title: this.legal_documents_lst[2], key: 'legalDocuments2', lstFile: [],
        }, {
            title: this.legal_documents_lst[3], key: 'legalDocuments3', lstFile: [],
        }, {
            title: this.legal_documents_lst[4], key: 'legalDocuments4', lstFile: [],
        }, {
            title: this.legal_documents_lst[5], key: 'legalDocuments5', lstFile: [],
        }, {
            title: this.legal_documents_lst[6], key: 'legalDocuments6', lstFile: [],
        }, {
            title: this.legal_documents_lst[7], key: 'legalDocuments7', lstFile: [],
        }, {
            title: this.legal_documents_lst[8], key: 'legalDocuments8', lstFile: [],
        },
        ]
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

    openDialog(otpType, content, successMessage: string = ''): void {
        const dialogRef = this.matDialog.open(OtpSmsConfirmComponent, {
            data: {
                payload: {
                    otpType: otpType,
                },
                title: 'Điền mã xác nhận OTP',
                content: content,
                complete: () => {
                    dialogRef.close();
                    this._fuseAlertService.showMessageSuccess(successMessage);
                },
            }
        });
    };

    public openFSCardDownCreateDialog(): void {
        this._loanProfilesService
            .prepareDisbursementRequest(this.loanProfile.fsLoanProfilesId)
            .subscribe((res) => {
                const dialogRef = this.matDialog.open(FSCardDownCreateDialog, {
                    width: '800px',
                    data: {
                        fsCardDown: res.payload,
                        investors: res.payload.investors,
                    }
                });

                dialogRef.componentInstance.onSubmit.subscribe(
                    (response) => {
                        this._loanProfilesService
                            .createDisbursementRequest({
                                'fsLoanProfilesId': this.loanProfile.fsLoanProfilesId,
                                'listTransInvestorId': response.listTransInvestorId,
                                'transCode': response.transCode
                            })
                            .subscribe((result) => {
                                if (result.errorCode !== '0') {
                                    this._fuseAlertService.showMessageError(result.message.toString());
                                } else {
                                    this.getLoanDetail();
                                    this.openDialog(
                                        'LOAN_PROFILES_CARD_DOWN',
                                        'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. ' +
                                        'Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất tạo mới yêu cầu giải ngân',
                                        'Tạo mới yêu cầu giải ngân thành công'
                                    );
                                    dialogRef.close();
                                }
                            });
                    }
                );
            });
    }




    onClickClose() {
        this.displayTranspayReq = false;
        this.fsTranspayReqDTO = undefined;
      /*  setTimeout(() => {
            if (this.matTabGroup) {
                this.matTabGroup.selectedIndex = 4;
            }
        }, 500);*/

    }

    tabClick(event: MatTabChangeEvent) {
        // console.log(event)
        // console.log(event.index)
        this.activeTab = event.index;
    }

    coppy(text: string | undefined) {
        this.clipboard.copy(text);
        this._fuseAlertService.showMessageSuccess("copied", 500)
    }

    public viewTransPayReq(selectedTransPay: any): void {
        this.displayTranspayReq=true;
        this.fsTranspayReqDTO = selectedTransPay;
    }

    public createTransPayReq(): void {
        this.displayTranspayReq=true;
    }

}
