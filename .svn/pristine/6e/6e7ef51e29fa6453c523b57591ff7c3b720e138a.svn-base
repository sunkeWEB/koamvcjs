import Com from "../../../framework/basics/Com";
import ValidParam from "../../../framework/verify/ValidParam";

class IndexServices {

    @Com()
    async list(com) {
        const list = await this.lists(com);
        return list;
    }

    @Com()
    async lists  (params,com) {
        return await com.query(`SELECT * FROM city`);
    }

}

export default new IndexServices();
