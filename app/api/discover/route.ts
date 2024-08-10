import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import cheerio from "cheerio";
import DiscoverModel from "@/model/discover.model";

export interface AnimeData {
  title: string;
  selfLink: string;
  imageUrl: string;
  episodeCount: number;
  status: string;
}

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
  try {
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = 20;
    const skip = (page - 1) * limit;

    const discovers = await DiscoverModel.find().skip(skip).limit(limit);

    return NextResponse.json(discovers);
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