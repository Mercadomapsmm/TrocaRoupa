'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, SwitchCamera, AlertCircle } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64DataUrl: string) => void;
  title: string;
  description: string;
  guideType?: 'person' | 'garment';
}

export default function CameraModal({
  isOpen,
  onClose,
  onCapture,
  title,
  description,
  guideType = 'person',
}: CameraModalProps) {
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera tracks helper
  const stopTracks = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Check device cameras on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoInputs = devices.filter((d) => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      });
    }
  }, []);

  // Manage camera stream safely
  useEffect(() => {
    let active = true;

    if (isOpen) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return;
      }

      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        })
        .then((mediaStream) => {
          if (!active) {
            mediaStream.getTracks().forEach((t) => t.stop());
            return;
          }
          streamRef.current = mediaStream;
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch((err) => {
          if (!active) return;
          console.error('Camera access error:', err);
          setCameraError(
            err?.message ||
              'Não foi possível acessar a câmera. Verifique as permissões do dispositivo.'
          );
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, facingMode, retryCount]);

  const handleModalClose = () => {
    stopTracks();
    setCapturedImage(null);
    setCountdown(null);
    setCameraError(null);
    onClose();
  };

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth || 800;
    canvas.height = video.videoHeight || 1067;

    // Flip horizontally if front camera for mirror feel
    if (facingMode === 'user') {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopTracks();
  };

  const handleStartCaptureWithCountdown = () => {
    if (countdown !== null) return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          takeSnapshot();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setRetryCount((c) => c + 1);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleModalClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="h-5 w-5 text-indigo-400" />
              {title}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{description}</p>
          </div>
          <button
            onClick={handleModalClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative aspect-[3/4] max-h-[65vh] w-full bg-black overflow-hidden flex items-center justify-center">
          {cameraError ? (
            <div className="flex flex-col items-center justify-center px-6 text-center">
              <AlertCircle className="h-12 w-12 text-rose-500 mb-3" />
              <p className="text-sm font-medium text-slate-200 mb-2">Permissão de Câmera Necessária</p>
              <p className="text-xs text-slate-400 mb-4 max-w-sm">{cameraError}</p>
              <button
                onClick={() => {
                  setCameraError(null);
                  setRetryCount((c) => c + 1);
                }}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition"
              >
                <RefreshCw className="h-4 w-4" /> Tentar Novamente
              </button>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Foto Capturada"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`h-full w-full object-cover ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Guia de enquadramento (Body Silhouette Overlay) */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6">
                <div
                  className={`w-3/4 border-2 border-dashed transition-all duration-300 rounded-3xl ${
                    guideType === 'person'
                      ? 'h-4/5 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      : 'h-3/5 border-indigo-400/60 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                  }`}
                >
                  <div className="absolute top-3 inset-x-0 text-center">
                    <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-sm">
                      {guideType === 'person'
                        ? 'Enquadre o corpo no centro'
                        : 'Enquadre a roupa inteira'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Countdown overlay */}
              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs">
                  <span className="text-7xl font-extrabold text-amber-400 animate-ping">
                    {countdown}
                  </span>
                </div>
              )}
            </>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-5 py-4">
          {capturedImage ? (
            <>
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
              >
                <RefreshCw className="h-4 w-4" />
                Tirar Outra
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition"
              >
                <Check className="h-4 w-4" />
                Usar Esta Foto
              </button>
            </>
          ) : (
            <>
              {hasMultipleCameras ? (
                <button
                  onClick={toggleFacingMode}
                  title="Trocar Câmera (Frontal / Traseira)"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                >
                  <SwitchCamera className="h-4 w-4" />
                  <span className="hidden sm:inline">Inverter Câmera</span>
                </button>
              ) : (
                <div className="w-10" />
              )}

              {/* Central shutter button */}
              <button
                onClick={handleStartCaptureWithCountdown}
                disabled={Boolean(cameraError) || countdown !== null}
                className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-1 shadow-lg shadow-amber-500/30 transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Capturar Foto"
              >
                <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 group-hover:bg-transparent transition">
                  <div className="h-10 w-10 rounded-full bg-white transition group-hover:scale-90" />
                </div>
              </button>

              <button
                onClick={takeSnapshot}
                disabled={Boolean(cameraError)}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Instantâneo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
