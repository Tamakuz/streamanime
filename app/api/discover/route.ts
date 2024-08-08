import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import cheerio from "cheerio";

export interface AnimeData {
  title: string;
  link: string;
  imageUrl: string;
  episodeCount: number;
  rating: number;
}

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  try {
    const url = `https://riie.stream/page/${page}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const data: AnimeData[] = $('.bsx').map((_, element) => {
      const title = $(element).find('.inf a').attr('title') || '';
      const link = $(element).find('.inf a').attr('href') || '';
      const imageUrl = $(element).find('.thumb img').attr('src') || '';
      const episodeCount = parseInt($(element).find('.inf span:contains("Ep")').text().replace('Ep', '').trim()) || 0;
      const rating = parseFloat($(element).find('.inf span:contains("Star")').text().replace('Star :', '').trim()) || 0;
      return {
        title,
        link,
        imageUrl,
        episodeCount,
        rating
      };
    }).get();

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error(`AxiosError: ${error.message}`);
      return NextResponse.json({ error: "Failed to fetch data from the server" }, { status: error.response?.status || 500 });
    } else {
      console.error(`Unexpected error: ${error}`);
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }
  }
};