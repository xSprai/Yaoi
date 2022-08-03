class Event {
    constructor(client, options) {
        this.client = client
        this.name = options.name
        this.options = options.options
    }
}

module.exports = Event