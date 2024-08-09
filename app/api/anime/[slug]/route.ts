import axios from "axios";
import cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
  characteristics: string[];
  aired: string;
  year: string;
  genres: Genre[];
  synopsis: string;
  type: string;
  alternativeTitle: string;
  quality: string;
  author: string;
  duration: string;
  selfLink: string;
  lastUpdated: string;
}

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const url = `https://v5.animasu.cc/anime/${slug}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const imageUrl = $('.thumb[itemprop="image"] img').attr('data-src');
    const title = $('h1[itemprop="headline"]').text().trim();
    const malScore = $('.rating strong').text().trim();
    const rating = $('.rating strong').text().split(' ')[1]?.trim() || '';
    const characteristics = $('#tikar_shw a').map((_, element) => $(element).text().trim()).get();
    const aired = $('.spe').find('span').eq(3).text().split(': ')[1]?.trim() || '';
    const year = $('.spe').find('span').eq(4).text().split(': ')[1]?.trim() || '';
    const synopsis = $('.desc[itemprop="mainContentOfPage"]').find('p').first().text().trim().replace(" [Ditulis oleh Animasu Menulis Ulang]", '').replace(" [Ditulis oleh Animasu Menulis kembali]", '')
    const type = $('.spe').find('span').eq(5).text().split(': ')[1]?.trim() || '';
    const alternativeTitle = $('.alter').text().trim();
    const quality = $('.spe').find('span').eq(6).text().split(': ')[1]?.trim() || '';
    const author = $('.spe').find('span').eq(7).text().split(': ')[1]?.trim() || '';
    const duration = $('.spe').find('span').eq(8).text().split(': ')[1]?.trim() || '';
    const lastUpdated = $('.spe').find('time[itemprop="dateModified"]').attr('datetime') || '';
    const selfLinkElement = $('.bigcover .ime a.lnk').attr('href');
    const selfLink = selfLinkElement ? selfLinkElement.replace('https://v5.animasu.cc/', '').replace('/', '') : '';

    const genres: Genre[] = [];
    $('.spe span:first-of-type a').each((index, element) => {
      const genreName = $(element).text().trim();
      const genreUrl = $(element).attr('href')?.replace('https://v5.animasu.cc/genre/', '').replace('/', '') || '';
      genres.push({ name: genreName, selfLink: genreUrl });
    });

    const animeData: AnimeData = { imageUrl, title, malScore, rating, characteristics, aired, year, genres, synopsis, type , alternativeTitle, quality, author, duration, selfLink, lastUpdated };

    return NextResponse.json(animeData);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
};