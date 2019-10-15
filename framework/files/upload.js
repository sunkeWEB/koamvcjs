import KoaMulters from 'koa-multer';
import Config from '../../webConfig';
import {DataCommand} from "../../framework/pool/mysql";
import {ResultBean} from "../basics/ResultBean";
import path from 'path';
import fs from 'fs';

const storage = KoaMulters.diskStorage({
    //文件保存路径
    destination: function (req, file, cb) {
        try {
            const date = new Date();
            const year = date.getFullYear();
            let mouth = date.getMonth() + 1;
            let day = date.getDate();
            if (mouth <= 9) mouth = "0" + mouth;
            if (day <= 9) day = "0" + day;
            const publicPath = Config.publicPath;
            let filepathParent = path.join(__dirname + `../../../${publicPath}/${req.__uploadFilePath__}`);
            if (!fs.existsSync(filepathParent)) { // 创建文件夹
                fs.mkdirSync(filepathParent);
            }
            let filepath = path.join(__dirname + `../../../${publicPath}/${req.__uploadFilePath__}/${year}${mouth}${day}`);
            if (!fs.existsSync(filepath)) { // 创建文件夹
                fs.mkdirSync(filepath);
            }
            cb(null, `${publicPath}/${req.__uploadFilePath__}/${year}${mouth}${day}`);
        } catch (e) {
            console.log("上传失败:",e.message);
        }

    },
    //修改文件名称
    filename: function (req, file, cb) {
        const fileFormat = (file.originalname).split(".");  //以点分割成数组，数组的最后一项就是后缀名
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
});

//加载配置
const upload = KoaMulters({ storage: storage });


/**
 *
 * @param paths 文件路径相对于 Config.publicPath 下面的路径
 * @param filed 上传文件字段
 * @return {function(*, *, *): *}
 * @constructor
 */
export default function FileUpload(paths='files',filed='file') {
    return function (target, name, desc) {
        const value = desc.value;
        const _this = this;
        desc.value = function (ctx, next) {
            try {
                return new Promise(async ps=>{
                    ctx.req.__uploadFilePath__ = paths;
                    await upload.single(filed)(ctx);
                    ctx.req.__uploadFilePath__ = null;

                    const com = new DataCommand(Config.dataConnection);
                    try {
                        if(ctx.req.file) {
                            const {mimetype,path,size,filename} =  ctx.req.file;
                            const ret = await com.query(`INSERT INTO files(mimetype,path,size,filename) VALUES(?,?,?,?)`,[mimetype,path,size,filename]);
                            ctx.req.fileupload = await com.queryOne(`SELECT * FROM files WHERE id=?`, [ret.insertId]);
                        }
                        ps(value.apply(_this, [ctx, next]));
                    }catch (e) {
                        ctx.body = ResultBean.error(null,e.message);
                        ps();
                    }finally {
                        com.end();
                    }
                })
            }catch (e) {
                ctx.body = ResultBean.error(null,e.message);
                ps();
            }
        };
        return desc;
    }
}
