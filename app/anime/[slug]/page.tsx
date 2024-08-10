"use client";

import React from "react";
import useSWR from "swr";
import axios from "axios";
import NavbarReuseble from "@/components/reuseble/navbar-reuseble";
import HeroSection from "@/components/anime/hero";
import Recomendation from "@/components/anime/recomendation";
import { IAnime } from "@/model/anime.model";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Anime = ({ params }: { params: { slug: string } }) => {
  const { data, error, isLoading } = useSWR(
    `/api/anime/${params.slug}`,
    fetcher
  ) as { data: IAnime; isLoading: boolean; error: any };

  const RecomendationMemo = React.memo(Recomendation);
  const HeroSectionMemo = React.memo(HeroSection);

  return (
    <main>
      <NavbarReuseble />
      <HeroSectionMemo
        imageUrl={data?.imageUrl || ""}
        title={data?.title}
        year={data?.year?.split(" ")[2]!}
        quality={data?.quality!}
        genres={data?.genres}
        synopsis={data?.synopsis || ""}
        type={data?.type || ""}
        releaseDate={data?.aired || ""}
        isLoading={isLoading}
        selfLink={data?.selfLink}
      />
      <div className="container mx-auto">
        <RecomendationMemo />
      </div>
    </main>
  );
};

export default Anime;
