'use client';

import React, { useState, useRef } from 'react';
import {
  Shirt,
  Sparkles,
  Camera,
  Upload,
  Check,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Glasses,
  Footprints,
  ShoppingBag,
  Sliders,
  Filter,
} from 'lucide-react';
import { CLOTHING_CATALOG, ClothingItem } from '@/lib/catalog';

interface GarmentStepProps {
  personCategory: 'homem' | 'mulher' | 'crianca';
  selectedGarments: ClothingItem[];
  customGarmentImage: string | null;
  customNotes: string;
  onToggleGarment: (garment: ClothingItem) => void;
  onRemoveGarment: (garmentId: string) => void;
  onClearGarments: () => void;
  onSetCustomGarmentImage: (img: string | null) => void;
  onSetCustomNotes: (notes: string) => void;
  onOpenGarmentCamera: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export default function GarmentStep({
  personCategory,
  selectedGarments,
  customGarmentImage,
  customNotes,
  onToggleGarment,
  onRemoveGarment,
  onClearGarments,
  onSetCustomGarmentImage,
  onSetCustomNotes,
  onOpenGarmentCamera,
  onNextStep,
  onPrevStep,
}: GarmentStepProps) {
  // Category default matches the person chosen
  const [activeAudience, setActiveAudience] = useState<'todos' | 'homem' | 'mulher' | 'crianca'>(personCategory || 'todos');
  const [activeType, setActiveType] = useState<'todos' | 'completo' | 'superior' | 'inferior' | 'calcado' | 'acessorio'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

  const garmentFileRef = useRef<HTMLInputElement>(null);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSetCustomGarmentImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredCatalog = CLOTHING_CATALOG.filter((item) => {
    const matchAudience =
      activeAudience === 'todos' || item.category === activeAudience || item.category === 'unissex';
    const matchType = activeType === 'todos' || item.type === activeType;
    const matchQuery =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase());
    return matchAudience && matchType && matchQuery;
  });

  const totalSelectedCount = selectedGarments.length + (customGarmentImage ? 1 : 0);

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300">
          <Shirt className="h-3.5 w-3.5" />
          Passo 2 de 4 • Roupas & Acessórios
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          O que deseja vestir hoje?
        </h2>
        <p className="text-sm text-slate-400">
          Você pode fotografar uma peça sua (roupa ou acessório), digitar um pedido especial ou
          combinar peças do nosso catálogo inteligente para Homens, Mulheres e Crianças.
        </p>
      </div>

      {/* Top Banner: Custom Capture of Real Garments */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-300">
              <Camera className="h-3 w-3" />
              Captura de Peça Real
            </div>
            <h3 className="text-lg font-bold text-white">
              Quer testar uma roupa sua da vida real?
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Tire uma foto de uma camisa, vestido, casaco ou acessório no cabide, na loja ou na mesa. A IA vai reconhecer a peça e ajustá-la no corpo!
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
            {customGarmentImage ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3.5 py-2">
                <div className="h-10 w-10 overflow-hidden rounded-lg border border-emerald-400/50">
                  <img
                    src={customGarmentImage}
                    alt="Peça Fotografada"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-emerald-300 block">Peça Capturada</span>
                  <button
                    onClick={() => onSetCustomGarmentImage(null)}
                    className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Remover
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={onOpenGarmentCamera}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition"
                >
                  <Camera className="h-4 w-4" />
                  Fotografar com a Câmera
                </button>

                <button
                  onClick={() => garmentFileRef.current?.click()}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  <Upload className="h-4 w-4" />
                  Enviar Foto da Roupa
                </button>
                <input
                  ref={garmentFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCustomUpload}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>

        {/* Custom notes input */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <label className="text-xs font-semibold text-slate-300 whitespace-nowrap flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Detalhes ou Estilo Desejado:
          </label>
          <input
            type="text"
            value={customNotes}
            onChange={(e) => onSetCustomNotes(e.target.value)}
            placeholder="Ex: Terno ajustado para casamento, vestido de seda vermelho, óculos escuros..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Catalog Filters Bar */}
      <div className="space-y-3">
        {/* Audience Pill Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs">
            <button
              onClick={() => setActiveAudience('todos')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeAudience === 'todos'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos os Públicos
            </button>
            <button
              onClick={() => setActiveAudience('homem')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeAudience === 'homem'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Homens
            </button>
            <button
              onClick={() => setActiveAudience('mulher')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeAudience === 'mulher'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mulheres
            </button>
            <button
              onClick={() => setActiveAudience('crianca')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeAudience === 'crianca'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Crianças
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar peça, cor ou tecido..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'todos', label: 'Todas as Peças' },
            { id: 'completo', label: 'Looks & Vestidos' },
            { id: 'superior', label: 'Camisas & Casacos' },
            { id: 'inferior', label: 'Calças & Jeans' },
            { id: 'acessorio', label: 'Acessórios & Óculos' },
            { id: 'calcado', label: 'Calçados' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setActiveType(type.id as any)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition border ${
                activeType === type.id
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 font-semibold'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Garment Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCatalog.map((item) => {
          const isSelected = selectedGarments.some((g) => g.id === item.id);
          return (
            <div
              key={item.id}
              onClick={() => onToggleGarment(item)}
              className={`group relative flex flex-col justify-between rounded-2xl border-2 p-4 transition cursor-pointer bg-slate-900/80 ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/10'
                  : 'border-slate-800 hover:border-slate-600 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Header row with color badge & category */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300 uppercase">
                    {item.typeName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-xs"
                      style={{ backgroundColor: item.colorHex }}
                      title={`Cor: ${item.color}`}
                    />
                    {item.badge && (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Garment Name */}
                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                  {item.name}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {item.description}
                </p>

                {/* Fabric & Style specs */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300">
                    Tecido: {item.fabric}
                  </span>
                  <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-400">
                    {item.style}
                  </span>
                </div>
              </div>

              {/* Selection Toggle Button */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {isSelected ? 'Peça Selecionada' : 'Clique para Escolher'}
                </span>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold transition ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'border border-slate-700 bg-slate-800 text-slate-400 group-hover:text-white group-hover:border-slate-500'
                  }`}
                >
                  {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Items Summary Sticky Bar */}
      <div className="sticky bottom-4 z-30 max-w-4xl mx-auto rounded-2xl border border-slate-700 bg-slate-900/95 backdrop-blur-md p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-sm">
            {totalSelectedCount}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">
                {totalSelectedCount === 0
                  ? 'Nenhuma peça selecionada ainda'
                  : `${totalSelectedCount} ${totalSelectedCount === 1 ? 'peça escolhida' : 'peças escolhidas'}`}
              </span>
              {totalSelectedCount > 0 && (
                <button
                  onClick={onClearGarments}
                  className="text-[10px] text-rose-400 hover:underline"
                >
                  Limpar Todas
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1">
              {selectedGarments.map((g) => g.name).join(' • ') ||
                (customGarmentImage ? 'Foto personalizada da roupa' : 'Selecione roupas acima para vestir')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onPrevStep}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>

          <button
            onClick={onNextStep}
            disabled={totalSelectedCount === 0 && !customNotes}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Avançar para Ajuste & Ângulos</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
