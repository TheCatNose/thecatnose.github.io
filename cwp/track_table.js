class TrackTable {
	
	static onModeChanged = null
	static currentRowIndex = null
	static currentVideo = null

	static initByVideo(video) {
		TrackTable.currentVideo = video
		
		let table = document.getElementById('tracks')
		table.innerHTML = ""
		
		let thead = document.createElement('thead')
		table.appendChild(thead)
		let th = document.createElement('th')
		thead.appendChild(th)
		th.appendChild(document.createTextNode('Title'))
		th = document.createElement('th')
		thead.appendChild(th)
		th.appendChild(document.createTextNode('Play in the list'))
		th = document.createElement('th')
		thead.appendChild(th)
		th.appendChild(document.createTextNode('Play'))
		
		for (let t = 0; t < video.trackCount(); t++) {
			let track = video.getTrack(t)
			let row = table.insertRow(t)
		
			let cell = row.insertCell(0)
			cell.innerText = track.getName()
			
			cell = row.insertCell(1)
			let cb = document.createElement('input');
			cb.type = 'checkbox';
			cb.checked = track.getMode() == TrackMode.Play ? "checked" : ""
			cb.addEventListener('change', (event) => { onModeChanged(video, t, event.currentTarget.checked) })
			cell.appendChild(cb)
			
			cell = row.insertCell(2)
			let button = document.createElement('button')
			button.textContent = "▷"
			button.onclick = function() { playSpecificTrack(video, t) }
			cell.appendChild(button)
		}
	}
	
	static highlightRow(trackIndex) {
		let table = document.getElementById('tracks')
		let oldRowIndex = TrackTable.currentRowIndex
		TrackTable.currentRowIndex = trackIndex
		if (TrackTable.currentRowIndex != null) {
			let currentRow = table.rows[TrackTable.currentRowIndex]
			currentRow.className = 'highlight'
		}
		
		if (oldRowIndex != null && oldRowIndex != TrackTable.currentRowIndex) {
			let oldRow = table.rows[oldRowIndex]
			if (oldRow != undefined)
				oldRow.className = undefined
		}
	}
	
	static refresh() {
		let table = document.getElementById('tracks')
		for (let i = 0; i < table.rows.length; i++) {
			let track = TrackTable.currentVideo.getTrack(i)
			let row = table.rows[i]
			let cb = row.children[1].children[0]
			cb.checked = track.getMode() == TrackMode.Play ? "checked" : ""
		}
	}

}
