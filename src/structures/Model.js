class Model {
	constructor(data) {
		[this.name] = data.modelName;
		[this.description] = data.modelDescription;
		[this.number] = data.modelNumber;
		[this.url] = data.modelURL;
	}
}

module.exports = Model;