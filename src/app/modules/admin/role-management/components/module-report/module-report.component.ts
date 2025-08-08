import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {AdmGroupRoleDTO, DecentralizedModel} from 'app/models/admin';
import {DecentralizedService} from 'app/service';
import {AdmRolesDTO} from "../../../../../models/admin/AdmRolesDTO.model";
import {BaseResponse} from "../../../../../models/base";

@Component({
    selector: 'report-decentralization',
    templateUrl: './module-report.component.html',
    styleUrls: ['./module-report.component.scss']
})
export class ModuleReportComponent implements OnInit, AfterViewInit {
    @Input() public lstModuleReportNdt: AdmRolesDTO[] = [];
    @Input() public lstModuleReportHdv: AdmRolesDTO[] = [];
    @Input() public lstModuleReportAcc: AdmRolesDTO[] = [];
    @Input() public lstModuleReport = new Map();
    @Input() public disabled: boolean;

    protected deflstModuleReportNdt: AdmRolesDTO[] = [];
    protected deflstModuleReportHdv: AdmRolesDTO[] = [];
    protected deflstModuleReportAcc: AdmRolesDTO[] = [];

    public displayedColumns: string[] = ['select', 'department'];

    constructor(
        private _decentralizedService: DecentralizedService
    ) {
    }

    ngAfterViewInit(): void {
        // throw new Error('Method not implemented.');
    }

    ngOnInit(): void {
        this._decentralizedService.initAvance$.subscribe((res: BaseResponse) => {
            if (res) {
                this.initData();
            }
        })
        this._decentralizedService.admGroupRoleDetail$.subscribe((res: AdmGroupRoleDTO) => {
            this.initData();
            if (res) {
                if (res.lstModuleReportNdt?.length > 0) {
                    this.lstModuleReportNdt = this.mergeListAdmRoles(this.lstModuleReportNdt, res.lstModuleReportNdt);
                    this.lstModuleReport.set("1", this.lstModuleReportNdt);
                }
                if (res.lstModuleReportHdv?.length > 0) {
                    this.lstModuleReportHdv = this.mergeListAdmRoles(this.lstModuleReportHdv, res.lstModuleReportHdv);
                    this.lstModuleReport.set("2", this.lstModuleReportHdv);
                }
                if (res.lstModuleReportAcc?.length > 0) {
                    this.lstModuleReportAcc = this.mergeListAdmRoles(this.lstModuleReportAcc, res.lstModuleReportAcc);
                    this.lstModuleReport.set("3", this.lstModuleReportAcc);
                }
            }
        })
    }

    private mergeListAdmRoles(lst1: AdmRolesDTO[], lst2: AdmRolesDTO[]) {
        for (let i = 0; i < lst1.length; i++) {
            const matchingItemB = lst2.find((itemB) => itemB.module === lst1[i].module);
            if (matchingItemB) {
                lst1[i] = matchingItemB;
            }
        }
        return lst1;
    }

    private initData(): void {
        this._decentralizedService._prepare.subscribe((res) => {
            if (res) {
                this.deflstModuleReportNdt = [];
                this.deflstModuleReportHdv = [];
                this.deflstModuleReportAcc = [];
                this.lstModuleReportNdt = [];
                this.lstModuleReportHdv = [];
                this.lstModuleReportAcc = [];
                (res.payload.lstModuleReportNdt as string[]).map((el) => {
                    const item = {
                        module: el,
                        isSelect: false,
                        isInsert: false,
                        isUpdate: false,
                        isDelete: false,
                        isExport: false,
                        isAcceptance: false
                    };
                    this.deflstModuleReportNdt.push(item);
                    this.lstModuleReportNdt.push(item);
                });
                (res.payload.lstModuleReportHdv as string[]).map((el) => {
                    const item = {
                        module: el,
                        isSelect: false,
                        isInsert: false,
                        isUpdate: false,
                        isDelete: false,
                        isExport: false,
                        isAcceptance: false
                    };
                    this.deflstModuleReportHdv.push(item);
                    this.lstModuleReportHdv.push(item);
                });
                (res.payload.lstModuleReportAcc as string[]).map((el) => {
                    const item = {
                        module: el,
                        isSelect: false,
                        isInsert: false,
                        isUpdate: false,
                        isDelete: false,
                        isExport: false,
                        isAcceptance: false
                    };
                    this.deflstModuleReportAcc.push(item);
                    this.lstModuleReportAcc.push(item);
                });
                this.lstModuleReport.set("1", this.lstModuleReportNdt);
                this.lstModuleReport.set("2", this.lstModuleReportHdv);
                this.lstModuleReport.set("3", this.lstModuleReportAcc);
            }
        });

        //default init
        if (this.deflstModuleReportNdt.length > 0) {
            this.lstModuleReportNdt = this.deflstModuleReportNdt;
        }
        if (this.deflstModuleReportHdv.length > 0) {
            this.lstModuleReportHdv = this.deflstModuleReportHdv;
        }
        if (this.deflstModuleReportAcc.length > 0) {
            this.lstModuleReportAcc = this.deflstModuleReportAcc;
        }
    }


    onCheckedFull(event: MatCheckboxChange, row: DecentralizedModel): void {
        if (event.checked) {
            row.isSelect = true;
            row.isInsert = true;
            row.isUpdate = true;
            row.isDelete = true;
            row.isExport = true;
            row.isAcceptance = true;
        } else {
            row.isSelect = false;
            row.isInsert = false;
            row.isUpdate = false;
            row.isDelete = false;
            row.isExport = false;
            row.isAcceptance = false;
        }
    }

    onSelectedChange(action: string, row: DecentralizedModel, event: MatCheckboxChange,): void {
        let select = event.checked;
        switch (action) {
            case '_VIEW':
                row.isSelect = select;
                break;
            case '_UPDATE':
                row.isUpdate = select;
                break;
            case '_DELETE':
                row.isDelete = select;
                break;
            case '_EXPORT':
                row.isExport = select;
                break;
            case '_APPROVE':
                row.isAcceptance = select;
                break;
            default:
                break;
        }
    }

    getListReport(): Array<DecentralizedModel[]> {
        return Array.from(this.lstModuleReport.values());
    }

    convertReportName(module: string) {
        if (module.toLowerCase().startsWith("report_sale_invest")) {
            return "Báo cáo sale đầu tư";
        } else if (module.toLowerCase().startsWith("report_sale_brow")) {
            return "Báo cáo sale doanh nghiệp";
        } else if (module.toLowerCase().startsWith("report_accountant")) {
            return "Báo cáo sale kế toán";
        }
    }


}
