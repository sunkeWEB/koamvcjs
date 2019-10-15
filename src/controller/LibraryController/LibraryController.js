import IndexServices from "../../services/IndexServices/IndexServices";
import {Controller,PostRequest,RequestParam,Log,GetRequest} from "../../../framework";
import {Page} from "../../../framework/pool/util";
import KoaMulters from 'koa-multer';
import FileUpload from "../../../framework/files/upload";


@Controller('/library')
export class LibraryController {

    age = 10;

    /**
     * 验证参数
     */
    @PostRequest('/oppo')
    @RequestParam([{name: 'age', rules: ['isRequired']}])
    async Poop(params) {
        return await IndexServices.lists('sun');
    }

    @GetRequest('/abc')
    async list () {
        return await IndexServices.list();
    }

    /**
     * 分页
     */
    @GetRequest('/test')
    async test() {
        const page = new Page();
        await IndexServices.page(page);
        return page.toJson();
    }

    /**
     * 文件上传
     */
    @PostRequest('/file')
    @FileUpload('files','file')
    async upload (ctx) {
        const {mimetype,path,size,filename} =  ctx.req.fileupload;
        return ctx.req.fileupload;
    }

}


