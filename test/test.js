const { Roku, Util } = require('..');
const roku = new Roku('192.168.1.2');

roku.getInfo().then(console.log);

// console.log(roku.getIconURL(12));
// roku.getIcon(12).pipe(fs.createWriteStream(path.resolve(__dirname, 'netflix.png')));
// roku.getActiveApp().then(console.log);
// roku.getApps().then(console.log);
// roku.launch(12);
// roku.getGeneralInfo();
// roku.getDeviceInfo().then(console.log);

// const emitter = Util.findAllDevices();
// emitter.on('new', (ip, data) => {
// 	console.log(ip, data);
// 	// console.dir(data, { depth: null });
// });

// roku.remote.press('home');