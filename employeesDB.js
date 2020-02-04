const mysql = require("mysql");
const inquirer = require("inquirer");
const Query = require("./lib/Query");

const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "Mintforme15_",
    database: "employees_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

function start() {
    inquirer.prompt(
        {
            type: "list",
            name: "main_menu",
            message: "What would you like to do?",
            choices: ["View All Employees", "View Departments", "View Roles", "Add Employee", "Add Department", "Add Role", "Update Employee Role", "Exit"]
            // "Update Employee Manager", "View All Employees By Department", "View All Employees By Manager", "Remove Employee"
        }
    ).then(function (answer) {
        switch (answer.main_menu) {
            case "View All Employees":
                view(answer.main_menu); //done
                break;
            case "View Departments":
                view(answer.main_menu); //done
                break;
            case "View Roles":
                view(answer.main_menu); //done
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment(answer.main_menu); //done
                break;
            case "Add Role":
                addRole(answer.main_menu); //done
                break;
            case "Update Employee Role":
                updateEmployeeRole();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
}

function addDepartment(mainAnswer) {
    inquirer.prompt(
        {
            type: "input",
            name: "name",
            message: "Please enter department name to add",
            validate: function (value) {
                const pass = value.match(/^[a-zA-Z ]{2,30}$/);
                if (pass) return true;
                else return "Please enter a valid name. Press upwards arrow to re-enter your value";
            },
            filter: function (value) {
                if (value.includes(" ")) {
                    return value.split(" ").map(function (val) { return val.charAt(0).toUpperCase() + val.substring(1); }).join(" ");
                } else if (value.length > 1) return value.charAt(0).toUpperCase() + value.substring(1);
                else { return value.charAt(0).toUpperCase(); }
            }
        },
    ).then(function (answer) {
        const query = new Query(mainAnswer).queryResult;
        console.log(query);
        console.log(answer);
        connection.query(query, answer, function (err) {
            if (err) throw err;
            start();
        });
    });
}

function addRole(mainAnswer) {
    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Please enter role name to add",
            validate: function (value) {
                const pass = value.match(/^[a-zA-Z ]{2,30}$/);
                if (pass) return true;
                else return "Please enter a valid name. Press upwards arrow to re-enter your value";
            },
            filter: function (value) {
                if (value.includes(" ")) {
                    return value.split(" ").map(function (val) { return val.charAt(0).toUpperCase() + val.substring(1); }).join(" ");
                } else if (value.length > 1) return value.charAt(0).toUpperCase() + value.substring(1);
                else { return value.charAt(0).toUpperCase(); }
            }
        },
        {
            type: "input",
            name: "salary",
            message: "Please enter salary",
            validate: function (value) {
                const valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number. Press upwards arrow to re-enter your value";
            }
        },
        {
            type: "input",
            name: "department_id",
            message: "Please enter department id",
            validate: function (value) {
                const valid = !isNaN(parseFloat(value));
                return valid || "Please enter a number. Press upwards arrow to re-enter your value";
            }
        }
    ]).then(function (answer) {
        const query = new Query(mainAnswer).queryResult;
        console.log(query);
        console.log(answer);
        connection.query(query, answer, function (err) {
            if (err) throw err;
            start();
        });
    });
}

function updateEmployeeRole() {
}

function view(mainAnswer) {
    const query = new Query(mainAnswer).queryResult;
    console.log(query);
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });

    // connection.query(
    //     "SELECT e.id AS id, e.first_name, e.last_name, title, name AS department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
    //     function (err, res) {
    //         if (err) throw err;
    //         console.table(res);
    //         start();
    //     }
    // );
}

async function addEmployee() {
    try {
        const roleArray = [];
        const nameArray = [{ id: null, name: "None" }];

        const queryRoles = await connection.query(
            "SELECT id, title FROM role",
            function (err, res) {
                if (err) throw err;
                res.map(row => { roleArray.push({ id: row.id, title: row.title }); });
            });

        const queryNames = await connection.query(
            "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee",
            function (err, res) {
                if (err) throw err;
                res.map(row => { nameArray.push({ id: row.id, name: row.name }); });
            });

        const userInput = await inquirer.prompt([
            {
                type: "input",
                name: "empFirstName",
                message: "What is the employee's first name?",
                validate: function (value) {
                    const pass = value.match(/^[a-zA-Z]{2,30}$/);
                    if (pass) return true;
                    else return "Please enter a valid name. Press upwards arrow to re-enter your value";
                },
                filter: function (value) {
                    return value.charAt(0).toUpperCase() + value.substring(1);
                }
            },
            {
                type: "input",
                name: "empLastName",
                message: "What is the employee's last name?",
                validate: function (value) {
                    const pass = value.match(/^[a-zA-Z]{2,30}$/);
                    if (pass) return true;
                    else return "Please enter a valid name. Press upwards arrow to re-enter your value";
                },
                filter: function (value) {
                    return value.charAt(0).toUpperCase() + value.substring(1);
                }
            },
            {
                type: "list",
                name: "empRole",
                choices: function () {
                    const titleOnly = roleArray.map(role => { return role.title; });
                    return titleOnly;
                },
                message: "What is the employee's role?"
            },
            {
                type: "list",
                name: "empManager",
                choices: function () {
                    const nameOnly = nameArray.map(name => { return name.name; });
                    return nameOnly;
                },
                message: "Who is the employee's Manager?",
            }
        ]).then(function (answer) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.empFirstName,
                    last_name: answer.empLastName,
                    role_id: roleArray.find(role => role.title === answer.empRole).id,
                    manager_id: nameArray.find(manager => manager.name === answer.empManager).id
                },
                function (err) {
                    if (err) throw err;
                    start();
                }
            );
        });
    } catch (e) {
        console.log('error', e);
    }
}
