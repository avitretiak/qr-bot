/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

import { Client, Collection, Intents } from 'discord.js';

(async () => {
  const { token } = process.env;
  const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });
  bot.commands = new Collection();
  const command = require('./commands/qr').default;
  bot.commands.set(command.name, command);

  bot.once('ready', () => console.log('Bot is listening for Commands!'));

  bot.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = bot.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  });
  bot.login(token);
})();
