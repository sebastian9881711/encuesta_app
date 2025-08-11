
function validarRegistro(event) {
  event.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const dni = document.getElementById("dni").value.trim();
  const correo = document.getElementById("correo").value.trim();
  if (!nombre || !dni || !correo) return alert("Completa todos los campos.");
  localStorage.setItem("registro_nombre", nombre);
  localStorage.setItem("registro_dni", dni);
  localStorage.setItem("registro_correo", correo);
  document.getElementById("mensaje-registro").style.display = "block";
  setTimeout(() => window.location.href = "encuesta.html", 1000);
}

document.getElementById('formEncuesta')?.addEventListener('submit', async function (e) {
  e.preventDefault();
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

  if (res.ok) window.location.href = "gracias.html";
  else alert("❌ Error al enviar la encuesta");
});
