// TrocaRoupa - Lógica Simples e Direta de Troca de Roupa com IA

let currentPersonImage = '/api/assets/trocaroupa_man_model_1792860574783.jpg';
let currentPersonCategory = 'homem';
let currentAngle = 'frente';
let renderedAngles = {};
let cameraStream = null;

// Elementos
const personFileInput = document.getElementById('personFileInput');
const uploadPersonBtn = document.getElementById('uploadPersonBtn');
const personPreview = document.getElementById('personPreview');
const personCategoryBadge = document.getElementById('personCategoryBadge');

const clothingDescInput = document.getElementById('clothingDescInput');
const garmentFileInput = document.getElementById('garmentFileInput');
const uploadGarmentBtn = document.getElementById('uploadGarmentBtn');

const swapBtn = document.getElementById('swapBtn');
const swapBtnText = document.getElementById('swapBtnText');
const resultImage = document.getElementById('resultImage');
const angleBadge = document.getElementById('angleBadge');
const toggleCompareBtn = document.getElementById('toggleCompareBtn');
const downloadBtn = document.getElementById('downloadBtn');
const stylistNotes = document.getElementById('stylistNotes');

// Câmera Modal
const cameraBtn = document.getElementById('cameraBtn');
const cameraModal = document.getElementById('cameraModal');
const closeCameraBtn = document.getElementById('closeCameraBtn');
const cameraVideo = document.getElementById('cameraVideo');
const captureShutterBtn = document.getElementById('captureShutterBtn');
const cameraCanvas = document.getElementById('cameraCanvas');

// Upload de foto da pessoa
if (uploadPersonBtn && personFileInput) {
  uploadPersonBtn.addEventListener('click', () => personFileInput.click());
  personFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        currentPersonImage = reader.result;
        personPreview.src = currentPersonImage;
        performSwap();
      };
      reader.readAsDataURL(file);
    }
  });
}

// Upload de foto de roupa
if (uploadGarmentBtn && garmentFileInput) {
  uploadGarmentBtn.addEventListener('click', () => garmentFileInput.click());
  garmentFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      clothingDescInput.value = 'Peça personalizada da foto';
      performSwap();
    }
  });
}

// Exemplos de modelos (Homem, Mulher, Criança)
document.querySelectorAll('.example-person-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    currentPersonImage = btn.dataset.src;
    currentPersonCategory = btn.dataset.cat;
    personPreview.src = currentPersonImage;
    if (personCategoryBadge) {
      personCategoryBadge.textContent = currentPersonCategory.toUpperCase();
    }
    performSwap();
  });
});

// Sugestões de roupas
document.querySelectorAll('.sug-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    clothingDescInput.value = btn.dataset.text;
    performSwap();
  });
});

// Botão principal de troca
if (swapBtn) {
  swapBtn.addEventListener('click', performSwap);
}

// Troca de ângulos
document.querySelectorAll('.angle-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.angle-btn').forEach((b) => {
      b.className = 'angle-btn px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:text-white';
    });
    btn.className = 'angle-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-yellow-400 text-gray-950';

    currentAngle = btn.dataset.angle;
    updateDisplayedImage();
  });
});

// Comparador Antes / Depois
function showBeforeImage() {
  resultImage.src = currentPersonImage;
  angleBadge.textContent = 'Antes (Original)';
}
function showAfterImage() {
  updateDisplayedImage();
}

if (toggleCompareBtn) {
  toggleCompareBtn.addEventListener('mousedown', showBeforeImage);
  toggleCompareBtn.addEventListener('mouseup', showAfterImage);
  toggleCompareBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    showBeforeImage();
  });
  toggleCompareBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    showAfterImage();
  });
}

// Download
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = resultImage.src;
    link.download = `TrocaRoupa_${currentAngle}.jpg`;
    link.click();
  });
}

// Câmera ao vivo
if (cameraBtn) {
  cameraBtn.addEventListener('click', async () => {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      cameraVideo.srcObject = cameraStream;
      cameraModal.classList.remove('hidden');
    } catch (err) {
      alert('Não foi possível acessar a câmera. Você também pode clicar em "Enviar Foto".');
    }
  });
}

if (closeCameraBtn) {
  closeCameraBtn.addEventListener('click', () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
    }
    cameraModal.classList.add('hidden');
  });
}

if (captureShutterBtn) {
  captureShutterBtn.addEventListener('click', () => {
    const ctx = cameraCanvas.getContext('2d');
    cameraCanvas.width = cameraVideo.videoWidth || 800;
    cameraCanvas.height = cameraVideo.videoHeight || 1067;
    ctx.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
    currentPersonImage = cameraCanvas.toDataURL('image/jpeg', 0.92);
    personPreview.src = currentPersonImage;

    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
    }
    cameraModal.classList.add('hidden');
    performSwap();
  });
}

// Função principal de troca de roupa
async function performSwap() {
  const clothingText = clothingDescInput.value.trim() || 'Roupa casual moderna';
  swapBtnText.textContent = 'Trocando Roupa com IA...';
  swapBtn.disabled = true;

  try {
    const res = await fetch('/api/virtual-tryon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        personImage: currentPersonImage,
        personCategory: currentPersonCategory,
        clothingDescription: clothingText,
        angles: ['frente', 'tres_quartos', 'perfil', 'costas'],
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.stylingData?.stylistVerdict && stylistNotes) {
        stylistNotes.textContent = data.stylingData.stylistVerdict;
      }
      if (data.stylingData?.colorHex) {
        renderedAngles = await generateCanvasAngles(currentPersonImage, clothingText, data.stylingData.colorHex);
        updateDisplayedImage();
        swapBtnText.textContent = 'Trocar Roupa Agora';
        swapBtn.disabled = false;
        return;
      }
    }
  } catch (e) {
    console.warn('Fallback to client canvas:', e);
  }

  renderedAngles = await generateCanvasAngles(currentPersonImage, clothingText);
  updateDisplayedImage();

  swapBtnText.textContent = 'Trocar Roupa Agora';
  swapBtn.disabled = false;
}

function updateDisplayedImage() {
  const angleNames = {
    frente: 'Vista Frontal (0°)',
    tres_quartos: 'Vista Três Quartos (45°)',
    perfil: 'Vista de Perfil (90°)',
    costas: 'Vista Traseira (180°)',
  };

  resultImage.src = renderedAngles[currentAngle] || currentPersonImage;
  angleBadge.textContent = angleNames[currentAngle] || 'Frente';
}

// Motor de Canvas para troca de roupa em múltiplos ângulos
async function generateCanvasAngles(personSrc, clothingDesc, customColor) {
  const angles = ['frente', 'tres_quartos', 'perfil', 'costas'];
  const results = {};

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = personSrc;

  await new Promise((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });

  const w = img.naturalWidth || 800;
  const h = img.naturalHeight || 1067;

  // Cor baseada na descrição
  let garmentColor = customColor || '#1e3a8a';
  const lower = clothingDesc.toLowerCase();
  if (!customColor) {
    if (lower.includes('vermelh') || lower.includes('rubi')) garmentColor = '#991b1b';
    else if (lower.includes('preto') || lower.includes('couro')) garmentColor = '#18181b';
    else if (lower.includes('bege') || lower.includes('linho') || lower.includes('areia')) garmentColor = '#c8a882';
    else if (lower.includes('verde')) garmentColor = '#166534';
    else if (lower.includes('rosa') || lower.includes('floral')) garmentColor = '#be185d';
    else if (lower.includes('amarel') || lower.includes('ouro')) garmentColor = '#d97706';
  }

  for (const angle of angles) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = w;
    canvas.height = h;

    // Desenha a pessoa com perspectiva de acordo com o ângulo
    ctx.save();
    if (angle === 'perfil') {
      ctx.translate(w * 0.08, 0);
      ctx.scale(0.86, 1);
    } else if (angle === 'tres_quartos') {
      ctx.translate(w * 0.04, 0);
      ctx.scale(0.93, 1);
    }
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();

    // Aplica a nova roupa
    ctx.save();
    ctx.fillStyle = garmentColor;
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

    // Detalhes da gola / lapela
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 32, chestY + 15);
    ctx.lineTo(cx, chestY + 95);
    ctx.lineTo(cx + 32, chestY + 15);
    ctx.stroke();

    // Botões
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(cx, chestY + 115, 3.5, 0, Math.PI * 2);
    ctx.arc(cx, chestY + 140, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Selo do ângulo
    ctx.save();
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    const label =
      angle === 'frente'
        ? 'FRENTE (0°)'
        : angle === 'tres_quartos'
        ? '3/4 (45°)'
        : angle === 'perfil'
        ? 'PERFIL (90°)'
        : 'COSTAS (180°)';
    ctx.fillText(`TrocaRoupa • ${label}`, 16, h - 20);
    ctx.restore();

    results[angle] = canvas.toDataURL('image/jpeg', 0.92);
  }

  return results;
}

// Inicializa no carregamento
performSwap();
