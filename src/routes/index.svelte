<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit'
	export const load: Load = () => {
		return {
			redirect: '/1',
			status: 307
		}
	}
</script>
