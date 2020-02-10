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
  ("Sarah", "Oliver", 1, null),
  ("John", "Doe", 2, 1),
  ("Alison", "Star", 3, 1),
  ("Annie", "Simmons", 4, null),
  ("David", "Dell", 5, 5),
  ("Chris", "Spears", 6, null),
  ("Brook", "Elvis", 7, 7),
  ("Megan", "Jannis", 8, null),
  ("Ed", "Smith", 9, 9);

  