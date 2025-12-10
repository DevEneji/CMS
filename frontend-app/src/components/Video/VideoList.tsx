import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calendar, 
  Video, 
  AlertCircle, 
  Play, 
  Pause, 
  Volume2, 
  Volume1, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  PictureInPicture,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { videoService, getMediaUrl } from '../../services/api';

interface VideoFile {
  id: number;
  title: string;
  video_file: string;
  description: string;
  uploaded_date: string;
  thumbnail?: string;
}

// Enhanced Custom Video Player Component
const CustomVideoPlayer = ({ video }: { video: VideoFile }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout>();

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      resetControlsTimer();
    }
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleLoadedData = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0.1;
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.currentTime = 0.1;
      setIsLoading(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * duration;
      setCurrentTime(videoRef.current.currentTime);
      resetControlsTimer();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
    resetControlsTimer();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume || 0.5;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
      resetControlsTimer();
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
    resetControlsTimer();
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSpeedMenu(false);
      resetControlsTimer();
    }
  };

  const togglePictureInPicture = async () => {
    if (!videoRef.current) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
      resetControlsTimer();
    } catch (error) {
      console.error('Picture-in-Picture failed:', error);
    }
  };

  // Auto-hide controls functionality
  const resetControlsTimer = () => {
    if (controlsTimeout) clearTimeout(controlsTimeout);
    setShowControls(true);
    
    if (isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setControlsTimeout(timer);
    }
  };

  const handleMouseMove = () => {
    resetControlsTimer();
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          videoRef.current.currentTime -= 10;
          break;
        case 'ArrowRight':
          e.preventDefault();
          videoRef.current.currentTime += 10;
          break;
        case 'c':
          e.preventDefault();
          setShowControls(!showControls);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [showControls]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  return (
    <div 
      className="bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 relative group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        if (isPlaying) {
          resetControlsTimer();
        }
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-48 object-cover cursor-pointer"
        preload="metadata"
        onClick={handleVideoClick}
        onLoadedData={handleLoadedData}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onLoadStart={() => setIsLoading(true)}
        onCanPlay={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      >
        <source src={getMediaUrl(video.video_file)} type="video/mp4" />
        <source src={getMediaUrl(video.video_file)} type="video/webm" />
        <source src={getMediaUrl(video.video_file)} type="video/ogg" />
        Your browser does not support the video element.
      </video>

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <AlertCircle size={32} className="mx-auto mb-2" />
            <p className="text-sm">Failed to load video</p>
          </div>
        </div>
      )}

      {/* Enhanced Controls Overlay */}
      {(showControls || !isPlaying) && !isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-between p-3">
          {/* Top Bar - Time and Controls */}
          <div className="flex justify-between items-center text-white text-sm">
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            <div className="flex gap-2">
              {/* Playback Speed */}
              <div className="relative">
                <button 
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                >
                  {playbackRate}x
                </button>
                
                {showSpeedMenu && (
                  <div className="absolute bottom-8 -left-2 bg-black/90 rounded p-2 space-y-1 min-w-16 z-10">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`block w-full text-left px-2 py-1 rounded hover:bg-white/20 text-sm ${
                          playbackRate === rate ? 'bg-white/30' : ''
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Picture-in-Picture */}
              <button 
                onClick={togglePictureInPicture}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                <PictureInPicture size={16} />
              </button>

              {/* Fullscreen */}
              <button 
                onClick={toggleFullscreen}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>
          </div>

          {/* Center Play Button */}
          <div className="flex justify-center items-center flex-1">
            <button
              onClick={togglePlay}
              className="bg-white/90 rounded-full p-3 hover:bg-white transition-all hover:scale-110"
            >
              {isPlaying ? (
                <Pause size={24} className="text-gray-700" />
              ) : (
                <Play size={24} className="text-gray-700 ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Bar - Progress and Controls */}
          <div className="space-y-2">
            {/* Progress Bar */}
            <div 
              className="w-full bg-white/30 rounded-full h-1.5 cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="bg-white h-1.5 rounded-full transition-all"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            
            {/* Bottom Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button 
                  onClick={togglePlay} 
                  className="text-white hover:opacity-70 transition-opacity"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>

                {/* Volume Control */}
                <div className="relative flex items-center gap-2">
                  <button 
                    onClick={toggleMute}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    className="text-white hover:opacity-70 transition-opacity"
                  >
                    {isMuted ? <VolumeX size={18} /> : 
                     volume > 0.5 ? <Volume2 size={18} /> : 
                     <Volume1 size={18} />}
                  </button>
                  
                  {showVolumeSlider && (
                    <div 
                      className="absolute bottom-8 left-0 bg-black/90 rounded p-2"
                      onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 accent-white cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Time Display */}
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {/* Right side controls */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={togglePictureInPicture}
                  className="text-white opacity-70 hover:opacity-100 transition-opacity"
                >
                  <PictureInPicture size={16} />
                </button>
                <button 
                  onClick={toggleFullscreen}
                  className="text-white opacity-70 hover:opacity-100 transition-opacity"
                >
                  {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Always show play button when paused and controls hidden */}
      {!isPlaying && !showControls && !isLoading && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/80 rounded-full p-3">
            <Play size={24} className="text-gray-700 ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};

// Main VideoList Component
const VideoList = () => {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchVideoFiles = async () => {
      try {
        setLoading(true);
        const data = await videoService.getAllVideos();
        setVideoFiles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load video files. Please try again later.');
        console.error('Error fetching video files:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoFiles();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = (videoFile: VideoFile) => {
    const link = document.createElement('a');
    link.href = getMediaUrl(videoFile.video_file);
    link.download = videoFile.title || 'video-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleDescription = (videoId: number) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
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
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden flex flex-col h-full">
              <CardHeader className="flex-shrink-0">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col">
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-48 w-full mb-4 flex-shrink-0" />
                <Skeleton className="h-10 w-full mt-auto" />
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
          <Video className="mr-3 text-blue-600" size={36} />
          Video Library
        </h1>
        <p className="text-lg text-gray-600">
          Watch and download our collection of video content
        </p>
      </div>

      {/* Video Files Grid */}
      {videoFiles.length === 0 ? (
        <div className="text-center py-12">
          <Video size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-lg">No video files available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {videoFiles.map((video) => {
            const isDescriptionExpanded = expandedDescriptions.has(video.id);
            
            return (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <CardHeader className="flex-shrink-0">
                {/* Title with Ellipsis and Tooltip */}
                  <div className="relative group">
                    <CardTitle className="flex items-center text-xl truncate">
                      <Video size={20} className="mr-2 text-blue-600 flex-shrink-0" />
                      <span className="truncate">{video.title}</span>
                    </CardTitle>
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50">
                      <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {video.title}
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-4 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar size={14} className="mr-1" />
                    Uploaded {formatDate(video.uploaded_date)}
                  </div>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col space-y-4">
                  {/* Description Toggle Button */}
                  {video.description && (
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDescription(video.id)}
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
                            {video.description}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Use Enhanced Custom Video Player */}
                  <CustomVideoPlayer video={video} />

                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VideoList;