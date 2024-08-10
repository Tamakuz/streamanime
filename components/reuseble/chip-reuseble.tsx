"use client";
import React from "react";
import useSWR from "swr";
import axios from "axios";
import { Badge } from "../ui/badge";
import { IGenre } from "@/model/anime.model";

const ChipReuseble = () => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);

  const { data: genres, isLoading } = useSWR("/api/genres", fetcher) as {
    data: IGenre[];
    isLoading: boolean;
  };

  if (isLoading) return (
    <div className="flex flex-wrap gap-2 sticky top-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <Badge key={index} variant="secondary" className="w-full animate-pulse">
          &nbsp;
        </Badge>
      ))}
    </div>
  );

  return (
    <div className="flex flex-wrap gap-2 sticky top-5">
      {genres.map((genre, index) => (
        <Badge variant={"secondary"} className="cursor-pointer" key={index}>
          {genre.name}
        </Badge>
      ))}
    </div>
  );
};

export default ChipReuseble;
