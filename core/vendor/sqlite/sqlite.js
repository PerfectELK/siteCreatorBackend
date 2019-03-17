const sqlite3 = require('sqlite3').verbose();
const config = require('./sqliteConfig');

module.exports = {
    a: new sqlite3.Database(config.dbName),
    __adapter: function () {
        return this.a;
    },
    new__adapter: function(){
        return new sqlite3.Database(config.dbName);
    },
    createTable: function (name, fields = []) {
        name = name.trim();
        if (name !== "" && fields.length > 0) {

            fields = fields.join(', ');
            try {
                let db = this.new__adapter();
                db.serialize(() => {

                    db.run(`CREATE TABLE IF NOT EXISTS ${name} (${fields})`);

                });
                db.close();
            } catch (e) {
                return false;
            } finally {

            }

        }
    },
    checkTableExist:function(tableName,callback){
      let db = this.new__adapter();
      db.serialize(() => {

          db.all(`SELECT count(*) FROM sqlite_master WHERE type='table' AND name='${tableName}'`,(err,result) => {
            var res  = result[0]['count(*)'];
            callback(res);
          });

      });
      db.close();
    },
    insertDataInTable: function (table, data = {}) {
        table = table.trim();
        if (table !== "") {
            try {
                let db = this.new__adapter();
                db.serialize(() => {

                    let keys = [];
                    let dataArr = [];
                    let askStr = "";
                    for (let i in data) {
                        keys.push(i);
                        dataArr.push("'" + data[i] + "'");
                    }
                    keys = keys.join(', ');
                    dataArr = dataArr.join(', ');

                    db.run(`INSERT INTO ${table} (${keys}) VALUES (${dataArr})`);
                });
                db.close();
            } catch (e) {
                return false;
            } finally {

            }

        }
    },
    selectRowsAll: function (table, callback) {
        let db = this.new__adapter();
        db.all(`SELECT * FROM ${table}`, (err, result) => {
            callback(result);
            db.close();
        });

    },
    checkAnd: function (where) {
        if (where.and != null) {
            let and = where.and;
            var andString = "WHERE ";
            for (let i = 0; i < and.length; i++) {
                let w = and[i];
                andString += w.join(" ");
                var k = i + 1;
                if (k != and.length) {
                    andString += " AND ";
                }

            }
            return andString;
        }
        return "";
    },
    checkOrderBy: function (where) {
        if (where.orderby != null) {
            var orderByString = "ORDER BY ";
            let orderby = where.orderby;
            for (let i = 0; i < orderby.length; i++) {
                let w = orderby[i];
                orderByString += w.join(" ");
                var k = i + 1;
                if (k != orderby.length) {
                    orderByString += ", ";
                }
            }
            return orderByString;
        }
        return "";
    },
    checkJoin: function (where, selectTable) {
        if (where.join != null) {
            let join = where.join;
            var joinString = join.type + " " + join.table + " ON ";
            let and = join.and;

            for (let i = 0; i < and.length; i++) {
                let k = and[i];
                for (let j = 0; j < k.length; j++) {
                    if (j == 0) {
                        joinString += ` ${selectTable}.${k[j]} `;
                    }
                    if (j == 1) {
                        joinString += ` ${k[j]} `;
                    }
                    if (j == 2) {
                        joinString += `${join.table}.${k[j]} `
                    }
                }
                let g = i + 1;
                if(g != and.length){
                    joinString += " AND ";
                }

            }
            return joinString;
        }
        return "";
    },
    checkSet:function(set){

        if(set != null){
            let setString = "SET";
            for(s in set){
                setString += ` ${s} = '${set[s]}', `;
            }
            setString = setString.substr(0,setString.length - 2);
            return setString;
        }
        return "";
    },
     selectRowsWhere: function (table, where = {}, callback) {

        let db = this.new__adapter();
        let and = this.checkAnd(where);
        let orderBy = this.checkOrderBy(where);
        let join = this.checkJoin(where, table);
        let queryString = `SELECT * FROM ${table} ${join} ${and} ${orderBy}`;

        db.all(queryString, (err, result) => {
            callback(result);
        })
        db.close();
    },
    updateRowsWhere: function(table, set = {},where = {},callback){
        let and = this.checkAnd(where);
        let setStr = this.checkSet(set);
        let db = this.new__adapter();
        let queryString = `UPDATE ${table} ${setStr} ${and}`;
        db.serialize(() => {
           db.run(queryString);
        });
        db.close();
    }


}


