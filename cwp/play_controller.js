class PlaylistItem {
	constructor(video, trackIndex) {
		this.video      = video
		this.trackIndex = trackIndex
	}
}

class PlayController {
	
	constructor(player) {
		this.player = player
		this.player.addTrackStateEventListener(this._onTrackStateChanged.bind(this))
		
		this.mode    = {loop: null, random: null, allVideos: null, video: null}
		this.newMode = {}
		Object.assign(this.newMode, this.mode);
		
		this.playlist = []
		this.playlistIndex = null
		this.playlistEnded = true
	}
	
	setOnTrackStarted(callback) {
		this.onTrackStarted = callback
	}
	
	_onTrackStateChanged(state) {
		if (state == TrackState.Ended)
			this.next()
	}
	
	setLoop(loop) {
		this.newMode.loop = loop
	}
	
	setRandom(random) {
		this.newMode.random = random
	}
	
	setAllVideos(allVideos) {
		this.newMode.allVideos = allVideos
	}
	
	setVideo(video) {
		this.newMode.video = video
	}
	
	getCurrentVideo() {
		return this.playlistEnded ? null : this.playlist[this.playlistIndex].video
	}
	
	getCurrentTrackIndex() {
		return this.playlistEnded ? null : this.playlist[this.playlistIndex].trackIndex
	}
	
	playPause() {
		if (this.playlistEnded) {
			this.next()
		} else {
			switch(player.getTrackState()) {
				case TrackState.Paused:
					this.player.resume()
					break
				case TrackState.Playing:
					this.player.pause()
					break
			}
		}
	}
	
	prev() {
		if (this.playlistEnded)
			return
		while(true) {
			if (this.playlistIndex == 0)
				return
			this.playlistIndex--
			let item = this.playlist[this.playlistIndex]
			if (item.video.getTrack(item.trackIndex).getMode() == TrackMode.Play) {
				this._playCurrentPlaylistItem()
				return
			}
		}
	}
	
	next() {
		let generated = this._generateNewPlaylist()
		let originalPlaylistIndex = this.playlistIndex
		if (generated) { // This is new playlist, so don't skip current playlist index
			this.playlistIndex-- // Compensate initial increment (see below) to start with initial index, not incremented initial index
		}
		while(true) {
			this.playlistIndex++
			if (this.playlistIndex >= this.playlist.length) {
				if (this.mode.loop) {
					this.playlistIndex = 0
				} else {
					this.playlistEnded = true
					return
				}
			}
			let item = this.playlist[this.playlistIndex]
			if (item.video.getTrack(item.trackIndex).getMode() == TrackMode.Play) {
				this._playCurrentPlaylistItem()
				return
			}
			if (this.playlistIndex == originalPlaylistIndex) {
				this.playlistEnded = true
				return
			}
		}
	}
	
	playTrack(video, trackIndex) {
		let savedCurrentPlaylistIndex = this.playlistIndex
		this.setVideo(video)
		
		let generated = this._generateNewPlaylist()
		
		let foundPlaylistIndex = null
		for (let pi = 0; pi < this.playlist.length; pi++) {
			let item = this.playlist[pi]
			if (item.video.getYoutubeId() == video.getYoutubeId() &&
				item.trackIndex           == trackIndex) {
				foundPlaylistIndex = pi
				break
			}
		}
		this.playlistIndex = foundPlaylistIndex
		
		if (this.mode.random) {
			if (generated) {
				// If new playlist was just generated than selected track must be first playlist item.
				swapArrayItems(this.playlist, 0, foundPlaylistIndex)
				this.playlistIndex = 0
			} else {
				// Make sure that "prev" button will actually point to previously played video
				if (savedCurrentPlaylistIndex != null &&
					savedCurrentPlaylistIndex < this.playlist.length-1) {
					swapArrayItems(this.playlist, savedCurrentPlaylistIndex+1, foundPlaylistIndex)
					this.playlistIndex = savedCurrentPlaylistIndex+1
				}
			}
		}
		this._playCurrentPlaylistItem()
	}
	
	_playCurrentPlaylistItem() {
		let item = this.playlist[this.playlistIndex]
		this.player.play(item.video, item.trackIndex)
		if (this.onTrackStarted != undefined)
			this.onTrackStarted(item.video, item.trackIndex)
	}
	
	_generateNewPlaylist() {
		
		let generate = false
		if (this.playlistEnded) {
			generate = true
			this.playlistEnded = false
		}
		
		// Based on mode change
		if (!generate)
			generate = this.mode.random != this.newMode.random
		if (!generate)
			generate = this.mode.allVideos != this.newMode.allVideos
		if (!generate) {
			if (!this.mode.allVideos)
				generate = this.mode.video == null || this.mode.video.getYoutubeId() != this.newMode.video.getYoutubeId()
		}
		
		if (generate) {
			let newPlaylist = []
			if (this.newMode.allVideos) {
				for (let ci = 0; ci < VideoDb.collectionCount(); ci++)
				{
					let collection = VideoDb.getCollection(ci)
					for (let vi = 0; vi < collection.videoCount(); vi++) {
						let video = collection.getVideo(vi)
						for (let ti = 0; ti < video.trackCount(); ti++)
							newPlaylist.push( new PlaylistItem(video, ti) )
					}
				}
			} else {
				for (let ti = 0; ti < this.newMode.video.trackCount(); ti++)
					newPlaylist.push( new PlaylistItem(this.newMode.video, ti) )
			}
			
			if (this.newMode.random)
				shuffleArray(newPlaylist)
			
			// Avoid double playing - when new playlist starts with last played track - by swapping first two items of new playlist
			if (this.playlistIndex != null) {
				let lastPlayed = this.playlist[this.playlistIndex]
				if (lastPlayed.video.getYoutubeId() == newPlaylist[0].video.getYoutubeId()   &&
					lastPlayed.trackIndex    == newPlaylist[0].video.trackIndex) {
					if (newPlaylist.length > 1) {
						[newPlaylist[0], newPlaylist[1]] = [newPlaylist[1], newPlaylist[0]]
					}
				}
			}
			
			this.playlist = newPlaylist
			this.playlistIndex = 0
		}
		
		
		this.mode.loop      = this.newMode.loop
		this.mode.random    = this.newMode.random
		this.mode.allVideos = this.newMode.allVideos
		this.mode.video     = this.newMode.video
		
		return generate
	}
	
	setPosition(pos) {
		if (this.playlistIndex == null)
			return
		if (pos == 100) {
			next()
		} else {
			player.setPosition(pos)
		}
	}

}