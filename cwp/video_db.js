class TrackMode {
	static Play = 0
	static Skip = 1
}

class Track {
	constructor(startTime, name) {
		this.startTime = startTime
		this.name = name
		this.mode = TrackMode.Play
	}
	getStartTime() {
		return this.startTime
	}
	getName() {
		return this.name
	}
	getMode() {
		return this.mode
	}
	setMode(mode) {
		this.mode = mode
	}
}

class Video {
	constructor(title, id, youtubeId) {
		this.title = title
		this.id = id
		this.youtubeId = youtubeId
		this.tracks = []
	}
	add(startTime, name) {
		let track = new Track(startTime, name)
		this.tracks.push(track)
	}
	getTitle() {
		return this.title
	}
	getId() {
		return this.id;
	}
	getYoutubeId() {
		return this.youtubeId
	}
	getTrack(index) {
		return this.tracks[index]
	}
	trackCount() {
		return this.tracks.length
	}
	playableTrackCount() {
		let count = 0
		for (let i = 0; i < this.tracks.length; i++)
			count += this.tracks[i].getMode() == TrackMode.Play ? 1 : 0
	}
	setTrackMode(index, mode) {
		this.tracks[index].setMode(mode)
		this._saveModes()
	}
	
	_saveModes() {
		let modes = this.getModes()
		if (modes != null) {
			let lsKey = this.id + ':modes'
			localStorage.setItem(lsKey, modes);
		}
	}
	
	getModes() {
		if (typeof(Storage) !== "undefined") { // Web storage is supported
			let modes = ''
			for (let i = 0; i < this.tracks.length; i++)
				modes += this.tracks[i].getMode() == TrackMode.Play ? '1' : '0'
			return modes
		}
		return null
	}
	
	setModes(modes) {
		for (let t = 0; t < modes.length; t++) {
			let mode = modes[t] == '1' ? TrackMode.Play : TrackMode.Skip
			this.setTrackMode(t, mode)
		}
	}

}

class VideoCollection {
	constructor(name) {
		this.name = name
		this.videos = []
	}
	getName() {
		return this.name
	}
	add(video) {
		this.videos.push(video)
	}
	videoCount() {
		return this.videos.length
	}
	getVideo(index) {
		return this.videos[index]
	}
}

class VideoDb {
	static collectionCount() {
		return this.collections.length
	}
	
	static getCollection(index) {
		return this.collections[index]
	}
	
	static findById(id) {
		for (let c = 0; c < this.collectionCount(); c++) {
			let collection = this.collections[c]
			for (let v = 0; v < collection.videoCount(); v++) {
				let video = collection.getVideo(v)
				if (video.getId() == id) {
					return video
				}
			}
		}
		return null
	}
	
	static saveSettings() {
		let settings = { 'version': 1 }
		for (let c = 0; c < this.collectionCount(); c++) {
			let collection = this.collections[c]
			for (let v = 0; v < collection.videoCount(); v++) {
				let video = collection.getVideo(v)
				let key = video.getId() + ':modes'
				let modes = video.getModes()
				let isDefault = /^1+$/.test(modes)
				if (!isDefault)
					settings[key] = modes
			}
		}
		return settings
	}
	
	static loadSetings(settings) {
		if (settings.version == 1) {
			this.loadSetingsV1(settings)
		}
	}
	
	static loadSetingsV1(settings) {
		for (let c = 0; c < this.collectionCount(); c++) {
			let collection = this.collections[c]
			for (let v = 0; v < collection.videoCount(); v++) {
				let video = collection.getVideo(v)
				let key = video.getId() + ':modes'
				let modes = settings[key]
				if (modes != undefined) {
					video.setModes(modes)
				}
			}
		}
	}
	
	static {
		this.collections = []
		this._initCollections()
		this._loadModes()
	}
	
	static _loadModes() {
		if (typeof(Storage) !== "undefined") { // Web storage is supported
			for (let c = 0; c < this.collectionCount(); c++) {
				let collection = this.collections[c]
				for (let v = 0; v < collection.videoCount(); v++) {
					let video = collection.getVideo(v)
					let lsKey = video.getId() + ':modes'
					let modes = localStorage.getItem(lsKey)
					if (modes != null) {
						video.setModes(modes)
					}
				}
			}
		}
	}
		
	static _initCollections() {
		// ---------------------------------------------------------------------------------------------------- YEARLY
		
		let col = new VideoCollection('Best of Modarchive: Yearly')
		this.collections.push(col)
		
		let vid = new Video('Best of Modarchive 2022', 'boma-2022', '0Ckg_c39tLY')
		col.add(vid)
		vid.add('00:00:00', 'eighbitbubsy - teadropinapot cover')
		vid.add('00:00:58', "thrilll - nrtdrv_sample_music")
		vid.add('00:02:37', "nao-kun - STAGE 1")
		vid.add('00:03:55', "razor1911 - battlefield_2142kg")
		vid.add('00:04:27', "Peak - DS01")
		vid.add('00:07:00', "skope - lightforce_trainer")
		vid.add('00:07:50', "datachild - the escape / safemode")
		vid.add('00:09:28', "Arcane Toaster - What else is there?")
		vid.add('00:12:02', "thwy - Salmon")
		vid.add('00:14:19', "JazzCat - Rainmaking")
		vid.add('00:17:35', "dualtrax - shining like a star part#2")
		vid.add('00:19:28', "esau - afrdtshtstrngrs")
		vid.add('00:25:10', "malmen and xaimus - moonlit memory")
		vid.add('00:28:49', "PiNk - R.O.T.R (subsong 1)")
		vid.add('00:29:52', "nuk@/na0&facet - fluid freak")
		vid.add('00:32:38', "ida - ur mom")
		vid.add('00:33:45', "Jerry/Desire - Smooth Talker")
		vid.add('00:37:22', "AiR - Acoustica Power Bundle 4kg")
		vid.add('00:39:01', "JazzCat - 8 Bits of Relax")
		vid.add('00:41:29', "darkman007 - Terra")
		vid.add('00:44:31', "darkman007 - I'm Engineer")
		vid.add('00:47:15', "grogon - lectreonic luzyonit")
		vid.add('00:51:34', "salt - ansoe")
		vid.add('00:54:33', "tempest - mr.solid v3")
		vid.add('00:58:04', "jelly and seffren - o.m.g.")
		vid.add('01:00:24', "DNA-Groove - Neon Wars")
		vid.add('01:02:19', "xyce - suaire de turin")
		vid.add('01:06:01', "thwy - Fog City Rain")
		vid.add('01:08:26', "siatek - night run")
		vid.add('01:10:36', "tempest - f. f. f. (version 2)")
		vid.add('01:13:40', "vincenzo - cracked")
		vid.add('01:15:35', "h0ffman - logos & scrollers")
		vid.add('01:18:33', "Bartman - She's left")
		vid.add('01:19:00', "Naula - Huipentuja")
		vid.add('01:20:47', "laamaa - itrave")
		vid.add('01:23:15', "h0ffman - freerunner")
		vid.add('01:27:00', "Virgill - Gates")
		vid.add('01:28:34', "JazzCat - Jaded Lights")
		vid.add('01:31:22', "JazzCat - New Ghost in Town")
		vid.add('01:34:29', "datachild - flexibility")
		vid.add('01:38:09', "darkman007 - After Raining")
		vid.add('01:41:16', "thwy - Stimul")
		vid.add('01:44:20', "zabutom - teenage riot 3")
		vid.add('01:47:54', "siatek - my teddy bear")
		
		vid = new Video('Best of Modarchive 2021', 'boma-2021', 'Qa7GpJWrrV8')
		col.add(vid)
		vid.add('00:00:00', "chromag - shock therapy 101")
		vid.add('00:01:22', "Karsten Koch - Arthur-Ingame1 (KK)")
		vid.add('00:04:59', "zephyr - EARWAX")
		vid.add('00:07:16', "Dippy - chip groove")
		vid.add('00:08:56', "DNA-Groove - SDXB - HiScore")
		vid.add('00:11:00', "serpent - the first piece of..")
		vid.add('00:13:17', "laamaa - summer 2001")
		vid.add('00:17:09', "ida - funky lesbians")
		vid.add('00:18:58', "alexg - the life of danger")
		vid.add('00:21:33', "ida - disco!!! (subsong 1)")
		vid.add('00:22:51', "mA2E&AceMan - Evolution")
		vid.add('00:26:59', "ko0x - Open End")
		vid.add('00:30:45', "Dippy - Afternoon Groovin'")
		vid.add('00:36:56', "Dippy - JT_42")
		vid.add('00:39:38', "slashz - TTS-NTS! Ending")
		vid.add('00:40:26', "slashz - TTS-NTS! Stage 2")
		vid.add('00:41:20', "Firage - Buns & Guns 2")
		vid.add('00:45:16', "Max Dentist - a synthetic fap")
		vid.add('00:46:27', "vibe - welcome to ghost house")
		vid.add('00:48:05', "mrdeath - Light From Darkness")
		vid.add('00:50:18', "enacostione - Willing to change")
		vid.add('00:52:14', "JDruid - 2 minutes left")
		vid.add('00:54:13', "Coda - test1.mod")
		vid.add('00:55:54', "Firage - Manan mailla")
		vid.add('00:57:58', "zabutom - Mega.Heli")
		vid.add('00:59:53', "Googie - Kobold Spacefarer")
		vid.add('01:00:44', "Firage - Space Justice Wolf")
		vid.add('01:03:36', "Firage - Feels Good Man")
		
		vid = new Video('Best of Modarchive 2020', 'boma-2020', 'mkvBb3vUWYQ')
		col.add(vid)
		vid.add('00:00:00', "BlackMesa - another.damn.chip")
		vid.add('00:02:01', "ogge - bajset i gropen")
		vid.add('00:02:42', "crome - Space Adventures")
		vid.add('00:05:12', "reverse of digital - visual!")
		vid.add('00:06:39', "defilus - lemon moon")
		vid.add('00:10:45', "Vhiiula - Happy Bday Coaxcable")
		vid.add('00:12:31', "crome - Distance")
		vid.add('00:15:13', "ASIKWUSpulse - Preparator")
		vid.add('00:17:37', "laamaa - sunset adventurer")
		vid.add('00:20:50', "crome - Scene downtown!")
		vid.add('00:22:11', "Vhiiula - Musik ist lustig")
		vid.add('00:25:10', "c-n and graff - sine")
		vid.add('00:26:04', "bzl - hiscore theme")
		vid.add('00:27:43', "crome - Just Love")
		vid.add('00:29:41', "defilus - Burning Venus")
		vid.add('00:33:15', "mrdeath - Metal Fighter")
		vid.add('00:34:22', "ogge - hot water")
		vid.add('00:36:39', "ASIKWUSpulse - In the key of christmas")
		vid.add('00:37:32', ".\\\\onty - mario,sometimes...")
		vid.add('00:39:04', "Dippy - picnic bounce")
		vid.add('00:42:59', "ko0x - cherryjam")
		vid.add('00:48:13', "AdDe - Moonlight Shadow (rmx)")
		vid.add('00:49:01', "h0ffman - generator")
		vid.add('00:52:56', "Kleeder & TrippleP - The Final Bit ")
		vid.add('00:55:29', "wvl - confusion")
		vid.add('00:56:39', "ogge - KNULLSTATIONEN")
		vid.add('00:57:21', "DRAX - HAPPY BIRTHDAY :)")
		vid.add('00:59:01', "Zealot - mode7 intro remake")
		vid.add('00:59:49', "hydra - last betrayal remix")
		vid.add('01:01:22', "ballistique - dots cph2")
		vid.add('01:04:29', "Pigu - lost in translation")
		vid.add('01:05:39', "Prodigy - C=Funk")
		vid.add('01:08:40', "ilmarque - Circus of Kismet")
		vid.add('01:12:30', "dawn - keijjjo3")
		vid.add('01:14:23', "dawn - keijjjo2")
		vid.add('01:16:37', "ogge - hejdetarettsms")
		vid.add('01:18:00', "RHM8 - Galaxy trip")
		vid.add('01:20:43', "ogge - keff")
		vid.add('01:21:56', "ogge - last.stop.")
		vid.add('01:22:41', "LHS - Trinity Remix")
		vid.add('01:23:40', "bzl - biztro 07")
		vid.add('01:25:19', "ogge - E330")
		vid.add('01:26:32', "ogge - fylleσngest")
		vid.add('01:27:13', "chromag - hoodlum-installer2020")
		vid.add('01:30:09', "ida - grounded")
		vid.add('01:32:23', "littleelk - Overture (subsong 1)")
		vid.add('01:36:14', "Firage - Catboys on Caffeine")
		vid.add('01:37:21', "Googie - Winter Walk")
		vid.add('01:38:42', "ida - tune")
		vid.add('01:39:52', "X-agon - 8k Moloch")
		vid.add('01:41:05', "ogge - double penetration")
		vid.add('01:42:08', "crome - Evening Star")
		vid.add('01:44:03', "ASIKWUSpulse - The Door Game")
		vid.add('01:46:25', "coma - skogens djur 038")
		vid.add('01:47:13', "ASIKWUSpulse - The peaceful ghetto")
		vid.add('01:49:46', "Googie - Fairy Crusaders ]I[")
		vid.add('01:51:48', "ko0x - hobbes adventure")
		vid.add('01:55:32', "wotw - intro number 129")
		vid.add('01:56:56', "illegalinstruction - ShesNotATreeDashie!")
		vid.add('01:57:30', "Bacter & DNA-Groove - recreational emotions")
		vid.add('02:01:34', "laamaa - talossa II")
		vid.add('02:05:31', "mrdeath - Invisible Bond")
		vid.add('02:10:41', "ogge - i am mr kuk")
		vid.add('02:12:02', "ko0x - texel")
		vid.add('02:15:28', "pull a hollywood")
		vid.add('02:16:20', "Zabutom versus Vhiiula - How not do a co-op")
		vid.add('02:18:54', "ogge - lost")
		vid.add('02:20:11', "X-agon - Simple")
		vid.add('02:21:29', "Googie - Spring Swing 2")
		vid.add('02:23:34', "skeema - 4MK REHEVAE NAINEN v2.0")
		vid.add('02:25:55', "Dreamer - Kernkompetenz")
		vid.add('02:29:48', "filippetto - stormy&clever")
		vid.add('02:31:51', "ogge - 4am")
		vid.add('02:33:27', "MelonadeM - burning desire")
		vid.add('02:35:02', "zabutom - keep your head cool!")
		vid.add('02:36:47', "trainer wank")
		vid.add('02:37:53', "Mystra - Chop Suey")
		vid.add('02:40:24', "Firage - Cowabanger")
		vid.add('02:41:53', "zabutom - blast off into space")
		vid.add('02:43:40', "illegalinstruction - My Little Marefriend")
		vid.add('02:45:03', "Edzes & MickRip & Zabutom - 64-the magic number")
		vid.add('02:47:22', "roz - baek")
		vid.add('02:49:43', "ogge + zinger - skavispela lemmings?")
		vid.add('02:52:12', "ogge - kuken hittar hem")
		vid.add('02:52:48', "wvl - serneg")
		vid.add('02:54:25', "malmen - little star")
		vid.add('02:55:52', "ogge - msc2")
		vid.add('02:56:35', "malmen - flirt talk")
		vid.add('02:59:17', "illegalinstruction - The Crimson Filament")
		vid.add('03:01:51', "malmen - she's all that")
		vid.add('03:04:45', "Googie - Razer City")
		vid.add('03:07:51', "ogge - cumshot lane")
		vid.add('03:08:34', "malmen and joel - pelvic thrust")
		vid.add('03:11:57', "malmen & joule - safe with me")
		vid.add('03:15:28', "malmen & joule - reality boy")
		vid.add('03:18:41', "Firage - Buns & Guns")
		vid.add('03:20:52', "Firage - Ride to Hell")
		vid.add('03:22:20', "estrayk - is back 2002")
		vid.add('03:24:03', "geniuz VS nagz - keep on")
		vid.add('03:26:24', "bzl - captain beezay")
		vid.add('03:28:02', "radix & loonie - saskatchewan")
		vid.add('03:30:06', "ogge - beam breaker")
		vid.add('03:31:10', "tempest - crema lubricante v3")
		vid.add('03:33:46', "malmen & joule - dragon fruit")
		vid.add('03:35:53', "malmen - devotion shuttle")
		vid.add('03:39:36', "malmen - pudding refiner")
		vid.add('03:42:42', "Dubmood + Zabutom - Rez 1911 Cracktro#1")
		vid.add('03:45:00', "cerror - blue")
		
		/*
		vid = new Video('Best of Modarchive 2019', 'boma-2019', '3BwtfmARk68')
		col.add(vid)
		vid.add('00:00:00', "aix - plastic pop 2")
		vid.add('00:02:12', "JosSs - A Hard Chip's Night")
		vid.add('00:04:37', "A-Move - Love machine")
		vid.add('00:07:06', "soft maniac - tuber theme #04")
		vid.add('00:08:00', "Hardliner - Contraduct Design")
		vid.add('00:09:42', "Bouncing Musicbox - whatever")
		vid.add('00:10:37', "Dippy - arena 5")
		vid.add('00:12:26', "Googie - Used Warez")
		vid.add('00:13:32', "Kleeder x Strobe - Seomadan Uplink")
		vid.add('00:16:23', "Nikku4211 - Walking Your Protogent")
		vid.add('00:17:22', "soft maniac - tuber theme #13")
		vid.add('00:18:37', "Googie - Mycelium Man")
		vid.add('00:21:17', "Louigi Verona - A Trip To The Netherlands")
		vid.add('00:23:21', "skyline - Venom")
		vid.add('00:25:03', "Googie - For Jax")
		vid.add('00:27:50', "MpjV and Nikku4211 - Just A Cool Tune")
		vid.add('00:32:15', "DrTacarna & DrJacko - GeneralChaos6")
		vid.add('00:39:04', "Googie - Eager")
		vid.add('00:40:46', "zabutom - loopit4ever")
		vid.add('00:43:17', "KHZC - SmurfGlasses (cover)")
		vid.add('00:45:22', "Dubmood - idiot walk (cover of The Hives)")
		vid.add('00:46:21', "ko0x - brand new day")
		vid.add('00:51:06', "skyline - Zelda 2: Dungeon 7")
		vid.add('00:52:10', "enacostione - irreversible")
		vid.add('00:56:28', "Agu&JacKo - General Chaos pt-4")
		vid.add('01:01:13', "Drozerix - Playful Girl")
		vid.add('01:03:20', "soft maniac - tuber theme #16")
		vid.add('01:04:31', "Googie - A Material Phantasy")
		vid.add('01:09:36', "mano - Love Lunesta")
		vid.add('01:10:29', "enacostione - L'ora sbagliata")
		vid.add('01:12:41', "enacostione - Unusualness")
		vid.add('01:14:04', "Googie - Mechanical Energy")
		vid.add('01:16:56', "ko0x - Cthulhu Cumulus")
		vid.add('01:19:48', "Googie - Nameless Key")
		vid.add('01:21:15', "kleeder and TrippleP - Talking About Drugs")
		vid.add('01:24:22', "skyline - megaman goes alternative")
		vid.add('01:25:59', "skyline - rotflmao")
		vid.add('01:28:10', "DrTacarna & DrJacko - LostNavigator")
		vid.add('01:31:40', "ko0x - Teddy Issues")
		vid.add('01:36:05', "Googie - Pixie Planet")
		vid.add('01:37:14', "RHM8 - Breeze 2608 (cover)")
		vid.add('01:40:50', "Googie - Star Lift")
		vid.add('01:42:00', "wvl - yyna is not a girl")
		vid.add('01:44:03', "enacostione - Confused")
		vid.add('01:45:50', "surasshu - eek!")
		vid.add('01:46:48', "what_song_is_this.xm")
		vid.add('01:47:29', "wvl - mado is a girl")
		vid.add('01:50:16', "nooly - nitro intra")
		vid.add('01:53:32', "ko0x - Running in the rain")
		vid.add('01:56:30', "mano - darkness in da night")
		vid.add('01:58:02', "tempest - step by step")
		vid.add('02:00:41', "virgill - the visitors 15")
		vid.add('02:05:50', "skyline - 8=========D")
		vid.add('02:07:03', "wvl - UwU")
		vid.add('02:08:24', "bacter & Saga Musix - Sunset Walk")
		vid.add('02:13:09', "enacostione - Zeitreise")
		vid.add('02:17:34', "ko0x - Galaxy Guppy")
		vid.add('02:21:11', "Googie - Maple")
		vid.add('02:22:58', "mano - #000000 space")
		vid.add('02:24:02', "ASIKWUSpulse and wvl - Meow!")
		vid.add('02:28:39', "Googie - Snowcloud")
		vid.add('02:29:31', "ASIKWUSpulse - Våren är alltid nåt")
		vid.add('02:34:38', "Nikku4211 - Tower Of Heaven remix (subsong 3)")
		vid.add('02:35:23', "wvl - disco")
		vid.add('02:37:36', "reed - fairlight in action")
		vid.add('02:41:26', "Fabian Del Priore (Rapture) - Cassiopeia (extended version)")
		vid.add('02:46:58', "untitled-1890.xm")
		vid.add('02:47:51', "Xemogasa - perfect match")
		vid.add('02:52:11', "sinny - sky sunday")
		vid.add('02:54:03', "malmen and xyce - papillons")
		vid.add('02:57:42', "h0ffman - eon")
		vid.add('03:03:15', "maak - Melancholy on Monday")
		vid.add('03:08:19', "Roz - Shattered again")
		vid.add('03:11:55', "Xemogasa - Sapphire eyes")
		*/
		
		vid = new Video('Best of Modarchive 2018', 'boma-2018', 'ESYo3lQIFl0')
		col.add(vid)
		vid.add('00:00:00', "Solaris - so excited")
		vid.add('00:01:10', "ASIKWUSpulse - Gammal Data Borta")
		vid.add('00:05:55', "med - halloween 2002")
		vid.add('00:07:36', "4mat - Push-push olympics Slalom")
		vid.add('00:08:40', "ASIKWUSpulse - Old Puzzle")
		vid.add('00:10:37', "Googie - House of Stars")
		vid.add('00:15:42', "Kabcorp - JuJu Can Do It")
		vid.add('00:16:47', "enacostione - Vola e vai")
		vid.add('00:19:05', "enacostione - Afternoon ride")
		vid.add('00:20:51', "Googie - Empty Matter")
		vid.add('00:23:13', "julius - announce.part2")
		vid.add('00:26:34', "lu9 - Gentle Breeze (cover)")
		vid.add('00:27:35', "Googie - Imaginary Numbers")
		vid.add('00:28:45', "Googie - Buy, Sell, Trade")
		vid.add('00:29:50', "The SandS - Strike Ball 2 Deluxe music (subsong 1)")
		vid.add('00:32:03', "Dubmood - a message to you mowgli")
		vid.add('00:33:38', "Dubmood - Mario Airlines")
		vid.add('00:38:24', "Firage - Nitro Warrior")
		vid.add('00:40:32', "Googie - My Own Tesla Tree")
		vid.add('00:44:12', "Firage - Reaper Blows the Horn")
		vid.add('00:46:37', "Firage - The Full Moon Boys")
		vid.add('00:49:29', "madbrain - AfroMan")
		vid.add('00:51:44', "Googie - Blue Fire")
		vid.add('00:52:46', "Dubmood, JosSs, Ogge, Zabutom - Razor Comeback Intro")
		vid.add('00:59:19', "Dubmood - Rez 1911 Cracktro 6")
		vid.add('01:01:31', "xyce - la chérie")
		vid.add('01:04:26', "bouncing musicbox and ko0x - sunnyside in bit-town")
		vid.add('01:06:43', "Wiklund and Joule - makebelieve girl")
		vid.add('01:09:45', "zabutom - future space bass")
		vid.add('01:10:38', "4mat - broken heart")
		
		vid = new Video('Best of Modarchive 2017', 'boma-2017', 'aVuGKnMsfd4')
		col.add(vid)
		vid.add('00:00', "coda - snowburd")
		vid.add('01:54', "Sinc-X - Senseless")
		vid.add('03:23', "coda - polkadot")
		vid.add('04:44', "zalza & cerror & xylo - ne pas")
		vid.add('07:16', "beek - just like heaven")
		
		vid = new Video('Best of Modarchive 2016', 'boma-2016', 'Ae_Dn8zTw0s')
		col.add(vid)
		vid.add('00:00', "Kalachnikov - Mental Delivrance")
		vid.add('00:52', "stinkbug - love thief")
		vid.add('02:16', "motherchip - nanothruster")
		vid.add('04:57', "disease - Beautiful Insanity")
		vid.add('06:58', "golgi + jimmyoshi - soraing")
		vid.add('11:41', "madbrain - Knife sp.forces:Gangsta")
		vid.add('14:12', "Jakim - Cleansing")
		vid.add('16:18', "Retro, hyperunknown, Malmen - Tranquility")
		vid.add('19:36', "cerror - je vader")
		vid.add('22:07', "cerror - je moeder")
		vid.add('24:01', "xyce - a summer afternoon")
		vid.add('26:15', "Dubmood - Cybernostra weekends")
		
		vid = new Video('Best of Modarchive 2015', 'boma-2015', 'fXa7oUVeKxo')
		col.add(vid)
		vid.add('00:00', "Eternal Engine - Another worlds")
		vid.add('04:49', "Shytan - WINTER 2015 TUNE")
		vid.add('07:00', "artremix - champs elysees")
		vid.add('07:59', "jazzcat - Sushi Boyz (cmp ver)")
		vid.add('10:54', "Vince Kaichan - Lumine")
		vid.add('16:01', "bacter vs Saga Musix - Neon Racer")
		vid.add('20:31', "bacter vs Saga Musix - Hete DnB Actie")
		vid.add('24:12', "Xemogasa - modest penguins")
		vid.add('25:18', "Vince Kaichan - SolarSystemSmash OST (subsong 1)")
		vid.add('27:49', "Firage - Spooks 'N Spectres")
		vid.add('29:52', "smh - my ghostly friend")
		
		vid = new Video('Best of Modarchive 2014', 'boma-2014', '5moLPNai17g')
		col.add(vid)
		vid.add('00:00', "Drozerix & LHS - Drozerix VS LHS #2")
		vid.add('02:10', "aji - You think this is funny? (part of the track)")
		vid.add('02:51', "Xemogasa - new bag of chips for sherwyn")
		vid.add('03:30', "sacio - sacio nov14 (part of the track)")
		vid.add('04:55', "ElectroPiZZa - Bonus 1 epz (cover)")
		vid.add('09:02', "raphaelgoulart - b4")
		vid.add('10:28', "frantic - dog doesnt care")
		vid.add('11:44', "raphaelgoulart - owner of my thoughts")
		vid.add('14:11', "Jakim - Groove Machine")
		vid.add('16:42', "Wiklund - Girl Next Door")
		vid.add('18:46', "Jayster - Foreign Grove")
		vid.add('21:08', "Nighthawk - Dragon's Legend (koto mix)")
		vid.add('24:53', "Wiklund - Her Smile")
		vid.add('27:35', "Necros - Skygazer")
		vid.add('29:21', "malmen and goluigi - summertime roses")
		vid.add('32:47', "Firage - Galaxy Hero")
		vid.add('34:55', "Siren - Jack of Spades")
		vid.add('36:39', "malmen and motherchip - thousand sunflowers")

		vid = new Video('Best of Modarchive 2013', 'boma-2013', 'GbiwyqpVmPU')
		col.add(vid)
		vid.add('00:00', "LHS - Angel LHS Remix")
		vid.add('02:35', "FearofDark - NOISECHAN INSPECTION TEAM: On The Case")
		vid.add('05:39', "DNA-Groove - Pocket Tanks (intro)")
		vid.add('08:14', "Naula - Huipentuja")
		vid.add('10:01', "beek - pleiadeans")
		vid.add('12:16', "joule & malmen - one way heart")
		vid.add('15:14', "radix - dragon atlas")
		vid.add('17:40', "wasp - retrobution")
		
		vid = new Video('Best of Modarchive 2012', 'boma-2012', 'nXCp9fVNP1w')
		col.add(vid)
		vid.add('00:00', 'LHS - Black Riders keygen')
		vid.add('01:13', 'Jakim - Top Hat Main Theme')
		vid.add('03:50', 'oxbow - artcore-hidden')
		vid.add('04:59', 'wonderboy - my south west')
		vid.add('06:48', 'seablue - aurora dawn')
		vid.add('09:09', 'cerror & xylo - Dans la rue')
		vid.add('11:53', 'radix and xyce - Rainbow Dash')
		
		vid = new Video('Best of Modarchive 2011', 'boma-2011', 'iUaFs9Un6XQ')
		col.add(vid)
		vid.add('00:00', 'hi-lite - purple shades')
		vid.add('01:24', 'LHS - Horizon Skies')
		vid.add('03:20', 'ReZ - Delta (remix)')
		vid.add('04:52', 'pink - alloy run')
		vid.add('06:48', 'beek and virt - fruitbat')
		vid.add('11:11', 'beek - margarita')
		vid.add('13:31', 'daXX - The unknown stuntman (remix)')
		vid.add('14:47', 'Mazedude - Slick Rippin Keen (remix)')
		vid.add('19:10', 'cerror - bagger')
		vid.add('20:48', 'malmen - sun rocket')
		vid.add('24:06', 'Rez - Monday')
		vid.add('25:17', 'malmen - nothing can stop us')
		vid.add('28:11', 'malmen and retro - citrus paradisi')
		
		vid = new Video('Best of Modarchive 2010', 'boma-2010', 'U3jh2rx1U30')
		col.add(vid)
		vid.add('00:00', 'ko0x - caramel condition')
		vid.add('03:00', 'FearofDark - Sleigh Ride Cover')
		vid.add('06:49', 'radix - feng shui schematics')
		vid.add('08:54', "FearofDark - Rollin' Down the Street In My Katamari")
		vid.add('13:31', 'malmen & joule - tomorrow without you')
		
		vid = new Video('Best of Modarchive 2009', 'boma-2009', 'pUKiah7t0VQ')
		col.add(vid)
		vid.add('00:00', 'mrdeath - Oldschool Combat 3')
		vid.add('02:01', 'joule and ko0x - caroline in neon hot pants')
		vid.add('04:12', 'reed - eclipse (subsong 1)')
		vid.add('06:21', 'joule and coda - gOing nuts')
		vid.add('09:22', 'FearofDark - Dancing On the M%n')
		vid.add('14:21', 'joule and malmen - tease or please')
		vid.add('17:20', 'vincenzo - reloaded intro music')
		vid.add('19:24', 'FearofDark - Get A Brian Morans')
		vid.add('23:41', 'zalza and floppi - snowman')
		vid.add('25:40', 'malmen - flowers')
		
		// ---------------------------------------------------------------------------------------------------- MONTHLY
		
		col = new VideoCollection('Best of Modarchive: Monthly')
		this.collections.push(col)
		
		vid = new Video('Best of Modarchive February 2025', 'boma-2025-02', 'Z-Xw3oiJYIY')
		col.add(vid)
		vid.add('00:00', "wild kitten (orig. by Atsuyoshi Isemura)")
		
		vid = new Video('Best of Modarchive January 2025', 'boma-2025-01', 'ylM75a6f6oM')
		col.add(vid)
		vid.add('00:00', "dizzy - santa claustrofobia")
		vid.add('02:16', "cerror - sarge")
		vid.add('04:42', "zalza - salvatore blues")
		
		vid = new Video('Best of Modarchive November 2024', 'boma-2024-11', 'N-2WSMUScNA')
		col.add(vid)
		vid.add('00:00', "tempest - astrovandalism")
		
		vid = new Video('Best of Modarchive September 2024', 'boma-2024-09', 'GxL2dRtP4r8')
		col.add(vid)
		vid.add('00:00', "Viraxor - nftpundarn keygen #7")
		vid.add('00:56', "zabutom & dubmood - track tracking (compo edit)")
		
		vid = new Video('Best of Modarchive August 2024', 'boma-2024-08', 'JDRnHaOwDyY')
		col.add(vid)
		vid.add('00:00', "smh - prophecy")
		
		vid = new Video('Best of Modarchive July 2024', 'boma-2024-07', 'VyYj0hvqrhQ')
		col.add(vid)
		vid.add('00:00', "tempest - saturday")
		vid.add('01:24', "Kabcorp - Sad CosmoBiker")
		vid.add('02:27', "tempest - blackjack")
		
		vid = new Video('Best of Modarchive June 2024', 'boma-2024-06', 'Rwa_yTHSyoc')
		col.add(vid)
		vid.add('00:00', "arachno - maybe some day")
		vid.add('02:28', "arachno - frost")
		vid.add('04:35', "cs127 - Never Too Late")
		
		vid = new Video('Best of Modarchive May 2024', 'boma-2024-05', 'kVuqfqdBpkE')
		col.add(vid)
		vid.add('00:00', "wasp - honorable agreement")
		vid.add('02:07', "cs127 - floating in a dream")
		vid.add('04:42', "Edzes and Loonie - Ulf's vibrator")
		vid.add('06:44', "malmen - shimmering icicles")
		
		vid = new Video('Best of Modarchive April 2024', 'boma-2024-04', 'x8CZuLGWy90')
		col.add(vid)
		vid.add('00:00', "wasp - jaerp 2ktretton")
		vid.add('02:44', "cerror and xylo - sous les arbres")
		vid.add('05:48', "coda - noodle vector")
		vid.add('07:26', "stalker - loader")
		vid.add('08:29', "stalker - Jaune (tronic intro)")
		vid.add('09:46', "cerror - sea side blues")
		vid.add('11:31', "beek - elicebell")
		vid.add('13:34', "cerror & mexs - crashed aeroplane")
		vid.add('15:24', "beek - bright sunday")
		vid.add('16:22', "zabutom - The legend of zeta force")
		vid.add('19:38', "beek - ocean resort")
		vid.add('21:11', "stalker - Q-bert Level Music 1")
		vid.add('23:02', "beek - turtle")
		vid.add('24:46', "zabutom - Techno Boss")
		vid.add('26:18', "zabutom - Final Blast")
		
		vid = new Video('Best of Modarchive March 2024', 'boma-2024-03', 'KMpkOmxyt4I')
		col.add(vid)
		vid.add('00:00', "crome - hymn")
		vid.add('01:46', "coda - chalupa pass")
		vid.add('03:18', "cerror - Puppy love")
		vid.add('05:05', "vincenzo - summer thing")
		vid.add('07:47', "zalza - rush")
		vid.add('10:10', "coda - hypercake")
		vid.add('11:06', "coda - duckdance II")
		vid.add('12:22', "coda - scrum")
		
		vid = new Video('Best of Modarchive February 2024', 'boma-2024-02', 'qybyGW3wZ3U')
		col.add(vid)
		vid.add('00:00', "coda - yoshi salad")
		vid.add('01:19', "coda - unintelligent duck music")
		vid.add('02:21', "coda - turnthatshitoff")
		vid.add('03:52', "virt - keep the world spinning")
		vid.add('05:33', "coda - sweeten")
		vid.add('06:51', "coda - zombine")
		vid.add('08:12', "coda - new teeth")
		vid.add('10:12', "maak - Domino")
		vid.add('12:22', "coda - redenbacher")
		vid.add('13:30', "coda - ytrewq")
		vid.add('14:43', "coda - video games")
		vid.add('15:43', "coda - underclocking the genesis")
		vid.add('17:12', "Darkman007 - Inevitable Meeting")
		vid.add('21:19', "zabutom - king of the arcades")
		vid.add('22:42', "zabutom - the odd connection")
		vid.add('24:57', "AceMan - Jesus Stole My Jelly Beans")
		vid.add('28:05', "jayster - way too happy")
		vid.add('29:45', "jayster - Gnat Killer")
		vid.add('31:08', "coda - the ass of samhain")
		vid.add('32:43', "zabutom - rzrdisco")
		vid.add('34:44', "AceMan - Stepp'd on my Chips")
		vid.add('38:07', "AceMan - Land of Flying Cubes (part of the track)")
		vid.add('39:00', "xaimus - manis3 (part of the track)")
		
		vid = new Video('Best of Modarchive January 2024', 'boma-2024-01', 's5jECEKC4qo')
		col.add(vid)
		vid.add('00:00', "glass å ketchup")
		vid.add('01:13', "xemogasa - two-tailed bossanova")
		vid.add('02:24', "Buzzer - cubes")
		vid.add('04:02', "xemogasa - venturely plundering")
		vid.add('06:24', "Burnt Fishy - Starburst!")
		vid.add('07:37', "enacostione - Loving you")
		vid.add('09:33', "chrylian - dancing for her")
		vid.add('12:40', "Buzzer - Friday at last")
		vid.add('13:58', "coda - western chips")
		vid.add('15:03', "arpegiator - synth 4")
		vid.add('16:37', "Yomaru Kasuga and Tobikomi - Security Gauntlet")
		vid.add('19:11', "vincenzo - strawberry jam")
		vid.add('22:15', "Brandon Walsh - Red Bulldozer")
		vid.add('26:04', "virgill & SoDa7 - neocolora")
		
		vid = new Video('Best of Modarchive December 2023', 'boma-2023-12', 'bFwmoDIth9I')
		col.add(vid)
		vid.add('00:00', "nagz&carlz - isten ha'ta megett.")
		vid.add('01:17', "Speedvicio - Final Fight Subway Park 2")
		vid.add('02:13', "coda - spiner")
		
		vid = new Video('Best of Modarchive November 2023', 'boma-2023-11', 'DqV9sWJ3o4Q')
		col.add(vid)
		vid.add('00:00', "radix - crisis inverted")
		vid.add('01:52', "Dippy - 10 dollars and 4 cents")
		vid.add('03:21', "Dippy - 43")
		
		vid = new Video('Best of Modarchive October 2023', 'boma-2023-10', '2QNpjVk1x1E')
		col.add(vid)
		vid.add('00:00', "cs127 - Satellite One (synthwave cover)")
		vid.add('04:55', "cs127 - Eternity (synthwave cover)")
		
		vid = new Video('Best of Modarchive September 2023', 'boma-2023-09', 'slm-bc0XByQ')
		col.add(vid)
		vid.add('00:00', "defilus - sweatro")
		vid.add('02:11', "Dippy - i_tracked_this_on_my_laptop")
		vid.add('03:52', "Lyzzard - unreal time")
		vid.add('06:32', "tone - AdminSavingTheEarth")
		vid.add('08:30', "cs127 - Tomorrow")
		vid.add('14:26', "cs127 - 16-bit")
		
		vid = new Video('Best of Modarchive August 2023', 'boma-2023-08', 'sKuUW8MPeFY')
		col.add(vid)
		vid.add('00:00', "Samplr - damager")
		vid.add('03:27', "Firage - Laser Lords")
		
		vid = new Video('Best of Modarchive July 2023', 'boma-2023-07', 'cDsYq5PHqqw')
		col.add(vid)
		vid.add('00:00', "wiklund & algar - The Butter Master")
		vid.add('02:23', "jallabert - STAMP ON THE GROUND!")
		vid.add('05:38', "JosSs - blitter lite")
		vid.add('07:28', "Viraxor - windows 11 party!")
		vid.add('10:16', "darksk3lter_-_crab.it")
		vid.add('12:11', "malmen - haruna's watergun")
		vid.add('15:20', "Meruvyl Sama! gomenasai!")
		
		vid = new Video('Best of Modarchive June 2023', 'boma-2023-06', 'NlP_nwM8x-Y')
		col.add(vid)
		vid.add('00:00', "Speedvicio - 1 Minute Of Peace")
		vid.add('01:34', "JosSs - calling4cracktros")
		
		vid = new Video('Best of Modarchive May 2023', 'boma-2023-05', 'KwAatBuB2RA')
		col.add(vid)
		vid.add('00:00', "Ryo-Ohki - Iso")
		vid.add('03:35', "JosSs - obsolete and happy")
		vid.add('05:37', "JosSs - SupahFunkers")
		vid.add('07:39', "Japanese")
		vid.add('11:21', "Dippy - Listen Twice (cover, original by Jeroen Tel)")
		vid.add('13:20', "Dippy - MOVE IT!")
		vid.add('18:03', "Jazzcat - Ghost Ride")
		
		vid = new Video('Best of Modarchive April 2023', 'boma-2023-04', 'O70ON8R66xU')
		col.add(vid)
		vid.add('00:00', "acrouzet - Empty (cover, orignal by 4mat)")
		vid.add('03:07', "thrilll - green biker dude")
		vid.add('04:39', "Firage - A Flamboyant Foe")
		
		vid = new Video('Best of Modarchive March 2023', 'boma-2023-03', 'hkomk7s1FHg')
		col.add(vid)
		vid.add('00:00', "ewk - capybara")
		vid.add('03:07', "mahogany - motivational reattribute")
		vid.add('05:56', "bacter - life goes on (extended)")
		vid.add('11:19', "thwy - Sildenafil")
		
		vid = new Video('Best of Modarchive February 2023', 'boma-2023-02', 'D5M85rJD6MA')
		col.add(vid)
		vid.add('00:00', "Eterna of Reveal - Galaxies")
		vid.add('04:38', "xyce - nouveau cheese")
		
		vid = new Video('Best of Modarchive January 2023', 'boma-2023-01', '-ohxyGMbZDM')
		col.add(vid)
		vid.add('00:00', "hyperunknown - goatastic")
		vid.add('02:10', "SoDa7 - Pixelated Heaven")
		vid.add('04:14', "xaimus - industrial robotics")
		vid.add('06:56', "troupe - reduzpatternorder")
		vid.add('09:16', "laamaa - after dark")
	}
	
}