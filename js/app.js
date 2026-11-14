// ============================================================
//  NEON SNEAKER STORE — Interactive 3D Showcase & Product Detail Engine
//  Inspired by Nike & Puma Architecture
//  Created by Atharva Ghugare
// ============================================================
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ---------- SIGNATURE MAIN PAGE DEFAULT THEME (YELLOWISH GOLDEN) ----------
const MAIN_PAGE_THEME = {
  themeColor: '#f59e0b',
  secondaryColor: '#d97706',
  bgGradient: 'radial-gradient(circle at 50% 30%, #362402 0%, #170e02 70%, #080401 100%)',
  accentGlow: 'rgba(245, 158, 11, 0.6)'
};

// ---------- CONFIG & FALLBACK DATA ----------
const FALLBACK_PRODUCTS = [
  {
    id: 'nike-air-cyber',
    name: 'Air Jordan 1 High OG Chicago',
    tag: 'Authentic 3D GLB Model • Classic Chicago Red',
    brand: 'Nike Inspired',
    price: 9999,
    category: 'nike',
    themeColor: '#d3122a',
    secondaryColor: '#ffffff',
    bgGradient: 'radial-gradient(circle at 50% 30%, #3a000a 0%, #170004 70%, #080002 100%)',
    accentGlow: 'rgba(211, 18, 42, 0.6)',
    description: 'The legendary Air Jordan 1 High OG Chicago custom 3D model designed with multi-panel Chicago Red overlays, Sail Porcelain White toe/quarter panels, Pitch Black Swoosh & Wings collar, and dual-tone sole.',
    features: ['Multi-Panel Chicago Red Overlays', 'Sail Porcelain White Toe Box & Quarter', 'Pitch Black Swoosh & Wings Ankle Collar', 'Sail White Midsole & Red Outsole', 'Weight: 340g'],
    rating: 5.0,
    releaseYear: 2026
  },
  {
    id: 'puma-nitro-neon',
    name: 'Puma Nitro Cyber Lime',
    tag: 'Authentic Adidas Racer TR21 3D GLB • Acid Lime',
    brand: 'Puma Inspired',
    price: 6999,
    category: 'puma',
    themeColor: '#1cd66c',
    secondaryColor: '#064e3b',
    bgGradient: 'radial-gradient(circle at 50% 30%, #053013 0%, #041409 70%, #010803 100%)',
    accentGlow: 'rgba(28, 214, 108, 0.6)',
    description: 'Futuristic Puma Nitro runner custom 3D model (Adidas Racer TR21 geometry) designed with Acid Cyber Lime toe/eyestay, Deep Forest Emerald mudguard, Charcoal Obsidian mesh quarter, and glowing Electric Neon Green Formstrip.',
    features: ['Adidas Racer TR21 Low-Top Geometry', 'Acid Cyber Lime Toe Box & Eyestay', 'Deep Forest Emerald Leather Mudguard', 'Glowing Electric Neon Green Formstrip', 'Weight: 285g'],
    rating: 4.9,
    releaseYear: 2026
  },
  {
    id: 'nike-jordan-retro',
    name: 'Nike Cyber Jordan Ice Blue',
    tag: 'Authentic 3D GLB Model • Bluish White Edition',
    brand: 'Nike Inspired',
    price: 9999,
    category: 'nike',
    themeColor: '#00d2ff',
    secondaryColor: '#0284c7',
    bgGradient: 'radial-gradient(circle at 50% 30%, #032b45 0%, #031424 70%, #01070e 100%)',
    accentGlow: 'rgba(0, 210, 255, 0.6)',
    description: 'The iconic Jordan silhouette custom 3D model designed in an exclusive Bluish White & Cyber Royal Blue colorway with crisp Porcelain Ice White toe/quarter panels and glowing Electric Cyan Swoosh.',
    features: ['Crisp Porcelain Ice White Toe Box & Quarter', 'Cyber Royal Blue Leather Overlays', 'Glowing Electric Cyan Swoosh & Collar', 'Ice Blue High-Traction Outsole', 'Weight: 340g'],
    rating: 5.0,
    releaseYear: 2026
  },
  {
    id: 'puma-phantom-stealth',
    name: 'Puma Phantom Stealth Violet',
    tag: 'Authentic Adidas Racer TR21 3D GLB • Royal Cyber Violet',
    brand: 'Puma Inspired',
    price: 7499,
    category: 'puma',
    themeColor: '#9333ea',
    secondaryColor: '#3b0764',
    bgGradient: 'radial-gradient(circle at 50% 30%, #2e0236 0%, #0e0317 70%, #05010a 100%)',
    accentGlow: 'rgba(147, 51, 234, 0.6)',
    description: 'Ultra-sleek Puma runner custom 3D model (Adidas Racer TR21 geometry) designed with Royal Cyber Violet toe/eyestay, Deep Midnight Purple mudguard, Stealth Matte Carbon quarter, and electric ultraviolet glowing neon piping lines.',
    features: ['Adidas Racer TR21 Low-Top Geometry', 'Royal Cyber Violet Toe Box & Eyestay', 'Deep Midnight Purple Leather Mudguard', 'Electric Ultraviolet Glowing Neon Piping', 'Weight: 290g'],
    rating: 4.8,
    releaseYear: 2026
  }
];

let PRODUCTS = [...FALLBACK_PRODUCTS];
let currentSneakerId = 'nike-air-cyber';
let savedSneakers = JSON.parse(localStorage.getItem('neonSaved') || '[]');
const cart = [];

// USER ACCOUNT AUTH SYSTEM STATE
let currentUser = JSON.parse(localStorage.getItem('neonUser') || 'null');
let authMode = 'signup'; // 'signup' | 'login'

// PAYMENT METHOD STATE
let selectedPaymentMethod = 'card'; // 'card' | 'upi' | 'netbanking' | 'cod'

// Detail View State
let isDetailMode = false;
let selectedGender = 'men';
let searchQuery = '';
let activeFilter = 'all';

// POP-UP ANIMATION STATE ENGINE
let isPopUpAnimating = false;
let popUpProgress = 0;
let popUpType = null;
let popUpTargetId = null;

// DOM Helper
const $ = (id) => document.getElementById(id);

// ---------- TOAST ----------
let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

// ============================================================
//  INTERACTIVE GLOWING CUSTOM CURSOR & CLICK RIPPLE ENGINE
// ============================================================
const cursorRing = $('customCursor');
const cursorDot = $('customCursorDot');

window.addEventListener('pointermove', (e) => {
  if (cursorRing && cursorDot) {
    cursorRing.style.top = `${e.clientY}px`;
    cursorRing.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
    cursorDot.style.left = `${e.clientX}px`;
  }
});

// Expand cursor ring on hover over interactive elements
document.addEventListener('pointerover', (e) => {
  if (e.target.closest('button, a, input, select, textarea, .product, .filter-pill, .pay-card-option')) {
    if (cursorRing) cursorRing.style.transform = 'translate(-50%, -50%) scale(1.6)';
  }
});

document.addEventListener('pointerout', (e) => {
  if (e.target.closest('button, a, input, select, textarea, .product, .filter-pill, .pay-card-option')) {
    if (cursorRing) cursorRing.style.transform = 'translate(-50%, -50%) scale(1.0)';
  }
});

// PREMIUM CLICK RIPPLE BURST & SPRING PRESS FEEDBACK
window.addEventListener('pointerdown', (e) => {
  if (cursorRing) {
    cursorRing.style.transform = 'translate(-50%, -50%) scale(0.75)';
  }

  // Create dynamic expanding ripple element
  const ripple = document.createElement('div');
  ripple.className = 'cursor-ripple';
  ripple.style.top = `${e.clientY}px`;
  ripple.style.left = `${e.clientX}px`;
  document.body.appendChild(ripple);

  // Auto-remove ripple after animation completes
  setTimeout(() => ripple.remove(), 520);
});

window.addEventListener('pointerup', () => {
  if (cursorRing) {
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1.0)';
  }
});

// ---------- THREE.JS SCENE SETUP ----------
const container = $('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.0, 6.0);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
container.appendChild(renderer.domElement);

// Environment reflections
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

// Lights — Clean Studio Lighting (No Color Distortion)
const ambient = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambient);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
keyLight.position.set(4, 6, 5);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(1024, 1024);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
rimLight.position.set(-4, 2, -4);
scene.add(rimLight);

const coolFill = new THREE.DirectionalLight(0xddeeff, 0.7);
coolFill.position.set(0, -3, 5);
scene.add(coolFill);

const punctual = new THREE.PointLight(0xffffff, 1.2, 14);
punctual.position.set(2, 1, 3);
scene.add(punctual);

// Ground shadow disc
const groundGeo = new THREE.CircleGeometry(2.8, 48);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x060a14, roughness: 0.9, metalness: 0.1 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.45;
ground.receiveShadow = true;
scene.add(ground);

// Floating Particles
const particlesGeo = new THREE.BufferGeometry();
const COUNT = 340;
const ppos = new Float32Array(COUNT * 3);
for (let i = 0; i < COUNT * 3; i += 3) {
  ppos[i] = (Math.random() - 0.5) * 14;
  ppos[i+1] = (Math.random() - 0.5) * 9;
  ppos[i+2] = (Math.random() - 0.5) * 9;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(ppos, 3));
const particlesMat = new THREE.PointsMaterial({ color: 0xf59e0b, size: 0.04, transparent: true, opacity: 0.7, depthWrite: false });
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// Helper function to create mesh
function addMesh(parent, geo, mat, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1, castShadow = true } = {}) {
  if (geo.computeVertexNormals) geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.rotation.set(rx, ry, rz);
  m.scale.setScalar(s);
  m.castShadow = castShadow;
  parent.add(m);
  return m;
}

// ============================================================
//  AUTHENTIC GLTF / GLB 3D MODEL LOADER SYSTEM
// ============================================================
let jordanGLTFModel = null;
let adidasGLTFModel = null;
const gltfLoader = new GLTFLoader();

// Load Jordan 1 High Model (for 1st & 3rd Products + Main Page)
gltfLoader.load(
  './models/jordan.glb',
  (gltf) => {
    jordanGLTFModel = gltf.scene;
    console.log('✅ Jordan GLB model loaded successfully!');
    
    if (!assemblySneakerGroup) {
      assemblySneakerGroup = buildHeroAssemblyFromGLTF();
      scene.add(assemblySneakerGroup);
    }

    if (isDetailMode && currentSneakerId) {
      load3DSneaker(currentSneakerId);
    }
  }
);

// Load Adidas Racer TR21 Model (for 2nd & 4th Products)
gltfLoader.load(
  './models/adidas_racer.glb',
  (gltf) => {
    adidasGLTFModel = gltf.scene;
    console.log('✅ Adidas Racer TR21 GLB model loaded successfully!');

    if (isDetailMode && (currentSneakerId === 'puma-nitro-neon' || currentSneakerId === 'puma-phantom-stealth')) {
      load3DSneaker(currentSneakerId);
    }
  }
);

// ============================================================
//  TOP-NOTCH MULTI-PANEL COLOR BLOCK MATERIAL PIPELINES
// ============================================================
function getCustomDesignMaterials(sneakerId) {
  switch (sneakerId) {
    case 'nike-air-cyber':
      // Air Jordan 1 High OG Chicago (Classic High-Gloss Chicago Red & Sail White)
      return {
        overlayMat: new THREE.MeshStandardMaterial({ color: 0xd3122a, roughness: 0.28, metalness: 0.10 }), // Chicago Red Overlays
        quarterMat: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.32, metalness: 0.05 }), // Crisp Pure White Toe & Quarter
        swooshMat: new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.35, metalness: 0.20 }),  // Pitch Black Swoosh & Collar
        soleMat: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.40, metalness: 0.05 }),    // Deep Red Outsole
        midsoleMat: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.35, metalness: 0.05 })  // Sail White Midsole
      };

    case 'puma-nitro-neon':
      // Puma Nitro Cyber Lime (Acid Lime & Deep Forest Emerald)
      return {
        overlayMat: new THREE.MeshStandardMaterial({ color: 0x1cd66c, roughness: 0.32, metalness: 0.15 }),
        quarterMat: new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.35, metalness: 0.25 }),
        swooshMat: new THREE.MeshStandardMaterial({ color: 0x22ff00, emissive: 0x22ff00, emissiveIntensity: 0.4, roughness: 0.2, metalness: 0.3 }),
        soleMat: new THREE.MeshStandardMaterial({ color: 0x022c22, roughness: 0.45, metalness: 0.10 }),
        midsoleMat: new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.38, metalness: 0.10 })
      };

    case 'nike-jordan-retro':
      // 3RD PRODUCT RE-THEMED TO BLUISH WHITE EDITION (Ice Bluish White & Cyber Royal Blue)
      return {
        overlayMat: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.28, metalness: 0.15 }), // Cyber Royal Blue Overlays
        quarterMat: new THREE.MeshStandardMaterial({ color: 0xf0f9ff, roughness: 0.30, metalness: 0.05 }), // Crisp Porcelain Ice Bluish White
        swooshMat: new THREE.MeshStandardMaterial({ color: 0x00d2ff, emissive: 0x00d2ff, emissiveIntensity: 0.5, roughness: 0.2, metalness: 0.3 }), // Glowing Electric Cyan Swoosh & Collar
        soleMat: new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.40, metalness: 0.10 }),    // Ice Blue Outsole
        midsoleMat: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.05 })  // Pure White Midsole
      };

    case 'puma-phantom-stealth':
    default:
      // Puma Phantom Stealth Violet (Royal Cyber Violet & Midnight Purple)
      return {
        overlayMat: new THREE.MeshStandardMaterial({ color: 0x9333ea, roughness: 0.32, metalness: 0.15 }),
        quarterMat: new THREE.MeshStandardMaterial({ color: 0x3b0764, roughness: 0.35, metalness: 0.25 }),
        swooshMat: new THREE.MeshStandardMaterial({ color: 0xe000ff, emissive: 0xe000ff, emissiveIntensity: 0.4, roughness: 0.2, metalness: 0.3 }),
        soleMat: new THREE.MeshStandardMaterial({ color: 0x2e1065, roughness: 0.45, metalness: 0.10 }),
        midsoleMat: new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.38, metalness: 0.10 })
      };
  }
}

// Function to construct 3D group selecting GLB model source based on product ID
function buildFromUserGLTF(sneakerId) {
  const root = new THREE.Group();

  const targetScene = (sneakerId === 'puma-nitro-neon' || sneakerId === 'puma-phantom-stealth')
    ? adidasGLTFModel
    : jordanGLTFModel;

  if (!targetScene) return null;

  const clone = targetScene.clone(true);
  const m = getCustomDesignMaterials(sneakerId);

  let meshIdx = 0;
  clone.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      const nameLower = child.name ? child.name.toLowerCase() : '';

      if (nameLower.includes('swoosh') || nameLower.includes('stripe') || nameLower.includes('logo')) {
        child.material = m.swooshMat.clone();
      } else if (nameLower.includes('outsole') || nameLower.includes('bottom')) {
        child.material = m.soleMat.clone();
      } else if (nameLower.includes('midsole')) {
        child.material = m.midsoleMat.clone();
      } else if (nameLower.includes('toe') || nameLower.includes('quarter') || nameLower.includes('side') || nameLower.includes('vamp')) {
        child.material = m.quarterMat.clone();
      } else if (nameLower.includes('overlay') || nameLower.includes('mudguard') || nameLower.includes('heel') || nameLower.includes('eyestay')) {
        child.material = m.overlayMat.clone();
      } else {
        const mod = meshIdx % 5;
        if (mod === 0) child.material = m.overlayMat.clone();
        else if (mod === 1) child.material = m.quarterMat.clone();
        else if (mod === 2) child.material = m.swooshMat.clone();
        else if (mod === 3) child.material = m.midsoleMat.clone();
        else child.material = m.soleMat.clone();
      }

      meshIdx++;
    }
  });

  // Center and normalize bounding box scale
  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  clone.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const targetScale = 2.8 / maxDim;
  clone.scale.setScalar(targetScale);

  root.add(clone);
  return root;
}

// MAIN PAGE HERO ROTATING ANIMATION SNEAKER (YELLOWISH GOLDEN EDITION)
function buildHeroAssemblyFromGLTF() {
  const root = new THREE.Group();
  if (!jordanGLTFModel) return buildFallbackConceptPrototype();

  const clone = jordanGLTFModel.clone(true);
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.4, roughness: 0.25, metalness: 0.3 });
  const amberMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.35, metalness: 0.4 });
  const obsidianMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.45, metalness: 0.5 });
  const sailMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.30, metalness: 0.1 });

  let partIdx = 0;
  clone.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      const mod = partIdx % 4;
      if (mod === 0) child.material = goldMat.clone();
      else if (mod === 1) child.material = amberMat.clone();
      else if (mod === 2) child.material = sailMat.clone();
      else child.material = obsidianMat.clone();

      partIdx++;
    }
  });

  // Center and scale container
  const box = new THREE.Box3().setFromObject(clone);
  const size = new THREE.Vector3();
  box.getSize(size);
  const center = new THREE.Vector3();
  box.getCenter(center);

  clone.position.sub(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const targetScale = 2.8 / maxDim;
  clone.scale.setScalar(targetScale);

  root.add(clone);
  return root;
}

function buildFallbackConceptPrototype() {
  const root = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x081526 });
  const neonCyan = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.5 });
  addMesh(root, new RoundedBoxGeometry(2.95, 0.24, 1.22, 8, 0.08), bodyMat, { y: -0.92 });
  addMesh(root, new RoundedBoxGeometry(2.45, 0.72, 1.06, 8, 0.2), bodyMat, { y: -0.08 });
  addMesh(root, new THREE.TorusGeometry(0.6, 0.06, 12, 32, Math.PI * 0.75), neonCyan, { x: 0.05, y: -0.08, z: 0.56, rz: -0.4 });
  return root;
}

// ============================================================
//  DIRECT MOUSE DRAG 3D ROTATION SYSTEM
// ============================================================
let isDragging = false;
let prevMousePos = { x: 0, y: 0 };
let userRotationY = 0;
let userRotationX = 0;
let targetUserRotationY = 0;
let targetUserRotationX = 0;

window.addEventListener('pointerdown', (e) => {
  isDragging = true;
  prevMousePos = { x: e.clientX, y: e.clientY };
});

window.addEventListener('pointermove', (e) => {
  if (!isDragging) return;
  const deltaX = e.clientX - prevMousePos.x;
  const deltaY = e.clientY - prevMousePos.y;

  targetUserRotationY += deltaX * 0.008;
  targetUserRotationX += deltaY * 0.008;
  targetUserRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, targetUserRotationX));
  prevMousePos = { x: e.clientX, y: e.clientY };
});

window.addEventListener('pointerup', () => { isDragging = false; });
window.addEventListener('pointercancel', () => { isDragging = false; });

// ============================================================
//  DYNAMIC THEME ENGINE & MAIN PAGE PERMANENT THEME
// ============================================================
let activeSneakerGroup = null;
let assemblySneakerGroup = null;

function applyTheme(themeObj) {
  document.documentElement.style.setProperty('--neon-primary', themeObj.themeColor);
  document.documentElement.style.setProperty('--neon-secondary', themeObj.secondaryColor);
  document.documentElement.style.setProperty('--neon-glow', themeObj.accentGlow);

  $('bgGlow').style.background = themeObj.bgGradient;

  const hexColor = parseInt(themeObj.themeColor.replace('#', '0x'), 16);
  particlesMat.color.setHex(hexColor);
}

function resetMainTheme() {
  applyTheme(MAIN_PAGE_THEME);
}

function load3DSneaker(id) {
  const sneaker = PRODUCTS.find((p) => p.id === id);
  if (!sneaker) return;

  currentSneakerId = id;
  applyTheme(sneaker);

  if (activeSneakerGroup) {
    scene.remove(activeSneakerGroup);
    disposeGroup(activeSneakerGroup);
    activeSneakerGroup = null;
  }

  // Load target 3D model (Adidas Racer for 2nd/4th, Jordan 1 for 1st/3rd)
  activeSneakerGroup = buildFromUserGLTF(id);
  
  if (!activeSneakerGroup) {
    activeSneakerGroup = new THREE.Group();
  }

  activeSneakerGroup.position.set(-1.25, 0.0, 0);
  scene.add(activeSneakerGroup);
}

function disposeGroup(obj) {
  obj.traverse((c) => {
    if (c.material) {
      const mats = Array.isArray(c.material) ? c.material : [c.material];
      mats.forEach((m) => m.dispose());
    }
    if (c.geometry) c.geometry.dispose();
  });
}

// ============================================================
//  3D POP-UP ANIMATION SYSTEM (ENTERING & RETURNING)
// ============================================================
function triggerProductPopUp(id) {
  if (isPopUpAnimating) return;
  const sneaker = PRODUCTS.find((p) => p.id === id);
  if (!sneaker) return;

  isPopUpAnimating = true;
  popUpProgress = 0;
  popUpType = 'enterProduct';
  popUpTargetId = id;

  const flash = $('popupFlash');
  flash.classList.add('active');
  setTimeout(() => flash.classList.remove('active'), 400);

  if (assemblySneakerGroup) {
    scene.remove(assemblySneakerGroup);
  }

  load3DSneaker(id);
  applyTheme(sneaker);
}

function triggerMainPagePopUp() {
  if (isPopUpAnimating) return;
  isPopUpAnimating = true;
  popUpProgress = 0;
  popUpType = 'returnHome';

  const flash = $('popupFlash');
  flash.classList.add('active');
  setTimeout(() => flash.classList.remove('active'), 400);

  if (activeSneakerGroup) {
    scene.remove(activeSneakerGroup);
    disposeGroup(activeSneakerGroup);
    activeSneakerGroup = null;
  }

  if (assemblySneakerGroup) {
    scene.add(assemblySneakerGroup);
  }

  document.body.classList.remove('detail-active');
  isDetailMode = false;

  resetMainTheme();
}

// ============================================================
//  CLIENT PROFILE & AUTH MODAL SYSTEM
// ============================================================
function renderAuthModal() {
  const container = $('authModalCard');
  if (!container) return;

  if (currentUser) {
    // ACTIVE LOGGED-IN PROFILE VIEW
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 style="font-family:var(--font-display); font-size:1.6rem; color:#fff;">👤 Client Profile</h3>
        <button id="closeAuth" style="background:none; border:none; color:var(--text-muted); font-size:1.4rem; cursor:pointer;">✕</button>
      </div>

      <div style="text-align:center; margin-bottom:24px;">
        <div style="width:72px; height:72px; border-radius:50%; background:linear-gradient(135deg, var(--neon-primary), var(--neon-secondary)); font-size:2rem; display:inline-flex; align-items:center; justify-content:center; box-shadow:0 0 20px var(--neon-glow); margin-bottom:12px;">
          👤
        </div>
        <h4 style="font-family:var(--font-display); font-size:1.4rem; color:#fff; font-weight:900;">${currentUser.name}</h4>
        <div style="font-size:0.88rem; color:var(--text-muted);">${currentUser.email}</div>
      </div>

      <div style="background:rgba(12, 7, 2, 0.9); border:1px solid rgba(245, 158, 11, 0.35); border-radius:16px; padding:16px; margin-bottom:20px; display:flex; flex-direction:column; gap:10px;">
        <div style="font-size:0.85rem; font-weight:800; color:var(--neon-primary); letter-spacing:1px;">SAVED CLIENT DETAILS:</div>
        <div style="font-size:0.9rem; color:#fff;">📞 <strong>Phone:</strong> ${currentUser.phone || 'Not provided'}</div>
        <div style="font-size:0.9rem; color:#fff;">📍 <strong>Delivery Address:</strong> ${currentUser.address || 'Not provided'}</div>
      </div>

      <div style="display:flex; gap:12px;">
        <button class="btn-primary" id="logoutBtn" style="flex:1; justify-content:center; background:#ef4444; color:#fff; box-shadow:none;">Sign Out ➔</button>
      </div>
    `;

    $('logoutBtn').addEventListener('click', () => {
      currentUser = null;
      localStorage.removeItem('neonUser');
      toast('Signed Out Successfully');
      renderAuthModal();
      updateProfileBtnLabel();
    });
    $('closeAuth').addEventListener('click', () => $('authOverlay').classList.remove('show'));
  } 
  else {
    // SIGN UP / LOGIN FORM VIEW
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 style="font-family:var(--font-display); font-size:1.6rem; color:#fff;">
          ${authMode === 'signup' ? '📝 Client Sign Up' : '🔑 Client Login'}
        </h3>
        <button id="closeAuth" style="background:none; border:none; color:var(--text-muted); font-size:1.4rem; cursor:pointer;">✕</button>
      </div>

      <div style="display:flex; gap:10px; margin-bottom:20px; background:rgba(12,7,2,0.9); padding:4px; border-radius:14px; border:1px solid rgba(245,158,11,0.3);">
        <button id="tabSignup" style="flex:1; padding:8px; border-radius:10px; border:none; font-weight:800; cursor:pointer; background:${authMode === 'signup' ? 'var(--neon-primary)' : 'transparent'}; color:${authMode === 'signup' ? '#000' : '#fff'};">Create Account</button>
        <button id="tabLogin" style="flex:1; padding:8px; border-radius:10px; border:none; font-weight:800; cursor:pointer; background:${authMode === 'login' ? 'var(--neon-primary)' : 'transparent'}; color:${authMode === 'login' ? '#000' : '#fff'};">Login</button>
      </div>

      <form id="authForm" style="display:flex; flex-direction:column; gap:14px;">
        ${authMode === 'signup' ? `
          <input type="text" id="authName" placeholder="Full Name" required style="background:rgba(12, 7, 2, 0.9); border:1px solid rgba(245, 158, 11, 0.45); border-radius:12px; padding:12px 16px; color:#fff; font-weight:700;" />
        ` : ''}

        <input type="email" id="authEmail" placeholder="Email Address" required style="background:rgba(12, 7, 2, 0.9); border:1px solid rgba(245, 158, 11, 0.45); border-radius:12px; padding:12px 16px; color:#fff; font-weight:700;" />

        ${authMode === 'signup' ? `
          <input type="tel" id="authPhone" placeholder="Phone Number" required style="background:rgba(12, 7, 2, 0.9); border:1px solid rgba(245, 158, 11, 0.45); border-radius:12px; padding:12px 16px; color:#fff; font-weight:700;" />
          <textarea id="authAddress" placeholder="Delivery Address" required rows="2" style="background:rgba(12, 7, 2, 0.9); border:1px solid rgba(245, 158, 11, 0.45); border-radius:12px; padding:12px 16px; color:#fff; font-weight:700; font-family:var(--font-main);"></textarea>
        ` : `
          <input type="password" id="authPass" placeholder="Password" required style="background:rgba(12, 7, 2, 0.9); border:1px solid rgba(245, 158, 11, 0.45); border-radius:12px; padding:12px 16px; color:#fff; font-weight:700;" />
        `}

        <button type="submit" class="btn-primary" style="justify-content:center; margin-top:10px;">
          ${authMode === 'signup' ? 'Register Account ➔' : 'Sign In ➔'}
        </button>
      </form>
    `;

    $('tabSignup').addEventListener('click', () => { authMode = 'signup'; renderAuthModal(); });
    $('tabLogin').addEventListener('click', () => { authMode = 'login'; renderAuthModal(); });
    $('closeAuth').addEventListener('click', () => $('authOverlay').classList.remove('show'));

    $('authForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('authEmail').value.trim();
      
      if (authMode === 'signup') {
        const name = $('authName').value.trim();
        const phone = $('authPhone').value.trim();
        const address = $('authAddress').value.trim();

        currentUser = { name, email, phone, address };
        localStorage.setItem('neonUser', JSON.stringify(currentUser));
        toast(`🎉 Welcome, ${name}! Account Created.`);
      } else {
        currentUser = { name: email.split('@')[0], email, phone: '+91 98765 43210', address: 'Mumbai, MH, India' };
        localStorage.setItem('neonUser', JSON.stringify(currentUser));
        toast(`Welcome back!`);
      }

      updateProfileBtnLabel();
      renderAuthModal();
    });
  }
}

function updateProfileBtnLabel() {
  const btn = $('profileBtn');
  if (currentUser) {
    btn.innerHTML = `👤 ${currentUser.name.split(' ')[0]}`;
  } else {
    btn.innerHTML = `👤 Account`;
  }
}

$('profileBtn').addEventListener('click', () => {
  renderAuthModal();
  $('authOverlay').classList.add('show');
});

// ============================================================
//  ABOUT BRAND & STORES INFO DRAWER LISTENERS
// ============================================================
$('aboutBrandBtn').addEventListener('click', () => {
  $('aboutBrandPanel').classList.add('open');
});
$('closeAboutBrand').addEventListener('click', () => {
  $('aboutBrandPanel').classList.remove('open');
});

$('infoBtn').addEventListener('click', () => {
  $('infoPanel').classList.add('open');
});
$('closeInfo').addEventListener('click', () => {
  $('infoPanel').classList.remove('open');
});

// ============================================================
//  GENDER SELECTOR & AGE SIZE CALCULATOR ENGINE
// ============================================================
const SIZES_MEN = ['US 7 / EU 40', 'US 8 / EU 41', 'US 9 / EU 42.5', 'US 10 / EU 44', 'US 11 / EU 45', 'US 12 / EU 46'];
const SIZES_WOMEN = ['US 5 / EU 35.5', 'US 6 / EU 36.5', 'US 7 / EU 38', 'US 8 / EU 39', 'US 9 / EU 40.5', 'US 10 / EU 42'];

let selectedSizeVal = 'US 9 / EU 42.5';

function renderSizes() {
  const grid = $('sizeGrid');
  const sizes = selectedGender === 'men' ? SIZES_MEN : SIZES_WOMEN;
  $('sizeSectionTitle').textContent = `AVAILABLE SIZES (${selectedGender.toUpperCase()}'S SIZES):`;

  grid.innerHTML = sizes.map((s) => `
    <button class="size-btn ${s === selectedSizeVal ? 'active' : ''}" data-size="${s}" style="width:auto; padding:0 16px;">${s}</button>
  `).join('');

  grid.querySelectorAll('.size-btn').forEach((b) => {
    b.addEventListener('click', () => {
      grid.querySelectorAll('.size-btn').forEach((btn) => btn.classList.remove('active'));
      b.classList.add('active');
      selectedSizeVal = b.dataset.size;
    });
  });
}

$('genderMenBtn').addEventListener('click', () => {
  selectedGender = 'men';
  $('genderMenBtn').classList.add('active');
  $('genderWomenBtn').classList.remove('active');
  selectedSizeVal = SIZES_MEN[2];
  renderSizes();
});

$('genderWomenBtn').addEventListener('click', () => {
  selectedGender = 'women';
  $('genderWomenBtn').classList.add('active');
  $('genderMenBtn').classList.remove('active');
  selectedSizeVal = SIZES_WOMEN[2];
  renderSizes();
});

// Age Size Calculator Logic
$('ageInput').addEventListener('input', (e) => {
  const age = parseInt(e.target.value, 10);
  const res = $('ageResultText');
  if (isNaN(age) || age < 1) {
    res.innerHTML = 'Recommended: <span>US 9 / EU 42.5</span>';
    return;
  }
  let rec = '';
  if (age <= 4) rec = 'Kids US 8K / EU 25';
  else if (age <= 7) rec = 'Kids US 12K / EU 29';
  else if (age <= 10) rec = 'Youth US 2Y / EU 33';
  else if (age <= 14) rec = 'Youth US 5Y / EU 37';
  else if (age <= 19) rec = selectedGender === 'men' ? 'US 8.5 / EU 42' : 'US 7 / EU 38';
  else rec = selectedGender === 'men' ? 'US 9.5 / EU 43' : 'US 8 / EU 39';

  res.innerHTML = `Recommended for Age ${age}: <span>${rec}</span>`;
});

// ============================================================
//  PRODUCT DETAIL VIEW INTERACTION & POP-UP TRIGGER
// ============================================================
function openProductDetail(id) {
  const sneaker = PRODUCTS.find((p) => p.id === id);
  if (!sneaker) return;

  triggerProductPopUp(id);

  $('detailBrandBadge').textContent = sneaker.brand.toUpperCase();
  $('detailTag').textContent = sneaker.tag;
  $('detailTitle').textContent = sneaker.name;
  $('detailPrice').textContent = `₹${sneaker.price.toLocaleString('en-IN')}`;
  $('detailRating').textContent = sneaker.rating;
  $('detailDesc').textContent = sneaker.description;

  renderSizes();

  const featuresWrap = $('detailFeaturesList');
  featuresWrap.innerHTML = sneaker.features.map(f => `
    <div style="font-size:0.92rem; color:#cbd5e1; display:flex; align-items:center; gap:8px;">
      <span style="color:var(--neon-primary); font-weight:800;">✦</span> ${f}
    </div>
  `).join('');

  const isSaved = savedSneakers.includes(sneaker.id);
  $('detailSaveBtn').textContent = isSaved ? '❤️ Saved' : '❤️ Save';

  toast(`Opening 3D Pop-Up: ${sneaker.name}`);
}

function closeProductDetail() {
  triggerMainPagePopUp();

  const collectionSec = $('collection');
  if (collectionSec) collectionSec.scrollIntoView({ behavior: 'smooth' });
}

$('topBackBtn').addEventListener('click', closeProductDetail);
$('bottomBackBtn').addEventListener('click', closeProductDetail);
$('brandNav').addEventListener('click', (e) => {
  e.preventDefault();
  if (isDetailMode) closeProductDetail();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.querySelectorAll('.nav-home-link').forEach((link) => {
  link.addEventListener('click', () => {
    if (isDetailMode) closeProductDetail();
  });
});

$('detailAddToCartBtn').addEventListener('click', () => {
  addToCart(currentSneakerId);
});

$('detailSaveBtn').addEventListener('click', () => {
  toggleSave(currentSneakerId);
  const isSaved = savedSneakers.includes(currentSneakerId);
  $('detailSaveBtn').textContent = isSaved ? '❤️ Saved' : '❤️ Save';
});

// ============================================================
//  SAVED (FAVORITES) SYSTEM
// ============================================================
function toggleSave(id) {
  const idx = savedSneakers.indexOf(id);
  if (idx > -1) {
    savedSneakers.splice(idx, 1);
    toast('Removed from Saved Sneakers');
  } else {
    savedSneakers.push(id);
    toast('❤️ Saved to Favorites!');
  }
  localStorage.setItem('neonSaved', JSON.stringify(savedSneakers));
  updateSavedCount();
  renderProductGrid();
  renderSavedPanel();
}

function updateSavedCount() {
  $('savedCount').textContent = savedSneakers.length;
}

function renderSavedPanel() {
  const body = $('savedItems');
  if (!savedSneakers.length) {
    body.innerHTML = '<div style="color:var(--text-muted); text-align:center; margin-top:60px;">No saved sneakers yet. Click ❤️ on any sneaker to bookmark it!</div>';
    return;
  }
  const items = savedSneakers.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
  body.innerHTML = items.map((p) => `
    <div class="panel-item">
      <div>
        <div class="pi-title">${p.name}</div>
        <div class="pi-sub">${p.tag}</div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span class="pi-price">₹${p.price.toLocaleString('en-IN')}</span>
        <button class="nav-icon-btn" style="padding:4px 10px;" onclick="window.viewSavedSneaker('${p.id}')">View Detail</button>
        <button class="nav-icon-btn" style="padding:4px 10px; color:#ff4d4d;" onclick="window.removeSavedSneaker('${p.id}')">✕</button>
      </div>
    </div>
  `).join('');
}

window.viewSavedSneaker = (id) => {
  openProductDetail(id);
  $('savedPanel').classList.remove('open');
};
window.removeSavedSneaker = (id) => {
  toggleSave(id);
};

$('savedBtn').addEventListener('click', () => {
  renderSavedPanel();
  $('savedPanel').classList.add('open');
});
$('closeSaved').addEventListener('click', () => $('savedPanel').classList.remove('open'));

// ============================================================
//  PRODUCT GRID & SEARCH / FILTER ENGINE
// ============================================================
function getFilteredProducts() {
  return PRODUCTS.filter((p) => {
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeFilter === 'all' || p.category === activeFilter;
    return matchesSearch && matchesCategory;
  });
}

function renderProductGrid() {
  const wrap = $('productCarousel');
  const items = getFilteredProducts();

  if (!items.length) {
    wrap.innerHTML = '<div style="color:var(--text-muted); grid-column: 1/-1; text-align:center; padding:40px;">No sneakers match your search criteria.</div>';
    return;
  }

  wrap.innerHTML = items.map((p) => {
    const isSaved = savedSneakers.includes(p.id);
    return `
      <div class="product" data-id="${p.id}">
        <div class="product-header-row">
          <div class="brand-badge">${p.brand.toUpperCase()}</div>
          <button class="save-card-btn ${isSaved ? 'saved' : ''}" data-save="${p.id}">
            ${isSaved ? '❤️' : '🤍'}
          </button>
        </div>
        <div class="name">${p.name}</div>
        <div class="tag">${p.tag}</div>
        <div class="price">₹${p.price.toLocaleString('en-IN')}</div>
        <div class="product-actions">
          <button class="view-detail-btn" data-detail="${p.id}">View 3D Sneaker Detail ➔</button>
        </div>
      </div>
    `;
  }).join('');

  wrap.querySelectorAll('.product').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.dataset.detail || e.target.dataset.save) return;
      openProductDetail(card.dataset.id);
    });
  });

  wrap.querySelectorAll('.view-detail-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openProductDetail(btn.dataset.detail);
    });
  });

  wrap.querySelectorAll('.save-card-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSave(btn.dataset.save);
    });
  });
}

// Search & Filter Listeners
$('searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value.trim();
  renderProductGrid();
});

document.querySelectorAll('.filter-pill').forEach((pill) => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.filter-pill').forEach((p) => p.classList.remove('active'));
    pill.classList.add('active');
    activeFilter = pill.dataset.filter;
    renderProductGrid();
  });
});

// ============================================================
//  CART & DYNAMIC QUANTITY ADJUSTMENT CONTROLS
// ============================================================
function addToCart(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return;
  const existing = cart.find((item) => item.productId === id);
  if (existing) existing.qty++;
  else cart.push({ productId: id, name: p.name, price: p.price, qty: 1 });

  updateCartBadge();
  renderCartPanel();
  toast(`Added ${p.name} to Cart!`);
}

function increaseQty(id) {
  const item = cart.find((x) => x.productId === id);
  if (item) {
    item.qty++;
    updateCartBadge();
    renderCartPanel();
  }
}

function decreaseQty(id) {
  const idx = cart.findIndex((x) => x.productId === id);
  if (idx > -1) {
    if (cart[idx].qty > 1) {
      cart[idx].qty--;
    } else {
      cart.splice(idx, 1);
    }
    updateCartBadge();
    renderCartPanel();
  }
}

window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;

function updateCartBadge() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  $('cartCount').textContent = totalQty;
}

function renderCartPanel() {
  const body = $('cartItems');
  if (!cart.length) {
    body.innerHTML = '<div style="color:var(--text-muted); text-align:center; margin-top:60px;">Your cart is empty.</div>';
    $('cartTotal').textContent = '₹0';
    return;
  }
  let total = 0;
  body.innerHTML = cart.map((item) => {
    total += item.price * item.qty;
    return `
      <div class="panel-item">
        <div>
          <div class="pi-title">${item.name}</div>
          <div class="pi-sub">₹${item.price.toLocaleString('en-IN')} each</div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <button class="qty-btn" onclick="window.decreaseQty('${item.productId}')">-</button>
          <span style="font-weight:900; color:#fff;">${item.qty}</span>
          <button class="qty-btn" onclick="window.increaseQty('${item.productId}')">+</button>
          <span class="pi-price" style="min-width:70px; text-align:right;">₹${(item.price * item.qty).toLocaleString('en-IN')}</span>
        </div>
      </div>
    `;
  }).join('');
  $('cartTotal').textContent = `₹${total.toLocaleString('en-IN')}`;
}

$('cartBtn').addEventListener('click', () => {
  renderCartPanel();
  $('cartPanel').classList.add('open');
});
$('closeCart').addEventListener('click', () => $('cartPanel').classList.remove('open'));

// ============================================================
//  CHECKOUT MODAL & PAYMENT METHOD SELECTION ENGINE
// ============================================================
function updatePaymentFieldsVisibility() {
  const cardFields = $('payCardFields');
  const upiFields = $('payUpiFields');
  const netbankingFields = $('payNetbankingFields');
  const codFields = $('payCodFields');

  if (cardFields) cardFields.style.display = selectedPaymentMethod === 'card' ? 'block' : 'none';
  if (upiFields) upiFields.style.display = selectedPaymentMethod === 'upi' ? 'block' : 'none';
  if (netbankingFields) netbankingFields.style.display = selectedPaymentMethod === 'netbanking' ? 'block' : 'none';
  if (codFields) codFields.style.display = selectedPaymentMethod === 'cod' ? 'block' : 'none';

  // Toggle required attributes according to selected method
  if ($('cardNum')) $('cardNum').required = (selectedPaymentMethod === 'card');
  if ($('cardExp')) $('cardExp').required = (selectedPaymentMethod === 'card');
  if ($('cardCvv')) $('cardCvv').required = (selectedPaymentMethod === 'card');
  if ($('upiId')) $('upiId').required = (selectedPaymentMethod === 'upi');
}

document.querySelectorAll('.pay-card-option').forEach((opt) => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('.pay-card-option').forEach((o) => o.classList.remove('active'));
    opt.classList.add('active');
    selectedPaymentMethod = opt.dataset.method;
    updatePaymentFieldsVisibility();
  });
});

$('checkoutBtn').addEventListener('click', () => {
  if (!cart.length) { toast('Your cart is empty!'); return; }
  $('cartPanel').classList.remove('open');

  // Populate checkout modal summary
  let summaryHtml = '';
  let totalSum = 0;
  cart.forEach(item => {
    const sub = item.price * item.qty;
    totalSum += sub;
    summaryHtml += `<div>• ${item.name} (x${item.qty}) — ₹${sub.toLocaleString('en-IN')}</div>`;
  });
  $('checkoutSummaryList').innerHTML = summaryHtml;
  $('checkoutModalTotal').textContent = `Total Amount: ₹${totalSum.toLocaleString('en-IN')}`;

  // Autofill user details if signed in
  if (currentUser) {
    $('chkName').value = currentUser.name || '';
    $('chkEmail').value = currentUser.email || '';
    $('chkPhone').value = currentUser.phone || '';
    $('chkAddress').value = currentUser.address || '';
  }

  updatePaymentFieldsVisibility();
  $('checkoutOverlay').classList.add('show');
});

$('closeCheckout').addEventListener('click', () => $('checkoutOverlay').classList.remove('show'));

$('checkoutForm').addEventListener('submit', (e) => {
  e.preventDefault();

  let payLabel = 'Credit / Debit Card';
  if (selectedPaymentMethod === 'upi') payLabel = 'UPI / QR Code';
  else if (selectedPaymentMethod === 'netbanking') payLabel = 'Net Banking';
  else if (selectedPaymentMethod === 'cod') payLabel = 'Cash on Delivery';

  cart.length = 0;
  updateCartBadge();
  $('checkoutOverlay').classList.remove('show');
  toast(`🎉 Order Placed Successfully via ${payLabel}!`);
});

// ============================================================
//  MAIN ANIMATION LOOP & POP-UP TRANSITION STATE MACHINE
// ============================================================
let idleRotY = 0;

function animate() {
  requestAnimationFrame(animate);

  // User Drag Rotation Lerp
  userRotationY += (targetUserRotationY - userRotationY) * 0.08;
  userRotationX += (targetUserRotationX - userRotationX) * 0.08;

  idleRotY += 0.006;
  const time = performance.now() * 0.0015;

  // ----------------------------------------------------
  // 1. POP-UP ANIMATION TRANSITION STATE MACHINE
  // ----------------------------------------------------
  if (isPopUpAnimating) {
    popUpProgress += 0.045;

    const scaleFactor = Math.sin(popUpProgress * Math.PI) * 1.35;
    const spinFactor = popUpProgress * Math.PI * 4;

    if (popUpType === 'enterProduct' && activeSneakerGroup) {
      activeSneakerGroup.scale.setScalar(Math.max(0.1, scaleFactor));
      activeSneakerGroup.rotation.y = idleRotY + userRotationY + spinFactor;
      activeSneakerGroup.rotation.x = userRotationX;
      activeSneakerGroup.position.set(-1.25, 0.0, 0);

      camera.position.set(0, 0.5, 6.0 - popUpProgress * 0.8);
    } 
    else if (popUpType === 'returnHome' && assemblySneakerGroup) {
      assemblySneakerGroup.scale.setScalar(Math.max(0.1, scaleFactor));
      assemblySneakerGroup.rotation.y = idleRotY + userRotationY + spinFactor;
      assemblySneakerGroup.rotation.x = userRotationX;
      assemblySneakerGroup.position.set(0, -0.15, 0);

      camera.position.set(0, 0.5 + popUpProgress * 0.5, 5.2 + popUpProgress * 0.8);
    }

    if (popUpProgress >= 1.0) {
      isPopUpAnimating = false;
      popUpProgress = 1.0;

      if (popUpType === 'enterProduct') {
        document.body.classList.add('detail-active');
        isDetailMode = true;
        window.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }
  // ----------------------------------------------------
  // 2. DEDICATED PRODUCT DETAIL VIEW MODE (Single 3D Sneaker)
  // ----------------------------------------------------
  else if (isDetailMode && activeSneakerGroup) {
    activeSneakerGroup.rotation.y = idleRotY + userRotationY;
    activeSneakerGroup.rotation.x = userRotationX;

    activeSneakerGroup.position.set(-1.25, 0.0, 0);
    activeSneakerGroup.scale.setScalar(1.0);

    camera.position.set(0, 0.5, 5.2);
  } 
  // ----------------------------------------------------
  // 3. MAIN PAGE HERO SMOOTH 360° FLOATING ROTATION
  // ----------------------------------------------------
  else if (assemblySneakerGroup) {
    assemblySneakerGroup.scale.setScalar(1.0);
    assemblySneakerGroup.rotation.y = idleRotY + userRotationY;
    assemblySneakerGroup.rotation.x = userRotationX;

    // Smooth sinusoidal floating levitation centered nicely above the baseline ground disc
    const floatY = Math.sin(time) * 0.08;
    assemblySneakerGroup.position.set(0, -0.15 + floatY, 0);

    camera.position.set(0, 0.6, 5.8);
  }

  camera.lookAt(0, 0, 0);
  particles.rotation.y += 0.0012;
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================================
//  BOOT INITIALIZATION
// ============================================================
(async function boot() {
  updateSavedCount();
  updateCartBadge();
  updateProfileBtnLabel();
  renderProductGrid();

  // Create main landing page 360° rotating sneaker (Yellowish Golden Edition)
  if (jordanGLTFModel) {
    assemblySneakerGroup = buildHeroAssemblyFromGLTF();
    scene.add(assemblySneakerGroup);
  }

  // Apply main page permanent theme
  resetMainTheme();

  animate();

  setTimeout(() => $('spinner').classList.add('fade'), 350);
  setTimeout(() => $('spinner').remove(), 1200);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (isDetailMode) closeProductDetail();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();
