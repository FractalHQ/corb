<script lang="ts">
	import { Fractils } from 'fractils'
	import { page } from '$app/stores'
	import 'greset/css/greset.css'
	import '../styles/app.scss'

	const pageTitle = (path: string) => {
		if (path === '/') return 'Home'
		const title = path.split('/')[1]
		return title.charAt(0).toUpperCase() + title.slice(1)
	}
</script>

<template lang="pug">

	svelte:head
		title {pageTitle($page.url.pathname)} · corb

	fractils

	slot

</template>
