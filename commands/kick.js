exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
	const Discord = require('discord.js');
	const guildSettings = client.settings.get(message.guild.id);

	let member = message.mentions.members.first();
	if (!member) return message.reply('Please mention a valid member of this server');
	if (!member.kickable)	return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?');

	let reason = args.slice(1).join(' ');
	if (!reason) return message.reply('Please indicate a reason for the kick!');

	member.kick(`${message.author.username} kicked this user with reason: ${reason}`).then(() => {
		message.reply(`${member.user.tag} (${member.user.id}) has been kicked by ${message.author.tag} (${message.author.id}) because: ${reason}`);
		if (!message.guild.channels.find('name', guildSettings.modLogChannel)) return console.log('modLogChannel does not exist on this server');
		const embed = new Discord.RichEmbed()
			.setColor('RED')
			.setTitle('User Kicked')
			.addField(`User`, `${member.user.tag} (${member.user.id})`, true)
			.addField(`Moderator`, `${message.author.tag} (${message.author.id})`, true)
			.addField(`Reason`, `${reason}`, true);
		message.guild.channels.find('name', guildSettings.modLogChannel).send({ embed })
			.then(() => {
				client.log('log', `${message.guild.name}/#${message.channel.name} (${message.channel.id}): ${member.user.tag} (${member.user.id}) was kicked by ${message.author.tag} (${message.author.id})`, 'CMD');
			})
			.catch((err) => {
				console.log(err);
			});
	})
		.catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	aliases: [],
	permLevel: 2
};

exports.help = {
	name: 'kick',
	category: 'Moderation',
	description: 'Kicks a user',
	usage: 'kick [@\\user] [reason]'
};
