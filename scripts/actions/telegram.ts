import * as dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

import { sendMessage } from '../libs/telegram';

async function main() {
    sendMessage('New Error!').catch(console.error);
}

main().catch(console.error); 