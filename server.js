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

const showAll = () => {
    connection.query(allEmployee, (err, results) => {
        if (err) throw err;
        console.log(' ');
        console.table(chalk.green('All Employees'), results)
        startApp();
    })

}


const emByDepartment = () => {
    const departmentQ = 'SELECT * FROM departments';
    connection.query(departmentQ, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'pickDept',
                type: 'list',
                choices: function () {
                    let choices = results.map(choice => choice.department_name)
                    return choices;
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


const emByManager = () => {
    connection.query(manager, (err, results) => {
        if (err) throw err;

        inquirer.prompt([
            {
                name: 'man_choice',
                type: 'list', 
                choices: function () {
                    let choice = results.map(choices => choice.full_name);
                    return choice;
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
            })
        })
    })
}

