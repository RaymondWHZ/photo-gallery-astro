<script lang="ts">
	import WorkView from './WorkView.svelte';
	import type { Work } from '@/utils/cms';
	import { onMount } from 'svelte';

	export let statusDescription: string;
	export let feed: Work[];
	export let mode: 'feed' | 'single' = 'feed';

	let index = 0;

	let innerWidth: number;
	let mouseX = 0;
	let mouseY = 0;

	let touchScreen = false;
	onMount(() => {
		if ('ontouchstart' in window) {
			touchScreen = true;
		}
	});

	$: hasNext = index < feed.length - 1;
	$: hasPrev = index > 0;
	$: mouseInRightHalf = mouseX > innerWidth / 2;

	let mouseIn = false;

	let mouseDownTime: number;
</script>

<svelte:window
	bind:innerWidth
	on:mouseover={e => ({ pageX: mouseX, pageY: mouseY } = e)}
	on:mousemove={e => ({ pageX: mouseX, pageY: mouseY } = e)}
	on:mousedown={e => ({ pageX: mouseX, pageY: mouseY } = e)}
	on:keyup={(e) => {
		if (e.key === 'ArrowRight' && index < feed.length - 1) index++;
		if (e.key === 'ArrowLeft' && index > 0) index--;
	}}
/>
<svelte:head>
	{#if index > 0}
		<link rel="preload" as="image" href={feed[index - 1].image} />
	{/if}
	{#if index < feed.length - 1}
		<link rel="preload" as="image" href={feed[index + 1].image} />
	{/if}
</svelte:head>
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
	class="h-full w-full flex flex-col items-center px-safe-screen"
	role="application"
	on:focus={() => {}}
	on:mouseover={() => mouseIn = true}
	on:mousemove={() => mouseIn = true}
	on:mouseleave={() => mouseIn = false}
	on:mousedown={() => mouseDownTime = Date.now()}
	on:mouseup={() => {
		if (Date.now() - mouseDownTime > 200) return;
		if (mode === 'feed') {
			if (mouseInRightHalf && hasNext) index++;
			if (!mouseInRightHalf && hasPrev) index--;
		}
		if (mode === 'single') {
			history.back();
		}
	}}
>
	{#if touchScreen}
		<div class="w-full flex flex-col items-start gap-1 max-w-content mb-8">
			{#if mode === 'feed'}
				{#if hasNext}
					<h1
						class="bg-black text-white text-xs p-1"
					>
						CLICK RIGHT HALF TO VIEW NEXT →
					</h1>
				{:else}
					<h1
						class="bg-black text-white text-xs p-1 opacity-40"
					>
						YOU'VE REACHED THE END!
					</h1>
				{/if}
				{#if hasPrev}
					<h1
						class="bg-black text-white text-xs p-1"
					>
						CLICK LEFT HALF TO VIEW PREVIOUS ←
					</h1>
				{:else}
					<h1
						class="bg-black text-white text-xs p-1 opacity-40"
					>
						NO PREVIOUS
					</h1>
				{/if}
			{/if}
			{#if history.length > 1 && mode === 'single'}
				<h1
					class="bg-black text-white text-xs p-1"
				>
					CLICK ANYWHERE TO RETURN
				</h1>
			{/if}
		</div>
	{/if}
	<div class="h-full w-full max-w-content bg-white">
		<WorkView {statusDescription} work={feed[index]} />
	</div>
</div>
{#if !touchScreen && mouseIn}
	{#if mode === 'feed'}
		{#if mouseInRightHalf}
			{#if hasNext}
				<h1
					class="bg-black text-white text-xs p-1"
					style="position: absolute; top: {mouseY + 10}px; left: {mouseX + 10}px"
				>
					CLICK HERE TO VIEW NEXT →
				</h1>
			{:else}
				<h1
					class="bg-black text-white text-xs p-1 opacity-40"
					style="position: absolute; top: {mouseY + 10}px; left: {mouseX + 10}px"
				>
					YOU'VE REACHED THE END!
				</h1>
			{/if}
		{:else}
			{#if hasPrev}
				<h1
					class="bg-black text-white text-xs p-1"
					style="position: absolute; top: {mouseY + 10}px; left: {mouseX + 10}px"
				>
					CLICK HERE TO VIEW PREVIOUS ←
				</h1>
			{:else}
				<h1
					class="bg-black text-white text-xs p-1 opacity-40"
					style="position: absolute; top: {mouseY + 10}px; left: {mouseX + 10}px"
				>
					NO PREVIOUS; CLICK RIGHT HALF TO VIEW NEXT
				</h1>
			{/if}
		{/if}
	{/if}
	{#if history.length > 1 && mode === 'single'}
		<h1
			class="bg-black text-white text-xs p-1"
			style="position: absolute; top: {mouseY + 10}px; left: {mouseX + 10}px"
		>
			CLICK ANYWHERE TO RETURN
		</h1>
	{/if}
{/if}