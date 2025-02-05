<script lang="ts">
    import type { Work } from "@/utils/cms";

    const { work, width } = $props<{
        work: Work;
        width?: string;
    }>();
</script>

<p class="text-xs font-light italic text-gray-500" style={width ? `width: ${width}px` : ''}>
    Shot on {work.date} <span class="text-nowrap">at {work.locationName}</span> <br/>
    with {work.deviceName} {#if work.lensName}+ {work.lensName}{/if}
</p>
<span class="text-3xl font-reenie-beanie">
    Raymond Wu
</span>
