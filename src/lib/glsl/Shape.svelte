<script context="module" lang="ts">
	import * as THREE from 'three'

	import vertShader from '$lib/glsl/torus.vs?raw'
	// import fragShader from '$lib/glsl/torus.fs?raw'
	import fragShader from '$lib/glsl/fragment.glsl?raw'
	import { randInt } from '$lib/utils'

	export class Shape {
		mesh: THREE.Mesh
		timeU: THREE.IUniform

		constructor(parentScene: THREE.Scene) {
			const geom = new THREE.TorusKnotGeometry(3, 1, 128, 32)
			const mat = new THREE.RawShaderMaterial({
				uniforms: {
					time: { value: 0 }
				},
				vertexShader: vertShader,
				fragmentShader: fragShader
			})
			this.timeU = mat.uniforms.time
			this.mesh = new THREE.Mesh(geom, mat)
			parentScene.add(this.mesh)
		}

		public update(secs: number): void {
			this.timeU.value = secs
			this.mesh.rotation.set(
				Math.sin(secs / 10) * 2 * Math.PI,
				Math.cos(secs / 10) * 2 * Math.PI,
				0
			)
		}
	}
</script>
