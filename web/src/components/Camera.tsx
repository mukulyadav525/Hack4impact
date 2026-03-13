"use client";

import { useRef, useState, useCallback, useEffect } from 'react';
import { Camera as CameraIcon, RefreshCw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CameraProps {
  onCapture: (base64: string) => void;
  className?: string;
}

export function Camera({ onCapture, className }: CameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);

  useEffect(() => {
    if (isActive && videoRef.current) {
      startCamera();
    }
    return () => stopCamera();
  }, [isActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(base64);
        setIsCaptured(true);
        stopCamera();
        setIsActive(false);
      }
    }
  }, [onCapture]);

  const reset = () => {
    setIsCaptured(false);
    setIsActive(true);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800", className)}>
      {!isActive && !isCaptured && (
        <div className="flex flex-col items-center justify-center p-12 text-center h-[300px]">
          <div className="w-16 h-16 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-500 mb-4">
            <CameraIcon size={32} />
          </div>
          <h3 className="text-zinc-50 font-semibold mb-2">Face Verification</h3>
          <p className="text-zinc-400 text-sm mb-6">Position your face clearly in the frame</p>
          <button 
            onClick={() => setIsActive(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-all"
          >
            Open Camera
          </button>
        </div>
      )}

      {isActive && (
        <div className="relative">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-auto aspect-[4/3] object-cover"
          />
          <div className="absolute inset-0 border-[30px] border-black/40 pointer-events-none">
            <div className="w-full h-full border-2 border-blue-500/50 rounded-full box-content -m-0.5" />
          </div>
          <button 
            onClick={capture}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white border-4 border-zinc-300 flex items-center justify-center shadow-lg active:scale-95 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-red-500" />
          </button>
        </div>
      )}

      {isCaptured && (
        <div className="relative">
          <canvas ref={canvasRef} className="w-full h-auto aspect-[4/3] object-cover" />
          <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center">
            <div className="bg-white rounded-full p-4 shadow-xl">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
          </div>
          <button 
            onClick={reset}
            className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-zinc-900 font-medium shadow-lg hover:bg-white transition-all"
          >
            <RefreshCw size={16} />
            Retake
          </button>
        </div>
      )}
    </div>
  );
}
