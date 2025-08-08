import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges,
    ViewChild
} from '@angular/core';
import {AdmProcessConfigDTO} from "../../../../../models/admin/AdmProcessConfigDTO.model";
import {
    ADM_PROCESS_CONFIG_STATUS_BTN_TEXT_MAP
} from "../../../../../enum/adm-process-config";
import {ProcessScheduler} from "../../process-config.config";
import {AdmProcessConfigService} from "../../../../../service/admin/adm-process-config.service";
import * as _ from "lodash"
import {DialogService} from "../../../../../service/common-service/dialog.service";
import {FuseAlertService} from "../../../../../../@fuse/components/alert";
import {environment} from "../../../../../../environments/environment";
import {BaseResponse} from "../../../../../models/base";
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatAccordion} from "@angular/material/expansion";

/**
 * Danh sách tiến trình
 */
@Component({
    selector: 'app-process-list',
    templateUrl: './process-list.component.html',
    styleUrls: ['./process-list.component.scss']
})
export class ProcessListComponent implements OnInit, OnDestroy, OnChanges {
    @Input() public lstProcess: AdmProcessConfigDTO[] = [];
    @Input() public classUnique = {};
    @Output() onUpdateStatusSuccess: EventEmitter<any> = new EventEmitter();
    @ViewChild(MatAccordion) accordion: MatAccordion

    public pageSize: number = 0;

    @ViewChild('processListPaginator') processListPaginator: MatPaginator;
    public processListPageSize = 0;

    private REGEX_LOG = /\|START: (.*?)\|END: (.*?)\|Time: (\d+ms)/;

    displayedColumns: string[] = ['start', 'end', 'time'];

    mapListProcessScheduler = new Map<string, MatTableDataSource<ProcessScheduler>>();
    mapListProcessSchedulerInterval = new Map<string, any>();

    admProcessConfigStatusBtnTextMap = ADM_PROCESS_CONFIG_STATUS_BTN_TEXT_MAP;

    public pageSizeOptions = environment.pageSizeOptions;

    private TEN_SECONDS = 10000;

    private SPECIAL_INTERVAL_KEY = {
        "PDF_QUEUE_SCHEDULER": 1000
    }

    constructor(
        private _admProcessConfigService: AdmProcessConfigService,
        private _dialogService: DialogService,
        private _fuseAlertService: FuseAlertService
    ) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        const classUnique = changes.classUnique?.currentValue;
        if(classUnique && !changes.classUnique.firstChange && classUnique.tabId !== classUnique.activeTab) {
            this.clearAllSchedulerInterval();
            this.accordion.closeAll();
        }

    }

    ngOnInit(): void {
    }

    private logToProcessScheduler(log: string): ProcessScheduler {
        const match = this.REGEX_LOG.exec(log);
        if (match) {
            return {
                start: new Date(match[1]),
                end: new Date(match[2]),
                time: match[3]
            }
        }
        return null;
    }

    openGroup(key: string) {
        this._admProcessConfigService.getLog(key).subscribe((res) => {
            this.updateLog(res, key);
            let interval = setInterval(() => {
                this._admProcessConfigService.getLog(key).subscribe((res) => {
                    this.updateLog(res, key);
                })
            }, this.SPECIAL_INTERVAL_KEY[key]??this.TEN_SECONDS)
            this.mapListProcessSchedulerInterval.set(key, interval)
        })
    }

    updateLog(res: BaseResponse, key: string) : void {
        if(res && res.payload?.log) {
            let listUpdate = this.mapListProcessScheduler.get(key);
            const newLog = this.logToProcessScheduler(res.payload.log);
            if(listUpdate) {
                if(!_.isEqual(listUpdate.data[listUpdate.data.length - 1], newLog)) {
                    const newList = [...listUpdate.data, newLog];
                    listUpdate = new MatTableDataSource(newList)
                    listUpdate.paginator = this.processListPaginator;
                }
            } else {
                listUpdate = new MatTableDataSource([newLog])
                listUpdate.paginator = this.processListPaginator;
            }
            this.mapListProcessScheduler.set(key, listUpdate)
        }
    }

    closeGroup(key: string) {
        if(this.mapListProcessSchedulerInterval.has(key)) {
            clearInterval(this.mapListProcessSchedulerInterval.get(key))
        }
    }

    statusColorClass(status: number): string {
        return status === 1 ? 'bg-[#BBF7D0]' : 'bg-[#FECACA]'
    }

    ngOnDestroy() {
        this.clearAllSchedulerInterval()
    }

    clearAllSchedulerInterval() {
        for (const [_, value] of this.mapListProcessSchedulerInterval) {
            clearInterval(value)
        }
    }

    onOnOffProcess(e, admProcessConfigDTO: AdmProcessConfigDTO) {
        const textMap = this.admProcessConfigStatusBtnTextMap[admProcessConfigDTO.status];
        const confirmDialog = this._dialogService.openConfirmDialog(`Xác nhận ${textMap.toLowerCase()}?`);
        confirmDialog.afterClosed().subscribe((res) => {
            if (res === 'confirmed') {
                admProcessConfigDTO.status = admProcessConfigDTO.status == 1 ? 0 : 1;
                this._admProcessConfigService.updateProcess(admProcessConfigDTO).subscribe((res) => {
                    if (res.errorCode === '0') {
                        this._fuseAlertService.showMessageSuccess(`${textMap} thành công`);
                        this.clearAllSchedulerInterval();
                        this.onUpdateStatusSuccess.emit();
                    } else {
                        this._fuseAlertService.showMessageError(res.message?.toString());
                    }
                })
            } else {
                e.source.checked = admProcessConfigDTO.status == 1
            }
        });
    }

    handlePageSwitch(event: PageEvent, key: string): void {
        let current = this.mapListProcessScheduler.get(key);
        this.processListPaginator.pageSize = event.pageSize;
        this.processListPaginator.pageIndex = event.pageIndex;
        current.paginator = this.processListPaginator;
        this.mapListProcessScheduler.delete(key);
        this.mapListProcessScheduler.set(key, current)
    }

}
