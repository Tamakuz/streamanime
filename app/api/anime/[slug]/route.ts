import axios from "axios";
import cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export type Genre = {
  name: string;
  selfLink: string;
};

export type Episode = {
  number: string;
  selfLink: string;
};

export interface AnimeData {
  imageUrl: string | undefined;
  title: string;
  malScore: string;
  rating: string;
  premiered: string;
  aired: string;
  type: string;
  genres: Genre[];
  synopsis: string;
  status: string;
  alternativeTitle: string;
  quality: string;
  dub: string;
  duration: string;
  episodes: Episode[];
  selfLink: string;
}

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const url = `https://riie.stream/anime/${slug}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const imageUrl = $('.thumb[itemprop="image"] img').attr('src');
    const title = $('h1[itemprop="name"]').text().trim();
    const malScore = $('.spe').find('span').first().text().split(': ')[1]?.trim() || '';
    const rating = $('.spe').find('span').eq(1).text().split(': ')[1]?.trim() || '';
    const premiered = $('.spe').find('span').eq(2).text().split(': ')[1]?.trim() || '';
    const aired = $('.spe').find('span').eq(3).text().split(': ')[1]?.trim() || '';
    const type = $('.spe').find('span').eq(4).text().split(': ')[1]?.trim() || '';
    const synopsis = $('.entry-content[itemprop="description"]').text().trim();
    const status = $('.spe').find('span').eq(5).text().split(': ')[1]?.trim() || '';
    const alternativeTitle = $('.alter').text().trim();
    const quality = $('.spe').find('span').eq(6).text().split(': ')[1]?.trim() || '';
    const dub = $('.spe').find('span').eq(7).text().split(': ')[1]?.trim() || '';
    const duration = $('.spe').find('span').eq(8).text().split(': ')[1]?.trim() || '';

    const genres: Genre[] = [];
    $('.genxed a').each((index, element) => {
      const genreName = $(element).text().trim();
      const genreUrl = $(element).attr('href')?.replace('https://riie.stream/genre/', '').replace('/', '') || '';
      genres.push({ name: genreName, selfLink: genreUrl });
    });

    const episodes: Episode[] = [];
    $('.eplister ul li a').each((index, element) => {
      const episodeNumber = $(element).find('.epl-num').text().trim();
      const episodeLink = $(element).attr('href') || '';
      const episodeSelfLink = episodeLink.replace('https://riie.stream/episode/', '').replace('/', '');
      episodes.push({ number: episodeNumber, selfLink: episodeSelfLink });
    });

    const animeData: AnimeData = { imageUrl, title, malScore, rating, premiered, aired, type, genres, synopsis, status, alternativeTitle, quality, dub, duration, episodes, selfLink: slug };

    return NextResponse.json(animeData);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
};