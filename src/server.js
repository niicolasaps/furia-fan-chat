const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Arquivos estáticos (CSS, Imagens)
app.use(express.static(path.join(__dirname, '../public')));

// Página inicial
app.get('/', (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../views/index.html'));
  } catch (error) {
    console.error('Erro ao servir index.html:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Middleware para erros
app.use((err, req, res, next) => {
  console.error('Erro no servidor:', err.stack);
  res.status(500).send('Erro interno do servidor');
});

// Iniciar o servidor apenas se não estiver no ambiente do Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;