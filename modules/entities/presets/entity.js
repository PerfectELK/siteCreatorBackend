let entity = require('./../entity');

class presets extends entity{

    constructor(item){
        super(item,presets);
        this.tableName = "presets";
    }

    get id(){
        return this.item.id;
    }

    get name(){
        return this.item.name;
    }

    get site_path(){
        return this.item.site_path;
    }

    get apache2_path(){
        return this.item.apache2_path;
    }

    get nginx_path(){
        return this.item.nginx_path;
    }

    get apache2_template(){
        return this.item.apache2_template;
    }

    get nginx_template(){
        return this.item.nginx_template;
    }

    set name(name){
        this.item.name = name;
    }

    set site_path(site_path){
        this.item.site_path = site_path;
    }

    set apache2_path(apache2_path){
        this.item.apache2_path = apache2_path;
    }

    set nginx_path(nginx_path){
        this.item.nginx_path = nginx_path;
    }

    set apache2_template(apache2_template){
        this.item.apache2_template = apache2_template;
    }

    set nginx_template(nginx_template){
        this.item.nginx_template = nginx_template;
    }


}

module.exports = presets;