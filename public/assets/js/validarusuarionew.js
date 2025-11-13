
function validarFormulario() {
    // Obtener valores
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('contrasena1').value;
    const contrasena2 = document.getElementById('contrasena2').value;
    const rol = document.getElementById('rol').value;

    // Validar nombre (solo letras y espacios, mínimo 4 caracteres)
    if (!/^[a-zA-Z\s]{4,}$/.test(nombre)) {
      alert('El nombre debe tener al menos 4 letras y solo puede contener letras y espacios.');
      return false;
    }

    // Validar correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      alert('Ingrese un correo electrónico válido.');
      return false;
    }

    // Validar contraseña (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if ((!passRegex.test(contrasena)) && (!passRegex.test(contrasena2))) {
      alert('La contraseña debe tener al menos 8 caracteres e incluir una letra mayúscula, una minúscula y un número.');
      return false;
    }
     

    // Validar rol seleccionado
    if (!rol || (rol !== 'estudiante' && rol !== 'profesor')) {
      alert('Seleccione un rol válido.');
      return false;
    }

    // Si todo pasa
    return true;
  }

