require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json()); // Para processar requisições JSON do Telegram

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

// Respostas do bot
const respostas = {
  '/start': '',
  'furia': 'A FURIA é uma organização brasileira de e-sports fundada em 2017. Ela se destaca por sua atuação em diversas modalidades, como Counter-Strike 2, Rocket League, League of Legends, Valorant, Rainbow Six: Siege, Apex Legends e Futebol de 7. Além de competições, a FURIA também se posiciona como um movimento sociocultural, expandindo seu alcance e engajamento.',
  'jogadores': 'KSCERATO (rifler), yuurih (rifler), yeki (rifler), molodoy (AWPer) e FalleN (AWPer e Capitão).',
  'títulos': 'A FURIA conquistou: IEM New York 2020, ESL Pro League S12 NA e Elisa Masters Espoo 2023.',
  'proximo jogo': 'O próximo jogo será anunciado em breve nas redes oficiais da FURIA!',
  'fale comigo': 'Claro! Sou um bot oficial da FURIA. Digite "time", "jogadores", "títulos" ou "próximo jogo".',
  'loja': 'https://www.furia.gg/'
};

// Configurar o webhook
const webhookPath = `/webhook/${token}`;
const webhookUrl = `${process.env.VERCEL_URL}${webhookPath}`; // Ex.: https://seu-projeto.vercel.app/webhook/...

bot.setWebHook(webhookUrl).then(() => {
  console.log(`Webhook configurado para: ${webhookUrl}`);
}).catch(err => {
  console.error('Erro ao configurar webhook:', err);
});

// Rota para receber atualizações do Telegram
app.post(webhookPath, (req, res) => {
  bot.processUpdate(req.body); // Processa a atualização recebida
  res.sendStatus(200); // Responde ao Telegram com status 200
});

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || 'fã';

  const mensagem = `Olá, ${nome}! 👋
Sou o bot oficial da dos torcedores da FURIA CS 🐺💣

Você pode me perguntar sobre:
- furia
- jogadores
- títulos
- próximo jogo
- loja

Vamos torcer juntos? 🖤🤍`;

  bot.sendMessage(chatId, mensagem);
});

// Outras mensagens
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text.toLowerCase();

  let respondeu = false;

  for (const chave in respostas) {
    if (texto.includes(chave)) {
      bot.sendMessage(chatId, respostas[chave]);
      respondeu = true;
      break;
    }
  }

  if (!respondeu) {
    bot.sendMessage(chatId, 'Desculpe, não entendi. Você pode perguntar sobre: "furia", "jogadores", "títulos", ou "próximo jogo".');
  }
});

// Exportar o app para o Vercel
module.exports = app;