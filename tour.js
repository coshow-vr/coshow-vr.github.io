// 2026 CO-SHOW 가상 투어 — 1027 전시장 시안(제작승인서) 기준
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const FONT = 'GmarketSans,"Malgun Gothic","Apple SD Gothic Neo",sans-serif';
try { await Promise.race([document.fonts.load('700 40px GmarketSans'), new Promise(r => setTimeout(r, 2500))]); } catch (e) {}

/* ---------- 기본 ---------- */
const app = document.getElementById('app');
// 화질: 주소 ?q=high|low 또는 [화질] 단추(기기에 기억). 처음엔 폰·태블릿 = 저화질, PC = 고화질
const QS = new URLSearchParams(location.search).get('q'), QSAVE = (() => { try { return localStorage.getItem('cvr_q'); } catch (e) { return null; } })();
const Q = QS || QSAVE || 'low';   // 기본은 저화질 (고화질은 단추로 고르면 기억)
const LOW = Q === 'low';                                                        // 저화질 = 빛 번짐 · 스포트라이트 끄고 해상도 낮춤
const renderer = new THREE.WebGLRenderer({ antialias: !LOW, powerPreference: 'high-performance' });
renderer.setPixelRatio(LOW ? Math.min(devicePixelRatio, 1) : Math.min(devicePixelRatio * 1.25, 2.5));   // 고화질 = 화면보다 조금 더 촘촘히 그림
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.xr.enabled = true;
app.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9aa6ba);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 1500);
const rig = new THREE.Group(); rig.add(camera); scene.add(rig);

// 조명: 로비·바깥 = 밝은 실내 반사광(환경맵), 전시장·다목적홀 = 거의 꺼 두고 정한 곳에만 스포트라이트
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
let ZONE = 1;                                                   // 지금 짓는 구역의 밝기 (로비 1 · 어두운 곳 0.03 ~ 0.2)
// 전시장 = 푸른 조명 (휴게공간·바닥동선 시안처럼): 반사광을 파랗게 물들인 환경맵을 전시장 재질에만 씀
const blueEnv = (() => { const r = new RoomEnvironment(), t = new THREE.Color(0x3f86ff); r.traverse(o => { if (o.material) { o.material = o.material.clone(); o.material.color.multiply(t); } }); return pmrem.fromScene(r, 0.04).texture; })();
let ZENV = null;
const HALLM = [], HALLB = [], HALLFX = [];                     // 전시장 조명 켜기 · 끄기용 (재질 · 그림판 · 빛줄기)
const zoned = m => { m.envMapIntensity = ZONE; return m; };
const composer = LOW ? null : new EffectComposer(renderer);
if (composer) { composer.addPass(new RenderPass(scene, camera)); composer.addPass(new UnrealBloomPass(new THREE.Vector2(innerWidth / 2, innerHeight / 2), 0.75, 0.55, 1.1)); composer.addPass(new OutputPass()); }

const manager = new THREE.LoadingManager();
const TL = new THREE.TextureLoader(manager);
const TC = {};
const tex = (u) => { if (TC[u]) return TC[u]; const t = TL.load(u); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return (TC[u] = t); };

const M = (c, o = {}) => { const m = new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0, envMapIntensity: ZONE, envMap: ZENV, ...o }); if (ZENV && m.envMap === ZENV) HALLM.push([m, m.envMapIntensity]); return m; };
const E = (c, i = 1) => new THREE.MeshStandardMaterial({ color: 0x000000, emissive: c, emissiveIntensity: i, envMapIntensity: 0 });
const dimC = () => new THREE.Color().setScalar(ZONE < 1 ? 0.4 : 1);   // 어두운 곳의 그림·글자판은 덜 밝게
const hallB = m => { if (ZENV) HALLB.push(m); return m; };
const B = (m) => hallB(new THREE.MeshBasicMaterial({ map: m, transparent: true, toneMapped: false, color: dimC() }));
const IMG = (m, side = THREE.FrontSide) => hallB(new THREE.MeshBasicMaterial({ map: m, side, toneMapped: false, color: dimC() }));
const GLOW = (m, k = 1.6, o = {}) => new THREE.MeshBasicMaterial({ map: m, toneMapped: false, color: new THREE.Color().setScalar(k), ...o });   // 빛 번지는 LED

const walkOnly = new THREE.Group(); scene.add(walkOnly);       // 걷기에서만 보이는 천장·높은 벽
const birdOnly = new THREE.Group(); scene.add(birdOnly);       // 조감에서만 보이는 바닥 글자
const picks = [];                                              // 눌러서 여는 물체

function box(w, h, d, mat, x, z, y0 = 0, parent = scene) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y0 + h / 2, z); parent.add(m); return m;
}
function boxXZ(x0, x1, z0, z1, h, mat, y0 = 0, parent = scene) { return box(x1 - x0, h, z1 - z0, mat, (x0 + x1) / 2, (z0 + z1) / 2, y0, parent); }
function panel(map, w, h, x, y, z, ry = 0, parent = scene, side) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), IMG(map, side)); m.position.set(x, y, z); m.rotation.y = ry; parent.add(m); return m;
}
function floorPlane(x0, x1, z0, z1, mat, y = 0.01, parent = scene) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mat); m.rotation.x = -Math.PI / 2;
  m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2); parent.add(m); return m;
}
function canvasTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.userData.canvas = c; return t;
}
function fitText(g, lines, w, h, size, color = '#fff', weight = 700) {
  lines = [].concat(lines); let s = size; g.font = `${weight} ${s}px ${FONT}`;
  while (lines.some(t => g.measureText(t).width > w * 0.9) && s > 14) { s -= 2; g.font = `${weight} ${s}px ${FONT}`; }
  g.fillStyle = color; g.textAlign = 'center'; g.textBaseline = 'middle';
  const lh = s * 1.18, y0 = h / 2 - (lines.length - 1) * lh / 2;
  lines.forEach((t, i) => g.fillText(t, w / 2, y0 + i * lh + s * 0.06));
}
function textTex(lines, { w = 1024, h = 256, bg = '#0b1440', fg = '#fff', size = 120, border = null } = {}) {
  return canvasTex(w, h, (g) => {
    if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
    if (border) { g.strokeStyle = border; g.lineWidth = Math.max(6, h * 0.04); g.strokeRect(g.lineWidth / 2, g.lineWidth / 2, w - g.lineWidth, h - g.lineWidth); }
    fitText(g, lines, w, h, size, fg);
  });
}
function sign(lines, w, h, opt = {}) {
  const px = 1024, t = textTex(lines, { w: px, h: Math.max(64, Math.round(px * h / w)), ...opt });
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), B(t));
}
// 한 장 그림에서 여러 칸 잘라 쓰기 (같은 그림을 한 번만 올림)
function atlas(url, rects) {
  const out = rects.map(() => { const t = new THREE.Texture(); t.colorSpace = THREE.SRGBColorSpace; return t; });
  TL.load(url, base => out.forEach((t, i) => { const [u0, v0, u1, v1] = rects[i]; t.source = base.source; t.repeat.set(u1 - u0, v1 - v0); t.offset.set(u0, v0); t.needsUpdate = true; }));
  return out;
}
// 깃발(아래 뾰족) · 빵빠레(역삼각형) 모양 — 윗변 가운데가 원점
function pennantGeo(w, h, tip = 0.21, tri = false) {
  const P = tri ? [[0, 1], [1, 1], [0.5, 0]] : [[0, 1], [1, 1], [1, tip], [0.5, 0], [0, tip]];
  const idx = tri ? [0, 2, 1] : [0, 4, 2, 0, 2, 1, 4, 3, 2];
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(P.flatMap(([u, v]) => [(u - 0.5) * w, (v - 1) * h, 0]), 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(P.flat(), 2));
  g.setIndex(idx); g.computeVertexNormals(); return g;
}

const badgeTex = tex('badge.png');
const tileTex = Array.from({ length: 18 }, (_, i) => tex(`tiles/${String(i + 1).padStart(2, '0')}.jpg`));
const TILE_COL = ["#2c70ad","#344478","#c95073","#df6f49","#2faaa5","#654681","#36a1cf","#66ac56","#925c38","#9355a0","#414141","#415ca1","#38864a","#8ec543","#528ac7","#9b8d82","#f79526","#e97894"];
const T_FRONT = tex('tex/g_front.jpg');

/* 남색 LED 화면(정지) */
function ledTex(title, sub, { w = 1024, h = 512, tiles = false } = {}) {
  return canvasTex(w, h, (g) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#0a1650'); gr.addColorStop(.55, '#1d2fa0'); gr.addColorStop(1, '#0a7fc4');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(80,220,255,.25)'; g.lineWidth = 2;
    for (let i = 0; i < 14; i++) { g.beginPath(); g.moveTo(0, i * h / 14); g.lineTo(w, i * h / 14 + h * .3); g.stroke(); }
    if (tiles) {
      const cols = 6, rows = 3, cw = w * 0.86 / cols, ch = h * 0.52 / rows;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { g.fillStyle = TILE_COL[r * cols + c]; g.fillRect(w * .07 + c * cw + 4, h * .4 + r * ch + 4, cw - 8, ch - 8); }
      fitText(g, [title], w, h * 0.36, h * 0.17);
    } else {
      fitText(g, [title], w, h * 0.8, h * 0.2);
      if (sub) { g.save(); g.translate(0, h * 0.28); fitText(g, [sub], w, h * 0.6, h * 0.08, '#bfe9ff', 500); g.restore(); }
    }
  });
}
function ledPanel(w, h, t, x, y, z, ry, parent = scene) {
  const grp = new THREE.Group(); grp.position.set(x, y, z); grp.rotation.y = ry; parent.add(grp);
  box(w + 0.3, h + 0.3, 0.35, M(0x0a0d18, { roughness: .5 }), 0, -0.2, -h / 2 - 0.15, grp);
  grp.add(new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })));
  return grp;
}
/* ---------- 무대 조명 효과: 빛줄기 · 바닥 빛 · 트러스 · 픽셀 LED (그림 파일 없이 코드로) ---------- */
const beamMat = (c, op) => new THREE.ShaderMaterial({
  uniforms: { c: { value: new THREE.Color(c) }, op: { value: op } }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  vertexShader: 'varying float vY; varying vec3 vN; varying vec3 vV; void main(){ vY = uv.y; vec4 mv = modelViewMatrix * vec4(position, 1.); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
  fragmentShader: 'uniform vec3 c; uniform float op; varying float vY; varying vec3 vN; varying vec3 vV; void main(){ float e = abs(dot(normalize(vN), normalize(vV))); float a = op * pow(vY, 1.6) * pow(e, 1.4); gl_FragColor = vec4(c * a, a); }' });
function beam(from, to, r, c = 0xffffff, op = 0.3, parent = scene) {          // 원뿔 빛줄기 (from = 등기구)
  const a = new THREE.Vector3(...from), b = new THREE.Vector3(...to), len = a.distanceTo(b);
  const g = new THREE.CylinderGeometry(0.07, r, len, 20, 1, true); g.translate(0, -len / 2, 0);
  const m = new THREE.Mesh(g, beamMat(c, op)); m.position.copy(a); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), b.sub(a).normalize()); m.renderOrder = 5; parent.add(m); if (ZENV) HALLFX.push(m); return m;
}
const poolTex = canvasTex(256, 256, (g, w, h) => { const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.45, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
function pool(x, z, r, c = 0xffffff, k = 0.6, y = 0.1) {                      // 바닥에 떨어진 빛
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: poolTex, color: new THREE.Color(c).multiplyScalar(k), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); scene.add(m); if (ZENV) HALLFX.push(m); return m;
}
// 사각 트러스(한 변 s): 기둥 4개 + 지그재그 보강재 → 끝에 한 번에 InstancedMesh로
const TRUSS = [];
function truss(a, b, s = 0.45) {
  const A = new THREE.Vector3(...a), d = new THREE.Vector3(...b).sub(A), len = d.length(); d.normalize();
  const up = Math.abs(d.y) > 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0), u = new THREE.Vector3().crossVectors(d, up).normalize(), v = new THREE.Vector3().crossVectors(u, d);
  const C = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([i, j]) => u.clone().multiplyScalar(i * s / 2).add(v.clone().multiplyScalar(j * s / 2)));
  const n = Math.max(1, Math.round(len / s)), P = (t, c) => A.clone().addScaledVector(d, t * len / n).add(c);
  C.forEach(c => TRUSS.push([P(0, c), P(n, c), 0.035]));
  for (let i = 0; i < n; i++) C.forEach((c, k) => TRUSS.push([P(i, c), P(i + 1, C[(k + 1) % 4]), 0.018]));
}
function buildTruss() {
  const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(1, 1, 1, 6), new THREE.MeshStandardMaterial({ color: 0xc9cfd9, metalness: .85, roughness: .3, envMapIntensity: 0.45, emissive: 0x1a1f2e }), TRUSS.length), o = new THREE.Object3D(), Y = new THREE.Vector3(0, 1, 0);
  TRUSS.forEach(([p, q, r], i) => { const d = q.clone().sub(p), l = d.length(); o.position.copy(p).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(Y, d.normalize()); o.scale.set(r, l, r); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
  scene.add(im);
}
// 픽셀 LED 벽 (첨부 사진처럼 남보라 네모 불빛)
const pixTex = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#03040a'; g.fillRect(0, 0, w, h); const n = 32, c = w / n;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const r = Math.random(), band = Math.sin(i * 0.7) * Math.sin(j * 0.45) > -0.2; if (r < (band ? 0.45 : 0.85)) continue; g.globalAlpha = 0.35 + Math.random() * 0.65; g.fillStyle = r > 0.97 ? '#8ff8ff' : r > 0.85 ? '#8f7bff' : '#3446e0'; g.fillRect(i * c + 3, j * c + 3, c - 6, c - 6); }
  g.globalAlpha = 1;
});
pixTex.wrapS = pixTex.wrapT = THREE.RepeatWrapping;
const PIX = [];
function pixMat(rx, ry, k = 1.3) { const t = pixTex.clone(); t.repeat.set(rx, ry); t.needsUpdate = true; PIX.push(t); return GLOW(t, k, { side: THREE.DoubleSide }); }
function pixWall(x0, z0, x1, z1, h, y0 = 0) {
  const len = Math.hypot(x1 - x0, z1 - z0), m = new THREE.Mesh(new THREE.PlaneGeometry(len, h), pixMat(len / 4, h / 4));
  m.position.set((x0 + x1) / 2, y0 + h / 2, (z0 + z1) / 2); m.rotation.y = -Math.atan2(z1 - z0, x1 - x0); scene.add(m); return m;
}
function pixBlock(x0, x1, z0, z1, h) {
  const top = M(0x0b0c12, { roughness: .4 }), w = x1 - x0, d = z1 - z0;
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [pixMat(d / 4, h / 4), pixMat(d / 4, h / 4), top, top, pixMat(w / 4, h / 4), pixMat(w / 4, h / 4)]);
  m.position.set((x0 + x1) / 2, h / 2, (z0 + z1) / 2); scene.add(m); return m;
}
// 무대 뒤 물결 LED (분홍 · 하늘 · 보라 빛 물결)
const waveTex = canvasTex(1024, 352, () => {});
function drawWave(t) {
  const c = waveTex.userData.canvas, g = c.getContext('2d'), w = c.width, h = c.height;
  g.fillStyle = '#04051a'; g.fillRect(0, 0, w, h);
  const gr = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.45); gr.addColorStop(0, 'rgba(140,100,255,.5)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.globalCompositeOperation = 'lighter';
  [['#ff4fd8', 0], ['#4fd8ff', 1.7], ['#9a6bff', 3.1], ['#5f8bff', 4.4]].forEach(([col, ph]) => {
    g.strokeStyle = col;
    for (const [lw, al] of [[16, .12], [7, .3], [2.5, 1]]) { g.globalAlpha = al; g.lineWidth = lw; g.beginPath(); for (let x = 0; x <= w; x += 8) { const y = h / 2 + Math.sin(x * 0.009 + t * 0.9 + ph) * h * 0.2 * Math.sin(x * 0.003 + ph + t * 0.3) + Math.sin(x * 0.02 - t * 1.4 + ph) * h * 0.04; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  });
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; waveTex.needsUpdate = true;
}
drawWave(0);
const HEADS = [];                                                              // 무빙라이트 (흔들림)

// 「2026 CO-SHOW · 첨단교육, SHOW로 펼쳐지다!」 띠 그래픽 (라운지 낮은 벽)
function bandTex(len) {
  return canvasTex(2048, Math.round(2048 / len), (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#0b1240'); gr.addColorStop(.5, '#2a3cb4'); gr.addColorStop(1, '#0b1240');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.font = `700 ${h * 0.34}px ${FONT}`; g.fillStyle = '#fff'; g.textBaseline = 'middle';
    g.textAlign = 'left'; g.fillText('2026 CO-SHOW', w * 0.03, h / 2);
    g.textAlign = 'right'; g.fillText('첨단교육, SHOW로 펼쳐지다!', w * 0.97, h / 2);
  });
}
// 검정 경량파레트 · 라이팅월 느낌 (입구게이트)
const palBase = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#0c0e14'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#262a36'; g.lineWidth = 5;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { g.strokeRect(i * 128 + 10, j * 128 + 10, 108, 108); g.strokeRect(i * 128 + 34, j * 128 + 34, 60, 60); }
});
palBase.wrapS = palBase.wrapT = THREE.RepeatWrapping;
const PAL = {};
const palMat = (rx, ry) => { const k = rx + 'x' + ry; if (PAL[k]) return PAL[k]; const t = palBase.clone(); t.repeat.set(rx, ry); t.needsUpdate = true; return (PAL[k] = M(0xffffff, { map: t, roughness: .55 })); };
const cyanM = E(0x2fe4ff, 1.8);
function cyanCorner(x, y, z, parent, sx = 1, sy = 1) {     // 모서리 ㄱ자 하늘색 빛
  box(0.5, 0.05, 0.03, cyanM, x + sx * 0.25, z, y, parent); box(0.05, 0.5, 0.03, cyanM, x, z, y - (sy < 0 ? 0.5 : 0), parent);
}

/* ---------- 좌표 ---------- */
// 부스 줄 = 0915 공간사용계획 도면(px) → 바닥동선(10. 22.) 부스 줄 전체 131.75 m에 맞춤
const SB = 131.75 / 1000, CX = 942, S0 = 0.1418;
const mx = p => (p - CX) * SB, mx0 = p => (p - CX) * S0;
// 치수 확인 (10. 27.): 전시장·부스·마름모·로비 기둥 = 0915-1 사이즈실측 도면, 로비 구조물 자리 = 1027 배치도
const HALL = { x0: -71.535, x1: 71.535, z0: -61.7, z1: 0 };
const LOBBY = { x0: -73, x1: 93, z0: 7, z1: 31 };
const MH = { x0: -64, x1: 12.5, z0: 37.6, z1: 75.8, mid: -21 };
const GC = { C: -47.8, B: 0, A: 48.1 };                         // 입구게이트 가운데 (1027 배치도)
const GATES = { C: [GC.C - 4.5, GC.C + 4.5], B: [GC.B - 4.5, GC.B + 4.5], A: [GC.A - 4.5, GC.A + 4.5] };
const CZ = -30.15;                                              // 전시장 가운데 줄 (구 LED, 실측 Φ8 원 중심)

/* ---------- 바깥 바닥 ---------- */
floorPlane(-110, 135, -90, 110, M(0xb9c1cc), -0.03);
// GATE 1 · 2 앞 광장 (10. 28. 현장답사 사진 첨부 115111_4~21: 베이지 화강석 + 회색 띠 · 원형 무늬 · 그릇 화분 · 점자블록 · 캐노피 · 외벽 글자)
// 사진을 보고 모양만 맞춤. 크기 · 자리는 유나 판단(도면 없음)
const pave = canvasTex(1024, 1024, (g, w, h) => {                            // 12 m 한 칸: 0.6 m 판석 20 × 20 + 1.2 m 회색 띠
  const T = w / 20;
  for (let i = 0; i < 20; i++) for (let j = 0; j < 20; j++) { const v = 196 + (Math.random() * 18 | 0); g.fillStyle = `rgb(${v},${v - 6},${v - 16})`; g.fillRect(i * T, j * T, T, T); }
  for (let k = 0; k < 30000; k++) { const v = 150 + Math.random() * 90 | 0; g.fillStyle = `rgba(${v},${v - 4},${v - 10},.35)`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
  g.fillStyle = '#a3a7ad'; g.fillRect(0, 0, w, T * 1.5); g.fillRect(0, 0, T * 1.5, h);
  g.strokeStyle = 'rgba(120,116,108,.6)'; g.lineWidth = 2; for (let i = 0; i <= 20; i++) { g.beginPath(); g.moveTo(i * T, 0); g.lineTo(i * T, h); g.stroke(); g.beginPath(); g.moveTo(0, i * T); g.lineTo(w, i * T); g.stroke(); }
});
pave.wrapS = pave.wrapT = THREE.RepeatWrapping; pave.repeat.set(35 / 12, 70 / 12);
floorPlane(93, 128, -10, 60, M(0xffffff, { map: pave, roughness: .9 }), -0.01);
(function frontPlaza() {
  const GZ = 24;                                                             // GATE 1 가운데 z
  // 원형 무늬 (사진 7: 회색 동심원 + 점 무늬, 바깥 하늘색 선)
  const circ = canvasTex(1024, 1024, (g, w, h) => {
    const c = w / 2, R = w / 2 - 4;
    g.fillStyle = '#c9c4ba'; g.beginPath(); g.arc(c, c, R, 0, 7); g.fill();
    [[0.97, '#8fd3ea', 10], [0.9, '#6d7178', 14], [0.72, '#6d7178', 10], [0.52, '#6d7178', 10], [0.3, '#6d7178', 8], [0.12, '#6d7178', 6]].forEach(([k, col, lw]) => { g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.arc(c, c, R * k, 0, 7); g.stroke(); });
    g.fillStyle = '#5f636a';
    [[0.81, 44, 9], [0.62, 36, 8], [0.41, 26, 7], [0.21, 14, 6]].forEach(([k, n, r]) => { for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; g.beginPath(); g.arc(c + Math.cos(a) * R * k, c + Math.sin(a) * R * k, r, 0, 7); g.fill(); } });
  });
  const cm = new THREE.Mesh(new THREE.CircleGeometry(9, 64), M(0xffffff, { map: circ, roughness: .85 })); cm.rotation.x = -Math.PI / 2; cm.position.set(111, 0.0, GZ); scene.add(cm);
  // 점자블록 줄 (광장 끝 → GATE 1 · GATE 2)
  const yel = M(0xe0a020, { roughness: .6 });
  floorPlane(93.5, 128, GZ - 1.6, GZ - 1.3, yel, 0.012); floorPlane(93.5, 102, 12.6, 12.9, yel, 0.012);
  // 그릇 화분 (사진 5 · 7)
  const bowlGeo = new THREE.LatheGeometry([[0.18, 0], [0.3, 0.05], [0.62, 0.3], [0.78, 0.55], [0.72, 0.55], [0.55, 0.32], [0, 0.3]].map(([r, y]) => new THREE.Vector2(r, y)), 32);
  const bowlM = M(0x6b6f75, { roughness: .45, metalness: .5 }), grassM = M(0x8d9a5c, { roughness: 1 });
  for (const z of [-2, 4, 17.5, 31, 37, 43, 49]) for (const x of [100.5]) {
    const b = new THREE.Mesh(bowlGeo, bowlM); b.position.set(x, 0.35, z); scene.add(b);
    box(0.08, 0.35, 0.08, bowlM, x, z, 0);
    const gr = new THREE.Mesh(new THREE.SphereGeometry(0.62, 16, 10), grassM); gr.scale.y = 0.45; gr.position.set(x, 0.92, z); scene.add(gr);
  }
  // 나무 · 잔디 (광장 끝, 사진 18 · 19)
  floorPlane(124, 128, -10, 60, M(0x7f9a52, { roughness: 1 }), -0.005);
  const trunk = M(0x6a5240), leaf = M(0x6a9a4a, { roughness: 1, flatShading: true });
  const leafGeo = new THREE.IcosahedronGeometry(1, 1);
  for (let z = -7; z <= 58; z += 6.5) { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.17, 3.2, 8), trunk); t.position.set(126, 1.6, z); scene.add(t);
    [[0, 3.9, 0, 1.25], [0.6, 3.4, 0.4, 0.9], [-0.55, 3.5, -0.3, 0.95], [0.1, 4.5, -0.4, 0.8]].forEach(([dx, y, dz, r]) => { const c = new THREE.Mesh(leafGeo, leaf); c.scale.setScalar(r); c.position.set(126 + dx, y, z + dz); scene.add(c); }); }
  // 캐노피 (사진 7 · 21: GATE 위 평지붕 + 아래 다운라이트 · 은색 원기둥 · 모서리 흰 사선 기둥)
  const cx0 = 93.4, cx1 = 104, cz0 = 6, cz1 = 32, cy = 9.5;
  const dl = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#d7dbe0'; g.fillRect(0, 0, w, h); g.strokeStyle = '#b9bec6'; g.lineWidth = 4; g.strokeRect(0, 0, w, h); g.fillStyle = '#fffbe8'; g.shadowColor = '#fff'; g.shadowBlur = 10; g.beginPath(); g.arc(w / 2, h / 2, 16, 0, 7); g.fill(); });
  dl.wrapS = dl.wrapT = THREE.RepeatWrapping; dl.repeat.set((cx1 - cx0) / 2.5, (cz1 - cz0) / 2.5);
  const under = new THREE.Mesh(new THREE.PlaneGeometry(cx1 - cx0, cz1 - cz0), new THREE.MeshBasicMaterial({ map: dl, toneMapped: false, color: new THREE.Color().setScalar(0.92) })); under.rotation.x = Math.PI / 2; under.position.set((cx0 + cx1) / 2, cy - 0.01, (cz0 + cz1) / 2); scene.add(under);
  boxXZ(cx0, cx1, cz0, cz1, 0.7, M(0xc9ced6, { roughness: .4, metalness: .4 }), cy);
  boxXZ(cx1 - 0.05, cx1 + 0.05, cz0, cz1, 0.5, M(0x9aa1ab, { metalness: .6, roughness: .3 }), cy + 0.1);
  const silver = M(0xd8dde5, { metalness: .5, roughness: .3 });
  for (const z of [7, 18, 30]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, cy, 24), silver); c.position.set(cx1 - 0.6, cy / 2, z); scene.add(c); }
  const strut = M(0xf4f6f8, { roughness: .35 });
  [[-0.9, 0.5], [0, 0], [0.9, -0.5]].forEach(([dz, dx]) => { const a = new THREE.Vector3(cx1 - 2 + dx, 0, cz0 - 2.5 + dz), b = new THREE.Vector3(cx1 - 1, 15, cz0 + 1), d = b.clone().sub(a); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.32, d.length(), 16), strut); m.position.copy(a).add(b).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); scene.add(m); });
  // GATE 표지 (문 위 금색 글자)
  [['GATE 1', GZ], ['GATE 2', 12.75]].forEach(([t, z]) => { const s = sign([t], 3.2, 0.7, { bg: '#2b3138', fg: '#f2c230', size: 110 }); s.rotation.y = Math.PI / 2; s.position.set(93.42, 4.7, z); scene.add(s); });
  // 위쪽 외벽: 회색 판 + 청록 띠창 2줄 + 「김대중컨벤션센터 / Kimdaejung Convention Center」 (사진 4 · 5)
  const fz0 = -7.5, fz1 = 37, fy0 = 10.2, fy1 = 16.5, FW = fz1 - fz0, FH = fy1 - fy0;
  const fac = canvasTex(2048, Math.round(2048 * FH / FW), (g, w, h) => {
    g.fillStyle = '#c5cad1'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(150,156,166,.6)'; g.lineWidth = 2; for (let x = 0; x < w; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
    [[0.5, 0.17], [0.74, 0.13]].forEach(([y, hh]) => { const gr = g.createLinearGradient(0, h * y, 0, h * (y + hh)); gr.addColorStop(0, '#2f8f9c'); gr.addColorStop(1, '#5fb9c2'); g.fillStyle = gr; g.fillRect(0, h * y, w, h * hh); g.fillStyle = 'rgba(30,60,70,.5)'; for (let x = 0; x < w; x += 36) g.fillRect(x, h * y, 3, h * hh); });
    const sx = w * (fz1 - GZ) / FW;
    g.fillStyle = '#273a8a'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `800 ${h * 0.2}px ${FONT}`; g.fillText('김대중컨벤션센터', sx, h * 0.15);
    g.font = `700 ${h * 0.1}px ${FONT}`; g.fillText('Kimdaejung Convention Center', sx, h * 0.36);
  });
  const fm = new THREE.Mesh(new THREE.PlaneGeometry(FW, FH), M(0xffffff, { map: fac, roughness: .5 })); fm.rotation.y = Math.PI / 2; fm.position.set(93.55, (fy0 + fy1) / 2, (fz0 + fz1) / 2); scene.add(fm);
})();

/* ---------- 전시장 A·B·C홀 (어둡고 푸르게) ---------- */
ZONE = 0.3; ZENV = blueEnv;
const WALL_H = 4.5, wallDark = M(0x0c1024);
const concrete = canvasTex(512, 512, (g, w, h) => {
  g.fillStyle = '#9aa3b1'; g.fillRect(0, 0, w, h);
  for (let i = 0; i < 9000; i++) { const v = 130 + Math.random() * 60 | 0; g.fillStyle = `rgba(${v},${v + 6},${v + 16},.35)`; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
  for (let i = 0; i < 14; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * .05})`; g.beginPath(); g.ellipse(Math.random() * w, Math.random() * h, 40 + Math.random() * 90, 20 + Math.random() * 50, Math.random() * 3, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(60,66,80,.55)'; g.lineWidth = 2; g.strokeRect(1, 1, w - 2, h - 2);
});
concrete.wrapS = concrete.wrapT = THREE.RepeatWrapping; concrete.repeat.set(143 / 6, 62 / 6);   // 6 m 줄눈
floorPlane(HALL.x0, HALL.x1, HALL.z0, HALL.z1, M(0xffffff, { map: concrete, roughness: .38 }), 0.005);
// 벽: 12 m마다 양문(비상구 표시) · 소화전, 위 벽은 파란 흡음판
const hallWallTex = len => { const t = canvasTex(1024, 384, (g, w, h) => {
  g.fillStyle = '#e4e8ee'; g.fillRect(0, 0, w, h); g.strokeStyle = '#c9cfd8'; g.lineWidth = 2; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, h); g.stroke(); }
  g.fillStyle = '#9aa2ae'; g.fillRect(360, 128, 220, 256); g.fillStyle = '#8a929e'; g.fillRect(470, 128, 3, 256); g.fillStyle = '#c3c9d2'; g.fillRect(440, 250, 8, 30); g.fillRect(495, 250, 8, 30);
  g.fillStyle = '#18a050'; g.fillRect(420, 86, 100, 32); g.fillStyle = '#fff'; g.font = `700 20px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('비상구 EXIT', 470, 102);
  g.fillStyle = '#c8282e'; g.fillRect(800, 230, 70, 100); g.fillStyle = '#fff'; g.font = `700 14px ${FONT}`; g.fillText('소화전', 835, 280);
  g.fillStyle = '#8f99a8'; g.fillRect(0, h - 14, w, 14);
}); t.wrapS = THREE.RepeatWrapping; t.repeat.set(len / 12, 1); return M(0xffffff, { map: t, roughness: .7 }); };
const hallUpTex = len => { const t = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#2a3f7a'; g.fillRect(0, 0, w, h); g.strokeStyle = '#3a54a0'; g.lineWidth = 6; for (let i = 0; i <= 4; i++) { g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, h); g.stroke(); } g.strokeStyle = '#22356a'; g.lineWidth = 3; for (let j = 0; j < 16; j++) { g.beginPath(); g.moveTo(0, j * 32); g.lineTo(w, j * 32); g.stroke(); } });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(len / 8, 7.5 / 8); return M(0xffffff, { map: t, roughness: .8 }); };
function wallSeg(x0, x1, z0, z1, h = WALL_H, m = M(0xe9edf3), upper = 12, upM = M(0x1a2552)) {
  boxXZ(x0, x1, z0, z1, h, m);
  if (upper > h) boxXZ(x0, x1, z0, z1, upper - h, upM, h, walkOnly);
}
wallSeg(HALL.x0 - .6, HALL.x1 + .6, HALL.z0 - .6, HALL.z0, WALL_H, hallWallTex(144), 12, hallUpTex(144));
wallSeg(HALL.x0 - .6, HALL.x0, HALL.z0, HALL.z1, WALL_H, hallWallTex(62), 12, hallUpTex(62));
wallSeg(HALL.x1, HALL.x1 + .6, HALL.z0, HALL.z1, WALL_H, hallWallTex(62), 12, hallUpTex(62));
const bandM = M(0xdfe3ea, { envMapIntensity: 1, envMap: null }), skinM = M(0x1c2030);   // 띠 벽: 로비 쪽 밝게, 전시장 쪽 면은 어둡게
[[HALL.x0 - 2, GATES.C[0]], [GATES.C[1], GATES.B[0]], [GATES.B[1], GATES.A[0]], [GATES.A[1], HALL.x1 + 2]].forEach(([a, b]) => { boxXZ(a, b, 0.02, 7, WALL_H, bandM); boxXZ(Math.max(a, HALL.x0), Math.min(b, HALL.x1), -0.04, 0.02, WALL_H, skinM); boxXZ(a, b, 0, 7, 12 - WALL_H, wallDark, WALL_H, walkOnly); });
Object.values(GATES).forEach(([a, b]) => { floorPlane(a, b, 0, 7, M(0xb7c0cf), 0.006); boxXZ(a, b, 0, 7, 12 - 4.6, wallDark, 4.6, walkOnly); });
const ceilTex = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#0c1630'; g.fillRect(0, 0, w, h); g.strokeStyle = '#3b5aa8'; g.lineWidth = 10; g.strokeRect(0, 0, w, h); g.lineWidth = 3; g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.moveTo(0, h / 2); g.lineTo(w, h / 2); g.stroke(); g.fillStyle = '#9fc6ff'; [[128, 128], [384, 128], [128, 384], [384, 384]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); }); });
ceilTex.wrapS = ceilTex.wrapT = THREE.RepeatWrapping; ceilTex.repeat.set(143 / 10, 62 / 10);   // 지붕 트러스 격자 10 m
floorPlane(HALL.x0, HALL.x1, HALL.z0, HALL.z1, M(0x6f86c0, { map: ceilTex, side: THREE.DoubleSide, emissive: 0xffffff, emissiveMap: ceilTex, emissiveIntensity: .35 }), 12, walkOnly);
// 원형 조명 리그 8개 (휴게공간 시안의 둥근 등 걸이) · 캣워크 트러스 2줄
(function rigs() {
  const P = []; [-48, -24, 24, 48].forEach(x => [-14, -46].forEach(z => P.push([x, z])));
  const can = [], rm = M(0x2b3140, { metalness: .6, roughness: .35 });
  P.forEach(([x, z]) => { const r = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.09, 6, 32), rm); r.rotation.x = Math.PI / 2; r.position.set(x, 9.6, z); walkOnly.add(r); for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; can.push([x + Math.cos(a) * 1.8, 9.25, z + Math.sin(a) * 1.8]); } box(0.03, 2.4, 0.03, rm, x, z, 9.6, walkOnly); });
  const im = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.16, 0.2, 0.5, 10), M(0x1a1d26, { metalness: .5, roughness: .4 }), can.length), o = new THREE.Object3D();
  can.forEach((p, i) => { o.position.set(...p); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); walkOnly.add(im);
  [-14, -46].forEach(z => truss([-66, 10.4, z], [66, 10.4, z], 0.5));
})();
for (let x = -60; x <= 60; x += 20) boxXZ(x - .3, x + .3, HALL.z0, HALL.z1, .5, M(0x2a3350), 10.5, walkOnly);

// 바닥 동선 (10. 28. 승인서): 마름모 4줄 64 m × 1 m 파란 띠(분야 5줄 · 부스 원 + 화살표) + 꼭짓점 이정표 A ~ D(2 m)
const DIA = { L: [-64.9, CZ], R: [64.9, CZ], T: [0, -35.66], Bt: [0, -24.64] };   // 실측 꼭짓점 원 Φ2 m
(function diamond() {
  const { L, R, T, Bt } = DIA;
  const sh = new THREE.Shape(); sh.moveTo(L[0], -L[1]); sh.lineTo(T[0], -T[1]); sh.lineTo(R[0], -R[1]); sh.lineTo(Bt[0], -Bt[1]); sh.closePath();
  const m = new THREE.Mesh(new THREE.ShapeGeometry(sh), M(0x8a96ad, { roughness: .35 })); m.rotation.x = -Math.PI / 2; m.position.y = 0.07; scene.add(m);
  // 띠 그림 = 승인서 4쪽을 잘라 16 m씩 4조각 (평면도 방향 그대로: 왼 → 오, 그림 위 = 위쪽 부스 줄). ① B→C ② A→D ③ C→D ④ B→A
  [[1, L, T], [2, Bt, R], [3, T, R], [4, L, Bt]].forEach(([n, a, b]) => {
    const dx = b[0] - a[0], dz = b[1] - a[1], q = new THREE.Group(); q.position.set((a[0] + b[0]) / 2, 0.09, (a[1] + b[1]) / 2); q.rotation.y = -Math.atan2(dz, dx); scene.add(q);
    for (let j = 0; j < 4; j++) { const s = new THREE.Mesh(new THREE.PlaneGeometry(16, 1), M(0xffffff, { map: tex(`img/n_floor28_s${n}_${j}.jpg`), roughness: .8, envMapIntensity: .9 })); s.rotation.x = -Math.PI / 2; s.position.x = -24 + j * 16; q.add(s); }   // 파이텍스 인쇄 (빛 안 남)
  });
  [['A', Bt], ['B', L], ['C', T], ['D', R]].forEach(([n, [x, z]]) => { const d = new THREE.Mesh(new THREE.CircleGeometry(1, 48), M(0xffffff, { map: tex(`img/n_floor28_${n}.jpg`), roughness: .8, envMapIntensity: .9 })); d.rotation.x = -Math.PI / 2; d.position.set(x, 0.11, z); scene.add(d); });
})();

// 부스 18개 (이름·순서 = 바닥동선 10. 22. · 자리·크기 = 0915-1 사이즈실측, 사다리꼴: 앞선이 마름모 통로 따라 기욺)
// [이름, 왼쪽 x, 오른쪽 x, 왼쪽 앞선 z, 오른쪽 앞선 z, 아이콘 번호]
const TOP_BACK = -60.68, BOT_BACK = -2.67;
const TOP = [['그린바이오',-70.48,-57.97,-32.17,-33.14,14],['에너지신산업',-57.97,-44.97,-33.14,-34.16,8],['에코업',-44.97,-31.46,-34.16,-35.22,13],
  ['이차전지',-28.47,-14.46,-35.44,-36.54,11],['반도체소부장',-14.46,0.04,-36.54,-37.67,10],['첨단소재나노융합',0.04,14.55,-37.67,-36.54,15],['미래자동차',14.55,28.54,-36.54,-35.44,4],
  ['데이터보안활용융합',31.55,45.05,-35.21,-34.16,16],['차세대통신',45.05,58.06,-34.16,-33.14,12],['사물인터넷',58.06,70.55,-33.14,-32.18,18]];
const BOT = [['바이오헬스',-70.48,-56.47,-28.17,-27.08,5],['차세대디스플레이',-51.47,-36.27,-26.68,-25.49,17],['차세대반도체',-36.27,-20.11,-25.49,-24.25,3],['지능형로봇',-20.11,-2.96,-24.25,-22.91,7],
  ['항공드론',3.04,20.19,-22.9,-24.25,9],['실감미디어',20.19,36.34,-24.25,-25.51,6],['빅데이터',36.34,51.55,-25.51,-26.69,2],['인공지능',56.56,70.56,-27.08,-28.17,1]];
const booths = [];
// 컨소시엄 부스 시안 (99.전시장시안/CO-SHOW_컨소시엄_부스시안_1027) · 바닥·벽 색은 시안 그림 보고 고름
const BS = {
  '빅데이터': ['bigdata', 3, '빅데이터_앞 · 좌측 · 우측.pdf (오토데스크 3D 도면 링크 있음)', 0x55743a, 0x2c3a26],
  '차세대반도체': ['semi', 7, '차세대반도체 시안_20261029', 0x1f4fd8, 0x15171f],
  '미래자동차': ['car', 5, '미래자동차컨소시엄 부스 · 부스 배치도', 0x2e3138, 0x15171f],
  '바이오헬스': ['bio', 7, '바이오헬스 시안 (1027 폴더 · 1019판은 이전판)', 0x2a3f9a, 0xeef2f8],
  '실감미디어': ['media', 7, '실감미디어 시안 (10. 12.)', 0x2346c8, 0x1b2030],
  '지능형로봇': ['robot', 7, 'CO-SHOW 부스 디자인(261014) · 부스 도면(261019)', 0x5d6168, 0x101426],
  '에너지신산업': ['energy', 6, '에너지신산업 전시부스 제안서-1012', 0xf08a2c, 0xf6a54e],
  '항공드론': ['drone', 5, '항공드론 컨소시엄 ZONE 부스 시안 (10. 14.)', 0x3a3f48, 0x15171f],
  '반도체소부장': ['sobu', 6, '조감도_반도체소부장 홍보부스_261020', 0x111318, 0x0b0d14],
  '이차전지': ['battery', 2, '이차전지_CO-SHOW 홍보관', 0x1a2a5a, 0x0d1430],
  '차세대통신': ['comm', 2, '차세대통신 컨소시엄 부스 디자인_261026', 0x101a40, 0x0b1028],
  '에코업': ['ecoup', 6, '에코업 시안 (10. 16.)', 0x2f5fb0, 0xe9eef6],
  '그린바이오': ['greenbio', 7, '그린바이오 2026 CO-SHOW_3D 시안(1019)', 0xe4e7ea, 0xf4f6f8],
  '데이터보안활용융합': ['security', 5, 'CO-SHOW 행사 공간 기획_v1.0', 0x1b2a86, 0x101a50],
  '차세대디스플레이': ['display', 3, '차세대디스플레이 시안 1023(최신)', 0x1d2f7a, 0x101a50],
  '사물인터넷': ['iot', 6, '사물인터넷 시안 01~07', 0x2b2d33, 0xf2c230],
};
const instTable = [], instScreen = [], instChair = [];
// 두 점 사이를 잇는 막대 (기운 앞선·간판용)
function segXZ(ax, az, bx, bz, w, h, mat, y0 = 0) { const m = box(Math.hypot(bx - ax, bz - az), h, w, mat, (ax + bx) / 2, (az + bz) / 2, y0); m.rotation.y = -Math.atan2(bz - az, bx - ax); return m; }
function addBooth([name, X0, X1, F0, F1, tile], row, idx) {
  const fz = x => F0 + (F1 - F0) * (x - X0) / (X1 - X0);                     // 앞선 z
  const x0 = X0 + 0.2, x1 = X1 - 0.2, back = row === 'T' ? TOP_BACK : BOT_BACK, dir = row === 'T' ? 1 : -1;
  const navy = (idx % 2 === 0), bs = BS[name];
  const pts = [[x0, back], [x1, back], [x1, fz(x1)], [x0, fz(x0)]];
  const sh = new THREE.Shape(); pts.forEach(([x, z], i) => i ? sh.lineTo(x, -z) : sh.moveTo(x, -z));
  const carpet = new THREE.Mesh(new THREE.ShapeGeometry(sh), M(bs ? bs[3] : navy ? 0x1b2a86 : 0x363b48)); carpet.rotation.x = -Math.PI / 2; carpet.position.y = 0.04; scene.add(carpet);
  const cx = (x0 + x1) / 2, w = x1 - x0, front = fz(cx), zmid = (back + front) / 2, d = Math.abs(front - back);
  const ry = (row === 'T' ? 0 : Math.PI) - Math.atan2(F1 - F0, X1 - X0);      // 앞선 방향으로 돌림
  const along = (o, off = 0) => { const k = Math.cos(Math.atan2(F1 - F0, X1 - X0)); const x = cx + o * k; return [x, fz(x) - off * dir]; };
  if (DETAIL[name]) {                                                          // 시안대로 지은 부스
    const g = new THREE.Group(); g.position.set(cx, 0, front); g.rotation.y = row === 'T' ? 0 : Math.PI; scene.add(g); g.updateMatrixWorld();
    const z0 = ZONE; ZONE = BZ; DETAIL[name](g, w / 2 - 0.25, d - 0.3, carpet, (F1 - F0) / (X1 - X0)); ZONE = z0;
    booths.push({ pts, name, tile, carpet }); return;
  }
  const pm = M(0xf3f5f9);
  boxXZ(x0, x1, back - 0.1 * dir, back, 2.5, M(bs ? bs[4] : navy ? 0x23338f : 0x2c313d));
  [x0, x1].forEach((x, i) => { const zf = fz(x), a = Math.min(zf, back), b = Math.max(zf, back); boxXZ(i ? x - 0.12 : x, i ? x : x + 0.12, a, b, 2.5, pm); });
  const hdW = Math.min(w * 0.5, 7);
  const hd = sign([name], hdW, 1.1, { bg: '#0b1440', border: '#2fe4ff', size: 150 });
  { const [hx, hz] = along(0, 0.05); hd.position.set(hx, 3.6, hz); } hd.rotation.y = ry; scene.add(hd);
  [-hdW / 2, hdW / 2].forEach(o => { const [px, pz] = along(o); box(0.18, 4.1, 0.18, M(0x0b1440), px, pz, 0); });
  const tt = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 2.14), IMG(tileTex[tile - 1]));
  { const tx = x0 + 1.4; tt.position.set(tx, 1.35, fz(tx) - 0.6 * dir); tt.rotation.y = ry; scene.add(tt); box(1.25, 2.4, 0.2, M(0x0b1440), tx, fz(tx) - 0.72 * dir, 0.1).rotation.y = ry; }
  const fh = Math.min(5, d * 0.3);
  const ft = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, fh), B(textTex([name], { w: 1024, h: Math.round(1024 * fh / (w * 0.9)), bg: null, fg: 'rgba(255,255,255,.92)', size: 170 })));
  ft.rotation.x = -Math.PI / 2; ft.position.set(cx, 0.09, zmid); birdOnly.add(ft);
  const nx = Math.max(2, Math.floor(w / 4.2)), nz = 3;
  for (let i = 0; i < nx; i++) for (let j = 0; j < nz; j++) {
    const tx = x0 + (i + 0.5) * w / nx, zf = fz(tx), za = Math.min(zf, back), dd = Math.abs(zf - back), tz = za + (j + 0.7) * dd / (nz + 0.6);
    instTable.push([tx, tz, (i + j) % 2 ? 0 : Math.PI / 2]); instChair.push([tx + 0.9, tz + 0.9]); instChair.push([tx - 0.9, tz - 0.9]);
  }
  const ns = Math.max(1, Math.floor(w / 6));
  for (let i = 0; i < ns; i++) instScreen.push([x0 + (i + 0.5) * w / ns, back - 0.35 * dir, row === 'T' ? 0 : Math.PI]);
  booths.push({ pts, name, tile, carpet });   // 부스 시안 보기는 뺌 (10. 27. 제욱님)
}
/* ---------- 컨소시엄 부스 3D (부스시안_1027 그림 보고 지음, 10. 27.) — 차세대반도체 · 지능형로봇 (바이오헬스는 10. 28. booths/bio.js로 다시 지음) ---------- */
// 부스 안 좌표: x = 앞에서 들여다볼 때 오른쪽 +, z = 앞선 0 → 안쪽 -D. 앞쪽 구조물은 fr(앞선 기울기대로 돌린 묶음)에 둠
const BZ = 0.5;                                                                // 부스 안 밝기 (부스 자체 조명)
const B3 = n => tex(`img/b3d/${n}.jpg`);
const CHAIR = mergeGeometries([new THREE.BoxGeometry(0.44, 0.06, 0.44).translate(0, 0.45, 0), new THREE.BoxGeometry(0.44, 0.42, 0.05).translate(0, 0.69, 0.2), new THREE.BoxGeometry(0.06, 0.42, 0.06).translate(0, 0.21, 0)]);
const BEAN = new THREE.SphereGeometry(0.42, 16, 12).scale(1, 0.6, 1.1).translate(0, 0.26, 0);
function boothKit(g, slope) {
  const k = { fz: x => slope * x };
  k.fr = new THREE.Group(); k.fr.rotation.y = -Math.atan(slope); g.add(k.fr);
  k.box = (w, h, d, m, x, z, y0 = 0, p = g) => box(w, h, d, m, x, z, y0, p);
  k.bxz = (x0, x1, z0, z1, h, m, y0 = 0, p = g) => boxXZ(x0, x1, z0, z1, h, m, y0, p);
  k.pl = (m, w, h, x, y, z, ry = 0, p = g) => { const q = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); q.position.set(x, y, z); q.rotation.y = ry; p.add(q); return q; };
  k.flat = (m, x0, x1, z0, z1, y = 0.06, p = g) => floorPlane(x0, x1, z0, z1, m, y, p);
  k.txt = (lines, w, h, opt = {}, kk = 1.1) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), GLOW(textTex(lines, { w: 1024, h: Math.max(64, Math.round(1024 * h / w)), bg: null, ...opt }), kk, { transparent: true }));
  k.W = (x, y, z) => g.localToWorld(new THREE.Vector3(x, y, z)).toArray();
  k.inst = (geo, m, list) => { const im = new THREE.InstancedMesh(geo, m, list.length), o = new THREE.Object3D(); list.forEach(([x, y, z, r = 0], i) => { o.position.set(x, y, z); o.rotation.set(0, r, 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); g.add(im); return im; };
  k.spot = (p, t, c = 0xe6eeff, I = 120, ang = 0.6) => { if (LOW) return; const L = new THREE.SpotLight(c, I, 30, ang, 0.6, 2); L.position.set(...p); L.target.position.set(...t); g.add(L, L.target); };
  k.pool = (x, z, r, c, kk) => { const [wx, , wz] = k.W(x, 0, z); pool(wx, wz, r, c, kk, 0.08); };
  k.cube = (x, z, yc, s, maps, kk = 1.15) => {                                  // 매다는 LED 큐브 + 위 사각 트러스 + 줄
    const mats = [0, 1, 2, 3, 4, 5].map(i => i === 2 || i === 3 ? M(0x07080d) : GLOW(maps[i % maps.length], kk));
    const c = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), mats); c.position.set(x, yc, z); g.add(c);
    const y = yc + s / 2 + 0.3, h = s / 2 + 0.25, P = [[-h, -h], [h, -h], [h, h], [-h, h]];
    P.forEach(([a, b], i) => { const [a2, b2] = P[(i + 1) % 4]; truss(k.W(x + a, y, z + b), k.W(x + a2, y, z + b2), 0.4); });
    P.forEach(([a, b]) => k.box(0.025, 11.6 - y, 0.025, M(0x3a3f4a), x + a, z + b, y));
  };
  k.beans = (list, m) => k.inst(BEAN, m, list.map(([x, z]) => [x, 0.05, z, Math.random() * 3]));
  return k;
}
function figure(p, x, z, m, s = 1) {                                            // 크기 비교용 흰 사람
  const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.2 * s, 1.2 * s, 4, 10), m); c.position.set(x, 0.8 * s, z); p.add(c);
  const h = new THREE.Mesh(new THREE.SphereGeometry(0.13 * s, 12, 10), m); h.position.set(x, 1.62 * s, z); p.add(h);
}
const DETAIL = {
  '지능형로봇'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr, blk = M(0x0d0f15, { roughness: .5 }), wl = E(0xe8f0ff, 0.9);
    carpet.material = M(0x121419, { roughness: .9 });
    const tW = B3('robot_wall'), tW2 = B3('robot_wall2');
    const low = (x0, z0, x1, z1, t, p = g, h = 1.3) => {                        // 낮은 벽 1.3 m (LED 그래픽 · 윗면 흰 빛줄)
      const len = Math.hypot(x1 - x0, z1 - z0), q = new THREE.Group(); q.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2); q.rotation.y = -Math.atan2(z1 - z0, x1 - x0); p.add(q);
      box(len, h, 0.45, blk, 0, 0, 0, q); box(len, 0.05, 0.47, wl, 0, 0, h, q);
      if (t) [1, -1].forEach(s => { const m = new THREE.Mesh(new THREE.PlaneGeometry(len - 0.04, h - 0.12), GLOW(t, 1.05)); m.position.set(0, h / 2, s * 0.23); if (s < 0) m.rotation.y = Math.PI; q.add(m); });
    };
    // 앞: LED 아치 게이트 + 양옆 낮은 LED 벽 + 「지능형로봇 컨소시엄」 글자
    low(-W, -1.0, -2.9, -1.0, tW, fr); low(2.9, -1.0, W, -1.0, tW2, fr);
    const dk = M(0x07080d), gs = GLOW(B3('robot_archS'), 1.1), gt = GLOW(B3('robot_archT'), 1.1);
    [-1, 1].forEach(s => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.8, 0.9), [gs, gs, dk, dk, gs, gs]); m.position.set(s * 2.45, 1.9, -1.0); fr.add(m); });
    { const m = new THREE.Mesh(new THREE.BoxGeometry(5.7, 0.8, 0.9), [gs, gs, dk, gt, gt, gt]); m.position.set(0, 4.2, -1.0); fr.add(m); }
    { const s1 = k.txt(['지능형로봇 컨소시엄'], 4.4, 0.62, { fg: '#fff', size: 160 }, 1.15); s1.position.set(0, 5.0, -1.0); fr.add(s1); }
    // 둥근 안내데스크 · 매다는 LED 큐브
    const desk = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 1.05, 32, 1, true, -Math.PI / 2, Math.PI), M(0x0d1430, { roughness: .5, side: THREE.DoubleSide })); desk.position.set(0, 0.525, -4.8); g.add(desk);
    const dr = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.035, 6, 32, Math.PI), E(0x3f8bff, 2)); dr.rotation.x = Math.PI / 2; dr.position.set(0, 1.05, -4.8); g.add(dr);
    { const t = k.txt(['DESK'], 0.9, 0.24, { fg: '#cfe0ff', size: 150 }, 1); t.position.set(0, 0.6, -3.29); g.add(t); }
    k.cube(0, -8.4, 6.8, 3.2, [B3('robot_cube'), B3('robot_arm')]);
    // 오른쪽: 4족 로봇 경기장 (바닥 선 · 낮은 벽 · 3단 관람석)
    const ax0 = 0.9, ax1 = W - 0.3, az0 = -7.4, az1 = -15.4;
    const field = canvasTex(512, 640, (c, w, h) => { c.fillStyle = '#5c616b'; c.fillRect(0, 0, w, h); c.strokeStyle = '#4c5159'; c.lineWidth = 2; for (let i = 0; i <= w; i += 40) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); } for (let j = 0; j <= h; j += 40) { c.beginPath(); c.moveTo(0, j); c.lineTo(w, j); c.stroke(); } c.strokeStyle = '#f4f6fa'; c.lineWidth = 6; c.strokeRect(24, 24, w - 48, h - 48); c.beginPath(); c.moveTo(24, h / 2); c.lineTo(w - 24, h / 2); c.stroke(); c.beginPath(); c.arc(w / 2, h / 2, 70, 0, 7); c.stroke(); });
    k.flat(M(0xb4bccb, { map: field, roughness: .5 }), ax0, ax1, az1, az0);
    low(ax0, az0, 3.2, az0, tW); low(5.4, az0, ax1, az0, tW2); low(ax0, az0, ax0, -11.6, tW2);
    for (let i = 0; i < 3; i++) { const z = az1 - i * 1.0, h = 0.45 * (i + 1); k.bxz(ax0, ax1, -D + 0.3, z, h, blk); k.bxz(ax0, ax1, z - 0.03, z + 0.01, 0.04, E(0x2f8bff, 2.2), h - 0.03); }
    k.box(ax1 - ax0, 1.0, 0.2, blk, (ax0 + ax1) / 2, -D + 0.4, 1.35);
    { const t = k.txt(['4족 로봇 경기장'], 3.2, 0.5, { fg: '#fff', size: 170 }, 1.1); t.position.set((ax0 + ax1) / 2, 1.85, -D + 0.51); g.add(t); }
    const dogM = M(0xd9dde4, { roughness: .4, metalness: .3 }), dgr = M(0x22252c), dog = (x, z, r) => { const q = new THREE.Group(); q.position.set(x, 0, z); q.rotation.y = r; g.add(q); box(0.6, 0.18, 0.26, dogM, 0, 0, 0.32, q); box(0.16, 0.12, 0.2, dgr, 0.36, 0, 0.36, q); [[-.22, -.1], [-.22, .1], [.22, -.1], [.22, .1]].forEach(([a, b]) => box(0.05, 0.32, 0.05, dgr, a, b, 0, q)); };
    dog(3, -10, 0.4); dog(5.5, -12.5, 2.6); dog(4.2, -13.8, -1);
    // 왼쪽: 교육석 · 키오스크 · 빈백 · 사람형 로봇
    const tb = [], ch = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { const x = -W + 1.6 + c * 2.3, z = -9.2 - r * 2.2; tb.push([x, 0.375, z]); ch.push([x - 0.35, 0, z + 0.6], [x + 0.35, 0, z + 0.6]); }
    k.inst(new THREE.BoxGeometry(1.5, 0.75, 0.6), M(0x1a1d26, { roughness: .5 }), tb); k.inst(CHAIR, M(0x2a2e3a), ch);
    k.box(3.2, 1.7, 0.3, blk, -W + 2.6, -D + 0.8, 0.9);
    { const t = k.txt(['지능형로봇 컨소시엄 · 교육석'], 3.0, 0.5, { fg: '#fff', size: 120 }, 1.05); t.position.set(-W + 2.6, 1.75, -D + 0.96); g.add(t); }
    k.box(1.1, 3.2, 0.9, blk, -W + 1.0, -3.6); k.pl(GLOW(B3('robot_cube'), 1.05), 0.9, 0.9, -W + 1.0, 2.2, -3.14);
    k.beans([[-4.8, -3.2], [-3.6, -4.4], [-5.6, -5.0]], M(0x1f4fd8, { roughness: .8 }));
    const rb = M(0xeef1f5, { roughness: .35, metalness: .2 }); figure(g, -2.2, -6.0, rb, 1.05);
    { const v = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.05), M(0x05060a)); v.position.set(-2.2, 1.72, -5.88); g.add(v); }
    // 둘레 낮은 벽 (흰 빛줄)
    low(-W, -D, W, -D, null); low(-W, -2.6, -W, -D, null); low(W, -2.6, W, -D, null);
    // 조명
    k.spot([3.5, 7.5, -9], [4.3, 0, -11.5], 0xe8f0ff, 160, 0.7);
    k.pool(4.3, -11.4, 5, 0x8fc0ff, 0.3); k.pool(0, -3, 4, 0x6fa8ff, 0.35); k.pool(-4, -13, 6, 0x7aa0ff, 0.2);
  },
};
// 부스 3D 나눠 짓기: site/booths/<키>.js 가 export default (api) => ({ '부스이름'(g, W, D, carpet, slope) {…} })
const BOOTH_MODS = ['semi', 'bio', 'battery', 'bigdata', 'car', 'comm', 'display', 'drone', 'ecoup', 'energy', 'greenbio', 'iot', 'media', 'security', 'sobu', 'ai', 'nano'];
{ const api = { THREE, M, E, B, IMG, GLOW, box, boxXZ, floorPlane, panel, canvasTex, textTex, sign, atlas, beam, pool, truss, pixWall, pixBlock, tex, B3, boothKit, figure, CHAIR, BEAN, FONT, LOW, TILE_COL, mergeGeometries };
  const rs = await Promise.allSettled(BOOTH_MODS.map(k => import(`./booths/${k}.js?v=22`).catch(() => import(`./booths/${k}.js?v=22&r=1`))));   // 한 번 못 받으면 다시
  rs.forEach((r, i) => { if (r.status === 'fulfilled') { try { Object.assign(DETAIL, r.value.default(api)); } catch (e) { console.warn('부스', BOOTH_MODS[i], e); } } }); }
TOP.forEach((b, i) => addBooth(b, 'T', i));
BOT.forEach((b, i) => addBooth(b, 'B', i + 1));
function instanced(list, geo, mat, y, rot = true) {
  const im = new THREE.InstancedMesh(geo, mat, list.length), o = new THREE.Object3D();
  list.forEach((p, i) => { o.position.set(p[0], y, p[1]); o.rotation.set(0, rot ? (p[2] || 0) : 0, 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
  scene.add(im); return im;
}
instanced(instTable, new THREE.BoxGeometry(1.8, 0.75, 0.75), M(0xf4f6fa), 0.375);
instanced(instChair, new THREE.BoxGeometry(0.5, 0.85, 0.5), M(0x15182a), 0.425, false);
(function () {
  const im = new THREE.InstancedMesh(new THREE.BoxGeometry(2.2, 1.3, 0.12), new THREE.MeshStandardMaterial({ color: 0x050812, emissive: 0x2a74ff, emissiveIntensity: .9 }), instScreen.length), o = new THREE.Object3D();
  instScreen.forEach((p, i) => { o.position.set(p[0], 1.9, p[1]); o.rotation.set(0, p[2], 0); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
  scene.add(im);
})();

/* ---------- 06 전시장 내부 휴게공간 (10. 26.) ---------- */
// A 구 LED 전광판 Φ3,000 · 받침 Φ4,800 × 385
const sphereCanvas = canvasTex(1024, 512, () => {});
function drawSphere(t) {
  const c = sphereCanvas.userData.canvas, g = c.getContext('2d'), w = c.width, h = c.height;
  g.fillStyle = '#f4f8ff'; g.fillRect(0, 0, w, h);
  const blink = (Math.sin(t * 1.3) > 0.97);
  for (const ox of [w * 0.25, w * 0.75]) {
    g.fillStyle = '#05060d'; g.beginPath(); g.ellipse(ox, h * 0.46, 165, 128, 0, 0, Math.PI * 2); g.fill();
    g.lineWidth = 16; g.strokeStyle = '#4ff3ff'; g.lineCap = 'round';
    if (blink) { g.beginPath(); g.moveTo(ox - 80, h * 0.43); g.lineTo(ox - 30, h * 0.43); g.moveTo(ox + 30, h * 0.43); g.lineTo(ox + 80, h * 0.43); g.stroke(); }
    else { g.beginPath(); g.arc(ox - 55, h * 0.45, 26, Math.PI, 0); g.stroke(); g.beginPath(); g.arc(ox + 55, h * 0.45, 26, Math.PI, 0); g.stroke(); }
    g.beginPath(); g.arc(ox, h * 0.5, 38, 0.15, Math.PI - 0.15); g.stroke();
  }
  g.fillStyle = `hsl(${(t * 40) % 360},90%,55%)`; g.fillRect(0, h * 0.86, w, h * 0.14);
  sphereCanvas.needsUpdate = true;
}
drawSphere(0);
const SPH = new THREE.Mesh(new THREE.SphereGeometry(1.5, 48, 32), GLOW(sphereCanvas, 0.95));
SPH.position.set(0, 0.385 + 1.5, CZ); scene.add(SPH);
const disc = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.385, 48), M(0x0b0d18, { roughness: .4 })); disc.position.set(0, 0.1925, CZ); scene.add(disc);
const ringL = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.05, 8, 64), E(0x2fe4ff, 2)); ringL.rotation.x = Math.PI / 2; ringL.position.set(0, 0.39, CZ); scene.add(ringL);
const ring = new THREE.Mesh(new THREE.TorusGeometry(7, 0.25, 8, 64), M(0x30364a, { metalness: .6, roughness: .4, envMapIntensity: .4 })); ring.rotation.x = Math.PI / 2; ring.position.set(0, 9.5, CZ); scene.add(ring);
// B 파레트 휴게공간 8,800 × 6,600 × 1,050 (2곳, 빈백 40개) — 승인서 9쪽 칸별 단수 그대로 (1단 = 0.15 m, 파랑 = 파란 파레트)
const PAL_STEP = [[0, 1, 2, 3, 3, 2, 1, 0], [2, 3, 4, 5, 5, 4, 3, 2], [4, 5, 6, 7, 7, 6, 5, 4], [4, 5, 6, 7, 7, 6, 5, 4], [2, 3, 4, 5, 5, 4, 3, 2], [0, 1, 2, 3, 3, 2, 1, 0]];
const PAL_BLUE = ['0,1', '0,6', '1,2', '1,5', '2,0', '2,3', '2,7', '3,1', '3,4', '3,6', '4,2', '4,5', '5,1', '5,6'];
const palBlueBase = canvasTex(256, 256, (g, w, h) => {
  g.fillStyle = '#123a9c'; g.fillRect(0, 0, w, h); g.strokeStyle = '#2f6cf0'; g.lineWidth = 6;
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { g.strokeRect(i * 128 + 10, j * 128 + 10, 108, 108); g.beginPath(); g.moveTo(i * 128 + 10, j * 128 + 10); g.lineTo(i * 128 + 118, j * 128 + 118); g.stroke(); }
});
palBlueBase.wrapS = palBlueBase.wrapT = THREE.RepeatWrapping;
const PALB = {};
const palBlueMat = n => PALB[n] || (PALB[n] = (() => { const t = palBlueBase.clone(); t.repeat.set(1, n); t.needsUpdate = true; return M(0xffffff, { map: t, roughness: .5 }); })());
function palletRest(cx) {
  const cell = (r, c) => [cx + (c - 3.5) * 1.1, CZ + (r - 2.5) * 1.1];
  PAL_STEP.forEach((row, r) => row.forEach((n, c) => {
    if (!n) return; const [x, z] = cell(r, c), h = n * 0.15;
    box(1.08, h, 1.08, PAL_BLUE.includes(r + ',' + c) ? palBlueMat(n) : palMat(1, n), x, z, 0);
    // 낮은 이웃 쪽 윗모서리에 하늘색 띠 (투시도 3 · 4쪽)
    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => { const m = PAL_STEP[r + dr]?.[c + dc] ?? 0; if (m >= n) return;
      if (dr) boxXZ(x - .54, x + .54, z + dr * .54 - .02, z + dr * .54 + .02, 0.03, cyanM, h - 0.04); else boxXZ(x + dc * .54 - .02, x + dc * .54 + .02, z - .54, z + .54, 0.03, cyanM, h - 0.04); });
  }));
  // 빈백 20개 (파랑 · 회색, 자리는 유나 판단)
  const bean = new THREE.SphereGeometry(0.42, 16, 12), gw = M(0xc9ced8, { roughness: .95 }), b1 = M(0x1f4fd8, { roughness: .8 });
  [[0, 2], [0, 5], [1, 0], [1, 3], [1, 6], [1, 7], [2, 1], [2, 4], [2, 6], [3, 0], [3, 3], [3, 5], [3, 7], [4, 1], [4, 4], [4, 6], [5, 2], [5, 4], [0, 3], [5, 5]].forEach(([r, c], i) => {
    const [x, z] = cell(r, c), s = new THREE.Mesh(bean, i % 2 ? gw : b1); s.scale.set(1.05, 0.62, 1.15); s.rotation.y = i * 0.7; s.position.set(x, PAL_STEP[r][c] * 0.15 + 0.24, z); scene.add(s);
  });
}
palletRest(-10.7); palletRest(10.7);
// C 파레트 타워 1,400 × 1,100 × 3,300 (2곳) — 승인서 10쪽: 앞뒤(남 · 북) = 기둥 그래픽 840 × 1,470, 좌우(동 · 서) = 65인치 TV 세로
const towerGfx = tex('img/n_ex_tower_gfx.jpg');
function palletTower(x) {
  box(1.4, 3.3, 1.1, palMat(1.3, 3), x, CZ, 0);
  [1, -1].forEach(s => {
    panel(towerGfx, 0.84, 1.47, x, 1.72, CZ + s * 0.556, s > 0 ? 0 : Math.PI);
    box(0.84, 1.45, 0.06, M(0x08090d), x + s * 0.72, CZ, 1.0).rotation.y = Math.PI / 2;
    const tv = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 1.42), new THREE.MeshBasicMaterial({ map: ledTex('2026', 'CO-SHOW', { w: 300, h: 512 }), toneMapped: false }));
    tv.position.set(x + s * 0.755, 1.73, CZ); tv.rotation.y = s * Math.PI / 2; scene.add(tv);
    [-0.35, 0, 0.35].forEach(o => { box(0.02, 0.5, 0.02, cyanM, x + s * 0.705, CZ + o, 2.55); box(0.02, 0.5, 0.02, cyanM, x + s * 0.705, CZ + o, 0.35); });
  });
}
palletTower(-31); palletTower(31);
// D 현위치 현황판 900 × 1,780 A형 (2곳) — 승인서 11쪽: 면이 남 · 북을 봄, 그래픽 = 행사 지도 + 체험교육 목록
const boardGfx = tex('img/n_ex_board_gfx.jpg');
function board(x) {
  const g = new THREE.Group(); g.position.set(x, 0, CZ); scene.add(g);
  [1, -1].forEach(s => { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.84), IMG(boardGfx)); p.position.set(0, 0.89, s * 0.25); p.rotation.x = -s * 0.274; if (s < 0) p.rotation.y = Math.PI; g.add(p);
    const bk = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.84), M(0x0b1440)); bk.position.copy(p.position); bk.rotation.copy(p.rotation); bk.rotateY(Math.PI); bk.translateZ(0.01); g.add(bk); });
}
board(-53.5); board(53.5);
// 주사위 스툴 검정 40 · 흰색 40 · 벤치 16 (Furniture Plan 개수, 자리는 마름모 안쪽에 대략 = 유나 판단)
(function furniture() {
  const blk = [], wht = [], bench = [];
  const half = x => 5.51 * (1 - Math.abs(x) / 64.9), busy = x => Math.abs(x) < 15.6 || Math.abs(Math.abs(x) - 31) < 1.4 || Math.abs(Math.abs(x) - 53.5) < 1.3;
  for (const s of [-1, 1]) {
    let k = 0;
    for (let x = 16.4; k < 20 && x < 63; x += 2.0) { if (busy(s * x)) continue; const hw = half(x);
      [1, -1].forEach(side => (((k + (side > 0 ? 0 : 1)) % 2) ? blk : wht).push([s * x + side * 0.35, CZ + side * hw * 0.62]));
      k++; }
    [18.6, 24, 28.6, 35.4, 40, 45.4, 50.2, 58].forEach((x, i) => bench.push([s * x, CZ + (i % 2 ? 1 : -1) * half(x) * 0.25]));
  }
  instanced(blk, new THREE.BoxGeometry(0.45, 0.45, 0.45), M(0x14161f), 0.225);
  instanced(wht, new THREE.BoxGeometry(0.45, 0.45, 0.45), M(0xf2f4f8), 0.225);
  instanced(bench, new THREE.BoxGeometry(1.8, 0.45, 0.5), M(0x6b4a2e), 0.225);
})();
// 원형 트러스 ↔ B홀 입구 트러스 (휴게공간 투시도 3쪽 · Furniture Plan 12쪽의 남북 줄, 높이는 유나 판단)
truss([0, 9.5, CZ + 7.2], [0, 9.5, -1.5], 0.45);
// 8 트러스 배너 1,200 × 3,000 · 20개 · 6 m 간격 (가운데 줄)
(function trussBanners() {
  const rects = Array.from({ length: 20 }, (_, k) => { const col = k % 10, row = k < 10 ? 0 : 1; const u0 = Math.max(0, (137 + (col - 1) * 143.5) / 1400), u1 = (137 + (col - 1) * 143.5 + 103) / 1400; return row ? [u0, 0.0, u1, 0.489] : [u0, 0.516, u1, 0.996]; });
  const ts = atlas('tex/b_truss.jpg', rects);
  ts.forEach((t, k) => {
    const left = k < 10, x = left ? -61.75 + k * 6 : 7.75 + (k - 10) * 6;
    panel(t, 1.2, 3, x, 7, CZ, left ? Math.PI / 2 : -Math.PI / 2);
    panel(null, 1.2, 3, x - (left ? 0.01 : -0.01), 7, CZ, left ? -Math.PI / 2 : Math.PI / 2).material = M(0x0b1440);
    box(0.03, 2.1, 0.03, M(0x555b6b), x, CZ, 8.5, walkOnly);
  });
})();

/* ---------- 전시장 조명: 마름모 · 구 LED · 코아이 자리만 (10. 27. 제욱님) ---------- */
(function hallLights() {
  const COA = [0, 6.8, CZ];
  // 가운데 위 코아이를 비추는 스포트라이트: 트러스 링 네 곳(내려 비춤) + 파레트 휴게공간 두 곳(올려 비춤)
  [[7, 9.3, CZ], [-7, 9.3, CZ], [0, 9.3, CZ + 7], [0, 9.3, CZ - 7], [10.7, 1.2, CZ], [-10.7, 1.2, CZ]].forEach(([x, y, z], i) => {
    const up = y < 5;
    if (!LOW || i % 2 === 0) { const L = new THREE.SpotLight(up ? 0x9fd8ff : 0xffffff, up ? 45 : 70, 30, up ? 0.3 : 0.4, 0.55, 2); L.position.set(x, y, z); L.target.position.set(...COA); scene.add(L, L.target); }
    beam([x, y, z], COA, up ? 1.0 : 1.3, up ? 0x9fd8ff : 0xffffff, up ? 0.12 : 0.16);
    box(0.35, 0.35, 0.35, M(0x111318), x, z, up ? y - 0.35 : y - 0.2);
  });
  // 구 LED · 휴게공간 위 넓은 빛
  { const L = new THREE.SpotLight(0xcfe6ff, 260, 40, 0.8, 0.7, 2); L.position.set(0, 11.5, CZ); L.target.position.set(0, 0, CZ); scene.add(L, L.target); }
  pool(0, CZ, 8, 0x9fd0ff, 0.3);
  // 마름모: 변 위 다운라이트 빛줄기 · 바닥 빛 (진짜 조명 대신 그림 효과라 가벼움)
  const { L, R, T, Bt } = DIA;
  [[L, T], [T, R], [R, Bt], [Bt, L]].forEach(([a, b]) => { for (const k of [0.2, 0.4, 0.6, 0.8]) { const x = a[0] + (b[0] - a[0]) * k, z = a[1] + (b[1] - a[1]) * k; beam([x, 11.6, z], [x, 0, z], 1.5, 0xbfe0ff, 0.07); pool(x, z, 2.4, 0xbfe0ff, 0.2); } });
  Object.values(DIA).forEach(([x, z]) => { beam([x, 11.6, z], [x, 0, z], 1.7, 0x7ff6ff, 0.12); pool(x, z, 2.8, 0x7ff6ff, 0.28); });
})();

/* ---------- 로비(콘코스) · 밝게 ---------- */
ZONE = 1; ZENV = null;
const marble = canvasTex(1024, 1024, (g, w, h) => {                            // 김대중컨벤션센터 로비 사진: 밝은 화강석 + 짙은 화강석 띠
  const T = 128;
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { const dark = j === 2 || j === 6; g.fillStyle = dark ? '#5a5f68' : '#d9dce1'; g.fillRect(i * T, j * T, T, T); }
  for (let k = 0; k < 60000; k++) { const x = Math.random() * w, y = Math.random() * h, dark = ((y / T | 0) === 2 || (y / T | 0) === 6), v = dark ? 40 + Math.random() * 90 : 120 + Math.random() * 120; g.fillStyle = `rgba(${v},${v},${v + 6},.55)`; g.fillRect(x, y, 2, 2); }
  g.strokeStyle = 'rgba(150,156,166,.7)'; g.lineWidth = 2; for (let i = 0; i <= 8; i++) { g.beginPath(); g.moveTo(i * T, 0); g.lineTo(i * T, h); g.stroke(); g.beginPath(); g.moveTo(0, i * T); g.lineTo(w, i * T); g.stroke(); }
});
marble.wrapS = marble.wrapT = THREE.RepeatWrapping; marble.repeat.set(166 / 8, 24 / 8);
floorPlane(LOBBY.x0, LOBBY.x1, LOBBY.z0, LOBBY.z1, M(0xffffff, { map: marble, roughness: .18, metalness: .05 }), 0.005);
floorPlane(LOBBY.x0 + 2, LOBBY.x1 - 4, 16.6, 16.9, M(0xe0a020, { roughness: .6 }), 0.012);   // 노란 점자블록 줄
// 센터 방문자센터 · 종합안내 (10. 28. 현장답사 사진 115111_9: 빨간 띠 「Welcome Center 방문자센터」 진열장 + 청록 안내 데스크 i). 자리는 유나 판단
(function welcome() {
  const g = new THREE.Group(); g.position.set(87, 0, 29.6); g.rotation.y = Math.PI; scene.add(g);
  const shelf = canvasTex(1024, 384, (c, w, h) => { c.fillStyle = '#f7f7f5'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d9dad8'; c.lineWidth = 6;
    for (let i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(i * w / 8, 0); c.lineTo(i * w / 8, h); c.stroke(); } for (let j = 0; j <= 4; j++) { c.beginPath(); c.moveTo(0, j * h / 4); c.lineTo(w, j * h / 4); c.stroke(); }
    const cols = ['#e8473a', '#f2c230', '#2b6fd6', '#2aa876', '#ffffff', '#1b2a5a', '#f08fb3'];
    for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 3; k++) { c.fillStyle = cols[(i * 7 + j * 3 + k) % cols.length]; c.fillRect(i * w / 8 + 14 + k * 38, j * h / 4 + 30 + (k % 2) * 8, 30, h / 4 - 50); } });
  box(6.4, 2.6, 1.6, M(0xf4f4f2), 0, -0.4, 0, g); panel(shelf, 6.2, 2.4, 0, 1.3, 0.41, 0, g);
  const band = sign(['Welcome Center  방문자센터'], 6.6, 0.55, { bg: '#c8282c', size: 100 }); band.position.set(0, 2.95, 0.42); g.add(band);
  box(6.6, 0.55, 1.7, M(0xc8282c), 0, -0.45, 2.67, g);
  const desk = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.2, 1.05, 40, 1, true, -0.55, 1.1), M(0x9dbdb8, { roughness: .35, side: THREE.DoubleSide })); desk.position.set(0, 0.52, -2.4); g.add(desk);
  const top = new THREE.Mesh(new THREE.CylinderGeometry(4.3, 4.3, 0.06, 40, 1, false, -0.55, 1.1), M(0xf2f3f4)); top.position.set(0, 1.08, -2.4); g.add(top);
  const ic = new THREE.Mesh(new THREE.CircleGeometry(0.28, 32), B(textTex(['i'], { w: 128, h: 128, bg: '#1f6fd6', size: 100 }))); ic.position.set(0, 0.62, 1.82); g.add(ic);
})();
const upM = M(0xf2f4f7);
[[LOBBY.x0, -51], [-43, -3], [3, LOBBY.x1]].forEach(([a, b]) => wallSeg(a, b, 31, 31.6, WALL_H, M(0xe9edf3), 16, upM));
wallSeg(LOBBY.x0 - .6, LOBBY.x0, 7, 10, WALL_H, M(0xe9edf3), 16, upM); wallSeg(LOBBY.x0 - .6, LOBBY.x0, 16, 31.6, WALL_H, M(0xe9edf3), 16, upM);
const glass = new THREE.MeshStandardMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.22, roughness: .1, metalness: .1, side: THREE.DoubleSide, depthWrite: false });
[[0, 10], [15.5, 21], [27, 31.6]].forEach(([a, b]) => boxXZ(LOBBY.x1, LOBBY.x1 + .3, a, b, 16, glass));
boxXZ(LOBBY.x1, LOBBY.x1 + .3, 0, 31.6, 0.4, M(0x8a93a3), 4.2);
boxXZ(HALL.x0, LOBBY.x1, 6.6, 7, 16 - 12, upM, 12, walkOnly);
boxXZ(LOBBY.x0, LOBBY.x1, 7, 31.6, 0.2, new THREE.MeshStandardMaterial({ color: 0xbfe0ff, transparent: true, opacity: .35, side: THREE.DoubleSide, depthWrite: false }), 16, walkOnly);
for (let x = -70; x <= 90; x += 8) boxXZ(x - .12, x + .12, 7, 31.6, .3, M(0xc4512c), 15.6, walkOnly);
// 2층 통로(난간)
const RAIL_Z = 13.5;
const slabs = [[mx(483), mx(770)], [mx(808), mx(1077)], [mx(1113), 68]];   // 10. 27. 기둥 실측(12 m 간격)에 맞춰 0.93배
const dlTex = canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#f3f5f8'; g.fillRect(0, 0, w, h); g.fillStyle = '#ffffff'; g.shadowColor = '#fff'; g.shadowBlur = 10; [[64, 64], [192, 64], [64, 192], [192, 192]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 11, 0, 7); g.fill(); }); });
dlTex.wrapS = dlTex.wrapT = THREE.RepeatWrapping;
slabs.forEach(([a, b]) => { { const t = dlTex.clone(); t.needsUpdate = true; t.repeat.set((b - a) / 3, (RAIL_Z - 7) / 3); const c = new THREE.Mesh(new THREE.PlaneGeometry(b - a, RAIL_Z - 7), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); c.rotation.x = Math.PI / 2; c.position.set((a + b) / 2, 6.19, (7 + RAIL_Z) / 2); scene.add(c); }   // 2층 아래 천장 다운라이트
  boxXZ(a, b, 7, RAIL_Z, 0.45, M(0xf4f6f9), 6.2); boxXZ(a, b, RAIL_Z - .2, RAIL_Z, 1.1, glass, 6.65); });
// 에스컬레이터 (옆면 돔보컷팅은 원고 재요청)
function escalator(x, z, dirX = 1) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const len = 13, ang = Math.atan2(6.2, len);
  const body = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(len, 6.2), 0.8, 2.4), M(0x9aa3b2, { metalness: .4 }));
  body.position.set(0, 3.2, 0); body.rotation.z = ang * dirX; g.add(body);
}
escalator(-31, 24); escalator(32, 23, -1);   // 서쪽은 기둥(−35.9, 22.4) 남쪽으로
// 7 로비 기둥 현수막 2,500 × 4,500 · 9개 (원고 요청)
// 로비 기둥 Φ0.8 · 12 m 간격 (0915-1 실측). 로비가 전시장보다 약 2° 기울어 z가 서쪽 23.6 → 동쪽 18.6
const colZ = x => 21.1 - 0.0347 * x;
const COL_ALL = [-71.9, -59.9, -47.9, -35.9, -23.9, -11.9, 0.1, 12.1, 24.1, 36.1, 48.1, 60.1, 72.1];
const COLS = [-59.9, -35.9, -23.9, -11.9, 0.1, 12.1, 36.1, 48.1, 60.1], COL_Z = colZ(12.1);   // 현수막 9개 자리 (배치도 7번 표시, 유나 판단)
const colM = M(0xd8dde5, { metalness: .3, roughness: .4 });
// 10. 28. 기둥 싸바리 시안(첨부 112328_2, 1111 × 2000 = 2.5 : 4.5) 한 장 = 기둥 한 바퀴(Φ0.8 둘레 2.51 m). 세로 4줄이 앞(+z) · 오른쪽 · 뒤 · 왼쪽
const colWrap = tex('tex/colwrap_1028.jpg');
const colWrapGeo = new THREE.CylinderGeometry(.415, .415, 4.5, 64, 1, true, -Math.PI / 4);
[...COL_ALL.map(x => [x, colZ(x)]), [60.4, 27.8], [72.1, 27.6]].forEach(([x, z]) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(.4, .4, 16, 20), colM); c.position.set(x, 8, z); scene.add(c); });
COLS.forEach(x => { const w = new THREE.Mesh(colWrapGeo, IMG(colWrap)); w.position.set(x, 4.75, colZ(x)); scene.add(w); });

/* ---------- 01 로비 입구게이트 (전시장 A·B·C홀, 10. 27.) ---------- */
// 12,600 폭 · 높이 4,000 · 안쪽 벽 6,000 · 앞면 그래픽 1,000 × 3,000 · 안쪽 4,000 × 3,000
const T_STATUS = textTex(['현황판'], { w: 512, h: 384, bg: '#f5f6f8', fg: '#9aa1ad', size: 90 });
function expoGate(cx, hall, inL, inR, esc) {
  const g = new THREE.Group(); g.position.set(cx, 0, 9.4); scene.add(g);      // 앞(로비 쪽) z=9.4, 뒤 z=3.2 (1027 배치도)
  const H = 4;
  [-1, 1].forEach(s => {
    box(1, H, 6.2, palMat(6, 4), s * 3.8, -3.1, 0, g);                         // 안쪽 벽 6.2 m
    box(2, H, 1, palMat(2, 4), s * 5.3, -0.5, 0, g);                           // 앞쪽 날개
    panel(T_FRONT, 1, 3, s * 4.8, 2, 0.02, 0, g);
    cyanCorner(s * 6.2 - (s > 0 ? 0.5 : 0) * 0, 3.85, 0.03, g, -s, -1); cyanCorner(s * 3.4, 0.15 + 0.5, 0.03, g, s, -1);
  });
  box(6.6, 0.3, 0.5, M(0x0b0d18), 0, -0.2, 3.7, g);                            // 윗보
  const bd = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true, toneMapped: false })); bd.position.set(0, 2.85, 0.05); g.add(bd);   // 아크릴 네온 로고
  panel(inL, 4, 3, -3.29, 2, -3, Math.PI / 2, g);                               // 안쪽 왼쪽 (B면)
  panel(inR, 4, 3, 3.29, 2, -3, -Math.PI / 2, g);                               // 안쪽 오른쪽 (C면)
  floorPlane(-3.3, 3.3, -6.2, 0, M(0x16181f), 0.02, g);
  const lb = sign([`전시장 ${hall}홀`], 4, 0.6, { bg: '#0b1440', size: 120 }); lb.position.set(0, 4.3, 0.05); g.add(lb);
  if (esc) {                                                                   // 에스컬레이터 입구게이트 (A·C홀)
    box(1, H, 3.5, palMat(1, 4), esc * 5.7, 1.75, 0, g);                        // 1 × 3.5 m (배치도 z 9.4 ~ 12.9)
    const ar = textTex([esc < 0 ? '↖ 2F' : '2F ↗', '에스컬레이터'], { w: 256, h: 1024, bg: '#3aa0e8', size: 60 });
    panel(ar, 0.9, 3.6, esc * 5.7, 2, 3.51, 0, g);
  }
  return g;
}
expoGate(GC.A, 'A', T_STATUS, tex('tex/g_a_r.jpg'), -1);
expoGate(GC.B, 'B', T_STATUS, tex('tex/g_b_r.jpg'), 0);
expoGate(GC.C, 'C', tex('tex/g_c_l.jpg'), tex('tex/g_c_r.jpg'), 1);

/* ---------- 01 다목적홀 입구게이트 (10. 27.) ---------- */
// 13,600 폭 · 높이 4,000 · 안쪽 벽 9,000 · 가운데 칸막이(입구 IN / 출구 OUT)
(function hallGate() {
  const g = new THREE.Group(); g.position.set(-47.35, 0, 21.75); g.rotation.y = Math.PI; scene.add(g);   // 앞 = 북쪽(로비) · 1027 배치도
  const H = 4;
  [-1, 1].forEach(s => {
    box(0.5, H, 9, palMat(9, 4), s * 4.05, -4.5, 0, g);
    box(2.5, H, 1, palMat(2.5, 4), s * 5.55, -0.5, 0, g);
    panel(T_FRONT, 1, 3, s * 5.3, 2, 0.02, 0, g);
  });
  box(0.3, H, 9, palMat(9, 4), 0, -4.5, 0, g);                                // 가운데 칸막이
  box(7.6, 0.3, 0.5, M(0x0b0d18), 0, -0.2, 3.7, g);
  const bd = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), new THREE.MeshBasicMaterial({ map: badgeTex, transparent: true, toneMapped: false })); bd.position.set(0, 2.9, 0.3); g.add(bd);
  [['입구', 'IN', -1.95], ['출구', 'OUT', 1.95]].forEach(([k, e, x]) => { const s = sign([k, e], 1.1, 1.0, { bg: '#bfe6f5', fg: '#ffffff', size: 300 }); s.position.set(x, 3.0, 0.06); g.add(s); });
  panel(T_STATUS, 3, 3, -3.79, 2, -2.5, Math.PI / 2, g);                       // B면: 현황판 · 그래픽
  panel(tex('tex/g_hall_l.jpg'), 3, 3, -3.79, 2, -6.5, Math.PI / 2, g);
  panel(tex('tex/g_hall_r1.jpg'), 3, 3, 3.79, 2, -6.5, -Math.PI / 2, g);       // C면: 2025 CO-SHOW · 경진대회 순간들
  panel(tex('tex/g_hall_r2.jpg'), 3, 3, 3.79, 2, -2.5, -Math.PI / 2, g);
  floorPlane(-3.8, 3.8, -9, 0, M(0x16181f), 0.02, g);
})();

/* ---------- 04 메인게이트 · COSS GATE (10. 21.) ---------- */
// 폭 17,000 · 휘어짐 5,150 · 높이 5,000(보 1,200) · 키네틱 LED 5,796 × 2,415 · 깃발 730 × 1,650 × 18
const kinTex = canvasTex(1160, 484, () => {});
const KX = 16, KY = 6, KIN = [], kinW = (i, j, t) => i * 0.5 + j * 0.35 - t * 1.8;   // 키네틱 판 (가로 16 · 세로 6, 유나 판단)
const badgeImg = new Image(); badgeImg.src = 'badge.png';
function drawKinetic(t) {
  // 시안(메인게이트 투시도): 남보라 바탕 · 왼쪽 행사 글자 · 오른쪽 CO SHOW 방패 · 떠 있는 아이콘 · 아래 주최 표시, 위에 키네틱 판 움직임
  const c = kinTex.userData.canvas, g = c.getContext('2d'), w = c.width, h = c.height;
  const bg = g.createRadialGradient(w * .62, h * .45, 20, w * .5, h * .5, w * .7); bg.addColorStop(0, '#4a52d8'); bg.addColorStop(.45, '#232a8e'); bg.addColorStop(1, '#0a0c38'); g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(120,200,255,.18)'; g.lineWidth = 2; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(w * .55, h * .5); g.lineTo(w * .55 + Math.cos(i * .7 + t * .1) * w, h * .5 + Math.sin(i * .7 + t * .1) * w); g.stroke(); }
  for (let i = 0; i < 14; i++) { const x = (w * (0.42 + 0.55 * ((i * 0.618) % 1)) + Math.sin(t * .6 + i) * 12) % w, y = h * (0.1 + 0.75 * ((i * 0.37) % 1)) + Math.cos(t * .5 + i) * 8, s = 26 + (i % 3) * 8; g.strokeStyle = 'rgba(140,230,255,.75)'; g.lineWidth = 3; g.beginPath(); g.roundRect(x - s / 2, y - s / 2, s, s, 6); g.stroke(); }
  if (badgeImg.complete && badgeImg.naturalWidth) { g.save(); g.shadowColor = '#5fe0ff'; g.shadowBlur = 40; const bw = h * 0.7, bh = bw * badgeImg.naturalHeight / badgeImg.naturalWidth; g.drawImage(badgeImg, w * .69 - bw / 2, h * .46 - bh / 2, bw, bh); g.restore(); }
  g.textAlign = 'center'; g.textBaseline = 'middle'; const lx = w * .27;
  g.fillStyle = '#fff'; g.font = `700 30px ${FONT}`; g.fillText('첨단교육, SHOW로 펼쳐지다!', lx, h * .2);
  g.font = `900 76px ${FONT}`; g.fillText('2026', lx, h * .34);
  g.save(); g.font = `900 italic 92px ${FONT}`; g.lineWidth = 10; g.strokeStyle = '#2b3fd0'; g.strokeText('CO-SHOW', lx, h * .52); g.fillStyle = '#fff'; g.fillText('CO-SHOW', lx, h * .52); g.restore();
  g.fillStyle = '#fff'; g.font = `700 30px ${FONT}`; g.fillText('2026. 11. 18.(수) ~ 11. 21.(토)', lx, h * .68); g.font = `600 26px ${FONT}`; g.fillText('김대중컨벤션센터', lx, h * .77);
  g.fillStyle = 'rgba(255,255,255,.85)'; g.font = `600 20px ${FONT}`; g.fillText('교육부   ·   한국연구재단   ·   첨단분야 혁신융합대학 사업단 협의회', w * .5, h * .93);
  const cw = w / KX, ch = h / KY;                                              // 판 밝기 = 판이 앞으로 나올수록 밝게
  for (let i = 0; i < KX; i++) for (let j = 0; j < KY; j++) { const v = Math.sin(kinW(i, KY - 1 - j, t)); g.fillStyle = v > 0 ? `rgba(255,255,255,${v * 0.14})` : `rgba(0,0,20,${-v * 0.3})`; g.fillRect(i * cw, j * ch, cw, ch); }
  kinTex.needsUpdate = true;
}
drawKinetic(0);
const MG = { cx: 74, cz: 18.5, half: 8.5, bulge: 5.15 };   // 1027 배치도 · 가운데가 라운지1 동쪽 기둥(72.1)보다 동쪽
const arcX = z => MG.cx + MG.bulge * ((z - MG.cz) / MG.half) ** 2;
const arcD = z => 2 * MG.bulge * (z - MG.cz) / MG.half ** 2;           // dx/dz
(function mainGate() {
  const blk = M(0x12141c, { roughness: .45 });
  const iconStrip = canvasTex(512, 128, (g, w, h) => { g.fillStyle = '#0b0d14'; g.fillRect(0, 0, w, h); g.strokeStyle = '#4ff3ff'; g.lineWidth = 5; for (let i = 0; i < 6; i++) { const x = 40 + i * 86; if (i % 3 === 0) g.strokeRect(x - 18, 46, 36, 36); else if (i % 3 === 1) { g.beginPath(); g.arc(x, 64, 19, 0, 7); g.stroke(); } else { g.beginPath(); g.moveTo(x - 20, 84); g.lineTo(x, 44); g.lineTo(x + 20, 84); g.closePath(); g.stroke(); } } });
  const N = 26, z0 = MG.cz - MG.half, z1 = MG.cz + MG.half, dz = (z1 - z0) / N, beamL = [], beamR = [];
  for (let i = 0; i < N; i++) {
    const z = z0 + (i + 0.5) * dz; if (Math.abs(z - MG.cz) < 3.2) continue;   // 가운데는 평평한 상자
    const x = arcX(z), d = arcD(z), len = dz * Math.hypot(1, d) + 0.06, th = Math.atan(d);
    const seg = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, len), blk); seg.position.set(x, 4.4, z); seg.rotation.y = th; scene.add(seg);
    const L = z > MG.cz, u0 = Math.max(0, Math.min(1, L ? (MG.cz + MG.half - (z + dz / 2)) / 5.3 : (MG.cz - 3.2 - (z + dz / 2)) / 5.3)), u1 = Math.max(0, Math.min(1, u0 + dz / 5.3));
    (L ? beamL : beamR).push([u0, u1, x, z, th, len]);
  }
  [[beamL, 'mg_beamL'], [beamR, 'mg_beamR']].forEach(([list, f]) => {         // 보 앞면 = 시안 앞면도(아이콘 네온) 그대로
    const ts = atlas(`img/b3d/${f}.jpg`, list.map(([u0, u1]) => [u0, 0, u1, 1]));
    list.forEach(([, , x, z, th, len], i) => { const ic = new THREE.Mesh(new THREE.PlaneGeometry(len, 1.2), GLOW(ts[i], 1.35)); ic.position.set(x + Math.cos(th) * 0.51, 4.4, z - Math.sin(th) * 0.51); ic.rotation.y = th + Math.PI / 2; scene.add(ic); });
  });
  // 가운데 상자 (6,400) + 키네틱 LED · 뒤 회색 시트 로고
  boxXZ(MG.cx - 0.8, MG.cx + 0.8, MG.cz - 3.2, MG.cz + 3.2, 5, blk);
  { const kg = new THREE.Group(), km = GLOW(kinTex, 1.0, { side: THREE.DoubleSide }), pw = 5.796 / KX, ph = 2.415 / KY; kg.position.set(MG.cx + 0.81, 1.81, MG.cz); kg.rotation.y = Math.PI / 2; scene.add(kg);   // 키네틱 LED 5,796 × 2,415
    for (let i = 0; i < KX; i++) for (let j = 0; j < KY; j++) {
      const geo = new THREE.PlaneGeometry(pw * 0.94, ph * 0.94), uv = geo.attributes.uv;
      for (let n = 0; n < uv.count; n++) uv.setXY(n, (i + 0.03 + uv.getX(n) * 0.94) / KX, (j + 0.03 + uv.getY(n) * 0.94) / KY);
      const m = new THREE.Mesh(geo, km); m.position.set(-5.796 / 2 + (i + 0.5) * pw, -2.415 / 2 + (j + 0.5) * ph, 0.1); m.userData.ij = [i, j]; kg.add(m); KIN.push(m);
    } }
  { const n = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 2.02), GLOW(tex('img/b3d/mg_neon.jpg'), 1.4)); n.position.set(MG.cx + 0.82, 3.99, MG.cz); n.rotation.y = Math.PI / 2; scene.add(n); }   // 로고 네온사인 (시안 앞면도)
  const back = sign(['CO', 'SHOW'], 3.4, 2.6, { bg: '#12141c', fg: '#6b7180', size: 300 }); back.position.set(MG.cx - 0.81, 2.4, MG.cz); back.rotation.y = -Math.PI / 2; scene.add(back);
  // 기둥 2개
  const colG = M(0x2a2d36, { roughness: .5 });
  [z0 + 0.5, z1 - 0.5].forEach(z => { const x = arcX(z); box(1.3, 0.25, 1.3, colG, x, z, 0); box(1.1, 0.2, 1.1, colG, x, z, 0.25); box(0.75, 3.0, 0.75, colG, x, z, 0.45); box(1.1, 0.15, 1.1, colG, x, z, 3.45); box(1.3, 0.2, 1.3, colG, x, z, 3.6); });   // 네모 기둥 (받침 · 머리 2단, 시안 앞면도)
  // 깃발 18개 (깃발 순서 = 승인서 9쪽)
  const fr = Array.from({ length: 18 }, (_, k) => { const c = k % 9, r = k < 9 ? 1 : 0, cw = 1 / 9; return [c * cw + cw * 0.06, r * 0.5 + 0.02, (c + 1) * cw - cw * 0.06, r * 0.5 + 0.48]; });
  const ft = atlas('tex/b_flags.jpg', fr), fg = pennantGeo(0.73, 1.65);
  ft.forEach((t, k) => {
    const side = k < 9 ? 1 : -1, j = k % 9;                                   // 앞에서 봐 왼쪽 = 남쪽(+z)
    const z = side > 0 ? MG.cz + 3.5 + (j + 0.5) * (4.6 / 9) : MG.cz - 3.5 - (8.5 - j) * (4.6 / 9);
    const x = arcX(z) + 0.15, th = Math.atan(arcD(z));
    const f = new THREE.Mesh(fg, IMG(t, THREE.DoubleSide)); f.position.set(x, 3.78, z); f.rotation.y = th + Math.PI / 2; scene.add(f);
  });
})();

/* ---------- 03 선수단 라운지 1 · 2 (10. 21.) ---------- */
// 10 × 8 m · 입구 = 북쪽(로비 통로 쪽) · 원탁 12세트
function lounge(x0, x1, z0, z1, frames) {
  const w = x1 - x0, d = z1 - z0;
  floorPlane(x0, x1, z0, z1, M(0x3b3f49), 0.03);
  const navy = M(0x101646);
  const low = (a0, a1, b0, b1) => boxXZ(a0, a1, b0, b1, 1.0, navy);
  low(x0, x1, z1 - 0.15, z1); low(x0, x0 + 0.15, z0, z1); low(x1 - 0.15, x1, z0, z1);
  panel(bandTex(w), w, 0.9, (x0 + x1) / 2, 0.5, z1 + 0.01, 0); panel(bandTex(w), w, 0.9, (x0 + x1) / 2, 0.5, z1 - 0.16, Math.PI);
  panel(bandTex(d), d, 0.9, x0 - 0.01, 0.5, (z0 + z1) / 2, -Math.PI / 2); panel(bandTex(d), d, 0.9, x1 + 0.01, 0.5, (z0 + z1) / 2, Math.PI / 2);
  // 북쪽: 액자형 게이트(높이 4 m) + 나머지 낮은 벽
  let cur = x0;
  frames.forEach(([fa, fb, title, counter]) => {
    if (fa > cur) { low(cur, fa, z0, z0 + 0.15); panel(bandTex(fa - cur), fa - cur, 0.9, (cur + fa) / 2, 0.5, z0 - 0.01, Math.PI); }
    [fa, fb].forEach(x => { box(0.3, 4, 0.3, M(0xffffff), x, z0 + 0.15, 0); });
    box(fb - fa + 0.3, 0.3, 0.3, M(0x0b0d18), (fa + fb) / 2, z0 + 0.15, 3.8);
    const s = sign([title], 1.6, 0.4, { bg: '#0b1440', size: 120 }); s.position.set((fa + fb) / 2, 3.45, z0 - 0.02); s.rotation.y = Math.PI; scene.add(s);
    if (counter) { boxXZ(fa + 0.2, fb - 0.2, z0 + 0.5, z0 + 1.1, 1.05, M(0x0b0d18)); [0.35, 0.65].forEach(k => box(.45, .75, .45, M(0x2a2d36), fa + (fb - fa) * k, z0 + 1.6, 0)); }
    cur = fb;
  });
  if (cur < x1) { low(cur, x1, z0, z0 + 0.15); panel(bandTex(x1 - cur), x1 - cur, 0.9, (cur + x1) / 2, 0.5, z0 - 0.01, Math.PI); }
  // 큰 기둥 그래픽 (1,000 × 4,000)
  const pf = frames[0][0]; box(1, 4, 0.3, M(0xffffff), pf - 0.5, z0 + 0.15, 0); panel(T_FRONT, 1, 4, pf - 0.5, 2, z0 - 0.01, Math.PI);
  // 원탁 12세트 (3줄 × 4)
  const glassTop = M(0xbfd9e6, { roughness: .1, metalness: .2 });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const tx = x0 + 1.6 + c * (w - 3.2) / 3, tz = z0 + 2.6 + r * (d - 3.6) / 2;
    const t = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 20), glassTop); t.position.set(tx, 0.72, tz); scene.add(t);
    box(0.06, 0.7, 0.06, M(0x111111), tx, tz, 0);
    [[0.65, 0], [-0.65, 0], [0, 0.65], [0, -0.65]].forEach(([a, b]) => box(0.42, 0.8, 0.42, M(0x15171f), tx + a, tz + b, 0));
  }
}
lounge(60.9, 71, 19.1, 27.1, [[64.9, 67.9, '선수단 라운지'], [67.9, 71, 'AD카드 배부처', true]]);   // 1027 배치도
lounge(46.15, 56.1, 20.2, 28.2, [[48.65, 53.65, '선수단 라운지']]);

/* ---------- 02 등록데스크 (10. 23.) ---------- */
// 안내데스크 및 무인등록데스크: 4,360 × 4,000 + 창고 3,000 × 2,000, 높이 3,000
(function infoDesk() {
  const g = new THREE.Group(); g.position.set(0.2, 0, 18.6); scene.add(g);     // 앞 = 남쪽(미확인) · B홀 게이트 앞 (1027 배치도 앞선 z 20.6, 바로 앞 기둥)
  const W = 4.36, white = M(0xffffff, { roughness: .4 }), navy = M(0x0b1440);
  [[-1, 2], [1, 2], [-1, -2], [1, -2]].forEach(([a, b]) => box(0.18, 3, 0.18, navy, a * W / 2, b, 0, g));
  box(W, 0.4, 0.18, navy, 0, 2, 2.6, g);
  const top = sign(['ⓘ 안내데스크'], 1.6, 0.4, { bg: '#1b2370', size: 110 }); top.position.set(0, 2.8, 2.1); g.add(top);
  box(W - 0.4, 1, 0.7, white, 0, 1.6, 0, g);
  panel(ledTex('2026 CO-SHOW', '', { w: 1024, h: 256 }), W - 0.4, 0.95, 0, 0.5, 1.96, 0, g);
  [-1, 1].forEach(s => {
    box(0.18, 3, 1, navy, s * W / 2, 1.5, 0, g);
    panel(textTex(['무료입장', '등록데스크'], { w: 256, h: 768, bg: '#1b2370', size: 60 }), 1, 3, s * (W / 2 + 0.1), 1.5, 1.5, s * Math.PI / 2, g);
    box(0.18, 3, 3, white, s * W / 2, -0.5, 0, g);
    box(0.7, 1, 3, white, s * (W / 2 + 0.44), -0.5, 0, g);                    // 무인등록데스크 3,000 × 700 × 1,000
    panel(badgeTex, 0.6, 0.6, s * (W / 2 + 0.8), 0.6, -0.5, s * Math.PI / 2, g).material.transparent = true;
  });
  box(3, 3, 2, M(0x15171f), -0.68, -3, 0, g);                                   // 창고
  panel(badgeTex, 0.7, 0.7, -0.68, 2.2, -1.99, 0, g).material.transparent = true;
})();
// 유인등록데스크 및 EMS: 5,000 × 3,000 · 뒷벽 5,000 × 3,000 · 옆 1,000 × 3,000
const T_REG = canvasTex(1024, 614, (g, w, h) => {
  const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#0b1240'); gr.addColorStop(1, '#3a2c9a'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = '#fff'; g.fillRect(w * 0.04, h * 0.06, w * 0.6, h * 0.18); g.fillRect(w * 0.68, h * 0.06, w * 0.28, h * 0.18);
  g.save(); g.translate(w * 0.04, h * 0.06); fitText(g, ['등록데스크 (관계자/단체관람객)'], w * 0.6, h * 0.18, 44, '#0b1440'); g.restore();
  g.save(); g.translate(w * 0.68, h * 0.06); fitText(g, ['응급의료'], w * 0.28, h * 0.18, 44, '#0b1440'); g.restore();
  g.save(); g.translate(0, h * 0.28); fitText(g, ['첨단교육, SHOW로 펼쳐지다!'], w * 0.8, h * 0.14, 38); g.restore();
  g.save(); g.translate(0, h * 0.42); fitText(g, ['2026 CO-SHOW'], w * 0.8, h * 0.25, 96); g.restore();
});
(function regDesk() {
  const g = new THREE.Group(); g.position.set(7.56, 0, 24.6); g.rotation.y = -Math.PI / 2; scene.add(g);   // 1027 배치도 x 6 ~ 9 · z 22 ~ 27, 앞 방향은 미확인(서쪽으로 둠)
  box(5, 3, 0.18, M(0x0b1440), 0, -1.5, 0, g); panel(T_REG, 5, 3, 0, 1.5, -1.4, 0, g);
  [['등록데스크', -1], ['응급의료', 1]].forEach(([t, s]) => { box(0.18, 3, 1, M(0x0b1440), s * 2.5, -1, 0, g); panel(textTex([t], { w: 256, h: 768, bg: '#1b2370', size: 70 }), 1, 3, s * 2.6, 1.5, -1, s * Math.PI / 2, g); });
  box(5, 1, 0.7, M(0x1b2370), 0, 1.15, 0, g);
  panel(textTex(['2026 CO-SHOW · 첨단교육, SHOW로 펼쳐지다!'], { w: 1600, h: 320, bg: '#1d2a8f', size: 110 }), 5, 1, 0, 0.5, 1.51, 0, g);
  for (const x of [-1.8, -0.9, 0, 1.2, 2]) box(.5, .8, .5, M(0x15171f), x, 0.2, 0, g);
})();

/* ---------- 05 로고 조형물 3,650 × 2,400 × 700 (10. 19.) ---------- */
const fontLoader = new FontLoader(manager);
fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json', (font) => {
  const g = new THREE.Group(); g.position.set(-57.1, 0, 15); g.rotation.y = Math.PI / 2; scene.add(g);   // 앞 = 동쪽 · 1027 배치도
  const blk = M(0x0d0f16, { roughness: .4 }), mirror = M(0xcfeaf6, { metalness: .35, roughness: .15, emissive: 0x4a90b0, emissiveIntensity: .45 });
  box(3.65, 0.9, 0.7, blk, 0, 0, 0, g); box(3.65, 1.5, 0.35, blk, 0, -0.175, 0.9, g);
  const mk = (txt, size, y, z, wmax) => { const geo = new TextGeometry(txt, { font, size, height: 0.12, bevelEnabled: false }); geo.computeBoundingBox(); const bb = geo.boundingBox, k = Math.min(1, wmax / (bb.max.x - bb.min.x)); geo.center(); const m = new THREE.Mesh(geo, mirror); m.scale.set(k, 1, 1); m.position.set(0, y, z); g.add(m); };
  mk('CO', 1.25, 1.65, 0.06, 3.4); mk('SHOW', 0.62, 0.45, 0.41, 3.5);
});

/* ---------- 코아이 공기인형 (10. 29. 로비 코아이 공기인형 제작승인서_1023 기준) ---------- */
// kind: 'cover' = 앉음 · 두 손으로 얼굴 가림(손가락 사이 윙크) · 머리 분홍 리본 · 큰 파란 발바닥 (승인서 공기인형 1 · 3)
//       'stand' = 서 있음 · 빨간 목도리 + 망토 · 한 손 OK · 얼굴 > O < (승인서 공기인형 2)
// H = 맨 위까지 높이(m). 모양 비율 · 손 모양은 승인서 투시도를 보고 맞춤(도면 아님)
const coaiFace = {};
function coaiFaceTex(kind) {
  if (coaiFace[kind]) return coaiFace[kind];
  return (coaiFace[kind] = canvasTex(512, 512, (g, w, h) => {
    const gr = g.createRadialGradient(w * .42, h * .38, 20, w / 2, h / 2, w * .52); gr.addColorStop(0, '#20232c'); gr.addColorStop(1, '#040507');
    g.fillStyle = gr; g.beginPath(); g.arc(w / 2, h / 2, w * .49, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.09)'; g.beginPath(); g.ellipse(w * .36, h * .2, w * .2, h * .06, -0.35, 0, 7); g.fill();
    const C = '#5ef0d8'; g.shadowColor = C; g.shadowBlur = 16; g.strokeStyle = C; g.fillStyle = C; g.lineCap = g.lineJoin = 'round'; g.lineWidth = 26;
    const chev = (cx, cy, s, dir) => { g.beginPath(); g.moveTo(cx - dir * s, cy - s * .8); g.lineTo(cx + dir * s, cy); g.lineTo(cx - dir * s, cy + s * .8); g.stroke(); };
    if (kind === 'stand') {
      chev(118, 262, 26, 1);                                                    // >
      g.lineWidth = 44; g.beginPath(); g.arc(232, 268, 66, 0, 7); g.stroke();  // 큰 O
      g.shadowBlur = 0; g.fillStyle = '#050608'; g.beginPath(); g.arc(232, 268, 22, 0, 7); g.fill();
      g.lineWidth = 26; chev(388, 238, 30, -1);                                // <
    } else {
      chev(170, 168, 34, 1);                                                    // 윙크 >
      g.beginPath(); g.ellipse(350, 176, 40, 30, 0.2, 0, 7); g.fill();          // 손가락 사이 눈
      g.beginPath(); g.ellipse(262, 318, 70, 34, 0, 0, 7); g.fill();            // 입 (손에 가림)
    }
  }));
}
const coaiLogo = canvasTex(512, 240, (g, w, h) => {
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#2a73c6'; g.fillRect(14, 56, w - 28, h - 70);
  g.fillStyle = '#1d4f9a'; g.font = `700 30px Arial,${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('Convergence and Open Sharing System', w * .58, 32);
  g.fillStyle = '#fff'; g.font = `italic 900 118px Arial Black,Arial,${FONT}`; g.fillText('COSS', w * .63, 152);
  g.fillStyle = '#fff'; g.beginPath(); g.arc(84, 132, 62, 0, 7); g.fill();       // 지구 무늬 로고
  g.strokeStyle = '#2a73c6'; g.lineWidth = 9; g.lineCap = 'round';
  [[-34, .9], [-12, 1.2], [10, 1.25], [32, 1]].forEach(([dy, k]) => { g.beginPath(); g.moveTo(84 - 50 * k * .8, 132 + dy); g.bezierCurveTo(84 - 20, 132 + dy - 14, 84 + 20, 132 + dy + 14, 84 + 50 * k * .8, 132 + dy); g.stroke(); });
  g.beginPath(); g.arc(84, 132, 62, 0, 7); g.stroke();
});
function heartGeo(s, d) {
  const sh = new THREE.Shape(); sh.moveTo(0, -0.5);
  sh.bezierCurveTo(-0.15, -0.32, -0.62, -0.05, -0.55, 0.22); sh.bezierCurveTo(-0.5, 0.48, -0.12, 0.55, 0, 0.3);
  sh.bezierCurveTo(0.12, 0.55, 0.5, 0.48, 0.55, 0.22); sh.bezierCurveTo(0.62, -0.05, 0.15, -0.32, 0, -0.5);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: true, bevelThickness: d * .7, bevelSize: 0.12, bevelSegments: 6, curveSegments: 24 });
  geo.center(); geo.scale(s, s, s); return geo;
}
function coai(kind, x, z, ry = 0, H = 5, y = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; scene.add(g);
  const wht = M(0xf6f7f9, { roughness: .32 }), blu = M(0x1f6fd0, { roughness: .3 }), red = M(0xd8222a, { roughness: .35 }), seam = M(0xc9ced6, { roughness: .5 });
  const glv = kind === 'stand' ? M(0x141519, { roughness: .45 }) : M(0x4a4e57, { roughness: .45 });
  const ell = (rx, ry_, rz, px, py, pz, mat, seg = 40) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, seg, Math.round(seg * .7)), mat); m.scale.set(rx, ry_, rz); m.position.set(px, py, pz); g.add(m); return m; };
  const limb = (a, b, r, mat) => { const A = new THREE.Vector3(...a), Bv = new THREE.Vector3(...b), d = Bv.clone().sub(A); const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(0.01, d.length()), 8, 18), mat); m.position.copy(A).add(Bv).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); g.add(m); return m; };
  const cuff = (a, b, r) => { const A = new THREE.Vector3(...a), Bv = new THREE.Vector3(...b), d = Bv.clone().sub(A).normalize(); const t = new THREE.Mesh(new THREE.TorusGeometry(r, r * .42, 14, 28), blu); t.position.copy(Bv).addScaledVector(d, -r * .5); t.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d); g.add(t); };
  // 장갑: 손바닥 +z · 손가락 +y. pose 'open'(펼침) · 'ok'(엄지 · 검지 동그라미 + 세 손가락 펴기). side = 엄지 쪽(−1 왼손, 1 오른손)
  const glove = (p, rot, s, pose = 'open', side = 1) => { const h = new THREE.Group(); h.position.set(...p); h.rotation.order = 'ZYX'; h.rotation.set(...rot); h.scale.setScalar(s); g.add(h);
    const palm = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), glv); palm.scale.set(0.44, 0.48, 0.24); h.add(palm);
    const fing = (o, len, fan, rx = 0) => { const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.105, len, 6, 12), glv); f.position.set(o + Math.sin(fan) * (0.3 + len / 2), 0.36 + Math.cos(fan) * (len / 2 + 0.06), 0); f.rotation.set(rx, 0, -fan); h.add(f); };
    if (pose === 'ok') {
      [[0, .34, 0.02], [0.16, .3, 0.1], [0.32, .22, 0.2]].forEach(([o, l, fan]) => fing(-side * o, l, -side * fan));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.085, 12, 24), glv); ring.position.set(side * 0.34, 0.12, 0.05); h.add(ring);
      const dot = new THREE.Mesh(new THREE.CircleGeometry(0.11, 20), new THREE.MeshBasicMaterial({ color: 0x5ef0d8, toneMapped: false })); dot.position.set(side * 0.34, 0.12, 0.06); h.add(dot);
    } else {
      [[-0.27, .3, -0.22], [-0.09, .36, -0.07], [0.09, .36, 0.07], [0.27, .3, 0.22]].forEach(([o, l, fan]) => fing(o * .55, l, fan));
      const th = new THREE.Mesh(new THREE.CapsuleGeometry(0.115, 0.24, 6, 12), glv); th.position.set(side * 0.46, 0.0, 0.04); th.rotation.z = side * 0.95; h.add(th);
    }
    return h; };
  // 머리 · 검은 얼굴 화면 · 흰 테두리(후드) · 파란 귀 통 · 흰 귀(안테나)
  const st = kind === 'stand';
  const hy = st ? 4.35 : 3.0, hr = st ? [1.95, 1.62, 1.68] : [1.3, 1.12, 1.18], fa = st ? 0.84 : 1.0;   // fa = 얼굴 반지름 각(rad)
  ell(...hr, 0, hy, 0, wht, 56);
  const faceMat = new THREE.MeshStandardMaterial({ map: coaiFaceTex(kind), emissiveMap: coaiFaceTex(kind), emissive: 0xffffff, emissiveIntensity: 0.85, roughness: .1, metalness: .25, transparent: true, alphaTest: 0.5 });
  const face = new THREE.Mesh(new THREE.SphereGeometry(1, 56, 40, Math.PI / 2 - fa, fa * 2, Math.PI / 2 - fa, fa * 2), faceMat);
  face.scale.set(hr[0] * 1.012, hr[1] * 1.012, hr[2] * 1.012); face.position.y = hy; g.add(face);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(Math.sin(fa * .97), st ? 0.085 : 0.1, 16, 64), wht);
  rim.position.set(0, hy, Math.cos(fa * .97) * hr[2] * 1.01); rim.scale.set(hr[0], hr[1], hr[2]); g.add(rim);
  const seamR = new THREE.Mesh(new THREE.TorusGeometry(1.004, 0.006, 6, 80), seam); seamR.scale.set(hr[0], hr[1], hr[2]); seamR.position.y = hy; g.add(seamR);   // 공기인형 이음선
  [-1, 1].forEach(o => {
    const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.44, 0.5, 32), blu); pod.rotation.z = Math.PI / 2;
    if (st) { pod.scale.set(1.15, 1, 1.5); pod.position.set(o * hr[0] * 0.98, hy - 0.15, -0.1); } else { pod.position.set(o * hr[0] * 0.97, hy - 0.05, -0.05); }
    g.add(pod);
    const E = st ? [0.3, 1.25, 2.12, hy + 1.05, 0.12] : [0.21, 1.2, 1.12, hy + 1.18, 0.22];
    const ear = new THREE.Mesh(new THREE.CapsuleGeometry(E[0], E[1], 8, 18), wht); ear.scale.z = 0.62; ear.position.set(o * E[2], E[3], -0.12); ear.rotation.z = -o * E[4]; g.add(ear);
    const sb = new THREE.Mesh(new THREE.CapsuleGeometry(E[0] * .45, E[1] * .7, 6, 12), blu); sb.scale.z = 0.62; sb.position.set(o * (E[2] - E[0] * .55), E[3] - 0.05, -0.12); sb.rotation.z = -o * E[4]; g.add(sb);   // 귀 안쪽 파란 줄
  });
  if (!st) {
    // 앉음: 몸통 · 목 테두리 · 가슴 COSS 명찰 · 다리 앞으로 · 큰 파란 발바닥(흰 테)
    ell(1.12, 1.0, 1.02, 0, 1.28, 0, wht); ell(1.32, 0.56, 1.18, 0, 0.55, 0.05, wht);
    const col = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.16, 14, 40), wht); col.rotation.x = Math.PI / 2; col.scale.set(1, 0.9, 1); col.position.set(0, 2.08, 0.05); g.add(col);
    const lg = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 20, Math.PI / 2 - 0.5, 1.0, Math.PI * 0.4, Math.PI * 0.19), new THREE.MeshStandardMaterial({ map: coaiLogo, roughness: .45 }));
    lg.scale.set(1.13, 1.01, 1.03); lg.position.y = 1.28; g.add(lg);
    [-1, 1].forEach(o => {
      limb([o * 0.68, 0.6, 0.35], [o * 0.95, 0.68, 1.45], 0.56, wht);
      ell(0.74, 0.74, 0.26, o * 1.0, 0.76, 1.98, blu);                                                    // 파란 발바닥(살짝 볼록)
      const sr = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.11, 12, 40), wht); sr.position.set(o * 1.0, 0.76, 1.92); g.add(sr);
      ell(0.72, 0.74, 0.34, o * 0.98, 0.74, 1.72, wht);
      // 팔: 어깨 → 팔꿈치(옆 아래) → 손목(얼굴 앞) · 파란 손목 · 손바닥으로 얼굴 가림
      const sh = [o * 1.08, 1.85, 0.15], el = [o * 1.42, 1.55, 0.95], wr = [o * 0.68, hy - 0.86, 1.22];
      limb(sh, el, 0.34, wht); limb(el, wr, 0.3, wht); cuff(el, wr, 0.33);
      glove([o * 0.45, hy - 0.36, hr[2] + 0.06], [-0.18, Math.PI, -o * 0.3], 0.86, 'open', o);
    });
    // 분홍 리본 (하트 두 개 + 매듭, 머리 위 조금 왼쪽)
    const pk = M(0xe8379b, { roughness: .28 }), bw = new THREE.Group(); bw.position.set(-0.32, hy + hr[1] * 0.93, 0.3); bw.rotation.set(-0.35, 0, 0.18); g.add(bw);
    [-1, 1].forEach(o => { const m = new THREE.Mesh(heartGeo(0.62, 0.2), pk); m.position.set(o * 0.36, 0.02, 0); m.rotation.z = -o * Math.PI * 0.42; bw.add(m); });
    const kn = new THREE.Mesh(new THREE.SphereGeometry(0.15, 20, 14), pk); kn.scale.set(1, 1.1, 0.9); bw.add(kn);
  } else {
    // 서 있음: 달걀형 몸통 · 아래 검은 띠 · 앞 COSS 명찰 · 빨간 목도리 + 매듭 · 등 망토(겉 빨강 · 안 검정)
    const prof = [[0, 0], [1.18, 0], [1.26, 0.14], [1.44, 0.7], [1.6, 1.5], [1.64, 2.1], [1.5, 2.7], [1.1, 3.08], [0, 3.18]].map(([r, yy]) => new THREE.Vector2(r, yy));
    const body = new THREE.Mesh(new THREE.LatheGeometry(prof, 64), wht); g.add(body);
    const dk = M(0x2a2e36, { roughness: .5 });
    const band = new THREE.Mesh(new THREE.CylinderGeometry(1.205, 1.205, 0.12, 64, 1, true), dk); band.position.y = 0.09; g.add(band);
    [-0.55, 0, 0.55].forEach(a => { const v = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.05), dk); v.position.set(Math.sin(a) * 1.3, 0.36, Math.cos(a) * 1.3); v.rotation.y = a; g.add(v); });   // 아래 통풍 줄
    const seam2 = new THREE.Mesh(new THREE.TorusGeometry(1.605, 0.008, 6, 80), seam); seam2.rotation.x = Math.PI / 2; seam2.position.y = 1.5; g.add(seam2);
    const lg = new THREE.Mesh(new THREE.CylinderGeometry(1.645, 1.635, 1.05, 48, 1, true, -0.72, 1.44), new THREE.MeshStandardMaterial({ map: coaiLogo, roughness: .45 }));
    lg.position.y = 1.9; g.add(lg);
    const sc = new THREE.Mesh(new THREE.TorusGeometry(1.32, 0.24, 16, 56), red); sc.rotation.x = Math.PI / 2; sc.scale.set(1, 0.92, 1); sc.position.y = 3.02; g.add(sc);
    const bt = new THREE.Group(); bt.position.set(0.15, 2.9, 1.42); g.add(bt);
    [-1, 1].forEach(o => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), red); m.scale.set(0.42, 0.24, 0.17); m.position.set(o * 0.4, 0, 0); m.rotation.z = o * 0.12; bt.add(m); });
    const kn = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 12), red); kn.scale.set(1, 1.1, 0.9); bt.add(kn);
    const capeG = new THREE.CylinderGeometry(1.42, 2.15, 2.75, 48, 4, true, Math.PI * 0.62, Math.PI * 0.76);
    const capeO = new THREE.Mesh(capeG, M(0xd8222a, { roughness: .4, side: THREE.FrontSide })), capeI = new THREE.Mesh(capeG, M(0x111216, { roughness: .6, side: THREE.BackSide }));
    [capeO, capeI].forEach(m => { m.position.set(0, 1.55, -0.12); m.scale.set(1.05, 1, 1); g.add(m); });
    // 팔: 왼쪽(보는 사람 기준) 들어 OK · 오른쪽 옆으로 내림
    ell(0.36, 0.36, 0.36, -1.45, 2.4, 0.2, blu); ell(0.36, 0.36, 0.36, 1.45, 2.4, 0.0, blu);
    const s1 = [-1.45, 2.4, 0.2], e1 = [-2.3, 2.6, 0.45], w1 = [-2.72, 3.25, 0.6];
    limb(s1, e1, 0.3, wht); limb(e1, w1, 0.28, wht); cuff(e1, w1, 0.34);
    glove([-2.9, 3.78, 0.66], [0, 0, 0.12], 0.95, 'ok', 1);
    const s2 = [1.45, 2.4, 0.0], e2 = [2.4, 1.9, -0.05], w2 = [3.15, 1.35, -0.1];
    limb(s2, e2, 0.3, wht); limb(e2, w2, 0.28, wht); cuff(e2, w2, 0.34);
    glove([3.38, 1.02, -0.1], [0, -Math.PI / 2, 2.4], 0.95, 'open', -1);
  }
  g.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(g);
  g.scale.setScalar(H / (bb.max.y - bb.min.y));                                                            // 맨 위(귀 끝 · 리본)까지 H
  return g;
}
// 승인서 배치도(선수단 라운지1 LAYOUT): 1 GATE 1 밖 · 2 로비 가운데 기둥(24.1, 20.3) 서쪽 · 3 서쪽 끝 휴게공간 (10. 29.)
// 높이는 승인서에 없음 → 10. 28. 제욱님 값(앉음 5 m · 서 있음 3 m) 그대로
// 그림판 코아이 (10. 29. 제나 4면 그림): 보는 방향에 맞는 면(앞 · 3/4 · 옆 · 뒤)을 골라 카메라 쪽으로 세움. 위 coai()는 예전 도형판(안 씀)
// 3/4는 캐릭터 오른쪽에서 본 그림만 있음(뒤집으면 COSS 글자가 거꾸로) → 왼쪽 앞은 정면 그림. 옆 그림: 앉음 = 왼쪽 옆, 서 있음 = 오른쪽 옆
const COAI_TEX = {}; ['cover', 'stand'].forEach(k => ['front', 'q34', 'side', 'back'].forEach(v => COAI_TEX[k + v] = tex(`img/coai/${k}_${v}.png`)));
const coaiBlob = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), gr = x.createRadialGradient(64, 64, 4, 64, 64, 64); gr.addColorStop(0, 'rgba(0,0,0,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
const CARDS = [];
function coaiCard(kind, x, z, ry = 0, H = 5, y = 0) {
  const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; scene.add(g);
  const mat = new THREE.MeshBasicMaterial({ map: COAI_TEX[kind + 'front'], alphaTest: 0.45, side: THREE.DoubleSide, toneMapped: false, color: new THREE.Color().setScalar(ZONE < 1 ? 0.55 : 0.97) });
  const card = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0), mat); card.rotation.order = 'YXZ'; g.add(card);
  if (y === 0) { const sh = new THREE.Mesh(new THREE.CircleGeometry(H * 0.36, 40), new THREE.MeshBasicMaterial({ map: coaiBlob, transparent: true, depthWrite: false })); sh.rotation.x = -Math.PI / 2; sh.position.y = 0.03; sh.scale.y = 0.8; g.add(sh); }
  CARDS.push({ g, card, kind, H }); return g;
}
const _cp = new THREE.Vector3(), _gp = new THREE.Vector3();
function coaiTurn() {
  camera.getWorldPosition(_cp);
  CARDS.forEach(({ g, card, kind, H }) => {
    g.getWorldPosition(_gp);
    const th = THREE.MathUtils.euclideanModulo(Math.atan2(_cp.x - _gp.x, _cp.z - _gp.z) - g.rotation.y + Math.PI, Math.PI * 2) - Math.PI, d = th * 180 / Math.PI;   // 0 = 정면, + = 캐릭터 왼쪽
    let v = 'front', flip = false;
    if (Math.abs(d) > 135) v = 'back';
    else if (d < -67.5) { v = 'side'; flip = kind === 'cover'; }
    else if (d < -22.5) v = 'q34';
    else if (d > 67.5) { v = 'side'; flip = kind === 'stand'; }
    const t = COAI_TEX[kind + v]; if (card.material.map !== t) card.material.map = t;
    const im = t.image, asp = im && im.width ? im.width / im.height : 0.85;
    card.scale.set((flip ? -1 : 1) * H * asp, H, 1);
    const el = Math.atan2(_cp.y - (_gp.y + H / 2), Math.hypot(_cp.x - _gp.x, _cp.z - _gp.z));   // 위에서 내려다보면 뒤로 살짝 눕힘
    card.rotation.set(-Math.min(1, Math.max(0, el - 0.2) * 0.8), th, 0);
  });
}
const COAI = [coaiCard('cover', 98.6, 28.8, Math.PI / 2, 5), coaiCard('stand', 22.2, 21.0, Math.PI, 3), coaiCard('cover', -65.9, 25.7, Math.PI / 2, 5)];
ZONE = 0.035; const FLY = coaiCard('stand', 0, CZ, 0, 2.9, 5.6); ZONE = 1;               // 전시장 구 LED 위 (휴게공간 시안, 비행 조형물 시안은 아님)
// 공기인형3 + 휴게공간 10,000 × 8,500 (승인서 평면도 · 전기·집기도면): 회색 카펫 · 디자인유리세트 SET 04 × 6 (유리 원탁 FT-03 + 의자 FC-03A 4개 X자)
(function restArea() {
  const X0 = -67.6, Z0 = 21.1, W = 10, D = 8.5;
  const cp = new THREE.Mesh(new THREE.PlaneGeometry(W, D), M(0x3b3e44, { roughness: .95 })); cp.rotation.x = -Math.PI / 2; cp.position.set(X0 + W / 2, 0.025, Z0 + D / 2); scene.add(cp);
  const glassT = new THREE.MeshStandardMaterial({ color: 0xcfeff4, transparent: true, opacity: .45, roughness: .05, metalness: .1 }), chrome = M(0xd5d9de, { metalness: .9, roughness: .2 }), blk = M(0x15161a, { roughness: .4 });
  const px = (u, v) => [X0 + (u - 88) / 82.7, Z0 + (v - 137) / 82.5];   // 승인서 7쪽 평면 픽셀 → 모형 좌표
  [[308, 205], [176, 305], [535, 347], [725, 470], [481, 693], [803, 693]].forEach(([u, v]) => {
    const [x, z] = px(u, v), t = new THREE.Group(); t.position.set(x, 0, z); scene.add(t);
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.02, 32), glassT); top.position.y = 0.72; t.add(top);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 10), chrome); pole.position.y = 0.36; t.add(pole);
    [0, 1, 2, 3].forEach(i => { const a = Math.PI / 4 + i * Math.PI / 2, c = new THREE.Group(); c.position.set(Math.cos(a) * 0.62, 0, Math.sin(a) * 0.62); c.rotation.y = Math.atan2(-Math.cos(a), -Math.sin(a)); t.add(c);
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.4), blk); seat.position.y = 0.45; c.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.42, 0.03), blk); back.position.set(0, 0.7, -0.2); back.rotation.x = -0.12; c.add(back);
      [[-.18, -.17], [.18, -.17], [-.18, .17], [.18, .17]].forEach(([a2, b2]) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.45, 6), chrome); l.position.set(a2, 0.225, b2); c.add(l); }); });
  });
})();
// 지자체 부스 (1027 배치도 「광주시 지자체부스」 6 × 3 m, 꾸밈은 미확인)
(function () { const g = new THREE.Group(); g.position.set(-17.8, 0, 9.2); scene.add(g); box(6, 0.1, 3, M(0xe8ecf3), 0, 0, 0, g); box(6, 3, 0.15, M(0xffffff), 0, -1.5, 0.1, g); const s = sign(['지자체 부스'], 4, 0.7, { bg: '#0b1440', size: 120 }); s.position.set(0, 2.6, -1.4); g.add(s); box(2.2, .9, .7, M(0xffffff), 0, 1.0, 0.1, g); })();

/* ---------- 환경장식물 (10. 22.) ---------- */
// 1 2층 난간 현수막: 13,000 / 4,300 / 6,000 × 3,500
[['b_rail1', 13, 61.4], ['b_rail12', 4.3, 24.6], ['b_rail13', 6, 14.9], ['b_rail14', 6, -14.7], ['b_rail15', 6, -26]].forEach(([f, w, x]) => panel(tex(`tex/${f}.jpg`), w, 3.5, x, 5.95, RAIL_Z + 0.05, 0));
// 2 2층 난간 가랜드 350 × 425
(function garland() {
  const geo = pennantGeo(0.35, 0.425, 0, true), list = [];
  slabs.slice(1).forEach(([a, b]) => { for (let x = a + 0.4; x <= b - 0.4; x += 0.42) list.push([x, 7.7, RAIL_Z + 0.12]); });
  const im = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, toneMapped: false }), list.length), o = new THREE.Object3D();
  list.forEach((p, i) => { o.position.set(...p); o.updateMatrix(); im.setMatrixAt(i, o.matrix); im.setColorAt(i, new THREE.Color(TILE_COL[i % 18])); });
  scene.add(im);
})();
// 6 빵빠레 배너 600 × 900 (2층 난간 전체)
(function ppa() {
  const geo = pennantGeo(0.6, 0.9, 0, true), ts = [tex('tex/b_ppa1.jpg'), tex('tex/b_ppa2.jpg')];
  ts.forEach(t => { t.repeat.set(0.47, 0.97); t.offset.set(0.005, 0.02); });
  let i = 0;
  slabs.forEach(([a, b]) => { for (let x = a + 1.5; x <= b - 1.5; x += 4.5, i++) { if (Math.abs(x - 61.4) < 7) continue; const m = new THREE.Mesh(geo, IMG(ts[i % 2], THREE.DoubleSide)); m.position.set(x, 6.6, RAIL_Z + 0.08); scene.add(m); } });
})();
// 4 외벽 배너 2번 게이트 7,000 × 6,000 × 2 · 5 외벽 배너 4번 게이트 7,000 × 6,000
boxXZ(LOBBY.x1, LOBBY.x1 + .45, -7.5, 0, 15, M(0xd9dee6)); boxXZ(LOBBY.x1 + .3, LOBBY.x1 + .45, 31.6, 37, 15, M(0xd9dee6));
panel(tex('tex/b_gate2a.jpg'), 7, 6, LOBBY.x1 + 0.5, 9.5, -3.6, Math.PI / 2);
panel(tex('tex/b_gate2b.jpg'), 7, 6, LOBBY.x1 + 0.5, 9.5, 3.6, Math.PI / 2);
boxXZ(LOBBY.x0 - 1.2, LOBBY.x0 - 0.6, 18, 31.6, 15, M(0xd9e2ea));
panel(tex('tex/b_gate4.jpg'), 7, 6, LOBBY.x0 - 1.25, 9.5, 24.8, -Math.PI / 2);
// 게이트 표지 (조감 바닥)
[['GATE 1', LOBBY.x1 + 4, 24], ['GATE 2', LOBBY.x1 + 4, 13], ['GATE 4', LOBBY.x0 + 3, 13]].forEach(([t, x, z]) => { const s = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.6), B(textTex([t], { w: 512, h: 136, bg: '#e8192c', size: 90 }))); s.rotation.x = -Math.PI / 2; s.position.set(x, 0.05, z); s.rotation.z = Math.PI / 2 * (x > 0 ? 1 : -1); birdOnly.add(s); });

/* ---------- 다목적홀 대기실 줄 (로비 ↔ 홀 사이, 10. 30.) ----------
   근거: 사업팀/공간조성계획/대기실배정_1029/다목적홀1·2_대기실_도면_v3.png(10. 14. 실측) · 렌탈 배치(안) v3(10. 28.)
   방 x 자리는 도면 픽셀 환산(x = −64 + (px − 275) × 0.078), 방 폭은 실측(출연자 6.8 · VIP-1 11 · 사무실1 3.8 + 2.8 · 사무실2 3.8). 높이·문 자리 = 유나 판단 */
const RZ0 = 31.4, RZ1 = MH.z0, RH = 3.2;
const ROOMS = [
  { name: 'VIP 대기실-1', no: 1, x0: -72.5, x1: -61.5 },
  { name: '출연자대기실-2', no: 2, x0: -57.9, x1: -51.1 },
  { name: '주최자사무실 1', no: 3, x0: -42.8, x1: -36.2, split: -39.0 },
  { name: '주최자사무실 2', no: 4, x0: -7.3, x1: -3.5 },
  { name: 'VIP 대기실-2', no: 5, x0: 3.5, x1: 16.5, sub: '내빈 B 대기실' },
];
{
  const wm = M(0xe3e0d8), rw = M(0xf2efe9), solid = [[LOBBY.x0, -72.5], [-61.5, -57.9], [-36.2, -7.3]];
  solid.forEach(([a, b]) => boxXZ(a, b, 31.6, MH.z0, WALL_H, wm));
  ROOMS.forEach(r => {
    const dx = r.x0 + 1.6;                                                    // 로비 쪽 문 (1.2 m)
    r.door = dx;
    boxXZ(r.x0, dx - 0.6, 31, RZ0, WALL_H, wm); boxXZ(dx + 0.6, r.x1, 31, RZ0, WALL_H, wm); boxXZ(dx - 0.6, dx + 0.6, 31, RZ0, WALL_H - 2.3, wm, 2.3);
    boxXZ(r.x0 - 0.15, r.x0, RZ0, RZ1, WALL_H, wm); boxXZ(r.x1, r.x1 + 0.15, RZ0, RZ1, WALL_H, wm);
    if (r.split) boxXZ(r.split - 0.06, r.split + 0.06, RZ0, RZ1 - 1.4, RH, rw);
    floorPlane(r.x0, r.x1, RZ0, RZ1, M(r.name.startsWith('VIP') ? 0x6b5a4a : 0x8c8f96, { roughness: .95 }), 0.02);
    const pl = sign([r.no + '  ' + r.name].concat(r.sub ? [r.sub] : []), 2.6, r.sub ? 0.9 : 0.55, { bg: '#0b1440', size: 110 });
    pl.position.set(dx + 1.9, 2.4, 30.97); pl.rotation.y = Math.PI; scene.add(pl);    // 로비에서 읽는 문패
    const lb = sign([r.name], Math.min(8, (r.x1 - r.x0) * 0.8), 1.1, { bg: 'rgba(11,20,64,.8)', size: 120 });
    lb.rotation.x = -Math.PI / 2; lb.position.set((r.x0 + r.x1) / 2, RH + 0.4, (RZ0 + RZ1) / 2); birdOnly.add(lb);  // 조감 이름
  });
  // 방 안 집기: 렌탈 v6 · v4 대기실 배정(테이블 W1500 · 거울 · 행거). VIP 방 가구는 기존 것 → 모양은 유나 판단
  const white = M(0xf4f4f2, { roughness: .6 }), blackC = M(0x1b1c22), glass = M(0xcfe3f5, { roughness: .1, metalness: .6 }), steel = M(0x9aa0aa, { metalness: .7, roughness: .35 });
  const table = (x, z, rot = 0) => { const t = box(1.5, 0.05, 0.6, white, x, z, 0.72); t.rotation.y = rot; [-0.68, 0.68].forEach(o => { const l = box(0.04, 0.72, 0.5, steel, x + (rot ? 0 : o), z + (rot ? o : 0), 0); l.rotation.y = rot; }); };
  const chair = (x, z) => { box(0.42, 0.05, 0.42, blackC, x, z, 0.44); box(0.42, 0.45, 0.04, blackC, x, z + 0.2, 0.47); box(0.36, 0.44, 0.04, blackC, x, z, 0); };
  const mirror = (x, z) => { box(0.5, 1.6, 0.04, glass, x, z, 0.2); box(0.56, 0.08, 0.3, steel, x, z, 0); };
  const hanger = (x, z) => { [-0.6, 0.6].forEach(o => box(0.04, 1.7, 0.04, steel, x + o, z, 0)); box(1.26, 0.04, 0.04, steel, x, z, 1.7); for (let i = 0; i < 5; i++) box(0.05, 0.8, 0.45, M([0x2c3550, 0x6a2f3a, 0xd9d4c8][i % 3]), x - 0.45 + i * 0.22, z, 0.85); };
  const set2 = (cx, cz, n) => { [-0.9, 0.9].forEach((o, k) => { table(cx + o, cz); for (let i = 0; i < n / 2; i++) chair(cx + o - 0.45 + (i % 2) * 0.9, cz + (i < 2 ? -0.6 : 0.6)); }); };
  // 1 VIP 대기실-1: 방에 있는 테이블 · 의자 + 거울 1 · 행거 2
  box(4.2, 0.06, 1.4, M(0x4a3a2c, { roughness: .5 }), -67.5, 34.6, 0.72); for (let i = 0; i < 4; i++) [-1, 1].forEach(s => chair(-69 + i * 1.0, 34.6 + s * 1.0));
  mirror(-62.2, 36.9); hanger(-71, 36.9); hanger(-71, 32.2);
  // 2 출연자대기실-2: 테이블 2 · 의자 8 · 거울 1 · 행거 1
  set2(-54.5, 34.6, 8); mirror(-52, 37.1); hanger(-56.6, 37.1);
  // 3 주최자사무실 1: 테이블 2 · 의자 8 · 거울 1 · 행거 1 (두 칸)
  table(-41, 33.5); table(-41, 35.8); [-41.5, -40.5].forEach(x => { chair(x, 32.9); chair(x, 36.4); }); chair(-42.2, 34.6); chair(-39.8, 34.6); chair(-42.2, 35.8); chair(-39.8, 35.8);
  mirror(-37.2, 37.1); hanger(-37.6, 32.4);
  // 4 주최자사무실 2: 4단 선반 1 · 테이블 2 · 의자 6
  box(1.2, 1.8, 0.45, steel, -6.6, 36.9, 0); for (let i = 1; i < 4; i++) box(1.2, 0.03, 0.45, steel, -6.6, 36.9, i * 0.45);
  table(-5.4, 33.4, Math.PI / 2); table(-5.4, 35.2, Math.PI / 2); [33.0, 33.8, 34.8, 35.6].forEach(z => chair(-6.3, z)); chair(-4.5, 33.4); chair(-4.5, 35.2);
  // 5 VIP 대기실-2 (내빈 B): 스탠딩 TV 1(렌탈 KP-05) + 소파 · 낮은 탁자(기존 것, 모양 유나 판단)
  const sofa = M(0xe8e1d4, { roughness: .9 });
  [[6.5, 1], [13.5, -1]].forEach(([x, s]) => { box(1, 0.45, 3, sofa, x, 34.5, 0); box(0.25, 0.4, 3, sofa, x - s * 0.4, 34.5, 0.45); });
  box(4.5, 0.4, 1, sofa, 10, 36.6, 0); box(2.4, 0.4, 1.2, M(0x3a2c22), 10, 34.5, 0);
  { const tv = new THREE.Group(); tv.position.set(10, 0, 32.1); scene.add(tv); box(0.5, 1.2, 0.05, steel, 0, 0, 0, tv); box(1.45, 0.84, 0.06, blackC, 0, 0, 1.2, tv);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.38, 0.78), new THREE.MeshBasicMaterial({ map: ledTex('2026 CO-SHOW', '포토존 진행 화면', { w: 512, h: 288 }), toneMapped: false })); scr.position.set(0, 1.62, 0.035); tv.add(scr); }
}

/* ---------- 다목적홀1 · 공식행사장 (10. 30. 다시 지음) ----------
   근거: 이충응 팀장 「2026 CO-SHOW stage-1023.pdf」(첨부/2026-10-28/163252_…) 1쪽 평면 · 2쪽 A 입면, 렌탈 배치(안) v3(10. 28.) · 간선도면(10. 29.)
   평면 환산 x = −64 + (px − 528) × 0.045, z = 37.6 + (py − 233) × 0.045 (홀 41,460 × 37,300 = 921 × 829 px). 탑 한 칸 2,070, 탑 높이 = 칸 안 글자(2 · 4 · 6 · 8 m) */
ZONE = 0.03;
const beige = M(0xd9ccb2);
floorPlane(MH.x0, MH.x1, MH.z0, MH.z1, beige, 0.005);
floorPlane(-51, -43, 31, MH.z0, M(0xe6e9ef), 0.006); floorPlane(-3, 3, 31, MH.z0, M(0xe6e9ef), 0.006);
const wood = M(0xc9a26e, { roughness: .6 });
const wallMH = (x0, x1, z0, z1) => { boxXZ(x0, x1, z0, z1, WALL_H, wood); boxXZ(x0, x1, z0, z1, 11 - WALL_H, M(0xe9dfcc), WALL_H, walkOnly); };
[[MH.x0, -51], [-43, -3], [3, MH.x1]].forEach(([a, b]) => wallMH(a, b, MH.z0, MH.z0 + .5));
wallMH(MH.x0, MH.x1, MH.z1 - .5, MH.z1); wallMH(MH.x0 - .5, MH.x0, MH.z0, MH.z1); wallMH(MH.x1, MH.x1 + .5, MH.z0, MH.z1);
floorPlane(MH.x0, MH.x1, MH.z0, MH.z1, M(0x2a3045, { side: THREE.DoubleSide }), 11, walkOnly);
boxXZ(MH.mid - .25, MH.mid + .25, MH.z0 + .5, MH.z1 - .5, 11, M(0xf1eee8));            // 다목적홀1 | 2 사이 이동벽 (닫힘, 실측 도면 점선)
// 레이어 타워 (2,070 각, 격자 트러스 그림)
const towerMat = (() => { const C = {}; return h => { if (C[h]) return C[h];
  const t = canvasTex(256, 256, (g, w) => { g.clearRect(0, 0, w, w); g.strokeStyle = '#c9cfd9'; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, w - 10); g.lineWidth = 5; g.beginPath(); g.moveTo(8, 8); g.lineTo(w - 8, w - 8); g.moveTo(w - 8, 8); g.lineTo(8, w - 8); g.stroke(); g.beginPath(); g.moveTo(0, w / 2); g.lineTo(w, w / 2); g.stroke(); });
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, h / 2.07);
  return (C[h] = M(0xffffff, { map: t, alphaTest: 0.35, side: THREE.DoubleSide, metalness: .8, roughness: .3, emissive: 0x161b28 })); }; })();
const TOWERS = [];
const towerRun = (x, z, dx, dz, hs) => hs.forEach((h, i) => { const cx = x + dx * 2.07 * (i + 0.5), cz = z + dz * 2.07 * (i + 0.5); box(2.07, h, 2.07, towerMat(h), cx, cz, 0); TOWERS.push([cx, cz, h]); });
towerRun(-63.1, 47.0, 0, 1, [6, 6, 6, 6, 6, 6, 6, 6, 6]);       // 무대 뒤 9개 (A 입면 6 m)
towerRun(-61.1, 45.0, 1, 0, [6, 6, 6, 8, 6]);                   // 북쪽 줄 (무대 쪽)
towerRun(-61.1, 65.4, 1, 0, [6, 6, 6, 8, 6]);                   // 남쪽 줄 (무대 쪽)
towerRun(-44.2, 45.1, 1, 0, [4, 4, 4, 4, 2, 2]);                // 북쪽 줄 (입구 통로 동쪽 G)
towerRun(-45.6, 65.4, 1, 0, [6, 6, 8, 4, 8, 6, 8]);             // 남쪽 줄 (객석 쪽)
towerRun(-24.85, 46.9, 0, 1, [4, 8, 6, 8, 8, 8, 6, 8, 4]);      // 콘솔 뒤 동쪽 줄 (D)
// 입구 통로 양쪽 벽 (평면 분홍 칸, 3,140 폭) — 높이 3 m = 유나 판단
const scrim = M(0x07080d, { roughness: .9 });
boxXZ(-50.1, -49.0, 38.1, 47.0, 3, scrim); boxXZ(-45.7, -44.6, 38.1, 45.0, 3, scrim);
(function stageA() {
  const black = M(0x0b0c12, { roughness: .3 }), sx0 = -61.0, sx1 = -55.4, sz0 = 47.2, sz1 = 65.4, cz = (sz0 + sz1) / 2;
  boxXZ(sx0, sx1, sz0, sz1, 0.9, black);                                             // 기존무대 H 900 · 18,280 × 5,630
  boxXZ(sx1 - 0.05, sx1, sz0, sz1, 0.05, E(0x5a6bff, 2.2), 0.85);                    // 무대 앞 끝 빛줄
  [[sz0 + 1.2], [sz1 - 1.2]].forEach(([z]) => { for (let i = 0; i < 3; i++) boxXZ(sx1 + i * 0.35, sx1 + (i + 1) * 0.35, z - 0.7, z + 0.7, 0.9 - (i + 1) * 0.3, black); });  // 계단 (자리 유나 판단)
  // A 입면: 뒤 막(분홍) 18 × 5 m 위에 LED-C 12,000 × 4,000 (무대 위 1,000부터)
  boxXZ(sx0 - 0.25, sx0 - 0.05, sz0, sz1, 5, M(0x05060a), 0.9);
  const wv = new THREE.Mesh(new THREE.PlaneGeometry(12, 4), GLOW(waveTex, 1.6)); wv.position.set(sx0 + 0.02, 0.9 + 1 + 2, cz); wv.rotation.y = Math.PI / 2; scene.add(wv);
  // 강연대 (렌탈 ② 메인 · ③ 사회대, 아크릴)
  const acr = M(0xdfeaff, { transparent: true, opacity: .55, roughness: .1 });
  [[52.5], [61.9]].forEach(([z]) => box(0.6, 1.15, 0.5, acr, -56.2, z, 0.9));
  // ⑤ 20일 시상 테이블 2 (무대 남쪽)
  [-58.6, -57.0].forEach(x => box(1.5, 0.05, 0.6, M(0xf4f4f2), x, 64.4, 0.9 + 0.72));
  // 무빙라이트: 무대 뒤 탑 · 동쪽 탑 위 (빛줄기는 무대 가운데로)
  const cols = [0xe8eeff, 0xa070ff, 0x5fd8ff];
  TOWERS.filter(([x, , h]) => x < -61 || x > -25.5).forEach(([x, z, h], k) => {
    if (LOW && k % 2) return;
    const g = new THREE.Group(); g.position.set(x, h + 0.35, z); scene.add(g);
    box(0.32, 0.4, 0.32, M(0x15161c, { roughness: .4 }), 0, 0, -0.2, g);
    const tx = x < -61 ? -50 : -57.5, tz = cz + (z - cz) * 0.4;
    beam([0, -0.2, 0], [tx - x, 1 - (h + 0.35), tz - z], x < -61 ? 1.1 : 0.9, cols[k % 3], 0.16, g);
    HEADS.push({ g, ph: k * 0.7 });
  });
  [[-24.85, cz - 6], [-24.85, cz + 6]].forEach(([x, z], i) => { if (LOW && i) return; const L = new THREE.SpotLight(0xeef2ff, 320, 50, 0.4, 0.6, 2); L.position.set(x, 8.5, z); L.target.position.set(sx0 + 3, 1.2, cz); scene.add(L, L.target); });
  { const L = new THREE.SpotLight(0x8a63ff, 380, 40, 0.95, 0.8, 2); L.position.set(-42, 10.5, cz); L.target.position.set(-42, 0, cz); scene.add(L, L.target); }
  pool(sx0 + 3, cz, 6, 0xb9a8ff, 0.35, 0.92);
  const wm = M(0xf2f4f8, { roughness: .5 });
  [-1.3, 1.3].forEach(o => figure(scene, sx1 - 1.6, cz + o, wm));
  scene.children.slice(-4).forEach(c => c.position.y += 0.9);
})();
// 무대 둘레 LED (렌탈 배치 v3 · 간선도면): 2,000 × 3,000 넷 · 5,000 × 1,000 하나 · 콘솔 뒤 5,000 × 3,000
[[-51.7, 47.25, 0, 2, 3], [-40.0, 47.25, 0, 2, 3], [-52.5, 65.3, Math.PI, 2, 3], [-42.1, 65.3, Math.PI, 2, 3], [-34.8, 65.3, Math.PI, 5, 1], [-25.95, 56.4, -Math.PI / 2, 5, 3]].forEach(([x, z, ry, w, h]) => {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), pixMat(w / 2, h / 2, 1.5)); m.position.set(x, 2.4 + h / 2, z); m.rotation.y = ry; scene.add(m);
  box(w + 0.2, h + 0.2, 0.12, M(0x0a0d18), x - Math.sin(ry) * 0.08, z - Math.cos(ry) * 0.08, 2.3).rotation.y = ry;
});
(function seats() {                                                            // ① 객석 접이식 의자(검정) 350 · 가운데 통로 2 m
  const list = [];
  for (let i = 0; i < 16; i++) for (let j = 0; j < 22; j++) { const x = -51.1 + i * 1.29, z = j < 11 ? 48.9 + j * 0.65 : 57.9 + (j - 11) * 0.65; if (i === 15 && (j === 0 || j === 21)) continue; list.push([x, z]); }
  const seat = new THREE.BoxGeometry(0.44, 0.04, 0.44).translate(0, 0.45, 0), back = new THREE.BoxGeometry(0.04, 0.4, 0.42).translate(0.22, 0.72, 0), legs = new THREE.BoxGeometry(0.4, 0.45, 0.03).translate(0, 0.22, 0);
  const im = new THREE.InstancedMesh(mergeGeometries([seat, back, legs]), M(0x1a1b20, { roughness: .6 }), list.length), o = new THREE.Object3D();
  list.forEach(([x, z], i) => { o.position.set(x, 0, z); o.updateMatrix(); im.setMatrixAt(i, o.matrix); });
  scene.add(im);
})();
{ // ④ 19일 심사석 테이블 3 · 의자 5 (무대 앞)
  const w = M(0xf4f4f2);
  [54.4, 56.6, 58.8].forEach(z => box(0.6, 0.05, 1.5, w, -53.6, z, 0.72));
  for (let i = 0; i < 5; i++) box(0.42, 0.45, 0.42, M(0x1a1b20), -52.9, 54.0 + i * 1.2, 0);
}
{ // ⑥ 콘솔 (D): 단 위 운영 · 조명 · 특효 · 음향 · 영상 · VJ 데스크 + 앞 테이블 7 · 의자 14 · 복합기 · 노트북 2
  const k = M(0x22252e, { roughness: .5 });
  boxXZ(-26.8, -25.0, 48.3, 62.7, 0.4, M(0x3a2c28));
  for (let i = 0; i < 8; i++) { const z = 49.2 + i * 1.75; box(0.9, 0.85, 1.4, k, -25.9, z, 0.4); box(0.5, 0.35, 0.05, E(0x3b7cff, 1.2), -26.3, z, 1.3).rotation.y = Math.PI / 2; }
  for (let i = 0; i < 7; i++) { const z = 58.7 + i * 0.95; box(1.5, 0.05, 0.6, M(0xf4f4f2), -29.6, z, 0.72); [-0.22, 0.22].forEach(o => box(0.4, 0.45, 0.4, M(0x1a1b20), -28.5, z + o, 0)); }   // 렌탈 배치 v3 ⑥ 자리
  [55.0, 55.8].forEach(z => box(0.35, 0.02, 0.25, M(0x2a2d35), -29.6, z, 0.77));   // 노트북 2
  box(0.6, 1.05, 0.6, M(0xe9ebee), -28.4, 51.0, 0);
}
{ // ⑦ 하역장 쪽: 테이블 4 · 의자 12 · 접이식 가림막 2
  const w = M(0xf4f4f2);
  [[-61.2, 71.4], [-58.0, 71.4], [-61.2, 73.8], [-58.0, 73.8]].forEach(([x, z]) => { box(1.5, 0.05, 0.6, w, x, z, 0.72); [-0.45, 0, 0.45].forEach(o => box(0.42, 0.45, 0.42, M(0x1a1b20), x + o, z - 0.6, 0)); });
  [71.5, 73.5].forEach(z => box(0.05, 1.8, 1.9, M(0x2b2f3a), -55.1, z, 0));
}
// 메달 비행 공기조형물(코아이) 대기 자리 — 렌탈 배치 v3 오른쪽 아래 (3 × 3.2 m)
coaiCard('stand', -26.5, 71.2, 0, 3.2);
ZONE = 0.3;

/* ---------- 다목적홀2 · 세미나장 (경진대회 3구역, 10. 30. 다목적홀2 컨소시엄 배치도로 다시 맞춤) ----------
   근거: 「2026 CO-SHOW 다목적홀 전기, 인터넷 배치」(첨부/2026-10-29/191912) 5쪽 배치도 · 6 · 7 · 8쪽
   이차전지 12 × 16 m(북서) · 미래자동차 B AUTO HACK 12 × 12 m(남서) · 미래자동차 A AUTO RACE 14 × 24 m(동) · 통로 5 m
   방 안 가구는 10. 21. 3D 그림(E = 긴 테이블 세미나 → 이차전지, F = 네모 테이블 → 미래차 B, D = 레이싱 트랙 → 미래차 A)을 옮긴 유나 판단. 가벽 4 m */
(function hall2() {
  const pm = (() => { const t = canvasTex(256, 256, (g, w) => { g.fillStyle = '#f3f1ec'; g.fillRect(0, 0, w, w); g.fillStyle = '#c9ccd2'; g.fillRect(0, 0, 6, w); g.fillRect(0, w / 2 - 3, w, 6); }); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; })();
  const PM = {}; const panelM = len => { const k = Math.round(len); if (PM[k]) return PM[k]; const t = pm.clone(); t.repeat.set(Math.max(1, k), 2); t.needsUpdate = true; return (PM[k] = M(0xffffff, { map: t, roughness: .8 })); };
  const H = 4, X0 = MH.mid + .25;
  floorPlane(X0, MH.x1, MH.z0 + .5, MH.z1 - .5, M(0xd6cdb8, { roughness: .95 }), 0.007);   // 카펫 (3D 그림 베이지)
  floorPlane(-8.75, -3.75, MH.z0 + .5, MH.z1 - .5, M(0xbfc3cb, { roughness: .9 }), 0.009);   // 가운데 통로 5 m (배치도 회색)
  const wall = (x0, x1, z0, z1) => { const len = Math.max(x1 - x0, z1 - z0); boxXZ(x0, x1, z0, z1, H, panelM(len)); };
  // 이차전지 (북서): x X0 ~ −8.75 · z 37.6 ~ 53.6, 문 = 동쪽 벽 북쪽 끝
  wall(X0, -8.75, 53.5, 53.7); wall(-8.85, -8.65, 41.8, 53.7);
  // 미래자동차 B · AUTO HACK (남서): z 58.6 ~ 70.6, 문 = 동쪽 벽 북쪽 끝
  wall(X0, -8.75, 58.5, 58.7); wall(-8.85, -8.65, 61.6, 70.7); wall(X0, -8.75, 70.5, 70.7);
  // 미래자동차 A · AUTO RACE (동): x −3.75 ~ 10.25 · z 43.6 ~ 67.6, 문 = 북쪽 벽 서쪽
  wall(-3.85, -2.75, 43.5, 43.7); wall(0.25, 10.35, 43.5, 43.7); wall(-3.85, -3.65, 43.5, 67.7); wall(10.15, 10.35, 43.5, 67.7); wall(-3.85, 10.35, 67.5, 67.7);
  const ban = (t, x, z, ry) => { const s = sign(t, 4.6, 2.2, { bg: '#0b1440', border: '#2fe4ff', size: 120 }); s.position.set(x, H + 1.1, z); s.rotation.y = ry; scene.add(s); const b = box(4.7, 2.3, 0.1, M(0x0a0d18), x - Math.sin(ry) * 0.06, z - Math.cos(ry) * 0.06, H - 0.05); b.rotation.y = ry; };
  ban(['2026 CO-SHOW', '이차전지'], -8.55, 47.7, Math.PI / 2);
  ban(['미래자동차 B', 'AUTO HACK'], -8.55, 66.1, Math.PI / 2);
  ban(['미래자동차 A', 'AUTO RACE'], 5.3, 43.4, Math.PI);
  const w = M(0xffffff, { roughness: .6 }), blk = M(0x1a1b20), steel = M(0x9aa0aa, { metalness: .7, roughness: .35 }), red = M(0xd0262c);
  const chairs = (list, ry = 0) => { const geo = mergeGeometries([new THREE.BoxGeometry(0.42, 0.04, 0.42).translate(0, 0.45, 0), new THREE.BoxGeometry(0.42, 0.4, 0.04).translate(0, 0.72, 0.2), new THREE.BoxGeometry(0.4, 0.45, 0.03).translate(0, 0.22, 0)]);
    const im = new THREE.InstancedMesh(geo, blk, list.length), o = new THREE.Object3D(); list.forEach(([x, z, r], i) => { o.position.set(x, 0, z); o.rotation.y = r ?? ry; o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); scene.add(im); };
  const board = (x, z, ry) => { const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g); box(1.8, 1.1, 0.04, w, 0, 0, 0.9, g); [-0.85, 0.85].forEach(o => box(0.04, 1.9, 0.5, steel, o, 0, 0, g)); };
  const sq = (x, z, list) => { box(1.6, 0.05, 1.6, w, x, z, 0.72); [[0, -1.05, Math.PI], [0, 1.05, 0], [-1.05, 0, -Math.PI / 2], [1.05, 0, Math.PI / 2]].forEach(([dx, dz, r]) => list.push([x + dx, z + dz, r])); };
  const panelBox = (x, z) => box(0.5, 0.6, 0.35, red, x, z, 0);   // 전기 분전함 자리 (6 · 7 · 8쪽 빨간 네모)
  // 이차전지: 서쪽 단 + 화이트보드, 긴 테이블 5줄 × 3 (앞 보기 = 서쪽)
  boxXZ(X0 + .2, X0 + 2.2, 42.5, 48.7, 0.3, M(0x2b2d33)); board(X0 + 1, 45.6, Math.PI / 2);
  const eC = [];
  for (let r = 0; r < 5; r++) { const x = -16.6 + r * 1.65; [39.2, 43.4, 47.6].forEach(z0 => { box(0.6, 0.05, 3.4, w, x, z0 + 1.7, 0.72); for (let k = 0; k < 4; k++) eC.push([x + 0.55, z0 + 0.45 + k * 0.85, Math.PI / 2]); }); }
  chairs(eC); panelBox(X0 + .4, 38.4);                                                        // 18 kW
  // 미래자동차 B · AUTO HACK: 네모 테이블 3 × 2 · 남쪽 벽 책상 3 (8쪽 선) · 문 옆 긴 카운터 (8쪽 안쪽 칸)
  const fC = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) sq(-18.3 + i * 3.4, 63 + j * 3.6, fC);
  [-19, -16.4, -13.8].forEach(x => { box(1.7, 0.05, 0.6, w, x, 70.05, 0.72); fC.push([x, 69.4, Math.PI]); });
  boxXZ(-9.75, -9.0, 61.6, 68.5, 0.9, M(0xe9ecf1)); chairs(fC); board(X0 + .4, 66.2, Math.PI / 2); panelBox(X0 + .4, 64.6);   // 15 kW (북쪽 벽에서 6 m)
  // 미래자동차 A · AUTO RACE: 레이싱 트랙 매트 (3D 그림 D Hall) + 운영 테이블
  const track = canvasTex(384, 640, (g) => { g.fillStyle = '#4c8a3a'; g.fillRect(0, 0, 384, 640); g.strokeStyle = '#c8363a'; g.lineWidth = 60; g.lineJoin = 'round'; const path = () => { g.beginPath(); g.moveTo(80, 80); g.lineTo(290, 80); g.quadraticCurveTo(320, 80, 315, 140); g.lineTo(220, 260); g.quadraticCurveTo(190, 300, 250, 340); g.lineTo(310, 420); g.quadraticCurveTo(330, 560, 290, 560); g.lineTo(90, 560); g.quadraticCurveTo(60, 560, 60, 500); g.lineTo(60, 120); g.quadraticCurveTo(60, 80, 80, 80); }; path(); g.stroke(); g.strokeStyle = '#2b2d33'; g.lineWidth = 46; path(); g.stroke(); g.strokeStyle = '#fff'; g.lineWidth = 3; g.setLineDash([14, 12]); path(); g.stroke(); g.setLineDash([]); g.fillStyle = '#fff'; for (let i = 0; i < 6; i++) g.fillRect(110 + i * 10, 58 + (i % 2) * 10, 10, 10); });
  floorPlane(-2.6, 9.1, 46.2, 66.3, M(0xffffff, { map: track }), 0.03);
  [0.6, 3.2].forEach(x => box(1.8, 0.05, 0.75, w, x, 44.6, 0.72)); chairs([[0.6, 45.2, 0], [3.2, 45.2, 0]]);
  panelBox(-3.3, 51.6); panelBox(9.8, 59.6);                                                   // 10 kW × 2 (벽 따라 8 m)
  // 통로 사람
  const fm = M(0xd9dde6, { roughness: .5 }); [[-6.2, 47], [-6.6, 57.5], [1.8, 40.6]].forEach(([x, z]) => figure(scene, x, z, fm));
  { const L = new THREE.PointLight(0xfff4e0, 90, 30, 2); L.position.set(-6.2, 9, 56); scene.add(L); }
  [[-14.75, 45.6], [-14.75, 64.6], [3.25, 55.6]].forEach(([x, z]) => { const L = new THREE.PointLight(0xfff4e0, 110, 24, 2); L.position.set(x, 8, z); scene.add(L); });
  const hs = sign(['다목적홀2 · 세미나장', '이차전지 · 미래자동차 A · B'], 8, 1.8, { bg: '#0b1440', border: '#2fe4ff', size: 110 }); hs.position.set(2, 6.2, MH.z0 + 0.6); scene.add(hs);
})();
// 로비 쪽 문 위 이름판 (홀 두 곳)
[['다목적홀1 · 공식행사장', -47], ['다목적홀2 · 세미나장', 0]].forEach(([t, x]) => { const s = sign([t], 7, 1, { bg: '#0b1440', border: '#2fe4ff', size: 110 }); s.position.set(x, 3.9, 30.9); s.rotation.y = Math.PI; scene.add(s); });

ZONE = 1;
buildTruss();
/* 구역 이름 (조감 바닥) */
[['전시장 A · B · C홀', 0, -47, 40], ['로비 (콘코스)', 10, 28.5, 30], ['다목적홀1 · 공식행사장', -42.5, 73.5, 26], ['다목적홀2 · 세미나장', -4, 73.5, 24]].forEach(([t, x, z, w]) => {
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 6), B(textTex([t], { w: 1024, h: 170, bg: 'rgba(11,20,64,.72)', size: 110 }))); p.rotation.x = -Math.PI / 2; p.position.set(x, 0.12, z); if (z === -47) { p.rotation.x = -0.5; p.position.set(0, 13, -62); }   // 전시장 글자는 부스 위가 아니라 뒷벽 위에 세움
  birdOnly.add(p);
});

/* ---------- 번호 표시 ---------- */
// 빨강 = 구조물(제작승인서 번호 01~06) · 노랑 = 환경장식물(승인서 번호 1~8) · 파랑 = 그 밖
const P = 'img/';
const S27 = '1027 전시장 시안 (공유 드라이브 26COSS)';
const HOT = [
 { n: '04', c: 'r', t: '메인게이트 (COSS GATE) · 키네틱 LED', z: '로비 · GATE 1·2 안쪽', p: [MG.cx + 0.8, 6.6, MG.cz + 4.6], st: [86, MG.cz], desc: '폭 17 m · 높이 5 m 휜 게이트. 가운데 키네틱 LED(5.8 × 2.4 m), 윗보 로고 네온사인, 컨소시엄 깃발 18개(0.73 × 1.65 m)', img: [['n_maingate_03', '투시도 1'], ['n_maingate_04', '투시도 2'], ['n_maingate_05', '뒷면 (회색 시트 로고)'], ['n_maingate_07', '앞면 치수'], ['n_maingate_09', '깃발 18개']], src: '04.로비 메인게이트 제작승인서_1021' },
 { n: '03', c: 'r', t: '선수단 라운지 1 · AD카드 배부처', z: '로비 · 메인게이트 옆', p: [66, 5.6, 23.1], st: [66, 16.5], desc: '10 × 8 m. 경진대회 선수단 라운지와 AD카드 배부처, 원탁 12세트', img: [['n_lounge_03', '투시도'], ['n_lounge_06', '그래픽 (입구게이트 · 상부 간판)'], ['n_lounge_02', '로비 배치도']], src: '03.로비 선수단라운지 제작승인서_1021' },
 { n: '03', c: 'r', t: '선수단 라운지 2', z: '로비 · A홀 앞', p: [51.1, 5.6, 24.2], st: [51.1, 17], desc: '10 × 8 m. 가운데 5 m 입구 게이트, 원탁 12세트', img: [['n_lounge_07', '투시도'], ['n_lounge_10', '그래픽']], src: '03.로비 선수단라운지 제작승인서_1021' },
 { n: '01', c: 'r', t: '전시장 입구게이트 (A · B · C홀)', z: '로비 · 전시장 입구 3곳', p: [GC.B, 5.8, 9.4], more: [[GC.A, 5.8, 9.4], [GC.C, 5.8, 9.4]], st: [3, 16], desc: '폭 12.6 m · 높이 4 m, 안쪽 벽 6 m. 앞면 세로 그래픽, 안쪽 현황판 · 그래픽(4 × 3 m), 위 아크릴 네온 로고. A·C홀은 에스컬레이터 입구게이트 함께', img: [['n_expogate_03', 'A홀 투시도'], ['n_expogate_06', 'B홀 투시도'], ['n_expogate_09', 'C홀 투시도'], ['n_expogate_05', 'A홀 치수 · 그래픽'], ['n_expogate_08', 'B홀 치수 · 그래픽'], ['n_expogate_11', 'C홀 치수 · 그래픽'], ['n_expogate_02', '배치도']], src: '01.로비 입구게이트 구조물 제작승인서_1027' },
 { n: '02', c: 'r', t: '안내데스크 및 무인등록데스크', z: '로비 · B홀과 C홀 사이', p: [0.2, 4.4, 18.6], st: [4.5, 22.5], desc: '4.36 × 4 m, 높이 3 m. 뒤 창고(3 × 2 m), 양옆 무인등록데스크(3 × 0.7 × 1 m)', img: [['n_desk_03', '투시도 1'], ['n_desk_04', '투시도 2'], ['n_desk_07', '그래픽']], src: '02.로비 등록데스크 제작승인서_1023' },
 { n: '02', c: 'r', t: '유인등록데스크 및 EMS', z: '로비 · B홀 앞 남쪽', p: [7.56, 4.4, 24.6], st: [2, 26.5], desc: '5 × 3 m. 등록데스크(관계자/단체관람객) · 응급의료', img: [['n_desk_08', '투시도'], ['n_desk_10', '그래픽']], src: '02.로비 등록데스크 제작승인서_1023' },
 { n: '01', c: 'r', t: '다목적홀 입구게이트', z: '로비 · C홀 앞 → 다목적홀1', p: [-47.35, 5.8, 21.75], st: [-53, 17], desc: '폭 13.6 m · 높이 4 m, 안쪽 벽 9 m. 가운데 칸막이로 입구 IN / 출구 OUT, 안쪽 현황판 · 2025 CO-SHOW 사진 그래픽', img: [['n_hallgate_03', '투시도 1'], ['n_hallgate_04', '투시도 2'], ['n_hallgate_06', '앞면 치수'], ['n_hallgate_07', '안쪽 B면'], ['n_hallgate_08', '안쪽 C면']], src: '01.로비 입구게이트(다목적홀) 구조물 제작승인서_1027' },
 { n: '05', c: 'r', t: '로고 조형물', z: '로비 · C홀 / GATE 4 쪽', p: [-57.1, 3.8, 15], st: [-51.5, 15.5], desc: '3.65 × 2.4 × 0.7 m. 앞면 거울 마감 CO SHOW 글자', img: [['n_logo_03', '투시도'], ['n_logo_04', '치수']], src: '05.로비 로고조형물 제작승인서_1019' },
 { n: '06', c: 'r', t: '구 LED · 코아이 공기인형', z: '전시장 · 한가운데', p: [0, 9.2, CZ], st: [0, -21], desc: '구 LED 전광판 Φ3 m(받침 Φ4.8 m), 위에 코아이 공기인형', img: [['n_rest_03', '투시도 1'], ['n_rest_04', '투시도 2'], ['n_floor_01', '바닥동선 투시도'], ['n_rest_02', '배치도']], src: '06.내부 휴게공간 제작승인서_1026' },
 { n: '06', c: 'r', t: '파레트 휴게공간', z: '전시장 · 구 LED 양옆', p: [-10.7, 3.2, CZ], more: [[10.7, 3.2, CZ]], st: [-18.5, CZ], desc: '8.8 × 6.6 m, 파레트 1 ~ 7단 계단(높이 1.05 m, 칸별 단수 · 파란 파레트는 승인서 9쪽 그대로) + 빈백 40개', img: [['n_rest_05', '투시도'], ['n_rest_09', '치수']], src: '06.내부 휴게공간 제작승인서_1026' },
 { n: '06', c: 'r', t: '파레트 타워', z: '전시장 · 가운데 줄', p: [-31, 5, CZ], more: [[31, 5, CZ]], st: [-25, CZ], desc: '1.4 × 1.1 × 3.3 m. 남 · 북 = 기둥 그래픽 0.84 × 1.47 m, 동 · 서 = 65인치 LED TV 세로', img: [['n_rest_06', '투시도'], ['n_rest_10', '치수']], src: '06.내부 휴게공간 제작승인서_1026' },
 { n: '06', c: 'r', t: '현위치 현황판 · 휴게 가구', z: '전시장 · 가운데 줄 양끝', p: [-53.5, 3.2, CZ], more: [[53.5, 3.2, CZ]], st: [-47.5, CZ], desc: '현황판 0.9 × 1.78 m A형(면이 남 · 북, 그래픽 = 행사 지도 + 체험교육 목록). 주사위스툴 검정 40 · 흰색 40, 벤치 16 (가구 자리는 그림 보고 대략)', img: [['n_rest_07', '투시도'], ['n_rest_12', 'Furniture Plan']], src: '06.내부 휴게공간 제작승인서_1026' },
 { n: '1', c: 'y', t: '2층 난간 현수막', z: '로비 · 2층 난간 5곳', p: [61.4, 8.6, RAIL_Z], more: [[24.6, 8.6, RAIL_Z], [14.9, 8.6, RAIL_Z], [-14.7, 8.6, RAIL_Z], [-26, 8.6, RAIL_Z]], st: [40, 25], desc: '13 × 3.5 m 1개 · 4.3 × 3.5 m 1개 · 6 × 3.5 m 3개(코아이 길 안내 2개)', img: [['n_env_03', '1 (13 m)'], ['n_env_04', '1-2 · 1-3'], ['n_env_05', '1-4 · 1-5 (길 안내)'], ['n_env_02', '배치도']], src: '00.환경장식물 제작승인서_1022' },
 { n: '2', c: 'y', t: '2층 난간 가랜드', z: '로비 · 2층 난간', p: [5, 8.2, RAIL_Z], more: [[45, 8.2, RAIL_Z]], st: [5, 25], desc: '가랜드 0.35 × 0.425 m', img: [['n_env_06', '가랜드'], ['n_garland_01', '가랜드 시공 건 (10. 16.)']], src: '00.환경장식물 제작승인서_1022 · 가랜드 시공 건_1016' },
 { n: '3', c: 'y', t: '에스컬레이터 옆면 돔보컷팅', z: '로비 · 에스컬레이터 · 2층 유리난간', p: [-31, 7.4, 24], more: [[32, 7.4, 23]], st: [-31, 29], desc: '원고 재요청 (승인서 10. 22. 기준)', img: [['n_env_07', '설치 위치']], src: '00.환경장식물 제작승인서_1022' },
 { n: '4', c: 'y', t: '외벽 배너 (2번 게이트)', z: '외부 · GATE 2 쪽', p: [94, 13.5, 0], st: [113, 2], desc: '7 × 6 m 2개', img: [['n_env_08', '2번 게이트 외벽 배너']], src: '00.환경장식물 제작승인서_1022' },
 { n: '5', c: 'y', t: '외벽 배너 (4번 게이트)', z: '외부 · GATE 4 쪽', p: [-75, 13.5, 24.8], st: [-86, 24.8], desc: '7 × 6 m 1개', img: [['n_env_09', '4번 게이트 외벽 배너']], src: '00.환경장식물 제작승인서_1022' },
 { n: '6', c: 'y', t: '빵빠레 배너', z: '로비 · 2층 난간 전체', p: [-40, 7.8, RAIL_Z], more: [[40, 7.8, RAIL_Z]], st: [-40, 25], desc: '0.6 × 0.9 m (2종 5조 · 4조)', img: [['n_env_10', '빵빠레 배너']], src: '00.환경장식물 제작승인서_1022' },
 { n: '7', c: 'y', t: '로비 기둥 현수막', z: '로비 · 기둥 9개', p: [12.1, 8.4, colZ(12.1)], more: [[-35.9, 8.4, colZ(-35.9)], [48.1, 8.4, colZ(48.1)]], st: [12.1, 27], desc: '2.5 × 4.5 m 9개 · 10. 28. 기둥 싸바리 시안 목업 (한 바퀴 네 면)', img: [['n_env_11', '로비 기둥 현수막'], ['n_env_02', '배치도']], src: '00.환경장식물 제작승인서_1022' },
 { n: '8', c: 'y', t: '전시장 내부 트러스 배너', z: '전시장 · 가운데 줄', p: [-25.75, 10, CZ], more: [[25.75, 10, CZ]], st: [-38, CZ], desc: '1.2 × 3 m 20개 · 6 m 간격', img: [['n_env_12', '트러스 배너 20개']], src: '00.환경장식물 제작승인서_1022' },
 { n: '●', c: 'c', t: '바닥 동선', z: '전시장 · 마름모 통로', p: [-40, 2.4, -32.7], st: [-30, CZ], desc: '바닥 이정표 파이텍스 64 × 1 m 4줄(분야 5줄 · 부스 원 + 화살표) · 꼭짓점 파이텍스 2 × 2 m 4개(A ~ D)', img: [['n_floor28_persp', '투시도 (10. 28.)'], ['n_floor28_layout', '바닥 이정표 배치 (10. 28.)'], ['n_floor28_strip', '띠 그래픽 ① ~ ④'], ['n_floor28_sign', '꼭짓점 이정표 A ~ D']], src: '06.내부 휴게공간_내부 바닥동선 제작승인서_1028' },
 { n: '●', c: 'c', t: '컨소시엄 부스 18개', z: '전시장 A · B · C홀', p: [36, 5.5, -45], st: [36, CZ], desc: '18개 컨소시엄 부스 자리 · 크기 (실측 도면, 부스마다 약 350 ㎡). 18곳 모두 부스 시안(1027) 보고 3D로 지음 (인공지능 · 첨단소재나노융합은 10. 30. 새 시안으로 다시 지음)', img: [['n_floor_02', '부스 순서 · 바닥 이정표']], src: '부스 순서: 바닥동선_1022 · 크기: 0915-1 사이즈실측' },
 { n: '●', c: 'c', t: '코아이 공기인형 1', z: '로비 밖 · GATE 1 앞 광장', p: [98.6, 5.8, 28.8], st: [107, 22], desc: '앉아서 두 손으로 얼굴 가림 · 분홍 리본 · 콘센트 220V 1구 (높이 5 m는 10. 28. 기준, 승인서에 높이 없음)', img: [['n_coai_01', '승인서 투시도 (공기인형 1)'], ['n_coai_lay', '승인서 배치도 (3EA)']], src: '08.로비 코아이 공기인형 제작승인서_1023' },
 { n: '●', c: 'c', t: '코아이 공기인형 2', z: '로비 · 에스컬레이터 앞 기둥 옆', p: [22.2, 3.6, 21.0], st: [22.2, 13.5], desc: '서서 한 손 OK · 빨간 목도리 + 망토 · 콘센트 220V 1구 (높이 3 m는 10. 28. 기준)', img: [['n_coai_02', '승인서 투시도 (공기인형 2)'], ['n_coai_lay', '승인서 배치도 (3EA)']], src: '08.로비 코아이 공기인형 제작승인서_1023' },
 { n: '●', c: 'c', t: '코아이 공기인형 3 + 휴게공간', z: '로비 · 서쪽 끝 (GATE 4 쪽)', p: [-65.9, 5.8, 25.7], st: [-56, 19.5], desc: '10 × 8.5 m 회색 카펫 · 디자인유리세트 SET 04 6세트 · 공기인형 3(공기인형 1과 같은 모양) · 콘센트 220V 1구', img: [['n_coai_03', '승인서 투시도 (공기인형 3 + 휴게공간)'], ['n_coai_plan', '승인서 전기 · 집기도면'], ['n_coai_lay', '승인서 배치도 (3EA)']], src: '08.로비 코아이 공기인형 제작승인서_1023' },
 { n: '●', c: 'c', t: '지자체 부스', z: '로비 · B → C홀 사이', p: [-17.8, 4.4, 9.2], st: [-17.8, 16], desc: '1027 배치도 「광주시 지자체부스」 6 × 3 m 자리 · 꾸밈 시안은 없음', img: [['n_expogate_02', '1027 배치도']], src: '1027 배치도 · 공간조성계획_1015' },
 { n: '●', c: 'c', t: '다목적홀1 · 공식행사장 무대', z: '다목적홀1 · 개막식 · 11. 19. 발표회 · 시상식', p: [-58, 7.5, 56.3], st: [-40, 57], desc: '기존무대 H 900 · 18,280 × 5,630 위 LED-C 12,000 × 4,000. 레이어 타워(2,070 각) 무대 뒤 9 · 둘레 줄 높이 2 · 4 · 6 · 8 m. 무대 둘레 LED 2,000 × 3,000 넷 · 5,000 × 1,000 하나 · 콘솔 뒤 5,000 × 3,000. 객석 접이식 검정 350 · 가운데 통로 2 m', img: [['n_mh_stageplan', '무대 평면 (이충응 팀장 10. 23.)'], ['n_mh_stage', 'A 입면 · LED-C'], ['n_mh_rental', '렌탈 물자 배치(안) v3 (10. 28.)']], src: '2026 CO-SHOW stage-1023.pdf · 다목적홀1 렌탈 물자 배치(안) v3' },
 { n: '●', c: 'c', t: '다목적홀1 콘솔 · 운영석', z: '다목적홀1 · 객석 뒤 (D)', p: [-26, 3, 55.5], st: [-31, 55.5], desc: '단 위 운영 · 조명 · 특효 · 음향 · 영상 데스크, 앞 테이블 7 · 의자 14 · 복합기 · 노트북 2. 오른쪽 아래 = 메달 비행 공기조형물 대기 자리', img: [['n_mh_rental', '렌탈 물자 배치(안) v3 ⑥'], ['n_mh_stageplan', '무대 평면 D']], src: '다목적홀1 렌탈 물자 배치(안) v3 (10. 28.)' },
 { n: '●', c: 'c', t: '다목적홀2 · 세미나장 (경진대회 3구역)', z: '다목적홀2', p: [-6.25, 6.5, 57], st: [-6.25, 47], desc: '가벽으로 나눈 경진대회 공간. 이차전지 12 × 16 m(북서) · 미래자동차 B AUTO HACK 12 × 12 m(남서) · 미래자동차 A AUTO RACE 14 × 24 m(동) · 가운데 통로 5 m. 방 안 가구는 10. 21. 3D 그림을 옮긴 대략', img: [['n_mh_hall2_1', '다목적홀2 레이아웃 3D (10. 21.)'], ['n_mh_hall2_2', '통로 3D (10. 21.)']], src: '다목적홀2 컨소시엄 배치도 (전기 · 인터넷 배치 5 ~ 8쪽, 10. 29.) · 레이아웃 3D (10. 21.)' },
 { n: '●', c: 'c', t: '다목적홀 대기실 5곳', z: '로비 ↔ 다목적홀 사이', p: [-30, 4.2, 34.5], st: [-30, 28], more: [[-67, 4.2, 34.5], [-54.5, 4.2, 34.5], [-5.4, 4.2, 34.5], [10, 4.2, 34.5]], desc: '1 VIP 대기실-1 · 2 출연자대기실-2 · 3 주최자사무실 1(두 칸) · 4 주최자사무실 2 · 5 VIP 대기실-2(내빈 B). 렌탈 집기(테이블 · 의자 · 거울 · 행거 · 선반 · 스탠딩 TV)를 방마다 넣음. 일자별 쓰임은 대기실 배정 PPT v4 · v5 준비 중', img: [['n_mh_rooms', '대기실 도면 v3 (10. 14. 실측)'], ['n_mh_rental', '렌탈 물자 배치(안) v3 ⑧ ⑨ ⑩']], src: '다목적홀 대기실 일자별 배정 v4 · 렌탈 물자 목록 v6 (10. 29.)' },
];
function dotTex(label, color) {
  return canvasTex(128, 128, (g) => {
    g.fillStyle = color; g.beginPath(); g.arc(64, 64, 54, 0, Math.PI * 2); g.fill();
    g.lineWidth = 9; g.strokeStyle = '#fff'; g.stroke();
    if (label === '●') { g.fillStyle = '#fff'; g.beginPath(); g.arc(64, 64, 16, 0, Math.PI * 2); g.fill(); return; }
    g.font = `700 ${label.length > 1 ? 50 : 62}px ${FONT}`; g.fillStyle = color === '#f5b800' ? '#1a1a1a' : '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(label, 64, 68);
  });
}
const COLORS = { r: '#e8192c', y: '#f5b800', c: '#1b6dff' };
const sprites = [];
HOT.forEach((h, i) => {
  const t = dotTex(h.n, COLORS[h.c]);
  [h.p, ...(h.more || [])].forEach((p, k) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, sizeAttenuation: false, toneMapped: false }));
    s.scale.set(0.05, 0.05, 1); s.position.set(...p); s.renderOrder = 10; s.userData = { hot: i, extra: k > 0 }; scene.add(s); sprites.push(s);
    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, p[1], 6), new THREE.MeshBasicMaterial({ color: COLORS[h.c] })); pin.position.set(p[0], p[1] / 2, p[2]); scene.add(pin);
  });
});

/* ---------- 걷기 · 조감 조작 ---------- */
const controls = new OrbitControls(camera, renderer.domElement); controls.zoomToCursor = true;
controls.enableDamping = true; controls.maxPolarAngle = 1.48; controls.minDistance = 6; controls.maxDistance = 420;
const far = (t, p) => { const k = innerWidth / innerHeight < 1 ? 1.75 : 1; return t.map((v, i) => v + (p[i] - v) * k); };
controls.target.set(10, 0, 5); camera.position.set(...far([10, 0, 5], [58, 150, 132]));
let mode = 'bird';
const player = { x: 0, z: 18, yaw: 0, pitch: 0 };
const WALK = [[HALL.x0 + .5, HALL.x1 - .5, HALL.z0 + .5, -0.3], [GATES.C[0] + .5, GATES.C[1] - .5, -1, 8], [GATES.B[0] + .5, GATES.B[1] - .5, -1, 8], [GATES.A[0] + .5, GATES.A[1] - .5, -1, 8],
  [LOBBY.x0 + .5, LOBBY.x1 - .3, 7.3, 30.6], [-50.5, -43.5, 30, 39], [-2.5, 2.5, 30, 39], [MH.x0 + .7, MH.mid - .5, MH.z0 + .7, MH.z1 - .7], [MH.mid + .5, MH.x1 - .7, MH.z0 + .7, MH.z1 - .7], ...ROOMS.flatMap(r => [[r.x0 + .4, r.x1 - .4, RZ0 + .3, RZ1 - .3], [r.door - .5, r.door + .5, 30.2, RZ0 + .5]]), [LOBBY.x1 - 2, 128, -10, 60], [LOBBY.x0 - 15, LOBBY.x0 + 1, 10, 31]];
const walkable = (x, z) => WALK.some(([a, b, c, d]) => x >= a && x <= b && z >= c && z <= d);
const tw = { on: false };
function lookYawPitch(fx, fy, fz, tx, ty, tz) { const dx = tx - fx, dz = tz - fz, dy = ty - fy; return [Math.atan2(-dx, -dz), Math.atan2(dy, Math.hypot(dx, dz))]; }
function setMode(m) {
  if (m === mode) return; mode = m;
  document.getElementById('bBird').classList.toggle('on', m === 'bird'); document.getElementById('bWalk').classList.toggle('on', m === 'walk');
  walkOnly.visible = m === 'walk'; birdOnly.visible = m === 'bird';
  document.getElementById('joy').style.display = m === 'walk' && matchMedia('(pointer:coarse)').matches ? 'block' : 'none';
  scene.background.set(m === 'walk' ? 0xdfe8f2 : 0x9aa6ba);
  if (m === 'bird') { controls.enabled = true; rig.position.set(0, 0, 0); camera.position.set(player.x + 40, 90, player.z + 80); controls.target.set(player.x, 0, player.z); camera.rotation.set(0, 0, 0); }
  else { controls.enabled = false; const t = controls.target; let x = t.x, z = t.z; if (!walkable(x, z)) { x = 0; z = 18; } player.x = x; player.z = z; player.yaw = Math.PI; player.pitch = 0; applyWalkCam(); }
}
function applyWalkCam() { rig.position.set(player.x, 0, player.z); camera.position.set(0, 1.65, 0); camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ'); }
walkOnly.visible = false;
function goWalk(x, z, look, dur = 1.6, cb) {
  if (mode !== 'walk') setMode('walk');
  const s = { x: player.x, z: player.z, yaw: player.yaw, pitch: player.pitch };
  const [ty, tp] = look ? lookYawPitch(x, 1.65, z, ...look) : [player.yaw, 0];
  const dy = ((ty - s.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
  Object.assign(tw, { on: true, t0: performance.now(), dur: dur * 1000, f: (k) => { player.x = s.x + (x - s.x) * k; player.z = s.z + (z - s.z) * k; player.yaw = s.yaw + dy * k; player.pitch = s.pitch + (tp - s.pitch) * k; applyWalkCam(); }, cb });
}
function goBird(target, pos, dur = 1.4) {
  if (mode !== 'bird') setMode('bird');
  const t0 = controls.target.clone(), p0 = camera.position.clone(), t1 = new THREE.Vector3(...target), p1 = new THREE.Vector3(...far(target, pos));
  Object.assign(tw, { on: true, t0: performance.now(), dur: dur * 1000, f: (k) => { controls.target.lerpVectors(t0, t1, k); camera.position.lerpVectors(p0, p1, k); }, cb: null });
}
const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;

const ZONES = { all: [[10, 0, 5], [58, 150, 132]], lobby: [[10, 0, 19], [25, 70, 100]], expo: [[0, 0, -31], [0, 105, 55]], hall1: [[-43, 0, 57], [-8, 55, 108]], hall2: [[-4, 0, 57], [25, 48, 102]], b3: [[-38, 0, -13], [-34, 30, -46]] };   // b3 = 3D 부스 3곳 (주소 #b3)
const ZWALK = { lobby: [[44, 18], [0, 4, 13]], expo: [[0, -8], [0, 2, CZ]], hall1: [[-37, 57], [-63, 4, 57]], hall2: [[-6.25, 73], [-6.25, 3, 40]] };
document.querySelectorAll('#zones button').forEach(b => b.onclick = () => {
  document.querySelectorAll('#zones button').forEach(x => x.classList.remove('on')); b.classList.add('on'); stopTour();
  if (mode === 'walk' && b.dataset.z !== 'all') { const st = ZWALK[b.dataset.z]; goWalk(st[0][0], st[0][1], st[1]); }
  else goBird(...ZONES[b.dataset.z]);
});
document.getElementById('bBird').onclick = () => { stopTour(); setMode('bird'); };
document.getElementById('bWalk').onclick = () => { stopTour(); setMode('walk'); };

const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
let down = null; const keys = {};
renderer.domElement.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now(), lx: e.clientX, ly: e.clientY, id: e.pointerId }; hideHint(); if (tour.on && mode === 'walk') stopTour(); });
addEventListener('pointermove', e => {
  if (!down || e.pointerId !== down.id || mode !== 'walk' || joy.active === e.pointerId) return;
  const dx = e.clientX - down.lx, dy = e.clientY - down.ly; down.lx = e.clientX; down.ly = e.clientY;
  player.yaw += dx * 0.0045; player.pitch = Math.max(-1.2, Math.min(1.2, player.pitch + dy * 0.0035)); applyWalkCam();
});
addEventListener('pointerup', e => {
  if (!down || e.pointerId !== down.id) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t; down = null;
  if (moved < 8 && dt < 450 && e.target === renderer.domElement) tap(e.clientX, e.clientY);
});
const floorTargets = [];
scene.traverse(o => { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && Math.abs(o.rotation.x + Math.PI / 2) < 1e-3 && o.position.y < 0.2) floorTargets.push(o); });
booths.forEach(b => floorTargets.push(b.carpet));
function tap(cx, cy) {
  ndc.set(cx / innerWidth * 2 - 1, -(cy / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera);
  const hs = ray.intersectObjects(sprites.filter(s => s.visible));
  if (hs.length) return openHot(hs[0].object.userData.hot);
  const bp = ray.intersectObjects(picks), fl = ray.intersectObjects(floorTargets);
  if (mode === 'walk' && bp.length && !floorTargets.includes(bp[0].object) && bp[0].distance < 40) return openBooth(bp[0].object.userData);   // 걷기: 간판 · 시안판
  if (mode === 'walk' && fl.length) { const p = fl[0].point; if (walkable(p.x, p.z) && fl[0].distance < 60) { const d = Math.hypot(p.x - player.x, p.z - player.z); return goWalk(p.x, p.z, null, Math.min(2.2, 0.4 + d / 12)); } }
  if (bp.length && mode === 'bird') openBooth(bp[0].object.userData);
}
renderer.domElement.addEventListener('wheel', e => {                       // 걷기: 휠로 앞뒤 이동
  if (mode !== 'walk' || tw.on) return; e.preventDefault(); stopTour(); hideHint();
  const st = Math.max(-3, Math.min(3, -e.deltaY / 45)), sy = Math.sin(player.yaw), cy = Math.cos(player.yaw), nx = player.x - sy * st, nz = player.z - cy * st;
  if (walkable(nx, nz)) { player.x = nx; player.z = nz; applyWalkCam(); }
}, { passive: false });
addEventListener('keydown', e => keys[e.code] = true); addEventListener('keyup', e => keys[e.code] = false);
const joyEl = document.getElementById('joy'), knob = document.getElementById('knob'); const joy = { active: null, x: 0, y: 0 };
joyEl.addEventListener('pointerdown', e => { joy.active = e.pointerId; joyEl.setPointerCapture(e.pointerId); joyMove(e); e.stopPropagation(); stopTour(); });
joyEl.addEventListener('pointermove', e => { if (joy.active === e.pointerId) joyMove(e); });
const joyEnd = e => { if (joy.active !== e.pointerId) return; joy.active = null; joy.x = joy.y = 0; knob.style.left = knob.style.top = '38px'; };
joyEl.addEventListener('pointerup', joyEnd); joyEl.addEventListener('pointercancel', joyEnd);
function joyMove(e) { const r = joyEl.getBoundingClientRect(); let x = (e.clientX - r.left - r.width / 2) / 46, y = (e.clientY - r.top - r.height / 2) / 46; const l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } joy.x = x; joy.y = y; knob.style.left = 38 + x * 38 + 'px'; knob.style.top = 38 + y * 38 + 'px'; }

/* ---------- 정보 창 ---------- */
const sheet = document.getElementById('sheet'), bGo = document.getElementById('bGo'); let cur = null;
sheet.querySelector('.x').onclick = () => sheet.classList.remove('open');
const lb = document.getElementById('lb'); lb.onclick = () => lb.classList.remove('open');
function fillSheet(no, color, title, zone, desc, imgs, src) {
  const n = sheet.querySelector('.no'); n.textContent = no === '●' ? '' : no; n.style.background = color; n.style.display = no ? 'grid' : 'none';
  sheet.querySelector('h3').textContent = title; sheet.querySelector('.zone').textContent = zone; sheet.querySelector('.desc').textContent = desc;
  sheet.querySelector('.imgs').innerHTML = imgs.map(([f, c]) => `<figure><img src="${f.endsWith('.jpg') ? f : P + f + '.jpg'}" loading="lazy" alt=""><figcaption>${c}</figcaption></figure>`).join('');
  sheet.querySelector('.src').textContent = src || '';
  sheet.querySelectorAll('.imgs img').forEach(im => im.onclick = () => { lb.querySelector('img').src = im.src; lb.classList.add('open'); });
  bGo.style.display = cur ? '' : 'none';
  sheet.classList.add('open');
}
function openHot(i) { const h = HOT[i]; cur = { st: h.st, look: h.p }; fillSheet(h.n, COLORS[h.c], h.t, h.z, h.desc, h.img, '출처: ' + h.src); }
function openBooth(u) {
  cur = { st: u.stand, look: u.look };
  const bs = BS[u.name];
  const imgs = bs ? Array.from({ length: bs[1] }, (_, i) => [`img/b/${bs[0]}_${i + 1}.jpg`, `부스 시안 ${i + 1}`]) : [];
  imgs.push([`tiles/${String(u.tile).padStart(2, '0')}.jpg`, '컨소시엄 아이콘']);
  fillSheet('', '', u.name, '전시장 · 컨소시엄 부스', (bs ? `부스 시안 ${bs[1]}장 (옆으로 넘겨 보기). ` : '부스 시안 아직 없음 (1027 시안 폴더 기준). ') + '자리 순서는 바닥동선(10. 22.), 3D 부스는 자리 · 크기만 나타낸 모형', imgs, bs ? '출처: 컨소시엄 부스시안_1027 / ' + bs[2] : '출처: 바닥동선_1022');
}
bGo.onclick = () => { if (!cur) return; sheet.classList.remove('open'); stopTour(); goWalk(cur.st[0], cur.st[1], cur.look, 2.2); };
document.getElementById('bGal').onclick = () => {
  cur = null;
  const G = [['n_env_02', '로비 환경장식물 배치도 (10. 22.)'], ['n_maingate_03', '메인게이트'], ['n_maingate_09', '메인게이트 깃발'], ['n_lounge_03', '선수단 라운지 1'], ['n_lounge_07', '선수단 라운지 2'], ['n_expogate_03', '전시장 입구게이트 A홀'], ['n_expogate_06', '전시장 입구게이트 B홀'], ['n_expogate_09', '전시장 입구게이트 C홀'], ['n_desk_03', '안내데스크 및 무인등록데스크'], ['n_desk_08', '유인등록데스크 및 EMS'], ['n_hallgate_03', '다목적홀 입구게이트'], ['n_logo_03', '로고 조형물'], ['n_env_03', '2층 난간 현수막'], ['n_env_06', '2층 난간 가랜드'], ['n_env_08', '외벽 배너 (2번 게이트)'], ['n_env_09', '외벽 배너 (4번 게이트)'], ['n_env_10', '빵빠레 배너'], ['n_env_12', '트러스 배너'], ['n_rest_03', '전시장 구 LED · 코아이'], ['n_rest_05', '파레트 휴게공간'], ['n_rest_06', '파레트 타워'], ['n_rest_07', '현위치 현황판'], ['n_rest_12', 'Furniture Plan'], ['n_floor_01', '바닥 동선'], ['n_floor_02', '바닥 이정표 배치'],
    ['r16_all1', '전체 조감 1 (이전 시안)'], ['r17_all2', '전체 조감 2 (이전 시안)'], ['r18_top', '위에서 본 배치 (이전 시안)'], ['r15_hallbird', '다목적홀 조감 (이전 시안)'], ['r06_3', '다목적홀 무대 (이전 시안)'], ['r06_1', '다목적홀 라운지 (이전 시안)'], ['r14_seminar1', '경진대회 D · E Hall (이전 시안)']];
  fillSheet('', '', '시안 모아보기', '1027 전시장 시안 + 이전 시안', '누르면 크게 보여요', G, '출처: ' + S27 + ' · 99.전시장시안/전체 수정');
};

/* ---------- 컨소시엄 바로 가기 ---------- */
{ const sel = document.getElementById('selB');
  [...booths].sort((a, b) => a.tile - b.tile).forEach(b => { const o = document.createElement('option'); o.value = b.name; o.textContent = b.name; sel.appendChild(o); });
  sel.onchange = () => {
    const b = booths.find(x => x.name === sel.value); sel.value = ''; sel.blur(); if (!b) return;
    const top = b.pts[0][1] < -50, fx = (b.pts[2][0] + b.pts[3][0]) / 2, fz = (b.pts[2][1] + b.pts[3][1]) / 2, dir = top ? 1 : -1;   // 위줄은 통로가 +z, 아랫줄은 −z
    let z = fz + 4.5 * dir; for (const o of [4.5, 3.5, 5.5, 2.5]) { if (walkable(fx, fz + o * dir)) { z = fz + o * dir; break; } }
    stopTour(); goWalk(fx, z, [fx, 2.2, fz - 9 * dir], 2.2); showCap(b.name + ' 부스', '컨소시엄 바로 가기');
  }; }
const placeMini = () => {                                                      // 미니맵은 단추 묶음 바로 아래, 폰에선 자막도 그 아래
  const mini = document.getElementById('mini'), y = document.getElementById('modes').getBoundingClientRect().bottom + 8; mini.style.top = y + 'px';
  document.getElementById('cap').style.top = innerWidth > 600 ? '' : (y + mini.offsetHeight + 8) + 'px'; };
placeMini(); addEventListener('resize', placeMini);

/* ---------- 화질 바꾸기 (다시 불러옴) ---------- */
[['qLow', 'low'], ['qHigh', 'high']].forEach(([id, n]) => { const b = document.getElementById(id); b.classList.toggle('on', Q === n);   // 지금 화질 = 흰 단추
  b.onclick = () => { if (Q === n) return; try { localStorage.setItem('cvr_q', n); } catch (e) {} const u = new URL(location.href); u.searchParams.set('q', n); location.replace(u.href); }; });
/* ---------- 전시장 조명 켜기 · 끄기 ---------- */
let hallBright = false;
document.getElementById('bLight').onclick = () => {
  hallBright = !hallBright;
  HALLM.forEach(([m, k]) => { m.envMap = hallBright ? null : blueEnv; m.envMapIntensity = hallBright ? Math.min(1, k * 3) : k; m.needsUpdate = true; });
  HALLB.forEach(m => m.color.setScalar(hallBright ? 1 : 0.4)); HALLFX.forEach(o => o.visible = !hallBright);
  document.getElementById('bLight').textContent = hallBright ? '🌙 행사 조명' : '💡 전시장 조명 켜기';
};
if (/light/.test(location.search)) document.getElementById('bLight').click();   // 주소에 ?light → 밝게 시작

/* ---------- 자동 투어 ---------- */
const TOUR = [
  [[104, MG.cz], [MG.cx + 5, 3, MG.cz], 'GATE 1 · 2 → 메인게이트(COSS GATE)', '04 메인게이트'],
  [[85, MG.cz], [MG.cx + 0.8, 2.2, MG.cz], '메인게이트 · 키네틱 LED', '깃발 18개 · CO-SHOW 네온'],
  [[66, 16.5], [66, 1.2, 25], '선수단 라운지 1 · AD카드 배부처', '03 선수단 라운지'],
  [[GC.A, 17], [GC.A, 2.5, 6], '전시장 A홀 입구게이트', '01 입구게이트'],
  [[30, 18], [0, 6, 13.5], '로비 — 2층 난간 현수막 · 가랜드 · 빵빠레', '환경장식물 1 · 2 · 6'],
  [[1.5, 26], [7.5, 1.6, 24.6], '유인등록데스크 및 EMS', '02 등록데스크'],
  [[4.5, 22.5], [0.2, 1.8, 18.6], '안내데스크 및 무인등록데스크', '02 등록데스크'],
  [[-3, 14.5], [0, 2.5, 5], '전시장 B홀 입구게이트', '01 입구게이트'],
  [[0, -8], [0, 2, CZ], '전시장 — 18개 컨소시엄 부스', '바닥 동선 · 트러스 배너'],
  [[0, -21], [0, 3.5, CZ], '구 LED · 코아이 공기인형', '06 내부 휴게공간'],
  [[-20, -28.5], [-10.7, 0.6, CZ], '파레트 휴게공간', '06 내부 휴게공간'],
  [[-19.5, -27.4], [-11.5, 2.4, -17.5], '지능형로봇 부스', 'LED 아치 · 4족 로봇 경기장 · 교육석'],
  [[-28.2, -33.5], [-28.2, 3.2, -17], '차세대반도체 부스', '북극곰 · LED 큐브 · VR 시뮬레이터 · MCU 경진대회'],
  [[-57.5, -31.8], [-63.5, 2.4, -19], '바이오헬스 부스', '곡선 간판 · 곡선 LED · 처방 데스크 · 세 센터 게이트'],
  [[GC.C, -4], [GC.C, 2.5, 10], '전시장 C홀 → 로비', ''],
  [[-51.5, 15.5], [-57.1, 1.4, 15], '로고 조형물', '05 로고 조형물'],
  [[-53, 17], [-46.5, 2.3, 25], '다목적홀 입구게이트', '입구 IN · 출구 OUT'],
  [[-47.35, 36], [-47.35, 2.5, 50], '다목적홀1 입구', ''],
  [[-37, 57], [-63, 4.2, 56.3], '다목적홀1 · 공식행사장', '레이어 타워 · LED-C 12 × 4 m · 객석 350 (무대 도면 10. 23.)'],
  [[-31, 55.5], [-25, 2.2, 55.5], '다목적홀1 콘솔 · 운영석', '렌탈 배치(안) v3 ⑥'],
  [[-6.25, 73], [-6.25, 3, 40], '다목적홀2 · 세미나장', '이차전지 · 미래자동차 A · B (컨소시엄 배치도 10. 29.)'],
  [[-30, 28], [-54.5, 2.2, 31], '다목적홀 대기실 5곳', 'VIP-1 · 출연자-2 · 주최자사무실 1 · 2 · VIP-2'],
];
const tour = { on: false, i: 0, timer: 0 };
const cap = document.getElementById('cap');
function showCap(t, s) { cap.innerHTML = t + (s ? `<small>${s}</small>` : ''); cap.style.display = 'block'; }
function stopTour() { if (!tour.on) return; tour.on = false; clearTimeout(tour.timer); cap.style.display = 'none'; document.getElementById('bTour').textContent = '▶ 자동 투어'; }
function tourStep() {
  if (!tour.on) return;
  if (tour.i >= TOUR.length) { stopTour(); goBird(...ZONES.all, 2.5); return; }
  const [p, l, t, s] = TOUR[tour.i++]; showCap(t, s);
  const d = Math.hypot(p[0] - player.x, p[1] - player.z);
  goWalk(p[0], p[1], l, tour.i === 1 ? 0.01 : Math.min(7, 1.5 + d / 9), () => { tour.timer = setTimeout(tourStep, 2600); });
}
document.getElementById('bTour').onclick = () => {
  if (tour.on) return stopTour();
  sheet.classList.remove('open'); tour.on = true; tour.i = 0; document.getElementById('bTour').textContent = '■ 투어 멈춤';
  setMode('walk'); tourStep();
};

/* ---------- 미니맵 ---------- */
const mini = document.getElementById('mini'), mg = mini.getContext('2d');
const ABBR = { '그린바이오': '그바', '에너지신산업': '에너지', '에코업': '에코업', '이차전지': '이차전지', '반도체소부장': '반소', '첨단소재나노융합': '첨단', '미래자동차': '미래차', '데이터보안활용융합': '데이터', '차세대통신': '차통', '사물인터넷': '사물', '바이오헬스': '바이오', '차세대디스플레이': '차디', '차세대반도체': '차반', '지능형로봇': '로봇', '항공드론': '드론', '실감미디어': '실감', '빅데이터': '빅데', '인공지능': '인공' };   // 미니맵 줄임말
const MB_ALL = { x0: -80, x1: 115, z0: -66, z1: 80 }, MB_HALL = { x0: -73, x1: 73, z0: -63, z1: 1.5 }, MB_MH = { x0: -75, x1: 19, z0: 29.5, z1: 77.5 }; let MB = MB_ALL;   // MB_MH = 다목적홀 · 대기실 안 (10. 30.)   // 전시장 안 = 전시장 크게
const m2 = (x, z) => [(x - MB.x0) / (MB.x1 - MB.x0) * mini.width, (z - MB.z0) / (MB.z1 - MB.z0) * mini.height];
function rectM(x0, x1, z0, z1, c) { const [a, b] = m2(x0, z0), [d, e] = m2(x1, z1); mg.fillStyle = c; mg.fillRect(a, b, d - a, e - b); }
let MFS = {};                                                                  // 미니맵 글자 크기 (보기 범위마다 하나)
function miniFs() {
  const k = MB === MB_HALL ? 'h' : 'a'; if (MFS[k]) return MFS[k];
  MFS[k] = Math.min(...booths.map(b => { const ww = m2(b.pts[1][0], 0)[0] - m2(b.pts[0][0], 0)[0], len = Math.abs(m2(0, b.pts[0][1])[1] - m2(0, b.pts[3][1])[1]) * 0.9, t = ABBR[b.name] || b.name;
    return /^[A-Za-z]+$/.test(t) ? ww * 0.82 : Math.min(ww * 0.82, len / [...t].length); }));
  return MFS[k];
}
function drawMini() {
  mg.clearRect(0, 0, mini.width, mini.height);
  { const pz0 = mode === 'walk' ? player.z : controls.target.z, px0 = mode === 'walk' ? player.x : controls.target.x; MB = pz0 < 3 && Math.abs(px0) < 75 ? MB_HALL : pz0 > 31.2 && px0 < 18 ? MB_MH : MB_ALL; }
  rectM(HALL.x0, HALL.x1, HALL.z0, HALL.z1, '#3a4a8c'); rectM(LOBBY.x0, LOBBY.x1, LOBBY.z0, LOBBY.z1, '#cfd8e6'); rectM(MH.x0, MH.mid, MH.z0, MH.z1, '#c9b48d'); rectM(MH.mid, MH.x1, MH.z0, MH.z1, '#a9c2b4'); ROOMS.forEach(r => rectM(r.x0, r.x1, RZ0, RZ1, r.name.startsWith('VIP') ? '#e07a86' : '#e8a8b0'));
  booths.forEach(b => { mg.fillStyle = TILE_COL[b.tile - 1]; mg.beginPath(); b.pts.forEach(([x, z], i) => { const [u, v] = m2(x, z); i ? mg.lineTo(u, v) : mg.moveTo(u, v); }); mg.fill(); });
  booths.forEach(b => {                                                        // 부스 줄임말 (1~3글자, 한 글자씩 세로로)
    const cx = b.pts.reduce((a, p) => a + p[0], 0) / 4, cz = b.pts.reduce((a, p) => a + p[1], 0) / 4, [u, v] = m2(cx, cz), ww = m2(b.pts[1][0], 0)[0] - m2(b.pts[0][0], 0)[0];
    const len = Math.abs(m2(0, b.pts[0][1])[1] - m2(0, b.pts[3][1])[1]) * 0.9, t = ABBR[b.name] || b.name, lat = /^[A-Za-z]+$/.test(t), ch = lat ? [t] : [...t];
    const fs = miniFs();
    mg.font = `900 ${fs}px ${FONT}`; mg.fillStyle = '#fff'; mg.strokeStyle = 'rgba(0,0,0,.6)'; mg.lineWidth = Math.max(2, fs * 0.16); mg.lineJoin = 'round'; mg.textAlign = 'center'; mg.textBaseline = 'middle';
    ch.forEach((c, i) => { const y = v + (i - (ch.length - 1) / 2) * fs; mg.strokeText(c, u, y); mg.fillText(c, u, y); });
  });
  rectM(-61, -55.4, 47.2, 65.4, '#7a4b2a'); rectM(-26.8, -25, 48.3, 62.7, '#5a3b2a');       // 다목적홀1 무대 · 콘솔
  rectM(MH.mid + .25, -8.75, MH.z0, 53.6, '#86b09f'); rectM(MH.mid + .25, -8.75, 58.6, 70.6, '#86b09f'); rectM(-3.75, 10.25, 43.6, 67.6, '#6f9e8a');   // 다목적홀2 경진대회 3구역 (10. 29. 배치도)
  { const big = MB === MB_MH, lab = (t, x, z, f) => { const [u, v] = m2(x, z); mg.font = `900 ${f}px ${FONT}`; mg.textAlign = 'center'; mg.textBaseline = 'middle'; mg.lineWidth = Math.max(2, f * 0.2); mg.strokeStyle = 'rgba(0,0,0,.65)'; mg.fillStyle = '#fff'; mg.strokeText(t, u, v); mg.fillText(t, u, v); };
    const f = big ? 13 : 8;
    lab('다목적홀1', -42, big ? 69 : 57, f); lab('공식행사장', -42, big ? 72.5 : 64, f * 0.85);
    lab('다목적홀2', big ? 3 : -4, big ? 70.6 : 57, f); lab('세미나장', big ? 3 : -4, big ? 73.6 : 64, f * 0.85);
    if (big) [['이차전지', -14.75, 45.6], ['미래차 B', -14.75, 64.6], ['미래차 A', 3.25, 55.6]].forEach(([t, x, z]) => lab(t, x, z, 10));
    if (big) ROOMS.forEach(r => lab(String(r.no), (r.x0 + r.x1) / 2, (RZ0 + RZ1) / 2, 11)); }
  HOT.forEach(h => { if (h.c === 'c') return; [h.p, ...(h.more || [])].forEach(p => { const [x, y] = m2(p[0], p[2]); mg.fillStyle = COLORS[h.c]; mg.beginPath(); mg.arc(x, y, 3.5, 0, 7); mg.fill(); }); });
  const px = mode === 'walk' ? player.x : controls.target.x, pz = mode === 'walk' ? player.z : controls.target.z; const [x, y] = m2(px, pz);
  mg.save(); mg.translate(x, y);
  if (mode === 'walk') { mg.rotate(-player.yaw); mg.fillStyle = 'rgba(47,228,255,.35)'; mg.beginPath(); mg.moveTo(0, 0); mg.arc(0, 0, 26, -Math.PI / 2 - 0.55, -Math.PI / 2 + 0.55); mg.fill(); }
  mg.fillStyle = '#2fe4ff'; mg.strokeStyle = '#fff'; mg.lineWidth = 3; mg.beginPath(); mg.arc(0, 0, 7, 0, 7); mg.fill(); mg.stroke(); mg.restore();
}
mini.addEventListener('pointerup', e => {
  const r = mini.getBoundingClientRect(); const x = MB.x0 + (e.clientX - r.left) / r.width * (MB.x1 - MB.x0), z = MB.z0 + (e.clientY - r.top) / r.height * (MB.z1 - MB.z0);
  stopTour();
  if (mode === 'walk') { if (walkable(x, z)) goWalk(x, z, null, 1.2); }
  else goBird([x, 0, z], [x + 30, 70, z + 70]);
});

/* ---------- VR 기기 ---------- */
if (navigator.xr) navigator.xr.isSessionSupported('immersive-vr').then(ok => {
  if (!ok) return; const b = VRButton.createButton(renderer); b.style.position = 'static'; b.style.width = 'auto'; document.getElementById('vrslot').appendChild(b);
  renderer.xr.addEventListener('sessionstart', () => { stopTour(); setMode('walk'); camera.position.set(0, 0, 0); });
}).catch(() => {});

/* ---------- 돌리기 ---------- */
const hint = document.getElementById('hint'); let hintGone = false;
function hideHint() { if (hintGone) return; hintGone = true; hint.style.opacity = 0; setTimeout(() => hint.remove(), 700); }
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); if (composer) composer.setSize(innerWidth, innerHeight); });
let last = performance.now(), kinT = 0;
const perf = { n: 0, t0: 0, done: LOW };                                     // 고화질이 버거우면 (처음 8초 평균 20fps 미만) 저화질 권함
renderer.setAnimationLoop((now) => {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  if (!perf.done && !document.getElementById('load')) { if (!perf.t0) perf.t0 = now; perf.n++; if (now - perf.t0 > 8000) { perf.done = true; if (perf.n / 8 < 20) { const t = document.createElement('div'); t.textContent = '화면이 끊기면 오른쪽 위 🔅 저화질 단추를 눌러 보세요'; t.style.cssText = 'position:fixed;left:50%;top:70px;transform:translateX(-50%);background:rgba(11,20,64,.9);color:#fff;padding:10px 16px;border-radius:12px;font:600 14px ' + FONT + ';z-index:50'; document.body.appendChild(t); setTimeout(() => t.remove(), 7000); } } }
  if (tw.on) { const k = Math.min(1, (now - tw.t0) / tw.dur); tw.f(ease(k)); if (k >= 1) { tw.on = false; tw.cb && tw.cb(); } }
  if (mode === 'walk' && !tw.on && !renderer.xr.isPresenting) {
    const f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0) - joy.y, s = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0) + joy.x;
    if (keys.ArrowLeft) player.yaw += 1.6 * dt; if (keys.ArrowRight) player.yaw -= 1.6 * dt;
    if (f || s || keys.ArrowLeft || keys.ArrowRight) {
      const sp = (keys.ShiftLeft ? 22 : 12) * dt, sy = Math.sin(player.yaw), cy = Math.cos(player.yaw);
      const nx = player.x + (-sy * f + cy * s) * sp, nz = player.z + (-cy * f - sy * s) * sp;
      if (walkable(nx, nz)) { player.x = nx; player.z = nz; } else if (walkable(nx, player.z)) player.x = nx; else if (walkable(player.x, nz)) player.z = nz;
      applyWalkCam();
    }
  }
  if (mode === 'bird' && !tw.on) {
    const f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0), r = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
    if (f || r) { stopTour(); const d = camera.position.distanceTo(controls.target), sp = Math.max(8, d * 0.7) * dt, fw = new THREE.Vector3(); camera.getWorldDirection(fw); fw.y = 0; fw.normalize(); const rt = new THREE.Vector3(-fw.z, 0, fw.x), mv = fw.multiplyScalar(f * sp).add(rt.multiplyScalar(r * sp)); controls.target.add(mv); camera.position.add(mv); }
  }
  if (mode === 'bird') controls.update();
  KIN.forEach(m => { const [i, j] = m.userData.ij, a = kinW(i, j, kinT); m.position.z = 0.1 + 0.09 * Math.sin(a); m.rotation.x = 0.32 * Math.cos(a); });   // 키네틱 판 움직임
  kinT += dt; if (Math.floor(kinT * 12) !== Math.floor((kinT - dt) * 12)) drawKinetic(kinT);
  if (Math.floor(kinT * 4) !== Math.floor((kinT - dt) * 4)) drawSphere(kinT);
  if (Math.floor(kinT * 15) !== Math.floor((kinT - dt) * 15)) drawWave(kinT);
  HEADS.forEach(h => { h.g.rotation.z = Math.sin(kinT * 0.6 + h.ph) * 0.14; h.g.rotation.x = Math.cos(kinT * 0.45 + h.ph) * 0.1; });
  PIX.forEach((t, i) => t.offset.y = (kinT * 0.01 * (i % 3 + 1)) % 1);
  SPH.rotation.y += dt * 0.4;
  COAI.forEach((c, i) => c.rotation.z = Math.sin(now / 900 + i) * 0.03);
  FLY.position.y = 5.6 + Math.sin(now / 1100) * 0.25; FLY.rotation.y += dt * 0.15; coaiTurn();
  if (mode === 'walk') sprites.forEach(s => s.visible = Math.hypot(s.position.x - player.x, s.position.z - player.z) < 32); else sprites.forEach(s => s.visible = !s.userData.extra);   // 조감에선 같은 번호는 한 번만
  drawMini();
  if (composer && !renderer.xr.isPresenting) composer.render(); else renderer.render(scene, camera);
});
const hideLoad = () => { const l = document.getElementById('load'); if (l) { l.style.opacity = 0; setTimeout(() => l.remove(), 700); } };
manager.onLoad = hideLoad; setTimeout(hideLoad, 9000);
birdOnly.visible = true;
// 주소 끝 #t3 → 투어 3번째 자리, #expo → 구역 (공유·확인용)
(function () { const h = location.hash.slice(1);
  if (!h) { setMode('walk'); player.x = MG.cx + Math.min(18, Math.max(10, 3.8 / (Math.tan(camera.fov * Math.PI / 360) * camera.aspect))); player.z = MG.cz; [player.yaw, player.pitch] = lookYawPitch(player.x, 1.65, MG.cz, MG.cx + 0.8, 2.6, MG.cz); applyWalkCam(); return; }   // 처음 = 키네틱 LED 앞
  const m = h.match(/^t(\d+)$/);
  if (m && TOUR[+m[1]]) { const [p, l, t, s] = TOUR[+m[1]]; setMode('walk'); player.x = p[0]; player.z = p[1]; [player.yaw, player.pitch] = lookYawPitch(p[0], 1.65, p[1], ...l); applyWalkCam(); showCap(t, s); hideHint(); }
  else if (/^b=/.test(h)) { const sel = document.getElementById('selB'); sel.value = decodeURIComponent(h.slice(2)); sel.onchange(); }   // #b=부스이름 → 그 부스 앞으로
  else if (/^w=/.test(h)) { const [x, z, lx, ly, lz] = h.slice(2).split(',').map(Number); setMode('walk'); player.x = x; player.z = z; [player.yaw, player.pitch] = lookYawPitch(x, 1.65, z, lx, ly, lz); applyWalkCam(); hideHint(); }   // #w=서있는x,z,볼x,y,z
  else if (/^o=/.test(h)) { const [tx, ty, tz, cx, cy, cz] = h.slice(2).split(',').map(Number); controls.target.set(tx, ty, tz); camera.position.set(cx, cy, cz); }   // #o=볼곳x,y,z,카메라x,y,z
  else if (ZONES[h]) { controls.target.set(...ZONES[h][0]); camera.position.set(...far(...ZONES[h])); }
})();
