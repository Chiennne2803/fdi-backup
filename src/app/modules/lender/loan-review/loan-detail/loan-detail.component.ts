import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserType } from 'app/enum';
import {AdmAccountDetailDTO, FsDocuments} from 'app/models/admin';
import {
    FsCardDownDTO,
    FsLoanProfilesDTO,
} from 'app/models/service';
import {DisbursementTransactionService, LoanProfilesReviewService, TranspayReqTransactionService} from 'app/service';
import { FileService } from 'app/service/common-service';
import { Subscription } from 'rxjs';
import {FsCardDownInvestorDTO} from '../../../../models/service/FsCardDownInvestorDTO.model';

@Component({
    selector: 'borrower-loan-detail',
    templateUrl: './loan-detail.component.html',
    styleUrls: ['./loan-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class LoanDetailComponent implements OnInit, OnDestroy {
    @ViewChild('fileDrawer', { static: true }) fileDrawer: MatDrawer;
    @ViewChild('detailFsCardDown', { static: true }) detailFsCardDown: MatDrawer;

    public loanProfile: FsLoanProfilesDTO;
    public admAccountDetail: AdmAccountDetailDTO;
    public investors: FsCardDownInvestorDTO[];
    public fsCardDown: FsCardDownDTO[];
    public avatar: FsDocuments;
    public avatar2: FsDocuments;
    // public financialStatement: FsDocuments[];
    public economicInfoDocuments: FsDocuments[];
    public finDocumentsId: FsDocuments[];
    public legalDocuments: FsDocuments[];
    public businessDocumentation: FsDocuments[];
    public selectedFile: FsDocuments;
    public userType = UserType;
    private routerSubscription: Subscription;

    public legal_documents_config: any[];
    public legal_documents_lst: string[] = [
        'Giấy chứng nhận đăng ký kinh doanh (bản thay đổi gần nhất)',
        'CCCD/Hộ chiếu của Đại diện pháp luật và các cổ đông lớn nhất (mặt trước)',
        'CCCD/Hộ chiếu của Đại diện pháp luật và các cổ đông lớn nhất  ( mặt sau)',
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
        private _loanProfilesReviewService: LoanProfilesReviewService,
        private _fileService: FileService,
        private disbursementTransactionService: DisbursementTransactionService,
        private transpayReqTransactionService: TranspayReqTransactionService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private matDialog: MatDialog,
    ) {
        this.routerSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.getLoanDetail();
            }
        });
    }

    ngOnInit(): void {
        this._loanProfilesReviewService.toggle();
        this.getLoanDetail();
    }

    ngOnDestroy(): void {
        this._loanProfilesReviewService.toggle();
        this.routerSubscription.unsubscribe();
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
            this._loanProfilesReviewService
                .getDetail(id)
                .subscribe((res) => {
                    if(this.fileDrawer != undefined) {
                        this.fileDrawer.close();
                    }

                    this.init_financial_documents_config();
                    this.init_legal_documents_config();
                    this.init_business_documentation_config();
                    this.laborContract = [];
                    this.rentalContract = [];
                    this.fileValues1 = [];
                    this.fileValues2 = [];
                    if (res) {
                        this.loanProfile = res.payload.fsLoanProfiles;
                        this.admAccountDetail = res.payload.admAccountDetail;
                        this.investors = res.payload.investors;
                        this.fsCardDown = res.payload.fsCardDown;

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
                        if (res.payload.admAccountDetail.legalDocuments) {
                            this._fileService
                                .getDetailFiles(res.payload.admAccountDetail.legalDocuments)
                                .subscribe(result => this.legalDocuments = result.payload);
                        }
                        if (res.payload.admAccountDetail.businessDocumentation) {
                            this._fileService
                                .getDetailFiles(res.payload.admAccountDetail.businessDocumentation)
                                .subscribe(result => this.businessDocumentation = result.payload);
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
}
