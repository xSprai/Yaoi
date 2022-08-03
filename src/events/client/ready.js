const Event = require('../../structures/Event')

module.exports = class extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        })
    }

    run = () => {
        console.log(`${this.client.user.username} foi iniciado em ${this.client.guilds.cache.size} servidores!`)
        this.client.registryCommands()
        this.client.connectToDatabase()
    }
}