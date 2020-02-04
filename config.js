var mysql = require('mysql');
var config;
config = {
    mysql_pool : mysql.createPool({
        host     : 'localhost',
        user     : 'root',
        password : 'Mintforme15_',
        database : 'employees_DB'
    })
};
module.exports = config;