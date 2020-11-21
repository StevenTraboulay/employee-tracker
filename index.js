const {prompt } = require("inquirer");
const logo = require('asciiart-logo');
const db = require("./db");
const { inherits } = require("util");
require("console.table");

init();

//display logo text, load main prompts
function init() {
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


//view all employees reporting to a certain manager
function ViewEmployeesByManager() {
    db.findAllEmployees()
    .then(([rows]) => {
    let managers = rows;
    const managerChoices = managers.map(({ id, first_name, last_name}) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));

    prompt ([
        {
            type: "list",
            name: "managerId",
            message: "Which employee do you want to see direct reports for?",
            choices: managerChoices
        }
    ])
    .then(res => db.findAllEmployeesByManager(res.managerId))
    .then(([rows]) => {
        let employees = rows;
        console.log("\n");
        if (employees.length === 0) {
            console.log("The selected employee has no directed reports");
        } else {
            console.table(employees);
        }
    })
    .then(() => loadMainPrompts())
    });
}

//add employee

function addRole() {
           prompt([
            {
                name: "first_name",
                message: "What is the employees first name?"
            },
            {
                name: "last_name",
                message: "What is the employees last name?"
            }
        ])
        .then(res => {
        let firstName = res.first_name;
        let lastName = res.last_name;

        db.findAllRoles()
        .then(([rows]) =>{
            let roles = rows;
            const roleChoices = roles.map(({ id, title}) => ({
                name: title,
                value: id
            }));

            prompt({
                type: "list",
                name: "roleId",
                message: "What is the employees role?",
                choices: roleChoices
            })
            .then(res => {
                let roleId = res.roleId;

                db.findAllEmployees()
                /then(([rows]) => {
                    let employees = rows;
                    const managerChoices = employees.map(({ id, first_name, last_name}) => ({
                        name: `${first_name} ${last_name}`,
                        value: id
                    }));

                    managerChoices.unshift({name:"None", value: null});

                    prompt({
                        type:"list",
                        name: "managerId",
                        message: "Who is the employees manager?",
                        choices: managerChoices
                    })
                    .then( res => {
                        let employee = {
                        manager_id: res.managerId,
                        role_id: roleId,
                        first_name: firstName,
                        last_name: lastName,
                        }
                        
                        db.createEmployee(employee);
                    })
                    .then(() => console.log(
                        `Added ${firstName} ${lastName} to the database`
                    ))
                    .then(() => loadMainPrompts())
                })
            })
        })
    })

}



//delete or remove employee
function removeEmployee() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        
        prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee would you like to delete?",
                choices: employeeChoices
            }
        ])
        .then(res => db.removeEmployee(res.employeeId))
        .then(() => console.log ("Removed employee from teh database"))
        .then(() => loadMainPrompts())
    })
}

//update existing employee role
function updateEmployeeRole() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt ([
            {
            type: "list",
            name: "employeeId",
            message: "Which employee you want to update my guy?",
            choices: employeeChoices
            }
        ])
        .then(res => {
            let employeeId = res.employeeId;
            db.findAllRoles()
            .then(([rows]) => {
                let roles = rows;
                const roleChoices = roles.map(({ id, title}) => ({
                    name: title,
                    value: id,
                }));

                prompt([
                    {
                        type: "list",
                        name: "roleId",
                        message: "Which role do you want to give the employee?",
                        choices: roleChoices                        
                    }
                ])
                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                .then(() => console. log("Updated employees role"))
                .then(() => loadMainPrompts())
            });
        });
    })
}

//Update employees manager
function updateEmployeeManager() {
    db.findAllEmployees()
    .then(([rows]) => {
        let employees = rows;
        const employeeChoices = employees.map(({ id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        prompt ([
            {
            type: "list",
            name: "employeeId",
            message: "Which employee manager you want to update my guy?",
            choices: employeeChoices
            }
        ])
        .then(res => {
            let employeeId = res.employeeId;
            db.findAllPossibleManagers()
            .then(([rows]) => {
                let managers = rows;
                const managerChoices = managers.map(({ id, first_name, last_name}) => ({
                    name: `${first_name} ${last_name}`,
                    value: id
                }));

                prompt([
                    {
                        type: "list",
                        name: "managerId",
                        message: "who do you want to set as their manager?",
                        choices: managerChoices                        
                    }
                ])
                .then(res => db.updateEmployeeManager(employeeId, res.roleId))
                .then(() => console. log("Updated employees Manager"))
                .then(() => loadMainPrompts())
            });
        });
    })
}

//see all roles
function viewRoles() {
    db.findAllRoles()
    .then(([rows]) => {
        let roles = rows;
        console.log("\n");
        console.table(roles);
    })
    .then(() => loadMainPrompts());
}

//adding roles
function addRole() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name}) => ({
            name: name,
            value: id
        }));

        prompt([
            {
                name: "title",
                message: "What is the name of the role?"
            },
            {
                name: "salary",
                message: "What is the role salary?"
            },
            {
                type: "list",
                name: "department_id",
                message: "Which department does the role belong to?",
                choices: departmentChoices
            }
        ])
        .then(role => {
            db.createRole(role)
            .then(() => console.log(`Added ${role.title} to the database`))
            .then(() => loadMainPrompts())
        })
    })
}

//delete role
function removeRole() {
    db.findAllRoles()
    .then(([rows]) => {
let roles = rows;
const roleChoices = roles.map(({ id, title}) => ({
    name: title,
    value: id
}));

prompt([
    {
    type: "list",
    name: "roleId",
    message: "Which role do you want to remove? (this will also remove attached employees)",
    choices: roleChoices
    }
])
.then(res => db.removeRole(res.roleId))
.then(() => console.log("Removed role from the database"))
.then(() => loadMainPrompts())

    })
}

//see all the departments we got
function viewDepartments() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
    })
    .then(() => loadMainPrompts());
}


//add department
function addDepartment(){
    prompt([
        {
            name: "name",
            message: "What is the department name?"
        }
    ])
    .then(res => {
        let name = res;
        db.createDepartment(name)
        .then(() => console.log(`added ${name.name} to the database`))
        .then(() => loadMainPrompts)
    })
}

//delete depart
function removeDepartment() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        const departmentChoices = departments.map(({ id, name}) => ({
            name: name,
            value: id
        }));

        prompt({
            type: "list",
            name: "departmentId",
            message:
            "which department would you like to remove? (warning: this will remove linked employees)",
            choices: departmentChoices
        })
        .then(res => db.removeDepartment(res.departmentId))
        .then(() => console.log("Removed department from the database"))
        .then(() => loadMainPrompts())
    })
}

//view all deps and used budget
function viewUtilizedBudgetByDepartment() {
    db.viewDepartmentBudgets()
    .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
    })
    .then(() => loadMainPrompts());
}


//end app
function quit() {
    console.log("LATER HOMIE");
    process.exit();
}