/* eslint-disable @typescript-eslint/naming-convention */
import {SelectionModel} from '@angular/cdk/collections';
import {
    AfterViewChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTable} from '@angular/material/table';
import {BaseRequest, BaseResponse} from 'app/models/base';
import {IDisplayColumn} from 'app/shared/models/datatable/display-column.model';
import {ButtonTableEvent, IFooterTable, ITableConfig} from 'app/shared/models/datatable/table-config.model';
import {DataTableButtonConfig, TaskBarConfig} from 'app/shared/models/datatable/task-bar.model';

import {fuseAnimations} from '@fuse/animations';
import {TableConfigDTO} from 'app/models/TableConfigDTO.model';
import {CommonService} from 'app/service/common-service/common.service';
import {environment} from 'environments/environment';
import * as FileSaver from 'file-saver';
import {cloneDeep, each, find, isEqual, uniqBy} from 'lodash';
import {debounceTime, distinctUntilChanged, Observable, Subject, Subscription} from 'rxjs';
import * as XLSX from 'xlsx';
import {DataTableUtils} from '../datatable.utils';
import {DateTimeformatPipe} from "../pipe/date-time-format.pipe";
import {CurrencyFormatPipe} from "../pipe/string-format.pipe";
import {AuthService} from "../../../core/auth/auth.service";
import * as _ from 'lodash'
import {HashMap} from "@ngneat/transloco";

@Component({
    selector: 'app-datatable[dataSource]',
    templateUrl: './datatable.component.html',
    styleUrls: ['./datatable.component.scss'],
    animations: fuseAnimations,
})
export class DatatableComponent implements OnChanges, AfterViewInit, AfterViewChecked, OnDestroy, OnInit {
    // #region Decorator
    @Input() public tableConfig!: ITableConfig;
    @Input() public containerStyle: object = {
        width: '-webkit-fill-available'
    };
    @Input() public fullHeight: boolean = true;
    @Input() public dataSource: Observable<BaseResponse>;
    @Input() public taskbarConfig: TaskBarConfig;
    @Input() public tableConfigBtns: DataTableButtonConfig;
    @Input() public tableChild: any;
    @Output() public handleSort: EventEmitter<any> = new EventEmitter<any>();
    @Output() public handleSearch: EventEmitter<Event> = new EventEmitter<Event>();
    @Output() public pageSwitch: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();
    @Output() public tableEvent: EventEmitter<ButtonTableEvent> = new EventEmitter<ButtonTableEvent>();
    @Output() public rowClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() public viewDatailClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() public buttonClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() public checkboxItemChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() public onExpand: EventEmitter<any> = new EventEmitter<any>();

    @ViewChild('matTable', { static: false }) public matTable!: MatTable<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    // #endregion

    public pageSizeOptions = environment.pageSizeOptions;
    public utils = DataTableUtils;
    public columnDefinition: Array<IDisplayColumn> = [];
    public displayColumns: Array<string> = [];
    public footerColumns: Array<string> = [];
    public displayColumnsClone: Array<string> = [];
    public isSearchOpen: boolean = false;
    public noScroll: boolean = false;
    public fixSecondColumnLeftPos = false;
    public data = [];
    public toolTipText: boolean = false;
    public selectedRow: any;
    public selectionModel: SelectionModel<any> = new SelectionModel<any>(true, []);
    public rowData = Array<object>();
    public footerTable: Array<IFooterTable>;
    //#endregion Checkbox selection
    selectedRowIndex: any;

    searchInputControl: string = '';
    public isShowConfig = false;
    private readonly searchSubject = new Subject<Event | undefined>();
    private searchSubscription?: Subscription;

    private fileType: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    private fileExtension: string = '.xlsx';
    private cellName: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    private isListener = false;

    expandedElement: any[] = [];

    public constructor(
        private cdr: ChangeDetectorRef,
        private _commonService: CommonService,
        private _authService: AuthService,
    ) {
    }

    // @HostListener('click', ['$event'])
    // public clickout(event: Event): void {
    //     if ((this.matTable['_elementRef'] as ElementRef).nativeElement &&
    //         !((this.matTable['_elementRef'] as ElementRef).nativeElement as HTMLTableElement).contains(event.target as Node)) {
    //     }
    // }

    public ngOnInit(): void {
        this.searchSubscription = this.searchSubject
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
            )
            .subscribe(event => this.handleSearch.emit(event));
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['dataSource'] && changes['dataSource'].currentValue) {
            this.data = changes['dataSource'].currentValue;
            this.dataSource.subscribe((res) => {
                if (res) {
                    this.rowData = res.content;
                    this.selectedRowIndex = null;
                    this.selectionModel = new SelectionModel<any>(true, []);
                    this.tableConfig.isViewDetail = false;
                    if (!this.isListener) {
                        setTimeout(()=> {
                            const slider = document.querySelector('.table-container thead[role="rowgroup"] tr');
                            const body = document.querySelector('.table-container');
                            let isDown = false;
                            let startX;
                            let scrollLeft;

                            if (slider && body) {
                                this.isListener = true;
                                body.addEventListener('mousedown', (e) => {
                                    isDown = true;
                                    body.classList.add('active-scroll');
                                    // @ts-ignore
                                    startX = e.pageX - body.offsetLeft;
                                    scrollLeft = body.scrollLeft;
                                });
                                body.addEventListener('mouseleave', () => {
                                    isDown = false;
                                    body.classList.remove('active-scroll');
                                });
                                body.addEventListener('mouseup', () => {
                                    isDown = false;
                                    body.classList.remove('active-scroll');
                                });
                                body.addEventListener('mousemove', (e) => {
                                    if (!isDown) return;
                                    e.preventDefault();
                                    // @ts-ignore
                                    const x = e.pageX - body.offsetLeft;
                                    const walk = (x - startX) * 2; //scroll-fast
                                    body.scrollLeft = scrollLeft - walk;
                                });
                            }
                        }, 250)
                    }
                }
            });
        }

        if (changes['tableConfig'] && changes['tableConfig'].currentValue) {
            this.columnDefinition = this.tableConfig.columnDefinition;
            this.footerTable = this.tableConfig.footerTable;
            this.initData();
            if (!this.tableConfig.isViewDetail) {
                this.selectedRowIndex = null;
            }
            if (this.tableConfig.key) {
                const payload = new BaseRequest();
                payload.key = this.tableConfig.key;
                this._commonService.loadTableConfig(payload).subscribe((res) => {
                    if (res.errorCode === '0' && res.payload) {
                        this.displayColumns = (res.payload as TableConfigDTO).colume;
                        this.displayColumnsClone = cloneDeep(this.displayColumns);
                        this.columnDefinition = this.columnDefinition.map(el => ({
                            ...el,
                            isShow: this.displayColumns.findIndex(x => x === el.id) >= 0 ? true : false
                        }));
                    }
                });
            }
        }
    }

    public ngAfterViewInit(): void {
        if (this.matTable) {
            this.matTable.updateStickyColumnStyles();
        }
    }

    public ngAfterViewChecked(): void {
        this.cdr.detectChanges();
    }

    public ngOnDestroy(): void {
        this.searchSubscription?.unsubscribe();
    }

    public onSearchQueryInput(event: Event): void {
        this.searchSubject.next(event);
    }

    public isNumber(format: any): boolean {
        return typeof format === 'number';
    }

    public isDateTime(format: any): boolean {
        return typeof format === 'string';
    }

    public handleRowClick(row: any, idx?: number, column?: any): void {
        if (column.viewDetail) {
            this.tableConfig.isViewDetail = true;
            this.selectedRowIndex = idx;
            this.rowClick.emit(row);
        }
    }

    public onButtonClick(row: any): void {
        this.buttonClick.emit(row);
        window.scrollTo(0, 0);
    }

    public announceSortChange(event: any): void {
    }

    public handleTableAction(action, fileName?: string): void {
        switch (action) {
            case 'edit':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected.at(0)));
                break;
            case 'approve':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            case 'lock':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            case 'sign-process':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            case 'unlock':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            case 'deleted':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            case 'export':
                this.exportExcel(this.selectionModel.selected, fileName);
                break;
            default:
                break;
        }
    }

    /**
     * export common
     * @param jsonData
     * @param fileName
     */
    public exportExcel(jsonData: any[], fileName: string): void {
        let sheetName = this.removeVietnameseTones(this.tableConfig?.title);
        if (sheetName.length > 31) {
            sheetName = 'Danh_sach';
        }
        const header: any = this.columnDefinition.map(x => x.id);
        if (header.indexOf('selection') >= 0) {
            delete header[header.indexOf('selection')];
        }
        const dataExport: any[] = [];
        for (let idx = 0; idx < jsonData.length; idx++) {
            const objectData = jsonData[idx];
            const cellData = {no: idx + 1};
            header.forEach(x => {
                if (x != 'no') {
                    cellData[x] = undefined
                }
            })
            for (const property in objectData) {
                if (header.includes(property)) {
                    const configColume: IDisplayColumn = this.columnDefinition.filter(x => x.id === property)[0];
                    if (configColume.format && this.isNumber(configColume.format)) {
                        cellData[property] = new CurrencyFormatPipe().transform(objectData[property], 3);
                    } else if (configColume.format && this.isDateTime(configColume.format)) {
                        cellData[property] = new DateTimeformatPipe().transform(objectData[property], configColume.format + '');
                    } else {
                        cellData[property] = objectData[property];
                    }
                    if(configColume.type == 'status' && configColume.statusObject) {
                        cellData[property] = configColume.statusObject[objectData[property]];
                    }
                } else {
                    continue;
                }
            }
            dataExport.push(cellData);
        }
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExport);
        const createSheet = {};
        createSheet[sheetName] = ws;
        const wb: XLSX.WorkBook = { Sheets: createSheet, SheetNames: [sheetName] };

        const sheet = wb.Sheets[sheetName];
        if (sheet) {
            for (let idx = 0; idx < this.cellName.length; idx++) {
                if (sheet[this.cellName[idx] + '1'] && sheet[this.cellName[idx] + '1'] !== '') {
                    const strHearder = sheet[this.cellName[idx] + '1'].v;
                    const displayColumns = this.columnDefinition.filter(x => x.id === strHearder).map(x => x.name);
                    if (displayColumns[0] !== '') {
                        sheet[this.cellName[idx] + '1'].v = displayColumns;
                        // sheet[this.cellName[idx] + '1'].s =
                        sheet[this.cellName[idx] + '1'].s = {
                            font: {
                                name: 'arial',
                                sz: 24,
                                bold: true,
                                color: '#F2F2F2'
                            },
                        };
                    }
                } else {
                    break;
                }
            }
        }
        const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        this.saveExcelFile(excelBuffer, fileName  + '_' + new Date().getTime());
    }

    public removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/Đ/g, 'D');
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g, ' ');
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\'|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
        str = str.replaceAll(' ', '_');
        return str;
    }

    private saveExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: this.fileType });
        FileSaver.saveAs(data, fileName + this.fileExtension);
    }

    //#region Checkbox selection
    public toggleAllRows(event: any): void {
        if (this.selectionModel) {
            if (event.checked) {
                if (this.selectionModel.isMultipleSelection()) {
                    this.selectionModel.clear();
                    each(this.rowData, (v, idx) => {
                        this.selectionModel.select(v);
                    });
                }
            } else {
                this.selectionModel.clear();
            }
        }
        this.checkboxItemChange.emit(this.selectionModel.selected);
    }

    public isAllSelected(): boolean {
        if (this.selectionModel) {
            const numSelected = this.selectionModel.selected.length;
            const numRows = this.rowData.length;
            return numSelected === numRows;
        }

        return false;
    }

    public isSelectedItem(row: object): boolean {
        if (this.selectionModel.isSelected(row)) {
            return true;
        }

        return false;
    }

    public onCheckBoxItemChange(row: any): void {
        const foundRow = find(this.rowData, o => isEqual(o, row));
        if (foundRow) {
            this.selectionModel.toggle(foundRow);
        }
        this.checkboxItemChange.emit(this.selectionModel.selected);
    }

    public hasSelected(): boolean {
        if (this.selectionModel.hasValue()) {
            return true;
        }
        return false;
    }

    public disabedBtn(type): boolean {
        if (type == 'edit') {
            if (!this.selectionModel.hasValue()) {
                return true;
            }
            if (this.selectionModel.selected.length > 1) {
                return true;
            }
        }


        return false;
    }

    public disabledBtnLock(): boolean {
        if (!this.selectionModel.hasValue()) {
            return true;
        }

        const status = this.tableConfig.columnDefinition.filter(x => x.id === 'status');
        if (status.length > 0) {
            const currentValue = status[0];
            const selectionItem = uniqBy(this.selectionModel.selected.map(el => el.status), x => x);
            if (selectionItem.length > 1) {
                return true;
            } else {
                const check = currentValue.statusObject[selectionItem[0]];
                switch (check) {
                    case 'Hoạt động':
                        return false;
                    default:
                        return true;
                }
            }
        }
        return false;
    }

    public disabledBtnUnlock(): boolean {
        if (!this.selectionModel.hasValue()) {
            return true;
        }

        const status = this.tableConfig.columnDefinition.filter(x => x.id === 'status');
        if (status.length > 0) {
            const currentValue = status[0];
            const selectionItem = uniqBy(this.selectionModel.selected.map(el => el.status), x => x);
            if (selectionItem.length > 1) {
                return true;
            } else {
                const check = currentValue.statusObject[selectionItem[0]];
                switch (check) {
                    case 'Hoạt động':
                        return true;
                    default:
                        return false;
                }
            }
        }
        return false;
    }

    public pipeNumber(format: number | string): number {
        return typeof format === 'number' ? format : 0;
    }

    public pipeDateTime(format: number | string): string {
        return typeof format === 'string' ? format : '0';
    }

    public onMouseOver(event: any, data: string): void {
        if (event.target.className.split(' ').includes('cell-overflow')) {
            const selectElement = event.target;

            if (selectElement.offsetWidth === selectElement.scrollWidth || Array.isArray(data)) {
                this.toolTipText = true;
            } else {
                this.toolTipText = false;
            }
        }
    }

    public isLastChildNotSticky(index: number): string {
        const lastColumn = this.columnDefinition[index + 1];

        if (lastColumn && lastColumn.stickyEnd) {
            return `${this.columnDefinition[index] ? this.columnDefinition[index].weight : 0} px`;
        }

        return 'auto';
    }

    public onBtnClick(action): void {
        switch (action) {
            case 'add':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            case 'payment':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            case 'deleted':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            case 'approve':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            case 'update-rate':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            case 'sign-process':
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
            default:
                this.tableEvent.emit(new ButtonTableEvent(action, this.selectionModel.selected, this.selectionModel.selected));
                break;
        }
    }

    public styleObject(selectedRowIndex: number, id: number): object {
        if (selectedRowIndex === id) {
            return {
                'background-color': '#ffcc66! important;',
                'border-radius': '25px !important;'
            };
        }
        return {};
    }

    public showBtnConfig(): void {
        this.isShowConfig = !this.isShowConfig;
        if (!this.isShowConfig) {
            const request: TableConfigDTO = {
                key: this.tableConfig.key,
                colume: this.displayColumns
            };
            if (!isEqual(this.displayColumns, this.displayColumnsClone)) {
                this._commonService.saveTableConfig(request).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this.displayColumnsClone = cloneDeep(this.displayColumns);
                    }
                });
            }
        }
    }

    public onClickSearchIcon(value: boolean) {
        this.isSearchOpen = value;
    }

    public onItemChecked(item: IDisplayColumn): void {
        item.isShow = !item.isShow;
        this.displayColumns = this.columnDefinition.filter(x => x.isShow).map(x => x.id);
    }

    private initData(): void {
        this.noScroll = this.tableConfig.noScroll || false;
        this.displayColumns = this.columnDefinition
            .map(value => value.id);
        this.footerColumns = this.columnDefinition
            .map(value => value.id);
    }

    isStatisticalReport(): boolean {
        return window.location.pathname.includes('statistical-report');
    }

    onExpandRow(e: MouseEvent, element: any): void {
        let exist = false;
        for (let i = 0; i < this.expandedElement.length; i++) {
            if(_.isEqual(element, this.expandedElement[i])) {
                exist = true;
                this.expandedElement.splice(i, 1);
                break;
            }
        }
        if (!exist) {
            this.expandedElement.push(element)
        }
        this.onExpand.emit({
            action: !exist ? 'open' : 'close',
            element
        });
    }

    isElementExits(element: any): boolean {
        for (let i = 0; i < this.expandedElement.length; i++) {
            if(_.isEqual(element, this.expandedElement[i])) {
                return true
            }
        }
        return false;
    }

}
