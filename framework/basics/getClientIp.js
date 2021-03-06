class ClientIp {

    /**
     * 获取本机IP
     * @param context 上下文
     * @returns {string | string} IP地址
     */
    static getClientIp(context) {
        let ip = context.headers['x-forwarded-for'] ||
            context.ip ||
            context.connection.remoteAddress ||
            context.socket.remoteAddress ||
            context.connection.socket.remoteAddress || '';
        if (ip.split(',').length > 0) {
            ip = ip.split(',')[0]
        }
        ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
        return ip || '127.0.0.1';
    }

}

export default ClientIp;