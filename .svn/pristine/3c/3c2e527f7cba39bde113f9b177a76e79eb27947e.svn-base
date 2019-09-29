export class ResultBean {

    static json(code, data, message) {
        const result = new ResultBean();
        result.code = code;
        result.data = data;
        result.message = message;
        return result;
    }

    static success(data, message = "SUCCESS") {
        return ResultBean.json(0, data, message);
    }

    static error(data, message = 'error') {
        return ResultBean.json(1, data, message);
    }

    static noAuth(message = '无权限',data="") {
        return ResultBean.json(403, data, message);
    }


}