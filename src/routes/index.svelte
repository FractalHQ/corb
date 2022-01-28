<script lang="ts">
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
	// import { Shape } from '$lib/glsl/Shape.svelte'
	import vertexShader from '$lib/glsl/vertex.glsl?raw'
	import fragmentShader from '$lib/glsl/fragment.glsl?raw'
	import { onMount, tick } from 'svelte'
	import * as THREE from 'three'

	let canvas: HTMLCanvasElement
	let _scene: THREE.Scene
	let renderer: THREE.WebGLRenderer
	let camera: THREE.OrthographicCamera
	let controls: OrbitControls
	let time = 0
	// let torus: Shape

	const init = () => {
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
		controls = new OrbitControls(camera, renderer.domElement)
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
				matcap_black: {
					value: new THREE.TextureLoader().load('/assets/matcap_black-glass.png')
				},
				matcap_burst: {
					value: new THREE.TextureLoader().load('/assets/matcap_burst.png')
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
			const width = window.innerWidth
			const height = window.innerHeight
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

		// Animation Loop
		function render() {
			// const time = Date.now() * 0.01
			time++

			material.uniforms.time.value += 0.01
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
</script>

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
</style>
