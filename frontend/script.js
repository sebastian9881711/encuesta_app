// Función para validar el registro inicial
function validarRegistro(event) {
  event.preventDefault();
  const formData = {
    nombre: document.getElementById("nombre").value.trim(),
    dni: document.getElementById("dni").value.trim(),
    correo: document.getElementById("correo").value.trim()
  };

  // Validación básica
  if (!formData.nombre || !formData.dni || !formData.correo) {
    return alert("Completa todos los campos.");
  }

  // Guardar en localStorage
  Object.entries(formData).forEach(([key, value]) => {
    localStorage.setItem(`registro_${key}`, value);
  });

  // Redirigir
  document.getElementById("mensaje-registro").style.display = "block";
  setTimeout(() => window.location.href = "encuesta.html", 1000);
}

// Manejo del formulario de encuesta
document.getElementById('formEncuesta')?.addEventListener('submit', async function(e) {
  e.preventDefault();
  
  try {
    const datos = {
      nombre: localStorage.getItem('registro_nombre'),
      dni: localStorage.getItem('registro_dni'),
      correo: localStorage.getItem('registro_correo'),
      metodo: document.getElementById('metodo').value,
      frecuencia: document.getElementById('frecuencia').value,
      dificultad: document.querySelector('input[name="dificultad"]:checked')?.value,
      detalle_dificultad: document.getElementById('detalle_dificultad').value,
      factores: Array.from(document.querySelectorAll('input[name="factores"]:checked')).map(el => el.value),
      adoptar: document.querySelector('input[name="adoptar"]:checked')?.value,
      comentarios: document.getElementById('comentarios').value
    };

    const res = await fetch('http://localhost:3000/api/respuestas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detalle || 'Error desconocido');
    }

    window.location.href = "gracias.html";
  } catch (error) {
    console.error('Error al enviar:', error);
    alert(`❌ Error al enviar: ${error.message}`);
  }
});