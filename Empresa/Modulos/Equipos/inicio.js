document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch("/usuario");
        const data = await response.json();

        if (data.nombre && data.tipo_usuario) {
            document.getElementById("mensaje").innerText = `Bienvenido ${data.nombre} (${data.tipo_usuario})`;
        } else {
            document.getElementById("mensaje").innerText = "No hay sesión activa.";
        }
    } catch (error) {
        console.error("Error al cargar usuario:", error);
        document.getElementById("mensaje").innerText = "Error al obtener la información del usuario.";
    }
});
