import { Schema, model, models } from 'mongoose';

interface IStreamSource {
  src: string;
  resolution: string;
  serverName: string;
}

interface IEpisodeData {
  episodeNumber: string;
  episodeSelfLink: string;
  episodeTitle: string;
  streamSources: IStreamSource[];
}

interface IAnimeEpisodes {
  slug: string;
  episodes: IEpisodeData[];
}

const streamSourceSchema = new Schema<IStreamSource>({
  src: { type: String, required: true },
  resolution: { type: String, required: true },
  serverName: { type: String, required: true }
});

const episodeDataSchema = new Schema<IEpisodeData>({
  episodeNumber: { type: String, required: true },
  episodeSelfLink: { type: String, required: true },
  episodeTitle: { type: String, required: true },
  streamSources: [streamSourceSchema]
});

const animeEpisodesSchema = new Schema<IAnimeEpisodes>({
  slug: { type: String, required: true },
  episodes: [episodeDataSchema]
}, { timestamps: true });

const EpisodeModel = models.Episode || model('Episode', animeEpisodesSchema);

export default EpisodeModel;
export type { IStreamSource, IEpisodeData, IAnimeEpisodes };
