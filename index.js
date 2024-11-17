const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const {query} = require("express");


const token = '7989552745:AAFt44LwqIMbiq75yp86zEgSJMpNxb_8BWA';
const webAppURL = 'https://vermillion-cobbler-e75220.netlify.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();
app.use(cors());
app.use(express.json());


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  console.log(msg);

  if(text === '/start') {
      await bot.sendMessage(chatId, 'Приветствие', {
          reply_markup: {
              inline_keyboard: [
                  [{'text': 'Сайт', web_app: {url: webAppURL}}]
              ]
          }
      })
  }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;

    try {
        await  bot.answerWebAppQuery(queryId, {
            type:'article',
            query_id: queryId,
            title:'Успешная покупка',
            input_message_content:{massage_text:totalPrice+products}
        })
        return res.status(200).json({})
    }catch(err) {
        await  bot.answerWebAppQuery(queryId, {
            type:'article',
            query_id: queryId,
            title:'Что то пошло не так',
            input_message_content:{massage_text:'Что то пошло не так'}
        })
        return res.status(500).json({})
    }


})

const port =  8000;
app.listen(port, () => console.log(`Listening on port ${port}`));