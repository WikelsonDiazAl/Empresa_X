require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3000;

// Configurar la sesión
app.use(session({
    secret: "clave_secreta", // Cámbiala por una clave segura
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Usa `true` si trabajas con HTTPS
}));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("Modulos")); // Sirve archivos estáticos desde login/

// Configurar conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// **Ruta para registro de usuario**
app.post("/register", async (req, res) => {
  const { nombre, apellido, correo, clave, tipo_usuario } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO usuario (nombre, apellido, correo, clave, tipo_usuario, fecha_usuario, estado) VALUES ($1, $2, $3, $4, $5, NOW(), true) RETURNING *",
      [nombre, apellido, correo, clave, tipo_usuario]
    );
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});

// **Ruta para login**
app.post("/login", async (req, res) => {
    const { correo, clave } = req.body;

    try {
        const result = await pool.query(
            "SELECT nombre, tipo_usuario FROM usuario WHERE correo = $1 AND clave = $2",
            [correo, clave]
        );

        if (result.rows.length > 0) {
            const usuario = result.rows[0];

            // Guardar usuario en sesión
            req.session.usuario = usuario;

            res.json({ success: true, usuario });
        } else {
            res.status(401).json({ success: false, message: "Credenciales incorrectas" });
        }
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ success: false, message: "Error en el servidor" });
    }
});


app.get("/usuario", (req, res) => {
    if (req.session.usuario) {
        res.json(req.session.usuario);
    } else {
        res.status(401).json({ message: "No hay usuario autenticado" });
    }
});

// **Iniciar servidor**
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
