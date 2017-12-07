const Manufacturer = require('./Manufacturer');
const Service = require('./Service');
const Model = require('./Model');

class Device {
	constructor(data) {
		const [device] = data.root.device;
		this.version = `${data.root.specVersion[0].major[0]}.${data.root.specVersion[0].minor[0]}`;
		[this.type] = device.deviceType;
		[this.name] = device.friendlyName;
		[this.serial] = device.serialNumber;
		[this.udn] = device.UDN;
		this.manufacturer = new Manufacturer(device);
		this.model = new Model(device);
		this.services = Object.values(device.serviceList[0].service).map(s => new Service(s));
	}
}

module.exports = Device;