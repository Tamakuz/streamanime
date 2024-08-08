"use client";

import React from "react";
import useSWR from "swr";
import axios from "axios";
import NavbarReuseble from "@/components/reuseble/navbar-reuseble";
import HeroSection from "@/components/anime/hero";
import { AnimeData } from "@/app/api/anime/[slug]/route";
import Recomendation from "@/components/anime/recomendation";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Anime = ({ params }: { params: { slug: string } }) => {
  const { data, error, isLoading } = useSWR(
    `/api/anime/${params.slug}`,
    fetcher
  ) as { data: AnimeData; isLoading: boolean; error: any };

  return (
    <main>
      <NavbarReuseble />
      <HeroSection
        imageUrl={data?.imageUrl || ""}
        title={data?.title}
        year={data?.aired?.split(" ")[2]}
        quality={data?.quality}
        genres={data?.genres}
        synopsis={data?.synopsis}
        type={data?.type}
        releaseDate={data?.aired}
        isLoading={isLoading}
        selfLink={data?.selfLink}
      />
      {/* <Recomendation /> */}
    </main>
  );
};

export default Anime;
