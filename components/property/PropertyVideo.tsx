'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Video, ExternalLink } from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";

interface PropertyVideoProps {
  property: PropertySeedData;
}

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  type: 'youtube' | 'vimeo' | 'direct';
}

export function PropertyVideo({ property }: PropertyVideoProps) {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Données d'exemple pour les vidéos
  const videos: VideoItem[] = [
    {
      id: '1',
      title: 'Visite virtuelle complète',
      thumbnail: '/images/video-thumbnail-1.jpg',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '3:45',
      type: 'youtube'
    },
    {
      id: '2',
      title: 'Tour du quartier',
      thumbnail: '/images/video-thumbnail-2.jpg',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '2:30',
      type: 'youtube'
    },
    {
      id: '3',
      title: 'Présentation de l\'agent',
      thumbnail: '/images/video-thumbnail-3.jpg',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: '1:20',
      type: 'youtube'
    }
  ];

  const openVideoModal = (video: VideoItem) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const getEmbedUrl = (url: string, type: string) => {
    if (type === 'youtube') {
      // Convertir l'URL YouTube en URL d'embed si nécessaire
      if (url.includes('watch?v=')) {
        const videoId = url.split('watch?v=')[1].split('&')[0];
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      return url + (url.includes('?') ? '&autoplay=1' : '?autoplay=1');
    }
    return url;
  };

  if (videos.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            Vidéos de la propriété
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Aucune vidéo disponible pour cette propriété</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            Vidéos de la propriété
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video.id} className="relative group cursor-pointer" onClick={() => openVideoModal(video)}>
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {/* Thumbnail placeholder */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <Video className="h-12 w-12 text-blue-400" />
                  </div>
                  
                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-white bg-opacity-90 rounded-full p-3">
                      <Play className="h-6 w-6 text-blue-600 fill-current" />
                    </div>
                  </div>
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                
                <div className="mt-2">
                  <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">À propos des vidéos</h4>
            <p className="text-sm text-blue-800">
              Découvrez cette propriété sous tous les angles grâce à nos vidéos haute qualité. 
              Visitez virtuellement chaque pièce et explorez le quartier environnant.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Modal pour la vidéo */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(selectedVideo.url, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Ouvrir
                </Button>
                <Button variant="outline" size="sm" onClick={closeModal}>
                  ✕
                </Button>
              </div>
            </div>
            <div className="aspect-video">
              <iframe
                src={getEmbedUrl(selectedVideo.url, selectedVideo.type)}
                title={selectedVideo.title}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PropertyVideo;