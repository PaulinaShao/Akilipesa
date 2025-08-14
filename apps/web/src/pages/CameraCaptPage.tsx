import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Video, RotateCcw, X, Check, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

type CaptureMode = 'photo' | 'video';

// Check browser compatibility and camera availability
const checkCameraSupport = (): { supported: boolean; reason?: string } => {
  // Check if running in secure context (HTTPS or localhost)
  if (!window.isSecureContext && location.hostname !== 'localhost') {
    return { supported: false, reason: 'Camera requires HTTPS or localhost' };
  }

  // Check MediaDevices API support
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { supported: false, reason: 'Browser does not support camera access' };
  }

  return { supported: true };
};

// Check camera permissions
const checkCameraPermissions = async (): Promise<boolean> => {
  try {
    if (!navigator.permissions) return true; // Assume allowed if API not available

    const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return permission.state === 'granted';
  } catch {
    return true; // Assume allowed if check fails
  }
};

// Debug function to get detailed device information
const debugCameraDevices = async (): Promise<string> => {
  const debugInfo: string[] = [];

  try {
    // Basic browser support
    debugInfo.push(`Navigator.mediaDevices available: ${!!navigator.mediaDevices}`);
    debugInfo.push(`getUserMedia supported: ${!!(navigator.mediaDevices?.getUserMedia)}`);
    debugInfo.push(`Secure context: ${window.isSecureContext}`);
    debugInfo.push(`Location: ${location.protocol}//${location.hostname}`);

    // Device enumeration
    if (navigator.mediaDevices?.enumerateDevices) {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      const audioDevices = devices.filter(d => d.kind === 'audioinput');

      debugInfo.push(`Total devices: ${devices.length}`);
      debugInfo.push(`Video devices: ${videoDevices.length}`);
      debugInfo.push(`Audio devices: ${audioDevices.length}`);

      videoDevices.forEach((device, index) => {
        debugInfo.push(`  Video ${index + 1}: ${device.label || 'Unnamed'} (${device.deviceId.substring(0, 8)}...)`);
      });
    }

    // Permission status
    if (navigator.permissions) {
      try {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        debugInfo.push(`Camera permission: ${cameraPermission.state}`);

        const micPermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        debugInfo.push(`Microphone permission: ${micPermission.state}`);
      } catch {
        debugInfo.push(`Permission API not fully supported`);
      }
    }

  } catch (error) {
    debugInfo.push(`Debug error: ${error.message}`);
  }

  return debugInfo.join('\n');
};

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
  const [cameraRetries, setCameraRetries] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Check if camera is supported on mount
  useEffect(() => {
    const { supported, reason } = checkCameraSupport();
    if (!supported) {
      setCameraError(reason || 'Camera not available on this device');
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      // Check browser compatibility first
      const { supported, reason } = checkCameraSupport();
      if (!supported) {
        throw new Error(reason || 'Camera not supported on this device');
      }

      // Increment retry counter
      setCameraRetries(prev => prev + 1);

      // If too many retries, suggest file upload
      if (cameraRetries >= 3) {
        setCameraError('Camera access failed multiple times. Please try uploading a file instead.');
        return;
      }

      // Clear any previous errors
      setCameraError(null);

      // Enhanced device enumeration with better error handling
      let devices: MediaDeviceInfo[] = [];
      let videoDevices: MediaDeviceInfo[] = [];
      let hasDeviceAccess = false;

      try {
        // First attempt - get devices without requesting permission
        devices = await navigator.mediaDevices.enumerateDevices();
        videoDevices = devices.filter(device => device.kind === 'videoinput');

        // Check if we have device labels (means we have permission)
        hasDeviceAccess = videoDevices.some(device => device.label !== '');

        console.log(`Initial enumeration found ${videoDevices.length} video devices`);
        console.log('Device access granted:', hasDeviceAccess);
        console.log('Video devices:', videoDevices.map(d => ({ id: d.deviceId, label: d.label || 'Unknown' })));

        if (videoDevices.length === 0) {
          // Try requesting permission first, then enumerate again
          console.log('No devices found in initial enumeration, requesting permission...');
          try {
            const tempStream = await navigator.mediaDevices.getUserMedia({ video: true });
            tempStream.getTracks().forEach(track => track.stop());

            // Re-enumerate after getting permission
            devices = await navigator.mediaDevices.enumerateDevices();
            videoDevices = devices.filter(device => device.kind === 'videoinput');
            hasDeviceAccess = true;

            console.log(`After permission, found ${videoDevices.length} video devices`);
          } catch (permError) {
            console.warn('Permission request failed:', permError);
            throw new Error('No camera devices found and permission denied');
          }
        }

        if (videoDevices.length === 0) {
          throw new Error('No camera devices found on this device');
        }
      } catch (enumError) {
        console.warn('Device enumeration failed:', enumError);
        // Continue anyway, sometimes enumeration fails but camera still works
        hasDeviceAccess = false;
      }

      let mediaStream: MediaStream;

      // Enhanced camera access attempts with device-specific handling
      const attempts = [];

      // If we have specific device IDs, try them first
      if (hasDeviceAccess && videoDevices.length > 0) {
        // Try each available device by ID (most reliable)
        for (const device of videoDevices) {
          if (device.deviceId && device.deviceId !== 'default') {
            attempts.push({
              name: `Specific device: ${device.label || device.deviceId.substring(0, 8)}`,
              constraints: {
                video: {
                  deviceId: { exact: device.deviceId },
                  width: { ideal: 1280 },
                  height: { ideal: 720 }
                },
                audio: mode === 'video'
              }
            });
          }
        }
      }

      // Standard fallback attempts
      attempts.push(
        {
          name: 'Front camera with audio',
          constraints: {
            video: {
              facingMode: 'user',
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: mode === 'video'
          }
        },
        {
          name: 'Front camera without audio',
          constraints: {
            video: { facingMode: 'user' },
            audio: false
          }
        },
        {
          name: 'Rear camera',
          constraints: {
            video: { facingMode: 'environment' },
            audio: false
          }
        },
        {
          name: 'Any available camera',
          constraints: {
            video: true,
            audio: false
          }
        },
        {
          name: 'Basic video only',
          constraints: {
            video: {}
          }
        }
      );

      let lastError: any = null;

      for (const attempt of attempts) {
        try {
          console.log(`Trying: ${attempt.name}`);
          mediaStream = await navigator.mediaDevices.getUserMedia(attempt.constraints);
          console.log(`Success with: ${attempt.name}`);
          break;
        } catch (err: any) {
          console.warn(`${attempt.name} failed:`, err);
          lastError = err;

          // If permission was denied, don't try other methods
          if (err.name === 'NotAllowedError') {
            throw err;
          }
        }
      }

      // If we get here without a stream, all attempts failed
      if (!mediaStream!) {
        throw lastError || new Error('All camera access attempts failed');
      }

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
      setIsStreaming(true);
      setCameraRetries(0); // Reset retry counter on success

    } catch (error: any) {
      console.error('Error accessing camera:', error);

      // Gather debug information for troubleshooting
      try {
        const debug = await debugCameraDevices();
        setDebugInfo(debug);
        console.log('Camera debug info:', debug);
      } catch (debugError) {
        console.warn('Failed to gather debug info:', debugError);
      }

      // Set user-friendly error message based on error type
      let errorMessage = 'Camera access failed. ';

      switch (error.name) {
        case 'NotAllowedError':
          errorMessage = 'Camera permission denied. Please allow camera access in your browser settings and try again.';
          break;
        case 'NotFoundError':
          errorMessage = 'No camera found on this device. You can still upload photos or videos from your gallery.';
          break;
        case 'NotReadableError':
          errorMessage = 'Camera is currently being used by another application. Please close other apps using the camera and try again.';
          break;
        case 'OverconstrainedError':
          errorMessage = 'Camera configuration not supported. Trying basic mode...';
          // Try one more time with most basic constraints
          setTimeout(() => startCamera(), 1000);
          return;
        case 'AbortError':
          errorMessage = 'Camera access was interrupted. Please try again.';
          break;
        case 'SecurityError':
          errorMessage = 'Camera access blocked by security policy. Please check your browser settings.';
          break;
        default:
          if (error.message?.includes('device not found') || error.message?.includes('Requested device not found')) {
            errorMessage = 'Camera device not found. This usually happens when the camera is disconnected or being used by another app. Please check your camera connection and try again.';
          } else if (error.message?.includes('not supported')) {
            errorMessage = 'Camera not supported on this device. You can upload media files instead.';
          } else if (error.message?.includes('Could not start')) {
            errorMessage = 'Failed to start camera. Please check if your camera is working and not being used by another application.';
          } else {
            errorMessage = `Camera error: ${error.message || 'Unknown error'}. Please try uploading a file instead.`;
          }
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

  const requestCameraPermission = useCallback(async () => {
    try {
      // Request permission by trying to access camera briefly
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Immediately stop the stream since we just wanted permission
      stream.getTracks().forEach(track => track.stop());
      // Now try to start camera normally
      startCamera();
    } catch (error) {
      console.error('Permission request failed:', error);
      setCameraError('Camera permission was denied. Please enable camera access in your browser settings.');
    }
  }, [startCamera]);

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
                        {cameraError.includes('permission') || cameraError.includes('denied') ? (
                          <button
                            onClick={requestCameraPermission}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl transition-colors"
                          >
                            Allow Camera Access
                          </button>
                        ) : (
                          <button
                            onClick={startCamera}
                            className="w-full bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-xl transition-colors"
                          >
                            Try Camera Again
                          </button>
                        )}
                        <button
                          onClick={handleFileUpload}
                          className="w-full bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl transition-colors"
                        >
                          Upload {mode === 'video' ? 'Video' : 'Photo'} Instead
                        </button>
                        {/* Browser settings help */}
                        <div className="pt-2 space-y-2">
                          <details className="text-xs text-white/60">
                            <summary className="cursor-pointer hover:text-white/80">
                              Need help with camera permissions?
                            </summary>
                            <div className="mt-2 space-y-1 text-left">
                              <p>• Look for camera icon in address bar</p>
                              <p>• Click "Allow" when browser asks for permission</p>
                              <p>• Check browser settings → Privacy → Camera</p>
                              <p>• Make sure no other app is using the camera</p>
                              <p>• Try refreshing the page</p>
                              <p>• Check if camera is connected (for external cameras)</p>
                            </div>
                          </details>

                          {debugInfo && (
                            <details className="text-xs text-white/60">
                              <summary className="cursor-pointer hover:text-white/80">
                                Technical Details (for debugging)
                              </summary>
                              <div className="mt-2 p-2 bg-black/40 rounded text-left font-mono text-xs max-h-32 overflow-y-auto">
                                <pre className="whitespace-pre-wrap">{debugInfo}</pre>
                              </div>
                            </details>
                          )}
                        </div>
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
                <button
                  onClick={handleFileUpload}
                  className="p-4 border-2 border-white/30 hover:border-white/50 rounded-full transition-colors"
                  title="Upload file"
                >
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
