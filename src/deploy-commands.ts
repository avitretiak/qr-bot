/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

const { token, clientId } = process.env;
const commands: Array<JSON> = [require('./commands/qr')];
const rest = new REST({ version: '9' }).setToken(token as string);

rest
  .put(Routes.applicationCommands(clientId as string), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
