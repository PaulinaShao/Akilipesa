import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, RotateCcw, Zap, Camera, Circle, Square,
  ZapOff, Grid3X3, ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

type CaptureMode = 'photo' | 'video';
type FlashMode = 'auto' | 'on' | 'off';

export default function CameraCaptPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mode, setMode] = useState<CaptureMode>('photo');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [showGrid, setShowGrid] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const initializeCamera = async () => {
    try {
      setIsLoading(true);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: mode === 'video'
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
      // Show error toast or fallback
    } finally {
      setIsLoading(false);
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const toggleFlash = () => {
    const modes: FlashMode[] = ['off', 'auto', 'on'];
    const currentIndex = modes.indexOf(flashMode);
    setFlashMode(modes[(currentIndex + 1) % modes.length]);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx?.drawImage(video, 0, 0);
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedMedia(imageDataUrl);
  };

  const startVideoRecording = () => {
    if (!stream) return;
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });
    
    const chunks: Blob[] = [];
    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const videoUrl = URL.createObjectURL(blob);
      setCapturedMedia(videoUrl);
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);
  };

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCapture = () => {
    if (mode === 'photo') {
      capturePhoto();
    } else {
      if (isRecording) {
        stopVideoRecording();
      } else {
        startVideoRecording();
      }
    }
  };

  const handleNext = () => {
    if (capturedMedia) {
      navigate('/create/edit', { 
        state: { 
          mediaUrl: capturedMedia, 
          mediaType: mode 
        } 
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (capturedMedia) {
    return (
      <div className="h-screen-safe bg-black flex flex-col">
        {/* Header */}
        <div className="safe-top p-4 flex items-center justify-between">
          <button 
            onClick={() => setCapturedMedia(null)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <span className="text-white font-medium">Preview</span>
          <button 
            onClick={handleNext}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 flex items-center justify-center">
          {mode === 'photo' ? (
            <img 
              src={capturedMedia} 
              alt="Captured" 
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video 
              src={capturedMedia} 
              controls 
              className="max-w-full max-h-full"
            />
          )}
        </div>

        {/* Actions */}
        <div className="safe-bottom p-6 flex space-x-4">
          <button 
            onClick={() => setCapturedMedia(null)}
            className="flex-1 btn-secondary py-3"
          >
            Retake
          </button>
          <button 
            onClick={handleNext}
            className="flex-1 btn-primary py-3"
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen-safe bg-black flex flex-col">
      {/* Header */}
      <div className="safe-top p-4 flex items-center justify-between">
        <button 
          onClick={() => navigate('/create')}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleFlash}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {flashMode === 'off' ? (
              <FlashOff className="w-6 h-6 text-white" />
            ) : (
              <Zap className="w-6 h-6 text-yellow-400" />
            )}
          </button>
          
          <button 
            onClick={() => setShowGrid(!showGrid)}
            className={cn(
              "p-2 rounded-full transition-colors",
              showGrid ? "bg-white/20" : "hover:bg-white/10"
            )}
          >
            <Grid3X3 className="w-6 h-6 text-white" />
          </button>
          
          <button 
            onClick={switchCamera}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white">Initializing camera...</p>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            
            {/* Grid overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="border border-white/20" />
                  ))}
                </div>
              </div>
            )}
            
            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-red-500 px-4 py-2 rounded-full flex items-center space-x-2">
                  <Circle className="w-3 h-3 fill-white text-white animate-pulse" />
                  <span className="text-white font-mono">{formatTime(recordingTime)}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className="safe-bottom p-6">
        {/* Mode Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 rounded-full p-1 flex">
            <button
              onClick={() => setMode('photo')}
              className={cn(
                "px-6 py-2 rounded-full transition-all",
                mode === 'photo' ? "bg-white text-black" : "text-white"
              )}
            >
              Photo
            </button>
            <button
              onClick={() => setMode('video')}
              className={cn(
                "px-6 py-2 rounded-full transition-all",
                mode === 'video' ? "bg-white text-black" : "text-white"
              )}
            >
              Video
            </button>
          </div>
        </div>

        {/* Capture Button */}
        <div className="flex items-center justify-center">
          <button
            onClick={handleCapture}
            disabled={isLoading}
            className={cn(
              "w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all",
              isRecording ? "bg-red-500" : "bg-white/20 hover:bg-white/30",
              isLoading && "opacity-50"
            )}
          >
            {mode === 'photo' ? (
              <Camera className="w-8 h-8 text-white" />
            ) : isRecording ? (
              <Square className="w-6 h-6 text-white fill-white" />
            ) : (
              <Circle className="w-8 h-8 text-white fill-red-500" />
            )}
          </button>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
