import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {MatPaginator} from '@angular/material/paginator';
import {MatTabChangeEvent, MatTabGroup} from '@angular/material/tabs';
import {ModuleModel} from 'app/models/admin';
import {DecentralizedService} from 'app/service';
import {AdvancedTab} from "../../../../../models/admin/AdvancedTab.model";
import {AdmRolesAdvanceDTO} from "../../../../../models/admin/AdmRolesAdvanceDTO.model";

@Component({
    selector: 'advanced-decentralization',
    templateUrl: './module-advanced-decentralization.component.html',
    styleUrls: ['./module-advanced-decentralization.component.scss']
})
export class ModuleAdvancedDecentralizationComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() public lstAdvancedTabs: AdvancedTab[] = [];
    @ViewChild('moduleMatTabGroup') moduleMatTabGroup: MatTabGroup;
    @Input() public disabled: boolean;
    public displayedColumns: string[] = ['select', 'department'];
    // public dataSource = new MatTableDataSource<any>();
    // public selection = new SelectionModel<any>(true, []);

    // public tabAvanceModules = [];
    // public lengthRecords: number = 0;
    // public pageSize: number = 0;
    // public pageSizeOptions = environment.pageSizeOptions;
    // public listModules: ModuleModel[] = [];
    // public listDepartment = [];
    // public listAdvanceModules = {};

    constructor(
        private _decentralizedService: DecentralizedService
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.lstAdvancedTabs = [];
        if (changes && changes.lstAdvancedTabs && changes.lstAdvancedTabs.currentValue) {
            this.lstAdvancedTabs = changes.lstAdvancedTabs.currentValue;
            if (this.moduleMatTabGroup) {
                this.moduleMatTabGroup.selectedIndex = 0;
            }
        }
    }

    ngAfterViewInit(): void {
        // this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
        /*this._decentralizedService._prepare.subscribe((res) => {
            if (res) {
                this.listAdvanceModules = res.payload.lstAvanceModule;
                const lstAvanceModule = Object.getOwnPropertyNames(res.payload.lstAvanceModule);
                const lstDepartments = (res.payload.lstDepartments as AdmDepartmentsDTO[]).sort((a, b) => a.admDepartmentsId - b.admDepartmentsId);
                this.listDepartment = cloneDeep(lstDepartments);
                /!*lstDepartments.map((el, index) => {
                    if (el.lstAccount.length > 0) {
                        this.listDepartment.splice(index + 1, 0, ...el.lstAccount);
                    }
                });*!/
                this.tabAvanceModules = lstAvanceModule.map(e => ({
                    module: e,
                    listDepartment: this.listDepartment
                }));
                const firstTab = this.tabAvanceModules[0].module;
                const column = res.payload.lstAvanceModule[firstTab];
                this.displayedColumns.push(...column);
                this.dataSource = new MatTableDataSource(this.tabAvanceModules[0].listDepartment);
                this.lengthRecords = this.tabAvanceModules[0].listDepartment.length;
                this.dataSource.paginator = this.paginator;
            }
        });*/
    }

    allChecked(row: ModuleModel): boolean {
        for (const key in row) {
            if (row[key] === false) {
                return false;
            }
        }
        return true;
    }

    onCheckedFull(event: MatCheckboxChange, row: AdmRolesAdvanceDTO): void {
        if (event.checked) {
            row.isSelect = 1;
            row.isUpdate = 1;
            row.isDelete = 1;
            row.isExport = 1;
            row.isAcceptance = 1;
        } else {
            row.isSelect = 0;
            row.isUpdate = 0;
            row.isDelete = 0;
            row.isExport = 0;
            row.isAcceptance = 0;
        }
    }

    onSelectedChange(action: string, row: AdmRolesAdvanceDTO, event: MatCheckboxChange,): void {
        let select = event.checked ? 1 : 0;
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

    onTabAdvanceModuleChange(event: MatTabChangeEvent): void {
        /* this.dataSource = new MatTableDataSource();
         this.displayedColumns = ['select', 'department'];
         const check = this.tabAvanceModules.at(event.index);
         const currentTab = this.tabAvanceModules[event.index].module;
         const column = this.listAdvanceModules[currentTab];
         this.displayedColumns.push(...column);
         this.dataSource = new MatTableDataSource(check.listDepartment);
         this.lengthRecords = check.listDepartment.length;
         this.dataSource.paginator = this.paginator;*/
    }
}
