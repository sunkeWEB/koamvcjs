export function jPromise(callback) {
    return new Promise((s, e) => {
        callback((err, ret) => {
            if (err) e(err);
            else s(ret);
        });
    });
}


// 琐
var jLockCache = new Map();
export async function JsLock(key) {
    var locker = jLockCache.get(key);
    var awaitObj;
    if (locker) {
        awaitObj = locker[locker.length - 1];
    } else {
        locker = [];
        jLockCache.set(key, locker);
    }
    var success;
    var result = new Promise(ps => success = ps);
    locker.push(result);
    if (awaitObj) await awaitObj;
    return () => {
        var eq = locker.shift();
        if (eq != result) throw new Error("unkown error");
        if (!locker.length) jLockCache.delete(key);
        success();
    }
}