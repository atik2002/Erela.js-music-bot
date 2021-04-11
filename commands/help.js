const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const prefix = require("../config.json").prefix;

module.exports = {
  name: "help",
  aliases : ['h'],
  description: "Shows all available bot commands.",
  run: (message, args) => {
    const data = [];
    const { commands } = message.client;
    if (!args.length) {
      const title = 'Here\'s a list of all my commands:';
      const description = data.push(commands.map(command => command.name).join(', '));
          const helpEmbed = new MessageEmbed()
          .setColor('RANDOM')
          .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
          .setTitle(title)
          .setDescription(data)
          .setTimestamp()
      return message.author.send(helpEmbed)
         .then(() => {
             if (message.channel.type === 'dm') return;
             message.reply('I\'ve sent you a DM with all my commands!');
         });
}}};
