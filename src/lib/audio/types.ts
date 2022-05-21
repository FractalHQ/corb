export interface Analyser {
	analyserNode: AnalyserNode
	dataArray: Float32Array
	bufferLength: number
}

export interface AudioManager {
	context: AudioContext
	analyser: Analyser
}

export interface AudioManagerOptions {
	audioEl: HTMLAudioElement
	fftSize: 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384
}
