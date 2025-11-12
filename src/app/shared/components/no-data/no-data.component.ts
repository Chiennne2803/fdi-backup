import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-no-data',
    templateUrl: './no-data.component.html',
    styleUrls: ['./no-data.component.scss']
})
export class NoDataComponent {
    @Input() message: string = 'Không có dữ liệu';
    @Input() iconSize: string = 'w-40 h-40 sm:w-60 sm:h-60';
    @Input() showIcon: boolean = true;
}
