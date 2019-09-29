import ValidParam from "../../../framework/verify/ValidParam";
import Com from "../../../framework/basics/Com";

class LogServices {

    @Com()
    async insert(params, com) {
        const {result, target, details, remark, method, userIp, userId} = params;
        await com.query(`INSERT INTO log(result,target,details,remark,method,userIp,userId) VALUES(?,?,?,?,?,?,?)`, [result, target, details, remark, method, userIp, userId]);
    }

}

export default new LogServices();