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
  <div class="flex h-full flex-col items-center justify-center md:hidden">
    <div class="flex w-full flex-col items-start gap-10">
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
  <div class="flex h-full flex-col items-center justify-center max-md:hidden">
    {#if work.display === "top"}
      <div class="flex w-full flex-col items-start gap-10">
        <SmartImageSeries
          additionalClasses="w-full"
          image={work.image}
          onmouseenter={onmouseenterimage}
          onmouseleave={onmouseleaveimage}
        />
        <div class="flex w-[500px] flex-col items-start gap-3">
          <DescSection {work} {statusDescription} wide />
          <MetaSection {work} />
        </div>
      </div>
    {/if}
    {#if work.display === "left" || work.display === undefined}
      <div
        class="flex w-full flex-row items-end justify-between gap-8 lg:gap-10 2xl:gap-20"
      >
        <SmartImageSeries
          additionalClasses="flex-1 max-w-[110vh]"
          image={work.image}
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
        class={`flex w-full flex-row items-end justify-between gap-8 lg:gap-12 xl:gap-24 ${work.display === "middle" ? "lg:hidden" : ""}`}
      >
        <div class="flex flex-col items-start gap-3">
          <DescSection {work} {statusDescription} wide width="350" />
          <MetaSection {work} />
        </div>
        <SmartImageSeries
          additionalClasses="flex-1 max-w-[80vh]"
          image={work.image}
          onmouseenter={onmouseenterimage}
          onmouseleave={onmouseleaveimage}
        />
      </div>
    {/if}
    {#if work.display === "middle"}
      <div
        class="flex w-full flex-row items-start justify-between gap-12 max-lg:hidden"
      >
        <div class="flex flex-col items-start gap-3">
          <DescSection {work} {statusDescription} width="250" />
        </div>
        <SmartImageSeries
          additionalClasses="flex-1 max-w-[42vh]"
          image={work.image}
          onmouseenter={onmouseenterimage}
          onmouseleave={onmouseleaveimage}
        />
        <div class="flex h-full flex-col items-start justify-end gap-3">
          <MetaSection {work} width="250" />
        </div>
      </div>
    {/if}
  </div>
{/key}
