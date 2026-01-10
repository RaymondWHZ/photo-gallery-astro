<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    disabled?: boolean;
    x?: number;
    y?: number;
    children: Snippet;
  }

  const { disabled = false, x, y, children }: Props = $props();

  const positionStyle = $derived(
    x !== undefined && y !== undefined
      ? `position: absolute; top: ${y + 10}px; left: ${x + 10}px`
      : "",
  );
</script>

<h1
  class="bg-black p-1 text-xs text-white"
  class:opacity-40={disabled}
  style={positionStyle}
>
  {@render children()}
</h1>
