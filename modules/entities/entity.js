const db = require('./../../core/vendor/sqlite/sqlite');
const collection = require('../collections/collection');

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

    delete(){
        if(this.item.id != undefined){
            db.deleteWithId(this.getTableName(),this.item.id);
        }
    }

     getSimpleItems(whereConditions = {},className,callback){

        db.selectRowsWhere(this.getTableName(), whereConditions,(res) => {

            let coll = new collection(className);
            for (let i = 0; i < res.length; i++) {
                let item = new className(res[i]);
                coll.addItem(item);
            }
            callback(coll);
        });

    }



}

module.exports = entity;