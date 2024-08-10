import { connectDB } from "@/config/db";
import { NextRequest, NextResponse } from "next/server";
import AnimeModel from "@/model/anime.model";
import EpisodeModel from "@/model/episode.model";
import axios from "axios";
import cheerio from "cheerio";

interface StreamSource {
  src: string;
  resolution: string;
  serverName: string;
}

interface Episode {
  episodeNumber: string;
  episodeSelfLink: string;
  episodeTitle: string;
  streamSources: StreamSource[];
}

interface EpisodeList {
  slug: string;
  episodes: Episode[];
}

const BATCH_SIZE = 50;
const DELAY_BETWEEN_BATCHES = 5000; // 5 seconds

async function processBatch(batch: any[]) {
  return Promise.all(batch.map(async (selfLinkSlug) => {
    try {
      const url = `https://v5.animasu.cc/${selfLinkSlug.selfLink}`;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      console.log(`[Fetch] Started fetching data for slug: ${selfLinkSlug.slug} at URL: ${url}`);

      const episodes: Episode[] = [];
      const streamSourcesCache = new Map<string, StreamSource[]>();

      $('#daftarepisode li').each((_, elem) => {
        const episodeSelfLink = $(elem).find('a').attr('href')?.replace('https://v5.animasu.cc/', '').replace('/', '');
        const episodeTitle = $(elem).find('a').text();
        const episodeNumber = episodeTitle.match(/\d+/)?.[0] || 'Unknown';

        if (episodeSelfLink && episodeTitle) {
          let streamSources: StreamSource[];
          
          if (streamSourcesCache.has(episodeSelfLink)) {
            streamSources = streamSourcesCache.get(episodeSelfLink)!;
          } else {
            streamSources = $('select.mirror option').map((index, option) => {
              const encodedSrc = $(option).attr('value');
              if (!encodedSrc) return null;

              const decodedHtml = Buffer.from(encodedSrc, 'base64').toString('ascii');
              const iframeSrc = cheerio.load(decodedHtml)('iframe').attr('src');
              const resolution = $(option).text().trim().match(/(\d+p)/)?.[0] || 'Unknown';

              return {
                src: iframeSrc,
                resolution,
                serverName: `Server ${index}`
              };
            }).get().filter((source): source is StreamSource => source !== null);

            streamSourcesCache.set(episodeSelfLink, streamSources);
          }

          episodes.push({ episodeNumber, episodeSelfLink, episodeTitle, streamSources });
        }
      });

      const upsertResult = await EpisodeModel.findOneAndUpdate(
        { slug: selfLinkSlug.slug },
        { $set: { episodes } },
        { upsert: true, new: true }
      );

      console.log(`[Database] ${upsertResult.isNew ? 'Created' : 'Updated'} episodes for slug ${selfLinkSlug.slug}.`);

      return { slug: selfLinkSlug.slug, episodes };
    } catch (error) {
      console.error(`[Error] Failed to process slug: ${selfLinkSlug.slug}`, error);
      return null;
    }
  }));
}

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const selfLinkSlugs = await AnimeModel.find({}).select("selfLink slug -_id");
    console.log(`[Database] Retrieved ${selfLinkSlugs.length} anime slugs for processing.`);

    const results = [];
    for (let i = 0; i < selfLinkSlugs.length; i += BATCH_SIZE) {
      const batch = selfLinkSlugs.slice(i, i + BATCH_SIZE);
      console.log(`[Batch] Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(selfLinkSlugs.length / BATCH_SIZE)}`);
      const batchResults = await processBatch(batch);
      results.push(...batchResults.filter(result => result !== null));

      if (i + BATCH_SIZE < selfLinkSlugs.length) {
        console.log(`[Delay] Waiting for ${DELAY_BETWEEN_BATCHES / 1000} seconds before next batch...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    console.log("[Process Complete] All episodes have been processed and responses are prepared.");
    return NextResponse.json({ message: "Process Complete", processedCount: results.length });
  } catch (error) {
    console.error("[Error] Issue during episode fetching and processing:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}