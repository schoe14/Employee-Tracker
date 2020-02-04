const mysql = require("mysql");
var mysqlConf = require('../config.js').mysql_pool;

class Query {
    constructor(query) {
        this.query = query;
        this.queryResult = this.queryGenerator();
    }
    queryGenerator() {
        switch (this.query) {
            case "View All Employees":
                return "SELECT e.id AS id, e.first_name, e.last_name, title, name AS department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id";
            case "View Departments":
                return "SELECT id, name FROM department";
            case "View Roles":
                return "SELECT role.id, title, salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id";
            case "Add Employee":
                break;
            case "Add Department":
                return "INSERT INTO department SET ?"
            case "Add Role":
                return "INSERT INTO role SET ?"
            case "Update Employee Role":
                break;
        }
    }
}
module.exports = Query;
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



