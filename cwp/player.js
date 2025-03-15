class TrackState {
	static Playing = 0
	static Paused = 1
	static Ended = 2
}

class Player {
	
	static {
		let tag = document.createElement('script')
		tag.src = "https://www.youtube.com/iframe_api"
		let firstScriptTag = document.getElementsByTagName('script')[0]
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
	}
	
	constructor(playerId, video, onInitialized) {
		this.onInitialized = onInitialized
		this.initialized = false
		this.trackState = TrackState.Ended
		this.trackStateListeners = []
		this.positionChangedListeners = []
		this.video = video ?? VideoDb.getCollection(0).getVideo(0)
		this.yt = new YT.Player('player', {
			height: '180',
			width: '320',
			videoId: this.video.getYoutubeId(),
			playerVars: {
				controls: 0,
				disablekb: 1,
				enablejsapi: 1,
				modestbranding: 1,
				fs: 0,
				rel: 0,
				showinfo: 0
			},
			events: {
				'onStateChange': this.onPlayerStateChange.bind(this)
			}
        })
		setInterval(this.stateChecker.bind(this), 50);
	}
	
	addTrackStateEventListener(listener) {
		this.trackStateListeners.push(listener)
	}
	
	addPositionChangedListener(listener) {
		this.positionChangedListeners.push(listener)
	}
	
	getTrackState() {
		return this.trackState
	}
	
	_setStateAndNotify(state) {
		this.trackState = state
		this._notifyAboutStateChange()
	}
	
	_notifyAboutStateChange() {
		this.trackStateListeners.forEach( (listener) => listener(this.trackState) )
	}
	
	onPlayerStateChange(event) {
		if (!this.initialized) {
			if (event.data == YT.PlayerState.PLAYING) {
				this.yt.pauseVideo()
				this.initialized = true
				this.onInitialized()
				delete this.onInitialized
			}
			return
		}
		switch(event.data) {
			case YT.PlayerState.PLAYING:
				if (this.playAfterLoading != undefined) { // It means video was loaded and started autoplaying
					this._play()
					delete this.playAfterLoading
				}
				this._setStateAndNotify(TrackState.Playing)
				break
			case YT.PlayerState.PAUSED:
			if (this.trackState == TrackState.Playing)
					this._setStateAndNotify(TrackState.Paused)
				break
			case YT.PlayerState.ENDED:
				this._setStateAndNotify(TrackState.Ended)
				break
		}
	}
	
	stateChecker() {
		if (!this.initialized)
			return
		if (this.yt.getPlayerState() != YT.PlayerState.PLAYING)
			return
		
		let time = this.yt.getCurrentTime()
		if (this.positionChangedListeners.length > 0) {
			let track = this.video.getTrack(this.trackIndex)
			let start = Time.secondsTromTime( track.getStartTime() )
			let end = this._trackEndTime()
			if (end != null && end != 0) {
				if (time >= start && time <= end) {
					let pos = time-start
					let percent = pos/(end-start)*100
					this.positionChangedListeners.forEach( (listener) => listener(percent) )
				}
			}
		}
		
		if (this.endSeconds == undefined)
			return
		if (Math.floor(time) == this.endSeconds) {
			this.trackState = TrackState.Ended
			this.yt.pauseVideo()
			this._notifyAboutStateChange()
		}
	}
	
	_play() {
		let startTime = this.video.getTrack(this.trackIndex).getStartTime()
		let startSeconds = Time.secondsTromTime(startTime)
		
		let nextIndex = this.trackIndex+1
		if (nextIndex < this.video.trackCount()) {
			let endTime = this.video.getTrack(nextIndex).getStartTime()
			this.endSeconds = Time.secondsTromTime(endTime)
		} else {
			delete this.endSeconds
		}
		
		this.yt.seekTo(startSeconds)
		this.yt.playVideo()
	}
	
	play(video, trackIndex) {
		this.trackIndex = trackIndex
		if (this.video.getYoutubeId() != video.getYoutubeId()) {
			this.playAfterLoading = true
			this.video = video
			this.yt.loadVideoById(this.video.getYoutubeId())
		} else {
			this.video = video
			this._play()
		}
	}
	
	resume() {
		this.yt.playVideo()
	}
	
	pause() {
		this.yt.pauseVideo()
	}
	
	setPosition(posPercents) {
		let track = this.video.getTrack(this.trackIndex)
		let start = Time.secondsTromTime( track.getStartTime() )
		let end = this._trackEndTime()
		
		if (end == null || end == 0)
			return
		
		let length = end-start
		let pos = start + length*(posPercents/100.0)
		
		this.yt.seekTo(pos)
	}
	
	_trackEndTime() {
		if (this.trackIndex < this.video.trackCount()-1) {
			let track = this.video.getTrack(this.trackIndex+1)
			return Time.secondsTromTime( track.getStartTime() )-0.1
		} else if (this.trackIndex == this.video.trackCount()-1) {
			return this.yt.getDuration()
		}
	}
	
	setVolume(volumePercents) {
		this.yt.setVolume(volumePercents)
	}
	
}
