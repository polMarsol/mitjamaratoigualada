import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import gsap from 'gsap';
import { makeSurface, buildPanel, buildCollar, S, CX, CY } from './shirt/geometry';
import { loadAssets, frontTexture, backTexture, weaveTexture, bibTexture } from './shirt/textures';

const host = document.getElementById('shirt-viewer');
if (host) init(host);

async function init(host: HTMLElement) {
  const status = document.getElementById('shirt-status')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('shirt-canvas') as HTMLCanvasElement;
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true }); }
  catch { status.textContent = host.dataset.nogl || 'WebGL no disponible'; return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.85;
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(2, 3, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xbfe0ff, 0.5); fill.position.set(-3, 1, -3); scene.add(fill);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.08; controls.enablePan = false;
  controls.minDistance = 2.4; controls.maxDistance = 9; controls.minPolarAngle = 0.35; controls.maxPolarAngle = Math.PI - 0.35;
  controls.autoRotateSpeed = 1.4; controls.autoRotate = !reduce;
  controls.listenToKeyEvents(canvas);
  const home = () => (window.innerWidth < 700 ? 8.2 : 6.4);
  const setView = (az: number, pol = Math.PI / 2 - 0.05, dist = home(), instant = false) => {
    const s = { az: Math.atan2(camera.position.x, camera.position.z), pol: Math.acos(camera.position.y / camera.position.length()), d: camera.position.length() };
    let d = az - s.az; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const tgt = { az: s.az + d, pol, d: dist };
    const apply = () => camera.position.set(s.d * Math.sin(s.pol) * Math.sin(s.az), s.d * Math.cos(s.pol), s.d * Math.sin(s.pol) * Math.cos(s.az));
    if (instant || reduce) { Object.assign(s, tgt); apply(); return; }
    gsap.to(s, { ...tgt, duration: 1.1, ease: 'expo.inOut', onUpdate: apply });
  };
  setView(0.35, Math.PI / 2 - 0.05, home(), true);

  const resize = () => { const w = host.clientWidth, h = host.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  new ResizeObserver(resize).observe(host); resize();

  // ---------- Model ----------
  status.textContent = host.dataset.loading || 'Carregant…';
  await new Promise((r) => requestAnimationFrame(r));
  const assets = await loadAssets();
  const front = makeSurface('front'), back = makeSurface('back');
  const weave = new THREE.CanvasTexture(weaveTexture()); weave.wrapS = weave.wrapT = THREE.RepeatWrapping; weave.repeat.set(70, 60);
  const mk = (c: HTMLCanvasElement) => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); return t; };
  const mat = (t: THREE.Texture) => new THREE.MeshStandardMaterial({ map: t, roughness: 0.88, metalness: 0, bumpMap: weave, bumpScale: 1.2 });
  const lining = new THREE.MeshStandardMaterial({ color: 0x0e6f86, roughness: 0.95, side: THREE.BackSide }); // cara interior llisa
  const shirt = new THREE.Group();
  for (const [surf, kind, tex] of [[front, 'front', frontTexture(assets)], [back, 'back', backTexture()]] as const) {
    const g = buildPanel(surf, kind);
    shirt.add(new THREE.Mesh(g, mat(mk(tex))), new THREE.Mesh(g, lining));
  }
  shirt.add(buildCollar(front, back));

  // dorsal (opcional) enganxat a la superfície del davant
  const bibW = 270, bibH = 193, bibCX = CX, bibCY = 690;
  const bg = new THREE.PlaneGeometry(bibW * S, bibH * S, 26, 18); const p = bg.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = bibCX + p.getX(i) / S, y = bibCY - p.getY(i) / S; p.setZ(i, (front.heightAt(x, y) + 3) * S); p.setX(i, (x - CX) * S); p.setY(i, (CY - y) * S); }
  bg.computeVertexNormals();
  const bibT = new THREE.CanvasTexture(bibTexture(assets)); bibT.colorSpace = THREE.SRGBColorSpace; bibT.anisotropy = 8;
  const bib = new THREE.Mesh(bg, new THREE.MeshStandardMaterial({ map: bibT, roughness: 0.6, side: THREE.DoubleSide })); bib.visible = false; shirt.add(bib);
  scene.add(shirt);

  // ombra suau sota la peça
  const sc = document.createElement('canvas'); sc.width = sc.height = 128; const sx = sc.getContext('2d')!;
  const rg = sx.createRadialGradient(64, 64, 4, 64, 64, 62); rg.addColorStop(0, 'rgba(0,20,40,.35)'); rg.addColorStop(1, 'rgba(0,20,40,0)'); sx.fillStyle = rg; sx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.1), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.42; scene.add(shadow);

  status.hidden = true; host.classList.add('ready');

  // ---------- UI ----------
  const on = (id: string, fn: (e: Event) => void) => document.getElementById(id)?.addEventListener('click', fn);
  const stop = () => { controls.autoRotate = false; (document.getElementById('shirt-auto') as HTMLInputElement).checked = false; };
  canvas.addEventListener('pointerdown', stop);
  on('v-front', () => { stop(); setView(0); }); on('v-back', () => { stop(); setView(Math.PI); });
  on('v-left', () => { stop(); setView(-1.15, Math.PI / 2 - 0.15); }); on('v-right', () => { stop(); setView(1.15, Math.PI / 2 - 0.15); });
  on('v-reset', () => { setView(0.35, Math.PI / 2 - 0.05); });
  (document.getElementById('shirt-bib') as HTMLInputElement).addEventListener('change', (e) => { bib.visible = (e.target as HTMLInputElement).checked; });
  (document.getElementById('shirt-auto') as HTMLInputElement).addEventListener('change', (e) => { controls.autoRotate = (e.target as HTMLInputElement).checked; });
  (document.getElementById('shirt-auto') as HTMLInputElement).checked = controls.autoRotate;
  (window as any).__shirt = { setView, stop, bib: (v: boolean) => (bib.visible = v) }; // per a proves

  // només renderitza quan és visible
  let visible = true; new IntersectionObserver((e) => (visible = e[0].isIntersecting)).observe(host);
  renderer.setAnimationLoop(() => { if (!visible) return; controls.update(); renderer.render(scene, camera); });
}
