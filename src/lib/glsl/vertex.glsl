varying vec2 vUv;
// varying vec2 vCoordinates;
attribute vec3 aCoordinates;

void main() {
	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}