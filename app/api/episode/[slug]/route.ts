import axios from "axios";
import cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface Episode {
  episodeNumber: string;
  episodeLink: string;
  episodeTitle: string;
}

interface StreamSource {
  src: string;
  resolution: string;
  serverName: string;
}

export interface StreamData {
  sources: StreamSource[];
  episodes: Episode[];
}

export interface StreamsResponse {
  streams: StreamData[];
  error?: string;
}

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<any>> => {
  const slug = params.slug;
  const url = `https://v5.animasu.cc/${slug}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract episodes
    const episodes: Episode[] = [];
    $('#daftarepisode li').each((_, elem) => {
      const episodeLink = $(elem).find('a').attr('href')?.replace('https://v5.animasu.cc/', '').replace('/', '');
      const episodeTitle = $(elem).find('a').text();
      const episodeNumberMatch = episodeTitle.match(/\d+/);
      const episodeNumber = episodeNumberMatch ? episodeNumberMatch[0] : 'Unknown';
      if (episodeLink && episodeTitle) {
        episodes.push({ episodeNumber, episodeLink, episodeTitle });
      }
    });

    // Extracting video options
    const options = $('select.mirror option').toArray();
    const sources: StreamSource[] = options.map((option, index) => {
      const encodedSrc = $(option).attr('value');
      const serverName = `Server ${index}`;

      if (encodedSrc) {
        const decodedHtml = Buffer.from(encodedSrc, 'base64').toString('ascii');
        const iframeSrc = cheerio.load(decodedHtml)('iframe').attr('src');
        const resolutionMatch = $(option).text().trim().match(/(\d+p)/);
        const resolution = resolutionMatch ? resolutionMatch[0] : 'Unknown';

        return {
          src: iframeSrc,
          resolution: resolution,
          serverName: serverName
        };
      }
      return null;
    }).filter((source): source is StreamSource => source !== null);

    const streamData: StreamData = {
      sources: sources,
      episodes: episodes
    };

    return NextResponse.json(streamData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" });
  }
};
