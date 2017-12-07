const snek = require('snekfetch');
const { parseString } = require('xml2js');
const { EventEmitter } = require('events');
const Device = require('./structures/Device');
const { prefix } = require('./Constants');

class Util {
	constructor() {
		throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
	}
	/**
	 * Find the first device on the network
	 * @param {number} [start=2] The number to start searching from
	 * @param {number} [end=255] The number to stop searching at
	 * @param {number} [port=8060] The port to search on
	 * @returns {Promise<string>} The IP
	 */
	static async findFirstDevice(start = 2, end = 255, port = 8060) {
		for (let i = start; i <= end; i++) {
			const ip = `${prefix}${i}`;
			try {
				const { text } = await snek.get(`http://${ip}:${port}`);
				if (text.startsWith('<?xml')) return ip;
			} catch (err) {} // eslint-disable-line no-empty
		}
		throw new Error('No device found!');
	}
	/**
	 * Find all the devices on the network
	 * @param {number} [start=2] The number to start searching from
	 * @param {number} [end=255] The number to stop searching at
	 * @param {number} [port=8060] The port to search on
	 * @returns {EventEmitter}
	 */
	static findAllDevices(start = 2, end = 255, port = 8060) {
		const emitter = new EventEmitter();
		const hosts = [];
		const promises = [];
		for (let i = start; i <= end; i++) {
			const host = `${prefix}${i}:${port}`;
			promises.push(
				snek
					.get(`http://${host}`)
					.then(async res => {
						if (res.text.startsWith('<?xml')) {
							const xml = await this.parse(res.text).catch(console.error);
							const data = new Device(xml);
							hosts.push({ host, data });
							emitter.emit('new', host, data);
						}
					})
					.catch(() => null)
			);
		}
		Promise.all(promises).then(() => emitter.emit('end', hosts));
		emitter.destroy = () => emitter.emit('end', hosts);
		return emitter;
	}

	static get parse() {
		// Couldn't get promisify on electron
		return function(xml) {
			return new Promise((res, rej) => {
				parseString(xml, (err, js) => {
					if (err) rej(err);
					else res(js);
				});
			});
		};
	}
}

module.exports = Util;