<script lang="ts">
  	import { onMount } from "svelte";
	import type { Action } from "svelte/action";

	const { additionalClasses = "", image, fullWidth } = $props<{
		additionalClasses?: string;
		image: string;
		fullWidth?: number
	}>();

	const fullSrc = $derived(fullWidth ? image + `&width=${fullWidth}` : image);

	let imageSrc = $state("");
	let imageDiv: HTMLDivElement;

	onMount(() => {
		let observer = new IntersectionObserver((entries) => {
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
		return () => {
			observer.disconnect();
		};
	});

	let loaded = $state(false);

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
