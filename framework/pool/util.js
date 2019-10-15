
/**
 * 分页描述
 */
export class Page {
    _pageIndex = 0;

    /** 
     * 当前页码
     */
    get pageIndex() {
        return this._pageIndex;
    }
    set pageIndex(value) {
        this._pageIndex = value || 0;
        if (this._pageIndex < 0) this._pageIndex = 0;
    }

    _pageSize = 25;

    /**
     * 每页大小
     */
    get pageSize() {
        return this._pageSize;
    }
    set pageSize(value) {
        this._pageSize = value || 10;
        if (this._pageSize < 0) this._pageSize = 0;
    }

    /**
     * 页面总数
     */
    get pageCount() {
        if (this.pageSize <= 0) return 1;
        return Math.ceil(this.size / this.pageSize);
    }

    _size = 0;

    /**
     * 数据总数
     */
    get size() {
        return this._size;
    }
    set size(value) {
        this._size = value;
        if (this._size < 0) this._size = 0;

        if (this.pageIndex < 0) this.pageIndex = 0;
        else if (this.pageIndex >= this.pageCount) this.pageIndex = this.pageCount - 1;
    }

    _data = [];
    /**
     * 数据源
     *
     */
    get data () {
        return this._data;
    }
    set data (data) {
        this._data = data;
    }

    toJson() {
        return {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            pageCount: this.pageCount,
            size: this.size,
            data:this.data
        };
    }
}


/**
 * 把旧式的回调转换成promise
 * 比如 var connection = asyncCall(callback => mysql.connetion({}, callback));
 * @param {Function} callback 回调函数
 */
export function asyncCall(callback) {
    return new Promise((ps, pe) => {
        callback((e, d) => {
            if (e) pe(e);
            else ps(d);
        });
    });
}

/**
 * 把旧式的回调转换成promsie
 * 比如:
 *  var step = new AsyncStep();
 *  mysql.connection({}, step.next());
 *  var connection = await step.wait();
 */
export class AsyncStep {
    _promise;
    /**
     * 产生一个旧式回调
     */
    next() {
        if (this._promise) throw new Error("上一次调用next后得到的promise未被使用");
        var callbackSuccess, callbackError;
        this._promise = new Promise((cs, ce) => {
            callbackSuccess = cs;
            callbackError = ce;
        });
        return (err, ret) => {
            if (err) callbackError(err);
            else callbackSuccess(ret);
        }
    }
    /**
     * 等待回调被调用
     */
    wait() {
        var p = this._promise;
        this._promise = null;
        return p;
    }
}

/**
var a = new AsyncLock();
var s = new Date().getTime();
a.lock(async () => { await new Promise(cs => setTimeout(cs, 1000)); console.log(1, new Date().getTime() - s); });
setTimeout(() => a.lock(async () => { await new Promise(cs => setTimeout(cs, 1000)); console.log(2, new Date().getTime() - s); }), 500);
a.lock(async () => { await new Promise(cs => setTimeout(cs, 1000)); console.log(3, new Date().getTime() - s); }, 800);
(async () => { try { await a.lock(() => new Promise((cs, ce) => setTimeout(() => ce(new Error("故意的错误")), 1000))); } catch (e) { console.error(e); } })();
a.lock(async () => { await new Promise(cs => setTimeout(cs, 1000)); console.log(5, new Date().getTime() - s); });
//----------------
//error:超时时间已到
//1,1000
//error:故意的错误
//5,3000
//2,4000
 */
/**
 * 同步等待【方法未完成】
 */
export class AsyncLock {
    /**
     * 异步排队
     */
    _queue = [];
    /**
     * 排队执行异步操作 
     * @param {Function} callback 异步操作
     * @param {Integer} timeout 超时时间
     */
    lock(callback, timeout = 0) {
        var waiting = true;
        var token = new Promise(async (cs, ce) => {
            var timer = 0;
            //结束清理函数
            var clear = (err, res) => {
                //修改状态
                clear = null;
                //从队列中删除
                var idx = this._queue.indexOf(token);
                if (idx >= 0) this._queue.splice(idx, 1);
                //完成异步
                if (err) ce(err);
                else cs(res);
            };
            //如果需要等待，并且要求超时返回，就设置超时回调
            if (this._queue.length && timeout > 0) {
                timer = setTimeout(() => clear(new Error("超时时间已到")), timeout);
            }
            try {
                //等待前面的操作完成
                while (clear //判断是否已经超时
                    && this._queue.length //前方是否有等待
                    && this._queue[0] != token) { //判断自己是否到了队列的最前方
                    try { await this._queue[0]; } catch (ee) { }  //等待最前方的异步完成，以进行下一步判断
                }
                //如果已经超时了，啥也不干，返回即可
                if (!clear) return;
                //清理超时
                if (timer) {
                    clearTimeout(timer);
                    timer = 0;
                }
                //调用实际业务
                var ret = await callback();
                //清理并返回结果
                clear(null, ret);
            }
            catch (e) {
                //清理并通知错误
                clear(e);
            }
            finally {
                //当callback被同步执行完成的时候，token不应该加进队列
                waiting = false;
            }
        });
        if (waiting) this._queue.push(token);
        return token;
    }
    /**
     * 锁列表
     */
    static _map = new Map();
    /**
     * 排队执行异步操作
     * @param {Any} key 锁标识
     * @param {Function} callback 异步操作
     * @param {Integer} timeout 超时时间
     */
    static async lock(key, callback, timeout = 0) {
        var locker = AsyncLock._map.get(key);
        if (!locker) {
            locker = new AsyncLock();
            AsyncLock._map.set(key, locker);
        }
        var ret = await locker.lock(callback, timeout);
        if (!locker._queue.length) AsyncLock._map.delete(key);
        return ret;
    }
}

/**
 * 尝试等待异步结果
 * @param {Object|Promise} val 结果
 */
export async function tryAwait(val) {
    if (!val) return val;
    if (val instanceof Promise) return await val;
    return val;
}