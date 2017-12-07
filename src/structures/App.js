class App {
	constructor(data) {
		this.name = data._;
		this.id = data.$.id;
		this.type = data.$.type;
		/** @type {?string} */
		this.subtype = data.$.subtype;
		this.version = data.$.version;
	}
}

module.exports = App;