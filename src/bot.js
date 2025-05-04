require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(express.json());

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('Erro: TELEGRAM_BOT_TOKEN não está definido nas variáveis de ambiente.');
  throw new Error('TELEGRAM_BOT_TOKEN não está definido');
}

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
const vercelUrl = process.env.VERCEL_URL || 'https://furia-fan-chat-zeta.vercel.app'; // URL do seu projeto
const webhookUrl = `${vercelUrl}${webhookPath}`;

console.log(`Tentando configurar webhook para: ${webhookUrl}`);
bot.setWebHook(webhookUrl).then(() => {
  console.log(`Webhook configurado com sucesso para: ${webhookUrl}`);
}).catch(err => {
  console.error('Erro ao configurar webhook:', err.message);
});

// Rota para receber atualizações do Telegram
app.post(webhookPath, (req, res) => {
  console.log('Recebida atualização do Telegram:', req.body);
  try {
    bot.processUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao processar atualização do Telegram:', error.message);
    res.sendStatus(500);
  }
});

// Comando /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const nome = msg.from.first_name || 'fã';

  const mensagem = `Olá, ${nome}! 👋
Sou o bot oficial dos torcedores da FURIA CS 🐺💣

Você pode me perguntar sobre:
- furia
- jogadores
- títulos
- próximo jogo
- loja

Vamos torcer juntos? 🖤🤍`;

  bot.sendMessage(chatId, mensagem).catch(err => {
    console.error('Erro ao enviar mensagem /start:', err.message);
  });
});

// Outras mensagens
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text.toLowerCase();

  let respondeu = false;

  for (const chave in respostas) {
    if (texto.includes(chave)) {
      bot.sendMessage(chatId, respostas[chave]).catch(err => {
        console.error(`Erro ao enviar mensagem para ${chave}:`, err.message);
      });
      respondeu = true;
      break;
    }
  }

  if (!respondeu) {
    bot.sendMessage(chatId, 'Desculpe, não entendi. Você pode perguntar sobre: "furia", "jogadores", "títulos", ou "próximo jogo".').catch(err => {
      console.error('Erro ao enviar mensagem de erro:', err.message);
    });
  }
});

// Exportar o app para o Vercel
module.exports = app;