"use client";
import Recomendation from "@/components/anime/recomendation";
import NavbarReuseble from "@/components/reuseble/navbar-reuseble";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IAnime } from "@/types/anime.type";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Episode = ({ params }: { params: { slug: string[] } }) => {
  const [title, slug] = params.slug.map(decodeURIComponent);
  
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [loadingIframe, setLoadingIframe] = useState<boolean>(false);
  
  const { data, error, isLoading } = useSWR(`/api/anime/${title}`, fetcher) as {
    data: IAnime;
    isLoading: boolean;
    error: any;
  };
  
  const RecomendationMemo = useMemo(() => React.memo(Recomendation), []);
  
  const findFirstUrlSet = useMemo(() => {
    return data?.episodes.find(
      (episode) => episode.urlSlug === slug || episode.urlSlug === `${slug}/`
    );
  }, [data, slug]);
  
  useEffect(() => {
    setStreamUrl(findFirstUrlSet?.streams[0].streamUrl);
  }, [findFirstUrlSet]);
  
  const handleSetStreamUrl = (url: string) => {
    setStreamUrl("");
    setLoadingIframe(true);
    setStreamUrl(url);
  };

  const handleIframeLoad = () => {
    setLoadingIframe(false);
  };

  if (isLoading)
    return (
      <main className=" text-foreground">
        <NavbarReuseble />
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-3">
            <div className="md:col-span-8">
              <Skeleton className="aspect-video bg-muted" />
            </div>
            <Skeleton className="md:col-span-2 h-full w-full bg-muted" />
          </div>
        </div>
      </main>
    );

  return (
    <main className=" text-foreground">
      <NavbarReuseble />
      <div className="container mx-auto px-4 py-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-3">
          <div className="lg:col-span-8">
            <div className="aspect-video rounded-lg overflow-hidden shadow-lg relative">
              {loadingIframe && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                  <div className="loader"></div>
                </div>
              )}
              <iframe
                src={streamUrl}
                className="w-full h-full"
                allowFullScreen
                onLoad={handleIframeLoad}
              />
            </div>
          </div>
          <div className="lg:col-span-2">
            <div
              className="flex flex-wrap gap-2 overflow-auto"
              style={{ maxHeight: "calc(100vh - 8rem)" }}
            >
              {data?.episodes.map((episode, index) => (
                <Link
                  key={index}
                  href={`/episode/${encodeURIComponent(
                    title
                  )}/${encodeURIComponent(episode.urlSlug)}`}
                  className={cn(
                    "p-2 rounded-md flex items-center justify-center cursor-pointer relative shadow-md transition-transform transform hover:scale-105",
                    episode.urlSlug === slug || episode.urlSlug === `${slug}/`
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                  style={{ width: "50px", height: "50px" }}
                >
                  <span>{episode.episode_number}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-wrap gap-2">
            {findFirstUrlSet?.streams.map((source, index) => (
              <button
                onClick={() => handleSetStreamUrl(source.streamUrl)}
                key={index}
                className={cn(
                  "bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105",
                  streamUrl === source.streamUrl ? "ring-2 ring-primary" : ""
                )}
              >
                Server {index + 1} ({source.resolution})
              </button>
            ))}
          </div>
          <div>
            <RecomendationMemo />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Episode;
