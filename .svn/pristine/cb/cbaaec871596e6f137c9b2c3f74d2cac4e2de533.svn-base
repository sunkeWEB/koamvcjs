import fs from 'fs';
import path from 'path';
import colors from 'colors/safe';
import Config from "../../webConfig";
import KoaRouter from 'koa-router';
import json from "koa-json";
import bodyparser from "koa-bodyparser";
import GloabHandle from "../globaHandle";
import Auth from "../auth/token";

class Application {

    _application;

    start(application) {
        if(!(application && application.toJSON && application.use)) throw new Error("Application 未正确启动: 不是Koa 对象");
        this._application = application;
        this.startMiddleware();
        this.scanController(path.resolve('./src/controller'));
    }

    startMiddleware () {
        // 使用token验证
        if (Config.isAuth) this._application.use(Auth);
        if (Config.publicPath) this._application.use(require('koa-static')(__dirname + '/'+Config.publicPath));
        this._application.use(json());
        this._application.use(GloabHandle);
        this._application.use(bodyparser({
            enableTypes: ['json', 'form', 'text']
        }));
    }

    /**
     * 扫描controller
     */
    scanController(scanningPath) {
        fs.stat(scanningPath, (err, stats) => {
            if(stats.isDirectory()) {
                fs.readdir(scanningPath, (err, item) => {
                    if (err) throw new Error('扫描controller失败：' + err);
                    for (let i = 0; i < item.length; i++) {
                        this.scanController(path.join(scanningPath, item[i]));
                    }
                })
            }else{
                if(Config.isShowScanningController) { console.log(colors.blue("注册文件："+scanningPath)); }
                const controllers = require(scanningPath);
                for (const name in controllers) {

                    if (controllers.hasOwnProperty(name)) {
                        // 注册路由
                        const route = controllers[name]['ROUTER'];

                        if (route instanceof KoaRouter) {
                            this._application
                                .use(route.routes())
                                .use(route.allowedMethods());
                        }
                    }
                }
            }
        });
    }

}

export default new Application();