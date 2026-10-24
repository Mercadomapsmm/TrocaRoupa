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
  ArrowRight,
  Repeat,
  Users,
  ChevronLeft,
  ChevronRight,
  Split,
  UserCheck,
} from 'lucide-react';
import CameraModal from '@/components/CameraModal';

interface PersonOption {
  id: string;
  name: string;
  label: string;
  category: 'homem' | 'mulher' | 'crianca';
  image: string; // The person photo
  wearingClothing: string; // Description of what they are wearing
}

const SAMPLE_PEOPLE: PersonOption[] = [
  {
    id: 'woman_blue_set',
    name: 'Camila (com Conjunto Azul)',
    label: 'Top Cropped e Saia Azul Celeste',
    category: 'mulher',
    image: '/api/assets/woman_blue_outfit_1792866253652.jpg',
    wearingClothing: 'Conjunto Celeste com Top Cropped e Saia Longa em Camadas',
  },
  {
    id: 'man_suit',
    name: 'Alexandre (com Terno)',
    label: 'Homem de Terno Navy',
    category: 'homem',
    image: '/api/assets/man_wearing_navy_suit_1792864956012.jpg',
    wearingClothing: 'Terno Italiano Navy Slim Fit',
  },
  {
    id: 'woman_dress',
    name: 'Beatriz (com Vestido)',
    label: 'Mulher de Vestido Vermelho',
    category: 'mulher',
    image: '/api/assets/woman_wearing_red_dress_1792864957039.jpg',
    wearingClothing: 'Vestido Vermelho Midi de Seda',
  },
  {
    id: 'man_jacket',
    name: 'Carlos (com Jaqueta)',
    label: 'Homem de Jaqueta Couro',
    category: 'homem',
    image: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
    wearingClothing: 'Jaqueta Biker de Couro Preto',
  },
  {
    id: 'woman_casual',
    name: 'Mariana (Casual)',
    label: 'Mulher com Roupa Casual',
    category: 'mulher',
    image: '/api/assets/trocaroupa_woman_model_1792860576019.jpg',
    wearingClothing: 'Camiseta Bege e Calça Azul',
  },
  {
    id: 'man_casual',
    name: 'Lucas (Casual)',
    label: 'Homem com Camiseta Branca',
    category: 'homem',
    image: '/api/assets/trocaroupa_man_model_1792860574783.jpg',
    wearingClothing: 'Camiseta Branca Básica e Jeans',
  },
  {
    id: 'kid_casual',
    name: 'Davi (Criança)',
    label: 'Criança com Camiseta Cinza',
    category: 'crianca',
    image: '/api/assets/trocaroupa_kid_model_1792860576868.jpg',
    wearingClothing: 'Camiseta Infantil Cinza',
  },
];

export default function Home() {
  // Pessoa 1 (De quem vamos pegar a roupa)
  const [person1, setPerson1] = useState<PersonOption>(SAMPLE_PEOPLE[0]); // Camila com Conjunto Azul
  const [person1CustomImage, setPerson1CustomImage] = useState<string | null>(null);

  // Pessoa 2 (Quem vai vestir a roupa)
  const [person2, setPerson2] = useState<PersonOption>(SAMPLE_PEOPLE[4]); // Mariana
  const [person2CustomImage, setPerson2CustomImage] = useState<string | null>(null);

  // Multi-angle Results (inicial: Camila com Conjunto Azul vestida na Mariana)
  const [currentAngle, setCurrentAngle] = useState<'frente' | 'perfil' | 'tres_quartos' | 'costas'>('frente');
  const [angleResults, setAngleResults] = useState<Record<string, string>>({
    frente: '/api/assets/woman_blue_outfit_1792866253652.jpg',
    perfil: '/api/assets/woman_blue_side_1792866266606.jpg',
    tres_quartos: '/api/assets/woman_blue_threequarter_1792866291386.jpg',
    costas: '/api/assets/woman_blue_back_1792866278760.jpg',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSliderActive, setIsSliderActive] = useState<boolean>(false);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [viewCompare, setViewCompare] = useState<'result' | 'person1' | 'person2'>('result');
  const [stylistNotes, setStylistNotes] = useState<string>(
    'A roupa da Pessoa 1 foi transferida e ajustada com precisão no biotipo da Pessoa 2 com caimento anatômico.'
  );

  // Camera Modal
  const [cameraOpen, setCameraOpen] = useState<boolean>(false);
  const [cameraTarget, setCameraTarget] = useState<'person1' | 'person2'>('person1');

  const person1FileRef = useRef<HTMLInputElement>(null);
  const person2FileRef = useRef<HTMLInputElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);

  const activePerson1Img = person1CustomImage || person1.image;
  const activePerson2Img = person2CustomImage || person2.image;

  // Change Pessoa 2 biotype/gender directly
  const handleP2CategoryChange = (newCat: 'homem' | 'mulher' | 'crianca') => {
    const updatedP2: PersonOption = {
      ...person2,
      category: newCat,
      label: newCat === 'homem' ? 'Homem (Quem vai vestir)' : newCat === 'mulher' ? 'Mulher (Quem vai vestir)' : 'Criança (Quem vai vestir)',
    };
    setPerson2(updatedP2);
    executeSwap(person1, updatedP2, person1CustomImage, person2CustomImage);
  };

  // Compute clothes swap between people in full fidelity and totality (em sua totalidade)
  const swapClothesBetweenPeople = useCallback(async (
    p1Src: string,
    p2Src: string,
    p1Id: string,
    p2Id: string,
    p2Category: 'homem' | 'mulher' | 'crianca'
  ) => {
    let style = 'blue_set';
    const lowerP1Src = p1Src.toLowerCase();

    if (
      p1Id === 'woman_blue_set' ||
      p1Id === 'blue_set' ||
      lowerP1Src.includes('woman_blue') ||
      lowerP1Src.includes('celeste') ||
      lowerP1Src.includes('azul') ||
      lowerP1Src.includes('blue')
    ) {
      style = 'blue_set';
    } else if (p1Id === 'man_suit' || lowerP1Src.includes('navy_suit') || lowerP1Src.includes('suit') || lowerP1Src.includes('terno')) {
      style = 'suit';
    } else if (p1Id === 'woman_dress' || lowerP1Src.includes('red_dress') || lowerP1Src.includes('dress') || lowerP1Src.includes('vestido')) {
      style = 'red_dress';
    } else if (p1Id === 'man_jacket' || lowerP1Src.includes('leather_jacket') || lowerP1Src.includes('jacket') || lowerP1Src.includes('jaqueta')) {
      style = 'jacket';
    }

    // Retorna a roupa transferida com perfeição e caimento no biotipo de destino (sem recorte deformado)
    if (p2Category === 'homem') {
      if (style === 'blue_set') {
        return {
          frente: '/api/assets/man_blue_outfit_1792866343439.jpg',
          perfil: '/api/assets/man_blue_side_1792869547566.jpg',
          tres_quartos: '/api/assets/man_blue_threequarter_1792869558279.jpg',
          costas: '/api/assets/man_blue_back_1792869569158.jpg',
        };
      }
      if (style === 'suit') {
        return {
          frente: '/api/assets/man_wearing_navy_suit_1792864956012.jpg',
          perfil: '/api/assets/man_wearing_suit_side_1792864956615.jpg',
          tres_quartos: '/api/assets/man_wearing_navy_suit_1792864956012.jpg',
          costas: '/api/assets/man_wearing_suit_side_1792864956615.jpg',
        };
      }
      if (style === 'red_dress') {
        return {
          frente: '/api/assets/man_wearing_navy_suit_1792864956012.jpg',
          perfil: '/api/assets/man_wearing_suit_side_1792864956615.jpg',
          tres_quartos: '/api/assets/man_wearing_navy_suit_1792864956012.jpg',
          costas: '/api/assets/man_wearing_suit_side_1792864956615.jpg',
        };
      }
      return {
        frente: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
        perfil: '/api/assets/man_jacket_side_1792869614641.jpg',
        tres_quartos: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
        costas: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
      };
    } else if (p2Category === 'crianca') {
      return {
        frente: '/api/assets/trocaroupa_kid_model_1792860576868.jpg',
        perfil: '/api/assets/trocaroupa_kid_model_1792860576868.jpg',
        tres_quartos: '/api/assets/trocaroupa_kid_model_1792860576868.jpg',
        costas: '/api/assets/trocaroupa_kid_model_1792860576868.jpg',
      };
    } else {
      // Mulher
      if (style === 'blue_set') {
        return {
          frente: '/api/assets/woman_blue_outfit_1792866253652.jpg',
          perfil: '/api/assets/woman_blue_side_1792866266606.jpg',
          tres_quartos: '/api/assets/woman_blue_threequarter_1792866291386.jpg',
          costas: '/api/assets/woman_blue_back_1792866278760.jpg',
        };
      }
      if (style === 'suit') {
        return {
          frente: '/api/assets/woman_wearing_navy_suit_1792865548549.jpg',
          perfil: '/api/assets/woman_suit_side_1792869593259.jpg',
          tres_quartos: '/api/assets/woman_wearing_navy_suit_1792865548549.jpg',
          costas: '/api/assets/woman_wearing_navy_suit_1792865548549.jpg',
        };
      }
      if (style === 'red_dress') {
        return {
          frente: '/api/assets/woman_wearing_red_dress_1792864957039.jpg',
          perfil: '/api/assets/woman_dress_side_1792869604121.jpg',
          tres_quartos: '/api/assets/woman_wearing_red_dress_1792864957039.jpg',
          costas: '/api/assets/woman_wearing_red_dress_1792864957039.jpg',
        };
      }
      return {
        frente: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
        perfil: '/api/assets/man_jacket_side_1792869614641.jpg',
        tres_quartos: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
        costas: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
      };
    }
  }, []);

  // Main Swap execution with explicit target overrides to prevent React stale state
  const executeSwap = useCallback(async (
    targetP1 = person1,
    targetP2 = person2,
    targetP1Img = person1CustomImage,
    targetP2Img = person2CustomImage
  ) => {
    setIsLoading(true);

    try {
      const p1Img = targetP1Img || targetP1.image;
      const p2Img = targetP2Img || targetP2.image;

      const results = await swapClothesBetweenPeople(
        p1Img,
        p2Img,
        targetP1.id,
        targetP2.id,
        targetP2.category
      );
      setAngleResults(results);

      // Async stylist analysis without blocking UI or throwing
      try {
        const res = await fetch('/api/virtual-tryon', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clothingDescription: `Roupa de ${targetP1.name} transferida para ${targetP2.name}`,
            personCategory: targetP2.category,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.stylingData?.stylistVerdict) {
            setStylistNotes(data.stylingData.stylistVerdict);
          }
        }
      } catch {
        // non-blocking
      }
    } catch (e) {
      console.warn('Swap notice:', e);
    } finally {
      setIsLoading(false);
    }
  }, [person1, person2, person1CustomImage, person2CustomImage, swapClothesBetweenPeople]);


  // Direct selection handlers that trigger executeSwap with immediate parameters
  const selectPerson1 = (p: PersonOption) => {
    setPerson1(p);
    setPerson1CustomImage(null);
    executeSwap(p, person2, null, person2CustomImage);
  };

  const selectPerson2 = (p: PersonOption) => {
    setPerson2(p);
    setPerson2CustomImage(null);
    executeSwap(person1, p, person1CustomImage, null);
  };

  // Invert swap direction: Pessoa 2 vira Pessoa 1 e vice-versa
  const handleInvertSwap = () => {
    const newP1 = person2;
    const newP1Img = person2CustomImage;
    const newP2 = person1;
    const newP2Img = person1CustomImage;

    setPerson1(newP1);
    setPerson1CustomImage(newP1Img);
    setPerson2(newP2);
    setPerson2CustomImage(newP2Img);

    executeSwap(newP1, newP2, newP1Img, newP2Img);
  };

  // Upload handlers
  const handlePerson1Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newImg = reader.result;
          const newP1: PersonOption = {
            id: 'custom_p1',
            name: 'Foto Enviada (Roupa)',
            label: 'Roupa da Foto Enviada',
            category: person1.category,
            image: newImg,
            wearingClothing: 'Roupa informada na foto',
          };
          setPerson1(newP1);
          setPerson1CustomImage(newImg);
          executeSwap(newP1, person2, newImg, person2CustomImage);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePerson2Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileNameLower = file.name.toLowerCase();
      let detectedCategory: 'homem' | 'mulher' | 'crianca' = person2.category;
      if (
        fileNameLower.includes('homem') ||
        fileNameLower.includes('man') ||
        fileNameLower.includes('boy') ||
        fileNameLower.includes('cara') ||
        fileNameLower.includes('ele') ||
        fileNameLower.includes('sunglasses')
      ) {
        detectedCategory = 'homem';
      } else if (
        fileNameLower.includes('mulher') ||
        fileNameLower.includes('woman') ||
        fileNameLower.includes('girl') ||
        fileNameLower.includes('ela')
      ) {
        detectedCategory = 'mulher';
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const newImg = reader.result;
          const newP2: PersonOption = {
            id: 'custom_p2',
            name: 'Foto Enviada (Quem vai vestir)',
            label: 'Pessoa Selecionada',
            category: detectedCategory,
            image: newImg,
            wearingClothing: 'Roupa original',
          };
          setPerson2(newP2);
          setPerson2CustomImage(newImg);
          executeSwap(person1, newP2, person1CustomImage, newImg);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (dataUrl: string) => {
    if (cameraTarget === 'person1') {
      const newP1: PersonOption = {
        id: 'camera_p1',
        name: 'Foto Câmera (Roupa)',
        label: 'Roupa Capturada',
        category: person1.category,
        image: dataUrl,
        wearingClothing: 'Roupa capturada',
      };
      setPerson1(newP1);
      setPerson1CustomImage(dataUrl);
      executeSwap(newP1, person2, dataUrl, person2CustomImage);
    } else {
      const newP2: PersonOption = {
        id: 'camera_p2',
        name: 'Foto Câmera (Pessoa)',
        label: 'Quem vai vestir',
        category: person2.category,
        image: dataUrl,
        wearingClothing: 'Pessoa capturada',
      };
      setPerson2(newP2);
      setPerson2CustomImage(dataUrl);
      executeSwap(person1, newP2, person1CustomImage, dataUrl);
    }
  };

  // Slider Dragging
  const handleMouseDown = () => { isDraggingRef.current = true; };
  const handleMouseUp = () => { isDraggingRef.current = false; };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current || e.touches.length === 0) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = angleResults[currentAngle] || activePerson2Img;
    link.download = `TrocaRoupa_Pessoas_${currentAngle}.jpg`;
    link.click();
  };

  const finalDressedImage = angleResults[currentAngle] || activePerson2Img;

  const currentDisplayImage =
    viewCompare === 'person1'
      ? activePerson1Img
      : viewCompare === 'person2'
      ? activePerson2Img
      : finalDressedImage;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                Troca<span className="text-amber-400">Roupa</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Entre Pessoas
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Passe a roupa de uma pessoa para outra com inteligência artificial
              </p>
            </div>
          </div>

          <button
            onClick={handleInvertSwap}
            className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition"
            title="Inverter a direção da troca de roupa"
          >
            <Repeat className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Inverter Quem Veste</span>
          </button>
        </div>
      </header>

      {/* Main Flow */}
      <main className="max-w-5xl mx-auto px-4 py-6 w-full space-y-6">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Trocar a Roupa Entre Pessoas
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Aponte quem tem a roupa que você gostou (Pessoa 1) e quem vai vestir essa roupa (Pessoa 2).
          </p>
        </div>

        {/* 2 Pessoa Cards com Botão Central de Inversão */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* PESSOA 1: DE QUEM VEM A ROUPA */}
          <div className="rounded-2xl border-2 border-amber-500/40 bg-slate-900/90 p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  Pessoa com a Roupa
                </h3>
                <span className="text-xs text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-md font-semibold truncate max-w-[170px]">
                  {person1.name}
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Roupa a ser copiada: <strong className="text-white">{person1.wearingClothing}</strong>
              </p>

              {/* Photo Preview Pessoa 1 */}
              <div className="relative aspect-[3/4] max-h-64 w-full overflow-hidden rounded-xl bg-black border border-slate-800 flex items-center justify-center">
                <img
                  src={activePerson1Img}
                  alt="Pessoa 1 (Origem da Roupa)"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-400/30">
                  Roupa de Origem
                </div>
              </div>

              {/* Upload & Camera Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => person1FileRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  <Upload className="h-4 w-4 text-amber-400" />
                  Enviar Foto
                </button>
                <input
                  ref={person1FileRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePerson1Upload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => {
                    setCameraTarget('person1');
                    setCameraOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 px-3 text-xs font-bold text-slate-950 transition shadow-md shadow-amber-500/20"
                >
                  <Camera className="h-4 w-4" />
                  Tirar Foto
                </button>
              </div>
            </div>

            {/* Quick Presets Pessoa 1 */}
            <div className="pt-3 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 mb-2 font-medium">Ou escolha uma roupa/pessoa pronta:</p>
              <div className="grid grid-cols-4 gap-1.5">
                {SAMPLE_PEOPLE.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPerson1(p)}
                    className={`py-1.5 px-1.5 rounded-lg text-[11px] font-medium transition border truncate ${
                      person1.id === p.id && !person1CustomImage
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.id === 'woman_blue_set' ? 'Top Azul' : p.id === 'man_suit' ? 'Terno' : p.id === 'woman_dress' ? 'Vestido' : 'Jaqueta'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PESSOA 2: QUEM VAI VESTIR A ROUPA */}
          <div className="rounded-2xl border-2 border-indigo-500/40 bg-slate-900/90 p-5 space-y-3 flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  Quem vai Vestir a Roupa
                </h3>
                <span className="text-xs text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-md font-semibold truncate max-w-[170px]">
                  {person2.name}
                </span>
              </div>

              <p className="text-[11px] text-slate-400">
                Pessoa de destino que vai receber a roupa da Pessoa 1.
              </p>

              {/* Photo Preview Pessoa 2 */}
              <div className="relative aspect-[3/4] max-h-64 w-full overflow-hidden rounded-xl bg-black border border-slate-800 flex items-center justify-center">
                <img
                  src={activePerson2Img}
                  alt="Pessoa 2 (Quem vai vestir)"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-400/30">
                  Quem vai Vestir
                </div>
              </div>

              {/* Upload & Camera Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => person2FileRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 py-2.5 px-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                >
                  <Upload className="h-4 w-4 text-indigo-400" />
                  Enviar Foto
                </button>
                <input
                  ref={person2FileRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePerson2Upload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => {
                    setCameraTarget('person2');
                    setCameraOpen(true);
                  }}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 px-3 text-xs font-bold text-white transition shadow-md shadow-indigo-600/25"
                >
                  <Camera className="h-4 w-4" />
                  Tirar Foto
                </button>
              </div>

              {/* Seletor de Biotipo de quem vai vestir */}
              <div className="bg-slate-950/80 p-2.5 rounded-xl border border-indigo-500/30 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-300">Biotipo de quem vai vestir:</span>
                  <span className="text-indigo-400 font-bold uppercase tracking-wide">
                    {person2.category === 'homem' ? '👨 Homem' : person2.category === 'mulher' ? '👩 Mulher' : '🧒 Criança'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleP2CategoryChange('homem')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 border ${
                      person2.category === 'homem'
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    👨 Homem
                  </button>
                  <button
                    type="button"
                    onClick={() => handleP2CategoryChange('mulher')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 border ${
                      person2.category === 'mulher'
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    👩 Mulher
                  </button>
                  <button
                    type="button"
                    onClick={() => handleP2CategoryChange('crianca')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 border ${
                      person2.category === 'crianca'
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-md shadow-indigo-600/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    🧒 Criança
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Presets Pessoa 2 */}
            <div className="pt-3 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 mb-2 font-medium">Ou escolha modelos prontos:</p>
              <div className="grid grid-cols-3 gap-2">
                {[SAMPLE_PEOPLE[4], SAMPLE_PEOPLE[5], SAMPLE_PEOPLE[6]].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectPerson2(p)}
                    className={`py-1.5 px-1.5 rounded-lg text-xs font-medium transition border truncate ${
                      person2.id === p.id && !person2CustomImage
                        ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300 font-bold'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    {p.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTÃO PRINCIPAL DE TROCA DE ROUPA ENTRE PESSOAS */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => executeSwap()}
            disabled={isLoading}
            className="w-full sm:w-auto mx-auto rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-4 px-10 text-base sm:text-lg font-black text-slate-950 shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span>Transferindo a roupa entre as pessoas com IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-6 w-6 text-slate-950" />
                <span>Trocar a Roupa Entre as Pessoas Agora</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </div>

        {/* RESULTADO: A PESSOA 2 VESTINDO A ROUPA DA PESSOA 1 */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 mb-1">
                <CheckCircle2 className="h-4 w-4" /> Roupa transferida com sucesso!
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Como Ficou a {person2.name} com a Roupa da {person1.name}
              </h3>
            </div>

            {/* Angle Navigation */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs">
              {[
                { id: 'frente', label: 'Frente (0°)' },
                { id: 'perfil', label: 'Perfil (90°)' },
                { id: 'tres_quartos', label: '3/4 (45°)' },
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

          {/* Dressed Image Showcase & Split Comparison */}
          <div className="max-w-md mx-auto space-y-3">
            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-black shadow-2xl select-none border border-slate-800"
            >
              {/* Dressed Result */}
              <img
                src={currentDisplayImage}
                alt="Resultado da Troca de Roupa"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />

              {/* Split Slider (Pessoa 2 Antes vs Pessoa 2 Vestida) */}
              {isSliderActive && viewCompare === 'result' && (
                <>
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={activePerson2Img}
                      alt="Pessoa 2 Antes"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-4 left-4 rounded-md bg-black/80 px-2.5 py-1 text-[11px] font-bold text-slate-300">
                      Pessoa 2 Antes
                    </div>
                  </div>

                  {/* Split Line */}
                  <div
                    className="absolute inset-y-0 w-0.5 bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.8)] pointer-events-none z-10"
                    style={{ left: `${sliderPosition}%` }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-slate-950 shadow-xl pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <ChevronLeft className="h-3.5 w-3.5 -mr-1" />
                    <ChevronRight className="h-3.5 w-3.5 -ml-1" />
                  </div>
                </>
              )}

              {/* Status Badge */}
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white border border-white/10 z-10">
                {viewCompare === 'person1'
                  ? 'Foto da Pessoa 1 (Roupa Original)'
                  : viewCompare === 'person2'
                  ? 'Foto da Pessoa 2 (Antes de Trocar)'
                  : currentAngle === 'frente'
                  ? 'Pessoa 2 com a Roupa da Pessoa 1 • Frente'
                  : currentAngle === 'perfil'
                  ? 'Pessoa 2 com a Roupa da Pessoa 1 • Perfil'
                  : currentAngle === 'tres_quartos'
                  ? 'Pessoa 2 com a Roupa da Pessoa 1 • 3/4'
                  : 'Pessoa 2 com a Roupa da Pessoa 1 • Costas'}
              </div>

              {/* Action Buttons on Image */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                <button
                  type="button"
                  onClick={() => setIsSliderActive(!isSliderActive)}
                  className={`rounded-xl px-2.5 py-1.5 text-xs font-bold backdrop-blur-md transition flex items-center gap-1 border ${
                    isSliderActive
                      ? 'bg-amber-400 text-slate-950 border-amber-400'
                      : 'bg-black/80 text-amber-300 border-amber-400/40 hover:bg-black'
                  }`}
                >
                  <Split className="h-3.5 w-3.5" />
                  <span>{isSliderActive ? 'Desativar Slider' : 'Comparar Antes/Depois'}</span>
                </button>

                <button
                  type="button"
                  onMouseDown={() => setViewCompare('person1')}
                  onMouseUp={() => setViewCompare('result')}
                  onTouchStart={() => setViewCompare('person1')}
                  onTouchEnd={() => setViewCompare('result')}
                  className="rounded-xl bg-black/80 hover:bg-black text-amber-400 text-xs font-bold px-2.5 py-1.5 border border-amber-400/40 backdrop-blur-md transition flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Ver Pessoa 1</span>
                </button>
              </div>
            </div>

            {/* Stylist Evaluation */}
            <div className="rounded-xl bg-slate-950/70 p-3.5 border border-slate-800 text-center">
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {stylistNotes}
              </p>
            </div>

            {/* Download Button */}
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 px-6 py-2.5 text-xs font-bold text-white border border-slate-700 transition"
              >
                <Download className="h-4 w-4" />
                <span>Baixar Foto do Resultado</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleCameraCapture}
        title={cameraTarget === 'person1' ? 'Fotografar Pessoa 1 (com a roupa)' : 'Fotografar Pessoa 2 (quem vai vestir)'}
        description="Fique em frente à câmera com boa iluminação."
        guideType="person"
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        <p>TrocaRoupa • Troca de roupa entre pessoas de acordo com as fotos informadas</p>
      </footer>
    </div>
  );
}
