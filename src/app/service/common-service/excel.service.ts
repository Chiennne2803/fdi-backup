import {Injectable} from '@angular/core';
import {IDisplayColumn} from "../../shared/models/datatable/display-column.model";
import {CurrencyFormatPipe} from "../../shared/components/pipe/string-format.pipe";
import {DateTimeformatPipe} from "../../shared/components/pipe/date-time-format.pipe";
import * as XLSX from "xlsx";
import * as FileSaver from 'file-saver';

@Injectable({
    providedIn: 'root'
})
export class ExcelService  {
    private fileType: string = 'application/VND.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    private fileExtension: string = '.xlsx';
    private cellName: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    constructor() { }

    /**
     * export common
     * @param jsonData
     * @param fileName
     */
    public exportExcel(columnDefinition: any[],header: any[], jsonData: any[], fileName: string, sheetName: string): void {
        const dataExport: any[] = [];
        for (let idx = 0; idx < jsonData.length; idx++) {
            const objectData = jsonData[idx];
            const cellData = { no: idx + 1 };
            header.forEach(x => cellData[x] = undefined)
            for (const property in objectData) {
                if (header.includes(property)) {
                    const configColume: IDisplayColumn = columnDefinition.filter(x => x.id === property)[0];
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
                    const displayColumns = columnDefinition.filter(x => x.id === strHearder).map(x => x.name);
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
        this.saveExcelFile(excelBuffer, new Date().getTime()  + '_' + fileName);
    }

    private saveExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], { type: this.fileType });
        FileSaver.saveAs(data, fileName + this.fileExtension);
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

    public isNumber(format: any): boolean {
        return typeof format === 'number';
    }

    public isDateTime(format: any): boolean {
        return typeof format === 'string';
    }
}
