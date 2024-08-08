"use client";
import { AnimeData } from '@/app/api/discover/route';
import React, { useState, useEffect } from 'react'
import useSWR from 'swr';
import CardListReuseble from '../reuseble/card-list-reuseble';
import axios from 'axios';
import { Skeleton } from '../ui/skeleton';
import { motion } from 'framer-motion';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Recomendation = () => {
  const [randomPage] = useState(Math.floor(Math.random() * 100) + 1);
  const {
    data,
    error,
    isLoading,
  } = useSWR(`/api/discover?page=${randomPage}`, fetcher) as {
    data: AnimeData[];
    error: any;
    isLoading: boolean;
  };

  return (
    <motion.div 
      className="container mx-auto py-8 space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-2xl font-bold text-card-foreground"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Rekomendasi Anime
      </motion.h1>
      <motion.div 
        className="grid grid-cols-6 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-[300px] rounded-lg" />
          ))
        ) : (
          data?.map((recommendation: any, index: number) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardListReuseble anime={recommendation} />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}

export default Recomendation