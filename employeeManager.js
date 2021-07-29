const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Be sure to update with your own MySQL password!
  password: "",
  database: "employee_managerDB",
});

connection.connect((err) => {
  if (err) throw err;
  runSearch();
});

const runSearch = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Update an employee's name",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "Add a Department":
          addDepartment();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "View All Departments":
          departmentsSearch();
          break;

        case "View All Roles":
          rolesSearch();
          break;

        case "View All Employees":
          employeesSearch();
          break;

        case "Update an employee's name":
          employeeUpdate();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const addDepartment = () => {
  inquirer
    .prompt({
      name: "name",
      type: "input",
      message: "What is the name of this department",
    })
    .then((answer) => {
      const insertQuery = `INSERT INTO Departments SET ?`;
      connection.query(
        insertQuery,
        {
          name: answer.name,
        },
        (err) => {
          if (err) {
            throw err;
          }
          console.log("Check the db");
          runSearch();
        }
      );
    });
};

const addRole = () => {
  let input;
  let departmentId;
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the Role?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of this role?",
      },
      {
        name: "departmentName",
        type: "input",
        message: "Which department is this part of?",
      },
    ])
    .then((answer) => {
      input = answer;
      console.log(input);
      const roleQuery = "SELECT * FROM Departments WHERE ?";
      connection.query(
        roleQuery,
        { name: answer.departmentName },
        (err, res) => {
          console.log(res);

          res.forEach(({ id, name }) => {
            console.log(id, name);
            departmentId = id;
          });
          console.log(departmentId);
          if (!departmentId) {
            console.log(
              "You must select a defined department or create one to assign to the role."
            );
          }
        }
      );
    })
    .then(() => {
      console.log(input);
      console.log(departmentId);
      const insertQuery = `INSERT INTO Roles SET ?`;
      connection.query(
        insertQuery,
        {
          title: input.title,
          salary: input.salary,
          department_id: departmentId,
        },
        (err) => {
          if (err) {
            throw err;
          }
          console.log("Check the db");
          runSearch();
        }
      );
    });
};

const addEmployee = () => {
  let input;
  let roleId;
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the first name of the employee",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the last name of the employee",
      },
      {
        name: "roleTitle",
        type: "input",
        message: "What is your role in the company?",
      },
    ])
    .then((answer) => {
      input = answer;
      console.log(input);
      const roleQuery = "SELECT * FROM roles WHERE ?";
      connection.query(roleQuery, { title: answer.roleTitle }, (err, res) => {
        console.log(res);

        res.forEach(({ id, title, salary, department_id }) => {
          console.log(id, title, salary, department_id);
          roleId = id;
        });
        console.log(roleId);
        if (!roleId) {
          console.log(
            "You must select a defined role or create one to assign to the employee"
          );
        }
      });
    })
    .then(() => {
      console.log(input);
      console.log(roleId);
      const insertQuery = `INSERT INTO Employees SET ?`;
      connection.query(
        insertQuery,
        {
          first_name: input.firstName,
          last_name: input.lastName,
          role_id: roleId,
        },
        (err) => {
          if (err) {
            throw err;
          }
          console.log("Check the db");
          runSearch();
        }
      );
    });
};

const departmentsSearch = () => {
  const query = "SELECT * FROM Departments";
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    runSearch();
  });
};

const rolesSearch = () => {
  const query = "SELECT * FROM Roles";
  connection.query(query, (err, res) => {
    if (err) throw err;

    console.table(res);
    runSearch();
  });
};

const employeesSearch = () => {
  const query =
    "SELECT employees.*, roles.title, roles.salary, roles.department_id, departments.name FROM employees LEFT JOIN roles ON employees.role_id=roles.id LEFT JOIN departments ON roles.department_id = departments.id";
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.table(res);
    runSearch();
  });
};

const employeeUpdate = () => {
  let employee;
  inquirer
    .prompt([
      {
        name: "employeeFirstName",
        type: "input",
        message: "What is the first name of the you would like to update?",
      },
      {
        name: "employeeLastName",
        type: "input",
        message:
          "What is the last name of the employee you would like to update?",
      },
    ])
    .then((answer) => {
      employee = answer;
      connection.query(
        `SELECT * FROM employees WHERE first_name = '${answer.employeeFirstName}' AND last_name = '${answer.employeeLastName}'`,
        (err, res) => {
          console.log(res);
          if (!res) {
            console.log("Please select a valid employee");
          } else {
            inquirer
              .prompt([
                {
                  name: "newFirstName",
                  type: "input",
                  message: "What is the employee's new first name",
                },
                {
                  name: "newLastName",
                  type: "input",
                  message: "What is the employee's new last name",
                },
              ])
              .then((answer) => {
                connection.query(
                  `UPDATE employees SET first_name = '${answer.newFirstName}', last_name = '${answer.newLastName}' WHERE first_name ='${employee.employeeFirstName}' and last_name = '${employee.employeeLastName}'`
                );
                console.log("Check the db");
                runSearch();
              });
          }
        }
      );
    });
};
