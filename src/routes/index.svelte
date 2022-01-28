<script lang="ts">
	// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
	// import { Shape } from '$lib/glsl/Shape.svelte'
	import vertexShader from '$lib/glsl/vertex.glsl?raw'
	import fragmentShader from '$lib/glsl/fragment.glsl?raw'
	import * as THREE from 'three'
	import { quintOut } from 'svelte/easing'
	import { tweened } from 'svelte/motion'
	import { onMount, tick } from 'svelte'
	import { mapRange } from 'fractils'

	let canvas: HTMLCanvasElement
	let _scene: THREE.Scene
	let renderer: THREE.WebGLRenderer
	let camera: THREE.OrthographicCamera
	// let controls: OrbitControls
	let time = 0
	// let torus: Shape
	let width = 0
	let height = 0
	const mouseSpring = tweened({ x: 0.5, y: 0.5 }, { duration: 1000, easing: quintOut })

	// Controls.
	let sphere = {
		size: 0.2,
		influence: 0.75,
		shrinkWhenFar: false
	}
	let speed = 1
	let mouse = { x: 0.5, y: 0.5 }
	let metaGlue = 5.75
	let glow = 1

	// Matcaps.
	let matcaps
	let activeMatcap

	const init = () => {
		matcaps = {
			black: new THREE.TextureLoader().load('/assets/matcap_black-glass.png'),
			burst: new THREE.TextureLoader().load('/assets/matcap_burst.png'),
			lime: new THREE.TextureLoader().load('/assets/matcap_lime.png'),
			meme: new THREE.TextureLoader().load('https://i.imgur.com/XQ9X5ZQ.png')
		}
		activeMatcap = matcaps.black
		const scene = new THREE.Scene()
		renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
		renderer.setPixelRatio(window.devicePixelRatio)
		renderer.setSize(window.innerWidth, window.innerHeight)
		renderer.setClearColor(0xeeeeee, 1)
		renderer.physicallyCorrectLights = true
		renderer.outputEncoding = THREE.sRGBEncoding

		// camera = new THREE.PerspectiveCamera(
		// 	70,
		// 	window.innerWidth / window.innerHeight,
		// 	0.001,
		// 	1000
		// )
		// camera.position.set(0, 0, 10)
		const frustumSize = 1
		const aspect = window.innerWidth / window.innerHeight
		camera = new THREE.OrthographicCamera(
			frustumSize / -2,
			frustumSize / 2,
			frustumSize / 2,
			frustumSize / -2,
			-1000,
			1000
		)
		camera.position.set(0, 0, 2)
		// controls = new OrbitControls(camera, renderer.domElement)
		time = 0

		/**
		 * Custom Shader Material
		 */
		// torus = new Shape(scene)
		const material = new THREE.ShaderMaterial({
			extensions: {
				derivatives: '#extension GL_OES_standard_derivatives : enable'
			},
			side: THREE.DoubleSide,
			uniforms: {
				time: { value: 0 },
				glow: { value: 0.5 },
				metaGlue: { value: metaGlue },
				mouse: { value: new THREE.Vector2(0, 0) },
				sphereSize: { value: sphere.size },
				shrinkWhenFar: { value: false },
				sphereInfluence: { value: sphere.influence },
				activeMatcap: {
					value:
						activeMatcap ||
						new THREE.TextureLoader().load('/assets/matcap_black-glass.png')
				},
				matcap_black: {
					value: new THREE.TextureLoader().load('/assets/matcap_black-glass.png')
				},
				matcap_burst: {
					value: new THREE.TextureLoader().load('/assets/matcap_burst.png')
				},
				matcap_lime: {
					value: new THREE.TextureLoader().load('/assets/matcap_lime.png')
				},
				resolution: { value: new THREE.Vector4() }
			},
			vertexShader,
			fragmentShader,
			depthWrite: false,
			depthTest: false
		})

		const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
		const plane = new THREE.Mesh(geometry, material)
		scene.add(plane)

		function resize() {
			const imageAspect = 1
			renderer.setSize(width, height)
			let a1, a2
			if (height / width > imageAspect) {
				a1 = (width / height) * imageAspect
				a2 = 1
			} else {
				a1 = 1
				a2 = height / width / imageAspect
			}

			material.uniforms.resolution.value.x = width
			material.uniforms.resolution.value.y = height
			material.uniforms.resolution.value.z = a1
			material.uniforms.resolution.value.w = a2

			camera.updateProjectionMatrix()
		}
		resize()
		window.addEventListener('resize', resize)

		/**
		 **
		 ** Render Loop
		 **
		 */
		function render() {
			mouseSpring.set({
				x: mapRange(mouse.x, 0, width, -0.5, 0.5),
				y: mapRange(mouse.y, 0, height, 0.5, -0.5)
			})
			material.uniforms.mouse.value = $mouseSpring

			time += 0.02 * speed
			material.uniforms.time.value = time

			material.uniforms.glow.value = glow
			material.uniforms.metaGlue.value = metaGlue
			material.uniforms.sphereSize.value = sphere.size
			material.uniforms.sphereInfluence.value = sphere.influence
			material.uniforms.shrinkWhenFar.value = sphere.shrinkWhenFar

			renderer.render(scene, camera)
			requestAnimationFrame(render)
		}
		render()

		return scene
	}

	onMount(async () => {
		await tick()
		_scene = init()
	})

	const mouseMove = (e: MouseEvent) => {
		mouse = { x: e.clientX, y: e.clientY }
	}
</script>

<svelte:window on:mousemove={mouseMove} bind:innerHeight={height} bind:innerWidth={width} />

<controls>
	<div class="control">
		<label>yoink</label>
		<input type="checkbox" on:change={(e) => (sphere.shrinkWhenFar = e.target.checked)} />
	</div>
	<div class="control">
		<label>size</label>
		<input type="range" bind:value={sphere.size} min="0.01" max="2" step="0.001" />
	</div>
	<div class="control">
		<label>influence</label>
		<input type="range" bind:value={sphere.influence} min="0" max="1.5" step="0.001" />
	</div>
	<!-- <div class="control">
		<label>metaGlue</label>
		<input type="range" bind:value={metaGlue} min="-10" max="10" step="0.001" />
	</div> -->
	<div class="control">
		<label>speed</label>
		<input type="range" bind:value={speed} min="0.001" max="50" step="0.001" />
	</div>
	<div class="control">
		<label>saturation</label>
		<input type="range" bind:value={glow} min="0.001" max="2" step="0.001" />
	</div>
</controls>

<canvas bind:this={canvas} />

<style>
	canvas {
		display: block;

		width: 100%;
		min-width: 100vw;
		height: 100%;
		/* min-height: 100vw; */
		margin: 0;
		padding: 0;
	}

	controls {
		display: flex;
		flex-direction: column;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: space-between;
		position: absolute;
		right: 0rem;
		max-width: 300px;
		top: 1rem;
		opacity: 0.25;
		transition: 0.5s;
		transform: scale(0.3, 0.3);
		transform-origin: right top;
	}
	controls:hover {
		opacity: 1;
		transform: scale(1);
	}
	controls:hover .control {
		transform: translate(0, 0);
	}

	.control {
		display: flex;
		/* grid-template-columns: auto; */
		flex-direction: column;
		color: rgb(66, 84, 104);
		text-align: center;
		grid-gap: 0.5rem;
		width: 200px;
		font-family: monospace;
	}
	input {
		filter: hue-rotate(-42deg) brightness(0.5) contrast(1.4);
		margin: 0 auto;
	}
	label {
		margin-bottom: -10px;
	}
</style>
