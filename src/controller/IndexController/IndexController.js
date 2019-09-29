import {Controller, Log, PostRequest} from '../../../framework'
import ValidParam from "../../../framework/verify/ValidParam";


@Controller('/sun')
export class IndexController {

    @PostRequest('/index')
    @ValidParam(['age'])
    async list(params,ctx) {
        const list = [{name: 'sun1'}];
        ctx.body = list;
    }

}
