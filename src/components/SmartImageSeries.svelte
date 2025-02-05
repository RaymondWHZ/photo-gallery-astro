<script lang="ts">
  	import { onDestroy, onMount } from "svelte";
	import type { Action } from "svelte/action";

	export let additionalClasses: string = "";
	export let image: string;
	export let fullWidth: number | undefined = undefined;

	$: fullSrc = fullWidth ? image + `&width=${fullWidth}` : image;

	let imageSrc = "";
	let imageDiv: HTMLDivElement;

	let observer: IntersectionObserver;

	onMount(() => {
		observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						imageSrc = fullSrc;
					}, 50);
					observer.disconnect();
				}
			});
		});
		observer.observe(imageDiv);
	});

	onDestroy(() => {
		observer?.disconnect();
	});

	let loaded = false;

	const onload: Action<HTMLImageElement> = (el) => {
		el.addEventListener('load', () => {
			loaded = true;
		});
    }
</script>

<div class={"overflow-clip relative " + additionalClasses} bind:this={imageDiv}>
	<img src={image + "&width=200"} alt="" class={"w-full blur-lg transition duration-[600] delay-200" + (loaded ? " opacity-0" : "")} />
	<div class={"absolute inset-0 transition duration-200 ease-in" + (loaded ? "" : " opacity-0")}>
		<img use:onload src={imageSrc} alt="" class={"w-full transition duration-[600] delay-200" + (loaded ? "" : " blur-md")} />
	</div>
</div>
