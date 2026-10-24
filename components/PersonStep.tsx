'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, User, CheckCircle2, Sparkles, ArrowRight, Baby, UserCheck, ShieldCheck } from 'lucide-react';
import { PERSON_PRESETS, PersonPreset } from '@/lib/catalog';

interface PersonStepProps {
  selectedPersonImage: string | null;
  selectedPersonCategory: 'homem' | 'mulher' | 'crianca';
  selectedPersonName: string;
  onSelectPerson: (imageSrc: string, category: 'homem' | 'mulher' | 'crianca', name: string) => void;
  onOpenLiveCamera: () => void;
  onNextStep: () => void;
}

export default function PersonStep({
  selectedPersonImage,
  selectedPersonCategory,
  selectedPersonName,
  onSelectPerson,
  onOpenLiveCamera,
  onNextStep,
}: PersonStepProps) {
  const [filterCategory, setFilterCategory] = useState<'todos' | 'homem' | 'mulher' | 'crianca'>('todos');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSelectPerson(reader.result, selectedPersonCategory || 'homem', 'Minha Foto');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredPresets = PERSON_PRESETS.filter(
    (p) => filterCategory === 'todos' || p.genderCategory === filterCategory
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Passo 1 de 4 • Seleção da Pessoa
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Quem vai vestir o novo visual?
        </h2>
        <p className="text-sm text-slate-400">
          Você pode tirar uma foto agora pela câmera, enviar uma foto da sua galeria ou testar
          imediatamente com um de nossos modelos de estúdio em alta resolução.
        </p>
      </div>

      {/* Main 3 Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        {/* Option 1: Live Camera */}
        <button
          onClick={onOpenLiveCamera}
          className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-indigo-600/40 bg-gradient-to-b from-indigo-950/40 to-slate-900/80 p-6 text-center transition hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/15"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-amber-500 shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition duration-300 mb-4">
            <Camera className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
            Tirar Foto com a Câmera
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Abra a webcam ou a câmera do celular com contagem regressiva e guia de enquadramento corporal.
          </p>
          <span className="mt-4 rounded-full bg-indigo-500/20 px-3 py-1 text-[11px] font-semibold text-indigo-300 border border-indigo-500/30">
            Recomendado para Você
          </span>
        </button>

        {/* Option 2: Upload File */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-slate-800 bg-slate-900/60 p-6 text-center cursor-pointer transition hover:border-slate-700 hover:bg-slate-900"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 border border-slate-700 group-hover:scale-110 group-hover:border-slate-600 transition duration-300 mb-4">
            <Upload className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-slate-100 transition">
            Enviar Foto da Galeria
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Selecione uma foto já salva no seu computador ou celular (PNG, JPG, WEBP).
          </p>
          <span className="mt-4 rounded-full bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-300 border border-slate-700">
            Clique para Procurar
          </span>
        </div>
      </div>

      {/* Option 3: Ready Presets (Homens, Mulheres, Crianças) */}
      <div className="max-w-5xl mx-auto space-y-4 pt-4 border-t border-slate-800/80">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-amber-400" />
              Ou escolha um modelo real para teste rápido:
            </h3>
            <p className="text-xs text-slate-400">
              Fotografias profissionais em iluminação neutra de estúdio
            </p>
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
            <button
              onClick={() => setFilterCategory('todos')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === 'todos'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterCategory('homem')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === 'homem'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Homens
            </button>
            <button
              onClick={() => setFilterCategory('mulher')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === 'mulher'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mulheres
            </button>
            <button
              onClick={() => setFilterCategory('crianca')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterCategory === 'crianca'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Crianças
            </button>
          </div>
        </div>

        {/* Model cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {filteredPresets.map((preset) => {
            const isSelected = selectedPersonImage === preset.image;
            return (
              <div
                key={preset.id}
                onClick={() => onSelectPerson(preset.image, preset.genderCategory, preset.name)}
                className={`group relative overflow-hidden rounded-2xl border-2 transition-all cursor-pointer bg-slate-900 ${
                  isSelected
                    ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-xl shadow-amber-500/10'
                    : 'border-slate-800 hover:border-slate-600 hover:shadow-lg'
                }`}
              >
                {/* Photo */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-950">
                  <img
                    src={preset.image}
                    alt={preset.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-slate-200 border border-slate-700/60">
                      {preset.ageGroup}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-md">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  )}

                  {/* Model info bottom */}
                  <div className="absolute bottom-3 inset-x-3 text-left">
                    <h4 className="text-base font-bold text-white flex items-center gap-1.5">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                      {preset.tagline}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Currently Selected Bar & Next Step CTA */}
      {selectedPersonImage && (
        <div className="sticky bottom-4 z-30 max-w-4xl mx-auto rounded-2xl border border-amber-500/30 bg-slate-900/95 backdrop-blur-md p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-amber-400/60 bg-slate-950 shrink-0">
              <img
                src={selectedPersonImage}
                alt="Pessoa Selecionada"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Pessoa Pronta
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] uppercase font-bold text-slate-300">
                  {selectedPersonCategory}
                </span>
              </div>
              <p className="text-sm font-bold text-white">{selectedPersonName}</p>
              <p className="text-[11px] text-slate-400">
                A foto está ajustada e pronta para receber as roupas e acessórios.
              </p>
            </div>
          </div>

          <button
            onClick={onNextStep}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition duration-200"
          >
            <span>Escolher Roupas</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
