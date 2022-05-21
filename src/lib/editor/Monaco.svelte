<script context="module" lang="ts">
	import loader, { Monaco } from '@monaco-editor/loader'
	import { browser } from '$app/env'

	let monaco_promise: Promise<
		typeof import('/Users/fractal/dev/Projects/raymarching/node_modules/monaco-editor/esm/vs/editor/editor.api')
	>
	let _Monaco: typeof import('/Users/fractal/dev/Projects/raymarching/node_modules/monaco-editor/esm/vs/editor/editor.api')

	if (browser) {
		monaco_promise = loader.init().then((res) => {
			_Monaco = res
			return _Monaco
		})
	}
</script>
