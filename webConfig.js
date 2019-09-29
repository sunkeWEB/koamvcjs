class Config {

    static startPort = 9094;

    /**
     * 数据库连接
     */
    static dataConnection = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'world',
        char: 'utf8mb4',
        secret: '397633183@qq.com_?_%%^^()', // token加密
    };

    /**
     * 是否打印SQL
     */
    static printSQL = false;

    /**
     * 是否展示扫描的路由文件及路由
     */
    static isShowScanningController = true;

    /**
     * 是否验证路由 验证逻辑代码在 framework/auth/token.js
     */
    static isAuth = false;

    /**
     * 静态资源文件路径
     */
    static publicPath = "public";


}

export default Config;