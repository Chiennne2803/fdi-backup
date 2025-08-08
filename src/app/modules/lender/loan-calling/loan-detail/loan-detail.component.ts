import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatDrawer} from '@angular/material/sidenav';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {UserType} from 'app/enum';
import {AdmAccountDetailDTO, FsDocuments} from 'app/models/admin';
import {FsCardDownDTO, FsLoanProfilesDTO, FsTransInvestorDTO, FsTranspayReqDTO,} from 'app/models/service';
import {FileService} from 'app/service/common-service';
import {Subscription} from 'rxjs';
import {FsCardDownInvestorDTO} from '../../../../models/service/FsCardDownInvestorDTO.model';
import {FuseAlertService} from '@fuse/components/alert';
import {OtpSmsConfirmComponent} from '../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component';
import {SelectionModel} from '@angular/cdk/collections';
import {ConfirmProcessingComponent} from '../../../../shared/components/confirm-processing/confirm-processing.component';
import {FuseConfirmationService} from '../../../../../@fuse/services/confirmation';
import {LoanProfilesService, LoanProfilesStoreService} from "../../../../service/borrower";
import {FormBuilder} from "@angular/forms";
import {DateTimeformatPipe} from "../../../../shared/components/pipe/date-time-format.pipe";
import {fuseAnimations} from "../../../../../@fuse/animations";
import {AuthService} from "../../../../core/auth/auth.service";
import {DialogService} from "../../../../service/common-service/dialog.service";
import {MatTabChangeEvent, MatTabGroup} from "@angular/material/tabs";

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
    // public financialStatement: FsDocuments[];
    public economicInfoDocuments: FsDocuments[];
    public finDocumentsId: FsDocuments[];
    public legalDocuments: FsDocuments[];
    public businessDocumentation: FsDocuments[];
    public selectedFile: FsDocuments;

    public userType = UserType;
    public displayTranspayReq: boolean = false;
    fsTranspayReqDTO: FsTranspayReqDTO;

    public investorsDisplayColumn = ['select', 'index', 'transInvestorName', 'amount', 'createdDate', 'status'];
    selectionInvestor = new SelectionModel<FsCardDownInvestorDTO>(true, []);
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

    public isCallingProfile: boolean = false;
    public isChecked: boolean = false;

    private routerSubscription: Subscription;
    public activeTab: number;
    private stopCapital: number;

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

    public laborContract: FsDocuments[];
    public rentalContract: FsDocuments[];
    public fileValues1: FsDocuments[];
    public fileValues2: FsDocuments[];

    /**
     * Constructor
     */
    constructor(
        private _loanProfilesService: LoanProfilesService,
        private _fileService: FileService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private matDialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private _fuseConfirmationService: FuseConfirmationService,
        private _loanProfilesStoreService: LoanProfilesStoreService,
        private _datetimePipe: DateTimeformatPipe,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _dialogService: DialogService,
        private _alertService: FuseAlertService,
    ) {
        this.displayTranspayReq = false;
        this.routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.getLoanDetail();
            }
        });
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

    get hasApproveBtn(): boolean {
        return this.selectionInvestor.selected.filter(investor => investor.status === 1).length === this.selectionInvestor.selected.length
            && this.selectionInvestor.selected.length > 0;
    }

    ngOnInit(): void {
        this._loanProfilesService.toggle();
        this.getLoanDetail();
        this._loanProfilesService.profileDetail$.subscribe((res) => {
            this.loanProfile = undefined;
            this.admAccountDetail = undefined;
            this.investors = undefined;
            this.fsCardDown = undefined;
            this.fsTranspayReq = undefined;
            this.avatar = undefined;
            this.avatar2 = undefined;
            this.finDocumentsId = undefined;
            this.economicInfoDocuments = undefined;
            this.legalDocuments = undefined;
            this.businessDocumentation = undefined;
            this.stopCapital = undefined;
            this.init_financial_documents_config();
            this.init_legal_documents_config();
            this.init_business_documentation_config();

            this.laborContract = [];
            this.rentalContract = [];
            this.fileValues1 = [];
            this.fileValues2 = [];

            if (res) {
                // if (this.matTabGroup) {
                //     this.matTabGroup.selectedIndex = this.activeTab;
                // }
                if (this.fileDrawer !== undefined) {
                    this.fileDrawer.close();
                }
                this.loanProfile = res.fsLoanProfiles;
                this.admAccountDetail = res.admAccountDetail;
                this.investors = res.investors;
                this.fsCardDown = res.fsCardDown;
                this.fsTranspayReq = res.transpayReq;

                if (res.stopCapital) {
                    this.stopCapital = res.stopCapital;
                }
                if (res.admAccountDetail.avatar) {
                    this._fileService
                        .getFileFromServer(res.admAccountDetail.avatar)
                        .subscribe(avatar => this.avatar = avatar.payload);
                }
                if (this.admAccountDetail.representative?.avatar) {
                    this._fileService
                        .getFileFromServer(this.admAccountDetail.representative?.avatar)
                        .subscribe(avatar => this.avatar2 = avatar.payload);
                }
                /*if (res.fsLoanProfiles.financialStatement) {
                    this._fileService
                        .getDetailFiles(res.fsLoanProfiles.financialStatement)
                        .subscribe(result => this.financialStatement = result.payload);
                }*/
                if (res.fsLoanProfiles.finDocumentsId) {
                    this._fileService
                        .getDetailFiles(res.fsLoanProfiles.finDocumentsId)
                        .subscribe(result => this.finDocumentsId = result.payload);
                }
                if (res.admAccountDetail.economicInfoDocuments) {
                    this._fileService
                        .getDetailFiles(res.admAccountDetail.economicInfoDocuments)
                        .subscribe(result => this.economicInfoDocuments = result.payload);
                }
                if (res.admAccountDetail.legalDocuments) {
                    this._fileService
                        .getDetailFiles(res.admAccountDetail.legalDocuments)
                        .subscribe(result => this.legalDocuments = result.payload);
                }
                if (res.admAccountDetail.businessDocumentation) {
                    this._fileService
                        .getDetailFiles(res.admAccountDetail.businessDocumentation)
                        .subscribe(result => this.businessDocumentation = result.payload);
                }

                //financialDocuments
                if (res.admAccountDetail?.financialDocuments) {
                    this._fileService.getDetailFiles(res.admAccountDetail?.financialDocuments).subscribe(
                        files => this.financial_documents_config.map(x => x.key == 'financialDocuments' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail?.financialDocuments1) {
                    this._fileService.getDetailFiles(res.admAccountDetail?.financialDocuments1).subscribe(
                        files => this.financial_documents_config.map(x => x.key == 'financialDocuments1' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail?.financialDocuments2) {
                    this._fileService.getDetailFiles(res.admAccountDetail?.financialDocuments2).subscribe(
                        files => this.financial_documents_config.map(x => x.key == 'financialDocuments2' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail?.financialDocuments3) {
                    this._fileService.getDetailFiles(res.admAccountDetail?.financialDocuments3).subscribe(
                        files => this.financial_documents_config.map(x => x.key == 'financialDocuments3' ? x.lstFile = files.payload : x.lstFile));
                }

                //legalDocuments
                if (res.admAccountDetail.legalDocuments) {
                    this._fileService.getDetailFiles(res.admAccountDetail.legalDocuments).subscribe(
                        files => this.legal_documents_config.map(x => x.key == 'legalDocuments' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail.legalDocuments1) {
                    this._fileService.getDetailFiles(res.admAccountDetail.legalDocuments1).subscribe(
                        files => this.legal_documents_config.map(x => x.key == 'legalDocuments1' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail.legalDocuments2) {
                    this._fileService.getDetailFiles(res.admAccountDetail.legalDocuments2).subscribe(
                        files => this.legal_documents_config.map(x => x.key == 'legalDocuments2' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail.legalDocuments3) {
                    this._fileService.getDetailFiles(res.admAccountDetail.legalDocuments3).subscribe(
                        files => this.legal_documents_config.map(x => x.key == 'legalDocuments3' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail.legalDocuments4) {
                    this._fileService.getDetailFiles(res.admAccountDetail.legalDocuments4).subscribe(
                        files => this.legal_documents_config.map(x => x.key == 'legalDocuments4' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail.legalDocuments5) {
                    this._fileService.getDetailFiles(res.admAccountDetail.legalDocuments5).subscribe(
                        files => this.legal_documents_config.map(x => x.key == 'legalDocuments5' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail.legalDocuments6) {
                    this._fileService.getDetailFiles(res.admAccountDetail.legalDocuments6).subscribe(
                        files => this.legal_documents_config.map(x => x.key == 'legalDocuments6' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail.legalDocuments7) {
                    this._fileService.getDetailFiles(res.admAccountDetail.legalDocuments7).subscribe(
                        files => this.legal_documents_config.map(x => x.key == 'legalDocuments7' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail.legalDocuments8) {
                    this._fileService.getDetailFiles(res.admAccountDetail.legalDocuments8).subscribe(
                        files => this.legal_documents_config.map(x => x.key == 'legalDocuments8' ? x.lstFile = files.payload : x.lstFile));
                }

                //businessDocumentation
                if (res.admAccountDetail.businessDocumentation) {
                    this._fileService.getDetailFiles(res.admAccountDetail.businessDocumentation).subscribe(
                        files => this.business_documentation_config.map(x => x.key == 'businessDocumentation' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail.businessDocumentation1) {
                    this._fileService.getDetailFiles(res.admAccountDetail.businessDocumentation1).subscribe(
                        files => this.business_documentation_config.map(x => x.key == 'businessDocumentation1' ? x.lstFile = files.payload : x.lstFile));
                }
                if (res.admAccountDetail.businessDocumentation2) {
                    this._fileService.getDetailFiles(res.admAccountDetail.businessDocumentation2).subscribe(
                        files => this.business_documentation_config.map(x => x.key == 'businessDocumentation2' ? x.lstFile = files.payload : x.lstFile));
                }


                //tai lieu cua CA NHAN
                if (res.admAccountDetail.laborContract) {
                    this._fileService
                        .getDetailFiles(res.admAccountDetail.laborContract)
                        .subscribe(result => this.laborContract = result.payload);
                }
                if (res.admAccountDetail.rentalContract) {
                    this._fileService
                        .getDetailFiles(res.admAccountDetail.rentalContract)
                        .subscribe(result => this.rentalContract = result.payload);
                }
                if (res.admAccountDetail.fileValues1) {
                    this._fileService
                        .getDetailFiles(res.admAccountDetail.fileValues1)
                        .subscribe(result => this.fileValues1 = result.payload);
                }
                if (res.admAccountDetail.fileValues2) {
                    this._fileService
                        .getDetailFiles(res.admAccountDetail.fileValues2)
                        .subscribe(result => this.fileValues2 = result.payload);
                }

                this.isChecked = (this.loanProfile.isAuto === 1);
            }
        });

    }

    ngOnDestroy(): void {
        this._loanProfilesService.toggle();
        this.routerSubscription.unsubscribe();
    }

    public openFsCardDownDetailDialog(selectedFsCardDown: FsCardDownDTO): void {
        /* this._loanProfilesStoreService
             .getDetailCardDownDTO({fsCardDownId: selectedFsCardDown.fsCardDownId})
             .subscribe((res) => {
                 this.matDialog.open(FSCardDownDetailDialog, {
                     width: '800px',
                     data: res.payload
                 });
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

    public getLoanDetail(): void {
        this.isCallingProfile = this.router.url.includes('borrower/loan-calling');
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) {
            this._loanProfilesService.getDetail(id).subscribe();
        }
    }

    public stopFunding(): void {
        const id = parseInt(this.activatedRoute.snapshot.paramMap.get('id'), 10);
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Xác nhận dừng gọi vốn hồ sơ này?',
            message: 'Bạn thực hiện chức năng này. <br> Hồ sơ của bạn sẽ dừng gọi vốn và chuyển sang giai đoạn giải ngân.',
            actions: {
                confirm: {
                    label: 'Đồng ý'
                },
                cancel: {
                    label: 'Hủy',
                }
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                this._loanProfilesService
                    .stopFunding(id)
                    .subscribe((res) => {
                        if (res.errorCode === '0') {
                            const dialogRef = this.matDialog.open(OtpSmsConfirmComponent, {
                                disableClose: true,
                                data: {
                                    payload: {
                                        otpType: 'LOAN_PROFILES_STOP_FUNDING',
                                    },
                                    title: 'Điền mã xác nhận OTP',
                                    content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất!',
                                    complete: () => {
                                        dialogRef.close();
                                        this._fuseAlertService.showMessageSuccess('Dừng gọi vốn thành công');
                                        this.getLoanDetail();
                                    },
                                }
                            });
                        } else {
                            this._fuseAlertService.showMessageError(res.message.toString());
                        }
                    });
            }
        });
    }

    public canStopFunding(): boolean {
        if (this.loanProfile && this.stopCapital) {
            return this.loanProfile.remainAmount >= this.stopCapital && this.loanProfile.remainAmount < 100;
        }
        return false;
    }

    public updateIsAuto(): void {
        this._loanProfilesService
            .updateIsAuto(this.loanProfile)
            .subscribe((res) => {
                if (res.errorCode !== '0') {
                    this._fuseAlertService.showMessageError(res.message.toString());
                } else {
                    this.isChecked = !this.isChecked;
                    this.sendOtp();
                }
            });
    }

    clickViewImage(id: string): void {
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

    sendOtp(): void {
        const dialogRef = this.matDialog.open(OtpSmsConfirmComponent, {
            data: {
                payload: {
                    otpType: 'LOAN_PROFILES_IS_AUTO',
                },
                title: 'Điền mã xác nhận OTP',
                content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. ' +
                    'Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất thay đổi hình thức phê duyệt khoản đầu tư',
                complete: () => {
                    dialogRef.close();
                    this.getLoanDetail()
                    this._fuseAlertService.showMessageSuccess('Tự động phê duyệt khoản đầu tư thành công');
                    this.isChecked = !this.isChecked;
                    // if (this.matTabGroup) {
                    //     this.matTabGroup.selectedIndex = 2;
                    // }
                },
            }
        });
    };

    isAllInvestorSelected(): boolean {
        const numSelected = this.selectionInvestor.selected.length;
        return numSelected === this.investors.length;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(): void {
        if (this.isAllInvestorSelected()) {
            this.selectionInvestor.clear();
        } else {
            this.investors.forEach(row => this.selectionInvestor.select(row));
        }
    }

    onApproveInvestor(): void {
        const dialogRef = this.matDialog.open(ConfirmProcessingComponent, {
            width: '450px',
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
                maxlenNote: 200,
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                const approveData = {
                    status: response.status,
                    transComment: response.approvalComment,
                    fsLoanProfilesId: this.loanProfile.fsLoanProfilesId,
                    investors: this.selectionInvestor.selected.map(item => ({
                        fsLoanProfilesId: this.loanProfile.fsLoanProfilesId,
                        fsTransInvestorId: item.fsTransInvestorId,
                        transComment: response.approvalComment,
                    }))
                };
                this._loanProfilesService.approvalInvestor(approveData).subscribe((res) => {
                    if (res.errorCode === '0') {
                        const otpDialog = this.matDialog.open(OtpSmsConfirmComponent, {
                            data: {
                                payload: {
                                    otpType: 'LOAN_PROFILES_APPROVAL_INVESTOR',
                                },
                                title: 'Điền mã xác nhận OTP',
                                content: 'Hệ thống đã gửi mã OTP xác thực vào số điện thoại bạn đã đăng ký. ' +
                                    'Vui lòng kiểm tra và điền vào mã xác nhận để hoàn tất phê duyệt khoản đầu tư',
                                complete: () => {
                                    otpDialog.close();
                                    this.getLoanDetail();
                                    this.selectionInvestor.clear();
                                    this._fuseAlertService.showMessageSuccess('Phê duyệt thành công');
                                },
                            }
                        });
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                    dialogRef.close();
                });
            }
        );
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
                    this.getLoanDetail();
                },
            }
        });
    };

    onClickClose() {
        this.getLoanDetail();
        this.displayTranspayReq = false;
        this.fsTranspayReqDTO = undefined;
        // if (this.matTabGroup) {
        //     this.matTabGroup.selectedIndex = 3;
        // }
    }

    tabClick(event: MatTabChangeEvent) {
        this.activeTab = event.index;
    }

    public viewTransPayReq(selectedTransPay: any): void {
        this.displayTranspayReq = true;
        this.fsTranspayReqDTO = selectedTransPay;
    }

    public createTransPayReq(): void {
        this.displayTranspayReq = true;
    }

}
