class VideoCombobox {
	
	static onVideoSelected = null
	
	static init() {
		let select = document.getElementById('video')
		select.onchange = function() { onVideoSelected(this.options[this.selectedIndex].video) }
		for (let c = 0; c < VideoDb.collectionCount(); c++) {
			let collection = VideoDb.getCollection(c)
			let grp = document.createElement('optgroup')
			grp.label = collection.getName()
			select.appendChild(grp)
			for (let v = 0; v < collection.videoCount(); v++) {
				let video = collection.getVideo(v)
				let opt = document.createElement('option')
				opt.value = video.getYoutubeId()
				opt.video = video
				opt.text = video.getTitle()
				grp.appendChild(opt)
			}
		}
		select.onchange()
	}
	
	static currentVideo() {
		let select = document.getElementById('video')
		return select.options[select.selectedIndex].video
	}
	
	static selectVideo(video) {
		if (video.getYoutubeId() == this.currentVideo().getYoutubeId())
			return
		let select = document.getElementById('video')
		select.value = video.getYoutubeId()
	}
	
}