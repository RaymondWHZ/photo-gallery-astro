<script lang="ts">
	import type { Action } from "svelte/action";

	export let additionalClasses: string = "";
	export let image: string;
	export let fullWidth: number | undefined = undefined;
	export let forceDelayLoading: boolean = true;

	$: fullSrc = fullWidth ? image + `&width=${fullWidth}` : image;

	let loaded = false;

	const onload: Action<HTMLImageElement> = (el) => {
		if (!forceDelayLoading && el.complete) {
			loaded = true;
		} else {
			el.addEventListener('load', () => {
				loaded = true;
			});
		}
		if (forceDelayLoading) {
			setTimeout(() => {
				el.src = fullSrc;
			}, 50);
		}
    }
</script>

<div class={"overflow-clip relative " + additionalClasses}>
	<img src={image + "&width=200"} alt="" class={"w-full blur-lg transition duration-[600] delay-200" + (loaded ? " opacity-0" : "")} />
	<div class={"absolute inset-0 transition duration-200 ease-in" + (loaded ? "" : " opacity-0")}>
		<img use:onload src={forceDelayLoading ? "" : fullSrc} alt="" class={"w-full transition duration-[600] delay-200" + (loaded ? "" : " blur-md")} />
	</div>
</div>
