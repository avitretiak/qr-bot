const qrImage = require('qr-image-color');
const rgba = require('color-rgba');
const { Interaction, Message, MessageAttachment } = require('discord.js');

const data = {
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
    {
      type: 4,
      name: 'size',
      description: 'Size of each QR module in pixels (must be a positive integer, default is 5, max is 100)',
      required: false,
    },
  ],
};

function transformColor(input: string): Array<number> {
  const defaultColor = [255, 255, 255];
  const colorArray = rgba(input ?? defaultColor);
  colorArray.pop();
  return colorArray;
}

function generateQR(
  string: string,
  color: '#FFFFFF' | Array<Number>,
  size = 5,
): typeof MessageAttachment {
  return new MessageAttachment(
    qrImage.image(string, {
      type: 'png',
      transparent: true,
      color,
      size,
    }),
    'code.png',
  );
}

const QR = {
  ...data,
  async execute(interaction: typeof Interaction) {
    const userString = `${interaction.options.getString('string')}`;
    const color = interaction.options.getString('color');
    const size = interaction.options.getInteger('size') ?? 5;
    if (color && !rgba(color).length) {
      await interaction.reply({
        content: `Unable to parse color "${color}", double-check the color format.`,
        ephemeral: true,
      });
    } else if (size > 100 || size < 1) {
      await interaction.reply({
        content: `Invalid size ${size}, Input a valid integer between 1 and 100`,
        ephemeral: true,
      });
    } else {
      const image = generateQR(userString, transformColor(color), size);
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
        ],
        timestamp: new Date(),
      };
      await interaction.reply({ embeds: [message], files: [image] });
    }
  },
};

export default QR;
