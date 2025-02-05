<script lang="ts">
  	import type { Work } from "@/utils/cms";
  	import SmartImageSeries from "./SmartImageSeries.svelte";

	export let work: Work;

	let clicked = false;
</script>

<div class="overflow-clip">
	<a href={"/" + work.id} class={"transition duration-100" + (clicked ? " blur-lg" : "")} on:click={() => clicked = true}>
		<SmartImageSeries image={work.image} fullWidth={1000} />
	</a>
</div>
