  import { NextRequest, NextResponse } from "next/server";
  import EpisodeModel from "@/model/episode.model";

  export const dynamic = "force-dynamic";

  export const GET = async (
    req: NextRequest,
    { params }: { params: { slug: string } }
  ): Promise<NextResponse<any>> => {
    const episodeSelfLink = params.slug;

    try {
      const episode = await EpisodeModel.findOne({ "episodes.episodeSelfLink": episodeSelfLink });
      if (!episode) {
        return NextResponse.json({ error: "Episode not found" }, { status: 404 });
      }
      const specificEpisode = episode.episodes.find((ep: any) => ep.episodeSelfLink === episodeSelfLink);
      return NextResponse.json(episode);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
  };
