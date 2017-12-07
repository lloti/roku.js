const App = require('./App');
class Screensaver extends App {}

class ActiveApp {
	constructor(data) {
		const app = data['active-app'];
		/** @type {string|App} */
		this.app = Array.isArray(app.app) ? app.app[0] : new App(app.app[0]);
		/** @type {?Screensaver} */
		this.screensaver = app.screensaver ? new Screensaver(app.screensaver) : null;
	}
}

module.exports = ActiveApp;