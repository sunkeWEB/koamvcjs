import IndexServices from "../../services/IndexServices/IndexServices";
import {Controller,PostRequest,Log} from "../../../framework";
import ValidParam from "../../../framework/verify/ValidParam";

@Controller('/library')
export class LibraryController {

    age = 10;

    @PostRequest('/oppo')
    @ValidParam([])
    @Log("添加")
    async Poop(params) {
        this.sun();
        // const list = await IndexServices.lists("sun");
        return [];
    }

    async sun () {
        console.log('++++++++++++++',this.age);
    }

}


