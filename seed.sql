DROP DATABASE IF EXISTS employees_DB;
CREATE DATABASE employees_DB;
USE employees_DB;
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30),
  PRIMARY KEY (id)
);
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
INSERT INTO department (name)
VALUES
  ("Engineering"),
  ("Finance"),
  ("Legal"),
  ("Sales");
INSERT INTO role (title, salary, department_id)
VALUES
  ("Lead Software Engineer", 300000, 1),
  ("Senior Software Engineer", 250000, 1),
  ("Software Engineer", 150000, 1),
  ("Lead Accountant", 225000, 2),
  ("Accountant", 125000, 2),
  ("Legal Team Lead", 250000, 3),
  ("Lawyer", 190000, 3),
  ("Sales Lead", 100000, 4),
  ("Salesperson", 80000, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Tae", "Kim", 1, null),
  ("John", "Doe", 2, 1),
  ("Alison", "Star", 3, 1);
  
ALTER USER 'root' @'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpasswordhere'