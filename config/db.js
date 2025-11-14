require("dotenv").config();
const mysql = require("mysql2");

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // IMPORTANTE para Railway
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

conexion.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conexión a la base de datos exitosa");
  }
});

module.exports = conexion;
