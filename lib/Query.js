class Query {
    constructor(query) {
        this.query = query;
        this.queryResult = this.queryGenerator();
    }
    queryGenerator() {
        switch (this.query) {
            case "View All Employees":
                return "SELECT e.id AS id, e.first_name, e.last_name, title, name AS department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id ORDER BY e.id";

            case "View All Employees By Department":
            case "View All Employees By Manager":
            case "View the Total Utilized Budget By Department":
                return "SELECT e.id AS id, e.first_name, e.last_name, title, name AS department, salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id";

            case "queryTotalBudget":
                return "SELECT name AS department, SUM(salary) AS total_budget FROM employee e LEFT JOIN employee m ON m.id = e.manager_id LEFT JOIN role ON e.role_id = role.id LEFT JOIN department ON role.department_id = department.id";

            case "View Departments":
            case "Add Department":
            case "Add Role":
            case "Remove Department":
                return "SELECT * FROM department";

            case "View Roles":
                return "SELECT role.id, title, salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id";

            case "queryAddDepartment":
                return "INSERT INTO department SET ?"

            case "queryAddRole":
                return "INSERT INTO role SET ?"

            case "Add Employee":
            case "Update Employee Role":
            case "Update Employee Manager":
                return "SELECT role.id AS role_id, role.title, e.id AS e_id, CONCAT(e.first_name, ' ', e.last_name) AS name FROM role LEFT JOIN employee e ON role.id = e.role_id";

            case "Remove Employee":
                return "SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee";

            case "Remove Role":
                return "SELECT id, title AS name FROM role"

            case "queryAddEmployee":
                return "INSERT INTO employee SET ?";

            case "queryUpdateRole":
                return "UPDATE employee SET role_id = ? WHERE id = ?";

            case "queryUpdateManager":
                return "UPDATE employee SET manager_id = ? WHERE id = ?";

            case "queryRemoveEmployee":
                return "DELETE FROM employee WHERE ?";

            case "queryRemoveDepartment":
                return "DELETE FROM department WHERE ?";

            case "queryRemoveRole":
                return "DELETE FROM role WHERE ?";
        }
    }
}
module.exports = Query;