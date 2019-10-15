import Com from "../../../framework/basics/Com";
import {JLock} from "../../../framework";


class IndexServices {

    @Com()
    async list(com) {
        return await this.lists('su', com);
    }

    @Com()
    @JLock('sun')
    @JLock('ke')
    async lists(name, com) {
        return await com.query(`SELECT * FROM city`);
    }

    @Com()
    async page(page, com) {
        return await com.pageQuery(`SELECT * FROM city`, [], page);
    }

}

export default new IndexServices();
