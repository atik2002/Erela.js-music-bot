const Discord = require('discord.js')

module.exports = {
    name: 'play',
    aliases: ['p'],
    run: async (message, args) => {
      const { channel } = message.member.voice;
  
      if (!channel) return message.reply('you need to join a voice channel.');
      if (!args.length) return message.reply('you need to give me a URL or a search term.');
  
      const player = message.client.manager.create({
        guild: message.guild.id,
        voiceChannel: channel.id,
        textChannel: message.channel.id,
        selfDeafen: true,
      });
  
      if (player.state !== "CONNECTED") player.connect();
  
      const search = args.join(' ');
      let res;
  
      try {
        res = await player.search(search, message.author);
        if (res.loadType === 'LOAD_FAILED') {
          if (!player.queue.current) player.destroy();
          throw res.exception;
        }
      } catch (err) {
        return message.reply(`there was an error while searching: ${err.message}`);
      }
  
      switch (res.loadType) {
        case 'NO_MATCHES':
          if (!player.queue.current) player.destroy();
          return message.reply('there were no results found.');
        case 'TRACK_LOADED':

          const playmusic = new Discord.MessageEmbed()
          .setColor('#00f70c')
          .setAuthor(`Enqueuing:`, message.client.user.displayAvatarURL({
            dynamic: true
          }))
          .setDescription(`${res.tracks[0].title}`)
          .setTimestamp()

          player.queue.add(res.tracks[0]);
  
          if (!player.playing && !player.paused && !player.queue.size) player.play();
          return message.channel.send(playmusic);
        case 'PLAYLIST_LOADED':
          player.queue.add(res.tracks);

          const playlist = new Discord.MessageEmbed()
          .setColor('#00f70c')
          .setAuthor(`Enqueuing playlist:`, message.client.user.displayAvatarURL({
            dynamic: true
          }))
          .setDescription(`${res.playlist.name}\` with ${res.tracks.length} tracks.`)
          .setTimestamp()

          if (!player.playing && !player.paused && player.queue.totalSize === res.tracks.length) player.play();
          return message.channel.send(playlist);
        case 'SEARCH_RESULT':
          let max = 5, collected, filter = (m) => m.author.id === message.author.id && /^(\d+|end)$/i.test(m.content);
          if (res.tracks.length < max) max = res.tracks.length;
  
          const results = res.tracks
              .slice(0, max)
              .map((track, index) => `${++index} - \`${track.title}\``)
              .join('\n');
  

          const searchResult = new Discord.MessageEmbed()
                .setColor('#00f70c')
                .setTitle('Search Results: ')
                .setDescription(results)
                .addField('Cancel Search: ','Type end or any other number to cancel the search',true)
                .setTimestamp()

          message.channel.send(searchResult);
  
          try {
            collected = await message.channel.awaitMessages(filter, { max: 1, time: 30e3, errors: ['time'] });
          } catch (e) {
            if (!player.queue.current) player.destroy();
            return message.reply("you didn't provide a selection.");
          }
  
          const first = collected.first().content;
  
          if (first.toLowerCase() === 'end') {
            if (!player.queue.current) player.destroy();
            return message.channel.send('Cancelled selection.');
          }
  
          const index = Number(first) - 1;
          if (index < 0 || index > max - 1) return message.reply(`the number you provided too small or too big (1-${max}).`);
          
          const track = res.tracks[index];
          player.queue.add(track);

          const trackadd = new Discord.MessageEmbed()
          .setColor('#00f70c')
          .setAuthor(`Enqueuing:`, message.client.user.displayAvatarURL({
            dynamic: true
          }))
          .setDescription(`${track.title}`)
          .setTimestamp()
  
          if (!player.playing && !player.paused && !player.queue.size) player.play();
          return message.channel.send(trackadd);

      }
    },
  };