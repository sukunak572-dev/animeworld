import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Anime, Episode, SubtitleTrack, AudioTrack } from '../types';
import { useWatch } from '../context/WatchContext';
import { useAuth } from '../context/AuthContext';
import { getTranslation } from '../lib/i18n';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  FastForward,
  Rewind,
  SkipForward,
  Settings,
  Subtitles,
  Layers,
  Check,
  RotateCcw,
} from 'lucide-react';

interface VideoPlayerProps {
  anime: Anime;
  initialEpisodeId?: string;
  onEpisodeChange?: (episodeId: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  anime,
  initialEpisodeId,
  onEpisodeChange,
}) => {
  const { updateProgress, getEpisodeProgress } = useWatch();
  const { interfaceLanguage } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = (key: string) => getTranslation(interfaceLanguage, key);

  // Active episode
  const activeEpisode =
    anime.episodes.find((e) => e.id === initialEpisodeId) || anime.episodes[0];

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(activeEpisode?.duration || 1440);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('1080p');
  const [selectedAudio, setSelectedAudio] = useState<string>(() => {
    return activeEpisode?.audioTracks[0]?.id || 'ja';
  });
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>(() => {
    return activeEpisode?.subtitleTracks[0]?.id || 'sub-en';
  });

  // Settings & episode drawers
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [episodesDrawerOpen, setEpisodesDrawerOpen] = useState(false);
  const [resumedNotice, setResumedNotice] = useState<string | null>(null);

  // Load progress and restore timestamp
  useEffect(() => {
    if (!activeEpisode) return;
    const savedTime = getEpisodeProgress(anime.id, activeEpisode.id);
    if (savedTime > 10 && videoRef.current) {
      videoRef.current.currentTime = savedTime;
      setCurrentTime(savedTime);
      const minutes = Math.floor(savedTime / 60);
      const seconds = Math.floor(savedTime % 60);
      setResumedNotice(`${t('player_resume_prompt')} ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
      setTimeout(() => setResumedNotice(null), 4000);
    }
  }, [anime.id, activeEpisode?.id]);

  // Periodic progress tracking to WatchContext & Firestore
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && isPlaying && activeEpisode) {
        const cur = videoRef.current.currentTime;
        const dur = videoRef.current.duration || duration;
        updateProgress(anime, activeEpisode.id, cur, dur);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [anime, activeEpisode, isPlaying, duration]);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  // Time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || activeEpisode?.duration || 1440);
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  // Jump seconds
  const jumpSeconds = useCallback((sec: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + sec));
    }
  }, []);

  // Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  // Fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  // Skip Intro / Outro
  const handleSkipIntro = () => {
    if (videoRef.current && activeEpisode?.introEnd) {
      videoRef.current.currentTime = activeEpisode.introEnd;
    }
  };

  const handleSkipOutro = () => {
    if (videoRef.current && activeEpisode?.outroEnd) {
      videoRef.current.currentTime = activeEpisode.outroEnd;
    }
  };

  // Next episode
  const currentEpIndex = anime.episodes.findIndex((e) => e.id === activeEpisode?.id);
  const hasNextEpisode = currentEpIndex >= 0 && currentEpIndex < anime.episodes.length - 1;
  const nextEpisode = hasNextEpisode ? anime.episodes[currentEpIndex + 1] : null;

  const handleNextEpisode = () => {
    if (nextEpisode && onEpisodeChange) {
      onEpisodeChange(nextEpisode.id);
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      switch (e.key.toLowerCase()) {
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
        case 'j':
        case 'arrowleft':
          e.preventDefault();
          jumpSeconds(-10);
          break;
        case 'l':
        case 'arrowright':
          e.preventDefault();
          jumpSeconds(10);
          break;
        case 'arrowup':
          e.preventDefault();
          if (videoRef.current) {
            const nextVol = Math.min(1, volume + 0.1);
            setVolume(nextVol);
            videoRef.current.volume = nextVol;
          }
          break;
        case 'arrowdown':
          e.preventDefault();
          if (videoRef.current) {
            const nextVol = Math.max(0, volume - 0.1);
            setVolume(nextVol);
            videoRef.current.volume = nextVol;
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, toggleFullscreen, toggleMute, jumpSeconds, volume]);

  // Hide controls on idle
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Detect Intro / Outro window
  const inIntro =
    activeEpisode?.introStart !== undefined &&
    activeEpisode?.introEnd !== undefined &&
    currentTime >= activeEpisode.introStart &&
    currentTime <= activeEpisode.introEnd;

  const inOutro =
    activeEpisode?.outroStart !== undefined &&
    activeEpisode?.outroEnd !== undefined &&
    currentTime >= activeEpisode.outroStart &&
    currentTime <= activeEpisode.outroEnd;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full aspect-video bg-black overflow-hidden select-none group rounded-md shadow-2xl"
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={activeEpisode?.videoUrl}
        poster={activeEpisode?.thumbnail || anime.bannerImage}
        onTimeUpdate={handleTimeUpdate}
        onEnded={hasNextEpisode ? handleNextEpisode : undefined}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      />

      {/* Resumed Playback Notification */}
      {resumedNotice && (
        <div className="absolute top-6 left-6 z-30 bg-[#12141a]/90 backdrop-blur border border-[#d4af37]/40 text-[#d4af37] px-4 py-2 rounded text-xs font-mono shadow-xl animate-fade-in flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resumedNotice}</span>
        </div>
      )}

      {/* Skip Intro Button */}
      {inIntro && (
        <button
          onClick={handleSkipIntro}
          className="absolute bottom-24 right-6 z-30 px-5 py-2.5 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded shadow-2xl hover:bg-[#e6c46a] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>{t('player_skip_intro')}</span>
          <FastForward className="w-4 h-4" />
        </button>
      )}

      {/* Skip Outro Button */}
      {inOutro && (
        <button
          onClick={handleSkipOutro}
          className="absolute bottom-24 right-6 z-30 px-5 py-2.5 bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider rounded shadow-2xl hover:bg-[#e6c46a] transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>{t('player_skip_outro')}</span>
          <SkipForward className="w-4 h-4" />
        </button>
      )}

      {/* Center Big Play/Pause Flash (optional or idle) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
        >
          <div className="w-20 h-20 rounded-full bg-[#d4af37] text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      )}

      {/* Video Overlay Controls */}
      <div
        className={`absolute inset-0 z-20 flex flex-col justify-between pointer-events-none transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Bar: Title & Episode Info */}
        <div className="p-4 sm:p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-white pointer-events-auto">
          <div>
            <h2 className="text-sm sm:text-base font-bold tracking-wide truncate">
              {anime.title} — S{activeEpisode?.seasonNumber} E{activeEpisode?.episodeNumber}: {activeEpisode?.title}
            </h2>
            <p className="text-xs text-neutral-400 font-mono">
              Audio: {activeEpisode?.audioTracks.find((a) => a.id === selectedAudio)?.label || selectedAudio} · Subtitles: {activeEpisode?.subtitleTracks.find((s) => s.id === selectedSubtitle)?.label || 'English'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Episode Selector Drawer Trigger */}
            <button
              onClick={() => setEpisodesDrawerOpen(!episodesDrawerOpen)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded text-white flex items-center gap-1.5 backdrop-blur-sm"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('player_episode_selector')} ({activeEpisode?.episodeNumber}/{anime.episodes.length})</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar: Timeline, Scrub, Controls */}
        <div className="p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-auto flex flex-col gap-2">
          
          {/* Progress Timeline Scrubber */}
          <div className="relative w-full flex items-center group/scrub">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#d4af37] focus:outline-none"
            />
          </div>

          {/* Action buttons row */}
          <div className="flex items-center justify-between text-white pt-1">
            
            {/* Left controls: Play, 10s back, 10s forward, Volume, Time */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={togglePlay}
                className="p-1 hover:text-[#d4af37] transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
              </button>

              <button
                onClick={() => jumpSeconds(-10)}
                className="p-1 hover:text-[#d4af37] transition-colors"
                title="Rewind 10 seconds (J)"
              >
                <Rewind className="w-4 h-4" />
              </button>

              <button
                onClick={() => jumpSeconds(10)}
                className="p-1 hover:text-[#d4af37] transition-colors"
                title="Skip forward 10 seconds (L)"
              >
                <FastForward className="w-4 h-4" />
              </button>

              {hasNextEpisode && (
                <button
                  onClick={handleNextEpisode}
                  className="p-1 hover:text-[#d4af37] transition-colors"
                  title="Next Episode"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              )}

              {/* Volume Slider */}
              <div className="flex items-center gap-2 group/volume">
                <button onClick={toggleMute} className="p-1 hover:text-[#d4af37] transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-14 sm:w-20 h-1 bg-white/20 rounded appearance-none accent-[#d4af37] cursor-pointer"
                />
              </div>

              {/* Time display */}
              <div className="text-xs font-mono text-neutral-300">
                <span>{formatTime(currentTime)}</span>
                <span className="text-neutral-500"> / </span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right controls: Subtitle, Audio, Speed, Quality, Fullscreen */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Settings toggle (Audio & Subtitle selector) */}
              <div className="relative">
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className={`p-1.5 rounded hover:text-[#d4af37] transition-colors ${
                    settingsOpen ? 'text-[#d4af37]' : 'text-neutral-300'
                  }`}
                  title="Player Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {/* Settings Popup Menu */}
                {settingsOpen && (
                  <div className="absolute right-0 bottom-8 w-64 bg-[#12141a] border border-white/10 rounded-lg p-3 text-xs shadow-2xl z-40 space-y-3">
                    
                    {/* Audio track selection */}
                    <div>
                      <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-[#d4af37]" />
                        <span>{t('player_audio_tracks')}</span>
                      </p>
                      <div className="space-y-1">
                        {activeEpisode?.audioTracks.map((track) => (
                          <button
                            key={track.id}
                            onClick={() => setSelectedAudio(track.id)}
                            className={`w-full px-2 py-1 text-left rounded flex items-center justify-between ${
                              selectedAudio === track.id
                                ? 'bg-[#d4af37]/15 text-[#d4af37] font-semibold'
                                : 'text-neutral-300 hover:bg-white/5'
                            }`}
                          >
                            <span>{track.label}</span>
                            {selectedAudio === track.id && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Subtitle track selection */}
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 mb-1.5 flex items-center gap-1">
                        <Subtitles className="w-3 h-3 text-[#d4af37]" />
                        <span>{t('player_subtitles')}</span>
                      </p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        <button
                          onClick={() => setSelectedSubtitle('off')}
                          className={`w-full px-2 py-1 text-left rounded flex items-center justify-between ${
                            selectedSubtitle === 'off'
                              ? 'bg-[#d4af37]/15 text-[#d4af37] font-semibold'
                              : 'text-neutral-300 hover:bg-white/5'
                          }`}
                        >
                          <span>{t('player_subtitles_off')}</span>
                          {selectedSubtitle === 'off' && <Check className="w-3 h-3" />}
                        </button>
                        {activeEpisode?.subtitleTracks.map((track) => (
                          <button
                            key={track.id}
                            onClick={() => setSelectedSubtitle(track.id)}
                            className={`w-full px-2 py-1 text-left rounded flex items-center justify-between ${
                              selectedSubtitle === track.id
                                ? 'bg-[#d4af37]/15 text-[#d4af37] font-semibold'
                                : 'text-neutral-300 hover:bg-white/5'
                            }`}
                          >
                            <span>{track.label}</span>
                            {selectedSubtitle === track.id && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Playback Speed */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-neutral-400">{t('player_speed')}</span>
                      <select
                        value={playbackRate}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value);
                          setPlaybackRate(rate);
                          if (videoRef.current) videoRef.current.playbackRate = rate;
                        }}
                        className="bg-neutral-800 text-white rounded px-2 py-0.5 border border-white/10 text-xs focus:outline-none"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1.0x Normal</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                        <option value={2}>2.0x</option>
                      </select>
                    </div>

                    {/* Quality */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-neutral-400">{t('player_quality')}</span>
                      <select
                        value={selectedQuality}
                        onChange={(e) => setSelectedQuality(e.target.value)}
                        className="bg-neutral-800 text-white rounded px-2 py-0.5 border border-white/10 text-xs focus:outline-none"
                      >
                        <option value="1080p">1080p Ultra HD</option>
                        <option value="720p">720p HD</option>
                        <option value="480p">480p SD</option>
                        <option value="auto">Auto Stream</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-1 hover:text-[#d4af37] transition-colors"
                title="Fullscreen (F)"
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episode Selector Drawer / Slide-Over */}
      {episodesDrawerOpen && (
        <div className="absolute inset-y-0 right-0 w-80 bg-[#0e1015]/95 backdrop-blur-md border-l border-white/10 z-40 p-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              {anime.title} Episodes
            </h3>
            <button
              onClick={() => setEpisodesDrawerOpen(false)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {anime.episodes.map((ep) => {
              const isCurrent = ep.id === activeEpisode?.id;
              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    if (onEpisodeChange) onEpisodeChange(ep.id);
                    setEpisodesDrawerOpen(false);
                  }}
                  className={`p-2.5 rounded cursor-pointer transition-colors flex gap-3 ${
                    isCurrent
                      ? 'bg-[#d4af37]/20 border border-[#d4af37]/40'
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <img
                    src={ep.thumbnail || anime.bannerImage}
                    alt={ep.title}
                    className="w-16 h-10 object-cover rounded shrink-0"
                  />
                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-[11px] font-mono text-[#d4af37]">Episode {ep.episodeNumber}</span>
                    <span className="text-xs font-semibold text-white truncate">{ep.title}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">{formatTime(ep.duration)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
