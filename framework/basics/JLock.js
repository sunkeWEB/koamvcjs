var jLockCache = new Map();

/**
 * 队列 先进先出
 * @param key
 * @return {Function}
 * @constructor
 */
export function JLock(key) {
    return function (target, name, desc) {
        const oldValue = desc.value;
        const _this = this;
        let ret;
        desc.value = function (...args) {
            let JLOCK;
            try {
                const p1 =  new Promise(async (ps,pe) => {
                    try {
                        let locker = jLockCache.get(key);
                        let awaitObj;
                        if (locker) {
                            awaitObj = locker[locker.length - 1];
                        } else {
                            locker = [];
                            jLockCache.set(key, locker);
                        }
                        let success;
                        let result = new Promise(ps => success = ps);
                        locker.push(result);
                        if (awaitObj) await awaitObj;
                        JLOCK = () => {
                            const eq = locker.shift();
                            if (eq != result) throw new Error("unkown error");
                            if (!locker.length) jLockCache.delete(key);
                            success();
                        };

                        ret = await oldValue.apply(_this, args);
                        ps(ret)
                    }catch (e) {
                        pe(e.message);
                    }
                });
                return p1;
            }finally {
                JLOCK && JLOCK();
            }
        };
    };
}