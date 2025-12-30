'use client';

import React from 'react';
import { useParams } from 'next/navigation';

export default function YoutubeVideoPage() {
  const { videoId } = useParams<{ videoId: string }>();

  if (!videoId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>비디오를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <main>
      {/* Full-width video player */}
      <div className="w-full aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>

      {/* Centered container for future content like title, description, comments */}
      <div className="container mx-auto px-4 py-8">
        {/* Example of where future content would go */}
        {/* <h1 className="text-2xl font-bold">Video Title</h1> */}
        {/* <p className="mt-4 text-gray-600">Video description...</p> */}
      </div>
    </main>
  );
}
