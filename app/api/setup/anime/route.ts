import axios from "axios";
import cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import AnimeModel from "@/model/anime.model";
import DiscoverModel from "@/model/discover.model";
import { connectDB } from "@/config/db";

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
  slug: string;
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

export const GET = async (req: NextRequest) => {
  await connectDB();
  try {
    const discover = await DiscoverModel.find()// Fetch only the top 10 entries for debugging
    
    const animeDetails = [];
    for (const item of discover) {
      const existingAnime = await AnimeModel.findOne({ slug: item.selfLink });
      
      const url = `https://v5.animasu.cc/anime/${item.selfLink}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);
      
      const imageUrl = $('.thumb[itemprop="image"] img').attr('data-src');
      const title = $('h1[itemprop="headline"]').text().trim();
      const malScore = $('.rating strong').text().trim();
      const rating = $('.rating strong').text().split(' ')[1]?.trim() || '';
      const characteristics = $('#tikar_shw a').map((_, element) => $(element).text().trim()).get();
      const aired = $('.spe').find('b:contains("Status")').next().text().trim();
      const year = $('.spe').find('b:contains("Rilis")').parent().text().split(': ')[1]?.trim() || '';
      const synopsis = $('.desc[itemprop="mainContentOfPage"]').find('p').first().text().trim().replace(" [Ditulis oleh Animasu Menulis Ulang]", '').replace(" [Ditulis oleh Animasu Menulis kembali]", '');
      const type = $('.spe').find('b:contains("Jenis")').parent().text().split(': ')[1]?.trim() || '';
      const alternativeTitle = $('.alter').text().trim();
      const quality = 'HD'; // Set quality to 'HD' as per instruction
      const author = $('.spe').find('b:contains("Pengarang")').next().text().trim();
      const duration = $('.spe').find('b:contains("Durasi")').parent().text().split(': ')[1]?.trim() || '';
      const lastUpdated = $('.spe').find('time[itemprop="dateModified"]').attr('datetime') || '';
      const selfLinkElement = $('.bigcover .ime a.lnk').attr('href');
      const selfLink = selfLinkElement ? selfLinkElement.replace('https://v5.animasu.cc/', '').replace('/', '') : '';
  
      const genres: Genre[] = [];
      $('.spe span:first-of-type a').each((index, element) => {
        const genreName = $(element).text().trim();
        const genreUrl = $(element).attr('href')?.replace('https://v5.animasu.cc/genre/', '').replace('/', '') || '';
        genres.push({ name: genreName, selfLink: genreUrl });
      });
  
      const animeData: AnimeData = { slug:item.selfLink, imageUrl, title, malScore, rating, characteristics, aired, year, genres, synopsis, type , alternativeTitle, quality, author, duration, selfLink, lastUpdated };
      
      try {
        if (existingAnime) {
          await AnimeModel.updateOne({ slug: item.selfLink }, animeData);
          console.log(`Updated existing anime: ${title}`);
        } else {
          await AnimeModel.create(animeData);
          console.log(`Saved new anime: ${title}`);
        }
      } catch (error) {
        console.error(`Database operation failed for anime: ${title}`, error);
      }
      
      animeDetails.push(animeData);
    }

    console.log("Anime data fetching and processing complete."); // Log that the process is complete

    const filteredAnimeDetails = animeDetails.filter(detail => detail !== null);
    return NextResponse.json(filteredAnimeDetails);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
};