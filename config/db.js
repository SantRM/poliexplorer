require("dotenv").config();
const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,     // antes: 'localhost'
  user: process.env.DB_USER,     // antes: 'root'
  password: process.env.DB_PASSWORD, // antes: ''
  database: process.env.DB_NAME  // antes: 'poliexplorer'
});

conexion.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conexión a la base de datos exitosa");
  }
});

module.exports = conexion;
