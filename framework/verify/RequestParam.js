import FieldVerify from './FieldVerify'

/**
 * 主要用来验证提交的数据 和格式化在第一个对象里面
 * @param opt
 * @returns {function(*, *, *): (*|{value(...[*]): *})}
 * @constructor
 */
export default function RequestParam(opt) {
    if (!Array.isArray(opt)) throw new Error("ValidParam 参数不是数组!");
    return function (target, name, descriptor) {
        return {
            ...descriptor,
            value(...arg) {
                let RequestParams = {};
                for (let params of arg) {
                    if (Object.prototype.toString.call(params) === '[object Object]' && !Array.isArray(params)) {
                        if (params.request && params.request.method) {
                            const method = params.request.method;
                            if (method === "POST") RequestParams = params.request.body;
                            else if (method === "GET") RequestParams = params.request.params;
                            else throw new Error("不支持的请求方式：" + method);
                        }
                    }
                }

                let Field = new FieldVerify();

                // 参数验证
                for (let i = 0; i < opt.length; i++) {
                    const item = opt[i];
                    if (typeof (item) == "string") {
                        if (!Reflect.has(RequestParams, item)) throw new Error("参数不能为空：" + item);
                    } else if (Object.prototype.toString.call(item) === '[object Object]' && !Array.isArray(item)) {
                        const {name, rules = [], message} = item;
                        if (!name) throw new Error("验证参数必须包含name");
                        if (Array.isArray(rules)) {
                            for (let i = 0; i < rules.length; i++) {
                                if (Field[rules[i]]) { // 检验验证类是否有方法 在验证
                                    Field.setField(Reflect.has(RequestParams, name));
                                    if (!Field[rules[i]]) throw new Error("参数错误");
                                } else {
                                    throw new Error("验证方法不存在:" + rules[i]);
                                }
                            }
                        } else if (typeof rules === "function") {
                            if (!rules()) throw new Error(message ? message : (`参数 ${name} 错误`));
                        } else {
                            throw new Error("验证规则格式错误: rules");
                        }
                    }
                }
                return descriptor.value.apply(this, [RequestParams, ...arg]);
            }
        }
    }
};
