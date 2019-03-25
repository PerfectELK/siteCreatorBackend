const fs = require('fs');

module.exports = {

    mkDataDir:function(uid) {
    if(typeof uid != 'string') {
        uid = uid.join('/');
    }
    uid = uid.replace(/\\/gim, '/');
    var _path2create = uid;
    if(!fs.existsSync(_path2create)){
        var _uid_arr = uid.split('/');
        var _uid_substr = '';
        for(var _j in _uid_arr) {
            var _d = _uid_arr[_j];
            _uid_substr = _uid_substr + '/' + _d;
            try {
                var _full_path = './' + _uid_substr;
                if(!fs.existsSync(_full_path)){
                    fs.mkdirSync(_full_path);
                }
            } catch (err) {
                _t.echo('Error on create directory ' + err);
            }
        }
    }
}

}