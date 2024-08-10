import { Schema, model, models, Document } from 'mongoose';

interface IGenre {
  name: string;
  selfLink: string;
}

interface IAnime extends Document {
  slug: string;
  imageUrl?: string;
  title: string;
  malScore?: string;
  rating?: string;
  characteristics?: string[];
  aired?: string;
  year?: string;
  genres?: IGenre[];
  synopsis?: string;
  type?: string;
  alternativeTitle?: string;
  quality?: string;
  author?: string;
  duration?: string;
  selfLink?: string;
  lastUpdated?: string;
}

const animeSchema = new Schema<IAnime>({
  slug: { type: String, required: true },
  imageUrl: { type: String },
  title: { type: String, required: true },
  malScore: { type: String },
  rating: { type: String },
  characteristics: [{ type: String }],
  aired: { type: String },
  year: { type: String },
  genres: [{
    name: { type: String },
    selfLink: { type: String }
  }],
  synopsis: { type: String },
  type: { type: String },
  alternativeTitle: { type: String },
  quality: { type: String },
  author: { type: String },
  duration: { type: String },
  selfLink: { type: String },
  lastUpdated: { type: String }
}, { timestamps: true });

const Anime = models.Anime || model<IAnime>('Anime', animeSchema);

export default Anime;
export type { IAnime, IGenre };
