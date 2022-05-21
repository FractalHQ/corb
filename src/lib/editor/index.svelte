<script>
	import Monaco from '$lib/repl/YRepl/monaco/Monaco.svelte'
	import { selected } from '$lib/stores/gistStore'
	import Message from '$lib/repl/Message.svelte'
	import { getContext, onMount } from 'svelte'

	const { bundle, handle_change, register_module_editor } = getContext('REPL')

	export let errorLoc

	let editor
	onMount(() => {
		register_module_editor(editor)
	})

	export function focus() {
		editor.focus()
	}

	export let mini = false
	// export let lineNumbers = false
	export let lineWrapping = false
</script>

<div class="editor-wrapper {mini ? 'mini' : ''}">
	<div class="editor">
		<Monaco bind:this={editor} on:change={handle_change} {lineWrapping} {errorLoc} />
	</div>

	<div class="info">
		{#if $bundle}
			{#if $bundle.error}
				<Message
					kind="error"
					details={$bundle.error}
					filename="{$selected.name}.{$selected.type}"
				/>
			{:else if $bundle.warnings.length > 0}
				{#each $bundle.warnings as warning}
					<Message
						kind="warning"
						details={warning}
						filename="{$selected.name}.{$selected.type}"
					/>
				{/each}
			{/if}
		{/if}
	</div>
</div>

<style>
	.editor-wrapper {
		display: flex;
		flex-direction: column;

		z-index: 5;
	}
	.mini {
		width: calc(100% + 40px) !important;
	}

	.editor {
		flex: 1 1 auto;

		height: 0;
	}

	.info {
		max-height: 50%;

		background-color: var(--second);

		overflow: auto;
	}

	:global(.columns) .editor-wrapper {
		/* make it easier to interact with scrollbar */
		padding-right: 4px;
		height: auto;
		width: 100%;
	}
</style>
