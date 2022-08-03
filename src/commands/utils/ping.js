const { MessageActionRow, MessageButton } = require('discord.js')
const Command = require('../../structures/Command')

const actionRow = new MessageActionRow()
    .addComponents([
        new MessageButton().setStyle('DANGER').setLabel('Deletar').setCustomId('DELETAR')
    ])

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Latência do bot.'
        })
    }

    run = async (interaction) => {
        const reply = await interaction.reply({
            content: `Latência do bot: \`${this.client.ws.ping}\``,
            components: [actionRow],
            fetchReply: true
        })

        const filter = (b) => b.user.id === interaction.user.id
        const collect = reply.createMessageComponentCollector({ filter, max: 1 })

        collect.on('collect', (i) => {
            switch (i.customId) {
                case 'DELETAR' :
                    interaction.deleteReply()
                    break;
            }
        })
    }
}