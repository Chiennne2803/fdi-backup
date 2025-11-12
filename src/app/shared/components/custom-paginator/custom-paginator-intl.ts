import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Bản ghi/trang';
  customPaginatorIntl.nextPageLabel = 'Trang sau';
  customPaginatorIntl.previousPageLabel = 'Trang trước';
  customPaginatorIntl.firstPageLabel = 'Trang đầu';
  customPaginatorIntl.lastPageLabel = 'Trang cuối';

  customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} / ${length}`;
  };

  return customPaginatorIntl;
}
