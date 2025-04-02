// Retrieve the bot token and chat ID from environment variables
const botToken = process.env.TELEGRAM_BOT_TOKEN || ''; // Use BotFather to get the token
const chatId = process.env.TELEGRAM_CHAT_ID || '';
// https://api.telegram.org/bot<bot_token>/getUpdates

/**
 * Sends a message to a specified Telegram chat using the Telegram Bot API.
 * 
 * @param {string} message - The message text to send.
 * @param {any} [object] - Optional object to include in the message. It will be stringified and appended to the message.
 * @returns {Promise<void>} - A promise that resolves when the message is successfully sent.
 * @note Logs an error to the console if the message fails to send.
 */
export async function sendMessage(message: string, object?: any): Promise<void> {
  // Construct the URL for the Telegram Bot API
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  
  try {
    // Prepare the message text, including the optional object if provided
    const text = object ? `${message}\n\n${JSON.stringify(object, null, 2)}` : message;

    // Send the message using the fetch API
    const response = await fetch(url, {
      method: 'POST', // Specify the HTTP method
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify({
        chat_id: chatId, // Specify the chat ID
        text: text, // Include the message text
      }),
    });

    // Get the response body as text first
    const responseText = await response.text();

    // Check if the response is not OK and throw an error if so
    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
    }
  } catch (error) {
    // Log the error to the console or rethrow it
    console.error('Error sending message to Telegram:', error);
  }
}
