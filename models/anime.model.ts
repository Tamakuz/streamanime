import mongoose from "mongoose";

const animeSchema = new mongoose.Schema({
  imageUrl: String,
  slug: String,
  title: String,
  altTitle: String,
  type: String,
  duration: String,
  studio: String,
  aired: String,
  episode: String,
  author: String,
  season: String,
  rating: String,
  genres: [{
    name: String,
    selfLink: String
  }],
  characteristics: [String],
  episodes: [{
    episode_number: String,
    urlSlug: String,
    streams: [mongoose.Schema.Types.ObjectId]
  }]
});

const Anime = mongoose.models.Anime || mongoose.model("Anime", animeSchema);

export default Anime;
