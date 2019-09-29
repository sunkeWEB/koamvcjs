import KoaRouter from "koa-router";
export default function Controller(controllerName) {
    const router = new KoaRouter();
    router.prefix(controllerName);
    return function (target, name, desc)  {
        const methods = Object.getOwnPropertyDescriptors(target.prototype);
        for (const name in methods) {
            if (name !== 'constructor' && typeof methods[name].value === 'function' && methods[name].value.name === '') {
                methods[name].value(router,new target());
            }
        }
        Object.defineProperty(target, "ROUTER", {
            value: router,
            configurable: false,
            enumerable: true,
            writable: false,
        }).bind(this)
    }
}