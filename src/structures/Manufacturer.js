class Manufacturer {
	constructor(data) {
		[this.name] = data.manufacturer;
		[this.url] = data.manufacturerURL;
	}
}

module.exports = Manufacturer;