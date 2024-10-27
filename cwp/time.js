class Time {
	
	static secondsTromTime(t) {
		let parts = t.split(':').reverse()
		let timeUnit = 1
		let seconds = 0
		for (const part of parts) {
			seconds += parseInt(part)*timeUnit
			timeUnit *= 60
		}
		return seconds
	}
}
