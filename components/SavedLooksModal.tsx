'use client';

import React from 'react';
import { X, Trash2, Download, Calendar, Bookmark, Shirt, Eye } from 'lucide-react';

export interface SavedLook {
  id: string;
  name: string;
  personName: string;
  personCategory: string;
  timestamp: string;
  image: string;
  garmentsCount: number;
  garmentNames: string[];
}

interface SavedLooksModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedLooks: SavedLook[];
  onDeleteLook: (id: string) => void;
  onLoadLook: (look: SavedLook) => void;
}

export default function SavedLooksModal({
  isOpen,
  onClose,
  savedLooks,
  onDeleteLook,
  onLoadLook,
}: SavedLooksModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-amber-400" />
              Meu Closet & Looks Salvos ({savedLooks.length})
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Histórico de combinações e trocas de roupas salvas no seu dispositivo
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedLooks.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-slate-800 text-slate-500">
                <Shirt className="h-8 w-8" />
              </div>
              <h4 className="text-sm font-bold text-slate-300">Nenhum look salvo ainda</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No Estúdio, clique no botão &ldquo;Salvar no Closet&rdquo; para guardar suas combinações favoritas de roupas e acessórios.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedLooks.map((look) => (
                <div
                  key={look.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-3 hover:border-slate-700 transition"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-black">
                    <img
                      src={look.image}
                      alt={look.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="rounded-md bg-black/70 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-amber-300">
                        {look.personCategory.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    <h4 className="text-sm font-bold text-white line-clamp-1">{look.name}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1">
                      {look.garmentNames.join(', ')}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(look.timestamp).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        onLoadLook(look);
                        onClose();
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600 hover:text-white py-1.5 text-xs font-semibold transition"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Visualizar
                    </button>

                    <a
                      href={look.image}
                      download={`${look.name}.jpg`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition"
                      title="Baixar Foto"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </a>

                    <button
                      onClick={() => onDeleteLook(look.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:border-rose-900 hover:text-rose-400 transition"
                      title="Excluir do Closet"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
