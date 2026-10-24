'use client';

import React from 'react';
import { Sparkles, Camera, ArrowRight, Shirt, Compass, CheckCircle2, Users } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
  onQuickDemo: (category: 'homem' | 'mulher' | 'crianca') => void;
}

export default function HeroSection({ onStart, onQuickDemo }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950 mb-10 shadow-2xl">
      {/* Background Hero Image with Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="/api/assets/trocaroupa_hero_banner_1792860576437.jpg"
          alt="Estúdio de Provador Virtual TrocaRoupa"
          className="h-full w-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/50 to-slate-950" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 max-w-4xl mx-auto text-center space-y-6">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 shadow-inner">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Provador Virtual de Roupas & Acessórios com IA</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
          Troque de roupa em pessoas reais com{' '}
          <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-indigo-400 bg-clip-text text-transparent">
            Inteligência Artificial
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Tire fotos com sua câmera ou escolha na galeria. Vista instantaneamente peças e
          acessórios para <strong className="text-white">homens, mulheres e crianças</strong>,
          com ajuste anatômico realista e visualização em <strong className="text-amber-400">vários ângulos</strong>.
        </p>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-2xl mx-auto text-left">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Câmera em Tempo Real</span>
              <span className="text-[11px] text-slate-400">Capture pessoas e peças</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Homens, Mulheres e Crianças</span>
              <span className="text-[11px] text-slate-400">Moda para toda a família</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Vários Ângulos</span>
              <span className="text-[11px] text-slate-400">Frente, perfil, 3/4 e costas</span>
            </div>
          </div>
        </div>

        {/* Primary CTA and Fast Demo */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onStart}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-8 py-4 text-base font-extrabold text-slate-950 shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition duration-200"
          >
            <span>Experimentar Agora</span>
            <ArrowRight className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hidden sm:inline">Ou teste rápido com:</span>
            <button
              onClick={() => onQuickDemo('homem')}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-medium text-slate-200 hover:text-white hover:border-slate-500 transition"
            >
              Homem
            </button>
            <button
              onClick={() => onQuickDemo('mulher')}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-medium text-slate-200 hover:text-white hover:border-slate-500 transition"
            >
              Mulher
            </button>
            <button
              onClick={() => onQuickDemo('crianca')}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-medium text-slate-200 hover:text-white hover:border-slate-500 transition"
            >
              Criança
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
