// variables

const mysql = require('mysql');
const inquirer = require('inquirer');
// need to use chalk to style 
const chalk = require('chalk');
// need to use console.table to organize the data
const consoleTable = require('console.table');
// need a starting screen 
const connection = require('./connection/connection');
// need employee queries
const startScr = ['View Employees', 'View Employees by Department', 'Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Role for Employee', 'Roles', 'Add Role', 'Remove Role', 'View Departments', 'Add Department', 'Remove Department', 'Leave']
// employee
const allEmployee = `SELECT e.id, e.first_name AS "First Name", e.last_name as "Last Name", r.title, d.department_name AS "Department", IFNULL(r.salary, 'No Data') AS "Salary", CONCAT(m.first_name, " ", m.last_name) AS "Manager"
FROM employees e 
LEFT JOIN roles r 
ON r.id = e.role_id
LEFT JOIN departments d
ON d.id = r.department_id
LEFT JOIN employees m ON m.id = e.manager_id
ORDER BY e.id;`
// add employee
const addEmployeeQuest = ['First Name?', 'Last Name', 'Role', 'Manager?']
// roles
const roleQ = 'SELECT * from roles; SELECT CONCAT (e.first_name, " ", e.last_name) AS full_name FROM employees e'
// manager 
const manager = 'SELECT CONCAT (e.first_name, " ", e.last_name) AS full_name, r.title, d.department_name, From employees e INNER JOIN roles r ON r.id = e.role_id INNER JOIN departments d ON d.id = r.department_id WHERE department_name = "Management";'



//start the app 

const startApp = () => {
    inquirer.prompt({
        name: 'menuChoice',
        type: 'list',
        message: 'Select an option',
        choices: startScreen

    }),then((answer) => {
        switch (answer.menuChoice) {
            case 'View Employees':
            showAll();
            break;
            case 'View Employees by Department':
            emByDepartment();
            break;
            case 'Employees by Manager':
            emByManager();
            break;
            case 'Add Employee':
            addEmployee();
            break;
            case 'Remove Employee':
            removeEmployee();
            break;
            case 'Update Role for Employee':
            updateRole();
            break;
            case 'Roles':
            viewRoles();
            break;
            case 'Add Role':
            addRole();
            break;
            case 'Remove Role':
            removeRole();
            break;
            case 'View Departments':
            viewDept();
            break;
            case 'Add Department':
            addDept();
            break;
            case 'Remove Department':
            removeDept();
            break;
            case 'Leave':
            connection.end();
            break;
        }
    })
}


// show all employees

const showAll = () => {
    connection.query(allEmployee, (err, results) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All Employees'), results)
        startApp();
    })

}

// sort employees by department

const emByDepartment = () => {
    const departmentQ = 'SELECT * FROM departments';
    connection.query(departmentQ, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'pickDept',
                type: 'list',
                choices: function () {
                    let choiceA = results.map(choice => choice.department_name)
                    return choiceA;
                },
                message: 'Select a Department:'
            }

        ]).then((answer) => {
            let pickedDept;
            for (let i = 0; i < results.length; i++) {
                if (results[i].department_name === answer.pickedDept) {
                    pickedDept = results[i];
                }
            }
            const query = 'SELECT e.id, e.first_name AS "First Name", e.last_name AS Last Name", r.title AS "Title", d.department_name AS "Department", r.salary AS "Salary" FROM employees e INNER JOIN roles r ON r.id =e.role_id INNER JOIN departments d ON d.id = r.department_id WHERE ?;';
            connection.query(query, { department_name: pickedDept.department_name }, (err, res) => {
                if (err) throw err;
                console.log(' ');
                console.table(chalk.green(`Employees by Department: $(pickedDept.department_name)`), res)
                startApp();
            })
        })
    })
}

// sort employees by manager 

const emByManager = () => {
    connection.query(manager, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'man_choice',
                type: 'list', 
                choices: function () {
                    let choiceA = results.map(choices => choice.full_name);
                    return choiceA;
                },
                message: 'Select Manager:'
            }

        ]).then((answer) => {
            const manQ2 = `SELECT e.id, e.first_name AS "First Name", e.last_name as "Last Name", IFNULL (r.title, "No Data") AS "Title", IFNULL(d.department_name, "No Data") AS "Department", IFNULL(r.salary, "No Data") AS "Salary", CONCAT(m.first_name, " ", m.last_name) AS "Manager"
            FROM employees e 
            LEFT JOIN roles r 
            ON r.id = e.role_id
            LEFT JOIN departments d
            ON d.id = r.department_id
            LEFT JOIN employees m ON m.id = e.manager_id
            WHERE CONCAT(m.first_name, " ",m.last_name) = ?
            ORDER BY e.id;`
            connection.query(manQ2, [answer.man_choice], (err, results) => {
                if (err) throw err;
                console.log(' ');
                console.table(chalk.green('Employees by Manager'), results);
                startApp();
            })
        })
    })
}


// add employee
const addEmployee = () => {
    if (err) throw err;
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: addEmployeeQuest[0]
        },
        {
            name: 'lastName',
            type: 'input',
            message: addEmployeeQuest[1]
        },
        {
            name: 'role',
            type: 'list',
            choices: function () {
                let choiceA = results[0].map(choice => choice.title);
                return choiceA;
            },
            message: addEmployeeQuest[2]
        },
        {
            name: 'manager',
            type: 'list',
            choices: function () {
                let choiceA = results[1].map(choice => choice.full_name);
                return choiceA;
            },
            message: addEmployeeQuest[3]
            
        }

    ]).then((answer) => {
        connection.query(
            `INSERT INTO employees(first_name, last_name, role_id, manager_id VALUES(?, ?,
            SELECT id FROM roles WHERE title = ? ),
            SELECT id FROM (SELECT if FROM employees WHERE CONCAT(first_name," ", last_name) = ? ) AS tmptable))`, [answer.firstName, answer.lastName, answer.role, answer.manager]
        )
        startApp();
    })
}

// remove employees

const removeEmployee = () => {
    connection.query(allEmployee, (err, results) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All Employees'), results)
        inquirer.prompt([
            {
                name: 'IDtoRemove',
                type: 'input',
                message: 'Enther the Employees Identification Number you would like to remove:'
            }
        ]).then((answer) => {
            connection.query(`DELETE FROM employees where ?`, { id: answer.IDtoRemove })
            startApp();
        })
    })
}

// update role for employee/employees

const updateRole = () => {
    const query = `SELECT CONCAT (first_name, " ", last_name) AS full_name FROM employees; SELECT title FROM roles`
    connection.query(query, (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'employ',
                type: 'list',
                choices: function () {
                    let choiceA = results[0].map(choice => choice.full_name);
                    return choiceA;
                },
                message: 'Select an employee to update their role:'
            },
            {
                name: 'newRole',
                type: 'list',
                choices: function() {
                    let choiceA = results[1].map(choice => choice.title);
                    return choiceA;
                }
            }
        ]).then((answer) => {
            connection.query(`UPDATE employees
            SET role_id = (SELECT id FROM roles WHERE title = ? )
            WHERE id = (SELECT if FROM(SELECT id FROM employees WHERE CONCAT(first_name," ",last_name) = ?) AS tmptable)`, [answer.newRole, answer.employ], (err, results) => {
                if (err) throw err;
                startApp();
            })
        })
    })
}

// view current roles

const viewRoles = () => {
    let query = `SELECT title AS "Title" FROM roles`;
    connection.query(query, (err, results) => {
        if (err) throw err;

        console.log(' ');
        console.table(chalk.green('All Roles'), results);
        startApp();
    })
}

// add role

const addRole = () => {
    const addRoleQ = `SELECT * FROM roles; SELECT * FROM departments`
    connection.query(addRoleQ, (err, results) => {
        if (err) throw err;

        console.log(' ');
        console.table(chalk.green('List Current Roles:'), results[0]);

        inquirer.prompt([
            {
                name: 'newTitle',
                type: 'input',
                message: 'Please enter a new Role:',
            },
            {
                name: 'newSalary',
                type: 'input',
                message: 'Enter pay for new role:'
            },
            {
                name: 'depart',
                type: 'list',
                choices: function() {
                    let choiceA = results[1].map(choice => choice.department_name);
                    return choiceA;
                },
                message: 'Select the Department for which the new Role belongs:'
            }
        ]).then((answer) => {
            connection.query(
                `INSERT INTO roles(title, salary, department_id)
                VALUES
                ("${answer.newTitle}", "${answer.newSalary}",
                (SELECT id FROM departments WHERE deapartment_name = "${answer.depart}"));`
            )
            startApp();
        })
    })
}

// remove role

const removeRole = () => {
    query = `SELECT * FROM roles`;
    connection.query(query, (err, results) => {
        if (err) throw err;


        inquirer.prompt([
            {
                name: 'removeRole',
                type: 'list',
                choices: function() {
                    let choiceA = results.map(choice => choice.title);
                    return choiceA;
                },
                message: 'Select the Role you wish to remove:'
            }.then((answer) => {
                connection.query(`DELETE FROM roles WHERE ? `, { title: answer.removeRole });
                startApp();
            })
        ])
    })
}


// view departments 

