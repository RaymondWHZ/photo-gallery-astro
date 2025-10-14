import { NOTION_TOKEN, NOTION_CMS_PAGE_ID } from "astro:env/server";
import {
  createDBSchemas,
  createNotionDBClient,
  date,
  type DBObjectTypesInfer,
  files,
  packPlainText,
  rich_text,
  rollup,
  select,
  title,
  unique_id,
} from "notion-cms-adaptor";

const rollupSingleTitle = rollup().handleSingleUsing((value): string => {
  if (value && value.type === "title") {
    return packPlainText(value.title);
  }
  return "";
});

const dbSchemas = createDBSchemas({
  about: {
    section: title().plainText(),
    text: rich_text().plainText(),
  },
  works: {
    id: unique_id().number(),
    title: title().plainText(),
    image: files().singleNotionImageUrl(),
    shutter: rich_text().plainText(),
    aperture: rich_text().plainText(),
    iso: rich_text().plainText(),
    description: rich_text().plainText(),
    date: date().startDate(),
    display: select().stringEnum("left", "right", "top", "middle", undefined),
    locationName: rollupSingleTitle,
    deviceName: rollupSingleTitle,
    lensName: rollupSingleTitle,
  },
  works__thumbnail: {
    id: unique_id().number(),
    image: files().singleNotionImageUrl(),
    display: select().stringEnum("left", "right", "top", "middle", undefined),
  },
  works__original: {
    id: unique_id().number(),
    image: files().singleUrl(),
  },
  collections: {
    id: unique_id().number(),
    title: title().plainText(),
    description: rich_text().plainText(),
    dates: date().dateRange(),
    status: select().stringEnum("in-progress", undefined),
    work_ids: rollup().handleArrayUsing((values) => {
      return values
        .map((value) => {
          if (value.type === "unique_id") {
            return value.unique_id.number ?? undefined;
          }
          return undefined;
        })
        .filter((value) => value !== undefined);
    }),
    parent_id: rollup().handleSingleUsing((value) => {
      if (value && value.type === "unique_id") {
        return value.unique_id.number ?? undefined;
      }
      return undefined;
    }),
    sub_item_ids: rollup().handleArrayUsing((values) => {
      return values
        .map((value) => {
          if (value.type === "unique_id") {
            return value.unique_id.number ?? undefined;
          }
          return undefined;
        })
        .filter((value) => value !== undefined);
    }),
  },
});

const client = createNotionDBClient({
  notionToken: NOTION_TOKEN,
  dbPageId: NOTION_CMS_PAGE_ID,
  dbSchemas,
});

export type ObjectTypes = DBObjectTypesInfer<typeof dbSchemas>;
export type Work = ObjectTypes["works"];
export type WorkThumbnail = ObjectTypes["works__thumbnail"];
export type RawCollection = ObjectTypes["collections"];
export type Collection = RawCollection & {
  works: WorkThumbnail[];
  subCollections?: Collection[];
};

export async function fetchAllVisibleWorks(): Promise<Work[]> {
  return await client.query("works", {
    filter: {
      property: "collections",
      relation: {
        is_not_empty: true,
      },
    },
  });
}

export async function fetchCollections(): Promise<Collection[]> {
  const [collections, works] = (await Promise.all([
    client.query("collections", {
      filter: {
        property: "status",
        select: {
          does_not_equal: "hidden",
        },
      },
      sorts: [
        {
          property: "dates",
          direction: "descending",
        },
      ],
    }),
    client.query("works__thumbnail"),
  ])) as [Collection[], WorkThumbnail[]];

  // Collect works by their IDs
  const workMap = new Map<number, WorkThumbnail>();
  works.forEach((work) => {
    workMap.set(work.id, work);
  });
  collections.forEach((collection) => {
    collection.works = collection.work_ids
      .map((id) => workMap.get(id))
      .filter((work): work is WorkThumbnail => work !== undefined);
  });

  // Collect sub-collections, supports only 2 levels
  const collectionMap = new Map<number, Collection>();
  collections
    .filter((collection) => !!collection.parent_id)
    .forEach((collection) => {
      collectionMap.set(collection.id, collection);
    });
  const topLevelCollections = collections.filter(
    (collection) => !collection.parent_id,
  );
  topLevelCollections.forEach((collection) => {
    collection.subCollections = collection.sub_item_ids
      .map((id) => collectionMap.get(id))
      .filter(
        (collection): collection is Collection => collection !== undefined,
      );
  });

  return topLevelCollections;
}

export async function fetchSingleWork(id: number): Promise<Work | undefined> {
  return await client.queryOneByUniqueId("works", id);
}

export async function fetchOriginalUrl(
  id: number,
): Promise<string | undefined> {
  const work = await client.queryOneByUniqueId("works__original", id);
  if (work) {
    return work.image;
  }
  return undefined;
}

export type AboutInfo = {
  title: string;
  description: string;
  quote_title: string;
  quote: string;
};

export async function fetchAboutInfo(): Promise<AboutInfo> {
  return await client.queryKV("about", "section", "text");
}
