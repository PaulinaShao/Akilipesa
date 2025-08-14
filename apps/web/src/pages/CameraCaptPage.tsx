import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Video, RotateCcw, X, Check, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

type CaptureMode = 'photo' | 'video';

export default function CameraCaptPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const [mode, setMode] = useState<CaptureMode>('photo');
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      // Check if camera is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported on this device');
      }

      let mediaStream: MediaStream;

      // Try different camera configurations with progressive fallback
      try {
        // First try: preferred front camera with audio if video mode
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: mode === 'video'
        });
      } catch (err) {
        console.warn('Front camera with audio failed, trying without audio:', err);
        try {
          // Second try: front camera without audio
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
            audio: false
          });
        } catch (err2) {
          console.warn('Front camera failed, trying any camera:', err2);
          try {
            // Third try: any available camera
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            });
          } catch (err3) {
            console.warn('All camera attempts failed, trying basic video:', err3);
            // Fourth try: most basic video constraint
            mediaStream = await navigator.mediaDevices.getUserMedia({
              video: {}
            });
          }
        }
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
      setIsStreaming(true);

    } catch (error: any) {
      console.error('Error accessing camera:', error);

      // Set user-friendly error message
      let errorMessage = 'Camera access failed. ';
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is being used by another application.';
      } else {
        errorMessage += 'Please use file upload instead.';
      }

      setCameraError(errorMessage);
    }
  }, [mode]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedMedia(imageData);
      stopCamera();
    }
  }, [stopCamera]);

  const startRecording = useCallback(() => {
    if (!stream) return;
    
    const chunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setCapturedMedia(url);
      setIsRecording(false);
      setRecordingTime(0);
      stopCamera();
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    
    // Start timer
    const timer = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= 60) { // 60 second limit
          stopRecording();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    
    // Store timer to clear it later
    (mediaRecorder as any).timer = timer;
  }, [stream, stopCamera]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      const timer = (mediaRecorderRef.current as any).timer;
      if (timer) clearInterval(timer);
      mediaRecorderRef.current.stop();
    }
  }, [isRecording]);

  const handleFileUpload = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = mode === 'video' ? 'video/*' : 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setCapturedMedia(url);
        setCameraError(null); // Clear error when file is uploaded
      }
    };
    input.click();
  }, [mode]);

  const retake = useCallback(() => {
    setCapturedMedia(null);
    setCameraError(null);
    startCamera();
  }, [startCamera]);

  const handleNext = () => {
    // Navigate to editor with captured media
    if (capturedMedia) {
      navigate('/create/editor', { 
        state: { 
          mediaUrl: capturedMedia, 
          mediaType: mode 
        }
      });
    }
  };

  const handleBack = () => {
    stopCamera();
    navigate('/create');
  };

  return (
    <div className="h-screen-safe bg-black flex flex-col relative">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 safe-top">
        <button
          onClick={handleBack}
          className="p-2 bg-black/50 rounded-full backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex items-center gap-2 bg-black/50 rounded-full px-4 py-2 backdrop-blur-sm">
          <button
            onClick={() => setMode('photo')}
            className={cn(
              "px-3 py-1 rounded-full text-sm transition-all",
              mode === 'photo' 
                ? "bg-white text-black" 
                : "text-white"
            )}
          >
            Photo
          </button>
          <button
            onClick={() => setMode('video')}
            className={cn(
              "px-3 py-1 rounded-full text-sm transition-all",
              mode === 'video' 
                ? "bg-white text-black" 
                : "text-white"
            )}
          >
            Video
          </button>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        {!capturedMedia ? (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
            <canvas ref={canvasRef} className="hidden" />
            
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <div className="text-center max-w-sm mx-auto px-4">
                  {cameraError ? (
                    <>
                      <Camera className="w-16 h-16 text-red-400/60 mx-auto mb-4" />
                      <p className="text-red-400 mb-2 text-sm font-medium">Camera Error</p>
                      <p className="text-white/80 mb-6 text-sm leading-relaxed">{cameraError}</p>
                      <div className="space-y-3">
                        <button
                          onClick={startCamera}
                          className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl transition-colors"
                        >
                          Try Camera Again
                        </button>
                        <button
                          onClick={handleFileUpload}
                          className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors"
                        >
                          Upload {mode === 'video' ? 'Video' : 'Photo'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Camera className="w-16 h-16 text-white/60 mx-auto mb-4" />
                      <p className="text-white/80 mb-6">Tap to start camera</p>
                      <div className="space-y-3">
                        <button
                          onClick={startCamera}
                          className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl transition-colors"
                        >
                          Start Camera
                        </button>
                        <button
                          onClick={handleFileUpload}
                          className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors"
                        >
                          Upload File Instead
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full relative">
            {mode === 'photo' ? (
              <img
                src={capturedMedia}
                alt="Captured"
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={capturedMedia}
                className="w-full h-full object-cover"
                controls
                autoPlay
                loop
              />
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 safe-bottom">
        {!capturedMedia ? (
          isStreaming && (
            <div className="flex items-center justify-center">
              {mode === 'video' && isRecording && (
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                  {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, '0')}
                </div>
              )}
              
              <div className="flex items-center gap-8">
                <button className="p-4 border-2 border-white/30 rounded-full">
                  <Upload className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={mode === 'photo' ? capturePhoto : (isRecording ? stopRecording : startRecording)}
                  className={cn(
                    "w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all",
                    isRecording ? "bg-red-500 scale-110" : "bg-transparent hover:scale-105"
                  )}
                >
                  {mode === 'photo' ? (
                    <Camera className="w-8 h-8 text-white" />
                  ) : (
                    <Video className={cn("w-8 h-8", isRecording ? "text-white" : "text-white")} />
                  )}
                </button>
                
                <button className="p-4 border-2 border-white/30 rounded-full">
                  <RotateCcw className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={retake}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-colors"
            >
              <X className="w-5 h-5" />
              Retake
            </button>
            
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl text-white transition-colors"
            >
              <Check className="w-5 h-5" />
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
