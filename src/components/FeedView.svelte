<script lang="ts">
  import WorkView from "./WorkView.svelte";
  import Tag from "./Tag.svelte";
  import type { Work } from "@/utils/cms";
  import { onMount } from "svelte";

  interface Props {
    statusDescription?: string;
    feed: Work[];
    mode?: "feed" | "single";
  }

  const { statusDescription = "", feed, mode = "feed" }: Props = $props();

  let index = $state(0);

  let innerWidth = $state(0);
  let mouseX = $state(0);
  let mouseY = $state(0);
  let mouseIn = $state(false);

  let mouseOnImage = $state(false);

  let touchScreen = $state(false);
  onMount(() => {
    if ("ontouchstart" in window) {
      touchScreen = true;
    }
  });

  const hasNext = $derived(index < feed.length - 1);
  const hasPrev = $derived(index > 0);
  const mouseInRightHalf = $derived(mouseX > innerWidth / 2);

  let mouseDownTime: number; // pure bookkeeping, nonreactive
</script>

<svelte:window
  bind:innerWidth
  on:mouseover={(e) => ({ pageX: mouseX, pageY: mouseY } = e)}
  on:mousemove={(e) => ({ pageX: mouseX, pageY: mouseY } = e)}
  on:mousedown={(e) => ({ pageX: mouseX, pageY: mouseY } = e)}
  on:keyup={(e) => {
    if (e.key === "ArrowRight" && index < feed.length - 1) index++;
    if (e.key === "ArrowLeft" && index > 0) index--;
  }}
/>
<svelte:head>
  <link rel="preload" as="image" href={feed[index].image} />
  {#if index > 0}
    <link rel="preload" as="image" href={feed[index - 1].image} />
  {/if}
  {#if index < feed.length - 1}
    <link rel="preload" as="image" href={feed[index + 1].image} />
  {/if}
  <link rel="preload" as="image" href={`/image/${feed[index].id}`} />
</svelte:head>
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="px-safe-screen flex h-full w-full flex-col items-center"
  role="application"
  onfocus={() => {}}
  onmouseover={() => (mouseIn = true)}
  onmousemove={() => (mouseIn = true)}
  onmouseleave={() => (mouseIn = false)}
  onmousedown={() => (mouseDownTime = Date.now())}
  onmouseup={() => {
    if (Date.now() - mouseDownTime > 200) return;
    if (mouseOnImage) {
      window.open(`/image/${feed[index].id}`, "_blank");
    } else if (mode === "feed") {
      if (mouseInRightHalf && hasNext) index++;
      if (!mouseInRightHalf && hasPrev) index--;
    } else if (mode === "single") {
      history.back();
    }
  }}
>
  {#if touchScreen}
    <div class="max-w-content mb-8 flex w-full flex-col items-start gap-1">
      <Tag>CLICK IMAGE TO VIEW LARGE「」</Tag>
      {#if mode === "feed"}
        {#if hasNext}
          <Tag>CLICK RIGHT HALF TO VIEW NEXT →</Tag>
        {:else}
          <Tag disabled>YOU'VE REACHED THE END!</Tag>
        {/if}
        {#if hasPrev}
          <Tag>CLICK LEFT HALF TO VIEW PREVIOUS ←</Tag>
        {:else}
          <Tag disabled>NO PREVIOUS</Tag>
        {/if}
      {/if}
      {#if history.length > 1 && mode === "single"}
        <Tag>CLICK ANYWHERE ELSE TO RETURN ↵</Tag>
      {/if}
    </div>
  {/if}
  <div class="max-w-content h-full w-full bg-white">
    <WorkView
      {statusDescription}
      work={feed[index]}
      onmouseenterimage={() => (mouseOnImage = true)}
      onmouseleaveimage={() => (mouseOnImage = false)}
    />
  </div>
</div>
{#if !touchScreen && mouseIn}
  {#if mouseOnImage}
    <Tag x={mouseX} y={mouseY}>CLICK TO VIEW LARGE IMAGE「」</Tag>
  {:else}
    {#if mode === "feed"}
      {#if mouseInRightHalf}
        {#if hasNext}
          <Tag x={mouseX} y={mouseY}>CLICK HERE TO VIEW NEXT →</Tag>
        {:else}
          <Tag disabled x={mouseX} y={mouseY}>YOU'VE REACHED THE END!</Tag>
        {/if}
      {:else if hasPrev}
        <Tag x={mouseX} y={mouseY}>CLICK HERE TO VIEW PREVIOUS ←</Tag>
      {:else}
        <Tag disabled x={mouseX} y={mouseY}
          >NO PREVIOUS; CLICK RIGHT HALF TO VIEW NEXT</Tag
        >
      {/if}
    {/if}
    {#if history.length > 1 && mode === "single"}
      <Tag x={mouseX} y={mouseY}>CLICK HERE TO RETURN ↵</Tag>
    {/if}
  {/if}
{/if}
