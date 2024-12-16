import axios from 'axios';

const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
const chatId = process.env.TELEGRAM_CHAT_ID || '';

export async function sendMessage(message: string, object?: any): Promise<void> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const text = object ? `${message}\n\n${JSON.stringify(object, null, 2)}` : message;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: text,
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error);
    throw error;
  }
}
