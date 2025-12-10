import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Calendar, Music, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { audioService, getMediaUrl } from '../../services/api';

interface AudioFile {
  id: number;
  title: string;
  audio_file: string;
  description: string;
  uploaded_date: string;
}

const AudioList = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        setLoading(true);
        const data = await audioService.getAllAudio();
        setAudioFiles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load audio files. Please try again later.');
        console.error('Error fetching audio files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAudioFiles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = (audioFile: AudioFile) => {
    const link = document.createElement('a');
    link.href = getMediaUrl(audioFile.audio_file);
    link.download = audioFile.title || 'audio-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleDescription = (audioId: number) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(audioId)) {
        newSet.delete(audioId);
      } else {
        newSet.add(audioId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-10 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center">
          <Music className="mr-3 text-blue-600" size={36} />
          Audio Library
        </h1>
        <p className="text-lg text-gray-600">
          Listen and download our collection of audio content
        </p>
      </div>

      {/* Audio Files Grid */}
      {audioFiles.length === 0 ? (
        <div className="text-center py-12">
          <Music size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No audio files available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {audioFiles.map((audio) => {
            const isDescriptionExpanded = expandedDescriptions.has(audio.id);
            
            return (
              <Card key={audio.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <CardHeader className="flex-shrink-0">
                {/* Title with Ellipsis and Tooltip */}
                  <div className="relative group">
                    <CardTitle className="flex items-center text-xl truncate">
                      <Music size={20} className="mr-2 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{audio.title}</span>
                    </CardTitle>
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50">
                      <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {audio.title}
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-4 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar size={14} className="mr-1" />
                    Uploaded {formatDate(audio.uploaded_date)}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col space-y-4">
                  {/* Description Toggle Button */}
                  {audio.description && (
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDescription(audio.id)}
                        className="flex items-center gap-2 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 w-auto"
                      >
                        <span className="text-sm">Description</span>
                        {isDescriptionExpanded ? (
                          <ChevronUp size={16} className="text-gray-500 group-hover:text-gray-700" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-700" />
                        )}
                      </Button>
                      
                      {/* Description Content */}
                      {isDescriptionExpanded && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {audio.description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Audio Player */}
                  <div className="bg-gray-50 rounded-lg p-4 flex-shrink-0">
                    <audio controls className="w-full">
                      <source src={getMediaUrl(audio.audio_file)} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  {/* Download Button */}
                  <Button
                    onClick={() => handleDownload(audio)}
                    variant="outline"
                    className="w-full group hover:bg-blue-50 hover:border-blue-300 mt-auto"
                  >
                    <Download size={16} className="mr-2 group-hover:text-blue-600" />
                    Download Audio
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AudioList;