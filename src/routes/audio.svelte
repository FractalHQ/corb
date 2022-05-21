<script lang="ts">
	import { createAudioManager } from '$lib/audio/AudioManager'
	import Spectrum from '$lib/audio/Spectrum.svelte'
	import { power } from '$lib/stores/power'

	const fftSize = 4096
	let audioInitialized = false
	let audioManager: any
	let audioEl: HTMLAudioElement, audioEl2: HTMLAudioElement
	let tracks

	const floor = 100
	const ciel = 200

	const initAudio = (e: MouseEvent): void => {
		if (audioInitialized) return
		e.preventDefault()
		audioManager = createAudioManager(fftSize)

		audioInitialized = true
		tracks = document.getElementsByClassName('track')
		for (let i = 0, len = tracks.length; i < len; i++) {
			tracks[i].addEventListener('click', function (e) {
				playTrack(this.src)
				e.preventDefault()
			})
			getBuffer(tracks[i].src)
		}
		playTrack(tracks[0].src)
		playTrack(tracks[1].src, true)
		tracks[0].play()
		tracks[1].play()
	}

	let active_source: AudioBufferSourceNode | null = null
	let buffers = {}
	// const context = new (window.AudioContext || window.webkitAudioContext)()
	let offset = 0
	const tempo = 3.074074076

	function playTrack(url: string, analyse = false) {
		const { context } = audioManager
		let buffer = buffers[url]
		let source = context.createBufferSource()

		if (analyse) {
			const analyserNode = audioManager.context.createAnalyser()
			buffer.connect(analyserNode)
			const muteGain = audioManager.context.createGain()
			muteGain.gain.value = 0
			analyserNode.connect(muteGain)
			source.buffer = muteGain
		} else {
			source.buffer = buffer
		}

		source.connect(context.destination)
		source.loop = true

		if (offset == 0) {
			source.start()
			offset = context.currentTime
			active_source = source
		} else {
			let relativeTime = context.currentTime - offset
			let beats = relativeTime / tempo
			let remainder = beats - Math.floor(beats)
			let delay = tempo - remainder * tempo
			let when = context.currentTime + delay

			stopActiveSource(when)
			source.start(context.currentTime + delay, relativeTime + delay)
			active_source = source
			source.onended = function () {
				active_source = null
			}
		}
	}

	function getBuffer(url: string) {
		const request = new XMLHttpRequest()
		request.open('GET', url, true)
		request.responseType = 'arraybuffer'
		request.onload = function (evt) {
			console.log({ evt })
			audioManager.context
				.decodeAudioData(request.response)
				.then((b: DecodeSuccessCallback) => store(b))
		}
		request.send()

		function store(buffer) {
			buffers[url] = buffer
		}
	}

	function stopActiveSource(when: number) {
		if (active_source) {
			active_source.onended = null
			active_source.stop(when)
		}
	}
</script>

<svg
	width="10"
	height="100"
	viewBox="0 0 10 100"
	style="
		/* stylelint-disable */
		z-index: 10;
		position:absolute;
		inset:0;
		margin:auto;
		transform:scaleY(-1);
		border:1px solid red;
		/* stylelint-enable */
	"
>
	<rect x="0" y="0" width="10" height={$power} fill="url(#gradient)" />
	<!-- A linear gradient from top to bottom -->
	<linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
		<stop offset="0%" stop-color="red" />
		<stop offset="100%" stop-color="blue" />
	</linearGradient>
</svg>

<svelte:window on:click={initAudio} />

<div class="tracks">
	<audio bind:this={audioEl} src="/assets/yeetpsy.mp3" class="track" controls loop />
	<audio bind:this={audioEl2} src="/assets/yeetpsy_kick.mp3" class="track" controls loop />
</div>

{#if audioManager}
	<Spectrum analyser={audioManager.analyser} {floor} />
{/if}

<!-- <pre>{JSON.stringify(spectrum, null, 2)}</pre> -->
<h1>{$power}</h1>

<style>
	/* pre {
		display: flex;
		position: absolute;

		max-width: 90vw;
		margin: 0 auto;

		background: #1d1d1d;
		color: white;

		white-space: pre-line;
		word-wrap: break-word;

		z-index: 10;
	} */
	audio {
		position: relative;

		margin: auto;

		z-index: 10;
	}
	h1 {
		position: absolute;
		top: 5rem;
		left: 0;
		right: 0;

		margin: auto;

		color: white;

		z-index: 10;
	}
	.tracks {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;

		margin: auto;

		z-index: 10;
	}
</style>
