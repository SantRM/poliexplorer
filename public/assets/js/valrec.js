document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('recuperarForm');
  const emailInput = document.getElementById('email');

  form.addEventListener('submit', function (e) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

    if (!email) {
      e.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor ingresa tu correo electrónico.',
      });
    } else if (!emailRegex.test(email)) {
      e.preventDefault();
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'El formato del correo no es válido.',
      });
    }
  });
});
