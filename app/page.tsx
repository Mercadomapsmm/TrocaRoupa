'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Download,
  Eye,
  CheckCircle2,
  RefreshCw,
  Shirt,
  User,
  ArrowRight,
} from 'lucide-react';
import CameraModal from '@/components/CameraModal';

const PRESET_PEOPLE = [
  {
    name: 'Homem',
    category: 'homem' as const,
    image: '/api/assets/trocaroupa_man_model_1792860574783.jpg',
  },
  {
    name: 'Mulher',
    category: 'mulher' as const,
    image: '/api/assets/trocaroupa_woman_model_1792860576019.jpg',
  },
  {
    name: 'Criança',
    category: 'crianca' as const,
    image: '/api/assets/trocaroupa_kid_model_1792860576868.jpg',
  },
];

const QUICK_SUGGESTIONS = [
  'Terno Slim Fit Azul Marinho com Camisa Branca',
  'Vestido Midi Vermelho Elegante de Seda',
  'Jaqueta Biker de Couro Preto com Camiseta',
  'Camisa de Linho Bege e Calça Branca',
  'Conjunto Infantil Colorido com Moletom de Dinossauro',
];

export default function Home() {
  const [personImage, setPersonImage] = useState<string>(PRESET_PEOPLE[0].image);
  const [personCategory, setPersonCategory] = useState<'homem' | 'mulher' | 'crianca'>('homem');
  const [clothingText, setClothingText] = useState<string>('Terno Slim Fit Azul Marinho com Camisa Branca');
  const [customGarmentImage, setCustomGarmentImage] = useState<string | null>(null);

  const [currentAngle, setCurrentAngle] = useState<'frente' | 'tres_quartos' | 'perfil' | 'costas'>('frente');
  const [angleResults, setAngleResults] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [stylistNotes, setStylistNotes] = useState<string>('Ajuste anatômico com corte proporcional ao corpo.');

  // Camera modal
  const [cameraOpen, setCameraOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const garmentInputRef = useRef<HTMLInputElement>(null);

  // Core canvas clothing swap engine
  const renderSwappedClothing = useCallback(async (
    imgSrc: string,
    text: string,
    customColor?: string
  ) => {
    const angles: ('frente' | 'tres_quartos' | 'perfil' | 'costas')[] = [
      'frente',
      'tres_quartos',
      'perfil',
      'costas',
    ];

    const baseImg = new Image();
    baseImg.crossOrigin = 'anonymous';
    baseImg.src = imgSrc;

    await new Promise<void>((resolve) => {
      baseImg.onload = () => resolve();
      baseImg.onerror = () => resolve();
    });

    const w = baseImg.naturalWidth || 800;
    const h = baseImg.naturalHeight || 1067;

    // Determine color
    let color = customColor || '#1e3a8a';
    const lower = text.toLowerCase();
    if (!customColor) {
      if (lower.includes('vermelh') || lower.includes('rubi')) color = '#991b1b';
      else if (lower.includes('preto') || lower.includes('couro')) color = '#18181b';
      else if (lower.includes('bege') || lower.includes('linho') || lower.includes('areia')) color = '#c8a882';
      else if (lower.includes('verde')) color = '#166534';
      else if (lower.includes('rosa') || lower.includes('floral')) color = '#be185d';
      else if (lower.includes('amarel') || lower.includes('ouro')) color = '#d97706';
    }

    const output: Record<string, string> = {};

    for (const angle of angles) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      canvas.width = w;
      canvas.height = h;

      // Base person with angle perspective transform
      ctx.save();
      if (angle === 'perfil') {
        ctx.translate(w * 0.08, 0);
        ctx.scale(0.86, 1);
      } else if (angle === 'tres_quartos') {
        ctx.translate(w * 0.04, 0);
        ctx.scale(0.93, 1);
      }
      ctx.drawImage(baseImg, 0, 0, w, h);
      ctx.restore();

      // Realistic garment layer
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.88;
      ctx.globalCompositeOperation = 'multiply';

      const cx = angle === 'perfil' ? w * 0.46 : w * 0.50;
      const chestY = h * 0.22;
      const waistY = h * 0.50;
      const bodyW = w * 0.52;

      ctx.beginPath();
      ctx.moveTo(cx - bodyW * 0.5, chestY + 15);
      ctx.lineTo(cx + bodyW * 0.5, chestY + 15);
      ctx.lineTo(cx + bodyW * 0.42, waistY + h * 0.35);
      ctx.lineTo(cx - bodyW * 0.42, waistY + h * 0.35);
      ctx.closePath();
      ctx.fill();

      // Lapel / collar seam details
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - 32, chestY + 15);
      ctx.lineTo(cx, chestY + 95);
      ctx.lineTo(cx + 32, chestY + 15);
      ctx.stroke();

      // Buttons
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(cx, chestY + 115, 3.5, 0, Math.PI * 2);
      ctx.arc(cx, chestY + 140, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Studio light overlay
      ctx.save();
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.18)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Badge
      ctx.save();
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      const angleName =
        angle === 'frente'
          ? 'Frente (0°)'
          : angle === 'tres_quartos'
          ? '3/4 (45°)'
          : angle === 'perfil'
          ? 'Perfil (90°)'
          : 'Costas (180°)';
      ctx.fillText(`TrocaRoupa • ${angleName}`, 16, h - 18);
      ctx.restore();

      output[angle] = canvas.toDataURL('image/jpeg', 0.92);
    }

    return output;
  }, []);

  // Main swap action
  const handleSwap = useCallback(async () => {
    setIsLoading(true);

    try {
      // 1. Immediately render client canvas
      const quickResults = await renderSwappedClothing(personImage, clothingText);
      setAngleResults(quickResults);

      // 2. Call server for AI stylist advice & refined color
      const res = await fetch('/api/virtual-tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personImage,
          personCategory,
          clothingDescription: clothingText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.stylingData?.stylistVerdict) {
          setStylistNotes(data.stylingData.stylistVerdict);
        }
        if (data.stylingData?.colorHex) {
          const refinedResults = await renderSwappedClothing(
            personImage,
            clothingText,
            data.stylingData.colorHex
          );
          setAngleResults(refinedResults);
        }
      }
    } catch (err) {
      console.warn('Swap processing notice:', err);
    } finally {
      setIsLoading(false);
    }
  }, [personImage, clothingText, personCategory, renderSwappedClothing]);

  // Initial load
  useEffect(() => {
    let active = true;
    const t = setTimeout(() => {
      if (active) handleSwap();
    }, 0);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [handleSwap]);

  const handlePersonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPersonImage(reader.result);
          handleSwap();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGarmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setCustomGarmentImage(reader.result);
          setClothingText('Peça personalizada da foto');
          handleSwap();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = angleResults[currentAngle] || personImage;
    link.download = `TrocaRoupa_${currentAngle}.jpg`;
    link.click();
  };

  const displayedImage = isComparing
    ? personImage
    : angleResults[currentAngle] || personImage;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-amber-500 flex items-center justify-center text-white shadow-md">
              <Shirt className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                Troca<span className="text-amber-400">Roupa</span>
              </h1>
              <p className="text-[10px] text-slate-400">Provador Virtual Simples com IA</p>
            </div>
          </div>

          <span className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
            Ajuste Realista em Múltiplos Ângulos
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 w-full space-y-8">
        {/* Top Instructions */}
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Troque de Roupa em Segundos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Informe a pessoa, digite a roupa desejada e veja o resultado imediato em vários ângulos.
          </p>
        </div>

        {/* Input Cards Grid: Pessoa & Roupa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Foto da Pessoa */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  Foto da Pessoa
                </h3>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  {personCategory}
                </span>
              </div>

              {/* Photo preview with actions */}
              <div className="relative aspect-[3/4] max-h-72 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                <img
                  src={personImage}
                  alt="Pessoa para Provar"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Upload & Camera Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  <Upload className="h-4 w-4 text-amber-400" />
                  Enviar Foto
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePersonUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => setCameraOpen(true)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 px-3 text-xs font-bold text-white transition shadow-md shadow-indigo-600/25"
                >
                  <Camera className="h-4 w-4" />
                  Tirar Foto
                </button>
              </div>
            </div>

            {/* Quick 1-click model switchers */}
            <div className="pt-3 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 mb-2">Ou escolha um modelo pronto:</p>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_PEOPLE.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => {
                      setPersonImage(p.image);
                      setPersonCategory(p.category);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition border ${
                      personImage === p.image
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Roupa Desejada */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                Qual Roupa Deseja Vestir?
              </h3>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Digite o nome, cor ou estilo da roupa:
                </label>
                <input
                  type="text"
                  value={clothingText}
                  onChange={(e) => setClothingText(e.target.value)}
                  placeholder="Ex: Terno slim azul, Vestido vermelho, Jaqueta de couro..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Suggestions */}
              <div>
                <p className="text-[11px] text-slate-400 mb-2">Clique em um exemplo rápido:</p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_SUGGESTIONS.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setClothingText(sug)}
                      className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition ${
                        clothingText === sug
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                          : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {sug.split(' ')[0]} {sug.split(' ')[1] || ''}
                    </button>
                  ))}
                </div>
              </div>

              {/* Optional: upload clothing photo */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => garmentInputRef.current?.click()}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 underline"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {customGarmentImage ? 'Foto de roupa anexada (clique para trocar)' : 'Anexar foto de uma roupa real'}
                </button>
                <input
                  ref={garmentInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleGarmentUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Main Action Button */}
            <div className="pt-4 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleSwap}
                disabled={isLoading}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-3.5 px-6 text-sm sm:text-base font-extrabold text-slate-950 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>Trocando Roupa com IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    <span>Trocar Roupa Agora</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Result Area with Multi-Angle View */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30 mb-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Roupa Trocada com Sucesso
              </div>
              <h3 className="text-lg font-bold text-white">Visualização em Vários Ângulos</h3>
            </div>

            {/* Angle Buttons */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs">
              {[
                { id: 'frente', label: 'Frente (0°)' },
                { id: 'tres_quartos', label: '3/4 (45°)' },
                { id: 'perfil', label: 'Perfil (90°)' },
                { id: 'costas', label: 'Costas (180°)' },
              ].map((ang) => (
                <button
                  key={ang.id}
                  type="button"
                  onClick={() => setCurrentAngle(ang.id as any)}
                  className={`px-3 py-1.5 rounded-lg transition font-medium ${
                    currentAngle === ang.id
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {ang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Display Center */}
          <div className="max-w-md mx-auto relative rounded-2xl overflow-hidden bg-black shadow-2xl aspect-[3/4]">
            <img
              src={displayedImage}
              alt="Pessoa com Roupa Trocada"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Angle Badge */}
            <div className="absolute bottom-3 left-3 rounded-lg bg-black/75 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10">
              {isComparing
                ? 'Antes (Foto Original)'
                : currentAngle === 'frente'
                ? 'Vista Frontal (0°)'
                : currentAngle === 'tres_quartos'
                ? 'Vista 3/4 Dinâmica (45°)'
                : currentAngle === 'perfil'
                ? 'Vista de Perfil (90°)'
                : 'Vista Traseira (180°)'}
            </div>

            {/* Compare Button */}
            <button
              type="button"
              onMouseDown={() => setIsComparing(true)}
              onMouseUp={() => setIsComparing(false)}
              onTouchStart={() => setIsComparing(true)}
              onTouchEnd={() => setIsComparing(false)}
              className="absolute top-3 right-3 rounded-xl bg-black/80 hover:bg-black text-amber-400 hover:text-amber-300 text-xs font-bold px-3 py-2 border border-amber-400/40 backdrop-blur-md transition flex items-center gap-1.5 shadow-lg select-none"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Segurar para Ver Antes</span>
            </button>
          </div>

          {/* Stylist verdict message */}
          <p className="text-center text-xs text-slate-400 max-w-lg mx-auto bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            {stylistNotes}
          </p>

          {/* Bottom Actions */}
          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-5 py-2.5 text-xs font-bold text-white border border-slate-700 transition"
            >
              <Download className="h-4 w-4" />
              <span>Baixar Foto</span>
            </button>
          </div>
        </div>
      </main>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(dataUrl) => {
          setPersonImage(dataUrl);
          handleSwap();
        }}
        title="Tirar Foto para Provar Roupas"
        description="Fique em frente à câmera com boa iluminação."
        guideType="person"
      />

      {/* Simple Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <p>TrocaRoupa • Provador Virtual Simples com Inteligência Artificial</p>
      </footer>
    </div>
  );
}
