import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import cheerio from "cheerio";

export interface AnimeData {
  title: string;
  selfLink: string;
  imageUrl: string;
  episodeCount: number;
  status: string;
}

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  const page = req.nextUrl.searchParams.get("page") || "1";
  try {
    const url = `https://v5.animasu.cc/pencarian/?urutan=populer&halaman=${page}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const data: AnimeData[] = $('.bsx').map((_, element) => {
      const title = $(element).find('.tt').text().trim() || '';
      const link = $(element).find('a').attr('href') || '';
      const selfLink = link.replace('https://v5.animasu.cc/anime/', '').replace('/', '');
      const imageUrl = $(element).find('img.lazy').attr('data-src') || '';
      const episodeCount = parseInt($(element).find('.epx').text().replace('Episode', '').trim()) || 0;
      const status = $(element).find('.sb').text().trim() || 'Unknown';
      return {
        title,
        selfLink,
        imageUrl,
        episodeCount,
        status
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