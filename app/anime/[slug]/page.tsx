"use client";

import React from "react";
import useSWR from "swr";
import axios from "axios";
import NavbarReuseble from "@/components/reuseble/navbar-reuseble";
import HeroSection from "@/components/anime/hero";
import Recomendation from "@/components/anime/recomendation";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Anime = ({ params }: { params: { slug: string } }) => {
  const { data, error, isLoading } = useSWR(
    `/api/anime/${params.slug}`,
    fetcher
  ) as { data: any; isLoading: boolean; error: any };

  return (
    <main>
      <NavbarReuseble />
      <HeroSection
        imageUrl={data?.imageUrl || ""}
        title={data?.title}
        year={data?.aired?.split(" ")[2]!}
        genres={data?.genres!}
        author={data?.author}
        synopsis={data?.synopsis || ""}
        type={data?.type || ""}
        releaseDate={data?.aired || ""}
        isLoading={isLoading}
        selfLink={data?.episodes[0].urlSlug}
      />
      <div className="container mx-auto">
        <Recomendation />
      </div>
    </main>
  );
};

export default Anime;
