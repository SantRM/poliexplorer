const express = require('express');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
require("dotenv").config(); // Cargar el archivo .env

const app = express();

// Configuración de la sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // en Railway debe estar en false a menos que tengas HTTPS
    maxAge: 1000 * 60 * 60 // 1 hora
  }
}));

// Middleware para pasar usuario a las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

// Verificar expiración de sesión (opcional)
app.use((req, res, next) => {
  if (req.session?.usuario && req.session.cookie.expires && req.session.cookie.expires.getTime() < Date.now())
 {
    req.session.destroy(err => {
      if (err) console.error('Error al destruir la sesión:', err);
      return res.redirect('/login');
    });
  } else {
    next();
  }
});

// Motor de plantillas EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Formularios
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static('public'));

// Archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', require('./routes/index.js'));

// Iniciar servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
