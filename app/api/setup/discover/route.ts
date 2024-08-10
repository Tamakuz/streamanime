import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";
import { connectDB } from "@/config/db";
import DiscoverModel from "@/model/discover.model";

export interface AnimeData {
  title: string;
  selfLink: string;
  imageUrl: string;
  episodeCount: number;
  status: string;
}

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  await connectDB();
  let page = parseInt(req.nextUrl.searchParams.get("page") || "1");

  console.log("Starting data fetch process...");

  while (true) {
    console.log(`Fetching data for page: ${page}`);
    try {
      const url = `https://v5.animasu.cc/pencarian/?urutan=populer&halaman=${page}`;
      const response = await axios.get(url);
      const $ = cheerio.load(response.data);

      const noResultsCheck = $('.listupd.listupd_custompage blockquote b').text();
      if (noResultsCheck.includes("Pencarian anime dengan kriteria yang Anda inginkan tidak ada! Coba kriteria lainnya.")) {
        console.log("No more results found, ending fetch process.");
        break;
      }

      $('.bsx').each((_, element) => {
        const title = $(element).find('.tt').text().trim() || '';
        const link = $(element).find('a').attr('href') || '';
        const selfLink = link.replace('https://v5.animasu.cc/anime/', '').replace('/', '');
        const imageUrl = $(element).find('img.lazy').attr('data-src') || '';
        const episodeCount = parseInt($(element).find('.epx').text().replace('Episode', '').trim()) || 0;
        const status = $(element).find('.sb').text().trim() || 'Unknown';

        DiscoverModel.findOneAndUpdate({ title }, { selfLink, imageUrl, episodeCount, status }, { new: true, upsert: true }).then(doc => {
          console.table({
            Action: doc ? 'Update' : 'Add',
            Title: title,
            SelfLink: selfLink,
            ImageUrl: imageUrl,
            EpisodeCount: episodeCount,
            Status: status
          });
        });
      });

      console.log(`Data processed for page ${page}`);
      page++;
    } catch (error) {
      console.error(`Error on page ${page}: ${error}`);
      return NextResponse.json({ error: "Failed to fetch data from the server" }, { status: 500 });
    }
  }

  console.log("Data fetch process completed.");
  return NextResponse.json({ message: "Data fetch and update process completed successfully." });
};