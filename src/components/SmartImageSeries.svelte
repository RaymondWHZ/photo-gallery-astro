<script lang="ts">
	import type { Action } from "svelte/action";

	interface Props {
		additionalClasses?: string;
		image: string;
		fullWidth?: number;
		forceDelay?: boolean;
		onmouseenter?: () => void;
		onmouseleave?: () => void;
	}

	const { additionalClasses = "", image, fullWidth, forceDelay = true, onmouseenter, onmouseleave }: Props = $props();

	const fullSrc = $derived(fullWidth ? image + `&width=${fullWidth}` : image);

	let startLoading = $state(false);
	let loaded = $state(false);
	
	const imageSrc = $derived(!forceDelay || startLoading ? fullSrc : "");

	const onload: Action<HTMLImageElement> = (el) => {
		if (!forceDelay && el.complete) {
			loaded = true;
		} else {
			$effect(() => {
				const loadCallback = () => {
					loaded = true;
					el.removeEventListener("load", loadCallback);
				};
				el.addEventListener('load', loadCallback);
				return () => {
					el.removeEventListener("load", loadCallback);
				};
			});
		}
		if (forceDelay) {
			setTimeout(() => {
				startLoading = true;
			}, 50);
		}
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class={"overflow-clip relative cursor-pointer " + additionalClasses} {onmouseenter} {onmouseleave}>
	<img src={image + "&width=200"} alt="" class={"w-full blur-sm" + (loaded ? " opacity-0" : "")} />
	<div class="absolute inset-0">
		<img use:onload src={imageSrc} alt="" class={"w-full" + (loaded ? "" : " opacity-0")} loading="lazy" />
	</div>
</div>
