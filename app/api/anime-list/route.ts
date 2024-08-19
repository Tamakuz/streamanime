import { NextRequest, NextResponse } from "next/server";
import Anime from "@/models/anime.model";
import Stream from "@/models/stream.model";
import { connectDB } from "@/config/dbconection";

export const GET = async (req: NextRequest) => {
  await connectDB();
  const page = parseInt(req.nextUrl.searchParams.get('page') || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || "20", 20);
  const skip = (page - 1) * limit;

  try {
    const animes = await Anime.find()
      .skip(skip)
      .limit(limit)
      // .populate({
      //   path: 'episodes.streams',
      //   model: Stream
      // });
    const total = await Anime.countDocuments();
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({ animes, totalPages, currentPage: page });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch animes" }, { status: 500 });
  }
};