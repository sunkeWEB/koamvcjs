import Config from "../../webConfig";

export default function GetRequest(key) {
    return function (target, name, desc)  {
        let value = desc.value;
        desc.value =  function (route,targets) {
            const handlers = [];
            const {opts} = route;
            const handler = value.bind(targets);
            handlers.push(async (ctx) => {
                try {
                    const res = await handler(ctx);
                    if (res !== undefined) {
                        ctx.body = res;
                    } else {
                        // TODO 返回其他形式的数据
                    }
                }catch (e) {
                    throw new Error(e.message)
                }
            });
            if(Config.isShowScanningController){
                console.log("======注册路由====== ","METHODS：GET"+"      "+"PATH："+opts.prefix+key);
            }

            route.get.apply(route, [key, ...handlers]);
        };
        return desc;
    }
}