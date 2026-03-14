// ════════════════════════════════════════════════════════
//
//  MERCADO 360° — Cosoleacaque
//  mercado360.js — Lógica principal
//
// ════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════
//  GRAFO DE NODOS
//
//  Cada nodo es una posición física en el mercado.
//  Contiene:
//    - nombre / emoji: identificación visual
//    - imagePath: ruta a tu foto 360° equirectangular
//                 (descomenta cuando tengas las fotos)
//    - bgColor / fogColor: colores placeholder mientras no hay foto
//    - startLon: ángulo horizontal inicial al llegar al nodo
//    - connections: nodos vecinos accesibles desde aquí
//        · to:    id del nodo destino
//        · lon:   ángulo horizontal donde aparece la flecha
//        · lat:   ángulo vertical (-42 aprox = suelo)
//        · label: texto del tooltip
//    - hotspots: puestos visibles desde este nodo
//        · id:      clave en el objeto PUESTOS
//        · lon/lat: posición angular del punto de interés
//
// ════════════════════════════════════════════════════════
const NODES = {

  'entrada-principal': {
    nombre: 'Entrada Principal',
    emoji: '🚪',
    // imagePath: 'fotos/nodo_01_entrada.jpg',
    bgColor: 0x3d2200, fogColor: 0x1a0a00,
    startLon: 0,
    connections: [
      { to: 'pasillo-a1',  lon:   5, lat: -42, label: 'Entrar al pasillo A' },
      { to: 'caseta-info', lon: -70, lat: -38, label: 'Caseta de información' },
    ],
    hotspots: [
      { id: 'bienvenida', lon: -10, lat: -5 },
    ]
  },

  'caseta-info': {
    nombre: 'Caseta de Información',
    emoji: 'ℹ️',
    // imagePath: 'fotos/nodo_02_caseta.jpg',
    bgColor: 0x2a1800, fogColor: 0x100800,
    startLon: 90,
    connections: [
      { to: 'entrada-principal', lon: 180, lat: -40, label: 'Volver a entrada' },
      { to: 'pasillo-a1',        lon:  10, lat: -38, label: 'Pasillo A' },
    ],
    hotspots: [
      { id: 'bienvenida', lon: 30, lat: -8 },
    ]
  },

  'pasillo-a1': {
    nombre: 'Pasillo A — Norte',
    emoji: '🏪',
    // imagePath: 'fotos/nodo_03_pasillo_a1.jpg',
    bgColor: 0x4a2800, fogColor: 0x1a0d00,
    startLon: 0,
    connections: [
      { to: 'entrada-principal', lon: 180, lat: -40, label: 'Volver a entrada' },
      { to: 'pasillo-a2',        lon:   0, lat: -42, label: 'Avanzar por pasillo A' },
      { to: 'pasillo-b1',        lon:  90, lat: -38, label: 'Cruzar a pasillo B' },
    ],
    hotspots: [
      { id: 'tamales', lon: -40, lat: -8 },
    ]
  },

  'pasillo-a2': {
    nombre: 'Pasillo A — Centro',
    emoji: '🏬',
    // imagePath: 'fotos/nodo_04_pasillo_a2.jpg',
    bgColor: 0x4a2200, fogColor: 0x1a0900,
    startLon: 0,
    connections: [
      { to: 'pasillo-a1', lon: 180, lat: -40, label: 'Volver al norte' },
      { to: 'pasillo-a3', lon:   0, lat: -42, label: 'Seguir al sur' },
      { to: 'pasillo-b2', lon:  90, lat: -38, label: 'Cruzar a pasillo B' },
    ],
    hotspots: [
      { id: 'mariscos', lon: 45, lat: -10 },
    ]
  },

  'pasillo-a3': {
    nombre: 'Pasillo A — Sur',
    emoji: '🍲',
    // imagePath: 'fotos/nodo_05_pasillo_a3.jpg',
    bgColor: 0x5c1500, fogColor: 0x200500,
    startLon: 0,
    connections: [
      { to: 'pasillo-a2',       lon: 180, lat: -40, label: 'Volver al centro' },
      { to: 'zona-gastronomia', lon:   0, lat: -42, label: 'Zona gastronómica' },
    ],
    hotspots: [
      { id: 'caldos', lon: -35, lat: -8 },
      { id: 'dulces', lon:  55, lat: -8 },
    ]
  },

  'zona-gastronomia': {
    nombre: 'Zona Gastronómica',
    emoji: '🍽️',
    // imagePath: 'fotos/nodo_06_gastronomia.jpg',
    bgColor: 0x6a1200, fogColor: 0x280400,
    startLon: 0,
    connections: [
      { to: 'pasillo-a3', lon: 180, lat: -40, label: 'Volver al pasillo A' },
      { to: 'pasillo-b3', lon:  90, lat: -38, label: 'Pasillo B' },
    ],
    hotspots: [
      { id: 'caldos', lon: -20, lat: -8 },
      { id: 'dulces', lon:  50, lat: -8 },
    ]
  },

  'pasillo-b1': {
    nombre: 'Pasillo B — Norte',
    emoji: '🧵',
    // imagePath: 'fotos/nodo_07_pasillo_b1.jpg',
    bgColor: 0x1a1050, fogColor: 0x0a0820,
    startLon: -90,
    connections: [
      { to: 'pasillo-a1', lon: -90, lat: -38, label: 'Cruzar a pasillo A' },
      { to: 'pasillo-b2', lon:   0, lat: -42, label: 'Avanzar por pasillo B' },
    ],
    hotspots: [
      { id: 'bordados', lon: 40, lat: -8 },
    ]
  },

  'pasillo-b2': {
    nombre: 'Pasillo B — Centro',
    emoji: '🌴',
    // imagePath: 'fotos/nodo_08_pasillo_b2.jpg',
    bgColor: 0x1a1545, fogColor: 0x08061a,
    startLon: -90,
    connections: [
      { to: 'pasillo-b1', lon: 180, lat: -40, label: 'Volver al norte' },
      { to: 'pasillo-b3', lon:   0, lat: -42, label: 'Seguir al sur' },
      { to: 'pasillo-a2', lon: -90, lat: -38, label: 'Cruzar a pasillo A' },
    ],
    hotspots: [
      { id: 'petate', lon: -45, lat: -8 },
    ]
  },

  'pasillo-b3': {
    nombre: 'Pasillo B — Sur',
    emoji: '🎨',
    // imagePath: 'fotos/nodo_09_pasillo_b3.jpg',
    bgColor: 0x150e3f, fogColor: 0x060418,
    startLon: -90,
    connections: [
      { to: 'pasillo-b2',       lon: 180, lat: -40, label: 'Volver al centro' },
      { to: 'zona-gastronomia', lon: -90, lat: -38, label: 'Zona gastronómica' },
    ],
    hotspots: [
      { id: 'bordados', lon:  30, lat: -8 },
      { id: 'petate',   lon: -40, lat: -8 },
    ]
  },
};


// ════════════════════════════════════════════════════════
//  PUESTOS / LUGARES DE INTERÉS
// ════════════════════════════════════════════════════════
const PUESTOS = {
  bienvenida: {
    nombre: 'Bienvenidos al Mercado', cat: '📍 Información', emoji: '🏛', badge: 'Centro del Mercado',
    desc: 'El Mercado Municipal de Cosoleacaque es el corazón económico y cultural del municipio. Artesanos, cocineras y agricultores mantienen viva la tradición del sur veracruzano.',
    fotos: ['🏛', '🌺', '🎊'], prods: []
  },
  tamales: {
    nombre: 'Tamales de Chipilín "Doña Lupe"', cat: '🫔 Gastronomía', emoji: '🫔', badge: 'Especialidad Local',
    desc: 'Los mejores tamales de chipilín del municipio. Doña Lupe los prepara desde hace 30 años con masa de maíz criollo y hoja de plátano.',
    fotos: ['🫔', '🌿', '🍃'],
    prods: [
      { e: '🫔', nom: 'Tamal Chipilín con Pollo',    det: 'Hoja plátano, masa verde',      mxn: 35  },
      { e: '🌱', nom: 'Tamal Chipilín con Rajas',    det: 'Sin carne, chile jalapeño',     mxn: 30  },
      { e: '🫘', nom: 'Tamal de Frijol Negro',       det: 'Frijol criollo, epazote',       mxn: 28  },
      { e: '📦', nom: 'Docena para envío (12 pzs)',  det: 'Empaque especial para viaje',   mxn: 320 },
    ]
  },
  mariscos: {
    nombre: 'Mariscos "Don Chago"', cat: '🦐 Mariscos', emoji: '🦐', badge: 'Frescos del Día',
    desc: 'Mariscos frescos del río Coatzacoalcos y las costas del Golfo cada mañana. Especialidad en camarones a la diabla y ostiones al mojo.',
    fotos: ['🦐', '🦀', '🐟'],
    prods: [
      { e: '🦐', nom: 'Camarones a la Diabla 250g', det: 'Chile árbol, ajo, tomate',        mxn: 120 },
      { e: '🫙', nom: 'Pasta de Camarón Seco 200g', det: 'Tradicional, empacado al vacío',  mxn: 85  },
      { e: '🌶', nom: 'Salsa Macha de Camarón',     det: 'Receta abuela, frasco 150ml',     mxn: 65  },
    ]
  },
  caldos: {
    nombre: 'Caldos "La Riverita"', cat: '🍲 Comida', emoji: '🍲', badge: 'Desde 1985',
    desc: 'Tres generaciones sirviendo caldos contundentes. Su mole negro olmeca y salsas regionales son un producto estrella para llevar a casa.',
    fotos: ['🍲', '🥘', '🫕'],
    prods: [
      { e: '🥫', nom: 'Mole Negro Olmeca 300g',    det: 'Receta familiar, listo para usar', mxn: 145 },
      { e: '🌶', nom: 'Chile en Vinagre Casero',   det: 'Jalapeños y zanahorias 250ml',     mxn: 45  },
      { e: '🫙', nom: 'Pasta de Achiote Regional', det: '100% natural, 150g',               mxn: 55  },
    ]
  },
  dulces: {
    nombre: 'Dulcería "Los Sabores de Cosolea"', cat: '🍬 Dulces', emoji: '🍬', badge: 'Tradición Dulce',
    desc: 'Dulces artesanales de tamarindo, coco, guanábana y mamey. Sin conservadores. El souvenir perfecto desde Cosoleacaque al mundo.',
    fotos: ['🍬', '🥥', '🍭'],
    prods: [
      { e: '🥥', nom: 'Cocada de Coco Tostado 200g', det: 'Piloncillo, canela',              mxn: 55  },
      { e: '🍬', nom: 'Bolas de Tamarindo con Chile', det: '12 piezas sin conservadores',    mxn: 40  },
      { e: '🍭', nom: 'Jamoncillo de Pepita (caja)',  det: '6 piezas, presentación regalo',  mxn: 95  },
      { e: '🎁', nom: 'Caja Mixta Dulces Cosolea',   det: '20 piezas surtidas para regalo', mxn: 185 },
    ]
  },
  bordados: {
    nombre: 'Bordados Nahuas "Artesanas del Sur"', cat: '🧵 Artesanías', emoji: '🧵', badge: 'Hecho a Mano',
    desc: 'Colectivo de 8 artesanas nahuas que bordan con motivos de aves, flores y figuras olmecas. Cada pieza tarda entre 3 y 15 días.',
    fotos: ['🧵', '👗', '🌺'],
    prods: [
      { e: '👗', nom: 'Blusa Bordada a Mano',      det: 'Motivos florales, algodón 100%', mxn: 480 },
      { e: '🧣', nom: 'Camino de Mesa 40×120cm',   det: 'Flores y aves tropicales',       mxn: 320 },
      { e: '👜', nom: 'Bolsa de Tela Bordada',     det: 'Asa larga, cierre, 30×35cm',     mxn: 265 },
      { e: '🎀', nom: 'Servilletas Bordadas (×4)', det: 'Diseños olmecas 40×40cm',         mxn: 180 },
    ]
  },
  petate: {
    nombre: 'Petates y Palma "Don Aurelio"', cat: '🌴 Artesanía en Palma', emoji: '🌴', badge: 'Técnica Ancestral',
    desc: '4 generaciones tejiendo la palma real. Petates, sombreros y bolsas de palma coyul — la misma que da nombre a Cosoleacaque.',
    fotos: ['🌴', '🎩', '🧺'],
    prods: [
      { e: '🎩', nom: 'Sombrero de Palma Tejido',  det: 'Talla ajustable, acabado fino',  mxn: 180 },
      { e: '🧺', nom: 'Bolsa de Palma Trenzada',   det: '30×25cm, asa corta',             mxn: 145 },
      { e: '🌿', nom: 'Abanico de Palma Natural',  det: 'Decorativo o funcional, 25cm',   mxn: 65  },
      { e: '🪺', nom: 'Petate Pequeño 60×80cm',    det: 'Tejido tradicional fibra natural',mxn: 220 },
    ]
  },
};


// ════════════════════════════════════════════════════════
//  THREE.JS — VISOR 360
// ════════════════════════════════════════════════════════
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const scene3 = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 0.01);

let lon = 0, lat = 0;
let isDrag = false, sx = 0, sy = 0, sl = 0, sb = 0;
let currentNode = null;
let cart = [];
let visited = new Set();


// ── RENDER LOOP ──
function animate() {
  requestAnimationFrame(animate);
  lat = Math.max(-85, Math.min(85, lat));
  const phi   = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  camera.lookAt(
    500 * Math.sin(phi) * Math.cos(theta),
    500 * Math.cos(phi),
    500 * Math.sin(phi) * Math.sin(theta)
  );
  updateOverlayPositions();
  renderer.render(scene3, camera);
}


// ── CARGAR NODO CON TRANSICIÓN ──
async function gotoNode(nodeId, instant = false) {
  const node = NODES[nodeId];
  if (!node) return;

  if (!instant) await fadeOut();

  document.getElementById('loading').classList.remove('hide');
  while (scene3.children.length) scene3.remove(scene3.children[0]);

  const geo = new THREE.SphereGeometry(500, 64, 32);
  geo.scale(-1, 1, 1);

  // ── Con foto real: descomenta estas líneas ──
  // const material = node.imagePath
  //   ? await loadTextureMaterial(node.imagePath)
  //   : makePlaceholder(node);

  const material = makePlaceholder(node);  // ← quitar cuando uses fotos reales

  scene3.add(new THREE.Mesh(geo, material));
  scene3.fog = new THREE.FogExp2(node.fogColor, 0.0007);

  lon = node.startLon ?? 0;
  lat = 0;
  currentNode = nodeId;
  visited.add(nodeId);

  document.getElementById('node-info').textContent = `${node.emoji}  ${node.nombre}`;
  document.getElementById('loading').classList.add('hide');

  buildNavOverlay(node);
  buildMinimap();
  closePanel();

  if (!instant) await fadeIn();
}


// ── CARGA TEXTURA REAL ──
// Usar cuando tengas las fotos 360° equirectangulares
function loadTextureMaterial(path) {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(path, (tex) => {
      resolve(new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide }));
    });
  });
}


// ── PLACEHOLDER PROCEDURAL ──
// Se usa mientras no hay fotos reales
function makePlaceholder(node) {
  const W = 2048, H = 1024;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');

  const c1 = '#' + node.bgColor.toString(16).padStart(6, '0');
  const c2 = '#' + node.fogColor.toString(16).padStart(6, '0');
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0,    '#0d0512');
  g.addColorStop(0.3,  c1);
  g.addColorStop(0.65, c1);
  g.addColorStop(1,    c2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Suelo
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, H * 0.65, W, H * 0.35);

  // Línea de horizonte
  ctx.strokeStyle = 'rgba(224,19,108,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, H * 0.65); ctx.lineTo(W, H * 0.65); ctx.stroke();

  // Detalles ambientales aleatorios
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * W, Math.random() * H * 0.65, Math.random() * 45 + 8, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.035})`;
    ctx.fill();
  }

  // Nombre del nodo
  ctx.save();
  ctx.globalAlpha = 0.07;
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 75px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(node.nombre, W / 2, H * 0.43);
  ctx.font = '22px monospace';
  ctx.fillText('COSOLEACAQUE · VERACRUZ · MÉXICO', W / 2, H * 0.55);
  ctx.restore();

  return new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), side: THREE.BackSide });
}


// ── FADE ──
function fadeOut() {
  return new Promise(res => {
    document.getElementById('fade').classList.add('in');
    setTimeout(res, 380);
  });
}
function fadeIn() {
  return new Promise(res => {
    document.getElementById('fade').classList.remove('in');
    setTimeout(res, 380);
  });
}


// ════════════════════════════════════════════════════════
//  DOM OVERLAY — Flechas de navegación + Hotspots
// ════════════════════════════════════════════════════════
function buildNavOverlay(node) {
  const layer = document.getElementById('nav-layer');
  layer.innerHTML = '';

  // Flechas de conexión
  (node.connections || []).forEach(conn => {
    const el = document.createElement('div');
    el.className = 'nav-arrow';
    el.dataset.lon = conn.lon;
    el.dataset.lat = conn.lat;

    const angle = ((conn.lon - lon) % 360 + 360) % 360;
    el.innerHTML = `
      <div class="arr-ring">
        <svg class="arr-chevron" viewBox="0 0 24 24"
          style="transform:rotate(${angle > 180 ? angle - 360 : angle}deg)">
          <polyline points="18,15 12,9 6,15"/>
        </svg>
      </div>
      <div class="arr-label">${conn.label}</div>`;

    el.addEventListener('click', e => { e.stopPropagation(); gotoNode(conn.to); });
    layer.appendChild(el);
  });

  // Hotspots de puestos
  (node.hotspots || []).forEach(hs => {
    const p = PUESTOS[hs.id];
    if (!p) return;

    const el = document.createElement('div');
    el.className = 'hs-puesto';
    el.dataset.lon = hs.lon;
    el.dataset.lat = hs.lat;
    el.innerHTML = `
      <div class="hs-puesto-ring">
        <div class="hs-puesto-dot"></div>
      </div>
      <div class="hs-puesto-label">${p.nombre}</div>`;

    el.addEventListener('click', e => { e.stopPropagation(); openPanel(hs.id); });
    layer.appendChild(el);
  });
}


// ── Proyectar lon/lat → posición 2D en pantalla ──
function lonLatToScreen(lonDeg, latDeg) {
  const phi   = THREE.MathUtils.degToRad(90 - latDeg);
  const theta = THREE.MathUtils.degToRad(lonDeg);
  const v = new THREE.Vector3(
    500 * Math.sin(phi) * Math.cos(theta),
    500 * Math.cos(phi),
    500 * Math.sin(phi) * Math.sin(theta)
  );
  const proj = v.clone().project(camera);
  return {
    x:       (proj.x + 1) / 2 * window.innerWidth,
    y:       -(proj.y - 1) / 2 * window.innerHeight,
    visible: proj.z < 1
  };
}

function updateOverlayPositions() {
  document.querySelectorAll('.nav-arrow, .hs-puesto').forEach(el => {
    const { x, y, visible } = lonLatToScreen(
      parseFloat(el.dataset.lon),
      parseFloat(el.dataset.lat)
    );
    el.style.left    = x + 'px';
    el.style.top     = y + 'px';
    el.style.display = visible ? 'flex' : 'none';
  });
}


// ════════════════════════════════════════════════════════
//  CONTROLES DE CÁMARA
// ════════════════════════════════════════════════════════
function getXY(e) {
  return e.touches
    ? { x: e.touches[0].pageX, y: e.touches[0].pageY }
    : { x: e.clientX, y: e.clientY };
}

canvas.addEventListener('mousedown', e => {
  isDrag = true;
  const { x, y } = getXY(e);
  sx = x; sy = y; sl = lon; sb = lat;
  canvas.classList.add('drag');
});
canvas.addEventListener('touchstart', e => {
  isDrag = true;
  const { x, y } = getXY(e);
  sx = x; sy = y; sl = lon; sb = lat;
}, { passive: true });

canvas.addEventListener('mousemove', e => {
  if (!isDrag) return;
  const { x, y } = getXY(e);
  lon = (sx - x) * 0.18 + sl;
  lat = (y - sy) * 0.18 + sb;
});
canvas.addEventListener('touchmove', e => {
  if (!isDrag) return;
  e.preventDefault();
  const { x, y } = getXY(e);
  lon = (sx - x) * 0.18 + sl;
  lat = (y - sy) * 0.18 + sb;
}, { passive: false });

canvas.addEventListener('mouseup',    () => { isDrag = false; canvas.classList.remove('drag'); });
canvas.addEventListener('touchend',   () => { isDrag = false; });
canvas.addEventListener('mouseleave', () => { isDrag = false; canvas.classList.remove('drag'); });

canvas.addEventListener('wheel', e => {
  e.preventDefault();
  camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.04, 30, 100);
  camera.updateProjectionMatrix();
}, { passive: false });

document.addEventListener('keydown', e => {
  const step = 8;
  if (e.key === 'ArrowLeft')  lon -= step;
  if (e.key === 'ArrowRight') lon += step;
  if (e.key === 'ArrowUp')    lat = Math.min(85, lat + 5);
  if (e.key === 'ArrowDown')  lat = Math.max(-85, lat - 5);
  if (e.key === 'Escape') {
    closePanel();
    document.getElementById('mCart').classList.remove('open');
  }
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


// ════════════════════════════════════════════════════════
//  MINIMAPA
// ════════════════════════════════════════════════════════
function buildMinimap() {
  const container = document.getElementById('mm-nodes');
  container.innerHTML = '';
  Object.entries(NODES).forEach(([id, node]) => {
    const btn = document.createElement('div');
    btn.className = 'mm-node' +
      (id === currentNode ? ' curr' : '') +
      (visited.has(id) && id !== currentNode ? ' visited' : '');
    btn.textContent = node.emoji;
    const tip = document.createElement('div');
    tip.className = 'mm-tip';
    tip.textContent = node.nombre;
    btn.appendChild(tip);
    btn.addEventListener('click', () => gotoNode(id));
    container.appendChild(btn);
  });
}


// ════════════════════════════════════════════════════════
//  PANEL DE PUESTO
// ════════════════════════════════════════════════════════
function openPanel(id) {
  const p = PUESTOS[id];
  if (!p) return;

  document.getElementById('pemoji').textContent = p.emoji;
  document.getElementById('pbadge').textContent = p.badge;
  document.getElementById('pcat').textContent   = p.cat;
  document.getElementById('pname').textContent  = p.nombre;
  document.getElementById('pdesc').textContent  = p.desc;

  // Galería
  const gal = document.getElementById('pgal');
  gal.innerHTML = '';
  p.fotos.forEach(f => {
    const d = document.createElement('div');
    d.className = 'pgali';
    d.textContent = f;
    // Con fotos reales:
    // d.innerHTML = `<img src="fotos/puestos/${id}_1.jpg" style="width:100%;height:100%;object-fit:cover">`;
    gal.appendChild(d);
  });

  // Productos
  const sec   = document.getElementById('psec');
  const prods = document.getElementById('pprods');
  prods.innerHTML = '';

  if (p.prods && p.prods.length) {
    sec.textContent = '✦ Productos · Envío internacional disponible';
    p.prods.forEach(pr => {
      const row = document.createElement('div');
      row.className = 'prow';
      row.innerHTML = `
        <div class="pe">${pr.e}</div>
        <div class="pi">
          <div class="pn">${pr.nom}</div>
          <div class="pd">${pr.det}</div>
        </div>
        <div class="pp">$${pr.mxn} MXN</div>
        <button class="badd">+</button>`;
      row.querySelector('.badd').onclick = () => addToCart(id, pr, p.nombre);
      prods.appendChild(row);
    });
    document.getElementById('pfoot').textContent = '✈️  Envío via DHL Express · Desde Cosoleacaque al mundo';
  } else {
    sec.textContent = '';
    document.getElementById('pfoot').textContent = '';
  }

  document.getElementById('panel').classList.add('open');
}

function closePanel() {
  document.getElementById('panel').classList.remove('open');
}


// ════════════════════════════════════════════════════════
//  CARRITO
// ════════════════════════════════════════════════════════
function addToCart(pid, pr, pNom) {
  const ex = cart.find(i => i.nom === pr.nom);
  ex ? ex.qty++ : cart.push({ ...pr, pid, pNom, qty: 1 });
  updateCartTotals();
  showToast(`✓  ${pr.nom} agregado`);
}

function removeFromCart(i) {
  cart.splice(i, 1);
  renderCartList();
}

function updateCartTotals() {
  const tot = cart.reduce((s, i) => s + i.mxn * i.qty, 0);
  document.getElementById('cqty').textContent = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('csub').textContent = `$${tot.toLocaleString()} MXN`;
  document.getElementById('ctot').textContent = `$${tot.toLocaleString()} MXN`;
}

function renderCartList() {
  const el = document.getElementById('clist');
  if (!cart.length) {
    el.innerHTML = '<div class="cempty">🧺<br>Tu canasta está vacía.<br>¡Camina por el mercado!</div>';
    updateCartTotals();
    return;
  }
  el.innerHTML = cart.map((it, i) => `
    <div class="crow">
      <div class="cre">${it.e}</div>
      <div class="cri">
        <div class="crn">${it.nom}${it.qty > 1 ? ' ×' + it.qty : ''}</div>
        <div class="crp2">${it.pNom}</div>
      </div>
      <div class="crp">$${(it.mxn * it.qty).toLocaleString()} MXN</div>
      <button class="crm" onclick="removeFromCart(${i})">✕</button>
    </div>`).join('');
  updateCartTotals();
}

function toggleCart() {
  renderCartList();
  document.getElementById('mCart').classList.toggle('open');
}

function checkout() {
  if (!cart.length) { showToast('Tu canasta está vacía'); return; }
  showToast('🚧 Integración de pagos próximamente');
}


// ── TOAST ──
let toastT;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2600);
}


// ── CERRAR MODAL AL HACER CLIC FUERA ──
document.getElementById('mCart').addEventListener('click', e => {
  if (e.target === document.getElementById('mCart'))
    document.getElementById('mCart').classList.remove('open');
});


// ── INTRO ──
document.getElementById('btn-enter').addEventListener('click', () => {
  document.getElementById('intro').classList.add('out');
  setTimeout(() => document.getElementById('intro').style.display = 'none', 750);
});


// ════════════════════════════════════════════════════════
//  ARRANCAR
// ════════════════════════════════════════════════════════
animate();
gotoNode('entrada-principal', true);
