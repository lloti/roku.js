const { BrowserWindow, app } = require('electron');
const path = require('path');
const url = require('url');
const Config = require('electron-config');
const config = new Config();

let window = null;

function createWindow() {
	window = new BrowserWindow(Object.assign({
		title: 'Roku Desktop Remote',
		width: 1280,
		height: 720,
	}, config.get('winBounds')));

	window.loadURL(url.format({
		pathname: path.join(__dirname, 'src', 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	window.on('close', () => {
		config.set('winBounds', window.getBounds());
	});
}

app.on('ready', createWindow);

app.on('activate', () => {
  if (window === null) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});