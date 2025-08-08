import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {DateTimeformatPipe} from 'app/shared/components/pipe/date-time-format.pipe';
import {ROUTER_CONST} from 'app/shared/constants';
import {fuseAnimations} from "../../../../../@fuse/animations";
import {SpNotificationDTO} from "../../../../models/service/SpNotificationDTO.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NotificationsService} from "../../../../service/common-service/notifications.service";

@Component({
    selector: 'app-account-bank-detail',
    templateUrl: './notifications-detail.component.html',
    styleUrls: ['./notifications-detail.component.scss'],
    providers: [DateTimeformatPipe],
    animations     : fuseAnimations,
})
export class NotificationsDetailComponent implements OnChanges {
    @Output() public handleCloseDetailPanel: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public spNotificationDTO: SpNotificationDTO;

    public isEditable: boolean = false;

    constructor(
        private _notificationsService: NotificationsService,
        private activatedRoute: ActivatedRoute,
        private _router: Router,
    ) {
        this.spNotificationDTO = null;
        this.activatedRoute.paramMap.subscribe(params => {
            const id = Number(params.get('id'));
            this.loadData(id);
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.spNotificationDTO = null;
        if (changes && changes.spNotificationDTO.currentValue !== 0) {
            this.spNotificationDTO = changes.spNotificationDTO.currentValue;
        }
    }

    onClose(): void {
        this.isEditable = false;
        this.handleCloseDetailPanel.emit(false);
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) {
            this._router.navigate([ROUTER_CONST.config.common.notifications.link]);
        }
    }

    submit(): void {

    }

    private loadData(id: number) {
        if ((this.spNotificationDTO == null && id) ||
            (this.spNotificationDTO && id && this.spNotificationDTO.spNotificationId !== id)) {
            this._notificationsService.getDetail({spNotificationId: id}).subscribe(res => {
                this.spNotificationDTO = res.payload;
                this.spNotificationDTO.isRead = true;
                this._notificationsService.update(this.spNotificationDTO).subscribe();
            })
        }
    }
}
