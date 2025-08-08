import {Component, Input} from '@angular/core';
@Component({
    selector: 'app-status-display',
    templateUrl: './status-display.component.html',
    styleUrls: ['./status-display.component.scss']
})
export class StatusDisplayComponent {
    @Input() public statusName: string;
    @Input() public status: number = 0;
    constructor() {
    }

}
