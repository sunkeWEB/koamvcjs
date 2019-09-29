import ClientIp from './getClientIp'
import LogServices from "../../src/services/LogServices/LogServices";

/**
 *  Log 只能写在 路由装饰器之后 参数验证之前
 * @param targetName
 * @param mold
 */
export default function Log(targetName, mold = false) {
    return (target, name, desc) => {
        let fnVal = desc.value;
        desc.value = function () {
            const that = this;
            const args = arguments;

            return new Promise(async (resolve, reject) => {
                let _result;
                try {

                    _result = await fnVal.apply(that, args);

                    const info = args[1];
                    const userIp = (info && info.req) ? ClientIp.getClientIp(info.req) : "127.0.0.1";

                    let {result = true, details = "", remark = "", method = ""} = {};

                    let option = {
                        result: (result === true || result === undefined) ? "成功" : "失败",
                        target: targetName, details, remark, method, userIp
                    };

                    // 写入日志
                    await LogServices.insert(option);
                    resolve(_result);
                } catch (err) {
                    reject(err);
                    throw new Error(err)
                }
            });
        }
    }
}
