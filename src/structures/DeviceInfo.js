const toCamel = str => str.split('-').map((s, i) => i ? `${s[0].toUpperCase()}${s.slice(1)}` : s).join('');

class DeviceInfo {
	constructor(data) {
		// if you thought i'd right all this
		const info = data['device-info'];
		for (const key of Object.keys(info)) {
			const [val] = info[key];
			this[toCamel(key)] = val === 'true' ? true : val === 'false' ? false : val;
		}
	}
}

module.exports = DeviceInfo;