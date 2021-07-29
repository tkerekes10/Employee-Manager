DROP DATABASE IF EXISTS employee_managerDB;
CREATE database employee_managerDB;

USE employee_managerDB;

CREATE TABLE Departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
  );

  INSERT INTO Departments (name)
  VALUES ("Development"), ("Customer Service"), ("Human Resources"), ("Sales");
  
  CREATE TABLE Roles (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL NOT NULL,
  department_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES Departments(id)
);

INSERT INTO Roles (title, salary, department_id)
VALUES ("Manager", 75000, 2);

INSERT INTO Roles (title, salary, department_id)
VALUES ("Developer", 80000, 1);

INSERT INTO Roles (title, salary, department_id)
VALUES ("Salesman", 150000, 4);

INSERT INTO Roles (title, salary, department_id)
VALUES ("Receptionist", 45000, 3);



CREATE TABLE Employees (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id) REFERENCES Roles(id)
);

INSERT INTO Employees (first_name, last_name, role_id)
VALUES ("Tom", "Kerekes", 2);

INSERT INTO Employees (first_name, last_name, role_id)
VALUES ("Natalie", "Adams", 1);

INSERT INTO Employees (first_name, last_name, role_id)
VALUES ("Charlie", "Kerekes", 3);

INSERT INTO Employees (first_name, last_name, role_id)
VALUES ("Frida", "Kerekes", 4);


