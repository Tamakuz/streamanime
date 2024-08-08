"use client"
import React, { useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { AnimeData } from '@/app/api/discover/route'
import CardListReuseble from '@/components/reuseble/card-list-reuseble'
import { useInView } from 'react-intersection-observer';

const AnimeList = () => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const [page, setPage] = useState(1);
  const [anime, setAnime] = useState<AnimeData[]>([]);
  const { ref, inView } = useInView();

  const { error, isLoading } = useSWR(`/api/discover?page=${page}`, fetcher, {
    onSuccess: (data) => {
      setAnime((prevAnime) => [...prevAnime, ...data]);
    }
  }) as {
    error: any;
    isLoading: boolean;
  };

  React.useEffect(() => {
    if (inView && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, isLoading]);

  if (anime.length === 0) return (
    <div className="col-span-9 grid grid-cols-5 gap-5">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="bg-gray-100 dark:bg-gray-800 rounded-lg w-full h-[350px] animate-pulse"
        ></div>
      ))}
    </div>
  );;

  return (
    <div className="col-span-9 grid grid-cols-5 gap-5">
      {anime.map((anime, index) => (
        <CardListReuseble key={index} anime={anime} />
      ))}
      <div ref={ref} className="col-span-4 flex justify-center items-center">
        {isLoading && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-gray-300 dark:border-gray-600"></div>
        )}
      </div>
    </div>
  );
}

export default AnimeList