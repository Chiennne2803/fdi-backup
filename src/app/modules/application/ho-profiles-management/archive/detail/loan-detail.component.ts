/* eslint-disable prefer-arrow/prefer-arrow-functions */
import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatDrawer} from '@angular/material/sidenav';
import {UserType} from 'app/enum';
import {AdmAccountDetailDTO, AdmCategoriesDTO, FsDocuments} from 'app/models/admin';
import {
    FsCardDownDTO,
    FsLoanProfilesDTO,
    FsTransInvestorDTO,
    FsTranspayInvestorDTO,
    FsTranspayReqDTO,
} from 'app/models/service';
import {ManagementLenderService, ProfilesManagementService,} from 'app/service';
import {FileService} from 'app/service/common-service';
import {STATUS_TEXT_MAP} from '../../profiles-management.config';
import {Observable, Subscription, tap} from 'rxjs';
import {ConfirmProcessingComponent} from '../../../../../shared/components/confirm-processing/confirm-processing.component';
import {MatDialog} from '@angular/material/dialog';
import {FuseAlertService} from '../../../../../../@fuse/components/alert';
import {WindowService} from '../../../../../service/common-service/window.service';
import {MatTab, MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';
import LuckyExcel from 'luckyexcel';
import {AuthService} from '../../../../../core/auth/auth.service';
import {LoanProcessStatus} from '../../../../../enum/loan-process-status.enum';
import {fuseAnimations} from '../../../../../../@fuse/animations';
import {DialogService} from "../../../../../service/common-service/dialog.service";
import {MatTableDataSource} from "@angular/material/table";
import {environment} from "../../../../../../environments/environment";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {FsConfigLoanOfdDTO} from "../../../../../models/service/FsConfigLoanOfdDTO.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {SelectionModel} from "@angular/cdk/collections";
import {DialogProcess1Component} from "./process-dialogs/dialog-process-1.component";
import {DialogProcess2Component} from "./process-dialogs/dialog-process-2.component";
import {DialogProcess3Component} from "./process-dialogs/dialog-process-3.component";
import {DialogProcess4Component} from "./process-dialogs/dialog-process-4.component";
import {DialogProcess5Component} from "./process-dialogs/dialog-process-5.component";
import {DialogProcess6Component} from "./process-dialogs/dialog-process-6.component";
import {DialogProcess7Component} from "./process-dialogs/dialog-process-7.component";
import {CheckboxColumn, TextColumn} from "../../../../../shared/models/datatable/display-column.model";
import {ExcelService} from "../../../../../service/common-service/excel.service";
import {OtpSmsConfirmComponent} from "../../../../../shared/components/otp-sms-confirm/otp-sms-confirm.component";
import {ActivatedRoute} from "@angular/router";
import {BaseRequest} from "../../../../../models/base";
import {AdmCollateralDTO} from "../../../../../models/admin/AdmCollateralDTO.model";
import {ProcessScheduler} from "../../../../admin/process-config/process-config.config";
import {AdmCreditLimitDTO} from "../../../../../models/admin/AdmCreditLimitDTO.model";
import {AdmValuationHistoryDTO} from "../../../../../models/admin/AdmValuationHistoryDTO.model";

@Component({
    selector: 'profiles-management-detail',
    templateUrl: './loan-detail.component.html',
    styleUrls: ['./loan-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LoanDetailComponent implements OnInit, OnDestroy {
    @Input() hasApproveBtn: boolean = false;
    @ViewChild('fileDrawer', {static: true}) fileDrawer: MatDrawer;
    @ViewChild(MatTabGroup) matTabGroup: MatTabGroup;
    @Output() public handleCloseDetailPanel: EventEmitter<Event> = new EventEmitter<Event>();
    public configLoanOfdForm: FormGroup = new FormGroup({});
    selectionInvestor = new SelectionModel<FsTransInvestorDTO>(true, []);
    selectionCarddow = new SelectionModel<FsCardDownDTO>(true, []);
    selectionTransPay = new SelectionModel<FsTranspayReqDTO>(true, []);
    selectionPayInv = new SelectionModel<FsTransInvestorDTO>(true, []);

    public loanProfile: Observable<{
        fsLoanProfiles: FsLoanProfilesDTO;
        fsConfigLoanOfd: FsConfigLoanOfdDTO;
        admAccountDetail: AdmAccountDetailDTO;
        lstApprovedByProcess1: AdmAccountDetailDTO[];
        lstApprovedByProcess3: AdmAccountDetailDTO[];
        investors: FsTransInvestorDTO[];
        fsCardDowns: FsCardDownDTO[];
        transpayReqs: FsTranspayReqDTO[];
        transpayInvestors: FsTranspayInvestorDTO[];
        admCollaterals: AdmCollateralDTO[];
        creditHistories: FsLoanProfilesDTO[];
        creditLimitDTOS: AdmCreditLimitDTO[];
    }>;
    public avatar: FsDocuments;
    // public financialStatement: FsDocuments[];
    public reportLoanProfileAtt: FsDocuments[];
    public economicInfoDocuments: FsDocuments[];
    public finDocumentsId: FsDocuments[];

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

    //file ca nhan
    public finDocumentsIds: FsDocuments[];
    public laborContract: FsDocuments[];
    public rentalContract: FsDocuments[];
    public fileValues1: FsDocuments[];
    public fileValues2: FsDocuments[];

    public businessDocumentation: FsDocuments[];
    public selectedFile: FsDocuments;

    public statusTextMap = STATUS_TEXT_MAP;
    public userType = UserType;
    public fsLoanProfileId: number = 0;
    public admAccountDetail: AdmAccountDetailDTO;
    private searchPayload: BaseRequest = new BaseRequest();
    private paramsSubscription: Subscription;

    public processButton: string[] = ['1', '2', '3', '4', '5', '6', '7'];

    public pageSizeOptions = environment.pageSizeOptions;

    @ViewChild('investorPaginator') investorPaginator: MatPaginator;
    public investorDataSource = new MatTableDataSource<any>();
    public investorLengthRecords: number = 0;
    public investorPageSize: number = 0;

    @ViewChild('fsCardDownPaginator') fsCardDownPaginator: MatPaginator;
    public fsCardDownDataSource = new MatTableDataSource<any>();
    public fsCardDownLengthRecords: number = 0;
    public fsCardDownPageSize: number = 0;

    @ViewChild('transpayReqPaginator') transpayReqPaginator: MatPaginator;
    public transpayReqDataSource = new MatTableDataSource<any>();
    public transpayReqLengthRecords: number = 0;
    public transpayReqPageSize: number = 0;

    @ViewChild('transpayInvestorPaginator') transpayInvestorPaginator: MatPaginator;
    public transpayInvestorDataSource = new MatTableDataSource<any>();
    public transpayInvestorLengthRecords: number = 0;
    public transpayInvestorPageSize: number = 0;

    public choices: [{ name: string; value: number }, { name: string; value: number }, { name: string; value: number }] = [
        {value: 1, name: 'Trả gốc'},
        {value: 2, name: 'Trả gốc + Lãi trong hạn'},
        {value: 3, name: 'Trả gốc + Lãi trong hạn + Lãi quá hạn'}
    ];
    public taxChoices: [{ name: string; value: number }, { name: string; value: number }, { name: string; value: number }] = [
        {value: 1, name: 'LinkFiin'},
        {value: 2, name: 'Bên huy động'},
        {value: 3, name: 'Nhà đầu tư'}
    ];
    @ViewChild('admCollateralPaginator') admCollateralPaginator: MatPaginator;
    public admCollateralDataSource = new MatTableDataSource<any>();

    public admCollateralLengthRecords: number = 0;
    public admCollateralPageSize: number = 0;

    @ViewChild('valuationHistoryPaginator') valuationHistoryPaginator: MatPaginator;
    public valuationHistoryDataSource = new MatTableDataSource<any>();
    public valuationHistoryLengthRecords: number = 0;
    public valuationHistoryPageSize: number = 0;
    public selectedAdmCollateral: AdmCollateralDTO;
    public isSrcCollateral: boolean;
    public collateralUpdateMode: string;
    public collateralFileId: FsDocuments[];
    public collateralType: AdmCategoriesDTO[];
    public assetType: AdmCategoriesDTO[];
    public oldFrontPhotoIdentication: string;
    public oldBacksitePhotoIdentication: string;
    public hasReplaceBtn: boolean = false;

    @ViewChild('creditHistoriesPaginator') creditHistoriesPaginator: MatPaginator;
    creditHistoriesLengthRecords = new MatTableDataSource<any>();
    public creditHistoriesPageSize: number = 0;

    public creditLimitDTOSDataSource = new MatTableDataSource<any>();
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private _fileService: FileService,
        private _profilesManagementService: ProfilesManagementService,
        private matDialog: MatDialog,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService,
        private windowService: WindowService,
        private _authService: AuthService,
        private _excelService: ExcelService,
        private _managementLenderService: ManagementLenderService,
        private route: ActivatedRoute
    ) {
        this.init_financial_documents_config();
        this.init_legal_documents_config();
        this.init_business_documentation_config();
        this.paramsSubscription = this.route.params.subscribe(params => {
            this.searchPayload = {
                ...this.searchPayload,
                screenMode: params.key
            }
        })
    }

    ngOnDestroy(): void {
        this.paramsSubscription.unsubscribe();
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

    ngOnInit(): void {
        this.initForm();
        this.fsLoanProfileId = 0;
        this.loanProfile = this._profilesManagementService
            .selectedProfile$.pipe(
                tap((res) => {
                    if (this.matTabGroup) {
                        this.matTabGroup.selectedIndex = 0;
                    }
                    this.investorDataSource = undefined;
                    this.fsLoanProfileId = undefined;
                    this.avatar = undefined;
                    // this.financialStatement = undefined;
                    this.reportLoanProfileAtt = undefined;
                    this.finDocumentsId = undefined;
                    this.economicInfoDocuments = undefined;

                    this.init_business_documentation_config();
                    this.init_legal_documents_config();
                    this.init_legal_documents_config();

                    this.finDocumentsIds = [];
                    this.laborContract = [];
                    this.rentalContract = [];
                    this.fileValues1 = [];
                    this.fileValues2 = [];

                    if (res) {
                        if (res.investors?.length > 0) {
                            this.investorDataSource = new MatTableDataSource(res.investors);
                            this.investorLengthRecords = res.investors.length;
                            this.investorDataSource.paginator = this.investorPaginator;
                        }

                        if (res.fsCardDowns?.length > 0) {
                            this.fsCardDownDataSource = new MatTableDataSource(res.fsCardDowns);
                            this.fsCardDownLengthRecords = res.fsCardDowns.length;
                            this.fsCardDownDataSource.paginator = this.fsCardDownPaginator;
                        }
                        if (res.transpayReqs?.length > 0) {
                            this.transpayReqDataSource = new MatTableDataSource(res.transpayReqs);
                            this.transpayReqLengthRecords = res.transpayReqs.length;
                            this.transpayReqDataSource.paginator = this.transpayReqPaginator;
                        }
                        if (res.transpayInvestors?.length > 0) {
                            this.transpayInvestorDataSource = new MatTableDataSource(res.transpayInvestors);
                            this.transpayInvestorLengthRecords = res.transpayInvestors.length;
                            this.transpayInvestorDataSource.paginator = this.transpayInvestorPaginator;
                        }

                        if (res.admCollaterals?.length > 0) {
                            this.admCollateralDataSource = new MatTableDataSource(res.admCollaterals);
                            this.admCollateralLengthRecords = res.admCollaterals.length;
                            this.admCollateralDataSource.paginator = this.admCollateralPaginator;
                        }
                        if (res.creditHistories?.length > 0) {
                            this.creditHistoriesLengthRecords = new MatTableDataSource(res.creditHistories);
                            // this.creditHistoriesLengthRecords = res.creditHistories.length;
                            this.creditHistoriesLengthRecords.paginator = this.creditHistoriesPaginator;
                        }

                        if (res.creditLimitDTOS?.length > 0) {
                            this.creditLimitDTOSDataSource = new MatTableDataSource(res.creditLimitDTOS);
                        }

                        if (this.fileDrawer !== undefined) {
                            this.fileDrawer.close();
                        }
                        if (res.fsLoanProfiles) {
                            this.fsLoanProfileId = res.fsLoanProfiles.fsLoanProfilesId;
                        }
                        if (res.admAccountDetail) {
                            this.admAccountDetail = res.admAccountDetail;
                        }
                        if (res.fsConfigLoanOfd) {
                            this.initForm(res.fsConfigLoanOfd);
                        }
                        if (res.admAccountDetail.avatar) {
                            this._fileService
                                .getFileFromServer(res.admAccountDetail.avatar)
                                .subscribe(avatar => this.avatar = avatar.payload);
                        }
                        // if (res.fsLoanProfiles.financialStatement) {
                        //     this._fileService
                        //         .getDetailFiles(res.fsLoanProfiles.financialStatement)
                        //         .subscribe(result => this.financialStatement = result.payload);
                        // }
                        if (res.fsLoanProfiles.reportLoanProfileAtt) {
                            this._fileService
                                .getDetailFiles(res.fsLoanProfiles.reportLoanProfileAtt)
                                .subscribe(result => this.reportLoanProfileAtt = result.payload);
                        }
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
                        if (res.fsLoanProfiles.finDocumentsId) {
                            this._fileService
                                .getDetailFiles(res.fsLoanProfiles.finDocumentsId)
                                .subscribe(result => this.finDocumentsIds = result.payload);
                        }
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
                    }
                })
            );
        this._managementLenderService.prepare().subscribe(res =>{
            if (res.payload.collateralType) {
                this.collateralType = res.payload.collateralType;
            }
            if (res.payload.assetType) {
                this.assetType = res.payload.assetType;
            }
        })

    }

    private initForm(fsConfigLoanOfdDTO?: FsConfigLoanOfdDTO): void {
        this.configLoanOfdForm = this._formBuilder.group({
            fsConfigLoanOfdId: new FormControl(fsConfigLoanOfdDTO?.fsConfigLoanOfdId),
            fsLoanProfilesId: new FormControl(fsConfigLoanOfdDTO?.fsLoanProfilesId),
            admAccountId: new FormControl(fsConfigLoanOfdDTO?.admAccountId),
            payType: new FormControl(fsConfigLoanOfdDTO?.payType),
            outstandInterestOfOrigin: new FormControl(fsConfigLoanOfdDTO?.outstandInterestOfOrigin),
            outstandInterestOfInterest: new FormControl(fsConfigLoanOfdDTO?.outstandInterestOfInterest),
            taxDeclarationType: new FormControl(fsConfigLoanOfdDTO?.taxDeclarationType),
            fee: new FormControl(fsConfigLoanOfdDTO ? fsConfigLoanOfdDTO.fee : null, [Validators.required, Validators.min(0)])

        });
    }

    public showSheet(event: MatTabChangeEvent, financialStatement: string): void {
        if (financialStatement && event.index === 1) {
            const nativeWindow = this.windowService.nativeWindow;
            this._fileService.getFileFromServer(financialStatement).subscribe((res) => {
                const options = {
                    container: 'luckysheet',
                    lang: 'en',
                    allowCopy: false,
                    showtoolbar: false,
                    showinfobar: false,
                    showsheetbar: true,
                    showsheetbarConfig: {
                        add: false,
                        menu: false,
                        sheet: true
                    },
                    showstatisticBar: true,
                    showstatisticBarConfig: {
                        count: false,
                        view: false,
                        zoom: true
                    },
                    sheetBottomConfig: true,
                    sheetBottomConfigConfig: {
                        addRow: false,
                        backTop: false
                    },
                    allowEdit: false,
                    enableAddRow: false,
                    enableAddCol: false,
                    userInfo: false,
                    cellRightClickConfig: {
                        copy: false,
                        copyAs: false,
                        paste: false,
                        insert: false,
                        delete: false,
                        hide: false,
                        deleteCell: false,
                        clear: false,
                        matrix: false,
                        sort: false,
                        chart: false
                    },
                    sheetRightClickConfig: {
                        delete: false,
                        copy: false,
                        rename: false,
                        color: false,
                        hide: false,
                        show: false,
                        left: false,
                        right: false
                    },
                    zoomRatio: 0.9,
                    showRowBar: false,
                    showColumnBar: false,
                    sheetFormulaBar: false,
                    defaultFontSize: 13,
                };
                if (res?.payload?.type === 'xlsx') {
                    fetch(res.payload.contentBase64).then(resBase64 => resBase64.blob()).then((blobData) => {
                        LuckyExcel.transformExcelToLucky(
                            blobData,
                            function(exportJson) {
                                nativeWindow.$(function() {
                                    nativeWindow.luckysheet.create({
                                        ...options,
                                        data: exportJson.sheets,
                                    });
                                });
                            },
                            function(error) {
                            }
                        );
                    });
                } else {
                    nativeWindow.$(function() {
                        nativeWindow.luckysheet.create({
                            ...options,
                        });
                    });
                }
            });
        }
    }

    public onClose(): void {
        this._profilesManagementService.closeDetailDrawer();
        this.handleCloseDetailPanel.emit();
    }

    public downloadFile(id: string): void {
        this._fileService.downloadFile(id);
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

    public onClickFile(file: FsDocuments): void {
        if(file) {
            this.selectedFile = file;
            this.fileDrawer.open();
            if (['JPG', 'JPEG', 'PNG'].includes(file.type.toUpperCase())) {
                this._fileService.getFileFromServer(file.finDocumentsId + '').subscribe(
                    res => this.selectedFile = res.payload
                );
            }
        }else {
            this._fuseAlertService.showMessageWarning("Không có dữ liệu");
        }
    }

    public onClickApprove(): void {
        const dialogRef = this.matDialog.open(ConfirmProcessingComponent, {
            width: '600px',
            data: {
                title: 'Xử lý hồ sơ vay',
                subTitle: 'Xác nhận phê duyệt hồ sơ vay',
                valueDefault: 1,
                financialStatement: true,
                reportLoanProfileAtt: true,
                valueReject: 0,
                choices: [
                    {
                        value: 1,
                        name: 'Phê duyệt',
                    },
                    {
                        value: 0,
                        name: 'Từ chối(Ghi rõ lý do)',
                    }
                ],
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                this._profilesManagementService.update({...response, fsLoanProfilesId: this.fsLoanProfileId }
                ).subscribe((res) => {
                    this._fuseAlertService.showMessageSuccess('Xử lý thành công');
                    dialogRef.close();
                    this._profilesManagementService.closeDetailDrawer();
                    this._profilesManagementService.doSearchLoanProfileReview(this.searchPayload).subscribe();
                    this.handleCloseDetailPanel.emit();
                });
            }
        );
    }

    public hasPermission(permission: string): boolean {
        return this._authService.authenticatedUser.roles.includes(permission);
    }

    public withStatus(index: number, processStatus: number): boolean {
        if (index === 1 && this.hasPermission('SFF_PROFILE_RECEIPT_SALE_MANAGER_APPROVE') && processStatus === LoanProcessStatus.PROCCESS_STATUS_1) {
            return true;
        } else if (index === 2 && this.hasPermission('SFF_PROFILE_REVIEW_BUSINESS_SALE_APPROVE') && processStatus === LoanProcessStatus.PROCCESS_STATUS_2) {
            return true;
        } else if (index === 2 && this.hasPermission('SFF_PROFILE_RE_REVIEW_BUSINESS_SALE_APPROVE') && processStatus === LoanProcessStatus.PROCCESS_STATUS_22) {
            return true;
        } else if (index === 3 && this.hasPermission('SFF_PROFILE_RECEIPT_HEAD_OF_APPRAISAL_APPROVE') && processStatus === LoanProcessStatus.PROCCESS_STATUS_3) {
            return true;
        } else if (index === 4 && this.hasPermission('SFF_PROFILE_REVIEW_APPRAISAL_STAFF_APPROVE') && processStatus === LoanProcessStatus.PROCCESS_STATUS_4) {
            return true;
        } else if (index === 4 && this.hasPermission('SFF_PROFILE_RE_REVIEW_APPRAISAL_STAFF_APPROVE') && processStatus === LoanProcessStatus.PROCCESS_STATUS_42) {
            return true;
        } else if (index === 5 && this.hasPermission('SFF_PROFILE_REVIEW_HEAD_OF_APPRAISAL_APPROVE') && processStatus === LoanProcessStatus.PROCCESS_STATUS_5) {
            return true;
        } else if (index === 5 && this.hasPermission('SFF_PROFILE_RE_REVIEW_HEAD_OF_APPRAISAL_APPROVE') && processStatus === LoanProcessStatus.PROCCESS_STATUS_52) {
            return true;
        } else if (index === 6 && this.hasPermission('SFF_PROFILE_REVIEW_CEO_APPROVE') && processStatus === LoanProcessStatus.PROCCESS_STATUS_6) {
            return true;
        } else if (index === 7 && this.hasPermission('SFF_PROFILE_REVIEW_CREDIT_COMMITTEE_APPROVE') && processStatus === LoanProcessStatus.PROCCESS_STATUS_7) {
            return true;
        }
        return false;
    }

    public receive(data: FsLoanProfilesDTO): void {
        let confirmDialog = this._dialogService.openConfirmDialog('Tiếp nhận hồ sơ ?');
        confirmDialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                if (data.processStatus == 1) {
                    this._profilesManagementService.doProcess1({
                        approvalBy: this._authService.authenticatedUser.admAccountId,
                        fsLoanProfilesId: data.fsLoanProfilesId
                    }).subscribe(resturn => {
                        if (resturn.errorCode === '0') {
                            this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
                            this.onClose();
                            this._fuseAlertService.showMessageSuccess('Tiếp nhận hồ sơ thành công');
                        } else {
                            this._fuseAlertService.showMessageError(res.message.toString());
                        }

                    })
                } else if (data.processStatus == 3) {
                    this._profilesManagementService.doProcess3({
                        approvalBy: this._authService.authenticatedUser.admAccountId,
                        fsLoanProfilesId: data.fsLoanProfilesId
                    }).subscribe(resturn => {
                        if (resturn.errorCode === '0') {
                            this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
                            this.onClose();
                            this._fuseAlertService.showMessageSuccess('Tiếp nhận hồ sơ thành công');
                        } else {
                            this._fuseAlertService.showMessageError(res.message.toString());
                        }
                    })
                }
            }
        });
    }

    public onClickProcess(step: number, data: any, processStatus: number): void {
        let isReReview = false;
        if (processStatus == 22 || processStatus == 42 || processStatus == 52) {
            isReReview = true;
        }
        let dialogRef;
        switch (step) {
            case 1:
                dialogRef = this.matDialog.open(DialogProcess1Component, {
                    width: '400px',
                    disableClose: true,
                    data: {
                        lstApprovedByProcess1: data.lstApprovedByProcess1,
                    },
                });
                dialogRef.componentInstance.onSubmit.subscribe(
                    (response) => {
                        this._profilesManagementService.doProcess1({...response, fsLoanProfilesId: this.fsLoanProfileId }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
                                dialogRef.close();
                                this.onClose();
                                this._fuseAlertService.showMessageSuccess('Chuyển xử lý hồ sơ thành công');
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                                dialogRef.close();
                            }
                        });
                    }
                );
                break;
            case 2:
                dialogRef = this.matDialog.open(DialogProcess2Component, {
                    width: '850px',
                    disableClose: true,
                    data : this.admAccountDetail
                });
                dialogRef.componentInstance.onSubmit.subscribe(
                    (response) => {
                        this._profilesManagementService.doProcess2({...response, fsLoanProfilesId: this.fsLoanProfileId }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                if (isReReview) {
                                    this._profilesManagementService.doSearchLoanProfileReReview(this.searchPayload).subscribe();
                                } else {
                                    this._profilesManagementService.doSearchLoanProfileReview(this.searchPayload).subscribe();
                                }
                                this._fuseAlertService.showMessageSuccess('Xử lý hồ sơ thành công');
                                dialogRef.close();
                                this.onClose();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                                dialogRef.close();
                            }
                        });
                    }
                );
                break;
            case 3:
                dialogRef = this.matDialog.open(DialogProcess3Component, {
                    width: '400px',
                    disableClose: true,
                    data: {
                        lstApprovedByProcess3: data.lstApprovedByProcess3,
                    },
                });
                dialogRef.componentInstance.onSubmit.subscribe(
                    (response) => {
                        this._profilesManagementService.doProcess3({...response, fsLoanProfilesId: this.fsLoanProfileId }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                this._profilesManagementService.doSearchLoanProfileReception(this.searchPayload).subscribe();
                                this._fuseAlertService.showMessageSuccess('Xử lý hồ sơ thành công');
                                dialogRef.close();
                                this.onClose();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                                dialogRef.close();
                            }
                        });
                    }
                );
                break;
            case 4:
                dialogRef = this.matDialog.open(DialogProcess4Component, {
                    width: '850px',
                    disableClose: true,
                });
                dialogRef.componentInstance.onSubmit.subscribe(
                    (response) => {
                        this._profilesManagementService.doProcess4({...response, fsLoanProfilesId: this.fsLoanProfileId }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                if (isReReview) {
                                    this._profilesManagementService.doSearchLoanProfileReReview(this.searchPayload).subscribe();
                                } else {
                                    this._profilesManagementService.doSearchLoanProfileReview(this.searchPayload).subscribe();
                                }
                                this._fuseAlertService.showMessageSuccess('Xử lý hồ sơ thành công');
                                dialogRef.close();
                                this.onClose();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                                dialogRef.close();
                            }
                        });
                    }
                );
                break;
            case 5:
                dialogRef = this.matDialog.open(DialogProcess5Component, {
                    width: '850px',
                    disableClose: true,
                });
                dialogRef.componentInstance.onSubmit.subscribe(
                    (response) => {
                        this._profilesManagementService.doProcess5({...response, fsLoanProfilesId: this.fsLoanProfileId }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                if (isReReview) {
                                    this._profilesManagementService.doSearchLoanProfileReReview(this.searchPayload).subscribe();
                                } else {
                                    this._profilesManagementService.doSearchLoanProfileReview(this.searchPayload).subscribe();
                                }
                                this._fuseAlertService.showMessageSuccess('Xử lý hồ sơ thành công');
                                dialogRef.close();
                                this.onClose();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                                dialogRef.close();
                            }
                        });
                    }
                );
                break;
            case 6:
                dialogRef = this.matDialog.open(DialogProcess6Component, {
                    width: '850px',
                    disableClose: true,
                });
                dialogRef.componentInstance.onSubmit.subscribe(
                    (response) => {
                        this._profilesManagementService.doProcess6({...response, fsLoanProfilesId: this.fsLoanProfileId }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                if (isReReview) {
                                    this._profilesManagementService.doSearchLoanProfileReReview(this.searchPayload).subscribe();
                                } else {
                                    this._profilesManagementService.doSearchLoanProfileReview(this.searchPayload).subscribe();
                                }
                                this._fuseAlertService.showMessageSuccess('Xử lý hồ sơ thành công');
                                dialogRef.close();
                                this.onClose();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                                dialogRef.close();
                            }
                        });
                    }
                );
                break;
            case 7:
                dialogRef = this.matDialog.open(DialogProcess7Component, {
                    width: '850px',
                    disableClose: true,
                });
                dialogRef.componentInstance.onSubmit.subscribe(
                    (response) => {
                        this._profilesManagementService.doProcess7({...response, fsLoanProfilesId: this.fsLoanProfileId }).subscribe((res) => {
                            if (res.errorCode === '0') {
                                if (isReReview) {
                                    this._profilesManagementService.doSearchLoanProfileReReview(this.searchPayload).subscribe();
                                } else {
                                    this._profilesManagementService.doSearchLoanProfileReview(this.searchPayload).subscribe();
                                }
                                this._fuseAlertService.showMessageSuccess('Xử lý hồ sơ thành công');
                                dialogRef.close();
                                this.onClose();
                            } else {
                                this._fuseAlertService.showMessageError(res.message.toString());
                                dialogRef.close();
                            }
                        });
                    }
                );
                break;
        }

    }

    updateConfigLoanOfd() {
        let confirmDialog = this._dialogService.openConfirmDialog('Xác nhận cập nhật cấu hình ?');
        confirmDialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                    this._profilesManagementService.updateConfigLoanOfd({...this.configLoanOfdForm.value,
                        outstandInterestOfOrigin : this.configLoanOfdForm.get('payType').value == 3 ? this.configLoanOfdForm.get('outstandInterestOfOrigin').value ? 1 : 0 : 0,
                        outstandInterestOfInterest : this.configLoanOfdForm.get('payType').value == 3 ? this.configLoanOfdForm.get('outstandInterestOfInterest').value ? 1 : 0 : 0,
                        fee : this.configLoanOfdForm.get('fee').value
                    }).subscribe(resturn => {
                        if (resturn.errorCode === '0') {
                            this.initForm(resturn.payload);
                            this._fuseAlertService.showMessageSuccess('Cập nhật cấu hình thành công');
                        } else {
                            this._fuseAlertService.showMessageError(resturn.message.toString());
                        }

                    })
            }
        });
    }



    get checkDispalyBtnApproval(): boolean {
        return this.selectionInvestor.selected.filter(investor => investor.status === 1).length === this.selectionInvestor.selected.length
            && this.selectionInvestor.selected.length > 0;
    }

    masterToggle(): void {
        if (this.isAllInvestorSelected()) {
            this.selectionInvestor.clear();
        } else {
            this.investorDataSource.data.forEach(row => this.selectionInvestor.select(row));
        }
    }

    isAllInvestorSelected(): boolean {
        const numSelected = this.selectionInvestor.selected.length;
        return numSelected === this.investorDataSource.data.length;
    }

    onApproveInvestor() {
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
                complete: () => {
                    dialogRef.close();
                },
            },
        });
        dialogRef.componentInstance.onSubmit.subscribe(
            (response) => {
                const approveData = {
                    status: response.status,
                    approvalComment: response.approvalComment,
                    fsLoanProfilesId: this.fsLoanProfileId,
                    investors: this.selectionInvestor.selected.map(item => ({
                        fsLoanProfilesId: this.fsLoanProfileId,
                        fsTransInvestorId: item.fsTransInvestorId
                    }))
                };
                this._profilesManagementService.approvalInvestor(approveData).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this.selectionInvestor.clear();
                        if (res.payload?.length > 0) {
                            this.investorDataSource = new MatTableDataSource(res.payload);
                            this.investorLengthRecords = res.payload.length;
                            this.investorDataSource.paginator = this.investorPaginator;
                        }
                        this._fuseAlertService.showMessageSuccess('Phê duyệt thành công');
                    } else {
                        this._fuseAlertService.showMessageError(res.message.toString());
                    }
                    dialogRef.close();
                });
            }
        );
    }

    get checkDispalyBtnExportTranInvestor(): boolean {
        return this.selectionInvestor.selected.length > 0;
    }

    onExportTranInvestor() {
        let columnDefinition = [
            new CheckboxColumn(),
            new TextColumn('fullName', 'Nhà đầu tư', 10),
            new TextColumn('amount', 'Số tiền đầu tư', 15, false, 3),
            new TextColumn('createdDate', 'Ngày đầu tư', 10, false, 'DD/MM/YYYY - HH:mm:ss'),
            new TextColumn('statusName', 'Trạng thái', 10, false),
        ]           ;
        this._excelService.exportExcel(columnDefinition,
            ['fullName', 'amount', 'createdDate', 'statusName'],
            this.selectionInvestor.selected, this.fsLoanProfileId +'_dau_tu', 'Đầu tư');
    }

    getTotalInv() {
        return this.investorDataSource.data.map(t => t.amount).reduce((acc, value) => acc + value, 0);
    }

    getTotalCarddow() {
        return this.fsCardDownDataSource.data.map(t => t.amount).reduce((acc, value) => acc + value, 0);
    }

    get checkDispalyBtnExportCd(): boolean {
        return this.selectionCarddow.selected.length > 0;
    }

    masterToggleCd(): void {
        if (this.isAllCdSelected()) {
            this.selectionCarddow.clear();
        } else {
            this.fsCardDownDataSource.data.forEach(row => this.selectionCarddow.select(row));
        }
    }

    isAllCdSelected(): boolean {
        const numSelected = this.selectionCarddow.selected.length;
        return numSelected === this.fsCardDownDataSource.data.length;
    }

    onExportCd() {
        let columnDefinition = [
            new CheckboxColumn(),
            new TextColumn('transCode', 'Mã yêu cầu', 10),
            new TextColumn('amount', 'Số tiền giải ngân', 15, false, 3),
            new TextColumn('createdDate', 'Ngày lập', 10, false, 'DD/MM/YYYY - HH:mm:ss'),
            new TextColumn('statusName', 'Trạng thái', 10, false),
        ]           ;
        this._excelService.exportExcel(columnDefinition,
            ['transCode', 'amount', 'createdDate', 'statusName'],
            this.selectionCarddow.selected, this.fsLoanProfileId +'_giai_ngan', 'Giải Ngân');
    }

    getTotalTranspay() {
        return this.transpayReqDataSource.data.map(t => t.paidAmount).reduce((acc, value) => acc + value, 0);
    }

    get checkDispalyBtnExportTranPay(): boolean {
        return this.selectionTransPay.selected.length > 0;
    }

    masterToggleTransPay(): void {
        if (this.isAllTranspaySelected()) {
            this.selectionTransPay.clear();
        } else {
            this.transpayReqDataSource.data.forEach(row => this.selectionTransPay.select(row));
        }
    }

    isAllTranspaySelected(): boolean {
        const numSelected = this.selectionTransPay.selected.length;
        return numSelected === this.transpayReqDataSource.data.length;
    }

    onExportTranspay() {
        let columnDefinition = [
            new CheckboxColumn(),
            new TextColumn('transCode', 'Mã yêu cầu', 10),
            new TextColumn('fsCardDownCode', 'Đợt giải ngân', 10),
            new TextColumn('amount', 'Số tiền thanh toán', 15, false, 3),
            new TextColumn('createdDate', 'Ngày lập YC thanh toán', 10, false, 'DD/MM/YYYY - HH:mm:ss'),
            new TextColumn('statusName', 'Trạng thái', 10, false),
        ]           ;
        this._excelService.exportExcel(columnDefinition,
            ['transCode', 'fsCardDownCode', 'amount', 'createdDate', 'statusName'],
            this.selectionTransPay.selected, this.fsLoanProfileId +'_hoan_tra', 'Hoàn trả');
    }

    getTotalPayInv() {
        return this.transpayInvestorDataSource.data.map(t => t.amount + t.interest).reduce((acc, value) => acc + value, 0);
    }

    get checkDispalyBtnExportPayInv(): boolean {
        return this.selectionPayInv.selected.length > 0;
    }

    masterTogglePayInv(): void {
        if (this.isAllPayInvSelected()) {
            this.selectionPayInv.clear();
        } else {
            this.transpayInvestorDataSource.data.forEach(row => this.selectionPayInv.select(row));
        }
    }

    isAllPayInvSelected(): boolean {
        const numSelected = this.selectionPayInv.selected.length;
        return numSelected === this.transpayInvestorDataSource.data.length;
    }

    onExportPayInv() {
        let columnDefinition = [
            new CheckboxColumn(),
            new TextColumn('transCode', 'Mã yêu cầu', 10),
            new TextColumn('fsCardDownCode', 'Đợt giải ngân', 10),
            new TextColumn('amount', 'Số tiền thanh toán', 15, false, 3),
            new TextColumn('createdDate', 'Ngày lập YC thanh toán', 10, false, 'DD/MM/YYYY - HH:mm:ss'),
            new TextColumn('statusName', 'Trạng thái', 10, false),
        ]           ;
        this._excelService.exportExcel(columnDefinition,
            ['transCode', 'fsCardDownCode', 'amount', 'createdDate', 'statusName'],
            this.selectionPayInv.selected, this.fsLoanProfileId +'_hoan_tra_ndt', 'Hoàn trả NDT');
    }

    updateCollateralMode(admCollateralDTO: AdmCollateralDTO) {
        this.selectedAdmCollateral = admCollateralDTO;
        this.isSrcCollateral = true;
        this.collateralUpdateMode = 'view';
        this.matTabGroup.selectedIndex = 0;
        if (admCollateralDTO.fileId) {
            this._fileService
                .getDetailFiles(admCollateralDTO.fileId)
                .subscribe(result => this.collateralFileId = result.payload);
        }
        this.initForm(admCollateralDTO);
        this._managementLenderService.getValuationHistory({
            admCollateralId: admCollateralDTO.admCollateralId,
            admAccountId: admCollateralDTO.admAccountId
        }).subscribe((res: any) => {
            if (res) {
                if (res.length > 0) {
                    res.map((obj: AdmValuationHistoryDTO) => {
                        if (obj.fileId) {
                            this._fileService
                                .getDetailFiles(obj.fileId)
                                .subscribe(result => obj.fileIdObj = result.payload);
                        }
                    })
                }
                this.valuationHistoryDataSource = new MatTableDataSource(res);
                this.valuationHistoryLengthRecords = res.length;
                setTimeout(() => this.valuationHistoryDataSource.paginator = this.valuationHistoryPaginator, 1000);
            }
        })
    }

    getCollateralTypeName(collateralType: number) {
        if (collateralType) {
            return this.collateralType?.filter(c => c.admCategoriesId == collateralType)[0].categoriesName;
        }
    }
    getRaisingCapitalName(raisingCapital: number) {
        if (raisingCapital) {
            return this.assetType?.filter(c => c.admCategoriesId == raisingCapital)[0].categoriesName;
        }
    }


    public onCloseSrcCollateral(): void {
        this.isSrcCollateral = false;
        setTimeout(() => {
            if (this.matTabGroup) {
                this.matTabGroup._tabs?.forEach((tab: MatTab) => {
                    if (tab.textLabel == 'Tài sản bảo đảm') {
                        this.matTabGroup.selectedIndex = tab.position;
                    }
                })
            }
        }, 100);
    }

    public onClickFile1(file: FsDocuments, colume?: string, admCollateral?: AdmCollateralDTO): void {
        this.hasReplaceBtn = true;
        this.selectedFile = file;
        if (admCollateral) {
            this.selectedAdmCollateral = admCollateral;
        }
        this.fileDrawer.open();
        if (['JPG', 'JPEG', 'PNG'].includes(file.type.toUpperCase())) {
            this._fileService.getFileFromServer(file.finDocumentsId + '').subscribe(
                res => {
                    this.selectedFile = res.payload;
                    if (this.selectedFile.finDocumentsId.toString() == this.oldFrontPhotoIdentication) {
                        this.selectedFile.colume = "frontPhotoIdentication";
                    } else if (this.selectedFile.finDocumentsId.toString() == this.oldBacksitePhotoIdentication) {
                        this.selectedFile.colume = "backsitePhotoIdentication";
                    } else {
                        this.selectedFile.colume = colume;
                    }
                }
            );
        }
    }



}
