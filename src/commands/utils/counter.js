const { MessageActionRow, MessageButton } = require('discord.js')
const Command = require('../../structures/Command')

const actionRow = new MessageActionRow()
    .addComponents([
        new MessageButton().setStyle('SECONDARY').setLabel('-1').setCustomId('REMOVER'),
        new MessageButton().setStyle('DANGER').setLabel('Zerar').setCustomId('ZERAR'),
        new MessageButton().setStyle('SUCCESS').setLabel('+1').setCustomId('ADICIONAR')
    ])

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'contador',
            description: 'Inicia um contador no canal.'
        })
    }

    run = async (interaction) => {
        let contagem = 0

        const reply = await interaction.reply({
            content: `Contagem: \`${contagem}\``,
            components: [actionRow],
            fetchReply: true
        })

        const filter = (b) => b.user.id === interaction.user.id
        const collect = reply.createMessageComponentCollector({ filter, time: (15000) })

        collect.on('collect', (i) => {
            switch (i.customId) {
                case 'REMOVER' :
                    contagem--
                    break;
                case 'ZERAR' :
                    contagem = 0
                    break;
                case 'ADICIONAR' :
                    contagem++
                    break;
            }

            i.update({
                content: `Contagem atualizada para: \`${contagem}\``
            })
        })

        collect.on('end', (collected, reason) => {
            if (reason === 'time') return interaction.editReply({
                content: `Contagem finalizada em: \`${contagem}\``,
                components: []
            })
        })
    }
}