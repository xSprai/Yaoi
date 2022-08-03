const { MessageActionRow, MessageSelectMenu } = require('discord.js')
const Command = require('../../structures/Command')

module.exports = class extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            description: 'Envie uma mensagem do bot para algum canal.',
            options: [
                {
                    name: 'mensagem',
                    type: 'STRING',
                    description: 'A mensagem que será enviada no canal.',
                    required: true
                }
            ]
        })
    }

    run = async (interaction) => {
        if(!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: '> Você não tem permissão para isto!', ephemeral: true })

        const channels = interaction.guild.channels.cache
            .filter(c => c.type === 'GUILD_TEXT' && c.permissionsFor(this.client.user.id).has(['SEND_MESSAGE', 'EMBED_LINKS']) && c.permissionsFor(interaction.user.id).has('SEND_MESSAGE'))
        
        if(!channels.size) return interaction.reply({ content: 'Algo deu errado ao tentar enviar a mensagem.', ephemeral: true })

        const actionRow = new MessageActionRow()
            .addComponents([
                new MessageSelectMenu().setCustomId('selectMenu').setPlaceholder('Selecione um canal').setOptions([
                    channels.map(c => {
                        return {
                            label: c.name,
                            value: c.id
                        }
                    })
                ])
            ])

        const reply = await interaction.reply({ content: '**Informe um canal de texto abaixo.**', components: [actionRow], fetchReply: true })

        const filter = (i) => i.user.id === interaction.user.id
        const collect = reply.createMessageComponentCollector({ filter, max: 1, time: (15000) })

        collect.on('collect', (i) => {

            const idCanal = i.values[0]
            const canal = interaction.guild.channels.cache.get(idCanal)

            const mensagem = interaction.options.getString('mensagem')

            canal.send({ content: mensagem }).then(() => interaction.editReply({
                content: `A mensagem foi enviada no canal ${canal.toString()}`,
                components: []
            })).catch(() => error)
        })

        collect.on('end', (collected, reason) => {
            if (reason === 'time') return interaction.editReply({
                content: '**Você demorou demais para interagir com o menu.**`',
                components: []
            })
        })
    }
}
