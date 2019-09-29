import Com from "../../../framework/basics/Com";

class IndexServices {

    @Com()
    async list(com) {
        return await this.lists(com);
    }

    @Com()
    async lists  (com) {
        return await com.query(`SELECT * FROM city`);
    }

}

export default new IndexServices();
