let sqlite = require("../sqlite");

module.exports = () => {

    sqlite.createTable("presets",[
        "id INTEGER PRIMARY KEY AUTOINCREMENT",
        "name TEXT",
        "site_path TEXT",
        "apache2_path TEXT",
        "nginx_path TEXT",
        "apache2_template TEXT",
        "nginx_template TEXT",
        "logs_dir TEXT",
        "root_and_group",
        "active INTEGER"
    ]);

}