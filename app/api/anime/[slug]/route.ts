import { NextRequest, NextResponse } from "next/server";
import AnimeModel from "@/model/anime.model";

export const dynamic = "force-dynamic";


export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const slug = params.slug;
  try {
    const anime = await AnimeModel.findOne({ slug });
    return NextResponse.json(anime);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
};