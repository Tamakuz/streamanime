"use client";

import React from "react";
import Image from "next/image";
import { Dot, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { IGenre } from "@/model/anime.model";

interface HeroSectionProps {
  imageUrl: string;
  title: string;
  year: string;
  quality: string;
  genres: any;
  synopsis: string;
  type: string;
  releaseDate: string;
  isLoading: boolean;
  selfLink?: string;
}

const HeroSection = ({
  imageUrl,
  title,
  year,
  quality,
  genres,
  synopsis,
  type,
  releaseDate,
  isLoading,
  selfLink,
}: HeroSectionProps) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <motion.div
      className="relative w-full h-fit bg-cover bg-center"
      style={{
        backgroundImage: `url(${imageUrl})`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="mx-auto w-full h-full bg-black bg-opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto py-8 grid grid-cols-10 gap-5">
          <motion.div
            className="col-span-2"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Image
              src={imageUrl}
              alt="anime"
              width={200}
              height={100}
              className="w-full object-cover rounded-md"
            />
          </motion.div>
          <motion.div
            className="col-span-8 p-5 space-y-1"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <h1 className="text-5xl font-bold text-card-foreground">
                {title}{" "}
                <span className="text-[30px] text-muted-foreground">
                  ({year})
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-2 rounded-md border border-muted-foreground">
                HD
              </div>
              {genres?.map((genre: IGenre, index: number) => (
                <span key={index}>
                  {genre.name}
                  {index < genres.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-5 py-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={`/episode/${selfLink}`}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-md"
                >
                  <Play className="w-5 h-5" />
                  Tonton Sekarang
                </Link>
              </motion.button>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                {type} <Dot /> {releaseDate}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary mb-3">Sinopsis</h1>
              <p className="text-card-foreground leading-relaxed">{synopsis}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
