document.getElementById("register-form").addEventListener("submit", async (event) => {
    event.preventDefault();
  
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const correo = document.getElementById("correo").value;
    const clave = document.getElementById("clave").value;
    const tipo_usuario = document.getElementById("tipo_usuario").value;
  
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, apellido, correo, clave, tipo_usuario }),
    });
  
    const data = await response.json();
  
    if (data.success) {
      alert("Registro exitoso");
      window.location.href = "login.html"; // Redirigir al login
    } else {
      alert("Error en el registro: " + data.error);
    }
  });
  