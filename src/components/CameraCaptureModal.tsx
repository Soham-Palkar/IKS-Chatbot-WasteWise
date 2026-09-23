import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, Upload, AlertCircle, Sparkles, SwitchCamera } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (file: File) => void;
  onUploadFallback: (file: File) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
  onUploadFallback,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoadingCamera, setIsLoadingCamera] = useState<boolean>(true);
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [isFlashing, setIsFlashing] = useState<boolean>(false);

  // Stop active stream tracks
  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Check if device has multiple video inputs
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoDevices.length > 1);
      }).catch(() => {
        setHasMultipleCameras(false);
      });
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    setIsLoadingCamera(true);
    setCameraError(null);
    setCapturedImage(null);

    // Stop existing stream first
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported in this browser. Please use file upload.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
      setIsLoadingCamera(false);
    } catch (err: any) {
      setIsLoadingCamera(false);
      const errName = err?.name || '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser or upload an image.');
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setCameraError('No camera found on your device. You can upload an image file instead.');
      } else {
        setCameraError(err?.message || 'Unable to access camera. You can upload an image file instead.');
      }
    }
  }, [stream]);

  // Trigger camera on open
  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopStream();
      setCapturedImage(null);
      setCameraError(null);
    }

    return () => {
      stopStream();
    };
  }, [isOpen]);

  // Toggle front/back camera
  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  // Capture snapshot from video stream
  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Trigger visual shutter flash
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 200);

    const width = video.videoWidth || 640;
    const height = video.videoHeight || 480;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // If user facing mode, flip horizontally for mirror effect
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCapturedImage(dataUrl);

      // Pause live video while viewing snapshot
      video.pause();
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedImage(null);
    if (videoRef.current && stream) {
      videoRef.current.play().catch(() => {});
    }
  };

  // Confirm photo and convert to File
  const handleConfirmPhoto = () => {
    if (!capturedImage) return;

    try {
      // Direct conversion of dataURL to Blob (fetch can sometimes fail on data URLs)
      const parts = capturedImage.split(',');
      const byteString = atob(parts[1]);
      const mimeString = parts[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      
      const file = new File([blob], `waste-photo-${Date.now()}.jpg`, {
        type: mimeString,
        lastModified: Date.now(),
      });
      
      stopStream();
      onPhotoCaptured(file);
      onClose();
    } catch (e) {
      setCameraError('Failed to process captured photo. Please try again.');
    }
  };

  // Handle file picker fallback
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      stopStream();
      onUploadFallback(file);
      onClose();
      e.target.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
      onClick={() => {
        stopStream();
        onClose();
      }}
    >
      <div
        className="w-full max-w-lg bg-[#151d17] text-white rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/10 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#2f7d4a] text-white">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Capture Waste Item</h2>
              <p className="text-[11px] text-white/60">Position the item inside the frame</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {hasMultipleCameras && !capturedImage && !cameraError && (
              <button
                type="button"
                onClick={toggleCameraFacing}
                title="Switch Camera"
                className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                stopStream();
                onClose();
              }}
              aria-label="Close Camera"
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder / Preview Area */}
        <div className="relative flex-1 min-h-[320px] sm:min-h-[380px] bg-black flex items-center justify-center overflow-hidden">
          {/* Hidden Canvas for capture processing */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Flash animation */}
          {isFlashing && (
            <div className="absolute inset-0 bg-white z-30 pointer-events-none animate-pulse" />
          )}

          {/* Live Video View */}
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className={`w-full h-full object-cover max-h-[460px] ${
              capturedImage ? 'hidden' : 'block'
            } ${facingMode === 'user' ? '-scale-x-100' : ''}`}
          />

          {/* Captured Snapshot Preview */}
          {capturedImage && (
            <div className="relative w-full h-full max-h-[460px] flex items-center justify-center bg-black">
              <img
                src={capturedImage}
                alt="Captured waste"
                className="w-full h-full object-contain max-h-[460px]"
              />
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white/90 flex items-center gap-1.5 border border-white/10">
                <Sparkles className="w-3 h-3 text-[#52b775]" />
                <span>Photo Ready</span>
              </div>
            </div>
          )}

          {/* Viewfinder Target Framing Guidelines (only during live stream) */}
          {!capturedImage && !cameraError && !isLoadingCamera && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
              <div className="w-56 h-56 sm:w-64 sm:h-64 border-2 border-dashed border-[#52b775]/70 rounded-2xl relative flex items-center justify-center shadow-[0_0_25px_rgba(47,125,74,0.3)]">
                {/* Corner accent markers */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#52b775]" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#52b775]" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#52b775]" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#52b775]" />

                <span className="text-[11px] font-medium text-white/70 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-xs">
                  Center waste item here
                </span>
              </div>
            </div>
          )}

          {/* Camera Loading Spinner */}
          {isLoadingCamera && !cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
              <div className="w-10 h-10 border-3 border-[#2f7d4a] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-white/80">Accessing camera...</p>
            </div>
          )}

          {/* Camera Error / Fallback View */}
          {cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#151d17] z-20">
              <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">Camera Unavailable</h3>
              <p className="text-xs text-white/70 max-w-xs mb-4 leading-relaxed">
                {cameraError}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  Retry Camera
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-[#2f7d4a] hover:bg-[#24643a] text-white transition-colors cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Hidden file input for file upload fallback */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="camera-fallback-file-input"
        />

        {/* Bottom Control Bar */}
        <div className="px-4 py-3.5 bg-black/60 border-t border-white/10 flex items-center justify-between gap-3 shrink-0">
          {/* File Upload Option */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="Upload an image from your device"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload file</span>
          </button>

          {/* Shutter / Action Controls */}
          {!capturedImage ? (
            /* Live Camera: Shutter Button */
            <div className="flex items-center justify-center flex-1">
              <button
                type="button"
                onClick={handleTakePhoto}
                disabled={isLoadingCamera || Boolean(cameraError)}
                aria-label="Take Photo"
                title="Click photo to identify"
                className="relative group flex items-center justify-center w-14 h-14 rounded-full border-4 border-white/80 bg-white hover:bg-white/90 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-lg"
              >
                <div className="w-10 h-10 rounded-full bg-[#2f7d4a] group-hover:bg-[#24643a] transition-colors flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </button>
            </div>
          ) : (
            /* Snapshot Preview: Retake / Confirm Buttons */
            <div className="flex items-center gap-2 flex-1 justify-end">
              <button
                type="button"
                onClick={handleRetake}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-xl bg-[#2f7d4a] hover:bg-[#24643a] text-white transition-colors cursor-pointer shadow-sm"
              >
                <Check className="w-4 h-4" />
                <span>Use Photo & Send</span>
              </button>
            </div>
          )}

          {/* Cancel Button */}
          <button
            type="button"
            onClick={() => {
              stopStream();
              onClose();
            }}
            className="text-xs text-white/70 hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
