const {prompt } = require("inquirer");
const logo = require('asciiart-logo');
const db = require("./db");
const { inherits } = require("util");
require("console.table");

init();

//display logo text, load main prompts
function init();{
const logoText = logo({ name: "Employee Manager"}).render();

console.log(logoText);

loadMainPrompts();

}

function loadMainPrompts() {
    prompt([
        {
          type: "list",
          name: "choice",
          message: "What would you like to do?",
          choices: [
              {
                  name: "View All Employees",
                  value: "VIEW_EMPLOYEES"
              },
              {
                name: "View All Employees By Department",
                value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
            },
            {
                name: "View All Employees by Manager",
                value: "VIEW_EMPLOYEES_BY_MANAGER"
            },
            {
                name: "Add Employee",
                value: "ADD_EMPLOYEE"
            },
            {
                name: "Remove Employee",
                value: "REMOVE_EMPLOYEE"
            },
            {
                name: "Update Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
            },
            {
                name: "Update Employee Manager",
                value: "UPDATE_EMPLOYEE_MANAGER"
            },
            {
                name: "View All Roles",
                value: "VIEW_ROLES"
            },
            {
                name: "Add Role",
                value: "ADD_ROLE"
            },
            {
                name: "Remove Role",
                value: "REMOVE_ROLE"
            },
            {
                name: "View All Departments",
                value: "VIEW_DEPARTMENTS"
            },
            {
                name: "Add Department",
                value: "ADD_DEPARTMENT"
            },
            {
                name: "Remove Department",
                value: "REMOVE_DEPARTMENT"
            },
            {
                name: "View Total utilized Budget By Department",
                value: "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT"
            },
            {
                name: "Quit",
                value: "QUIT"
            },
          ]
        }
    ]).then(res => {
        let choice = res.choice;
        //call the right function totally depending on what the choice is from the user (user would be HR likely??)
        switch (choice) {
            case "VIEW_EMPLOYEES":
                viewEmployees();
                break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                viewEmployeesByDepartment();
                break;
            case "VIEW_EMPLOYEES_BY_MANAGER":
                ViewEmployeesByManager();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
                break;
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "REMOVE_DEPARTMENT":
                removeDepartment();
                break;
            case "VIEW_UTILIZED_BUDGET_BY_DEPARTMENT":
                viewUtilizedBudgetByDepartment();
                break;
            case "VIEW_ROLES":
                viewRoles();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            case "REMOVE_ROLE":
                removeRole();
                break;
            default:
                quit();
        }
    }
    )
}


//Checkout all the employees in the DB
function viewEmployees(){
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        console.table(employees);
    })
    .then(() => loadMainPrompts());
}

//look at all the employees that belong to a specific department
function viewEmployeesByDepartment() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) => ({
            name:name,
            value: id
        }));

        prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department would you like to see employees for?",
                choices: departmentChoices
            }
        ])
        .then(res => db.findAllEmployeesByDepartment(res.departmentId))
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => loadMainPrompts())
    });
}