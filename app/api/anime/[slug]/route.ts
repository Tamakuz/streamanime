import axios from "axios";
import cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";

export type Genre = {
  name: string;
  selfLink: string;
};

type Recommendation = {
  imageUrl: string;
  title: string;
  japaneseTitle: string;
  season: string;
  rating: string;
  episode: string;
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
  episodes: string;
  selfLink: string;
  recommendations: Recommendation[];
}

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const url = `https://zoronime.com/anime/${slug}`;

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const imageUrl = $('.film-poster-img').attr('data-src') || $('.film-poster-img').attr('src');
    const title = $('.dynamic-name').text().trim();
    const malScore = $('.item-title:contains("MAL Score:") .name').text().trim();
    const rating = $('.item-title:contains("Rating:") .name').text().trim();
    const premiered = $('.item-title:contains("Premiered:") .name a').text().trim();
    const aired = $('.item-title:contains("Aired:") .name').text().trim();
    const type = $('.item-title:contains("Type:") .name a').text().trim();
    const synopsis = $('.item-title:contains("Overview:") .text').text().trim();
    const status = $('.item-title:contains("Status:") a').text().trim();
    const alternativeTitle = $('.item-title:contains("Judul Alternatif:") .name').text().trim();
    const quality = $('.tick-item.tick-quality').text().trim();
    const dub = $('.tick-item.tick-dub').text().trim();
    const duration = $('.film-stats .item').eq(2).text().trim();
    const episodes = $('.film-stats .item').eq(3).text().trim();

    const genres: Genre[] = [];
    $('.item-list:contains("Genres:") a').each((index, element) => {
      const genreName = $(element).text().trim();
      const genreUrl = $(element).attr('href')?.replace('https://zoronime.com/genre/', '').replace('/', '') || '';
      genres.push({ name: genreName, selfLink: genreUrl });
    });

    const episodeLink = $('.btn-play').attr('href') || '';
    const selfLink = episodeLink.replace('https://zoronime.com/episode/', '').replace('/', '');

    const recommendations: Recommendation[] = [];
    $('.flw-item').each((index, element) => {
      const recImageUrl = $(element).find('img.film-poster-img').attr('data-src') || $(element).find('img.film-poster-img').attr('src');
      const recTitle = $(element).find('a.film-poster-ahref').attr('title');
      const recJapaneseTitle = $(element).find('a.film-poster-ahref').attr('data-jname');
      const recSeason = $(element).find('.fd-infor .fdi-item a').attr('title');
      const recRating = $(element).find('.tick-item-sub').text().trim();
      const recEpisode = $(element).find('.tick-item').text().trim();
      const recHref = $(element).find('a.film-poster-ahref').attr('href');
      let recSelfLink = '';

      if (recHref) {
        recSelfLink = recHref.replace('https://zoronime.com/anime/', '').replace('/', '');
      }

      if (recImageUrl && recTitle && recJapaneseTitle && recSeason && recRating && recEpisode && recSelfLink) {
        recommendations.push({ imageUrl: recImageUrl, title: recTitle, japaneseTitle: recJapaneseTitle, season: recSeason, rating: recRating, episode: recEpisode, selfLink: recSelfLink });
      }
    });

    const animeData: AnimeData = { imageUrl, title, malScore, rating, premiered, aired, type, genres, synopsis, status, alternativeTitle, quality, dub, duration, episodes, selfLink, recommendations };

    return NextResponse.json(animeData);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
};