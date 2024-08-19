import { connectDB } from "@/config/dbconection";
import Anime from "@/models/anime.model";
import Stream from "@/models/stream.model";

export const GET = async (req: Request, { params }: { params: { slug: string } }) => {
  await connectDB();
  try {
    const slug = params.slug;
    console.log(slug);
    const anime = await Anime.findOne({ $or: [{ slug: `${slug}/` }, { title: slug }] })
      .select("-_id -__v")
      .populate({
        path: 'episodes.streams',
        model: Stream
      }).select("-_id -__v");

    if (!anime) {
      return new Response(JSON.stringify({ error: "Anime not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(anime), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Anime not found" }), { status: 404 });
  }
};