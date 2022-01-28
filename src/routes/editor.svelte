<script>
	import * as GlslEditor from 'glslEditor/build/glslEditor' //  https://github.com/patriciogonzalezvivo/glslEditor
	import 'glslEditor/build/glslEditor.css'
	import { onMount } from 'svelte'

	let editor, glslEditor
	$: errorMessage = ''

	const vertexShaderSource = `
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}
		`

	const fragmentShaderSource = `
		void main() {
			gl_FragColor = vec4(0.18, 0.54, 0.34, 1.0);
		}`

	onMount(async () => {
		const glslEditor = new globalThis.GlslEditor(editor, {
			canvas_size: 500,
			canvas_draggable: true,
			theme: 'monokai',
			multipleBuffers: true,
			watchHash: true,
			fileDrops: true,
			menu: true
		})
	})
</script>

<svelte:head>
	<!-- <link
		type="text/css"
		rel="stylesheet"
		href="https://rawgit.com/patriciogonzalezvivo/glslEditor/gh-pages"
	/> -->
	<!-- <script
		type="application/javascript"
		src="https://rawgit.com/patriciogonzalezvivo/glslEditor/gh-pages/build/glslEditor.js"></script> -->
</svelte:head>

<div bind:this={editor} />

<pre>{errorMessage}</pre>

<style>
	pre {
		max-width: 90vw;
		margin: auto;
		padding: 1rem;

		background: #1d1d2f !important;
		color: rgb(219, 143, 130) !important;
		box-shadow: 0px 3px 5px #0005;

		white-space: pre-wrap;
	}
</style>
