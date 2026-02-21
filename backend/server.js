const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const usuariosDB = [{ email: "test@ciber.com", username: "admin" }];

app.get('/api/captcha', (req, res) => {
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    res.json({ question: `¿Cuánto es ${n1} + ${n2}?`, answer: n1 + n2 });
});

app.post('/api/register', (req, res) => {
    const { username, email, password, confirmPassword, captchaUser, captchaServer } = req.body;
    
    // 1. Validar que no haya campos vacíos
    if (!username || !email || !password || captchaUser === null) {
        return res.status(400).json({ error: "Todos los campos son obligatorios." });
    }

    // 2. Validar formato de Email (Segunda línea de defensa)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "El formato del correo no es válido." });
    }

    // 3. Validar si el email ya existe en nuestra "DB"
    const existe = usuariosDB.find(u => u.email === email);
    if (existe) {
        return res.status(400).json({ error: "Este correo ya está registrado." });
    }

    // 4. Validar Coherencia de Password
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Las contraseñas no coinciden." });
    }

    // 5. ¡LA CLAVE! Validar Captcha (Prueba de humanidad)
    if (Number(captchaUser) !== Number(captchaServer)) {
        return res.status(400).json({ error: "Respuesta de Captcha incorrecta. Inténtalo de nuevo." });
    }

    //guardamos
    usuariosDB.push({ username, email });
    console.log("Usuarios registrados:", usuariosDB);
    res.status(201).json({ message: "¡Registro exitoso! Bienvenido a la red." });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Servidor en: http://localhost:${PORT}`));