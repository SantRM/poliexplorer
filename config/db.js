require("dotenv").config();
const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});

conexion.connect((err) => {
  if (err) {
    console.error("Error al conectar a MySQL:", err);
  } else {
    console.log("Conexión establecida con Railway (SSL activo)");
  }
});

module.exports = conexion;
