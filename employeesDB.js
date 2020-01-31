const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "",
    database: "employees_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});

function start() {
    inquirer.prompt([
        {
            type: "list",
            name: "main_menu",
            message: "What would you like to do?",
            choices: ["View All Employees", "View Departments", "View Roles", "Add Employee", "Add Department", "Add Role", "Update Employee Roles", "Exit"]
            // "Update Employee Manager", "View All Employees By Department", "View All Employees By Manager", "Remove Employee"
        }
    ]).then(function (answer) {
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
            case "Exit":
                connection.end();
                break;
        }
    })
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
    )
}

function viewRoles() {
    connection.query(
        "SELECT id, title, salary FROM role",
        function (err, res) {
            if (err) throw err;
            console.table(res);
            start();
        }
    )
}

async function addEmployee() {
    const roleArray = [];
    const nameArray = ["None"];
    const queryRoles = await connection.query("SELECT title FROM role",
        function (err, res) {
            if (err) throw err;
            res.map((role) => {
                roleArray.push(role.title);
            })
        })
    const queryNames = await connection.query("SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee",
        function (err, res) {
            if (err) throw err;
            res.map((name) => {
                nameArray.push(name.name)
            })
        })
    const userInput = await inquirer.prompt([
        {
            type: "input",
            name: "empFirstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "empLastName",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "empRole",
            message: "What is the employee's role?",
            choices: roleArray
        },
        {
            type: "list",
            name: "empManager",
            message: "Who is the employee's Manager?",
            choices: nameArray
        }
    ])
    console.log(userInput);
    // .then(connection.query(
    //     connection.end()
    //             "INSERT INTO employee SET ?",
    //     {
    //         first_name:
    //             last_name:
    //         role_id:
    //             manager_id:
    //     },
    //     function (err, res) {
    //         if (err) throw err;
    //         console.table(res);
    //         start();
    //     }
    // ))
    //     )
    connection.end();
}