let db = require('./../../core/vendor/sqlite/sqlite');

 class entity{

    constructor(item = {}){
        this.item = item;
    }

    getTableName(){
        return this.tableName
    }

    getItem(){
        return this.item
    }

    save(callback = function(){}){
        if(this.item.id == undefined){
            db.insertDataInTable(this.getTableName(),this.item);
        }else{
            let item = this.item;
            let id = item.id;
            delete item.id;
            db.updateRowsWhere(this.getTableName(),item,{
                and:[
                    ['id','=',id]
                ]
            });
        }
    }

    load(id = 1,callback){

        let whereCondition = {
            and : [
                ['id','=',`'${id}'`]
            ]
        }
        db.selectRowsWhere(this.getTableName(),whereCondition,(res) => {
            for(let i = 0; i < res.length; i++){
                this.item = res[i];
            }
            callback(this);
        })
    }



}

module.exports = entity;