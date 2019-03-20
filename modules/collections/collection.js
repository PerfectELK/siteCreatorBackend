let db = require("./../../core/vendor/sqlite/sqlite");


class collection{

    constructor(objectClass){
        this.objectClass = objectClass;
        this.tableName = new this.objectClass().getTableName();
        this.items = [];
    }

    getItems(){
        return this.items;
    }

    getSimpleItems(whereConditions = {},callback) {

        db.selectRowsWhere(this.tableName, whereConditions,(res) => {

            for (let i = 0; i < res.length; i++) {
                this.items.push(new this.objectClass(res[i]));
            }
            callback(res);
        });

    }

    addItem(item){
        this.items.push(item);
    }


}

module.exports = collection;