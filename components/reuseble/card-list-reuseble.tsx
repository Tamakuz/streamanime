import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AnimeData } from "@/app/api/discover/route";
import Link from "next/link";
import { Dot, Play } from "lucide-react";
import { Badge } from "../ui/badge";

interface CardListReusebleProps {
  anime: AnimeData;
}

const CardListReuseble: React.FC<CardListReusebleProps> = ({ anime }) => {
  return (
    <motion.div 
      className="relative border group rounded-md bg-card w-full overflow-hidden shadow-lg group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        <Image
          src={anime.imageUrl || ""}
          alt={anime.title || ""}
          width={200}
          height={250}
          className="object-cover w-full h-[250px]"
        />
        <motion.div 
          className="absolute bottom-2 right-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {anime.rating}
        </motion.div>
        <motion.div 
          className="absolute bottom-2 left-2 z-10 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {anime.episodeCount}
        </motion.div>
        <motion.div 
          className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-card to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        ></motion.div>
      </div>
      <Link href={`/anime/${anime.selfLink}`} className="h-[80px] text-card-foreground shadow-sm p-2 flex flex-col justify-between">
        <motion.h3 
          className="text-sm font-medium line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {anime.title}
        </motion.h3>
        <motion.div 
          className="text-xs flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-muted-foreground">Sub Indo</span>
          <span className="text-muted-foreground">
            <Dot />
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CardListReuseble;
