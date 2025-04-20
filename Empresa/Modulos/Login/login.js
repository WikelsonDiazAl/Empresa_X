document.addEventListener("DOMContentLoaded", () => {

    document.getElementById("login-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const correo = document.getElementById("correo").value;
        const clave = document.getElementById("clave").value;

        try {
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, clave })
            });

            const data = await response.json();
            console.log("Respuesta del servidor:", data); // Depuración

            if (data.success) {
                localStorage.setItem("usuario", JSON.stringify(data.usuario));

                // Redirige después de 1 segundo para asegurar que se guarde el usuario
                setTimeout(() => {
                    window.location.href = "Equipos/equipos.html";
                }, 1000);
            } else {
                alert("Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error en el login:", error);
        }
    });
});
