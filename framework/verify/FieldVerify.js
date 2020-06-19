import Card from './Card'
/**
 * 字段类型验证
 */
export default class FieldVerify {

    /**
     *
     * @param {string} fieldName 验证字段名字
     * @param {string} fieldValue 验证的值
     */
    constructor(fieldValue,fieldName = '') {
        this.fieldName = fieldName;
        this.fieldValue = fieldValue;
    }

    /** 参数必须 */
    isRequired(msg="参数不存在") {
        if (this.fieldValue == 0) return this;
        if (this.fieldValue == null || this.fieldValue == ''){
            if(typeof msg === 'object'){
                throw new Error(msg.msg);
            }
            throw new Error(msg);
        }
        return this;
    }

    /** 是否为空 */
    isNotNull() {
        if (!this.fieldValue) throw new Error('参数不能为空');
        return this;
    }

    /** 是否数字 */
    isNumber(opt = {}) {
        opt = { msg: "参数类型错误，不是一个数字", ...opt };
        if (this.fieldValue == 0) return this;
        if (this.fieldValue == null || this.fieldValue == "") throw new Error(opt.msg);
        if (isNaN(this.fieldValue) && (Number(this.fieldValue)!=this.fieldValue)) throw new Error(opt.msg);
        return this;
    }

    /** 是否数组 */
    isArray = (opt = {}) => {
        opt = { msg: "参数类型错误，不是一个数组", ...opt };
        if (Array.isArray(this.fieldValue)) return this;
        throw new Error(opt.msg)
    }

    /** 是否是对象 */
    isObject = (opt = {}) => {
        opt = { msg: "参数类型错误，不是一个对象", ...opt };
        if (Array.isArray(this.fieldValue) && typeof this.fieldValue == 'object') return this;
        throw new Error(opt.msg)
    }

    /**
     * 是否是指定范围的参数
     * @param {Array} 验证数组  验证长度
     * @param {string} msg 自定义提示语句
     *  arr 是指定的参数列表 [1,2,3,4,5]
     */
    isEqual = (opt = {}) => {
        opt = { msg: " 参数不符合要求", ...opt };
        let arr = opt.arr;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == this.fieldValue) return this;
        }
        throw new Error(opt.msg)
    }

    /**
     * 验证字段长度
     * @param {number} [len=6] 验证长度
     * @param {string} msg 自定义提示语句
     */
    isLength = (opt = {}) => {
        opt = { msg: "参数长度不等于：", ...opt };
        if (this.fieldValue.length == opt.len) return this;
        throw new Error(opt.msg )
    }

    /**
     * 验证参数最小长度或者最大长度或者两个都验证 区间范围
     * @param {Object} 验证规则 {min:3,max:6}
     */
    isMinAndMaxLen(opt = {}) {
        opt = { msg: "参数长度错误", ...opt };
        if (typeof opt != 'object') throw new Error('isMinAndMaxLen ：验证规则错误');
        let { min, max } = opt;
        if (min && this.fieldValue.length < min) throw new Error(opt.msg);

        if (max && this.fieldValue.length > max) throw new Error(opt.msg);

        return this;
    }

    /**
     * 是否是电话号码
     */
    isPhone(opt = {}) {
        opt = { msg: "电话格式错误", ...opt };
        let reg = /^1[3456789]\d{9}$/;

        if (!(reg.test(this.fieldValue))) {
            throw new Error(opt.msg);
        }
        return this;
    }

    /**
     * 验证身份证是否合法
     */
    isCard(opt = {}) {
        opt = { msg: "身份证不合法", ...opt };
        if (new Card().validateIdCard(this.fieldValue)) {
            return this;
        }
        throw new Error(opt.msg);
    }

    /**
     * 监测方法是否写对 兼用康享游 参数验证
     * @param {string} fname 函数名称
     */
    hasExist(fname) {
        if (!fname) return false;
        return typeof this[fname] == 'function';

    }

    /** 动态设置参数名 参数值 */
    setField(value,name) {
        this.fieldName = name;
        this.fieldValue = value;
        return this;
    }

    /** 是否和参数相等 */
    isParamsEqual (opt={}) {
        opt = { msg: "参数长度不等于：", ...opt };
        if(this.fieldValue != opt.val) throw new Error(opt.msg);
        return this;
    }

    /**
     * 是否是邮箱
     */
    isEmail (opt={}) {
        opt = { msg: "邮箱不合法", ...opt };
        if (new Card().validateIdCard(this.fieldValue)) {
            return this;
        }
        throw new Error(opt.msg);
    }

}
