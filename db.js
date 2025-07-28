const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // change this if you have a different username
  password: 'Ajay',         // add your MySQL password
  database: 'contactdb'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = connection;
