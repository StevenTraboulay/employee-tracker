const connection = require("./connections");

class DB {
  //reference to connection
  constructor(connection) {
    this.connection = connection;
  }

  findAllEmployees() {
    return this.connection
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id; "
      );
  }

  //find all employees other than the givne id
  findAllPossibleManagers(employeeId) {
    return this.connection
      .promise()
      .query(
        "SELECT id, first_name, last_name FROM employee WHERE id !=?",
        employeeId
      );
  }

  //make new employee
  createEmployee(employee) {
    return this.connection
      .promise()
      .query("INSERT INTO employee SET?", employee);
  }

  //remove a given employee form specific chosen id
  removeEmployee(employeeId) {
    return this.connection
      .promise()
      .query("DELETE FROM employee WHERE id = ?", employeeId);
  }

  //update employee role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection
      .promise()
      .query("UPDATE employee role_id =? WHERE id =?", [roleId, employeeId]);
  }

  //update employee manager
  updateEmployeeManager(employeeId, managerId) {
    return this.connection
      .promise()
      .query("UPDATE employee SET manager_id = ? WHERE id = ?", [
        managerId,
        employeeId,
      ]);
  }

  //find all roles and departmetn join them to show the DPT names
  findAllRoles() {
    return this.connection
      .promise()
      .query(
        "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
      );
  }

  //create new role
  createRole(role) {
    return this.connection.promise().query("INSERT INTO role SET ?", role);
  }

  //get rid of role
  removeRole(roleId) {
    return this.connection
      .promise()
      .query("DELETE FROM role WHERE id = ?", roleId);
  }

  //retrieve all departments
  findAllDepartments() {
    return this.connection
      .promise()
      .query("SELECT department.id, department.name FROM department;");
  }

  //find all deps join employees and sum salary and budgets ..tf?
  viewDepartmentBudgets() {
    return this.connection
      .promise()
      .query(
        " SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
      );
  }

  //make new department
  createDepartment(department) {
    return this.connection
      .promise()
      .query("INSERT INFO department SET ?", department);
  }

  //delete department
  removeDepartment(departmentId) {
    return this.commection
      .promise()
      .query("DELETE FROM department WHERE id = ?", departmentId);
  }

  //find all employees in a department, join with roles to display role titles
  findAllEmployeesByDepartment(departmentId) {
    return this.connection
      .promise()
      .query(
        "SELECT employee.id, employe.first_name, employee.last_name, role.title FROM employee LEFT JOIN on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ?;",
        departmentId
      );
  }

  //find all employees by manager, join with department and roles to display titles and department names
  findAllEmployeesByManager(managerId) {
    return this.connection
      .promise()
      .query(
        "SELECT employee.id, employee.first_name, employe.last_name, department.name ASdepartment, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.departmentid = role.department_id WHERE manager_ud = ?;",
        managerId
      );
  }
}

module.exports = new DB(connection);
