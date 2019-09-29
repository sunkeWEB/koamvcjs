const digitsRE = /(\d{3})(?=\d)/g;

export default class Utils {
    /**
     * 检查是否为空数组 空数组返回 true
     * @param {Array} arr 数组
     * @return Boolean
     */
    static isEmptyArr(arr) {
        if (!Array.isArray(arr)) throw new Error('isEmptyArr 参数不是一个数组');
        return !arr.length;
    }

    /**
     * 是否是空  不为空false 为空true
     * @return Boolean
     * @param params
     */
    static isNull(params) {
        if (params===0) return false;
        return !!!params;
    }


    /**
     * 检查是否为空数组 空数组返回false 不是空数组返回第一条数据
     * @param {Array} arr 数组
     * @return Boolean
     */
    static notEmptyArrAndOne(arr) {
        if (!Array.isArray(arr)) throw new Error('notEmptyArrAndOne 参数不是一个数组');
        if (!arr.length) return false;
        return arr[0];
    }


    /** 格式化金额 */
    static currency(value, currency, decimals) {
        value = parseFloat(value)
        if (!isFinite(value) || (!value && value !== 0)) return ''
        currency = currency != null ? currency : '¥'
        decimals = decimals != null ? decimals : 2
        var stringified = Math.abs(value).toFixed(decimals)
        var _int = decimals
            ? stringified.slice(0, -1 - decimals)
            : stringified
        var i = _int.length % 3
        var head = i > 0
            ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
            : ''
        var _float = decimals
            ? stringified.slice(-1 - decimals)
            : ''
        var sign = value < 0 ? '-' : ''
        return sign + currency + head +
            _int.slice(i).replace(digitsRE, '$1,') +
            _float
    }

    /** 判断是否修改成功 */
    static updateSuccess(row) {
        return row.affectedRows > 0;
    }

    /** 判断是否插入成功 */
    static insertSuccess(row) {
        return row.affectedRows > 0 && row.fieldCount <= 0;
    }

    /**
     * 返回 2019-08-28 15:51:31 格式时间
     */
    static formatDate (date) {
        const time = new Date(date);
        const year = time.getFullYear();
        const mouth = time.getMonth()+1;
        const day = time.getDate();
        const hour = time.getHours();
        const seconds = time.getSeconds();
        const minutes = time.getMinutes();
        return `${year}-${mouth}-${day} ${hour}:${minutes}:${seconds}`;
    }


}
