let db = require('./../../core/vendor/sqlite/sqlite');

 class entity{

    constructor(item = []){
        this.item = item;
    }

    getTableName(){
        return this.tableName
    }

    getItem(){
        return this.item
    }

    load(id = 1){

        let whereCondition = {
            and : [
                ['id','=',`'${id}'`]
            ]
        }
        db.selectRowsWhere(this.getTableName(),whereCondition,(res) => {
            this.item = res;
        })
    }



}

module.exports = entity;