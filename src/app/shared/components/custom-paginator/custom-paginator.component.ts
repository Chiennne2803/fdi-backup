import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.scss']
})
export class CustomPaginatorComponent {
  @Input() length = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 75, 100];
  @Output() page = new EventEmitter<PageEvent>();

  customSize: number = this.pageSize;

  get maxPageSize(): number {
    return Math.max(...this.pageSizeOptions);
  }

  onPageChange(event: PageEvent): void {
    this.page.emit(event);
  }

  onCustomSizeChange(): void {
    const max = this.maxPageSize;
    const min = 1;

    if (this.customSize > max) this.customSize = max;
    if (this.customSize < min) this.customSize = min;

    const event: PageEvent = {
      pageIndex: 0,
      pageSize: this.customSize,
      length: this.length
    };
    this.page.emit(event);
  }
}
