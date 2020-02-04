const mysql = require("mysql");
var mysqlConf = require('../config.js').mysql_pool;

// class Role {
//     constructor(empRole) {
//         this.empRole = empRole;
//         this.empRoleNumber;
//         const getRoleNumber = (value) => {
//             this.empRoleNumber = value;
//             console.log("line 11 from Role "+this.empRoleNumber);
//             return this.empRoleNumber;
//         }
//         mysqlConf.getConnection(function (err, connection) {
//             connection.query("SELECT id FROM role WHERE ?", { title: empRole }, function (err, res) {
//                 if (err) throw err;
//                 // console.log(res[0].id);
//                 else getRoleNumber(res[0].id);
//                 connection.release();
//             });
//         })
//     }

// }



