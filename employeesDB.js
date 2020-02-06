const mysql = require("mysql");
const inquirer = require("inquirer");
const Query = require("./lib/Query");
const cTable = require("console.table");

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
            choices: ["View All Employees", "View All Employees By Department", "View All Employees By Manager", "View Departments", "View Roles", "Add Employee", "Add Department", "Add Role", "Update Employee Role", "Exit"]
            // "Update Employee Manager", , , "Remove Employee"
        }
    ).then(function (answer) {
        switch (answer.main_menu) {
            case "View All Employees":
            case "View All Employees By Department":
            case "View All Employees By Manager":
            case "View Departments":
            case "View Roles":
                view(answer.main_menu); //done
                break;
            case "Add Employee":
                addEmployee(answer.main_menu); //done
                break;
            case "Add Department":
                addDepartment(answer.main_menu); //done
                break;
            case "Add Role":
                addRole(answer.main_menu); //done
                break;
            case "Update Employee Role":
                updateEmployeeRole(answer.main_menu); //done
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
        connection.query(query, answer, function (err) {
            if (err) throw err;
            start();
        });
    });
}

function addRole(mainAnswer) {
    const query = new Query(mainAnswer).queryResult;
    connection.query(query, function (err, res) {
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
                type: "list",
                name: "department_id",
                message: "Please choose department name",
                choices: function () {
                    const departNames = [];
                    res.map(row => { departNames.push(row.name); });
                    return departNames;
                }
            }
        ]).then(function (answer) {
            res.map(row => { if (row.name === answer.department_id) answer.department_id = row.id });
            const query = new Query("queryAddRole").queryResult;
            connection.query(query, answer, function (err) {
                if (err) throw err;
                start();
            });
        });
    });
}

function updateEmployeeRole(mainAnswer) {
    const query = new Query(mainAnswer).queryResult;
    console.log(query);
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "list",
                name: "name",
                choices: function () {
                    const nameArray = [];
                    res.map(row => {
                        if (row.name != null) nameArray.push(row.name);
                    });
                    return nameArray;
                },
                message: "Who would like to update his/her role?"
            },
            {
                type: "list",
                name: "title",
                choices: function () {
                    let titleArray = [];
                    res.map(row => {
                        if (row.title != null) titleArray.push(row.title);
                    });
                    titleArray = titleArray.filter((item, index) => {
                        return titleArray.indexOf(item) === index;
                    });
                    return titleArray;
                },
                message: "Which role would like to update to?"
            }
        ])
            .then(function (answer) {
                let employee_id, role_id;
                res.map(row => {
                    if (row.name === answer.name) employee_id = row.e_id;
                    if (row.title === answer.title) role_id = row.role_id;
                });
                console.log(`e.id = ${employee_id}, role.id = ${role_id}`);
                const query = new Query("queryUpdateRole").queryResult;
                console.log(query);
                connection.query(query, [{ role_id: role_id }, { id: employee_id }], function (err) {
                    if (err) throw err;
                    start();
                });
            });
    });
}

function view(mainAnswer) {
    const query = new Query(mainAnswer).queryResult;
    console.log(query);
    connection.query(query, function (err, res) {
        if (err) throw err;
        if (mainAnswer === "View All Employees By Department" || mainAnswer === "View All Employees By Manager") {
            inquirer.prompt([
                {
                    type: "list",
                    name: "queryViewByDepartName",
                    choices: function () {
                        let departNames = [];
                        res.map(row => { if (row.department != null) departNames.push(row.department); });
                        departNames = departNames.filter((item, index) => {
                            return departNames.indexOf(item) === index;
                        });
                        return departNames;
                    },
                    message: "Which department would you like to view?",
                    when: function () {
                        return mainAnswer === "View All Employees By Department";
                    }
                },
                {
                    type: "list",
                    name: "queryViewByManagerName",
                    choices: function () {
                        let managerNames = [];
                        res.map(row => { if (row.manager != null) managerNames.push(row.manager); });
                        managerNames = managerNames.filter((item, index) => {
                            return managerNames.indexOf(item) === index;
                        });
                        return managerNames;
                    },
                    message: "Which manager would you like to view?",
                    when: function () {
                        return mainAnswer === "View All Employees By Manager";
                    }
                }
            ])
                .then(function (answer) {
                    const query = new Query(Object.keys(answer).toString()).queryResult;
                    console.log(query);

                    let data;
                    if (mainAnswer === "View All Employees By Department") {
                        data = ` WHERE name = "${answer.queryViewByDepartName}"`;
                    }
                    else {
                        data = ` WHERE SOUNDEX(CONCAT(m.first_name, ' ', m.last_name)) = SOUNDEX("${answer.queryViewByManagerName}") ORDER BY role.id`;
                    }
                    // WHERE SOUNDEX(CONCAT(m.first_name, ' ', m.last_name)) = SOUNDEX("xxx xxx")

                    // console.log(query + data)

                    connection.query(query + data,
                        function (err, res) {
                            if (err) throw err;
                            console.table(res);
                            start();
                        });
                });
        } else {
            console.table(res);
            start();
        }
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

function addEmployee(mainAnswer) {
    const query = new Query(mainAnswer).queryResult;
    console.log(query);
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                name: "first_name",
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
                name: "last_name",
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
                name: "role_id",
                choices: function () {
                    let titleArray = [];
                    res.map(row => {
                        if (row.title != null) titleArray.push(row.title);
                    });
                    titleArray = titleArray.filter((item, index) => {
                        return titleArray.indexOf(item) === index;
                    });
                    return titleArray;
                },
                message: "What is the employee's role?"
            },
            {
                type: "list",
                name: "manager_id",
                choices: function () {
                    const nameArray = ["None"];
                    res.map(row => {
                        if (row.name != null) nameArray.push(row.name);
                    });
                    return nameArray;
                },
                message: "Who is the employee's Manager?",
            }
        ])
            .then(function (answer) {
                res.map(row => {
                    if (row.name === answer.manager_id) answer.manager_id = row.e_id;
                    if (row.title === answer.role_id) answer.role_id = row.role_id;
                });
                console.log(`e.id = ${answer.manager_id}, role.id = ${answer.role_id}`);
                const query = new Query("queryAddEmployee").queryResult;
                console.log(answer);
                connection.query(query, answer, function (err) {
                    if (err) throw err;
                    start();
                });
            });
    });
}

// async function addEmployee() {
//     try {
//         const roleArray = [];
//         const nameArray = [{ id: null, name: "None" }];
//         const roleQuery = new Query("queryRoles").queryResult;
//         const nameQuery = new Query("queryNames").queryResult;

//         const queryRoles = connection.query(roleQuery, function (err, res) {
//             if (err) throw err;
//             res.map(row => { roleArray.push({ id: row.id, title: row.title }); });
//         });

//         const queryNames = connection.query(nameQuery, function (err, res) {
//             if (err) throw err;
//             res.map(row => { nameArray.push({ id: row.id, name: row.name }); });
//         });

//         const userInput = await inquirer.prompt([
//             {
//                 type: "input",
//                 name: "empFirstName",
//                 message: "What is the employee's first name?",
//                 validate: function (value) {
//                     const pass = value.match(/^[a-zA-Z]{2,30}$/);
//                     if (pass) return true;
//                     else return "Please enter a valid name. Press upwards arrow to re-enter your value";
//                 },
//                 filter: function (value) {
//                     return value.charAt(0).toUpperCase() + value.substring(1);
//                 }
//             },
//             {
//                 type: "input",
//                 name: "empLastName",
//                 message: "What is the employee's last name?",
//                 validate: function (value) {
//                     const pass = value.match(/^[a-zA-Z]{2,30}$/);
//                     if (pass) return true;
//                     else return "Please enter a valid name. Press upwards arrow to re-enter your value";
//                 },
//                 filter: function (value) {
//                     return value.charAt(0).toUpperCase() + value.substring(1);
//                 }
//             },
//             {
//                 type: "list",
//                 name: "empRole",
//                 choices: function () {
//                     const titleOnly = roleArray.map(role => { return role.title; });
//                     return titleOnly;
//                 },
//                 message: "What is the employee's role?"
//             },
//             {
//                 type: "list",
//                 name: "empManager",
//                 choices: function () {
//                     const nameOnly = nameArray.map(name => { return name.name; });
//                     return nameOnly;
//                 },
//                 message: "Who is the employee's Manager?",
//             }
//         ]).then(function (answer) {
//             connection.query(
//                 "INSERT INTO employee SET ?",
//                 {
//                     first_name: answer.empFirstName,
//                     last_name: answer.empLastName,
//                     role_id: roleArray.find(role => role.title === answer.empRole).id,
//                     manager_id: nameArray.find(manager => manager.name === answer.empManager).id
//                 },
//                 function (err) {
//                     if (err) throw err;
//                     start();
//                 }
//             );
//         });
//     } catch (e) {
//         console.log('error', e);
//     }
// }
