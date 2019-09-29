import {ResultBean} from "../basics/ResultBean";

/**
 * 处理全局异常
 */
export default async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        ctx.body = ResultBean.error(null, e.message);
    }
}
