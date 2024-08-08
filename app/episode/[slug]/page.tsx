"use client";

import { EpisodeData } from "@/app/api/episode/[slug]/route";
import NavbarReuseble from "@/components/reuseble/navbar-reuseble";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import Link from "next/link";
import React from "react";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Episode = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { data, error, isLoading } = useSWR(
    `/api/episode/${params.slug}`,
    fetcher
  ) as { data: EpisodeData; isLoading: boolean; error: any };

  if (isLoading)
    return (
      <main>
        <NavbarReuseble />
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-10 gap-3">
            <div className="col-span-8">
              <Skeleton className="aspect-video" />
            </div>
            <Skeleton className="col-span-2 h-full w-full" />
          </div>
        </div>
      </main>
    );

  return (
    <main>
      <NavbarReuseble />
      {/* <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-10 gap-3">
          <div className="col-span-8">
            <div className="aspect-video">
              <iframe
                src={data?.streams[0]?.href}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
          <div className="col-span-2">
            <div className="grid grid-cols-4 gap-2">
              {data?.episodes.map((episode, index) => (
                <Link
                  key={index}
                  href={`/episode/${episode.selfLink}`}
                  className="bg-primary p-2 rounded-md flex items-center justify-center text-secondary cursor-pointer"
                >
                  {episode.episodeNumber}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div> */}
    </main>
  );
};

export default Episode;
