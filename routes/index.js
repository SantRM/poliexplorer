const express = require('express');
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
  res.render('home');
});

router.get('/browse', (req, res) => {
  res.render('browse');
});

router.get('/details', (req, res) => {
  res.render('details');
});

router.get('/edituser', (req, res) => {
  res.render('edituser');
});

const { obtenerMaterialesPorMateria } = require('../controller/controllers');
router.get('/materia', async (req, res) => {
  const id = req.query.id;
  try {
    const materiales = await obtenerMaterialesPorMateria(id);
    const hayMateriales = Array.isArray(materiales) && materiales.length > 0;

    res.render('materia', {
      materiales: hayMateriales ? materiales : [],
      hayMateriales
    });
  } catch (error) {
    console.error('Error al cargar la Materia:', error.message);
    res.status(500).send('Error al cargar la Materia');
  }
});

const { obtenerMaterialesPorUsuario } = require('../controller/controllers');
router.get('/profile', async (req, res) => {
  const usuario = req.session.usuario;
  const aletrespt = req.session.aletrespt || null;

  if (!usuario) {
    return res.redirect('/login');
  }

  try {
    const materiales = await obtenerMaterialesPorUsuario(usuario.id);
    const hayMateriales = Array.isArray(materiales) && materiales.length > 0;

    res.render('profile', {
      usuario,
      materiales: hayMateriales ? materiales : [],
      hayMateriales,
      aletrespt
    });

    delete req.session.aletrespt;

  } catch (error) {
    console.error('Error al cargar el perfil:', error.message);
    res.status(500).send('Error al cargar el perfil');
  }
});


router.get('/semestres', (req, res) => {
  res.render('semestres');
});

router.get('/teacherdetails', (req, res) => {
  res.render('teacherdetails');
});

router.get('/logine', (req, res) => {
  res.render('logine');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/recuperar', (req, res) => {
  res.render('recuperar', { error: null, exito: null});
});

// Mostrar el formulario


// Procesar el cambio



// Procesar envío de correo

module.exports = router;

// Este archivo define las rutas de la aplicación.
const controllers = require('../controller/controllers');
// Restablecer contraseña
router.post('/recuperar', controllers.enviarRecuperacion);
router.post('/restablecer/:token', controllers.restablecerPassword);
router.get('/restablecer/:token', controllers.formRestablecer);
//Usuarios
router.post('/saveUsuarios', controllers.saveUsuarios);
router.post('/login', controllers.login);
router.get('/logout', controllers.logout);
router.post('/actualizarUsuario/:id', controllers.actualizarUsuario);
router.get('/semestre1', controllers.renderizarSemestre);
router.get('/api/materias', controllers.obtenerMateriasJSON);
router.post('/subir-material', controllers.subirMaterial);

