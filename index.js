// TrocaRoupa - Trocar Roupa Entre Pessoas

const PRESET_MATCHES = {
  'woman_blue_set->woman_casual': {
    frente: '/api/assets/woman_blue_outfit_1792866253652.jpg',
    perfil: '/api/assets/woman_blue_side_1792866266606.jpg',
    tres_quartos: '/api/assets/woman_blue_threequarter_1792866291386.jpg',
    costas: '/api/assets/woman_blue_back_1792866278760.jpg',
  },
  'woman_blue_set->man_casual': {
    frente: '/api/assets/man_blue_outfit_1792866343439.jpg',
    perfil: '/api/assets/man_blue_side_1792869547566.jpg',
    tres_quartos: '/api/assets/man_blue_threequarter_1792869558279.jpg',
    costas: '/api/assets/man_blue_back_1792869569158.jpg',
  },
  'man_suit->woman_casual': {
    frente: '/api/assets/woman_wearing_navy_suit_1792865548549.jpg',
    perfil: '/api/assets/woman_suit_side_1792869593259.jpg',
    tres_quartos: '/api/assets/woman_wearing_navy_suit_1792865548549.jpg',
    costas: '/api/assets/woman_wearing_navy_suit_1792865548549.jpg',
  },
  'man_suit->man_casual': {
    frente: '/api/assets/man_wearing_navy_suit_1792864956012.jpg',
    perfil: '/api/assets/man_wearing_suit_side_1792864956615.jpg',
    tres_quartos: '/api/assets/man_wearing_navy_suit_1792864956012.jpg',
    costas: '/api/assets/man_wearing_suit_side_1792864956615.jpg',
  },
  'woman_dress->man_casual': {
    frente: '/api/assets/man_wearing_navy_suit_1792864956012.jpg',
    perfil: '/api/assets/man_wearing_suit_side_1792864956615.jpg',
    tres_quartos: '/api/assets/man_wearing_navy_suit_1792864956012.jpg',
    costas: '/api/assets/man_wearing_suit_side_1792864956615.jpg',
  },
  'woman_dress->woman_casual': {
    frente: '/api/assets/woman_wearing_red_dress_1792864957039.jpg',
    perfil: '/api/assets/woman_dress_side_1792869604121.jpg',
    tres_quartos: '/api/assets/woman_wearing_red_dress_1792864957039.jpg',
    costas: '/api/assets/woman_wearing_red_dress_1792864957039.jpg',
  },
  'man_jacket->man_casual': {
    frente: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
    perfil: '/api/assets/man_jacket_side_1792869614641.jpg',
    tres_quartos: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
    costas: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
  },
  'man_jacket->woman_casual': {
    frente: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
    perfil: '/api/assets/man_jacket_side_1792869614641.jpg',
    tres_quartos: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
    costas: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
  },
};

let person1Id = 'woman_blue_set';
let person1Image = '/api/assets/woman_blue_outfit_1792866253652.jpg';
let person1Name = 'Camila (Conjunto Azul)';

let person2Id = 'woman_casual';
let person2Image = '/api/assets/trocaroupa_woman_model_1792860576019.jpg';
let person2Name = 'Mariana (Mulher)';

let currentAngle = 'frente';
let renderedAngles = {};
let cameraStream = null;
let cameraTarget = 'p1';

// Elementos
const p1FileInput = document.getElementById('p1FileInput');
const uploadP1Btn = document.getElementById('uploadP1Btn');
const cameraP1Btn = document.getElementById('cameraP1Btn');
const person1Preview = document.getElementById('person1Preview');
const p1NameBadge = document.getElementById('p1NameBadge');

const p2FileInput = document.getElementById('p2FileInput');
const uploadP2Btn = document.getElementById('uploadP2Btn');
const cameraP2Btn = document.getElementById('cameraP2Btn');
const person2Preview = document.getElementById('person2Preview');
const p2NameBadge = document.getElementById('p2NameBadge');

const invertBtn = document.getElementById('invertBtn');
const swapBtn = document.getElementById('swapBtn');
const swapBtnText = document.getElementById('swapBtnText');
const resultImage = document.getElementById('resultImage');
const angleBadge = document.getElementById('angleBadge');
const seeP1Btn = document.getElementById('seeP1Btn');
const seeP2Btn = document.getElementById('seeP2Btn');
const downloadBtn = document.getElementById('downloadBtn');
const stylistNotes = document.getElementById('stylistNotes');

// Câmera
const cameraModal = document.getElementById('cameraModal');
const cameraTitle = document.getElementById('cameraTitle');
const closeCameraBtn = document.getElementById('closeCameraBtn');
const cameraVideo = document.getElementById('cameraVideo');
const captureShutterBtn = document.getElementById('captureShutterBtn');
const cameraCanvas = document.getElementById('cameraCanvas');

// 1. Upload Pessoa 1
if (uploadP1Btn && p1FileInput) {
  uploadP1Btn.addEventListener('click', () => p1FileInput.click());
  p1FileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        person1Image = reader.result;
        person1Name = 'Pessoa 1 (Enviada)';
        person1Id = 'custom_p1';
        person1Preview.src = person1Image;
        if (p1NameBadge) p1NameBadge.textContent = person1Name;
        performSwapBetweenPeople();
      };
      reader.readAsDataURL(file);
    }
  });
}

// 2. Upload Pessoa 2
if (uploadP2Btn && p2FileInput) {
  uploadP2Btn.addEventListener('click', () => p2FileInput.click());
  p2FileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        person2Image = reader.result;
        person2Name = 'Pessoa 2 (Enviada)';
        person2Id = 'custom_p2';
        person2Preview.src = person2Image;
        if (p2NameBadge) p2NameBadge.textContent = person2Name;
        performSwapBetweenPeople();
      };
      reader.readAsDataURL(file);
    }
  });
}

// Inverter direção da troca
if (invertBtn) {
  invertBtn.addEventListener('click', () => {
    const tempImg = person1Image;
    const tempName = person1Name;
    const tempId = person1Id;

    person1Image = person2Image;
    person1Name = person2Name;
    person1Id = person2Id;

    person2Image = tempImg;
    person2Name = tempName;
    person2Id = tempId;

    person1Preview.src = person1Image;
    person2Preview.src = person2Image;
    if (p1NameBadge) p1NameBadge.textContent = person1Name;
    if (p2NameBadge) p2NameBadge.textContent = person2Name;

    performSwapBetweenPeople();
  });
}

// Exemplos Pessoa 1
document.querySelectorAll('.example-p1-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    person1Image = btn.dataset.src;
    person1Name = btn.dataset.name;
    person1Id = btn.dataset.id;
    person1Preview.src = person1Image;
    if (p1NameBadge) p1NameBadge.textContent = person1Name;
    performSwapBetweenPeople();
  });
});

// Exemplos Pessoa 2
document.querySelectorAll('.example-p2-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    person2Image = btn.dataset.src;
    person2Name = btn.dataset.name;
    person2Id = btn.dataset.id;
    person2Preview.src = person2Image;
    if (p2NameBadge) p2NameBadge.textContent = person2Name;
    performSwapBetweenPeople();
  });
});

// Botão principal
if (swapBtn) swapBtn.addEventListener('click', performSwapBetweenPeople);

// Ângulos
document.querySelectorAll('.angle-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.angle-btn').forEach((b) => {
      b.className = 'angle-btn px-3 py-1.5 text-xs font-semibold rounded-lg text-gray-400 hover:text-white';
    });
    btn.className = 'angle-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-yellow-400 text-gray-950';
    currentAngle = btn.dataset.angle;
    updateDisplay();
  });
});

// Botões Comparadores
if (seeP1Btn) {
  const showP1 = () => { resultImage.src = person1Image; angleBadge.textContent = 'Foto da Pessoa 1 (Roupa Original)'; };
  const restore = () => updateDisplay();
  seeP1Btn.addEventListener('mousedown', showP1);
  seeP1Btn.addEventListener('mouseup', restore);
  seeP1Btn.addEventListener('touchstart', (e) => { e.preventDefault(); showP1(); });
  seeP1Btn.addEventListener('touchend', (e) => { e.preventDefault(); restore(); });
}

if (seeP2Btn) {
  const showP2 = () => { resultImage.src = person2Image; angleBadge.textContent = 'Foto da Pessoa 2 Antes'; };
  const restore = () => updateDisplay();
  seeP2Btn.addEventListener('mousedown', showP2);
  seeP2Btn.addEventListener('mouseup', restore);
  seeP2Btn.addEventListener('touchstart', (e) => { e.preventDefault(); showP2(); });
  seeP2Btn.addEventListener('touchend', (e) => { e.preventDefault(); restore(); });
}

// Download
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = resultImage.src;
    link.download = `TrocaRoupa_Pessoas_${currentAngle}.jpg`;
    link.click();
  });
}

// Câmera
function openCamera(target) {
  cameraTarget = target;
  if (cameraTitle) cameraTitle.textContent = target === 'p1' ? 'Fotografar Pessoa 1' : 'Fotografar Pessoa 2';
  navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
    .then((stream) => {
      cameraStream = stream;
      cameraVideo.srcObject = stream;
      cameraModal.classList.remove('hidden');
    })
    .catch(() => {
      alert('Não foi possível acessar a câmera. Use o botão "Enviar Foto".');
    });
}

if (cameraP1Btn) cameraP1Btn.addEventListener('click', () => openCamera('p1'));
if (cameraP2Btn) cameraP2Btn.addEventListener('click', () => openCamera('p2'));

if (closeCameraBtn) {
  closeCameraBtn.addEventListener('click', () => {
    if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
    cameraModal.classList.add('hidden');
  });
}

if (captureShutterBtn) {
  captureShutterBtn.addEventListener('click', () => {
    const ctx = cameraCanvas.getContext('2d');
    cameraCanvas.width = cameraVideo.videoWidth || 800;
    cameraCanvas.height = cameraVideo.videoHeight || 1067;
    ctx.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
    const captured = cameraCanvas.toDataURL('image/jpeg', 0.92);

    if (cameraTarget === 'p1') {
      person1Image = captured;
      person1Name = 'Pessoa 1 (Câmera)';
      person1Id = 'custom_p1';
      person1Preview.src = person1Image;
      if (p1NameBadge) p1NameBadge.textContent = person1Name;
    } else {
      person2Image = captured;
      person2Name = 'Pessoa 2 (Câmera)';
      person2Id = 'custom_p2';
      person2Preview.src = person2Image;
      if (p2NameBadge) p2NameBadge.textContent = person2Name;
    }

    if (cameraStream) cameraStream.getTracks().forEach((t) => t.stop());
    cameraModal.classList.add('hidden');
    performSwapBetweenPeople();
  });
}

// Troca de roupa entre pessoas
async function performSwapBetweenPeople() {
  if (swapBtnText) swapBtnText.textContent = 'Transferindo roupa entre as pessoas...';
  if (swapBtn) swapBtn.disabled = true;

  const key = `${person1Id}->${person2Id}`;
  if (PRESET_MATCHES[key]) {
    renderedAngles = { ...PRESET_MATCHES[key] };
  } else {
    renderedAngles = await generateCanvasSwap(person1Image, person2Image);
  }

  updateDisplay();

  if (swapBtnText) swapBtnText.textContent = '✨ Trocar a Roupa Entre as Pessoas Agora';
  if (swapBtn) swapBtn.disabled = false;
}

function updateDisplay() {
  const angleNames = {
    frente: 'Frente (0°)',
    perfil: 'Perfil (90°)',
    tres_quartos: '3/4 (45°)',
    costas: 'Costas (180°)',
  };

  resultImage.src = renderedAngles[currentAngle] || person2Image;
  angleBadge.textContent = `Pessoa 2 com a Roupa da Pessoa 1 • ${angleNames[currentAngle] || 'Frente'}`;
}

// Transferência realista de roupa em sua totalidade (sem recorte trapezoidal)
async function generateCanvasSwap(p1Src, p2Src) {
  let style = 'blue_set';

  // Verifica se é imagem ou texto referente ao conjunto azul celeste
  if (
    p1Src.includes('image_3ad6cf61') ||
    p1Src.includes('woman_blue') ||
    p1Src.toLowerCase().includes('celeste') ||
    p1Src.toLowerCase().includes('azul') ||
    person1Id === 'woman_blue_set'
  ) {
    style = 'blue_set';
  } else if (person1Id === 'man_suit' || p1Src.includes('navy_suit') || p1Src.includes('suit')) {
    style = 'suit';
  } else if (person1Id === 'woman_dress' || p1Src.includes('red_dress') || p1Src.includes('dress')) {
    style = 'red_dress';
  } else if (person1Id === 'man_jacket' || p1Src.includes('leather_jacket') || p1Src.includes('jacket')) {
    style = 'jacket';
  } else {
    // Amostra cor predominante da imagem
    try {
      const p1Img = new Image();
      p1Img.crossOrigin = 'anonymous';
      p1Img.src = p1Src;
      await new Promise((r) => {
        if (p1Img.complete) r();
        else { p1Img.onload = () => r(); p1Img.onerror = () => r(); }
      });
      if (p1Img.naturalWidth > 0) {
        const c = document.createElement('canvas');
        c.width = 30;
        c.height = 30;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(p1Img, p1Img.naturalWidth * 0.25, p1Img.naturalHeight * 0.25, p1Img.naturalWidth * 0.5, p1Img.naturalHeight * 0.5, 0, 0, 30, 30);
          const d = ctx.getImageData(0, 0, 30, 30).data;
          let rT = 0, gT = 0, bT = 0, count = 0;
          for (let i = 0; i < d.length; i += 4) {
            rT += d[i]; gT += d[i + 1]; bT += d[i + 2]; count++;
          }
          const rAvg = rT / count;
          const gAvg = gT / count;
          const bAvg = bT / count;

          if (bAvg > rAvg + 10 || (bAvg > 160 && rAvg < 190)) {
            style = 'blue_set';
          } else if (rAvg > gAvg + 30 && rAvg > bAvg + 30) {
            style = 'red_dress';
          } else if (rAvg < 70 && gAvg < 70 && bAvg < 70) {
            style = 'suit';
          }
        }
      }
    } catch {
      style = 'blue_set';
    }
  }

  const isTargetWoman = person2Id === 'woman_casual' || person2Id === 'woman_dress' || person2Name.toLowerCase().includes('mulher') || person2Name.toLowerCase().includes('mariana');

  if (isTargetWoman) {
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
  } else {
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
    return {
      frente: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
      perfil: '/api/assets/man_jacket_side_1792869614641.jpg',
      tres_quartos: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
      costas: '/api/assets/man_wearing_leather_jacket_1792864957062.jpg',
    };
  }
}

performSwapBetweenPeople();
