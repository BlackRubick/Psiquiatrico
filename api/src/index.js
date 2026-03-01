// IMPORTANTE: Cargar dotenv PRIMERO
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/pacientes', require('./routes/pacientes'));
app.use('/api/profesionales', require('./routes/profesionales'));
app.use('/api/actividades', require('./routes/actividades'));
app.use('/api/calificaciones', require('./routes/calificaciones'));
app.use('/api/medicamentos', require('./routes/medicamentos'));
app.use('/api/emociones', require('./routes/emociones'));
app.use('/api/emergencias', require('./routes/emergencias'));
app.use('/api/dashboards', require('./routes/dashboards'));
app.use('/api/medicacion-tomada', require('./routes/medicacion-tomada'));
app.use('/api/actividades-calma', require('./routes/actividades-calma'));

app.get('/', (req, res) => {
  res.json({ message: 'API BIOPSYCHE funcionando' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor API escuchando en puerto ${PORT}`);
});
