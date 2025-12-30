'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTrendingJpop } from '../hooks/useTrendingJpop';

export const TrendingJpopSection = () => {
  const { data: videos, isLoading, isError } = useTrendingJpop();

  if (isLoading) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-4">오늘의 J-POP</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="w-full h-32 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded mt-2"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold mb-4">오늘의 J-POP</h2>
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
      </section>
    );
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">오늘의 J-POP</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {videos?.map((video) => (
          <Link
            href={`/jpop-today/${video.videoId}`}
            key={video.videoId}
            className="group"
          >
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={video.thumbnailUrl}
                alt={video.title}
                width={120}
                height={90}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            </div>
            <h3 className="mt-2 text-sm font-semibold truncate group-hover:text-sky-500">
              {video.title}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
};
