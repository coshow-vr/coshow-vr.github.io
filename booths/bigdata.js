/* ---------- 빅데이터 부스 3D — 오토데스크 3D 도면([CO-SHOW] 빅데이터 컨소시엄 - 3D 디자인.skp) 위에서 본 평면 · 각도별 화면 보고 다시 지음 (10. 30.) ---------- */
// 평면 환산(위에서 본 화면, 2.3 m 위 자름, 화면 왼쪽 = 앞 · 위 = 부스 왼쪽): X = (sy − 321.5) / 25.0 × (W / 7.4) · Z = −(sx − 270) / 24.16
// 앞 나무 아치 + 매단 흰 글자 · 앞 양쪽 덩굴 퍼걸러 + COSS 청록 네온 · 반달 나무 안내데스크 · 키오스크 2 + 오른쪽 줄 5(화단) · 8자 길 + 둥근 화분 2
// · 왼쪽 벤치 3조 · 양옆 화단 · 베이지 길 · 뒤 잔디(빈백 · 팔레트 데크) · 숲 사진 벽 · 회의실 · 창고 · 덩굴 기둥 · 지붕 트러스
export default ({ THREE, M, E, GLOW, canvasTex, boothKit, CHAIR, BEAN, FONT, truss, mergeGeometries }) => {
  const rnd = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();   // 늘 같은 배치
  const rep = t => { t.wrapS = t.wrapT = THREE.RepeatWrapping; return t; };
  const woodTex = rep(canvasTex(256, 256, (c, w, h) => {                       // 짙은 나뭇결 (아치)
    c.fillStyle = '#5e3b24'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 80; i++) { c.strokeStyle = `rgba(${85 + rnd() * 50},${50 + rnd() * 30},${28 + rnd() * 20},.5)`; c.lineWidth = 1 + rnd() * 3; const x = rnd() * w; c.beginPath(); c.moveTo(x, 0); c.bezierCurveTo(x + 8, h * .3, x - 8, h * .7, x + 4, h); c.stroke(); }
  }));
  const lightWood = rep(canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#c29a6c'; c.fillRect(0, 0, w, h); for (let i = 0; i < 50; i++) { c.strokeStyle = `rgba(130,90,55,${0.2 + rnd() * 0.3})`; c.lineWidth = 1 + rnd() * 2; const y = rnd() * h; c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + rnd() * 6 - 3); c.stroke(); } }));
  const grass = (base, n, g0) => rep(canvasTex(256, 256, (c, w, h) => {      // 인조잔디 결
    c.fillStyle = base; c.fillRect(0, 0, w, h);
    for (let i = 0; i < n; i++) { const g = g0 + rnd() * 50; c.strokeStyle = `rgba(${g * 0.55},${g},${g * 0.35},.55)`; c.lineWidth = 1; const x = rnd() * w, y = rnd() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + rnd() * 3 - 1.5, y - 3 - rnd() * 4); c.stroke(); }
  }));
  const darkGrass = grass('#34422a', 2400, 60), lightGrass = grass('#6f8c40', 2400, 120);
  const vineTex = rep(canvasTex(256, 256, (c, w, h) => {                        // 덩굴 잎 (투명 바탕)
    for (let i = 0; i < 560; i++) { const x = rnd() * w, y = rnd() * h, g = 70 + rnd() * 90; c.fillStyle = `rgb(${g * 0.35},${g},${g * 0.4})`; c.beginPath(); c.ellipse(x, y, 4 + rnd() * 5, 2 + rnd() * 3, rnd() * 3, 0, 7); c.fill(); }
  }));
  const bandTex = canvasTex(2048, 96, (c, w, h) => {                            // 아치 위 띠 글자 (작게 되풀이)
    c.fillStyle = '#4a2e1b'; c.fillRect(0, 0, w, h); c.fillStyle = '#eadcc0'; c.font = `700 34px ${FONT}`; c.textBaseline = 'middle';
    const tw = c.measureText('FOREST OF BIGDATA').width + 90; for (let x = 30; x + tw - 90 < w; x += tw) c.fillText('FOREST OF BIGDATA', x, h / 2);
  });
  const bigTex = canvasTex(2048, 256, (c, w, h) => {                            // 아치 아래 매단 흰 글자
    c.font = `900 190px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.lineWidth = 14; c.strokeStyle = '#4b4f55'; c.strokeText('FOREST OF BIGDATA', w / 2, h / 2 + 8);
    c.fillStyle = '#f6f7f8'; c.fillText('FOREST OF BIGDATA', w / 2, h / 2 + 8);
  });
  const deskTex = canvasTex(1024, 128, (c, w, h) => { c.fillStyle = '#3c2616'; c.font = `800 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('FOREST OF BIGDATA', w / 2, h / 2); });
  const neonTex = canvasTex(512, 420, (c, w, h) => {                            // COSS 청록 네온 (선 그림: 맞잡은 손 · 회로)
    c.shadowColor = '#3fffe8'; c.shadowBlur = 18; c.strokeStyle = '#5ff6e6'; c.lineWidth = 6; c.lineJoin = 'round';
    c.beginPath(); c.ellipse(w / 2, h * 0.5, w * 0.36, h * 0.27, -0.25, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(w * 0.08, h * 0.22); c.lineTo(w * 0.92, h * 0.12); c.moveTo(w * 0.2, h * 0.3); c.lineTo(w * 0.34, h * 0.14); c.moveTo(w * 0.7, h * 0.2); c.lineTo(w * 0.86, h * 0.3); c.stroke();
    [[0.12, 0.22], [0.92, 0.12], [0.34, 0.14], [0.86, 0.3]].forEach(([x, y]) => { c.beginPath(); c.arc(w * x, h * y, 9, 0, 7); c.stroke(); });
    c.font = `900 120px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 5; c.strokeText('COSS', w / 2, h * 0.55);
    c.fillStyle = '#7ffff0'; c.font = `700 40px ${FONT}`; c.fillText('빅데이터', w / 2, h * 0.86);
  });
  const forestTex = canvasTex(2048, 512, (c, w, h) => {                         // 숲 사진 벽 (햇살 든 숲 그림)
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#e4edc6'); gr.addColorStop(0.35, '#8fae55'); gr.addColorStop(0.75, '#4c6a2a'); gr.addColorStop(1, '#2a3c19'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    const sun = c.createRadialGradient(w * 0.52, h * 0.16, 0, w * 0.52, h * 0.16, h * 0.8); sun.addColorStop(0, 'rgba(255,252,220,.95)'); sun.addColorStop(1, 'rgba(255,252,220,0)'); c.fillStyle = sun; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 140; i++) { c.fillStyle = `rgba(${60 + rnd() * 60},${110 + rnd() * 70},${30 + rnd() * 30},${0.25 + rnd() * 0.35})`; c.beginPath(); c.ellipse(rnd() * w, rnd() * h * 0.55, 30 + rnd() * 90, 20 + rnd() * 50, rnd() * 3, 0, 7); c.fill(); }
    for (let i = 0; i < 70; i++) { const x = rnd() * w, t = 3 + rnd() * 6; c.fillStyle = `rgba(150,160,130,${0.4 + rnd() * 0.3})`; c.fillRect(x, 0, t, h); }     // 먼 줄기
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) { const x = w * 0.52 + (rnd() - 0.5) * 300; c.fillStyle = 'rgba(255,250,210,.06)'; c.beginPath(); c.moveTo(x, h * 0.16); c.lineTo(x - 260 + rnd() * 520, h); c.lineTo(x - 160 + rnd() * 520, h); c.closePath(); c.fill(); }
    c.globalCompositeOperation = 'source-over';
    for (let i = 0; i < 26; i++) { const x = rnd() * w, t = 12 + rnd() * 26; const tg = c.createLinearGradient(x, 0, x + t, 0); tg.addColorStop(0, '#2b2318'); tg.addColorStop(0.5, '#5b4a35'); tg.addColorStop(1, '#2b2318'); c.fillStyle = tg; c.fillRect(x, 0, t, h); }   // 가까운 줄기
    for (let i = 0; i < 900; i++) { const x = rnd() * w, y = h * (0.72 + rnd() * 0.28), g = 80 + rnd() * 100; c.strokeStyle = `rgba(${g * 0.5},${g},${g * 0.3},.8)`; c.lineWidth = 2; c.beginPath(); c.moveTo(x, h); c.quadraticCurveTo(x + (rnd() - .5) * 20, y + 10, x + (rnd() - .5) * 40, y); c.stroke(); }   // 고사리
  });
  const kioskTex = canvasTex(256, 448, (c, w, h) => {                           // 키오스크 화면 (도면에 화면 내용 없음 → 짙은 청록 그래픽)
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0d2a33'); gr.addColorStop(1, '#06141b'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.fillStyle = '#2fd3c0'; c.fillRect(0, 0, w, 34);
    c.strokeStyle = '#3fe6d2'; c.lineWidth = 14; c.beginPath(); c.arc(w / 2, 130, 58, -1.4, 3.2); c.stroke(); c.strokeStyle = 'rgba(63,230,210,.25)'; c.beginPath(); c.arc(w / 2, 130, 58, 3.2, 4.88); c.stroke();
    for (let i = 0; i < 7; i++) { const bh = 30 + ((i * 37) % 90); c.fillStyle = i % 2 ? '#9ff5e6' : '#2fd3c0'; c.fillRect(30 + i * 29, 330 - bh, 18, bh); }
    for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(160,245,230,.35)'; c.fillRect(30, 352 + i * 24, 196 - i * 40, 10); }
  });

  return {
    '빅데이터'(g, W, D, carpet, slope) {
      const k = boothKit(g, slope), fr = k.fr;
      const P = (sx, sy) => [(sy - 321.5) / 25.0 * W / 7.4, -(sx - 270) / 24.16];      // 평면 화소 → 부스 안 (x, z)
      const steel = M(0x2a2c30, { roughness: .5, metalness: .4 }), wht = M(0xf3f4f6, { roughness: .45, emissive: 0x6a6d72, emissiveIntensity: .6 });
      const wood = M(0xffffff, { map: woodTex, roughness: .7, emissive: 0x2a1a0e, emissiveIntensity: .45 }), lw = M(0xffffff, { map: lightWood, roughness: .7, emissive: 0x5a3f26, emissiveIntensity: .55 });
      const vine = M(0xffffff, { map: vineTex, alphaTest: .45, side: THREE.DoubleSide, roughness: .9, emissive: 0x0d2a12, emissiveIntensity: .6 });
      const leaf = M(0x6f9a5a, { roughness: .9, flatShading: true, emissive: 0x1d3a17, emissiveIntensity: .8 }), leaf2 = M(0x8fa47c, { roughness: .9, flatShading: true, emissive: 0x263022, emissiveIntensity: .8 });
      const fern = M(0x4f7a34, { roughness: 1, emissive: 0x18300f, emissiveIntensity: .7 }), reed = M(0x8fa268, { roughness: 1, emissive: 0x2c3a1c, emissiveIntensity: .7 });
      const lawn = M(0xffffff, { map: lightGrass, roughness: 1, emissive: 0x2c3c18, emissiveIntensity: .6 }), stone = M(0xb9bcbf, { roughness: .9 }), pathM = M(0xcdbca1, { roughness: .9, side: THREE.DoubleSide, emissive: 0x4a4234, emissiveIntensity: .6 });
      darkGrass.repeat.set(0.5, 0.5); carpet.material = M(0xffffff, { map: darkGrass, roughness: 1, emissive: 0x1a2614, emissiveIntensity: .6 });   // 바닥 = 짙은 인조잔디 (도면)
      const rr = (x0, x1, z0, z1, r, h, m, y0 = 0) => {                       // 모서리 둥근 판 (화단 · 잔디)
        const s = new THREE.Shape(), a = -z1, b = -z0;
        s.moveTo(x0 + r, a); s.lineTo(x1 - r, a); s.absarc(x1 - r, a + r, r, -Math.PI / 2, 0); s.lineTo(x1, b - r); s.absarc(x1 - r, b - r, r, 0, Math.PI / 2);
        s.lineTo(x0 + r, b); s.absarc(x0 + r, b - r, r, Math.PI / 2, Math.PI); s.lineTo(x0, a + r); s.absarc(x0 + r, a + r, r, Math.PI, Math.PI * 1.5);
        const geo = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 6 }); geo.rotateX(-Math.PI / 2);
        const me = new THREE.Mesh(geo, m); me.position.y = y0; g.add(me); return me;
      };
      const strip = (pts, w, m, y) => {                                        // 바닥 띠 (곡선 길)
        const c = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal'), n = 120, pos = [], idx = [];
        for (let i = 0; i <= n; i++) { const p = c.getPointAt(i / n), t = c.getTangentAt(i / n); pos.push(p.x - t.z * w / 2, y, p.z + t.x * w / 2, p.x + t.z * w / 2, y, p.z - t.x * w / 2); if (i) { const j = 2 * i; idx.push(j - 2, j, j - 1, j - 1, j, j + 1); } }
        const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals();
        const me = new THREE.Mesh(geo, m); g.add(me); return me;
      };
      const trees = [], small = [], grassL = [], fernL = [], flowers = [], rocks = [];
      const scatter = (list, x0, x1, z0, z1, n, y) => { for (let i = 0; i < n; i++) list.push([x0 + rnd() * (x1 - x0), y, z0 + rnd() * (z1 - z0), rnd() * 3]); };

      // ── 바닥: 뒤 잔디 · 베이지 길 ─────────────────
      const [lx1] = P(0, 392), zL0 = P(750, 0)[1], zL1 = P(593, 0)[1];
      rr(-W + 0.15, lx1, zL0, zL1, 1.3, 0.03, lawn, 0.04);
      { const [px0] = P(0, 357), [px1] = P(0, 378), [, zb0] = P(592, 0), [, zb1] = P(568, 0);
        k.flat(pathM, px0, px1, zb0, k.fz((px0 + px1) / 2) - 0.05, 0.075);          // 앞에서 곧장 안으로
        k.flat(pathM, -W + 0.2, px1, zb0, zb1, 0.076);                                  // 왼쪽으로 꺾임
        const cx = (px0 + px1) / 2, [x2] = P(0, 394);
        strip([[cx, zb1 - 0.4], [cx + 0.15, zb0 - 0.6], [cx + 0.6, zb0 - 1.6], [x2, zb0 - 2.6], [x2, zb0 - 4.2], [x2, zL0 + 0.05]], 0.85, pathM, 0.077); }

      // ── 앞 나무 아치 (fr): 짙은 나무 + 크림 테 · 띠 글자 · 매단 흰 글자 · 덩굴 ───
      const aw = 3.85 * W / 7.4, ow = aw - 0.38, oh = 4.35, r = 0.6, ah = 5.1, az0 = -0.45, ad = 1.0;
      { const sh = new THREE.Shape();
        sh.moveTo(-aw, 0); sh.lineTo(-ow, 0); sh.lineTo(-ow, oh - r); sh.absarc(-ow + r, oh - r, r, Math.PI, Math.PI / 2, true); sh.lineTo(ow - r, oh); sh.absarc(ow - r, oh - r, r, Math.PI / 2, 0, true); sh.lineTo(ow, 0); sh.lineTo(aw, 0); sh.lineTo(aw, ah); sh.lineTo(-aw, ah); sh.closePath();
        const geo = new THREE.ExtrudeGeometry(sh, { depth: ad, bevelEnabled: false, curveSegments: 10 }); geo.translate(0, 0, az0 - ad);
        const wm = M(0xffffff, { map: woodTex.clone(), roughness: .7, emissive: 0x2a1a0e, emissiveIntensity: .5 }); wm.map.repeat.set(0.4, 0.4); wm.map.needsUpdate = true;
        fr.add(new THREE.Mesh(geo, wm));
        const e = 0.07, tr = new THREE.Shape();                                  // 안쪽 크림 테
        tr.moveTo(-ow - e, 0); tr.lineTo(-ow - e, oh - r); tr.absarc(-ow + r, oh - r, r + e, Math.PI, Math.PI / 2, true); tr.lineTo(ow - r, oh + e); tr.absarc(ow - r, oh - r, r + e, Math.PI / 2, 0, true); tr.lineTo(ow + e, 0);
        tr.lineTo(ow, 0); tr.lineTo(ow, oh - r); tr.absarc(ow - r, oh - r, r, 0, Math.PI / 2, false); tr.lineTo(-ow + r, oh); tr.absarc(-ow + r, oh - r, r, Math.PI / 2, Math.PI, false); tr.lineTo(-ow, 0); tr.closePath();
        const tg = new THREE.ExtrudeGeometry(tr, { depth: ad + 0.04, bevelEnabled: false, curveSegments: 10 }); tg.translate(0, 0, az0 - ad - 0.02);
        fr.add(new THREE.Mesh(tg, M(0xe9d9a6, { roughness: .6, emissive: 0x3a3018, emissiveIntensity: .5 })));
        k.pl(GLOW(bandTex, 0.85), 2 * aw - 0.4, 0.34, 0, oh + 0.38, az0 + 0.01, 0, fr);
        k.pl(GLOW(bandTex, 0.7), 2 * aw - 0.4, 0.34, 0, oh + 0.38, az0 - ad - 0.01, Math.PI, fr);
        const bt = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 0.56), GLOW(bigTex, 1.0, { transparent: true, side: THREE.DoubleSide, depthWrite: false })); bt.position.set(0, 3.62, az0 - ad / 2); fr.add(bt);
        [-1.9, 0, 1.9].forEach(x => k.box(0.012, oh - 3.9, 0.012, steel, x, az0 - ad / 2, 3.9, fr));
        k.pl(vine, 2 * ow - 0.6, 0.5, 0, oh - 0.15, az0 - 0.2, 0, fr);            // 아치 위 늘어진 덩굴
        k.pl(vine, 2 * ow - 1.2, 0.5, 0, oh - 0.15, az0 - ad + 0.2, 0, fr);
        [-1, 1].forEach(s => { const v = k.pl(vine, 0.9, 2.4, s * (ow - 0.25), oh - 1.0, az0 - 0.15, 0, fr); v.rotation.z = s * 0.08; });
      }
      // 앞 양쪽 칸: 덩굴 퍼걸러 앞틀 · 나무 화분 상자 · COSS 청록 네온
      const PH = 4.85, xs = W - 0.15;
      [-1, 1].forEach(s => {
        const x0 = s * aw, x1 = s * xs, xm = (x0 + x1) / 2, L = Math.abs(x1 - x0);
        k.box(0.36, PH, 0.36, steel, x1 - s * 0.05, -0.35, 0, fr); k.box(0.5, PH - 0.2, 0.5, vine, x1 - s * 0.05, -0.35, 0, fr);
        k.box(L, 0.32, 0.32, steel, xm, -0.35, PH - 0.32, fr); k.box(L, 0.5, 0.5, vine, xm, -0.35, PH - 0.42, fr);
        k.pl(vine, L, 0.9, xm, PH - 0.85, -0.38, 0, fr);
        k.box(L - 0.3, 0.42, 0.5, wood, xm, -0.55, 0, fr);                         // 앞 나무 화분 상자
        for (let i = 0; i < 10; i++) { const x = x0 + s * (0.3 + i * (L - 0.6) / 9); grassL.push([x, 0.7, k.fz(x) - 0.55 + (rnd() - .5) * 0.2, rnd() * 3]); fernL.push([x + 0.1, 0.55, k.fz(x) - 0.5, rnd() * 3]); }
        k.pl(GLOW(neonTex, 1.25, { transparent: true, depthWrite: false }), 2.0, 1.64, s * (aw + L / 2), 1.75, -1.5, 0, fr);
        k.box(2.1, 0.03, 0.03, steel, s * (aw + L / 2), -1.5, 2.6, fr); [-0.9, 0.9].forEach(o => k.box(0.012, PH - 2.6, 0.012, steel, s * (aw + L / 2) + o, -1.5, 2.6, fr));
      });

      // ── 양옆 덩굴 기둥 · 위 보 (옆 입면: 기둥 약 6.8 m 간격, 높이 약 4.9 m) · 지붕 트러스 + 흰 천 ───
      { const ZP = [-7.0, -13.7, -20.4], posts = [];
        [-1, 1].forEach(s => { const x = s * xs;
          ZP.forEach(z => posts.push([x, 0, z]));
          k.bxz(x - 0.16, x + 0.16, -D + 0.1, k.fz(x) - 0.35, 0.32, steel, PH - 0.32); k.bxz(x - 0.25, x + 0.25, -D + 0.05, k.fz(x) - 0.3, 0.5, vine, PH - 0.42);
          k.pl(vine, D - 0.6, 0.9, x - s * 0.27, PH - 0.8, (k.fz(x) - D) / 2, Math.PI / 2);
          k.pl(vine, D - 0.6, 0.6, x + s * 0.27, PH - 0.6, (k.fz(x) - D) / 2, Math.PI / 2); });
        k.inst(new THREE.BoxGeometry(0.36, PH, 0.36).translate(0, PH / 2, 0), steel, posts);
        k.inst(new THREE.BoxGeometry(0.5, PH - 0.2, 0.5).translate(0, (PH - 0.2) / 2, 0), vine, posts);
        k.bxz(-xs, xs, -D + 0.05, -D + 0.4, 0.32, steel, PH - 0.32); k.bxz(-xs, xs, -D, -D + 0.45, 0.5, vine, PH - 0.42);
        const TY = 5.55, TZ = [-0.6, -11.6, -D + 0.25], cloth = M(0xd0d4d8, { roughness: 1, side: THREE.DoubleSide, transparent: true, opacity: .3, depthWrite: false, emissive: 0x17191c, emissiveIntensity: .5 });
        [-1, 1].forEach(s => { truss(k.W(s * xs, TY, k.fz(s * xs) - 0.6), k.W(s * xs, TY, -D + 0.25), 0.35); [k.fz(s * xs) - 0.6, -D + 0.25].forEach(z => truss(k.W(s * xs, 0.02, z), k.W(s * xs, TY, z), 0.3)); });
        TZ.forEach(z => truss(k.W(-xs, TY, z), k.W(xs, TY, z), 0.35));
        for (let i = 0; i < 2; i++) k.flat(cloth, -xs, xs, TZ[i + 1] + 0.2, TZ[i] - 0.2, TY + 0.2);
      }

      // ── 반달 나무 안내데스크 (앞 왼쪽, 앞으로 볼록) · 의자 2 ───────────
      { const [cx, cz] = P(388, 272), a = 2.32 * W / 7.4, b = 1.9, t = 0.55, h = 1.02, ring = (A, B, T) => {
          const s = new THREE.Shape(); s.moveTo(A, 0); s.absellipse(0, 0, A, B, 0, -Math.PI, true); s.lineTo(-(A - T), 0); s.absellipse(0, 0, A - T, B - T, Math.PI, 2 * Math.PI, false); s.closePath(); return s; };
        const body = new THREE.ExtrudeGeometry(ring(a, b, t), { depth: h, bevelEnabled: false, curveSegments: 40 }); body.rotateX(-Math.PI / 2);
        const dm = new THREE.Mesh(body, lw); dm.position.set(cx, 0, cz); g.add(dm);
        const top = new THREE.ExtrudeGeometry(ring(a + 0.05, b + 0.05, t + 0.1), { depth: 0.05, bevelEnabled: false, curveSegments: 40 }); top.rotateX(-Math.PI / 2);
        const tm = new THREE.Mesh(top, M(0x4a2f1d, { roughness: .5, emissive: 0x24160c, emissiveIntensity: .5 })); tm.position.set(cx, h, cz); g.add(tm);
        const tx = new THREE.CylinderGeometry(1, 1, 0.3, 24, 1, true, -0.5, 1.0); tx.scale(a + 0.012, 1, b + 0.012);
        const tt = new THREE.Mesh(tx, M(0xffffff, { map: deskTex, transparent: true, roughness: .7 })); tt.position.set(cx, 0.62, cz); g.add(tt);
        k.inst(CHAIR, M(0x3a3f4a), [P(372, 255), P(372, 283)].map(([x, z]) => [x, 0, z, Math.PI]));
        for (let i = 0; i < 16; i++) { const q = Math.PI * (0.05 + 0.9 * i / 15), x = cx - Math.cos(q) * (a + 0.3), z = cz + Math.sin(q) * (b + 0.3); (i % 2 ? fernL : grassL).push([x, i % 2 ? 0.25 : 0.3, z, rnd() * 3]); }
      }
      // ── 키오스크: 데스크 옆 2 · 오른쪽 줄 5 (화단 위, 뒤 나무 살 판 + 청록 윗판) ─────
      const kiosk = (x, z, ry, back) => {
        const q = new THREE.Group(); q.position.set(x, back ? 0.12 : 0, z); q.rotation.y = ry; g.add(q);
        k.box(0.68, 0.08, 0.56, wht, 0, 0.04, 0, q);
        const b = new THREE.Group(); b.position.set(0, 0.08, 0); b.rotation.x = -0.1; q.add(b);
        k.box(0.62, 1.86, 0.13, wht, 0, 0, 0, b);
        k.pl(GLOW(kioskTex, 1.1), 0.5, 0.88, 0, 1.3, 0.067, 0, b);
        k.box(0.42, 0.06, 0.06, M(0x111418), 0, 0.08, 0.74, b);                    // 아래 홈
        if (back) { for (let i = 0; i < 6; i++) k.box(0.07, 1.5, 0.03, lw, -0.25 + i * 0.1, -0.085, 0.1, b);
          k.pl(E(0x2fd3c0, 1.1), 0.6, 0.22, 0, 1.72, -0.1, Math.PI, b); }
      };
      [P(420, 335), P(443, 335)].forEach(([x, z]) => kiosk(x, z, Math.PI / 2, false));
      [357, 405, 455, 503, 552].forEach(sx => {
        const [x, z] = P(sx, 420), [px, pz] = P(sx, 434), pm = new THREE.Group(); pm.position.set(px, 0, pz); pm.rotation.y = -0.3; g.add(pm);
        k.box(2.0, 0.12, 1.1, lawn, 0, 0, 0, pm);
        kiosk(x, z, -Math.PI / 2, true);
        for (let i = 0; i < 9; i++) { const u = 0.1 + rnd() * 0.85, v = (rnd() - .5) * 0.9, c = Math.cos(-0.3), sn = Math.sin(-0.3); flowers.push([px + u * c + v * sn, 0.2, pz - u * sn + v * c, rnd() * 3]); }
        grassL.push([px + 0.6, 0.42, pz - 0.2, 0], [px + 0.2, 0.42, pz + 0.3, 1]);
      });

      // ── 왼쪽: 화단 띠 · 벤치 3조 (방석 의자 2 + 나무 살 탁자) ────────────
      { const [x0] = P(0, 137), [x1] = P(0, 162);
        rr(x0, x1, P(565, 0)[1], P(285, 0)[1], 0.42, 0.14, lawn);
        trees.push([...P(318, 140)], [...P(415, 148)]); rocks.push([...P(487, 152), 0.32], [...P(300, 150), 0.22], [...P(535, 150), 0.26]);
        scatter(grassL, x0 + 0.1, x1 - 0.1, P(565, 0)[1] + 0.3, P(285, 0)[1] - 0.3, 22, 0.44); scatter(fernL, x0 + 0.1, x1 - 0.1, P(565, 0)[1] + 0.3, P(285, 0)[1] - 0.3, 14, 0.36);
        const stools = [];
        [318, 382, 435].forEach(sx => { const [x, z] = P(sx, 175);
          [-0.55, 0.55].forEach(o => stools.push([x, 0, z + o]));
          for (let i = 0; i < 5; i++) k.box(0.46, 0.035, 0.08, lw, x, z - 0.2 + i * 0.1, 0.42);
          [[-0.18, -0.16], [0.18, -0.16], [-0.18, 0.16], [0.18, 0.16]].forEach(([a, b]) => k.box(0.04, 0.42, 0.04, M(0x6b4a30), x + a, z + b)); });
        k.inst(new THREE.BoxGeometry(0.42, 0.36, 0.42).translate(0, 0.18, 0), M(0xc9b39a, { roughness: .9, emissive: 0x5a4c3c, emissiveIntensity: .6 }), stools);
        k.inst(new THREE.BoxGeometry(0.44, 0.08, 0.44).translate(0, 0.4, 0), M(0xe3cdb5, { roughness: .95, emissive: 0x665a4a, emissiveIntensity: .6 }), stools); }
      // 오른쪽 화단 띠 · 큰 둥근 돌
      { const [x0] = P(0, 483), [x1] = P(0, 506), z0 = P(590, 0)[1], z1 = k.fz(W) - 0.9;
        rr(x0, x1, z0, z1, 0.42, 0.14, lawn);
        trees.push([...P(465, 490)], [...P(565, 495)]); rocks.push([...P(395, 490), 0.42], [...P(420, 497), 0.3], [...P(330, 492), 0.26]);
        scatter(grassL, x0 + 0.1, x1 - 0.1, z0 + 0.3, z1 - 0.3, 22, 0.44); scatter(fernL, x0 + 0.1, x1 - 0.1, z0 + 0.3, z1 - 0.3, 14, 0.36); }

      // ── 가운데 왼쪽: 8자 갈색 길 · 둥근 화분 2 (나무 · 고사리) · 둥근 의자 ──────
      { const C1 = P(520, 230), C2 = P(510, 300), R = 1.45, pts = [];
        for (let i = 0; i <= 10; i++) { const t = -Math.PI / 2 - Math.PI * i / 10; pts.push([C1[0] + Math.cos(t) * R, C1[1] + Math.sin(t) * R]); }
        for (let i = 0; i <= 10; i++) { const t = -Math.PI / 2 + Math.PI * i / 10; pts.push([C2[0] + Math.cos(t) * R, C2[1] + Math.sin(t) * R]); }
        strip(pts, 0.55, M(0xa0704a, { roughness: .8, side: THREE.DoubleSide, emissive: 0x4a2e18, emissiveIntensity: .7 }), 0.075);
        [C1, C2].forEach(([x, z]) => {
          const p = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.45, 32), M(0x4b3424, { roughness: .8 })); p.position.set(x, 0.225, z); g.add(p);
          const tp = new THREE.Mesh(new THREE.CircleGeometry(0.95, 28), lawn); tp.rotation.x = -Math.PI / 2; tp.position.set(x, 0.46, z); g.add(tp);
          small.push([x, z]); for (let i = 0; i < 9; i++) { const q = rnd() * 6.3, d = 0.35 + rnd() * 0.5; fernL.push([x + Math.cos(q) * d, 0.7, z + Math.sin(q) * d, rnd() * 3]); }
        });
        const st = (l, m) => k.inst(new THREE.CylinderGeometry(0.2, 0.2, 0.42, 16).translate(0, 0.21, 0), m, l.map(([sx, sy]) => { const [x, z] = P(sx, sy); return [x, 0, z]; }));
        st([[465, 208], [471, 234], [541, 293], [518, 343]], M(0xeadfca, { roughness: .9, emissive: 0x6a6252, emissiveIntensity: .6 }));
        st([[475, 258], [486, 340], [505, 343], [545, 320], [497, 188]], M(0x8a6040, { roughness: .9, emissive: 0x4a3020, emissiveIntensity: .6 })); }

      // ── 뒤 잔디: 빈백(초록 · 회색 짠 것) · 팔레트 데크 2 · 나무 큐브 ───────
      { const big = BEAN.clone().scale(1.3, 1.25, 1.2);
        k.inst(big, M(0xa9b52c, { roughness: 1, emissive: 0x2a3008, emissiveIntensity: .5 }), [[730, 192], [660, 235], [718, 265], [660, 350], [715, 345]].map(([sx, sy]) => [...P(sx, sy).flatMap((v, i) => i ? [v] : [v, 0.05]), rnd() * 3]));
        k.inst(big, M(0x8a8d90, { roughness: 1, emissive: 0x2e3032, emissiveIntensity: .6 }), [[648, 178], [685, 192], [617, 207], [715, 307]].map(([sx, sy]) => [...P(sx, sy).flatMap((v, i) => i ? [v] : [v, 0.05]), rnd() * 3]));
        const pallet = (cx, cz, w, d, ry) => { const gs = [];
          for (let L = 0; L < 2; L++) { const y0 = 0.04 + L * 0.15;
            for (let i = 0; i < 7; i++) gs.push(new THREE.BoxGeometry(w, 0.025, 0.1).translate(0, y0 + 0.1375, -d / 2 + 0.05 + i * (d - 0.1) / 6));
            [-w / 2 + 0.05, 0, w / 2 - 0.05].forEach(x => { [-d / 2 + 0.06, 0, d / 2 - 0.06].forEach(z => gs.push(new THREE.BoxGeometry(0.1, 0.1, 0.12).translate(x, y0 + 0.075, z))); gs.push(new THREE.BoxGeometry(0.1, 0.025, d).translate(x, y0 + 0.0125, 0)); }); }
          const m = new THREE.Mesh(mergeGeometries(gs), M(0xd9b48a, { map: lightWood, roughness: .8, emissive: 0x5a3f26, emissiveIntensity: .6 })); m.position.set(cx, 0, cz); m.rotation.y = ry; g.add(m); };
        pallet(...P(715, 250), 2.1, 2.1, 0.55); pallet(...P(630, 295), 1.8, 2.2, -0.35);
        k.inst(new THREE.BoxGeometry(0.48, 0.45, 0.48).translate(0, 0.225, 0), lw, [P(680, 287), P(688, 355)].map(([x, z]) => [x, 0.04, z, 0.3]));
        trees.push([...P(725, 145)], [...P(728, 380)]);
        scatter(grassL, -W + 0.4, -W + 1.2, zL0 + 0.4, zL1 - 0.6, 8, 0.32); }
      // 오른쪽 뒤: 흰 책상 + 의자 2
      { const [x, z] = P(712, 440); k.box(0.7, 0.04, 1.4, wht, x, z, 0.72); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => k.box(0.035, 0.72, 0.035, M(0x1b1d20), x + a * 0.31, z + b * 0.66));
        k.inst(CHAIR, M(0xe9eaec, { roughness: .5 }), [P(705, 422), P(722, 422)].map(([cx, cz]) => [cx, 0, cz, -Math.PI / 2])); }

      // ── 뒤: 숲 사진 벽(뒤 칸 앞면 + 오른쪽 옆벽 안쪽) · 회의실(긴 탁자 + 의자 5 × 2) · 창고 ─────
      { const WH = 3.2, zf = zL0, [xw0] = P(0, 472), [xw1] = P(0, 495), zs = P(617, 0)[1], wall = M(0xf1f2f3, { roughness: .8 });
        k.bxz(-W + 0.1, W - 0.1, zf - 0.12, zf, WH, wall);
        k.pl(GLOW(forestTex, 0.95), xw0 - (-W + 0.2), WH - 0.2, (-W + 0.2 + xw0) / 2, WH / 2, zf + 0.01);
        k.bxz(xw0, xw1, zf, zs, WH, wall);
        k.pl(GLOW(forestTex, 0.9), zs - zf, WH - 0.2, xw0 - 0.01, WH / 2, (zf + zs) / 2, -Math.PI / 2);
        k.bxz(-W + 0.1, W - 0.1, -D, -D + 0.12, WH, wall); [-1, 1].forEach(s => k.bxz(s < 0 ? -W + 0.1 : W - 0.22, s < 0 ? -W + 0.22 : W - 0.1, -D, zf, WH, wall));
        const [xd] = P(0, 383); k.bxz(xd - 0.06, xd + 0.06, -D, zf, WH, wall);        // 회의실 | 창고 칸막이
        const [t0] = P(0, 172), [t1] = P(0, 360), zt = P(790, 0)[1];
        k.bxz(t0, t1, zt - 0.45, zt + 0.45, 0.04, M(0x8d9094, { roughness: .5 }), 0.72); [t0 + 0.2, t1 - 0.2].forEach(x => k.bxz(x - 0.04, x + 0.04, zt - 0.35, zt + 0.35, 0.72, M(0x5b5e62)));
        const ch = []; [185, 222, 258, 297, 333].forEach(sy => { const [x] = P(0, sy); ch.push([x, 0, zt + 0.75, 0], [x, 0, zt - 0.75, Math.PI]); });
        k.inst(CHAIR, M(0xf4f5f6, { roughness: .45 }), ch);
        k.flat(M(0x8e9295, { roughness: .9 }), -W + 0.22, xd - 0.06, -D + 0.12, zf - 0.12, 0.05); }

      // ── 나무 · 덤불 · 풀 · 고사리 · 꽃 · 돌 (인스턴스로 한 번에) ────────────
      { const trunk = [], c1 = [], c2 = [], cg1 = new THREE.IcosahedronGeometry(0.85, 1), cg2 = new THREE.IcosahedronGeometry(0.55, 1);
        trees.forEach(([x0, z], i) => { const x = Math.max(-W + 0.9, Math.min(W - 0.9, x0)); trunk.push([x, 0, z]); const L = i % 2 ? c1 : c2; L.push([x, 2.6, z, rnd() * 3]);
          for (let j = 0; j < 4; j++) { const q = rnd() * 6.3; (j % 2 ? c1 : c2).push([x + Math.cos(q) * 0.6, 2.1 + rnd() * 0.9, z + Math.sin(q) * 0.6, rnd() * 3]); }
          for (let j = 0; j < 4; j++) fernL.push([x + (rnd() - .5) * 1.2, 0.36, z + (rnd() - .5) * 1.2, rnd() * 3]); });
        k.inst(new THREE.CylinderGeometry(0.06, 0.1, 2.4, 6).translate(0, 1.2, 0), M(0x5a4636), trunk);
        k.inst(new THREE.CylinderGeometry(0.04, 0.06, 1.2, 6).translate(0, 1.05, 0), M(0x5a4636), small.map(([x, z]) => [x, 0, z]));
        small.forEach(([x, z]) => { c2.push([x, 1.9, z, 0]); [0, 2.1, 4.2].forEach(q => c1.push([x + Math.cos(q) * 0.35, 1.65, z + Math.sin(q) * 0.35, q])); });
        k.inst(cg1, leaf, c1.map(([x, y, z, r]) => [x, y, z, r])); k.inst(cg2, leaf2, c2.map(([x, y, z, r]) => [x, y, z, r]));
        k.inst(new THREE.ConeGeometry(0.06, 0.6, 4), reed, grassL);
        k.inst(new THREE.IcosahedronGeometry(0.26, 0).scale(1.2, 0.55, 1.2).translate(0, -0.08, 0), fern, fernL);
        k.inst(new THREE.IcosahedronGeometry(0.07, 0), M(0x9a6ad8, { roughness: .8, emissive: 0x3a1f66, emissiveIntensity: .8 }), flowers);
        rocks.forEach(([x, z, s]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(s, 12, 9), stone); m.scale.set(1, 0.7, 0.9); m.position.set(x, 0.14 + s * 0.35, z); g.add(m); }); }

      // 조명 (부스 자체 2개)
      k.spot([0, 5.2, 2.5], [-1.2, 1.0, -4.5], 0xfff2e0, 120, 0.75);
      k.spot([0, 5.3, -10], [-1.5, 0, -16.5], 0xf2f6ff, 110, 0.9);
      k.pool(-1.9, -4.6, 3.2, 0xffe6c0, 0.3); k.pool(-2.2, -10.2, 3.6, 0xfff0d0, 0.22); k.pool(-2.5, -16.6, 4.5, 0xe0f5d0, 0.22); k.pool(4.2, -7.6, 3.5, 0x8ffff0, 0.18);
    },
  };
};
