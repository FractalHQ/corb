import type { AudioManager, AudioManagerOptions } from '$lib/audio/types'

export const createAudioManager = (fftSize: number): AudioManager => {
	const context = new (window?.AudioContext || window?.webkitAudioContext)()

	// Create analyser node
	const analyserNode = context.createAnalyser()
	analyserNode.fftSize = fftSize
	const bufferLength = analyserNode.frequencyBinCount
	const dataArray = new Float32Array(bufferLength)
	const analyser = {
		analyserNode,
		dataArray,
		bufferLength
	}

	//Set up audio node network
	analyserNode.connect(context.destination)
	return {
		context,
		analyser
	}
}
