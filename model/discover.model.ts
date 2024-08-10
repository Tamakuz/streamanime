import { AnimeData } from '@/app/api/discover/route';
import { model, Schema, Document, models } from 'mongoose';

interface AnimeDataDocument extends AnimeData, Document {}

const animeDataSchema = new Schema<AnimeDataDocument>({
  title: { type: String },
  selfLink: { type: String },
  imageUrl: { type: String },
  episodeCount: { type: Number},
  status: { type: String }
}, { timestamps: true });

const AnimeModel = models.Discover || model<AnimeDataDocument>('Discover', animeDataSchema);

export default AnimeModel;
