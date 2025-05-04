const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Arquivos estáticos (CSS, Imagens)
app.use(express.static(path.join(__dirname, '../public')));

// Página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});


module.exports = app;
