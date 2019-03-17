let entity = require('./../entity');

class presets extends entity{

    constructor(item){
        super(item);
        this.tableName = "presets";
    }


}

module.exports = presets;