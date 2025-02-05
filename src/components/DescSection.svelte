<script lang="ts">
    import type { Work } from "@/utils/cms";

    const { work, statusDescription = "", wide = false, width } = $props<{
        work: Work;
        statusDescription?: string;
        wide?: boolean;
        width?: string;
    }>();
</script>

{#if statusDescription}
    <p class="text-xs font-light text-gray-500">{statusDescription}</p>
{/if}

{#if wide}
    <div class="flex flex-row items-baseline gap-x-6 gap-y-3 flex-wrap">
        <h2 class="text-3xl">{work.title}</h2>
        <div class="flex flex-row gap-2">
            <h3>{work.shutter}</h3>
            <h3>f/{work.aperture}</h3>
            <h3>{work.iso}</h3>
        </div>
    </div>
{:else}
    <h2 class="text-3xl">{work.title}</h2>
    <div class="flex flex-row gap-2">
        <h3>{work.shutter}</h3>
        <h3>f/{work.aperture}</h3>
        <h3>{work.iso}</h3>
    </div>
{/if}

<p class="text-xs font-light text-gray-500" style={width ? `width: ${width}px` : ''}>{work.description}</p>
