import axios from "axios";
import cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

type Genre = {
  name: string;
  selfLink: string;
};

type Episode = {
  episodeNumber: string;
  episodeTitle: string;
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
  episodes: Episode[];
};

export const GET = async (
  req: NextRequest,
  { params }: { params: { slug: string } }
) => {
  const slug = params.slug;
  const url = `https://riie.stream/anime/${slug}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const imageUrl = $('div.thumb[itemprop="image"] img').attr("src");
    const title = $(".entry-title").text();
    const malScore = $('div.spe span:contains("MAL Score:")').text().replace('MAL Score:', '').trim();
    const rating = $('div.spe span:contains("Rating:")').text().replace('Rating:', '').trim();
    const premiered = $('div.spe span:contains("Premiered:")').text().replace('Premiered:', '').trim();
    const aired = $('div.spe span:contains("Aired:")').text().replace('Aired:', '').trim();
    const type = $('div.spe span:contains("Type:")').text().replace('Type:', '').trim();
    
    const genres: Genre[] = [];
    $('.genxed a').each((index, element) => {
      const genreName = $(element).text();
      const genreUrl = $(element).attr('href')?.replace('https://riie.stream/genre/', '').replace('/', '') || '';
      genres.push({ name: genreName, selfLink: genreUrl });
    });
    const synopsis = $('div.entry-content[itemprop="description"]').text().trim();

    const episodes: Episode[] = [];
    $('li[data-index] a').each((index, element) => {
      const episodeNumber = $(element).find('.epl-num').text();
      const episodeTitle = $(element).find('.epl-title').text();
      const episodeLink = $(element).attr('href') || '';
      const episodeId = episodeLink.split('/').filter(Boolean).pop() || '';
      const selfLink = episodeId;
      episodes.push({ episodeNumber, episodeTitle, selfLink });
    });

    const animeData: AnimeData = { imageUrl, title, malScore, rating, premiered, aired, type, genres, synopsis, episodes };

    return NextResponse.json(animeData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch image" });
  }
};
