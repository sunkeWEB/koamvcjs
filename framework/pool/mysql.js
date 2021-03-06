import mysql from "mysql";
import { Page, asyncCall } from "./util";
import Config from '../../webConfig'

/**
 * 数据连接
 */
export class DataCommand {
    constructor(config = Config.dataConnection) {
        this.config = config;
    }
    /**
     * 数据库连接配置
     */
    config;
    /**
     * 数据连接
     */
    connection;
    /**
     * 执行sql语句
     * @param {String} sql Sql语句
     * @param {Array} params 参数列表
     * @param print 是否打印SQL 默认不打印  全局打印可以设置 config.js 中的printSql
     */
    async query(sql, params,print=false) {
        if (!this.connection) {
            this.connection = mysql.createConnection({ ...this.config, });
            this.connection.connect();
        }
        try {
            if (Config.printSQL || print) console.log("\n" + this.connection.format(sql, params) + "\n");
            return await asyncCall(callback => this.connection.query(sql, params, callback));
        } catch (e) {
            throw e;
        }
    }

    async getConnection () {
        if (!this.connection) {
            this.connection = mysql.createConnection({ ...this.config, });
        }
        return this.connection;
    }

    /**
     * 查询单条数据库
     * @param sql SQL语句
     * @param params SQL参数
     * @param printSql 是否打印SQL 默认不打印  全局打印可以设置 config.js 中的printSql
     * @returns {Promise<*>}
     */
    async queryOne(sql, params,printSql=false) {
        let list = await this.query(`SELECT tmp.* FROM (${sql}) tmp limit 0,1`, params,printSql);
        if (list && list.length) {
            return list[0];
        }
        return null;
    }

    /**
     * 分页查询数据
     * @param {String} sql 查询的sql语句
     * @param {Array} params 参数列表
     * @param pages
     * @param name
     */
    async pageQuery(sql, params, pages, name) {
        if (!pages) return await this.query(sql, params);

        let sql0 = `select count(*) as cnt from (${sql}) as temp`;
        if (name) sql0 = `select count(*) as cnt from ${name}`;

        let {cnt} = await this.queryOne(sql0, params);
        pages.size = cnt;
        let start = pages.pageIndex * pages.pageSize;
        let sql1 = `${sql} limit ${start},${pages.pageSize}`;
        const ret = await this.query(sql1, params);
        pages.data = ret;
        return ret;
    }


    /**
     * 添加语句格式化
     * @param {string} table 表名
     * @param {object} opt 添加数据
     */
    async insert (table, opt={}) {
        delete opt['header_params'];

        if (typeof opt != 'object') throw new Error("参数:opt 不是一个对象");

        let params = [];
        let values = [];
        for (let i in opt) {
            params.push(i);
            values.push(opt[i])
        }
        let sql = `insert into ${table}(${params.map(v => SQ(v)).join(",")}) values(${params.map(v => '?').join(",")})`;
        return await this.query(sql, values);
    }

    /**
     * 多条添加的SQL语句
     * @param {String} table_name
     * @param {Array} data
     * @returns {Promise<*>}
     */
    async multiInsertSQL(table_name, data) {
        if (typeof data != 'object') throw new Error("参数:data 不是一个对象！");
        let execlSql = [];
        data.forEach((info) => {
            let params = [];
            let values = [];
            for(let v in info){
                params.push(v);
                values.push(info[v]);
            }
            let sql = `insert into ${table_name}(${params.map((v) => v).join(",")}) values (${values.map((v) => '?').join(",")});`;
            execlSql.push({sql: sql, params: values});
        });
        let res = await this.beginTransaction(execlSql);
        if (!res) return false;
        await this.commit();
        return res;
    }

    /**
     * 修改sql 格式化语句
     * @param {string} table 表名
     * @param {object} opt 修改对象 必须包含主键
     * @param {object} where 修改条件
     * @param other
     * @param printSql 是否打印SQL 语句
     */
    async update(table, opt={}, where={}, other = '',printSql=false) {
        delete opt['header_params']; // 后端自己加上的

        if (typeof opt != 'object') throw new Error("参数:opt 不是一个对象");
        if (typeof where != 'object') throw new Error("参数:where 不是一个对象");

        let values = [];
        let params = [];
        for (let i in opt) {
            params.push(i);
            values.push(opt[i])
        }
        let whe = [];
        for (let i in where) {
            whe.push(i);
            values.push(where[i])
        }

        let sql = `UPDATE ${table} SET ${params.map(v => `${v}=?`).join(",")} WHERE ${whe.map(v => `${v}=?`).join(",")} ${other}`;
        return await this.query(sql, values, printSql);
    }

    /**
     * 多条修改的SQL语句
     * @param {String} table_name
     * @param {Array} data
     * @returns {Promise<*>}
     */
    async multiUpdateSQL(table_name, data) {
        if (typeof data != 'object') throw new Error("参数:data 不是一个对象！");
        let execlSql = [];
        data.forEach(({info,where}) => {
            let params = [];
            let values = [];
            for(let v in info){
                params.push(v);
                values.push(info[v]);
            }
            let whe = [];
            for (let i in where) {
                whe.push(i);
                values.push(where[i]);
            }
            let sql = `UPDATE ${table_name} SET ${params.map(v => `${v}=?`).join(",")} WHERE ${whe.map(v => `${v}=?`).join(",")};`;
            execlSql.push({sql: sql, params: values});
        });
        let res = await this.beginTransaction(execlSql);
        if (!res) return false;
        await this.commit();
        return res;
    }


    /**
     * 根据id删除 格式化语句
     * @param {string} table 表名
     * @param {object} opt 其他查询
     */
    async delete(table, opt) {
        if (typeof opt != 'object') throw new Error("参数:opt 不是一个对象");

        let params = [];
        let values = [];
        for (let i in opt) {
            params.push(i);
            values.push(opt[i]);
        }

        let sql = `DELETE FROM ${table} WHERE ${params.map(v => `${v}=?`).join(",")}`;
        return await this.query(sql, values);
    }

    /**
     * 根据id删除 格式化语句
     * @param {string} table 表名
     * @param {array} opt 不显示字段
     * @param {string} opt 其他查询
     */
    async NOT_SHOW_COLUMN(table, opt = [], shortName) {
        let where = new WhereMaker();
        where.add(`table_schema=?`,dataConnection.database);
        where.add(`table_name=?`,table);

        let str = '*';
        if(opt && opt.length){
            opt.map((v) => where.add(`COLUMN_NAME!=?`,v));
            let sql = `select COLUMN_NAME from INFORMATION_SCHEMA.Columns ${where.toWhere()}`;
            let list = await this.query(sql, where.values);
            if(list.length){
                str = `${list.map((v) => `${shortName ? `${shortName}.` : ''}${v.COLUMN_NAME}`).join(',')}`
            }
        }
        return str;
    }

    /**
     * 关闭连接
     */
    end() {
        try {
            this.connection && this.connection.end();
        }
        catch (e) {
            console.log(e);
        }
    }

}


/**
 * 筛选配置
 */
export class WhereMaker {
    constructor(word) {
        this.defaultWord = word || "and";
    }
    wheres = [];
    values = [];
    orderBySql = "";
    defaultWord;
    add(key, ...args) {
        this.wheres.push(key);
        for (let arg of args) this.values.push(arg);
        return this;
    }
    addValues(...args) {
        for (let arg of args) this.values.push(arg);
        return this;
    }
    addWhere(where, link) {
        if (!where.wheres.length) return;
        this.wheres.push("(" + where.toSql(link) + ")");
        for (let arg of where.values) this.values.push(arg);
        return this;
    }
    toSql(link) {
        if (!this.wheres.length) return "";
        if (!link) link = this.defaultWord;
        link = " " + link + " ";
        return this.wheres.join(link);
    }
    toWhere(link) {
        let sql = this.toSql(link);
        if (sql) sql = " where " + sql;
        return sql;
    }
    orderBy (sql,type) {
        if(!this.orderBySql) this.orderBySql = " order by " + sql +" "+ type;
        this.orderBySql+= " ,"+ sql +" "+type +" "
    }
    toOrderBy() {
        return this.orderBySql;
    }
}

//mysql 关键字列表
let mysqlKeys = new Map();
for (let mysqlKey of ["add", "analyze", "asc", "between", "blob", "call", "change", "check", "condition", "continue", "cross", "current_timestamp", "database", "day_microsecond", "dec", "default", "desc", "distinct", "double", "each", "enclosed", "exit", "fetch", "float8", "foreign", "goto", "having", "hour_minute", "ignore", "infile", "insensitive", "int1", "int4", "interval", "iterate", "keys", "leading", "like", "lines", "localtimestamp", "longblob", "low_priority", "mediumint", "minute_microsecond", "modifies", "no_write_to_binlog", "on", "optionally", "out", "precision", "purge", "read", "references", "rename", "require", "revoke", "schema", "select", "set", "spatial", "sqlexception", "sql_big_result", "ssl", "table", "tinyblob", "to", "true", "unique", "update", "using", "utc_timestamp", "letchar", "when", "with", "xor", "all", "and", "asensitive", "bigint", "both", "cascade", "char", "collate", "connection", "convert", "current_date", "current_user", "databases", "day_minute", "decimal", "delayed", "describe", "distinctrow", "drop", "else", "escaped", "explain", "float", "for", "from", "grant", "high_priority", "hour_second", "in", "inner", "insert", "int2", "int8", "into", "join", "kill", "leave", "limit", "load", "lock", "longtext", "match", "mediumtext", "minute_second", "natural", "null", "optimize", "or", "outer", "primary", "raid0", "reads", "regexp", "repeat", "restrict", "right", "schemas", "sensitive", "show", "specific", "sqlstate", "sql_calc_found_rows", "starting", "terminated", "tinyint", "trailing", "undo", "unlock", "usage", "utc_date", "values", "letcharacter", "where", "write", "year_month", "alter", "as", "before", "binary", "by", "case", "character", "column", "constraint", "create", "current_time", "cursor", "day_hour", "day_second", "declare", "delete", "deterministic", "div", "dual", "elseif", "exists", "false", "float4", "force", "fulltext", "group", "hour_microsecond", "if", "index", "inout", "int", "int3", "integer", "is", "key", "label", "left", "linear", "localtime", "long", "loop", "mediumblob", "middleint", "mod", "not", "numeric", "option", "order", "outfile", "procedure", "range", "real", "release", "replace", "return", "rlike", "second_microsecond", "separator", "smallint", "sql", "sqlwarning", "sql_small_result", "straight_join", "then", "tinytext", "trigger", "union", "unsigned", "use", "utc_time", "letbinary", "letying", "while", "x509", "zerofill"]) {
    mysqlKeys.set(mysqlKey, true);
}

export function SQ(key) {
    // if (mysqlKeys.has(key.toLowerCase())) {
    //     return "`" + key + "`";
    // }
    return key;
}
