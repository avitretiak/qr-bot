import { MessageAttachment } from 'discord.js';

const qrImage = require('qr-image-color');
const rgba = require('color-rgba');
const { Interaction, Message } = require('discord.js');

const QR = {
  name: 'qr',
  description: 'Generates a QR for a given string of text!',
  options: [
    {
      type: 3,
      name: 'string',
      description: 'String you wish to encode into a QR Code',
      required: true,
    },
    {
      type: 3,
      name: 'color',
      description:
        'Hex encoded foreground color #rrggbb\n(default is black: #000000)',
      required: false,
    },
  ],
  async execute(interaction: typeof Interaction) {
    const userString = `${interaction.options.getString('string')}`;
    const colorString = interaction.options.getString('color');
    const colorValue = rgba(colorString);
    colorValue.pop();
    const qrCode = qrImage.image(userString, {
      type: 'png',
      color: colorValue.length ? colorValue : '#000000',
      transparent: true,
      size: 30,
    });
    const image = new MessageAttachment(qrCode, 'code.png');
    const message: typeof Message = {
      title: 'Your Generated QR',
      image: {
        url: 'attachment://code.png',
      },
      fields: [
        {
          name: 'QR Code String',
          value: userString,
        },
        { name: '\u200B', value: '\u200B' },
      ],
      timestamp: new Date(),
    };
    if (colorString && !colorValue.length) {
      await interaction.reply({
        content: 'Invalid color entered, try any valid color format.',
        ephemeral: true,
      });
    } else {
      await interaction.reply({ embeds: [message], files: [image] });
    }
  },
};

export default QR;
