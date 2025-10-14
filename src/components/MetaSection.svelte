<script lang="ts">
  import type { Work } from "@/utils/cms";

  interface Props {
    work: Work;
    width?: string;
  }

  const { work, width }: Props = $props();
</script>

<p
  class="text-xs font-light italic text-gray-500"
  style={width ? `width: ${width}px` : ""}
>
  Shot on {work.date} <span class="text-nowrap">at {work.locationName}</span>
  <br />
  with {work.deviceName}
  {#if work.lensName}+ {work.lensName}{/if}
</p>
<span class="text-3xl font-reenie-beanie"> Raymond Wu </span>
