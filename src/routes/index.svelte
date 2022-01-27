<script lang="ts">
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
	import { Shape } from '$lib/glsl/Shape.svelte'
	import { onMount } from 'svelte'
	import * as THREE from 'three'

	let canvas: HTMLCanvasElement
	let _scene: THREE.Scene
	let renderer: THREE.WebGLRenderer
	let camera: THREE.PerspectiveCamera
	let controls: OrbitControls
	let time = 0
	let torus: Shape

	const init = () => {
		const scene = new THREE.Scene()
		renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setClearColor(0xeeeeee, 1.0)
		renderer.physicallyCorrectLights = true
		renderer.outputEncoding = THREE.sRGBEncoding

		camera = new THREE.PerspectiveCamera(
			70,
			window.innerWidth / window.innerHeight,
			0.001,
			1000
		)
		camera.position.set(0, 0, 10)
		controls = new OrbitControls(camera, renderer.domElement)
		time = 0

		const light = new THREE.DirectionalLight(0xffffff, 1)
		light.position.set(0, 0, 1)
		scene.add(light)

		const light2 = new THREE.DirectionalLight(0xffffff, 1)
		light2.position.set(0, 0, -1)
		scene.add(light2)

		const light3 = new THREE.AmbientLight(0xffffff, 1)
		scene.add(light3)

		torus = new Shape(scene)

		// Animation Loop
		function render() {
			const time = Date.now() * 0.01

			renderer.render(scene, camera)

			requestAnimationFrame(render)
		}
		render()

		return scene
	}

	onMount(() => {
		_scene = init()
	})
</script>

<canvas bind:this={canvas} />

<style>
	canvas {
		width: 100vw;
		height: 100vh;
	}
</style>
