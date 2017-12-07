class Service {
	constructor(data) {
		[this.type] = data.serviceType;
		[this.id] = data.serviceId;
		[this.spcd] = data.SCPDURL;
	}
}

module.exports = Service;