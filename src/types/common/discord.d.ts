import { Collection } from 'discord.js';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, Command>;
  }

  export interface Command {
    execute: (CommandInteraction) => Promise<(Message | void)>;
  }
}
