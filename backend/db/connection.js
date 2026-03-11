const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",   // use the SAME password you used in mysql -u root -p
  database: "cms_portal"
});

connection.connect(function (err) {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("MySQL Connected Successfully");
});

module.exports = connection;