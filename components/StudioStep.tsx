'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCcw,
  Sparkles,
  Download,
  Bookmark,
  Check,
  Maximize2,
  Sliders,
  Sun,
  Moon,
  Camera,
  RefreshCw,
  Share2,
  Grid,
  Square,
  Layers,
  Award,
  Scissors,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
} from 'lucide-react';
import { ANGLE_OPTIONS, AngleOption, ClothingItem } from '@/lib/catalog';

interface StudioStepProps {
  personImage: string;
  personName: string;
  selectedGarments: ClothingItem[];
  customGarmentImage: string | null;
  customNotes: string;
  personCategory: 'homem' | 'mulher' | 'crianca';
  currentAngle: 'frente' | 'perfil' | 'tres_quartos' | 'costas';
  angleImages: Record<string, string>;
  fitPreference: 'slim' | 'regular' | 'oversized';
  lighting: string;
  stylistAnalysis: any;
  isProcessingAI: boolean;
  onAngleChange: (angle: 'frente' | 'perfil' | 'tres_quartos' | 'costas') => void;
  onFitPreferenceChange: (fit: 'slim' | 'regular' | 'oversized') => void;
  onLightingChange: (lighting: string) => void;
  onRecomputeTryon: () => void;
  onSaveLook: (name: string) => void;
  onBackToGarments: () => void;
}

export default function StudioStep({
  personImage,
  personName,
  selectedGarments,
  customGarmentImage,
  customNotes,
  personCategory,
  currentAngle,
  angleImages,
  fitPreference,
  lighting,
  stylistAnalysis,
  isProcessingAI,
  onAngleChange,
  onFitPreferenceChange,
  onLightingChange,
  onRecomputeTryon,
  onSaveLook,
  onBackToGarments,
}: StudioStepProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // for before/after split slider
  const [isComparing, setIsComparing] = useState(false);
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [isSaved, setIsSaved] = useState(false);
  const [lookName, setLookName] = useState(
    `${selectedGarments[0]?.name || 'Look Personalizado'} (${personName})`
  );
  const [isZoomed, setIsZoomed] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Active rendered image for the current angle
  const activeResultImage = angleImages[currentAngle] || personImage;

  // Handle Split Slider Dragging
  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = activeResultImage;
    link.download = `TrocaRoupa_${personCategory}_${currentAngle}.jpg`;
    link.click();
  };

  const handleSave = () => {
    onSaveLook(lookName);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const lightingOptions = [
    { id: 'Estúdio Profissional Softbox', label: 'Estúdio de Moda', icon: Sparkles },
    { id: 'Luz Solar Natural Externa', label: 'Luz Natural de Sol', icon: Sun },
    { id: 'Noite & Coquetel Elegante', label: 'Noite & Coquetel', icon: Moon },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 mb-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Look Ajustado com Inteligência Artificial
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Estúdio TrocaRoupa 360°
          </h2>
          <p className="text-xs text-slate-400">
            Navegue pelos ângulos corporais, compare o antes e depois e veja a precisão milimétrica do caimento.
          </p>
        </div>

        {/* View mode toggle & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
            <button
              onClick={() => setViewMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'single'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Square className="h-3.5 w-3.5" />
              Vista Única
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="h-3.5 w-3.5" />
              Todos os Ângulos
            </button>
          </div>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
            title="Baixar imagem em alta resolução"
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Baixar Foto</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-lg ${
              isSaved
                ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                : 'bg-amber-500 text-slate-950 shadow-amber-500/25 hover:bg-amber-400'
            }`}
          >
            {isSaved ? <Check className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            <span>{isSaved ? 'Look Salvo!' : 'Salvar no Closet'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Interactive Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Angle Stage (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Angle Navigation Tabs */}
          <div className="grid grid-cols-4 gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 p-1.5">
            {ANGLE_OPTIONS.map((ang) => {
              const isActive = currentAngle === ang.id;
              return (
                <button
                  key={ang.id}
                  onClick={() => onAngleChange(ang.id)}
                  className={`flex flex-col items-center justify-center rounded-xl py-2 px-1 text-center transition ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-xs font-bold">{ang.label}</span>
                  <span className="text-[10px] opacity-75">{ang.degrees}</span>
                </button>
              );
            })}
          </div>

          {/* Display Stage */}
          {viewMode === 'single' ? (
            <div className="relative overflow-hidden rounded-3xl border-2 border-slate-800 bg-slate-950 shadow-2xl">
              {/* Top status chips */}
              <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
                <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white border border-white/10 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Ângulo: {ANGLE_OPTIONS.find((a) => a.id === currentAngle)?.label} ({ANGLE_OPTIONS.find((a) => a.id === currentAngle)?.degrees})
                </span>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <button
                    onClick={() => setIsComparing(!isComparing)}
                    className={`rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md transition border ${
                      isComparing
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-black/70 text-slate-200 border-white/10 hover:bg-black/90'
                    }`}
                  >
                    {isComparing ? 'Desativar Comparador' : 'Comparar Antes/Depois'}
                  </button>

                  <button
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-black/70 backdrop-blur-md text-slate-200 border border-white/10 hover:text-white"
                    title="Alternar Zoom"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Visual viewport with Before/After Split */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="relative aspect-[3/4] w-full overflow-hidden select-none cursor-ew-resize bg-slate-950"
              >
                {/* Layer 1: Fitted Try-On Result */}
                <img
                  src={activeResultImage}
                  alt="Resultado com Roupas Trocadas"
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ${
                    isZoomed ? 'scale-125 origin-center' : 'scale-100'
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Layer 2: Original Person (revealed by slider with clipPath when comparing) */}
                {isComparing && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={personImage}
                      alt="Foto Original Antes"
                      className={`h-full w-full object-cover transition-transform duration-300 ${
                        isZoomed ? 'scale-125 origin-center' : 'scale-100'
                      }`}
                      referrerPolicy="no-referrer"
                    />

                    <div className="absolute bottom-4 left-4 rounded-md bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-slate-300">
                      Antes (Original)
                    </div>
                  </div>
                )}

                {/* Vertical Divider Line */}
                {isComparing && (
                  <div
                    className="absolute inset-y-0 w-0.5 bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.7)] pointer-events-none z-10"
                    style={{ left: `${sliderPosition}%` }}
                  />
                )}

                {/* Slider Handle Knob */}
                {isComparing && (
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-xl pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <ChevronLeft className="h-4 w-4 -mr-1" />
                    <ChevronRight className="h-4 w-4 -ml-1" />
                  </div>
                )}

                {/* After label */}
                <div className="absolute bottom-4 right-4 rounded-md bg-emerald-950/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                  Depois (TrocaRoupa IA)
                </div>

                {isProcessingAI && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-xs">
                    <RefreshCw className="h-10 w-10 text-amber-400 animate-spin mb-3" />
                    <p className="text-sm font-bold text-white">Ajustando corte e drapeado com IA...</p>
                    <p className="text-xs text-slate-400 mt-1">Calculando anatomia e sombras em múltiplos ângulos</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Multi-Angle 4-Grid View */
            <div className="grid grid-cols-2 gap-3">
              {ANGLE_OPTIONS.map((ang) => {
                const img = angleImages[ang.id] || personImage;
                const isSelected = currentAngle === ang.id;
                return (
                  <div
                    key={ang.id}
                    onClick={() => {
                      onAngleChange(ang.id);
                      setViewMode('single');
                    }}
                    className={`group relative aspect-[3/4] overflow-hidden rounded-2xl border-2 cursor-pointer transition bg-slate-950 ${
                      isSelected
                        ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-lg'
                        : 'border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={img}
                      alt={ang.label}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{ang.label}</span>
                        <span className="text-[10px] text-amber-400 font-semibold">{ang.degrees}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{ang.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Angle insight caption */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Visão Técnica do Ângulo ({ANGLE_OPTIONS.find((a) => a.id === currentAngle)?.label}):
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {stylistAnalysis?.angleInsights?.[currentAngle] ||
                ANGLE_OPTIONS.find((a) => a.id === currentAngle)?.description}
            </p>
          </div>
        </div>

        {/* Right Column: AI Tailoring Studio & Stylist Report (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Fit & Lighting Controls Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scissors className="h-4 w-4 text-indigo-400" />
              Ajuste Anatômico da Roupa
            </h3>

            {/* Fit Preference Buttons */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">
                Caimento & Modelagem:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'slim', label: 'Slim Fit', sub: 'Ajustado' },
                  { id: 'regular', label: 'Regular', sub: 'Padrão' },
                  { id: 'oversized', label: 'Oversized', sub: 'Despojado' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onFitPreferenceChange(f.id as any);
                    }}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs transition border ${
                      fitPreference === f.id
                        ? 'border-indigo-500 bg-indigo-500/20 text-white font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className="text-[10px] opacity-75">{f.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting Selection */}
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-2">
                Iluminação do Ambiente:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {lightingOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => onLightingChange(opt.id)}
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-xs transition border ${
                      lighting === opt.id
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <opt.icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={onRecomputeTryon}
              disabled={isProcessingAI}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isProcessingAI ? 'animate-spin' : ''}`} />
              <span>{isProcessingAI ? 'Processando Ajuste...' : 'Recalcular Caimento com IA'}</span>
            </button>
          </div>

          {/* AI Tailor & Stylist Report Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                Parecer de Estilo & Biotipo
              </h3>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
                Aprovado
              </span>
            </div>

            {/* Precision metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Precisão Anatômica
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-emerald-400">
                    {stylistAnalysis?.fitAccuracy || 97}%
                  </span>
                  <span className="text-[10px] text-slate-400">ajuste real</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${stylistAnalysis?.fitAccuracy || 97}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Harmonia Visual
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-amber-400">
                    {stylistAnalysis?.harmonyScore || 9.6}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 10</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(stylistAnalysis?.harmonyScore || 9.6) * 10}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-300">Veredito do Caimento:</h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                {stylistAnalysis?.stylistVerdict}
              </p>
            </div>

            {/* Recommended occasions */}
            {stylistAnalysis?.recommendedOccasions && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-400">Ocasiões Recomendadas:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {stylistAnalysis.recommendedOccasions.map((occ: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 text-[11px] text-indigo-300 font-medium"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stylist tips */}
            {stylistAnalysis?.stylingTips && (
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300">Dicas de Combinação & Postura:</h4>
                <ul className="space-y-1.5">
                  {stylistAnalysis.stylingTips.map((tip: string, idx: number) => (
                    <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Bottom Back Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={onBackToGarments}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Trocar ou adicionar outras roupas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
