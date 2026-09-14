import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || process.env.SERVER_PORT || 10019;

// Servir los archivos estáticos de la build de producción
app.use(express.static(path.join(__dirname, 'dist')));

// Redireccionar todas las rutas a index.html (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor web de producción listo y escuchando en el puerto ${PORT}`);
});
