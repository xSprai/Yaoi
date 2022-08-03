const { MessageEmbed } = require('discord.js') 
const Event = require('../../structures/Event')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'guildMemberAdd'
        })
    }

    run = async (member) => {
        const guildDB = await this.client.db.guilds.findById(member.guild.id)

        if (guildDB?.welcome) {
            const welcomeChannel = member.guild.channels.cache.get(guildDB.welcome.channel)
            const embed = new MessageEmbed()
                .setTitle(`${member.user.username} seja bem vindo(a)`)
                .setDescription(`Seja bem-vindo(a) ao servidor __${member.user.username}__, abaixo vou listar algumas coisas interessantes que você pode encontrar por aqui. \n\n**Loja**: \`www.testing.com\`\n**Twitter**: \`@ServidoresTestings\``)
                .setThumbnail(member.user.avatarURL())
                .setColor('RANDOM')
                .setTimestamp()

            welcomeChannel?.send({ content: member.toString(), embeds: [embed] })
        }
    }
}
