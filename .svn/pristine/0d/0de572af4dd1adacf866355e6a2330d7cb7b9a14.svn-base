import {ResultBean} from "../../framework/basics/ResultBean";
import bodyParser from 'koa-bodyparser';
import jwt from 'jsonwebtoken';
import jwtKoa from 'koa-json';
import util from 'util';

const verify = util.promisify(jwt.verify); // 解密
const secret = "sds";
const publicPath = ["/users"]; // 这里路由不用验证

/**
 * 判断token是否可用
 */
export default async (ctx, next) => {

    let payload = "";
    const token = ctx.header.authorization; // 请求头uploads
    let url = ctx.request.url; //访问url
    if (!token && !publicPath.includes(url)) {
        return ctx.body = ResultBean.noAuth("token不存在");
    }
    // 判断token 验证 逻辑下面
    // payload = await verify(token.split(' ')[1], secret);   // 获取token里面的信息
    await next();

}