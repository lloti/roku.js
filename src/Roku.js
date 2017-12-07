const Remote = require('./Remote');
const Snek = require('snekfetch');
const Util = require('./Util');
const { EndPoints } = require('./Constants');
const DeviceInfo = require('./structures/DeviceInfo');
const Device = require('./structures/Device');
const ActiveApp = require('./structures/ActiveApp');
const App = require('./structures/App');

class Roku {
	/**
	 * Roku device constructor
	 * @param {string} ip The IP of the Roku device
	 * @param {number} [port=8060] The port of the Roku device
	 */
	constructor(ip, port = 8060) {
		if (!ip) throw new Error('No IP Provided');
		/**
		 * The IP of the roku followed by its port
		 * @type {string}
		 */
		this.host = `${ip}:${port}`;
		/**
		 * The remote with buttons
		 * @type {Remote}
		 */
		this.remote = new Remote(this);
	}

	/**
	 * Helper function for making all requests and converting them to js
	 * @param {string} method
	 * @param {string} endpoint
	 * @param {object} [query]
	 * @returns {Promise}
	 * @private
	 */
	async fetch(method, endpoint, query) {
		const request = new Snek(method, `http://${this.host}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`);
		if (query) request.query(query);
		if (method === 'POST') request.end();
		const { body, text } = await request;
		if (text.startsWith('<?xml')) return await Util.parse(text);
		return body;
	}

	/** @private */
	get(endpoint, query) {
		return this.fetch('GET', endpoint, query);
	}

	/** @private */
	post(endpoint, query) {
		return this.fetch('POST', endpoint, query);
	}

	/**
	 * Gets all the apps on the roku device
	 * @returns {Promise<App[]>}
	 */
	getApps() {
		return this.get(EndPoints).then(data => data.apps.app.map(a => new App(a)));
	}

	/**
	 * Returns the currently active app
	 * @returns {Promise<ActiveApp>}
	 */
	getActiveApp() {
		return this.get(EndPoints.app).then(data => new ActiveApp(data));
	}
	
	/**
	 * Gets the info from the root endpoint
	 * @returns {Promise<Device>}
	 */
	getInfo() {
		return this.get('/').then(data => new Device(data));
	}

	/**
	 * Gets the devices info
	 * @returns {Promise<DeviceInfo>}
	 */
	getDeviceInfo() {
		return this.get(EndPoints.info).then(data => new DeviceInfo(data));
	}

	/**
	 * Installs an app
	 * @param {number} app The ID of the app
	 * @returns {Promise<void>}
	 */
	install(app) {
		return this.post(`${EndPoints.install}${app}`);
	}

	/**
	 * Launches an app
	 * @param {number|string} app The ID of the app or "tvinput.dtv" for the TV tuner UI
	 * @returns {Promise<void>}
	 */
	launch(app) {
		return this.post(`${EndPoints.launch}${app}`);
	}

	/**
	 * Gets the icon and is returned as a snekfetch request
	 * @param {number} app The ID of the app
	 * @returns {Snek}
	 * @example
	 * // Saves Netflix's Icon
	 * roku.getIcon(12).pipe(fs.createWriteStream('./netflix.png'));
	 */
	getIcon(app) {
		return new Snek('GET', this.getIconURL(app));
	}

	/**
	 * Gets the url for the icon of an app
	 * @param {number} app The ID of the app
	 */
	getIconURL(app) {
		return `http://${this.host}/${EndPoints.icon}${app}`;
	}
}

module.exports = Roku;