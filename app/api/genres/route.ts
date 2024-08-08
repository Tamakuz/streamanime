import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";

export interface Genre {
  label: string;
  selfLink: string;
}

export const GET = async (req: NextRequest) => {
  try {
    const url = "https://riie.stream";
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const genres: Genre[] = [];
    $("ul.genre li a").each((index, element) => {
      const label = $(element).text();
      // Check if the label contains a year and skip it if it does
      if (!/\d{4}/.test(label)) {
        const selfLink = label.toLowerCase().replace(/ /g, "-");
        genres.push({ label, selfLink });
      }
    });

    return NextResponse.json(genres);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch genres" }, { status: 500 });
  }
};