import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Share2,
  Sparkles
} from 'lucide-react';
import { CallSession, User } from '../../types';
import {
  startRingtone,
  stopRingtone,
  playConnectedSound,
  playCallEndSound
} from '../../utils/soundEffects';

interface CallModalProps {
  session: CallSession;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  currentUser: User;
}

export const CallModal: React.FC<CallModalProps> = ({
  session,
  onEndCall,
  onToggleMute,
  onToggleVideo,
  currentUser
}) => {
  const [callDuration, setCallDuration] = useState(session.duration || 0);
  const [isConnected, setIsConnected] = useState(session.status === 'connected');
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);

  // Handle Ringtone and Simulated Connect
  useEffect(() => {
    if (session.status === 'outgoing_ringing') {
      startRingtone();
      // Auto-connect after 3.5 seconds to simulate friend answering
      const connectTimeout = window.setTimeout(() => {
        stopRingtone();
        playConnectedSound();
        setIsConnected(true);
      }, 3500);

      return () => {
        stopRingtone();
        clearTimeout(connectTimeout);
      };
    } else if (session.status === 'connected') {
      setIsConnected(true);
    }
  }, [session.status]);

  // Request actual camera stream if in video mode
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (session.type === 'video' && !session.isVideoOff) {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((s) => {
            stream = s;
            setLocalStream(s);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = s;
            }
          })
          .catch(() => {
            setCameraError(true);
          });
      }
    } else {
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
        setLocalStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [session.type, session.isVideoOff]);

  // Duration timer when connected
  useEffect(() => {
    if (isConnected) {
      timerRef.current = window.setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isConnected]);

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEnd = () => {
    stopRingtone();
    playCallEndSound();
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
    }
    onEndCall();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 transition-all duration-200 select-none ${
        isFullscreen ? 'p-0' : 'p-4'
      }`}
    >
      <div
        className={`bg-neutral-900 border border-neutral-800 text-white rounded-3xl overflow-hidden shadow-2xl relative flex flex-col justify-between transition-all ${
          isFullscreen
            ? 'w-full h-full rounded-none border-none'
            : 'w-full max-w-2xl h-[560px] md:h-[620px]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              webop {session.type === 'video' ? 'Video Call' : 'Voice Call'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main View Area */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-neutral-950">
          {session.type === 'video' ? (
            /* VIDEO CALL LAYOUT */
            <div className="w-full h-full relative flex items-center justify-center">
              {/* Remote Participant Video Feed */}
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                <img
                  src={session.participant.avatar}
                  alt={session.participant.name}
                  className="w-full h-full object-cover blur-2xl opacity-30 scale-125 absolute inset-0"
                />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={session.participant.avatar}
                      alt={session.participant.name}
                      referrerPolicy="no-referrer"
                      className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover ring-4 ring-white/20 shadow-2xl shadow-black"
                    />
                    {isConnected && (
                      <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-neutral-900 flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-bold tracking-tight text-white">
                    {session.participant.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono mt-1">
                    {isConnected ? formatDuration(callDuration) : 'Connecting HD video...'}
                  </p>
                </div>

                {/* Subtle Voice Waveform for Friend */}
                {isConnected && (
                  <div className="absolute bottom-24 flex items-center gap-1">
                    {[12, 24, 38, 18, 45, 20, 32, 16, 28].map((h, i) => (
                      <div
                        key={i}
                        className="w-1 bg-emerald-400/80 rounded-full animate-pulse"
                        style={{
                          height: `${h}px`,
                          animationDelay: `${i * 120}ms`,
                          animationDuration: '800ms'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* PiP Local User Camera Feed */}
              <div className="absolute top-16 right-4 z-20 w-32 md:w-44 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-neutral-800">
                {session.isVideoOff ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center bg-neutral-850">
                    <VideoOff className="w-6 h-6 text-neutral-400 mb-1" />
                    <span className="text-[10px] text-neutral-400 font-medium">Camera off</span>
                  </div>
                ) : localStream ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover -scale-x-100"
                  />
                ) : (
                  <div className="w-full h-full relative flex flex-col items-center justify-center bg-gradient-to-tr from-neutral-900 to-indigo-950 p-2">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500 mb-1"
                    />
                    <span className="text-[10px] text-neutral-300 font-medium">You</span>
                    <span className="text-[9px] text-emerald-400 flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Live
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* AUDIO CALL LAYOUT */
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 relative">
              {/* Concentric Ringing Waves */}
              {!isConnected && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 rounded-full border border-indigo-500/30 animate-ping" />
                  <div
                    className="w-64 h-64 rounded-full border border-rose-500/20 animate-ping"
                    style={{ animationDelay: '400ms' }}
                  />
                </div>
              )}

              <div className="relative mb-6">
                <img
                  src={session.participant.avatar}
                  alt={session.participant.name}
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-4 ring-neutral-800 shadow-2xl relative z-10"
                />
                {isConnected && (
                  <div className="absolute -bottom-2 -right-2 z-20 w-8 h-8 rounded-full bg-emerald-500 ring-4 ring-neutral-900 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">
                {session.participant.name}
              </h2>
              <p className="text-sm text-neutral-400 font-medium mt-1">
                {!isConnected ? 'Ringing...' : 'Connected · HD Voice'}
              </p>

              <div className="mt-3 text-lg font-mono text-emerald-400 font-semibold tracking-wider">
                {isConnected ? formatDuration(callDuration) : '00:00'}
              </div>

              {/* Connected Voice Equalizer */}
              {isConnected && (
                <div className="flex items-center gap-1.5 mt-6 h-10">
                  {[20, 35, 15, 40, 50, 25, 30, 45, 18, 32].map((val, idx) => (
                    <div
                      key={idx}
                      className="w-1.5 bg-gradient-to-t from-indigo-500 to-rose-500 rounded-full animate-pulse"
                      style={{
                        height: `${val}px`,
                        animationDelay: `${idx * 80}ms`,
                        animationDuration: '600ms'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Instant Answer Button (for demo convenience if user wants to connect immediately) */}
              {!isConnected && (
                <button
                  onClick={() => {
                    stopRingtone();
                    playConnectedSound();
                    setIsConnected(true);
                  }}
                  className="mt-6 px-4 py-1.5 rounded-full bg-indigo-600/30 border border-indigo-500/50 hover:bg-indigo-600/50 text-indigo-300 text-xs font-semibold transition-colors"
                >
                  Click to Answer Now
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bottom Call Controls Bar */}
        <div className="relative z-20 flex items-center justify-center gap-4 py-5 px-6 bg-gradient-to-t from-black via-black/90 to-transparent">
          {/* Mute Mic */}
          <button
            onClick={onToggleMute}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              session.isMuted
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
            }`}
            aria-label={session.isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {session.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Toggle Video (if in video call) */}
          {session.type === 'video' && (
            <button
              onClick={onToggleVideo}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                session.isVideoOff
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                  : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
              }`}
              aria-label={session.isVideoOff ? 'Turn camera on' : 'Turn camera off'}
            >
              {session.isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
            </button>
          )}

          {/* Toggle Speaker */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              !isSpeakerOn
                ? 'bg-neutral-800 text-neutral-400'
                : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
            }`}
            aria-label="Toggle speaker"
          >
            {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Hang Up (Red End Call Button) */}
          <button
            onClick={handleEnd}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-rose-600/40 transition-all ml-2"
            aria-label="End call"
          >
            <PhoneOff className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
