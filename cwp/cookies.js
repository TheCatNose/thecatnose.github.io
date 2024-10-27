class Cookies {

	static getBool(name, defaultValue=false) {
		let value = defaultValue
		let values = document.cookie.split(';').map(function(item) { return item.trim() }).filter(r => r !== '')
		for (let i = 0; i < values.length; i++) {
			let kv = values[i]
			kv = kv.split('=')
			if (kv[0] == name) {
				value = kv[1]
				break
			}
		}
		return (value == "true" || value == true) ? true : false
	}
	
	static getNumber(name, defaultValue) {
		let value = defaultValue
		let values = document.cookie.split(';').map(function(item) { return item.trim() }).filter(r => r !== '')
		for (let i = 0; i < values.length; i++) {
			let kv = values[i]
			kv = kv.split('=')
			if (kv[0] == name) {
				value = Number(kv[1])
				break
			}
		}
		return value
	}
	
	static set(name, value) {
		document.cookie = name + "=" +  String(value)
	}

}
