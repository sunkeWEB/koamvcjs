import * as xlsx from 'xlsx';
import { WorkBook, WorkSheet } from 'xlsx';

const charIndex = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
    J: 9,
    K: 10,
    L: 11,
    M: 12,
    N: 13,
    O: 14,
    P: 15,
    Q: 16,
    R: 17,
    S: 18,
    T: 19,
    U: 20,
    V: 21,
    W: 22,
    X: 23,
    Y: 24,
    Z: 25,
  };

export class SimpleExcel {
    /**
      * 创建SimpleExcel对象
      */
    static create() {
        return new SimpleExcel();
    }

    /**
   * 设置标题行
   * @param headers
   */
    setHeader(headers) {
        this.headers = headers;
        return this;
    }

    /**
     * 设置数据行
     * @param rows
     */
    setRows(rows) {
        this.rows = rows;
        return this;
    }


    /**
     * 将对象数组按指定属性顺序转为二维数组
     * @param objects 对象数组
     * @param props 对象的属性列表,属性可写为数组,数组只包含两个值,
     *          第一个值为对象属性名,第二个值为过滤函数
     */
    static objects2Rows(objects, props) {
        const rows = [];
        for (let i = 0; i < objects.length; i++) {
            const row = [];
            const item = objects[i];
            for (const key of props) {
                if (key instanceof Array) {
                    row.push(key[1](item[key[0]]));
                } else {
                    row.push(item[key]);
                }
            }
            rows.push(row);
        }
        return rows;
    }
    constructor() {
        this.workBook = xlsx.utils.book_new();
    }

    /**
   * 返回Excel工作表Buffer对象
   */
    getBuffer() {
        this.writeSheet0();
        return xlsx.write(this.workBook, { type: 'buffer' });
    }

    writeSheet0() {
        const datas = [];
        if (this.headers) {
            datas.push(this.headers);
        }
        datas.push(...this.rows);
        // console.log("TCL: SimpleExcel -> datas", datas)
        this.sheet0 = xlsx.utils.aoa_to_sheet(datas, { cellDates: false });
        xlsx.utils.book_append_sheet(this.workBook, this.sheet0);
    }


    static readBuffer(buffer) {
        const workBook = xlsx.read(buffer, { type: 'buffer' });
        const sheet0 = workBook.Sheets[workBook.SheetNames[0]];
        if (sheet0) {
            return SimpleExcel.readSheet(sheet0);
        }
        return null;
    }

    /**
     * 读取Excel Sheet，返回二维数组数据
     * @param sheet
     */
    static readSheet(sheet) {
        const keys = Object.keys(sheet);
        const dataList = [];

        for (const key of keys) {
            if (key.startsWith('!')) {
                continue;
            }
            const rowIndex = Number(key.replace(/^[A-Za-z]+/, '')) - 1;
            if (!dataList[rowIndex]) {
                dataList[rowIndex] = [];
            }
            const cellIndex = this.getCellIndex(key.replace(/\d+$/, ''));
            dataList[rowIndex][cellIndex] = sheet[key].v;
        }
        return dataList;
    }


    static getCellIndex(code) {
        const codes = code.split('');
        let idx = 0;
        const len = codes.length;
        for (let i = 0; i < len; i++) {
            const c = codes[i];
            idx += (charIndex[c] + 1) * Math.pow(26, len - i - 1);
        }
        return idx - 1;
    }
}