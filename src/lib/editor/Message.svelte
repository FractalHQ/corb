<script>
	import { getContext } from 'svelte'
	import { slide } from 'svelte/transition'

	const { navigate } = getContext('REPL')

	export let kind
	export let details = null
	export let filename = null
	export let truncate = false

	function message(details) {
		let str = details.message || '[missing message]'

		let loc = []

		if (details.filename && details.filename !== filename) {
			loc.push(details.filename)
		}

		if (details.start) loc.push(details.start.line, details.start.column)

		return str + (loc.length ? ` (${loc.join(':')})` : ``)
	}
</script>

<div
	in:slide={{ delay: 150, duration: 100 }}
	out:slide={{ duration: 100 }}
	class="message {kind}"
	class:truncate
>
	{#if details}
		<p class:navigable={details.filename} on:click={() => navigate(details)}>
			{message(details)}
		</p>
	{:else}
		<slot />
	{/if}
</div>

<style>
	.message {
		position: absolute;
		bottom: 0;

		width: 100%;
		min-height: max-content;

		margin: auto;
		padding: 12px 16px 12px 44px;

		font-family: var(--font-mono);

		font-size: 0.8rem;

		border-top: 1px solid var(--light-b);
		/* z-index: 99; */

		backdrop-filter: blur(10px);
	}

	.navigable {
		cursor: pointer;
	}

	.message:before {
		position: absolute;
		top: 9px;
		left: 12px;

		box-sizing: content-box;
		width: 10px;
		height: 10px;
		padding: 4px;

		font-size: 15px;

		font-weight: 700;
		line-height: 10px;

		color: var(--dark-b);
		border: 1px solid var(--dark-b);
		border-radius: 50%;

		content: '!';
		text-align: center;
	}

	.truncate {
		white-space: pre;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	p {
		margin: 0;
		padding: 0;

		font-weight: 400;
		font-family: 'Fira Code', monospace;

		color: var(--dark-b);
	}

	.error {
		line-height: 15px;

		/* background-color: var(--warn); */
		background-color: #d359756b;
		/* background-color: #da106e; */
	}

	.warning {
		background-color: #e47e0a;
	}

	.info {
		background-color: var(--light-b);
	}
</style>
