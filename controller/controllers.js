const conexion = require('../config/db');
const bcrypt = require('bcrypt');
const transporter = require('../mail');
const crypto = require('crypto');

// Usuarios

exports.saveUsuarios = async (req, res) => {
  const { nombre, email, password1, password2, rol } = req.body;

  if (password1 != password2) {
    return res.render('register', { error4: 'Las contraseñas no son identicas' });
  }else{
    const contrasena = password1;
  
  // Verificar si el email ya está registrado
  const verificarSql = 'SELECT * FROM usuarios WHERE email = ?';
  conexion.query(verificarSql, [email], async (err, results) => {
    if (err) {
      console.error('Error al verificar email:', err);
      return res.status(500).send('Error del servidor');
    }

    if (results.length > 0) {
      // Correo ya registrado
      
      return res.render('register', { errorMsg: 'El correo ya está registrado. Usa otro.' });
 
    } else {
      // Hashear contraseña antes de guardar
      try {
        const hash = await bcrypt.hash(contrasena, 10);

        const nuevoUsuario = {
          nombre,
          email,
          contrasena: hash,
          rol
        };

        const insertarSql = 'INSERT INTO usuarios SET ?';
        conexion.query(insertarSql, nuevoUsuario, (error, results) => {
          if (error) {
            console.error('Error al guardar usuario:', error);
            return res.status(500).send('Error al registrar el usuario');
          } else {
            return res.render('logine', { errorMsg1: 'Usuario registrado exitosamente.' }); // Redirige al login
          }
        });

      } catch (hashError) {
        console.error('Error al hashear la contraseña:', hashError);
        return res.status(500).send('Error al procesar la contraseña');
      }
    }
  });
  }
};



// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = 'SELECT * FROM usuarios WHERE email = ?';

    conexion.query(sql, [email], async (err, results) => {
      if (err) {
        console.error('Error en la base de datos:', err);
        return res.status(500).send('Error interno del servidor');
      }

      if (results.length === 0) {
        return res.render('logine', { error: '*El correo no está registrado*' });
      }

      const usuario = results[0];

      const passwordMatch = await bcrypt.compare(password, usuario.contrasena);

      if (!passwordMatch) {
        return res.render('logine', { error1: '*Contraseña incorrecta*' });
      }

      // Credenciales válidas, guardar sesión
      req.session.usuario = {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      };

      return res.redirect('/'); // o la ruta correspondiente
    });

  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).send('Error interno del servidor');
  }
};



exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    }
    res.redirect('/logine');
  });
};


exports.actualizarUsuario = async (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;
  const id = req.params.id;

  try {
    // Verifica si se envió una nueva contraseña
    let campos;
    if (contrasena && contrasena.trim() !== '') {
      const hash = await bcrypt.hash(contrasena, 10);
      campos = { nombre, email, contrasena: hash, rol };
    } else {
      campos = { nombre, email, rol }; // sin contraseña
    }

    conexion.query('UPDATE usuarios SET ? WHERE id = ?', [campos, id], (err, results) => {
      if (err) {
        console.error('Error al actualizar usuario:', err);
        return res.status(500).send('Error al actualizar');
      }
      // Actualizar sesión si es el usuario autenticado
      if (req.session.usuario && req.session.usuario.id == id) {
        req.session.usuario.nombre = nombre;
        req.session.usuario.email = email;
        req.session.usuario.rol = rol;

        // Guardar cambios en la sesión y luego redirigir
        req.session.save(() => {
          return res.redirect('/profile'); // redirige donde corresponda
        });
      } else {
        // Si no es el usuario logueado, redirige normalmente
        return res.redirect('/logine'); // o ruta de admin
      }
    });

  } catch (error) {
    console.error('Error al hashear contraseña:', error);
    res.status(500).send('Error interno');
  }
};


// Renderiza la vista del semestre con las materias
exports.renderizarSemestre = async (req, res) => {
  try {
    const semestreId = parseInt(req.query.semestre);
    if (isNaN(semestreId)) {
      return res.status(400).send('Parámetro "semestre" inválido.');
    }

    const materias = await obtenerMateriasPorSemestre(semestreId);
    const nombreSemestre = numeroASemestreTexto(semestreId);
    const { totalCreditos, totalHoras, dificultad } = calcularTotales(materias);

    res.render('semestres', {
      semestre: semestreId,
      nombreSemestre,
      materias,
      totalCreditos,
      totalHoras,
      dificultad
    });
  } catch (err) {
    console.error('Error en renderizado de semestre:', err);
    res.status(500).send('Error interno del servidor');
  }
};

// Retorna materias en JSON (para selects dinámicos u otras vistas)
exports.obtenerMateriasJSON = async (req, res) => {
  try {
    const semestreId = parseInt(req.query.semestre);
    if (isNaN(semestreId)) {
      return res.status(400).json({ error: 'Parámetro "semestre" inválido.' });
    }

    const materias = await obtenerMateriasPorSemestre(semestreId);
    res.json(materias);
  } catch (err) {
    console.error('Error al obtener materias en JSON:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Asegura que la carpeta 'uploads' exista
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos PDF'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
}).single('contenido_archivo');

// Mapeo de tipo a ícono SweetAlert2
const iconMap = {
  success: 'success',
  warning: 'warning',
  danger: 'error'
};

// Función para manejar la subida de material
exports.subirMaterial = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Error al subir archivo:', err.message);
      req.session.aletrespt = {
        icon: iconMap['danger'],
        title: 'Error',
        text: 'Error al subir archivo: solo se permiten archivos PDF.'
      };
      return res.redirect('/profile');
    }

    try {
      const { id_usuario, id_materia, nombre, tipo, contenido_url } = req.body;
      let contenido = null;

      if (tipo === 'Video (URL)') {
        if (!contenido_url || !contenido_url.trim()) {
          req.session.aletrespt = {
            icon: iconMap['warning'],
            title: 'Advertencia',
            text: 'Debe ingresar una URL válida para el video.'
          };
          return res.redirect('/profile');
        }
        contenido = contenido_url;
      } else if (tipo === 'Documento' && req.file) {
        contenido = path.join('uploads', req.file.filename);
      }

      if (!contenido) {
        req.session.aletrespt = {
          icon: iconMap['warning'],
          title: 'Advertencia',
          text: 'No se proporcionó contenido válido.'
        };
        return res.redirect('/profile');
      }

      await conexion.execute(
        `INSERT INTO contenidos (id_usuario, id_materia, nombre, tipo, contenido)
         VALUES (?, ?, ?, ?, ?)`,
        [id_usuario, id_materia, nombre, tipo, contenido]
      );

      req.session.aletrespt = {
        icon: iconMap['success'],
        title: 'Éxito',
        text: 'Material subido exitosamente.'
      };
      return res.redirect('/profile');
    } catch (error) {
      console.error('Error al guardar en base de datos:', error);
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) console.error('Error al eliminar archivo subido:', unlinkErr);
        });
      }
      req.session.aletrespt = {
        icon: iconMap['danger'],
        title: 'Error',
        text: 'Error interno al guardar el material. Intente nuevamente.'
      };
      return res.redirect('/profile');
    }
  });
};

const conexion1 = require('../config/db').promise(); // solo donde lo necesites

exports.obtenerMaterialesPorUsuario = async function(id_usuario) {
  try {
    const materiales = await conexion1.query(`
      SELECT * FROM contenidos WHERE id_usuario = ?
    `, [id_usuario]);

    return materiales[0]; // si usas mysql2, materiales es [rows, fields], entonces [0] son las filas
  } catch (error) {
    console.error('Error en obtenerMaterialesPorUsuario:', error);
    throw error;
  }
};

exports.obtenerMaterialesPorMateria = async function(id_materia) {
  try {
    const materiales = await conexion1.query(`
      SELECT * FROM contenidos WHERE id_materia = ?
    `, [id_materia]);

    return materiales[0]; // si usas mysql2, materiales es [rows, fields], entonces [0] son las filas
  } catch (error) {
    console.error('Error en obtenerMaterialesPorMateria:', error);
    throw error;
  }
};

exports.enviarRecuperacion = (req, res) => {
  const { email } = req.body;

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  conexion.query(sql, [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.render('recuperar', { error: 'Error en la base de datos', exito: null });
    }

    if (results.length === 0) {
      return res.render('recuperar', { error: 'El correo no está registrado', exito: null });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expira = Date.now() + 3600000; // 1 hora

    const sqlUpdate = 'UPDATE usuarios SET token_recuperacion = ?, token_expira = ? WHERE email = ?';
    conexion.query(sqlUpdate, [token, expira, email], (err) => {
      if (err) {
        console.error(err);
        return res.render('recuperar', { error: 'Error al guardar el token', exito: null});
      }

      // Enviar correo
      const enlace = `http://localhost:3000/restablecer/${token}`;

      transporter.sendMail({
        from: '"Soporte 👨‍💻" <no-responder@poliexplorer.com>',
        to: email,
        subject: 'Recupera tu contraseña',
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
               <a href="${enlace}">${enlace}</a>
               <p>Este enlace expira en 1 hora.</p>`
      });

      res.render('recuperar', { error: null, exito: 'Se ha enviado un enlace a tu correo.' });
    });
  });
};


exports.formRestablecer = (req, res) => {
  const { token } = req.params;

  const sql = 'SELECT * FROM usuarios WHERE token_recuperacion = ? AND token_expira > ?';
  conexion.query(sql, [token, Date.now()], (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Error en el servidor');
    }

    if (results.length === 0) {
      return res.send('El enlace de recuperación no es válido o ha expirado');
    }

    res.render('restablecer', { token, error: null, exito: null });
  });
};

exports.restablecerPassword = async (req, res) => {
  const { token } = req.params;
  const { password1, password2 } = req.body;

  if (password1 !== password2) {
    return res.render('restablecer', { token, error: 'Las contraseñas no coinciden', exito: null });
  }

  const sql = 'SELECT * FROM usuarios WHERE token_recuperacion = ? AND token_expira > ?';
  conexion.query(sql, [token, Date.now()], async (err, results) => {
    if (err) {
      console.error(err);
      return res.send('Error al buscar usuario');
    }

    if (results.length === 0) {
      return res.send('El token es inválido o ha expirado');
    }

    const usuario = results[0];
    const hash = await bcrypt.hash(password1, 10);

    const sqlUpdate = `
      UPDATE usuarios 
      SET contrasena = ?, token_recuperacion = NULL, token_expira = NULL 
      WHERE id = ?
    `;
    conexion.query(sqlUpdate, [hash, usuario.id], (err) => {
      if (err) {
        console.error(err);
        return res.send('Error al actualizar la contraseña');
      }

      res.render('restablecer', { token: null, error: null, exito: 'Contraseña actualizada correctamente. Ahora puedes iniciar sesión.' });
    });
  });
};


// !!!!!funciones!!!!!

function calcularTotales(materias) {
  let totalCreditos = 0;
  let totalHoras = 0;

  materias.forEach(materia => {
    const creditos = Number(materia.cantidad_creditos) || 0;
    const horas = Number(materia.intensidad_horaria) || 0;

    totalCreditos += creditos;
    totalHoras += horas;
  });

  let dificultad = '';
  if (totalCreditos < 15) {
    dificultad = 'Fácil';
  } else if (totalCreditos <= 20) {
    dificultad = 'Media';
  } else {
    dificultad = 'Difícil';
  }

  return { totalCreditos, totalHoras, dificultad };
}

function numeroASemestreTexto(numero) {
  const nombres = [
    "Primer", "Segundo", "Tercer", "Cuarto", "Quinto",
    "Sexto", "Séptimo", "Octavo", "Noveno", "Décimo"
  ];

  return nombres[numero - 1] || `Semestre ${numero}`;
}


// Función reutilizable para obtener materias desde la base de datos
async function obtenerMateriasPorSemestre(semestreId) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM materias WHERE numero_semestre = ?';
    conexion.query(query, [semestreId], (err, results) => {
      if (err) {
        console.error('Error al consultar materias:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
}