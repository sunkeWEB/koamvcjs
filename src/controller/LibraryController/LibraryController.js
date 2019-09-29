import IndexServices from "../../services/IndexServices/IndexServices";
import {Controller,PostRequest,RequestParam,Log,GetRequest} from "../../../framework";

@Controller('/library')
export class LibraryController {

    age = 10;

    @PostRequest('/oppo')
    @Log("添加")
    @RequestParam([{name:'age',rules:['isRequired']}])
    async Poop(params) {
        this.sun();
        const list = await IndexServices.lists("sun");
        return list;
    }

    async sun () {
        console.log('++++++++++++++',this.age);
    }

    @GetRequest('/abc')
    async list () {
        return await IndexServices.list();
    }

}


