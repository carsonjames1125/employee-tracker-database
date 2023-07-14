const mysql = require('mysql2');

const colors = require('ansi-colors');

connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Barbara1125',
    database: 'employees_db',
    multipleStatements: true
}),

connection.connect((err) => {
    if (err) {
        console.log(colors.white.bgRed(err));
        return;
    }

    console.log(colors.blue(`Connected to Database. ThreadID: ${connection.threadId}`));
})

module.exports = connection;

