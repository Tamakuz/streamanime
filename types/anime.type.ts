import mongoose from "mongoose";

export interface IAnime {
  imageUrl: string;
  slug: string;
  title: string;
  altTitle: string;
  type: string;
  duration: string;
  studio: string;
  aired: string;
  episode: string;
  author: string;
  season: string;
  rating: string;
  synopsis: string;
  genres: Array<{
    name: string;
    selfLink: string;
  }>;
  characteristics: string[];
  episodes: Array<{
    episode_number: string;
    urlSlug: string;
    streams: any[];
  }>;
};
