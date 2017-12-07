const { Buttons, EndPoints } = require('./Constants');
const ButtonValues = Object.values(Buttons).map(b => b.toLowerCase());

class Remote {
	constructor(roku) {
		if (!roku) throw new Error('No roku provided!');
		this.roku = roku;
	}

	/**
	 * Helper function for finding a key
	 * @param {string} key Key to find 
	 */
	find(key) {
		key = key.toLowerCase();
		if (key in Buttons) return Buttons[key];
		if (ButtonValues.includes(key)) return Buttons[ButtonValues.indexOf(key)].toLowerCase();
		return key;
	}

	/**
	 * Lifts the key
	 * @param {string} key
	 */
	up(key) {
		return this.roku.post(`${EndPoints.keyup}${this.find(key)}`);
	}

	/**
	 * Pushes the key
	 * @param {string} key
	 */
	down(key) {
		return this.roku.post(`${EndPoints.keydown}${this.find(key)}`);
	}

	/**
	 * Pushes and lifts the key
	 * @param {string} key
	 */
	press(key) {
		return this.roku.post(`${EndPoints.keypress}${this.find(key)}`);
	}

	/**
	 * Send a single letter
	 * @param {string} key
	 */
	send(key) {
		return this.press(`Lit_${encodeURIComponent(key)}`);
	}
}

module.exports = Remote;