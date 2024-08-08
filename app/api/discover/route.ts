import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import cheerio from "cheerio";

export interface AnimeData {
  imageUrl: string;
  title: string;
  japaneseTitle: string;
  season: string;
  rating: string;
  episode: string;
  selfUrl: string;
  type: string;
}

export const GET = async (req: NextRequest) => {
  try {
    const page = req.nextUrl.searchParams.get("page") || "1";
    const url = `https://zoronime.com/home/page/${page}`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const data: AnimeData[] = [];

    $('.flw-item').each((index, element) => {
      const imageUrl = $(element).find('img.film-poster-img').attr('data-src') || $(element).find('img.film-poster-img').attr('src');
      const title = $(element).find('a.film-poster-ahref').attr('title');
      const japaneseTitle = $(element).find('a.film-poster-ahref').attr('data-jname');
      const season = $(element).find('.fd-infor .fdi-item a').attr('title');
      const rating = $(element).find('.tick-item-sub').text().trim();
      const episode = $(element).find('.tick-item').text().trim();
      const href = $(element).find('a.film-poster-ahref').attr('href');
      let selfUrl = '';
      let type = '';

      if (href) {
        if (href.includes('/anime/')) {
          selfUrl = href.replace('https://zoronime.com/anime/', '').replace('/', '');
          type = 'anime';
        } else if (href.includes('/movie/')) {
          selfUrl = href.replace('https://zoronime.com/movie/', '').replace('/', '');
          type = 'movie';
        }
      }

      if (imageUrl && title && japaneseTitle && season && rating && episode && selfUrl && type) {
        data.push({ imageUrl, title, japaneseTitle, season, rating, episode, selfUrl, type });
      }
    });

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