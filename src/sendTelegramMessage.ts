import Axios from 'axios';

export const sendTelegramMessage = async ({message,chatId}:{chatId: string;message:string}) => {

  await Axios.post('https://api.telegram.org/bot2071091403:AAGN6yJuJM9oJ0O1GaUu6MmJiJEOhGSn9EA/sendMessage',{
    chat_id:chatId,
    text:message,
  })

}
