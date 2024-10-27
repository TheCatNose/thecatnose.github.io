var player = null
var ctl = null

function onYouTubeIframeAPIReady() {
	player = new Player('player', onPlayerInitialized)
	player.addTrackStateEventListener(this.onTrackStateChanged.bind(this))
	player.addPositionChangedListener(this.onTrackPositionChanged.bind(this))
	ctl = new PlayController(player)
	ctl.setOnTrackStarted(this.onTrackStartedByController.bind(this))
	ctl.setLoop     ( Cookies.getBool('player.loop'     ) )
	ctl.setRandom   ( Cookies.getBool('player.random'   ) )
	ctl.setAllVideos( Cookies.getBool('player.allVideos') )
	ctl.setVideo(VideoCombobox.currentVideo())
}

function onPlayerInitialized() {
	document.getElementById('init').remove()
	document.getElementById('player').style['pointer-events'] = 'none'
	document.getElementById('ui').hidden = false
	
	let volume = Cookies.getNumber('player.volume', 100)
	document.getElementById('volume').value = volume
	setVolume()
}

function onVideoSelected(video) {
	TrackTable.initByVideo(video)
	
	if (ctl != null) {
		ctl.setVideo(video)
		let playingVideo = ctl.getCurrentVideo()
		if (playingVideo != null && video.getYoutubeId() == playingVideo.getYoutubeId()) {
			let playingTrackIndex = ctl.getCurrentTrackIndex()
				TrackTable.highlightRow(playingTrackIndex)
		}
	}
}

function onModeChanged(video, trackIndex, play) {
	video.setTrackMode(trackIndex, play ? TrackMode.Play : TrackMode.Skip)
}

function onTrackStateChanged(state) {
	document.getElementById('playpause').textContent = state == TrackState.Playing ? '❚❚' : '▷'
}

function onTrackPositionChanged(position) {
	let input = document.getElementById('pos')
	if (input.userInteracting != true)
		input.value = position
}

function onTrackStartedByController(video, trackIndex) {
	ctl.setVideo(video)
	if (video.getYoutubeId() != VideoCombobox.currentVideo().getYoutubeId()) {
		VideoCombobox.selectVideo(video)
		TrackTable.initByVideo(video)
	}
	document.title = video.getTrack(trackIndex).getName()
	TrackTable.highlightRow(trackIndex)
}

function init() {
	TrackTable.onModeChanged = onModeChanged
	VideoCombobox.onVideoSelected = onVideoSelected
	VideoCombobox.init()
}

document.addEventListener('DOMContentLoaded', init);

function playSpecificTrack(video, trackIndex) {
	ctl.playTrack(video, trackIndex)
	document.title = video.getTrack(trackIndex).getName()
}

function toggleSettings() {
	let settings = document.getElementById('settings')
	settings.hidden = !settings.hidden
}

function playPause() {
	ctl.playPause()
}

function prev() {
	ctl.prev()
}

function next() {
	ctl.next()
}

function toggleLoop() {
	let button = document.getElementById('loop')
	button.className = button.className == '' ? 'pressed' : ''
	let optionIsSet = button.className != ''
	ctl.setLoop(optionIsSet)
	Cookies.set('player.loop', optionIsSet)
}

function toggleRandom() {
	let button = document.getElementById('random')
	button.className = button.className == '' ? 'pressed' : ''
	let optionIsSet = button.className != ''
	ctl.setRandom(optionIsSet)
	Cookies.set('player.random', optionIsSet)
}

function toggleAll() {
	let button = document.getElementById('all')
	button.className = button.className == '' ? 'pressed' : ''
	let optionIsSet = button.className != ''
	ctl.setAllVideos(optionIsSet)
	Cookies.set('player.allVideos', optionIsSet)
}

function onPositionInput() {
	let input = document.getElementById('pos')
	input.userInteracting = true
}


function onPositionChange() {
	let input = document.getElementById('pos')
	input.userInteracting = false
	ctl.setPosition(input.value);
}

function setVolume() {
	let input = document.getElementById('volume')
	let volume = input.value
	player.setVolume(volume)
	Cookies.set('player.volume', volume)
}

function exportSettings() {
	let settings = VideoDb.saveSettings()
	saveObjectToJsonFile(settings, 'CatNose_chiptune_web_player_settings.json')
}

function importSettings() {
	loadObjectFromJsonFile( (settings) => {
		VideoDb.loadSetings(settings)
		TrackTable.refresh()
	})
}