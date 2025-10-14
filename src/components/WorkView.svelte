<script lang="ts">
  import type { Work } from "@/utils/cms";
  import MetaSection from "@/components/MetaSection.svelte";
  import DescSection from "@/components/DescSection.svelte";
  import SmartImageSeries from "./SmartImageSeries.svelte";

  interface Props {
    work: Work;
    statusDescription?: string;
    onmouseenterimage?: () => void;
    onmouseleaveimage?: () => void;
  }

  const {
    statusDescription = "",
    work,
    onmouseenterimage,
    onmouseleaveimage,
  }: Props = $props();
</script>

{#key work.id}
  <div class="flex flex-col justify-center items-center h-full md:hidden">
    <div class="flex flex-col items-start w-full gap-10">
      <SmartImageSeries
        additionalClasses="w-full"
        image={work.image}
        fullWidth={800}
        onmouseenter={onmouseenterimage}
        onmouseleave={onmouseleaveimage}
      />
      <div class="flex flex-col items-start gap-3">
        <DescSection {work} {statusDescription} />
        <MetaSection {work} />
      </div>
    </div>
  </div>
  <div class="flex flex-col justify-center items-center h-full max-md:hidden">
    {#if work.display === "top"}
      <div class="flex flex-col items-start w-full gap-10">
        <SmartImageSeries
          additionalClasses="w-full"
          image={work.image}
          fullWidth={2000}
          onmouseenter={onmouseenterimage}
          onmouseleave={onmouseleaveimage}
        />
        <div class="w-[500px] flex flex-col items-start gap-3">
          <DescSection {work} {statusDescription} wide />
          <MetaSection {work} />
        </div>
      </div>
    {/if}
    {#if work.display === "left" || work.display === undefined}
      <div class="flex flex-row items-end w-full gap-8 xl:gap-12">
        <SmartImageSeries
          additionalClasses="flex-1"
          image={work.image}
          fullWidth={2000}
          onmouseenter={onmouseenterimage}
          onmouseleave={onmouseleaveimage}
        />
        <div class="flex flex-col items-start gap-3">
          <DescSection {work} {statusDescription} width="250" />
          <MetaSection {work} />
        </div>
      </div>
    {/if}
    {#if work.display === "right" || work.display === "middle"}
      <div
        class={`flex flex-row items-end w-full gap-2 xl:gap-12 ${work.display === "middle" ? "xl:hidden" : ""}`}
      >
        <div class="flex flex-col items-start gap-3">
          <DescSection {work} {statusDescription} wide width="350" />
          <MetaSection {work} />
        </div>
        <SmartImageSeries
          additionalClasses="flex-1"
          image={work.image}
          fullWidth={2000}
          onmouseenter={onmouseenterimage}
          onmouseleave={onmouseleaveimage}
        />
      </div>
    {/if}
    {#if work.display === "middle"}
      <div class="flex flex-row items-start w-full gap-12 max-xl:hidden">
        <div class="flex flex-col items-start gap-3">
          <DescSection {work} {statusDescription} width="250" />
        </div>
        <SmartImageSeries
          additionalClasses="flex-1"
          image={work.image}
          fullWidth={2000}
          onmouseenter={onmouseenterimage}
          onmouseleave={onmouseleaveimage}
        />
        <div class="flex flex-col items-start justify-end gap-3 h-full">
          <MetaSection {work} width="250" />
        </div>
      </div>
    {/if}
  </div>
{/key}
