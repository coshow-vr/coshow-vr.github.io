/* 차세대반도체 부스 — 새 시안 24장(첨부/2026-10-29 101924_1~24) 보고 처음부터 다시 지음 (10. 29. 담당자 "곰 디테일 살려 달라")
   평면 22번(위에서 본 그림, 1333×2000)의 픽셀을 부스 좌표로 옮김. 평면 위 = 뒤(전시장 벽), 평면 아래 = 앞선.
   앞(파란 바닥) = 북극곰 · 빙하 · 현미경 책상 5 · 육각 키오스크(VR 시뮬레이터) · 매다는 LED 큐브
   가운데 = 머리 간판(앞뒤 같은 글자) + 가운데 벽(앞 POLARIS 화면 · 뒤 MCU 경진대회) · 휴게 · 회의실
   뒤(검정 바닥) = MCU 경진대회 팀 부스 12 · 뒷벽 LED(북극곰) */
let MC = null;                                                                   // 곰 몸은 마칭큐브로 매끈하게 (못 받으면 단순 곰)
try { ({ MarchingCubes: MC } = await import('three/addons/objects/MarchingCubes.js')); } catch (e) {}

export default ({ THREE, M, E, GLOW, canvasTex, B3, boothKit, CHAIR, BEAN, FONT, LOW, truss, figure }) => ({
  '차세대반도체'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr;
    const X = px => (px - 674) / 69.3 * (W / 7.88), Z = py => (py - 1622) / 1467 * D;   // 평면 픽셀 → 부스 좌표
    const box = (w, h, d, m, x, z, y0 = 0, p = g) => k.box(w, h, d, m, x, z, y0, p);
    const T = (c, t, x, y, f, col, al = 'left') => { c.font = f; c.fillStyle = col; c.textAlign = al; c.textBaseline = 'middle'; c.fillText(t, x, y); };
    const hash = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };

    // ---------- 재질 ----------
    const blk = M(0x15171d, { roughness: .45 }), blk2 = M(0x0c0d11, { roughness: .6 }), blu = E(0x2a9bff, 2.6);
    const wht = M(0xf4f6fa, { roughness: .45, emissive: 0x5c626c, emissiveIntensity: .55 });
    const navy = M(0x101a4a, { roughness: .5 }), gry = M(0x8d939d, { roughness: .35, metalness: .5 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x1b1f27, roughness: .08, metalness: .2, transparent: true, opacity: .62, envMapIntensity: .8 });
    const rug = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#1846c8'; c.fillRect(0, 0, w, h); for (let i = 0; i < 5000; i++) { c.fillStyle = Math.random() < .5 ? 'rgba(120,170,255,.18)' : 'rgba(5,20,80,.28)'; c.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } });
    rug.wrapS = rug.wrapT = THREE.RepeatWrapping; rug.repeat.set(8, 12);
    carpet.material = M(0xffffff, { map: rug, roughness: .95 });
    const blackRug = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#121317'; c.fillRect(0, 0, w, h); for (let i = 0; i < 4000; i++) { c.fillStyle = `rgba(${Math.random() < .5 ? '90,95,110' : '0,0,0'},.22)`; c.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); } });
    blackRug.wrapS = blackRug.wrapT = THREE.RepeatWrapping; blackRug.repeat.set(6, 6);
    const bfl = M(0xffffff, { map: blackRug, roughness: .9 });
    const circ = (w, h, chip = false, seed = 1) => canvasTex(w, h, (c) => {      // 회로 기판 LED 그래픽 (시안 벽 LED)
      const bg = c.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#020a2c'); bg.addColorStop(.5, '#06227a'); bg.addColorStop(1, '#020a2c'); c.fillStyle = bg; c.fillRect(0, 0, w, h);
      let s = seed; const R = () => (s = (s * 9301 + 49297) % 233280) / 233280;
      c.lineCap = 'round'; c.shadowColor = '#2fa8ff'; c.shadowBlur = 8;
      for (let i = 0; i < w / 9; i++) {
        let x = R() * w, y = R() * h; c.strokeStyle = `rgba(${80 + R() * 60},${170 + R() * 60},255,${.45 + R() * .45})`; c.lineWidth = 1.5 + R() * 2; c.beginPath(); c.moveTo(x, y);
        for (let j = 0; j < 3; j++) { const L = 20 + R() * h * .5; if (R() < .5) x += (R() < .5 ? -1 : 1) * L; else { const d = (R() < .5 ? -1 : 1) * L; x += d; y += d * (R() < .5 ? 1 : -1) * .6; } c.lineTo(x, y); }
        c.stroke(); c.fillStyle = '#9fe0ff'; c.beginPath(); c.arc(x, y, 3 + R() * 3, 0, 7); c.fill();
      }
      if (chip) { const cx = w / 2, cy = h / 2, r = h * .28; c.strokeStyle = '#7ff0ff'; c.lineWidth = h * .025; c.shadowBlur = 22; c.beginPath(); for (let i = 0; i < 8; i++) { const a = Math.PI / 8 + i * Math.PI / 4; c[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * r, cy + Math.sin(a) * r); } c.closePath(); c.stroke(); c.fillStyle = 'rgba(2,10,44,.85)'; c.fill(); }
      c.shadowBlur = 0;
    });
    const chipIcon = (c, x, y, s, col) => {                                       // 머리 간판 앞 칩 아이콘
      c.save(); c.translate(x, y); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = s * .07; c.shadowColor = col; c.shadowBlur = s * .25;
      c.strokeRect(-s * .3, -s * .3, s * .6, s * .6); c.strokeRect(-s * .14, -s * .14, s * .28, s * .28);
      for (let i = -1; i <= 1; i++) [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([a, b]) => {
        const o = i * s * .17, x0 = a ? a * s * .3 : o, y0 = b ? b * s * .3 : o, x1 = a ? a * s * .46 : o + (i ? i * s * .05 : 0), y1 = b ? b * s * .46 : o + (i ? i * s * .05 : 0);
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.beginPath(); c.arc(x1, y1, s * .045, 0, 7); c.stroke(); });
      c.restore();
    };

    // ---------- 바닥: 파란 카펫(앞) · 가운데 검정 통로 · 뒤 검정 ----------
    const ZH0 = Z(1150), ZH1 = Z(1085);                                           // 머리 간판 띠 앞면 · 뒷면
    k.flat(bfl, -W, W, -D, ZH1 + 0.02);
    k.flat(bfl, X(550), X(800), ZH0 - 0.02, 0.0);

    // ---------- 머리 간판 (앞뒤 같은 글자) + 양끝 기둥 + 파란 빛줄 ----------
    const hd = canvasTex(2048, 150, (c, w, h) => {
      c.fillStyle = '#121419'; c.fillRect(0, 0, w, h);
      chipIcon(c, 118, 72, 104, '#3fd6ff');
      c.shadowColor = '#22c8ff'; c.shadowBlur = 20; T(c, '차세대반도체', 180, 58, `900 84px ${FONT}`, '#5fe6ff'); c.shadowBlur = 0;
      T(c, 'Next Generation Semiconductor', 184, 122, `700 30px ${FONT}`, '#ffffff');
      c.shadowColor = '#22c8ff'; c.shadowBlur = 14; c.fillStyle = '#3fd6ff'; c.fillRect(720, 70, 690, 7); c.fillRect(1900, 70, 120, 7); c.shadowBlur = 0;
      T(c, '차세대반도체 혁신융합대학 사업단', 1880, 32, `600 30px ${FONT}`, '#fff', 'right');
      T(c, 'POLARIS', 1880, 100, `italic 900 84px Georgia,serif`, '#fff', 'right');
    });
    box(2 * W + 0.5, 1.15, ZH0 - ZH1, blk, 0, (ZH0 + ZH1) / 2, 3.6);
    k.pl(GLOW(hd, 1.05), 2 * W - 0.4, 1.0, 0, 4.17, ZH0 + 0.01);
    k.pl(GLOW(hd, 1.05), 2 * W - 0.4, 1.0, 0, 4.17, ZH1 - 0.01, Math.PI);
    [-1, 1].forEach(s => {
      k.bxz(s * W - 0.3, s * W + 0.25, ZH1, ZH0, 4.75, blk);
      [ZH0 + 0.02, ZH1 - 0.02].forEach(z => { box(0.05, 3.6, 0.03, blu, s * (W - 0.33), z); box(0.05, 0.05, 0.03, blu, s * (W - 0.33), z, 3.58); });
    });
    [ZH0 + 0.02, ZH1 - 0.02].forEach(z => box(2 * W - 0.6, 0.04, 0.03, blu, 0, z, 3.6));

    // ---------- 가운데 벽: 앞 = 로고 + POLARIS 화면 + 안내데스크 / 뒤 = MCU 경진대회 + INFORMATION ----------
    k.bxz(-1.55, 1.55, ZH1 + 0.08, ZH0 - 0.08, 3.6, blk);
    const logo = canvasTex(1024, 256, (c, w, h) => { chipIcon(c, 150, 128, 150, '#ffffff'); T(c, '차세대반도체', 250, 110, `900 112px ${FONT}`, '#fff'); T(c, 'Next Generation Semiconductor', 254, 196, `600 40px ${FONT}`, '#fff'); });
    k.pl(GLOW(logo, 1.0, { transparent: true }), 2.6, 0.65, 0, 3.05, ZH0 - 0.07);
    k.pl(GLOW(B3('semi2_tv'), 1.05), 2.5, 1.31, 0, 2.0, ZH0 - 0.07);
    { const z = Z(1238);
      const face = canvasTex(1024, 420, (c, w, h) => {                            // 인피니티 미러처럼 안쪽으로 겹친 파란 테 + POLARIS
        c.fillStyle = '#05060a'; c.fillRect(0, 0, w, h);
        for (let i = 0; i < 7; i++) { const m = 12 + i * 22; c.strokeStyle = `rgba(60,150,255,${.95 - i * .13})`; c.lineWidth = 6 - i * .6; c.setLineDash([10, 10]); c.strokeRect(m, m, w - 2 * m, h - 2 * m); }
        c.setLineDash([]); T(c, '차세대반도체 혁신융합대학 사업단', w / 2, h * .36, `600 34px ${FONT}`, '#fff', 'center'); T(c, 'POLARIS', w / 2, h * .58, `italic 900 120px Georgia,serif`, '#fff', 'center');
        T(c, 'INFORMATION', w * .86, h * .17, `700 22px ${FONT}`, '#fff', 'center');
      });
      box(2.4, 1.0, 0.7, blk, 0, z); k.pl(GLOW(face, 1.0), 2.36, 0.96, 0, 0.5, z + 0.355);
      box(2.44, 0.04, 0.74, gry, 0, z, 1.0);
      k.inst(new THREE.BoxGeometry(0.36, 0.24, 0.02), M(0x14161c), [[-0.6, 1.17, z - 0.15], [0.5, 1.17, z - 0.15]]);
    }
    k.pl(GLOW(B3('semi2_mcu'), 1.0), 2.9, 1.49, 0, 2.55, ZH1 + 0.07, Math.PI);
    { const z = Z(1020);
      box(1.9, 1.05, 0.75, blk, 0.4, z); box(1.94, 0.04, 0.79, gry, 0.4, z, 1.05);
      box(0.95, 1.0, 0.6, blk, -1.05, z); { const t = k.txt(['INFORMATION'], 0.7, 0.12, { fg: '#fff', size: 120 }, 1); t.position.set(-1.05, 0.8, z - 0.31); t.rotation.y = Math.PI; g.add(t); }
      k.inst(new THREE.BoxGeometry(0.5, 0.32, 0.03), E(0x2a6dff, .9), [[0, 1.3, z + 0.2], [0.75, 1.3, z + 0.2]]);
      box(0.45, 0.25, 0.4, M(0xd8dce3), 1.0, z + 0.05, 1.07);                   // 프린터
    }

    // ---------- 앞 왼쪽 벽: 회로 LED (앞 낮은 벽 · 옆 벽) ----------
    const circM = GLOW(B3('semi2_circ'), 1.0), circW = GLOW(circ(1024, 256, false, 7), 1.0);
    { const x1 = X(310); box(x1 + W, 1.2, 0.3, blk, (x1 - W) / 2, -0.25, 0, fr);
      k.pl(circM, x1 + W - 0.1, 1.08, (x1 - W) / 2, 0.6, -0.09, 0, fr); k.pl(circW, x1 + W - 0.1, 1.08, (x1 - W) / 2, 0.6, -0.41, Math.PI, fr); }
    { const z0 = ZH0, z1 = k.fz(-W) - 0.4; k.bxz(-W - 0.05, -W + 0.2, z0, z1, 1.6, blk);
      k.pl(GLOW(circ(1024, 220, false, 3), 1.0), z1 - z0 - 0.1, 1.4, -W + 0.21, 0.8, (z0 + z1) / 2, Math.PI / 2); }

    // ---------- 현미경 책상 5 (흰 책상 · 흰 A 틀 · 현미경 2 · 웨이퍼 판) ----------
    { const tabs = [[232, 1215], [408, 1215], [232, 1355], [408, 1355], [232, 1490]].map(([a, b]) => [X(a), Z(b)]);
      const top = [], leg = [], fr2 = [], bar = [], ch = [], scB = [], scA = [], scH = [], waf = [];
      tabs.forEach(([x, z]) => {
        top.push([x, 0.74, z]); [-1, 1].forEach(i => [-1, 1].forEach(j => leg.push([x + i * 0.36, 0, z + j * 0.66])));
        [-1, 1].forEach(j => { const zz = z + j * 0.78; fr2.push([x - 0.24, 1.0, zz, 0.2], [x + 0.24, 1.0, zz, -0.2]); });
        bar.push([x, 2.03, z]);
        [-1, 1].forEach(s => [-0.36, 0.36].forEach(o => ch.push([x + s * 0.68, 0, z + o, s < 0 ? -Math.PI / 2 : Math.PI / 2])));
        [-0.36, 0.36].forEach((o, i) => { const sx = x + (i ? 0.12 : -0.12); scB.push([sx, 0.79, z + o]); scA.push([sx + (i ? 0.06 : -0.06), 0.92, z + o]); scH.push([sx, 1.07, z + o + 0.02]); waf.push([x + (i ? -0.15 : 0.15), 0.765, z - o * 0.6]); });
      });
      k.inst(new THREE.BoxGeometry(0.82, 0.04, 1.45), wht, top);
      k.inst(new THREE.BoxGeometry(0.04, 0.74, 0.04), wht, leg);
      const fg = new THREE.BoxGeometry(0.05, 2.06, 0.05); { const im = new THREE.InstancedMesh(fg, wht, fr2.length), o = new THREE.Object3D(); fr2.forEach(([x, y, z, r], i) => { o.position.set(x, y, z); o.rotation.set(0, 0, r); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); g.add(im); }
      k.inst(new THREE.BoxGeometry(0.1, 0.05, 1.62), wht, bar);
      k.inst(CHAIR, blk, ch);
      k.inst(new THREE.BoxGeometry(0.16, 0.1, 0.22), wht, scB); k.inst(new THREE.BoxGeometry(0.05, 0.28, 0.06), wht, scA);
      k.inst(new THREE.CylinderGeometry(0.03, 0.04, 0.2, 10).rotateX(0.5), M(0x2a2d33, { roughness: .3 }), scH);
      const wt = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#1aa088'; c.fillRect(0, 0, w, h); const gr = c.createRadialGradient(64, 64, 4, 64, 64, 52); gr.addColorStop(0, '#e6d9ff'); gr.addColorStop(.5, '#9ad0e8'); gr.addColorStop(1, '#c8b0f0'); c.fillStyle = gr; c.beginPath(); c.arc(64, 64, 50, 0, 7); c.fill(); c.strokeStyle = 'rgba(40,40,80,.35)'; for (let i = 20; i < 110; i += 7) { c.beginPath(); c.moveTo(i, 14); c.lineTo(i, 114); c.stroke(); c.beginPath(); c.moveTo(14, i); c.lineTo(114, i); c.stroke(); } });
      k.inst(new THREE.PlaneGeometry(0.26, 0.26).rotateX(-Math.PI / 2), M(0xffffff, { map: wt, roughness: .3, emissive: 0x303030, emissiveIntensity: .4 }), waf);
    }

    // ---------- 북극곰 + 얼음판 + 빙하 조각 (6 · 5 · 2 · 20번) ----------
    const IX = X(430), IZ = Z(1538);
    const ice = new THREE.Group(); ice.position.set(IX, 0, IZ); g.add(ice);
    { // 얼음판: 들쭉날쭉한 판 + 깎인 면
      const s = new THREE.Shape(); const n = 22;
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, r = 1 + (hash(i, 1, 2) - .5) * .28; const x = Math.cos(a) * 1.2 * r, z = Math.sin(a) * 0.82 * r; i ? s.lineTo(x, z) : s.moveTo(x, z); }
      const geo = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.1, bevelSegments: 2, curveSegments: 4 });
      geo.rotateX(Math.PI / 2); geo.translate(0, 0.27, 0);
      const iceTop = M(0xeaf5ff, { roughness: .28, metalness: .05, emissive: 0xb4cde6, emissiveIntensity: .6, flatShading: true });
      ice.add(new THREE.Mesh(geo, iceTop));
      const chunks = []; for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2 + hash(i, 3, 1); chunks.push([Math.cos(a) * 1.25, 0.06, Math.sin(a) * 0.86, a * 3]); }
      const cg = new THREE.IcosahedronGeometry(0.16, 0).scale(1.3, 0.7, 1);
      const im = new THREE.InstancedMesh(cg, iceTop, chunks.length), o = new THREE.Object3D(); chunks.forEach(([x, y, z, r], i) => { o.position.set(x, y, z); o.rotation.set(r, r * 2, r * .5); o.scale.setScalar(.7 + hash(i, 9, 9) * .7); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); ice.add(im);
    }
    { // 빙하 조각: 들쭉날쭉 판(앞은 하늘색 → 흰색, 옆은 흰색) 겹쳐 세움
      const shard = (w, h, seed) => {
        const s = new THREE.Shape(); s.moveTo(-w / 2, 0); const n = 9;
        for (let i = 1; i < n; i++) { const t = i / n, x = -w / 2 + t * w, peak = Math.sin(t * Math.PI) ** 0.7 * h, y = peak * (0.55 + hash(i, seed, 4) * 0.45) * (i % 2 ? 1 : 0.82); s.lineTo(x + (hash(i, seed, 8) - .5) * w / n * .6, y); }
        s.lineTo(w / 2, 0); s.lineTo(-w / 2, 0);
        const geo = new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.03, bevelSegments: 1, curveSegments: 1 });
        const p = geo.attributes.position, nz = geo.attributes.normal, col = [];
        for (let i = 0; i < p.count; i++) {
          const y = p.getY(i) / h, side = Math.abs(nz.getZ(i)) < .5, st = hash(Math.round(p.getX(i) * 9), 1, 1) * .12;
          const c = side ? [.96, .98, 1] : [.42 + y * .5 + st, .7 + y * .27 + st * .5, .9 + y * .1];
          col.push(...c.map(v => Math.min(1, v)));
        }
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); return geo;
      };
      const sm = M(0xffffff, { vertexColors: true, roughness: .2, metalness: .05, emissive: 0x7aa8d4, emissiveIntensity: .6, flatShading: true });
      [[1.7, 2.35, 0.1, -0.66, 0, 3], [1.4, 1.85, -0.75, -0.55, 0.15, 5], [1.2, 1.5, 0.95, -0.5, -0.2, 6], [1.3, 1.9, 1.15, 0.05, 1.25, 7], [0.9, 1.25, 1.05, 0.62, 1.4, 8]]
        .forEach(([w, h, x, z, r, sd]) => { const m = new THREE.Mesh(shard(w, h, sd), sm); m.position.set(x, 0.2, z); m.rotation.y = r; ice.add(m); });
    }
    // 곰: 몸 = 타원체 · 둥근 원뿔을 부드럽게 합친 모양(마칭큐브) + 털 결 음영, 눈 · 코 · 입 · 발톱은 따로
    const bear = new THREE.Group(); bear.position.set(-0.15, 0.33, 0.05); bear.rotation.y = -Math.PI / 2 - 0.12; bear.scale.setScalar(0.95); ice.add(bear);
    {
      const P = [];                                                                // [모양, …값, 합치는 정도]
      const El = (c, r, b = .12) => P.push([0, c, r, b]), Co = (a, ra, bb, rb, b = .08) => P.push([1, a, ra, bb, rb, b]);
      El([0, .74, 0], [.6, .34, .36]); El([-.42, .77, 0], [.36, .38, .36]); El([.36, .77, 0], [.31, .35, .34]); El([0, .56, 0], [.48, .23, .31]);
      Co([.48, .82, 0], .22, [.82, .79, 0], .15); El([.94, .77, 0], [.18, .15, .14], .07); El([.96, .83, 0], [.12, .07, .11], .05);
      Co([.99, .75, 0], .1, [1.17, .715, 0], .056, .05); El([1.04, .675, 0], [.11, .05, .075], .04);
      [-1, 1].forEach(s => {
        El([.88, .915, s * .095], [.035, .045, .03], .03);
        const f = s < 0 ? .07 : 0;                                                 // 왼 앞발 조금 앞으로 (걷는 자세)
        Co([.36, .66, s * .17], .19, [.42 + f, .3, s * .18], .13); Co([.42 + f, .3, s * .18], .125, [.45 + f, .07, s * .19], .115); El([.53 + f, .05, s * .19], [.17, .06, .13], .06);
        El([-.44, .63, s * .19], [.25, .31, .17]); Co([-.4, .38, s * .19], .14, [-.46, .08, s * .2], .115); El([-.38, .05, s * .2], [.18, .06, .13], .06);
      });
      El([-.77, .86, 0], [.06, .05, .05], .04);
      const sdE = (x, y, z, c, r) => { const a = (x - c[0]) / r[0], b = (y - c[1]) / r[1], d = (z - c[2]) / r[2], k0 = Math.hypot(a, b, d), k1 = Math.hypot(a / r[0], b / r[1], d / r[2]); return k1 ? k0 * (k0 - 1) / k1 : -Math.min(...r); };
      const sdC = (x, y, z, a, ra, b, rb) => { const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2], px = x - a[0], py = y - a[1], pz = z - a[2], h = Math.max(0, Math.min(1, (px * bx + py * by + pz * bz) / (bx * bx + by * by + bz * bz))); return Math.hypot(px - bx * h, py - by * h, pz - bz * h) - (ra + (rb - ra) * h); };
      const smin = (a, b, kk) => { const h = Math.max(kk - Math.abs(a - b), 0) / kk; return Math.min(a, b) - h * h * kk * .25; };
      const sdf = (x, y, z) => { let d = 9; for (const q of P) { const v = q[0] ? sdC(x, y, z, q[1], q[2], q[3], q[4]) : sdE(x, y, z, q[1], q[2]); d = smin(d, v, q[q.length - 1]); } return d; };
      const furNoise = (x, y, z) => hash(Math.floor(x * 70), Math.floor(y * 70), Math.floor(z * 70)) - .5;
      // 흰 털: 전시장 파란 반사광에 물들어 분홍 · 보랏빛으로 보이지 않게 반사광은 줄이고 흰 빛을 더 줌 (10. 29. 서진 지적)
      const fur = M(0xffffff, { vertexColors: true, roughness: .92, emissive: 0xf0eadc, emissiveIntensity: .72, envMapIntensity: .12 });
      // 마칭큐브 한 덩어리: 가운데(CX, CY) · 반 크기 HALF · 해상도 RES, cut(x) = 그 쪽은 비움, grow = 조금 부풀림(겹친 곳에서 이 면이 보이게)
      const mcMesh = (RES, CX, CY, HALF, cut, grow = 0) => {
        const mc = new MC(RES, fur, false, false, 240000); mc.isolation = 0;
        const F = mc.field, S = mc.size, hs = mc.halfsize;
        for (let zi = 0; zi < S; zi++) { const z = (zi - hs) / hs * HALF; if (Math.abs(z) > .5) { F.fill(-1, zi * S * S, zi * S * S + S * S); continue; }
          for (let yi = 0; yi < S; yi++) { const y = (yi - hs) / hs * HALF + CY, o = zi * S * S + yi * S;
            if (y < -.05 || y > 1.2) { F.fill(-1, o, o + S); continue; }
            for (let xi = 0; xi < S; xi++) { const x = (xi - hs) / hs * HALF + CX; F[o + xi] = (x < -.95 || x > 1.32 || cut(x)) ? -1 : grow - sdf(x, y, z); } } }
        mc.update();
        const n = mc.count, pos = mc.positionArray.slice(0, n * 3), nor = mc.normalArray.slice(0, n * 3), col = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          const j = i * 3; pos[j] = pos[j] * HALF + CX; pos[j + 1] = pos[j + 1] * HALF + CY; pos[j + 2] *= HALF;
          const x = pos[j], y = pos[j + 1], z = pos[j + 2];
          // 털 결: 법선을 작은 무늬로 흔들어 거친 털 느낌 (결은 뒤로 눕게)
          const a = furNoise(x, y, z), b = furNoise(z + 3, x, y), c2 = furNoise(y, z + 7, x);
          const L0 = Math.hypot(nor[j], nor[j + 1], nor[j + 2]) || 1;
          let nx = nor[j] / L0 + a * .28 - .05, ny = nor[j + 1] / L0 + b * .2, nz = nor[j + 2] / L0 + c2 * .28; const L = Math.hypot(nx, ny, nz) || 1; nor[j] = nx / L; nor[j + 1] = ny / L; nor[j + 2] = nz / L;
          // 색: 등 · 머리 = 흰 크림, 배 · 다리 아래 = 조금 노르스름, 아랫면 · 주둥이 끝 조금 어둡게
          const up = Math.max(0, Math.min(1, (y - .15) / .8)), under = nor[j + 1] < -.3 ? .86 : 1, muz = x > 1.1 ? .93 : 1;
          const t = .9 + up * .1, v = (.95 + a * .05) * under * muz;
          col[j] = Math.min(1, t * v); col[j + 1] = Math.min(1, t * v * (.97 + up * .02)); col[j + 2] = Math.min(1, t * v * (.9 + up * .06));
        }
        const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        mc.geometry.dispose(); return new THREE.Mesh(geo, fur);
      };
      if (MC) {
        bear.add(mcMesh(LOW ? 64 : 108, .2, .56, 1.1, x => x > .9));              // 몸 (머리 앞쪽은 아래 머리 덩어리가 맡음)
        bear.add(mcMesh(LOW ? 48 : 84, 1.0, .78, .34, x => x < .7, .006));        // 머리: 더 잘게(약 8 mm) 떠서 눈두덩 · 주둥이 · 귀를 또렷하게
      } else {                                                                     // 마칭큐브 못 받을 때: 둥근 덩어리 곰
        const body = new THREE.Group(), fm = M(0xf2ecdc, { roughness: .9 });
        P.forEach(q => { if (q[0]) return; const m = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 14), fm); m.position.set(...q[1]); m.scale.set(...q[2]); body.add(m); }); bear.add(body);
      }
      // 눈 · 코는 털 겉면 위에 얹음: 앞에서 뒤로 짚어 가며 겉면을 찾아 그 자리에 둠 (전엔 머리 속에 묻혀 안 보였음)
      const onSkin = (y, z, out = 0) => { let x = 1.4; while (x > .8 && sdf(x, y, z) > 0) x -= .002; return x + out; };
      const gl = M(0x050506, { roughness: .12, metalness: .1, envMapIntensity: 1 }), dk = M(0x1e1c1b, { roughness: .6 });
      { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), gl); m.position.set(onSkin(.732, 0, -.012), .732, 0); m.scale.set(.038, .033, .052); bear.add(m); }      // 코
      [-1, 1].forEach(s => {
        const ex = onSkin(.818, s * .07, -.006);
        const e = new THREE.Mesh(new THREE.SphereGeometry(.021, 14, 10), gl); e.position.set(ex, .818, s * .07); bear.add(e);                          // 눈
        const hl = new THREE.Mesh(new THREE.SphereGeometry(.006, 8, 6), E(0xffffff, 1.5)); hl.position.set(ex + .016, .826, s * .074); bear.add(hl);       // 눈 반짝임
        const ein = new THREE.Mesh(new THREE.SphereGeometry(.022, 10, 8), M(0x6e665c, { roughness: .9 })); ein.scale.set(.5, 1, 1); ein.position.set(.905, .915, s * .1); bear.add(ein);   // 귓속
      });
      { const mx = onSkin(.676, 0, -.004), m = new THREE.Mesh(new THREE.CapsuleGeometry(.006, .1, 3, 6), dk); m.rotation.x = Math.PI / 2; m.position.set(mx, .676, 0); bear.add(m); }   // 입선
      { const m = new THREE.Mesh(new THREE.CapsuleGeometry(.005, .04, 3, 6), dk); m.position.set(onSkin(.7, 0, -.003), .7, 0); bear.add(m); }        // 코 밑 선
      const cl = []; [[.53 + .07, -1, .19], [.53, 1, .19], [-.38, -1, .2], [-.38, 1, .2]].forEach(([x, s, zz]) => { for (let i = -2; i <= 2; i++) cl.push([x + .16 - Math.abs(i) * .014, .02, s * zz + i * .045]); });
      { const im = new THREE.InstancedMesh(new THREE.ConeGeometry(.011, .05, 6).rotateZ(-Math.PI / 2 - .5), dk, cl.length), o = new THREE.Object3D(); cl.forEach((p, i) => { o.position.set(...p); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); bear.add(im); }   // 발톱
      bear.traverse(o => { if (o.isMesh) o.castShadow = false; });
    }

    // ---------- 매다는 LED 큐브 (빛나는 북극곰) + 위 트러스 · 간판까지 이어진 트러스 ----------
    { const cz = Z(1490), y0 = 4.9, w = 3.3, h = 2.1, d = 3.0, bt = GLOW(B3('semi2_bear'), 1.2), dk = M(0x07080d);
      const c = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [bt, bt, dk, dk, bt, bt]); c.position.set(0, y0 + h / 2, cz); g.add(c);
      const y = y0 + h + 0.3, a = w / 2 + 0.15, b = d / 2 + 0.15, Pq = [[-a, -b], [a, -b], [a, b], [-a, b]];
      Pq.forEach(([p, q], i) => { const [p2, q2] = Pq[(i + 1) % 4]; truss(k.W(p, y, cz + q), k.W(p2, y, cz + q2), 0.4); });
      truss(k.W(0, y, cz - b), k.W(0, y, ZH1 - 0.3), 0.4);
      Pq.forEach(([p, q]) => box(0.025, 11.6 - y, 0.025, M(0x3a3f4a), p, cz + q, y));
      box(0.025, 11.6 - y, 0.025, M(0x3a3f4a), 0, ZH1 - 0.3, y);
    }

    // ---------- 육각 키오스크 (가운데 VR 시뮬레이터) ----------
    { const hx = X(1012), hz = Z(1418), R = 2.3, A = R * Math.cos(Math.PI / 6), wa = 1.45;
      const hex = new THREE.Group(); hex.position.set(hx, 0, hz); g.add(hex);
      { const r = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.15, R + 0.15, 0.32, 6, 1, false, Math.PI / 2), blk); r.position.y = 2.95; hex.add(r);
        const rim = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.16, R + 0.16, 0.03, 6, 1, true, Math.PI / 2), M(0x2a2d35)); rim.position.y = 2.8; hex.add(rim); }
      const faces = [                                                           // [방향(도), 벽 그림, 데스크 글자, 글자색]
        [30, null], [90, 'semi2_k_mooc', ['반도체의 기초부터 심화까지,', '차세대반도체 K-MOOC 교과목'], '#ff6fb0'], [150, 'semi2_k_hist', ['반도체 발전 역사 (feat. 게임기)'], '#d9a8ff'],
        [210, 'semi2_k_tr', ['트랜지스터 공작소'], '#46e6c8'], [270, 'semi2_k_ai', ['AI 강아지 탐정단'], '#ff7a6a'], [330, 'semi2_k_silok', ['실록이가 알려줄게!'], '#ffbf73']];
      const grid = canvasTex(256, 256, (c, w, h) => { c.strokeStyle = '#000'; c.lineWidth = 4; for (let i = 0; i <= 256; i += 25.6) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } });
      grid.wrapS = grid.wrapT = THREE.RepeatWrapping; grid.repeat.set(3, 9);
      const gridM = M(0x2a2d36, { map: grid, transparent: true, alphaTest: .4, side: THREE.DoubleSide });
      const lights = [];
      faces.forEach(([deg, img, words, col]) => {
        const f = deg * Math.PI / 180, q = new THREE.Group(); q.rotation.y = Math.PI / 2 - f; hex.add(q);
        const ww = 2 * wa * Math.tan(Math.PI / 6);
        [-1, 1].forEach(s => { const m = new THREE.Mesh(new THREE.PlaneGeometry(R - wa / Math.cos(Math.PI / 6), 2.78), gridM); const a = s * Math.PI / 6;   // 모서리 철망
          const r0 = wa / Math.cos(Math.PI / 6), r1 = R; m.position.set(Math.sin(a) * (r0 + r1) / 2, 1.39, Math.cos(a) * (r0 + r1) / 2); m.rotation.y = a + Math.PI / 2; q.add(m); });
        [-0.45, 0.45].forEach(x => lights.push(new THREE.Vector3(x, 2.785, A - 0.15).applyAxisAngle(new THREE.Vector3(0, 1, 0), q.rotation.y)));
        if (!img) {                                                               // VR 시뮬레이터 칸 (열린 면)
          const vt = k.txt(['VR SIMULATOR'], 2.3, 0.34, { fg: '#fff', size: 200 }, 1.15); vt.position.set(0, 3.33, A + 0.16); q.add(vt);
          const pt = k.txt(['POLARIS'], 1.0, 0.16, { fg: '#e8ecf4', size: 170 }, 0.9); pt.position.set(0, 2.95, A + 0.16); q.add(pt);
          box(2.0, 0.22, 1.25, blk2, 0, 0.35, 0, q);
          const logoC = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#ff8a1a'; c.beginPath(); c.arc(64, 64, 58, 0, 7); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(64, 64, 40, 0, 7); c.fill(); c.fillStyle = '#ff8a1a'; c.beginPath(); c.moveTo(64, 34); c.lineTo(90, 86); c.lineTo(38, 86); c.fill(); });
          k.pl(GLOW(logoC, 1.1, { transparent: true }), 0.18, 0.18, 0, 0.12, 0.98, 0, q);
          [-0.48, 0.48].forEach(x => {                                            // 달걀 모양 의자 2 (흰 껍데기 · 하늘색 빛 테 · 주황 옆판)
            const s = new THREE.Group(); s.position.set(x, 0.22, 0.25); q.add(s);
            const shell = new THREE.Mesh(new THREE.SphereGeometry(0.46, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), M(0xf4f5f7, { roughness: .3, emissive: 0xa4aab4, emissiveIntensity: .6, side: THREE.DoubleSide }));
            shell.rotation.x = -Math.PI / 2 + 0.25; shell.position.set(0, 0.75, -0.1); s.add(shell);
            const rim = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.028, 8, 28), E(0x3fe6ff, 2.2)); rim.position.set(0, 0.86, 0.12); rim.rotation.x = 0.25; s.add(rim);
            [-1, 1].forEach(t => box(0.06, 0.42, 0.5, M(0xff8a1a, { roughness: .4, emissive: 0x7a3a00, emissiveIntensity: .5 }), t * 0.4, 0, 0.42, s));
            box(0.5, 0.12, 0.45, M(0x1a1c22), 0, 0.05, 0.4, s); box(0.12, 0.42, 0.5, M(0x111216), 0, 0.15, 0, s);
          });
          return;
        }
        box(ww, 2.78, 0.1, blk, 0, wa - 0.05, 0, q);                              // 키오스크 벽 + 시안 그림
        const t = B3(img), ar = { semi2_k_silok: 1.32, semi2_k_ai: 1.07, semi2_k_tr: 0.9, semi2_k_hist: 1.43, semi2_k_mooc: 1.41 }[img], pw = ww - 0.1, ph = Math.min(1.7, pw / ar);
        k.pl(GLOW(t, 1.0), pw, ph, 0, 2.7 - ph / 2, wa + 0.005, 0, q);
        box(ww - 0.4, 0.95, 0.42, blk, 0, wa + 0.32, 0, q);
        const dt = canvasTex(1024, 300, (c, w, h) => { c.fillStyle = '#16181e'; c.fillRect(0, 0, w, h); c.shadowColor = col; c.shadowBlur = 16; const fs = words.length > 1 ? 56 : 76; words.forEach((s, i) => T(c, s, w / 2, h * (words.length > 1 ? .36 + i * .3 : .42), `900 ${fs}px ${FONT}`, col, 'center')); });
        k.pl(GLOW(dt, 1.0), ww - 0.42, (ww - 0.42) * 300 / 1024, 0, 0.62, wa + 0.535, 0, q);
        box(0.36, 0.23, 0.02, M(0x14161c), -0.35, wa + 0.38, 0.98, q);           // 노트북
      });
      k.inst(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 12), E(0xfff6e0, 3), lights.map(v => [hx + v.x, v.y, hz + v.z]));
    }

    // ---------- 휴게 (빈백 4 · 과자 진열대 · 전자레인지 · 커피통 · 정수기) ----------
    { const x1 = X(420), z0 = Z(940), zf = ZH0 - 0.1;
      box(x1 + W, 1.1, 0.12, blk, (x1 - W) / 2, zf - 0.06); k.pl(GLOW(circ(1024, 160, false, 11), 1.0), x1 + W - 0.1, 1.0, (x1 - W) / 2, 0.55, zf + 0.005);
      box(x1 + W, 1.6, 0.03, glass, (x1 - W) / 2, zf - 0.06, 1.1);
      [[225, 960, 0xff6a1a], [325, 950, 0xe8261e], [215, 1050, 0xd9241e], [330, 1050, 0x8a2be2]].forEach(([a, b, c]) => k.beans([[X(a), Z(b)]], M(c, { roughness: .7, emissive: c, emissiveIntensity: .12 })));
      const prod = canvasTex(256, 512, (c, w, h) => { c.fillStyle = '#c9a874'; c.fillRect(0, 0, w, h); const cols = ['#e2483d', '#2f9d45', '#f2b632', '#d8742c', '#3a6fd8', '#b02f2f']; for (let r = 0; r < 4; r++) { c.fillStyle = '#8a6a40'; c.fillRect(0, (r + 1) * h / 4 - 10, w, 10); let x = 4; while (x < w - 18) { const bw = 18 + Math.random() * 22, bh = h / 4 * (.5 + Math.random() * .35); c.fillStyle = cols[Math.random() * cols.length | 0]; c.fillRect(x, (r + 1) * h / 4 - 10 - bh, bw, bh); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x + 3, (r + 1) * h / 4 - 10 - bh + 4, bw * .3, bh * .6); x += bw + 3; } } });
      const sz0 = Z(940) - 0.2, sz1 = Z(1075); box(0.42, 1.9, sz1 - sz0, M(0xc9a874, { roughness: .6 }), -W + 0.26, (sz0 + sz1) / 2);
      k.pl(GLOW(prod, 0.75), sz1 - sz0 - 0.06, 1.84, -W + 0.48, 0.95, (sz0 + sz1) / 2, Math.PI / 2);
      const cz = zf - 0.45, cx = X(260); box(1.7, 0.85, 0.55, blk, cx, cz);
      [[-0.45], [0.05]].forEach(([o]) => { box(0.46, 0.28, 0.36, M(0xd8dbe0, { roughness: .35 }), cx + o, cz, 0.85); box(0.3, 0.2, 0.01, M(0x101216), cx + o - 0.04, cz + 0.181, 0.89); });
      { const u = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.45, 18), gry); u.position.set(cx + 0.6, 1.08, cz); g.add(u); }
      box(0.32, 1.05, 0.32, wht, cx + 1.15, cz); { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.36, 16), M(0x7fc6ff, { transparent: true, opacity: .7, roughness: .1 })); b.position.set(cx + 1.15, 1.23, cz); g.add(b); }
      { const st = X(390), sz = Z(1030); box(0.06, 1.7, 0.06, gry, st, sz); box(0.5, 0.02, 0.06, gry, st, sz, 1.68); box(0.08, 0.02, 0.5, gry, st, sz); }
    }

    // ---------- 회의실 (짙은 유리 방 · 흰 탁자 · 의자 6) ----------
    { const x0 = X(955), x1 = W, z0 = Z(945), z1 = ZH0 - 0.1, h = 2.7, ft = M(0x1a1c22, { roughness: .4 });
      [[x0, z0, x0, z1], [x0, z0, x1, z0], [x0, z1, x1, z1]].forEach(([a, b, c, d]) => { const L = Math.hypot(c - a, d - b), m = box(L, h - 0.05, 0.03, glass, (a + c) / 2, (b + d) / 2); m.rotation.y = -Math.atan2(d - b, c - a); });
      [[x0, z0], [x0, z1], [x1, z0], [x1, z1], [x0, (z0 + z1) / 2]].forEach(([x, z]) => box(0.06, h, 0.06, ft, x, z));
      box(x1 - x0, 0.08, z1 - z0, blk, (x0 + x1) / 2, (z0 + z1) / 2, h);
      box(0.9, 2.1, 0.04, M(0x22252c, { roughness: .3 }), x0 - 0.01, (z0 + z1) / 2 + 0.55).rotation.y = Math.PI / 2;
      box(0.05, h - 0.1, 0.03, blu, x0 + 0.03, z1 - 0.05, 0.05);
      const tx = (x0 + x1) / 2 + 0.2, tz = (z0 + z1) / 2; box(0.9, 0.04, 1.6, wht, tx, tz, 0.72); box(0.8, 0.7, 0.04, wht, tx, tz);
      k.inst(CHAIR, blk, [-0.5, 0, 0.5].flatMap(o => [[tx - 0.7, 0, tz + o, -Math.PI / 2], [tx + 0.7, 0, tz + o, Math.PI / 2]]));
      k.inst(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 12), E(0xfff6e0, 3), [[x0 + 0.8, h - 0.02, tz - 0.6], [x1 - 0.8, h - 0.02, tz - 0.6], [x0 + 0.8, h - 0.02, tz + 0.6], [x1 - 0.8, h - 0.02, tz + 0.6]]);
    }

    // ---------- 뒤: 벽 · 뒷벽 LED (북극곰 화면) ----------
    k.bxz(-W - 0.05, W + 0.05, -D - 0.25, -D, 3.3, blk); box(2 * W + 0.1, 0.05, 0.03, blu, 0, -D + 0.01, 3.22);
    k.pl(GLOW(circ(2048, 360, false, 21), 0.95), 2 * W - 0.3, 2.6, 0, 1.75, -D + 0.01);
    box(4.9, 2.75, 0.12, M(0x05060a), 0, -D + 0.06, 0.45); k.pl(GLOW(B3('semi2_bear'), 1.15), 4.7, 2.6, 0, 1.75, -D + 0.125);
    [-1, 1].forEach(s => { k.bxz(s * W - 0.12, s * W + 0.12, -D, ZH1, 3.3, blk); box(0.03, 0.05, ZH1 + D, blu, s * (W - 0.13), (ZH1 - D) / 2, 3.22);
      const zA = -D + 0.3, zB = Z(930) - 0.2; k.pl(GLOW(circ(1536, 360, false, s > 0 ? 31 : 41), 0.95), zB - zA, 2.6, s * (W - 0.13), 1.75, (zA + zB) / 2, -s * Math.PI / 2); });

    // ---------- MCU 경진대회 팀 부스 12 (번호 · 팀 이름은 시안 15 · 16 · 18 · 19번에서 읽힌 것만) ----------
    { const NAME = { 1: 'Out of Memory', 2: 'Sodapop', 3: 'StackOverflow', 4: 'Z.Y.M', 6: '뚜벅이', 7: '백만볼트', 10: '매직아이', 11: '당탕탕 리모컨' };
      const cols = [255, 455, 885, 1090].map(X), rows = [375, 590, 800].map(Z);
      const num = [[9, 10, 11, 12], [8, 7, 6, 5], [1, 2, 3, 4]];               // [뒷줄 · 가운데 줄 · 앞줄][왼 → 오]
      const grid = canvasTex(256, 256, (c, w, h) => { c.strokeStyle = '#000'; c.lineWidth = 4; for (let i = 0; i <= 256; i += 25.6) { c.beginPath(); c.moveTo(i, 0); c.lineTo(i, h); c.stroke(); c.beginPath(); c.moveTo(0, i); c.lineTo(w, i); c.stroke(); } });
      grid.wrapS = grid.wrapT = THREE.RepeatWrapping; grid.repeat.set(4, 8);
      const gridM = M(0x2a2d36, { map: grid, transparent: true, alphaTest: .4, side: THREE.DoubleSide });
      const deskTop = [], deskLeg = [], cab = [], chairs = [], laps = [], scr = [], posts = [];
      const L = 2.5, Wd = 1.15, H = 2.45;
      rows.forEach((z, ri) => cols.forEach((x, ci) => {
        const n = num[ri][ci], name = NAME[n] || '', r = ci < 2 ? -Math.PI / 4 : Math.PI / 4;
        const p = new THREE.Group(); p.position.set(x, 0, z); p.rotation.y = r; g.add(p); p.updateMatrix();
        const at = (lx, ly, lz) => new THREE.Vector3(lx, ly, lz).applyMatrix4(p.matrix);
        const v = at(0, 0.75, 0); deskTop.push([v.x, v.y, v.z, r]); const v2 = at(0, 0, 0); deskLeg.push([v2.x, 0, v2.z, r]);
        const cb = at((ci < 2 ? 1 : -1) * (L / 2 + 0.3), 0, 0); cab.push([cb.x, 0, cb.z, r]);
        [-0.55, 0.55].forEach(lx => [-1, 1].forEach(s => { const c = at(lx, 0, s * 0.85); chairs.push([c.x, 0, c.z, r + (s > 0 ? 0 : Math.PI)]); const lp = at(lx, 0.87, s * 0.3); laps.push([lp.x, lp.y, lp.z, r + (s > 0 ? Math.PI : 0)]); }));
        [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([a, b]) => { const q = at(a * L / 2, H / 2, b * Wd / 2); posts.push([q.x, q.y, q.z, r]); });
        [-1, 1].forEach(a => { const m = new THREE.Mesh(new THREE.PlaneGeometry(Wd, H - 0.1), gridM); m.position.set(a * L / 2, (H - 0.1) / 2, 0); m.rotation.y = Math.PI / 2; p.add(m); });
        box(L + 0.12, 0.4, Wd + 0.12, blk, 0, 0, H, p);
        const band = canvasTex(1024, 150, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#0d1a5c'); gr.addColorStop(1, '#16246e'); c.fillStyle = gr; c.fillRect(0, 0, w, h); if (name) { c.shadowColor = 'rgba(0,0,0,.5)'; c.shadowBlur = 6; T(c, name, w / 2, h * .54, `800 ${/[가-힣]/.test(name) ? 92 : 84}px ${FONT}`, '#fff', 'center'); } });
        const nb = canvasTex(512, 256, (c, w, h) => { c.fillStyle = '#0d1a5c'; c.fillRect(0, 0, w, h); T(c, String(n).padStart(2, '0'), w * .3, h * .52, `900 180px ${FONT}`, '#fff', 'center'); T(c, '2026 COSS 차세대반도체', w * .74, h * .42, `700 26px ${FONT}`, '#fff', 'center'); T(c, 'MCU 응용 경진대회', w * .74, h * .6, `600 24px ${FONT}`, '#fff', 'center'); });
        [-1, 1].forEach(s => { const m = k.pl(GLOW(band, 0.9), L + 0.1, 0.36, 0, H + 0.2, s * (Wd / 2 + 0.065), s < 0 ? Math.PI : 0, p); });
        [-1, 1].forEach(s => k.pl(GLOW(nb, 0.9), Wd + 0.1, 0.36, s * (L / 2 + 0.065), H + 0.2, 0, s * Math.PI / 2, p));
      }));
      k.inst(new THREE.BoxGeometry(L - 0.1, 0.04, Wd), wht, deskTop);
      k.inst(new THREE.BoxGeometry(L - 0.3, 0.73, 0.06), blk, deskLeg.map(([x, , z, r]) => [x, 0, z, r]).map(([x, y, z, r]) => [x, 0.365, z, r]));
      k.inst(new THREE.BoxGeometry(0.5, 1.0, 0.5), blk, cab.map(([x, , z, r]) => [x, 0.5, z, r]));
      k.inst(CHAIR, blk, chairs);
      k.inst(new THREE.BoxGeometry(0.34, 0.22, 0.015).translate(0, 0.11, 0).rotateX(-0.25), new THREE.MeshStandardMaterial({ color: 0x050812, emissive: 0x2f6dff, emissiveIntensity: .9 }), laps);
      k.inst(new THREE.BoxGeometry(0.045, H, 0.045), blk, posts);
    }

    // ---------- 사람 · 조명 ----------
    const fm = M(0xe8ecf4);
    [[IX + 2.6, IZ + 1.6], [X(320), Z(1290)], [X(1012) - 1.6, Z(1418) + 2.6], [X(820), Z(450)]].forEach(([x, z]) => figure(g, x, z, fm));
    k.spot([IX + 1.8, 6.5, IZ + 3.2], [IX - 0.2, 0.8, IZ], 0xf2f6ff, 170, 0.35);
    k.spot([0, 7.8, -2.2], [0, 1.8, ZH0], 0xe6f0ff, 140, 0.6);
    k.pool(IX, IZ, 2.6, 0xbfe2ff, 0.45); k.pool(0, Z(1300), 3.5, 0x6fa8ff, 0.3); k.pool(X(1012), Z(1418), 3.2, 0x7fb8ff, 0.3); k.pool(0, Z(590), 7, 0x5a8cff, 0.2); k.pool(X(320), Z(1340), 3.5, 0x8fc8ff, 0.25);
  },
});
