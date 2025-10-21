<script lang="ts">
  import type { Work } from "@/utils/cms";

  interface Props {
    work: Work;
    width?: string;
  }

  const { work, width }: Props = $props();
</script>

<p
  class="text-xs font-light text-gray-500 italic"
  style={width ? `width: ${width}px` : ""}
>
  Shot on {work.date} <span class="text-nowrap">at {work.locationName}</span>
  <br />
  with {work.deviceName}
  {#if work.lensName}+ {work.lensName}{/if}
</p>
<span class="font-reenie-beanie text-3xl"> Raymond Wu </span>
