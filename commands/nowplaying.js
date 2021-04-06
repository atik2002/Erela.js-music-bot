const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'nowplaying',
    aliases: ['np'],
    run: (message, args) => {
        try {
            function format(millis)
            {
                try {
                    var h = Math.floor(millis / 3600000),
                      m = Math.floor(millis / 60000),
                      s = ((millis % 60000) / 1000).toFixed(0);
                    if (h < 1) return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
                    else return (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s + " | " + (Math.floor(millis / 1000)) + " Seconds";
                  } catch (e) {
                    console.log(String(e.stack).bgRed)
                  }
            }
            
            const player = message.client.manager.get(message.guild.id);
            if (!player.queue.current)
        return message.channel.send(new MessageEmbed()
          .setColor('RED')
          .setTitle(`Error | There is nothing playing`)
        );
      //Send Now playing Message
      return message.channel.send(new MessageEmbed()
        .setAuthor(`Current song playing:`, message.author.displayAvatarURL({
          dynamic: true
        }))
        .setThumbnail(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
        .setURL(player.queue.current.uri)
        .setColor('GREEN')
        .setTitle(`**${player.queue.current.title}**`)
        .addField(`Duration: `, `\`${format(player.queue.current.duration)}\``, true)
        .addField(`Song By: `, `\`${player.queue.current.author}\``, true)
        .addField(`Queue length: `, `\`${player.queue.length} Songs\``, true)
        .setFooter(`Requested by: ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({
          dynamic: true
        }))
      );
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return message.channel.send(new MessageEmbed()
        .setColor('RED')
        .setTitle(`ERROR | An error occurred`)
        .setDescription(`\`\`\`${e.message}\`\`\``)
      );
    }
  }
};