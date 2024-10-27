function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function swapArrayItems(array, i, j) {
	[array[i], array[j]] = [array[j], array[i]]
}

function saveObjectToJsonFile(object, defaultFileName) {
	let json = JSON.stringify(object, null, 1)
	let blob = new Blob([json], { type: 'application/json' })
	
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = defaultFileName
    link.click();
}

function loadObjectFromJsonFile(callback) {
	
	let p = new Promise((resolve, reject) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json'

		input.onchange = () => {
			const file = input.files[0]
			if (file) {
				const reader = new FileReader()
				reader.onload = () => {
					try {
						resolve(JSON.parse(reader.result))
					} catch (error) {
						reject(new Error("Error parsing JSON file"))
					}
				};
				reader.onerror = () => reject(new Error("Error reading file"))
				reader.readAsText(file)
			} else {
				reject(new Error("No file selected"))
			}
		};

		input.click()
	})
	
	p.then((result) => {
		callback(result)
	}).catch((err) => {
		console.log(err)
	})
}