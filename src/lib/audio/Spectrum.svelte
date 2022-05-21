<script lang="ts">
	import { updatePower } from '$lib/stores/power'
	import type { Analyser } from './types'
	import { onMount } from 'svelte'

	let canvas: HTMLCanvasElement
	export let analyser: Analyser
	export let floor: number

	onMount(() => {
		createCanvas(canvas, analyser, floor)
	})

	//Create 2D canvas
	function createCanvas(canvas: HTMLCanvasElement, analyser: Analyser, floor: number): void {
		const { analyserNode, dataArray, bufferLength } = analyser
		canvas.style.position = 'absolute'
		canvas.style.top = '0'
		canvas.style.left = '0'
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
		const canvasCtx = canvas.getContext('2d')
		canvasCtx!.clearRect(0, 0, canvas.width, canvas.height)

		function draw() {
			//Schedule next redraw
			requestAnimationFrame(draw)

			analyserNode.getFloatFrequencyData(dataArray)

			//Draw black background
			canvasCtx!.fillStyle = 'rgb(0, 0, 0)'
			canvasCtx!.fillRect(0, 0, canvas.width, canvas.height)

			//Draw spectrum
			const barWidth = canvas.width / bufferLength
			let posX = 0
			let target = 650
			for (let i = 0; i < bufferLength; i++) {
				const barHeight = (dataArray[i] + 140) * 2
				canvasCtx!.fillStyle = 'rgb(' + Math.floor(barHeight + 100) + ', 50, 50)'
				if (i == target && isFinite(barHeight)) {
					updatePower(Math.max(barHeight, 1), floor)
					canvasCtx!.fillStyle = 'rgb(' + Math.floor(barHeight + 50) + ', 150, 150)'
				}
				canvasCtx!.fillRect(posX, canvas.height - barHeight / 2, barWidth, barHeight / 2)
				posX += barWidth + 1
			}
		}

		draw()
	}
</script>

<canvas bind:this={canvas} />
