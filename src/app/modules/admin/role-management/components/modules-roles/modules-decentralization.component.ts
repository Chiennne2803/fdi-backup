import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DecentralizedModel } from 'app/models/admin';
import { DecentralizedService } from 'app/service';
import { environment } from 'environments/environment';
import * as _ from 'lodash';

@Component({
    selector: 'modules-decentralization',
    templateUrl: './modules-decentralization.component.html',
    styleUrls: ['./modules-decentralization.component.scss']
})
export class ModulesDecentralizationComponent implements OnInit, OnChanges, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Input() public roles: any[] = [];
    @Input() public disabled: boolean;

    public displayedColumns: string[] = ['select', 'module'];
    public dataSource = new MatTableDataSource<DecentralizedModel>();
    public selection = new SelectionModel<any>(true, []);

    public pageSizeOptions = environment.pageSizeOptions;
    public listModules: DecentralizedModel[] = [];

    constructor(
        private _decentralizedService: DecentralizedService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if ('roles' in changes) {
            this.listModules = [];
            this.initData();
            if (changes && changes.roles && changes.roles.currentValue) {
                if (changes.roles.currentValue.length > 0) {
                    const data = _(this.listModules).concat(changes.roles.currentValue).groupBy('module').map(_.spread(_.merge)).value();
                    this.dataSource = new MatTableDataSource(data);
                    this.dataSource.paginator = this.paginator;
                }
            }
        } else if ('disabled' in changes) {
            //update active form
        }
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    ngOnInit(): void {
        this._decentralizedService._prepare.subscribe((res) => {
            (res.payload.lstAction as string[]).map((el) => {
                this.displayedColumns.push(el);
            });
        });
        this.initData();
        this.listModules = [];
    }

    allChecked(row: DecentralizedModel): boolean {
        for (const key in row) {
            if (row[key] === false) {
                return false;
            }
        }
        return true;
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

    onSelectedChange(action: string, row: DecentralizedModel): void {
        switch (action) {
            case '_VIEW':
                this.dataSource.data = (this.dataSource.data.map(el => ({
                    ...el,
                    isSelect: el.module === row.module ? !row.isSelect : el.isSelect
                })));
                break;
            case '_INSERT':
                this.dataSource.data = (this.dataSource.data.map(el => ({
                    ...el,
                    isInsert: el.module === row.module ? !row.isInsert : el.isInsert
                })));
                break;
            case '_UPDATE':
                this.dataSource.data = (this.dataSource.data.map(el => ({
                    ...el,
                    isUpdate: el.module === row.module ? !row.isUpdate : el.isUpdate
                })));
                break;
            case '_DELETE':
                this.dataSource.data = (this.dataSource.data.map(el => ({
                    ...el,
                    isDelete: el.module === row.module ? !row.isDelete : el.isDelete
                })));
                break;
            case '_EXPORT':
                this.dataSource.data = (this.dataSource.data.map(el => ({
                    ...el,
                    isExport: el.module === row.module ? !row.isExport : el.isExport
                })));
                break;
            case '_APPROVE':
                this.dataSource.data = (this.dataSource.data.map(el => ({
                    ...el,
                    isAcceptance: el.module === row.module ? !row.isAcceptance : el.isAcceptance
                })));
                break;
            default:
                break;
        }
    }

    private initData(): void {
        this.listModules = [];
        this._decentralizedService._prepare.subscribe((res) => {
            (res.payload.lstModule as string[]).map((el) => {
                const item = {
                    module: el,
                    isSelect: false, isInsert: false, isUpdate: false, isDelete: false, isExport: false, isAcceptance: false
                };
                this.listModules.push(item);
                this.dataSource = new MatTableDataSource(this.listModules);
                this.dataSource.paginator = this.paginator;
            });
        });
    }

}
