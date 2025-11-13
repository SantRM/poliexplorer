document.getElementById('semestre').addEventListener('change', function () {
  const semestreId = this.value;
  // Limpia el select de materias
  const materiaSelect = document.getElementById('id_materia');
  materiaSelect.innerHTML = '<option value="">Cargando materias...</option>';
  fetch(`/api/materias?semestre=${semestreId}`)
    .then(response => response.json())
    .then(data => {
      materiaSelect.innerHTML = '<option value="">Seleccione una materia</option>';
      data.forEach(materia => {
        const option = document.createElement('option');
        option.value = materia.id;
        option.textContent = materia.nombre;
        materiaSelect.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Error al cargar materias:', err);
      materiaSelect.innerHTML = '<option value="">Error al cargar</option>';
    });
});

function mostrarCampoContenido(tipo) {
  const campoURL = document.getElementById('campoURL');
  const campoArchivo = document.getElementById('campoArchivo');
  const inputURL = campoURL.querySelector('input');
  const inputArchivo = campoArchivo.querySelector('input');

  if (tipo === 'Video (URL)') {
    campoURL.style.display = 'block';
    campoArchivo.style.display = 'none';
    inputURL.required = true;
    inputArchivo.required = false;
  } else if (tipo === 'Documento') {
    campoArchivo.style.display = 'block';
    campoURL.style.display = 'none';
    inputArchivo.required = true;
    inputURL.required = false;
  } else {
    campoArchivo.style.display = 'none';
    campoURL.style.display = 'none';
    inputArchivo.required = false;
    inputURL.required = false;
  }
}

const uploadArea = document.querySelector('.upload-area');
const fileInput = document.querySelector('.upload-link');
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});
uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});
uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
  }
});

document.querySelector('#form1').onsubmit = function (e) {
  const nombre = document.querySelector('input[name="nombre"]').value.trim();
  const semestre = document.querySelector('select[name="semestre"]').value;
  const materia = document.querySelector('select[name="id_materia"]').value;
  const tipo = document.querySelector('select[name="tipo"]').value;
  const url = document.querySelector('input[name="contenido_url"]');
  const archivo = document.querySelector('input[name="contenido_archivo"]');
  const regexTitulo = /^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9 ]+$/;
  // Validar título
  if (!regexTitulo.test(nombre)) {
    e.preventDefault();
    Swal.fire({
      icon: 'warning',
      title: 'Título no válido',
      text: 'El título solo puede contener letras, números y espacios.',
      confirmButtonColor: '#3085d6',
    });
    return false;
  }
  // Validar semestre
  if (!semestre) {
    e.preventDefault();
    Swal.fire({
      icon: 'warning',
      title: 'Falta seleccionar semestre',
      text: 'Por favor seleccione un semestre.',
      confirmButtonColor: '#186843',
    });
    return false;
  }
  // Validar materia
  if (!materia) {
    e.preventDefault();
    Swal.fire({
      icon: 'warning',
      title: 'Falta seleccionar materia',
      text: 'Por favor seleccione una materia.',
      confirmButtonColor: '#186843',
    });
    return false;
  }
  // Validar tipo
  if (!tipo) {
    e.preventDefault();
    Swal.fire({
      icon: 'warning',
      title: 'Falta seleccionar tipo de contenido',
      text: 'Por favor seleccione el tipo de contenido a subir.',
      confirmButtonColor: '#186843',
    });
    return false;
  }
  if (tipo === 'Video (URL)') {
    if (!urlVideo || !regexUrl.test(urlVideo)) {
      e.preventDefault();
      return Swal.fire({
        icon: 'warning',
        title: 'URL inválida',
        text: 'Ingrese una URL válida para el video.',
        confirmButtonColor: '#186843'
      });
    }
  }
  if (tipo === 'Documento') {
    if (!archivo) {
      e.preventDefault();
      return Swal.fire({
        icon: 'warning',
        title: 'Archivo requerido',
        text: 'Debe seleccionar un archivo PDF.',
        confirmButtonColor: '#186843'
      });
    }
    
  }
  // Si pasa todas las validaciones, se permite el submit
  return true;
};
