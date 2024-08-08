import axios from "axios";
import cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

interface StreamData {
  server: string;
  resolution: string;
  href: string;
}

export interface EpisodeData {
  episodes: { selfLink: string; episodeNumber: string }[];
  imageUrl: string;
  title: string;
  japaneseTitle: string;
  quality: string;
  dub: string;
  status: string;
  year: string;
  type: string;
  description: string;
  streams: StreamData[];
}

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
): Promise<NextResponse<any>> => {
  const slug = params.slug;
  const url = `https://zoronime.com/episode/${slug}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const episodeData: EpisodeData = {
      episodes: [],
      imageUrl: "",
      title: "",
      japaneseTitle: "",
      quality: "",
      dub: "",
      status: "",
      year: "",
      type: "",
      description: "",
      streams: [],
    };

    $(".ps__-list .item a").each((index, element) => {
      const href = $(element).attr("href");
      const resolution = $(element).text().trim().match(/\(([^)]+)\)/)?.[1] || "";
      const server = $(element).text().trim().split(" ")[0];

      if (href && resolution && href.includes("embed")) {
        episodeData.streams.push({ server, resolution, href });
      }
    });

    $("#episodes-page-1 .ssl-item.ep-item").each((index, element) => {
      const href = $(element).attr("href");
      const episodeNumber = $(element).attr("data-number") || "";
      if (href) {
        const selfLink = href
          .replace("https://zoronime.com/episode/", "")
          .replace("/", "");
        
        episodeData.episodes.push({ selfLink, episodeNumber });
      }
    });

    const imageUrl = $(".anisc-poster .film-poster-img").attr("data-src") || $(".anisc-poster .film-poster-img").attr("src");
    const title = $(".anisc-detail .dynamic-name").attr("title");
    const japaneseTitle = $(".anisc-detail .dynamic-name").attr("data-jname");
    const quality = $(".film-stats .tick-item.tick-quality").text().trim();
    const dub = $(".film-stats .tick-item.tick-dub").text().trim();
    const status = $(".film-stats .item").eq(0).text().trim();
    const year = $(".film-stats .item").eq(1).text().trim();
    const type = $(".film-stats .item").eq(2).text().trim();
    const description = $(".film-description .text").text().trim();

    episodeData.imageUrl = imageUrl || "";
    episodeData.title = title || "";
    episodeData.japaneseTitle = japaneseTitle || "";
    episodeData.quality = quality || "";
    episodeData.dub = dub || "";
    episodeData.status = status || "";
    episodeData.year = year || "";
    episodeData.type = type || "";
    episodeData.description = description || "";

    return NextResponse.json(episodeData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch iframe source" });
  }
};
