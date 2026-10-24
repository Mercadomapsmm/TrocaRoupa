'use client';

import React from 'react';
import { Sparkles, Shirt, Bookmark, RefreshCw, Volume2, HelpCircle } from 'lucide-react';

interface NavbarProps {
  currentStep: number;
  onStepChange: (step: number) => void;
  canNavigateToStep: (step: number) => boolean;
  savedCount: number;
  onOpenSaved: () => void;
  onReset: () => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
}

export default function Navbar({
  currentStep,
  onStepChange,
  canNavigateToStep,
  savedCount,
  onOpenSaved,
  onReset,
  isHighContrast,
  onToggleHighContrast,
}: NavbarProps) {
  const steps = [
    { num: 1, title: '1. Pessoa' },
    { num: 2, title: '2. Roupas' },
    { num: 3, title: '3. Ângulos & Ajuste' },
    { num: 4, title: '4. Estúdio Final' },
  ];

  const handleSpeakHelp = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const messages = [
        'Passo 1: Escolha ou tire uma foto sua, de uma mulher, homem ou criança.',
        'Passo 2: Escolha uma ou mais roupas, ou fotografe uma peça com a câmera.',
        'Passo 3: Ajuste a modelagem e escolha os ângulos de visualização.',
        'Passo 4: Veja o resultado com inteligência artificial, compare antes e depois e baixe a foto.',
      ];
      const text = messages[currentStep - 1] || 'Bem-vindo ao TrocaRoupa, seu provador virtual inteligente.';
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-2.5 text-left transition hover:opacity-90"
            title="Voltar ao início do TrocaRoupa"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 shadow-lg shadow-indigo-600/25">
              <Shirt className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Troca<span className="text-amber-400">Roupa</span>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/30">
                  IA 360°
                </span>
              </span>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Provador Virtual Multidimensional
              </p>
            </div>
          </button>
        </div>

        {/* Step Indicator on Desktop */}
        <nav className="hidden md:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 p-1">
          {steps.map((s) => {
            const isActive = currentStep === s.num;
            const isClickable = canNavigateToStep(s.num);
            return (
              <button
                key={s.num}
                onClick={() => isClickable && onStepChange(s.num)}
                disabled={!isClickable}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                    : isClickable
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <span>{s.title}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Audio voice assistant button */}
          <button
            onClick={handleSpeakHelp}
            aria-label="Ouvir instrução por voz"
            title="Ouvir instrução por voz (ajuda acessível)"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white transition"
          >
            <Volume2 className="h-4 w-4" />
          </button>

          {/* High contrast / large accessibility */}
          <button
            onClick={onToggleHighContrast}
            aria-label="Alternar modo de acessibilidade"
            title={isHighContrast ? 'Modo Visual Padrão' : 'Modo Alta Legibilidade'}
            className={`flex h-9 px-2.5 items-center gap-1.5 rounded-lg border text-xs font-medium transition ${
              isHighContrast
                ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <span className="font-bold text-sm">A+</span>
            <span className="hidden sm:inline">Legível</span>
          </button>

          {/* Saved looks button */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 hover:text-white transition"
          >
            <Bookmark className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Looks Salvos</span>
            {savedCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                {savedCount}
              </span>
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            title="Limpar e recomeçar"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:border-rose-900 hover:text-rose-400 transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Mobile Step Bar */}
      <div className="flex md:hidden border-t border-slate-800/60 bg-slate-900/50 px-2 py-1.5 overflow-x-auto justify-between">
        {steps.map((s) => {
          const isActive = currentStep === s.num;
          const isClickable = canNavigateToStep(s.num);
          return (
            <button
              key={s.num}
              onClick={() => isClickable && onStepChange(s.num)}
              disabled={!isClickable}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-full whitespace-nowrap transition ${
                isActive
                  ? 'bg-indigo-600 text-white font-semibold'
                  : isClickable
                  ? 'text-slate-300'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              {s.title}
            </button>
          );
        })}
      </div>
    </header>
  );
}
