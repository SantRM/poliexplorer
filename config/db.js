require("dotenv").config();
const mysql = require("mysql2");

let connection;

function connectDB() {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  connection.connect(err => {
    if (err) {
      console.error("Error al conectar a MySQL:", err);
      setTimeout(connectDB, 2000); // reintenta
    } else {
      console.log("MySQL conectado");
    }
  });

  // Si la conexión se cae, se vuelve a levantar sin romper tu app
  connection.on("error", err => {
    console.error("Error en la conexión MySQL:", err);

    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log("Conexión perdida. Reintentando...");
      connectDB(); // se reconecta sin tocar tu controlador
    } else {
      throw err;
    }
  });
}

connectDB();

module.exports = connection;
