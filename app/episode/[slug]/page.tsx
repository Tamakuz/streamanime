"use client";
import Recomendation from "@/components/anime/recomendation";
import NavbarReuseble from "@/components/reuseble/navbar-reuseble";
import { Skeleton } from "@/components/ui/skeleton";
import { IAnimeEpisodes } from "@/model/episode.model";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Episode = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  
  const [streamUrl, setStreamUrl] = useState<string>("");
  const [loadingIframe, setLoadingIframe] = useState<boolean>(false);
  
  const { data, error, isLoading } = useSWR(
    `/api/episode/${slug}`,
    fetcher
  ) as { data: IAnimeEpisodes; isLoading: boolean; error: any };
  
  const RecomendationMemo = React.memo(Recomendation);
  
  const findFirstUrlSet = data?.episodes.find(
    (episode) => episode.episodeSelfLink === slug
  );
  useEffect(() => {
    if (data) {
      setStreamUrl(findFirstUrlSet?.streamSources[0].src!);
    }
  }, [data]);
  
  // console.log({ streamUrl, slug, findFirstUrlSet, data });
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
      <main>
        <NavbarReuseble />
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-10 gap-3">
            <div className="md:col-span-8">
              <Skeleton className="aspect-video" />
            </div>
            <Skeleton className="md:col-span-2 h-full w-full" />
          </div>
        </div>
      </main>
    );

  return (
    <main>
      <NavbarReuseble />
      <div className="container mx-auto px-4 py-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-3">
          <div className="lg:col-span-8">
            <div className="aspect-video relative">
              {loadingIframe && (
                <Skeleton className="absolute inset-0 aspect-video" />
              )}
              <iframe
                src={streamUrl}
                className="w-full h-full"
                allowFullScreen
                onLoad={handleIframeLoad}
              />
            </div>
          </div>
          <div className="lg:col-span-2 overflow-y-auto">
            <div className="flex flex-col gap-2 h-[500px]">
              {data?.episodes.map((episode, index) => (
                <Link
                  href={`/episode/${episode.episodeSelfLink}`}
                  className="bg-primary p-2 rounded-md flex items-center justify-center text-secondary cursor-pointer relative"
                >
                  <span>{episode.episodeTitle}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-3">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-2">
              {findFirstUrlSet?.streamSources.map((source, index) => (
                <button
                  onClick={() => handleSetStreamUrl(source.src)}
                  key={index}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {source.serverName}
                </button>
              ))}
            </div>
            <div>
              <RecomendationMemo />
            </div>
          </div>
          <div className="lg:col-span-3">list genre</div>
        </div>
      </div>
    </main>
  );
};

export default Episode;
