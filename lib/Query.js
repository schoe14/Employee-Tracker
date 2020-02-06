class Query {
    constructor(query) {
        this.query = query;
        this.queryResult = this.queryGenerator();
    }
    queryGenerator() {
        switch (this.query) {
            case "View All Employees":
            case "View All Employees By Department":
            case "View All Employees By Manager":
            case "queryViewByDepartName":
            case "queryViewByManagerName":

                return "SELECT e.id AS id, e.first_name, e.last_name, title, name AS department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id";

            case "View Departments":
            case "Add Role":
                return "SELECT * FROM department";
            case "View Roles":
                return "SELECT role.id, title, salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id";
            // case "queryRoles":
            //     return "SELECT id, title FROM role";
            // case "queryNames":
            //     return "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee"
            case "Add Department":
                return "INSERT INTO department SET ?"

            case "queryAddRole":
                return "INSERT INTO role SET ?"
            case "Add Employee":
            case "Update Employee Role":
                return "SELECT role.id AS role_id, role.title, e.id AS e_id, CONCAT(e.first_name, ' ', e.last_name) AS name FROM role LEFT JOIN employee e ON role.id = e.role_id";
            case "queryAddEmployee":
                return "INSERT INTO employee SET ?";
            case "queryUpdateRole":
                return "UPDATE employee SET ? WHERE ?";
        }
    }
}
module.exports = Query;