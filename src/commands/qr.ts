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
        'Foreground color of the generated QR Code, (Examples: "red", "rgb(255, 0, 0)" or "#FF0000")',
      required: false,
    },
  ],
  async execute(interaction: typeof Interaction) {
    const userString = `${interaction.options.getString('string')}`;
    const colorString = interaction.options.getString('color');
    const parsedColor = rgba(colorString);
    parsedColor.pop();
    const qrCode = qrImage.image(userString, {
      type: 'png',
      color: (colorString && parsedColor.length) ? parsedColor : '#FFFFFF',
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
    if (colorString && !parsedColor.length) {
      await interaction.reply({
        content: 'Invalid color entered, check the color format.',
        ephemeral: true,
      });
    } else {
      await interaction.reply({ embeds: [message], files: [image] });
    }
  },
};

export default QR;
