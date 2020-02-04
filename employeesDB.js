const mysql = require("mysql");
const inquirer = require("inquirer");

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
            choices: ["View All Employees", "View Departments", "View Roles", "Add Employee", "Add Department", "Add Role", "Update Employee Roles", "Exit"]
            // "Update Employee Manager", "View All Employees By Department", "View All Employees By Manager", "Remove Employee"
        }
    ).then(function (answer) {
        switch (answer.main_menu) {
            case "View All Employees":
                viewAllEmployees();
                break;
            case "View Departments":
                viewDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "Add Employee":
                addEmployee();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Exit":
                connection.end();
                break;
        }
    })
}

function addDepartment() {
    connection.end();
}

function viewAllEmployees() {
    connection.query(
        "SELECT e.id AS id, e.first_name, e.last_name, title, name AS department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        }
    );
}

function viewDepartments() {
    connection.query(
        "SELECT id, name FROM department",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        }
    );
}

function viewRoles() {
    connection.query(
        "SELECT id, title, salary FROM role",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        }
    );
}

async function addEmployee() {
    try {
        const roleArray = [];
        const nameArray = [{ id: null, name: "None" }];

        const queryRoles = await connection.query("SELECT id, title FROM role",
            function (err, res) {
                if (err) throw err;
                res.map(row => { roleArray.push({ id: row.id, title: row.title }); });
            });

        const queryNames = await connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee",
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
            connection.query("INSERT INTO employee SET ?",
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
