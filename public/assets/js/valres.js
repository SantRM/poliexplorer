document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('resetForm');
  const password1 = document.getElementById('password1');
  const password2 = document.getElementById('password2');

  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  form.addEventListener('submit', function (e) {
    const pass1 = password1.value.trim();
    const pass2 = password2.value.trim();

    if (!pass1 || !pass2) {
      e.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor completa ambos campos.',
      });
    } else if (pass1 !== pass2) {
      e.preventDefault();
      Swal.fire({
        icon: 'error',
        title: 'Contraseñas diferentes',
        text: 'Las contraseñas no coinciden.',
      });
    } else if (!passRegex.test(pass1)) {
      e.preventDefault();
      Swal.fire({
        icon: 'error',
        title: 'Contraseña insegura',
        html: 'Debe tener al menos <b>8 caracteres</b>, una <b>mayúscula</b>, una <b>minúscula</b> y un <b>número</b>.',
      });
    }
  });
});
