/* 바이오헬스 부스 — 시안 18장(첨부/2026-10-28 123911_1~18: 평면 top · 정면 front · 우측 right · 투시 바이오1~15) 보고 다시 지음 (10. 28. 담당자 의견) */
// 평면 top.jpg 가로 650~1380을 잘라 본 픽셀 → 부스 좌표. 평면 위 = 앞선, 평면 왼쪽 = +x(전시장 벽 쪽), 평면 오른쪽 = -x(옆 통로)
// 앞 오른쪽 모서리가 열린 입구: 잔디 빈백 + 곡선 LED · 그 위 곡선 「바이오헬스」 간판 → 파란 길 따라 처방 데스크 → 가운데 홀을 세 센터 게이트가 둘러쌈
export default ({ THREE, M, E, GLOW, canvasTex, B3, boothKit, CHAIR, FONT, LOW, figure }) => ({
  '바이오헬스'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr, WW = W + 0.2;
    const X = p => Math.max(-WW, Math.min(WW, (360 - p) / 47.1)), Z = p => Math.max(-D - 0.2, (80 - p) / 44.7), P = (a, b) => [X(a), Z(b)];
    const H = 3.1, HC = P(380, 600);                                                     // 벽 높이 · 가운데 홀
    const rep = (t, a, b) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(a, b); t.needsUpdate = true; return t; };
    const box = (w, h, d, m, x, z, y0 = 0, p = g) => k.box(w, h, d, m, x, z, y0, p);
    const poly = (m, pts, y = 0.06) => { const s = new THREE.Shape(); pts.forEach(([x, z], i) => i ? s.lineTo(x, -z) : s.moveTo(x, -z)); const q = new THREE.Mesh(new THREE.ShapeGeometry(s), m); q.rotation.x = -Math.PI / 2; q.position.y = y; g.add(q); return q; };
    const noise = (c, w, h, n, a) => { for (let i = 0; i < n; i++) { c.fillStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '0,0,0'},${Math.random() * a})`; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); } };

    // ---------- 재질 ----------
    const wh = M(0xf2f5fa, { roughness: .45, emissive: 0x8a93a3, emissiveIntensity: .55 });
    const whG = M(0xffffff, { roughness: .3, emissive: 0xb4bfd0, emissiveIntensity: .7 });
    const led = E(0xeaf4ff, 2.4), blk = M(0x101218, { roughness: .4 });
    const brushed = canvasTex(512, 512, (c, w, h) => { c.fillStyle = '#8f96a0'; c.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { const y = Math.random() * h; c.strokeStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '30,34,42'},${.04 + Math.random() * .09})`; c.lineWidth = 1 + Math.random() * 2; c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + Math.random() * 4 - 2); c.stroke(); } });
    const gy = M(0xffffff, { map: brushed, roughness: .35, metalness: .45, emissive: 0x3c424c, emissiveIntensity: .5 });

    // 로고: 원 + 궤도 3개 + 가운데 핵 (시안의 원자 마크)
    const atom = (c, x, y, r, col, lw) => {
      c.save(); c.translate(x, y); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = lw;
      c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke();
      for (let i = 0; i < 3; i++) { c.save(); c.rotate(i * Math.PI / 3 + Math.PI / 2); c.beginPath(); c.ellipse(0, 0, r * 0.86, r * 0.32, 0, 0, 7); c.stroke(); c.beginPath(); c.arc(r * 0.86, 0, lw * 1.1, 0, 7); c.fill(); c.restore(); }
      c.beginPath(); c.arc(0, 0, r * 0.2, 0, 7); c.stroke(); c.beginPath(); c.arc(0, 0, r * 0.07, 0, 7); c.fill(); c.restore();
    };
    const T = (c, t, x, y, f, col, al = 'left') => { c.font = f; c.fillStyle = col; c.textAlign = al; c.textBaseline = 'middle'; c.fillText(t, x, y); };
    const logoPanel = (w, h, vertical = false) => canvasTex(w, h, (c) => {      // 은색 판 + 흰 로고 · 바이오헬스
      c.drawImage(brushed.userData.canvas, 0, 0, w, h); c.fillStyle = 'rgba(70,76,88,.25)'; c.fillRect(0, 0, w, h);
      c.shadowColor = 'rgba(0,0,0,.45)'; c.shadowOffsetY = 4; c.shadowBlur = 8;
      if (vertical) { atom(c, w / 2, h * 0.16, w * 0.3, '#fff', w * 0.025); c.save(); c.translate(w / 2, h * 0.55); c.rotate(Math.PI / 2); T(c, '바이오헬스', 0, 0, `800 ${w * 0.34}px ${FONT}`, '#fff', 'center'); c.restore(); }
      else if (w > 2 * h) { atom(c, w * 0.27, h * 0.5, h * 0.32, '#fff', h * 0.03); T(c, '바이오헬스', w * 0.36, h * 0.53, `800 ${h * 0.46}px ${FONT}`, '#fff'); }
      else { atom(c, w * 0.5, h * 0.36, h * 0.17, '#fff', h * 0.014); T(c, '바이오헬스', w * 0.5, h * 0.7, `800 ${h * 0.14}px ${FONT}`, '#fff', 'center'); }
    });
    const cellTex = canvasTex(512, 288, (c, w, h) => {                                // 화면: 세포 · DNA (시안 TV 화면)
      const bg = c.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#060a2a'); bg.addColorStop(1, '#14206a'); c.fillStyle = bg; c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = 'lighter';
      [['#ff4fb8', .62, .5, .3], ['#5a7dff', .35, .45, .32], ['#c86bff', .75, .3, .18], ['#4fe0ff', .2, .7, .16]].forEach(([col, x, y, r]) => { const gr = c.createRadialGradient(w * x, h * y, 0, w * x, h * y, w * r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
      for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(255,255,255,${Math.random() * .6})`; c.beginPath(); c.arc(Math.random() * w, Math.random() * h, Math.random() * 3, 0, 7); c.fill(); }
      c.strokeStyle = 'rgba(160,220,255,.55)'; c.lineWidth = 2; for (let s = 0; s < 2; s++) { c.beginPath(); for (let x = 0; x <= w; x += 6) { const y = h * .82 + Math.sin(x / 22 + s * Math.PI) * 18; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
      c.globalCompositeOperation = 'source-over';
    });
    const raceTex = canvasTex(512, 288, (c, w, h) => {                                // 화면: 휠체어 레이싱 게임
      const sky = c.createLinearGradient(0, 0, 0, h * .45); sky.addColorStop(0, '#6fb6ff'); sky.addColorStop(1, '#cfe8ff'); c.fillStyle = sky; c.fillRect(0, 0, w, h * .45);
      c.fillStyle = '#4c9a3a'; c.fillRect(0, h * .45, w, h); c.fillStyle = '#2f6b2a'; for (let i = 0; i < 12; i++) c.fillRect(i * 46, h * .4, 30, h * .06);
      c.fillStyle = '#5a5f66'; c.beginPath(); c.moveTo(w * .44, h * .45); c.lineTo(w * .56, h * .45); c.lineTo(w * .95, h); c.lineTo(w * .05, h); c.fill();
      for (let i = 0; i < 9; i++) { const t = i / 9, y = h * (.45 + .55 * t), x0 = w * (.44 - .39 * t); c.fillStyle = i % 2 ? '#e8e8e8' : '#d8242a'; c.fillRect(x0 - 10 * t - 2, y, 10 * t + 3, h * .06); c.fillRect(w - x0 - 1, y, 10 * t + 3, h * .06); }
      c.fillStyle = '#fff'; c.fillRect(w * .495, h * .5, 4, h * .5);
      c.fillStyle = '#1a1d22'; c.fillRect(w * .42, h * .74, w * .16, h * .14); c.fillStyle = '#f2c200'; c.fillRect(w * .44, h * .72, w * .12, h * .05);
      c.fillStyle = 'rgba(0,0,0,.45)'; c.fillRect(10, 10, 120, 34); T(c, 'LAP 2/3', 20, 27, `700 20px ${FONT}`, '#fff');
    });
    const prodTex = canvasTex(512, 384, (c, w, h) => {                                // 진열 상품 (약 · 건강식품)
      c.fillStyle = '#e9edf2'; c.fillRect(0, 0, w, h); const cols = ['#e2483d', '#2f7de1', '#f2b632', '#3fae5a', '#ffffff', '#8a5bd6', '#f07ab0', '#1fb5b0'];
      for (let r = 0; r < 4; r++) { c.fillStyle = '#b9c0c9'; c.fillRect(0, (r + 1) * h / 4 - 8, w, 8); let x = 6; while (x < w - 20) { const bw = 16 + Math.random() * 26, bh = h / 4 * (.45 + Math.random() * .4); c.fillStyle = cols[Math.random() * cols.length | 0]; c.fillRect(x, (r + 1) * h / 4 - 8 - bh, bw, bh); c.fillStyle = 'rgba(255,255,255,.75)'; c.fillRect(x + 3, (r + 1) * h / 4 - 8 - bh * .6, bw - 6, bh * .22); x += bw + 3; } }
    });
    const anatTex = canvasTex(256, 640, (c, w, h) => {                                // 해부 테이블 화면 (누운 사람)
      c.fillStyle = '#05070c'; c.fillRect(0, 0, w, h); c.fillStyle = '#d9925e'; c.strokeStyle = '#a8432e'; c.lineWidth = 5;
      const e = (x, y, rx, ry) => { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, 7); c.fill(); c.stroke(); };
      e(128, 70, 34, 42); e(128, 200, 62, 95); e(128, 340, 52, 60); [-1, 1].forEach(s => { e(128 + s * 82, 230, 16, 95); e(128 + s * 30, 480, 22, 120); });
      c.strokeStyle = 'rgba(150,40,30,.6)'; c.lineWidth = 3; for (let i = 0; i < 18; i++) { c.beginPath(); c.moveTo(80 + Math.random() * 96, 130 + Math.random() * 420); c.lineTo(80 + Math.random() * 96, 130 + Math.random() * 420); c.stroke(); }
    });
    const gateHead = (en, ko) => canvasTex(1024, 168, (c, w, h) => {
      c.drawImage(brushed.userData.canvas, 0, 0, w, h); c.fillStyle = 'rgba(40,46,58,.28)'; c.fillRect(0, 0, w, h);
      c.shadowColor = 'rgba(0,0,0,.55)'; c.shadowOffsetY = 4; c.shadowBlur = 6; c.font = `800 66px ${FONT}`; let s = 66; while (c.measureText(en).width > w * .92) { s -= 2; c.font = `800 ${s}px ${FONT}`; }
      T(c, en, w / 2, h * .38, c.font, '#fff', 'center'); T(c, ko, w / 2, h * .78, `600 34px ${FONT}`, '#f4f7ff', 'center');
    });
    const green = (title, sub, w = 3.0, h = 1.6) => canvasTex(1024, Math.round(1024 * h / w), (c, cw, ch) => {   // 방 안 짙은 초록 안내판
      c.fillStyle = '#163b35'; c.strokeStyle = '#3b7b6e'; c.lineWidth = 10; c.beginPath(); c.roundRect(8, 8, cw - 16, ch - 16, 60); c.fill(); c.stroke();
      T(c, title, cw / 2, ch * .2, `800 ${Math.min(66, 1400 / title.length)}px ${FONT}`, '#fff', 'center'); if (sub) T(c, sub, cw / 2, ch * .34, `500 36px ${FONT}`, '#cfe7df', 'center');
      c.fillStyle = 'rgba(255,255,255,.4)'; for (let i = 0; i < 4; i++) c.fillRect(cw * .2, ch * (.5 + i * .1), cw * (.6 - (i % 2) * .12), 12);
    });
    const glassLogo = canvasTex(256, 512, (c, w, h) => { c.fillStyle = 'rgba(190,215,240,.16)'; c.fillRect(0, 0, w, h); atom(c, w / 2, h * .42, w * .32, 'rgba(255,255,255,.85)', 7); });
    const glassM = new THREE.MeshBasicMaterial({ map: glassLogo, transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
    const glass = new THREE.MeshBasicMaterial({ color: 0xbcd6f2, transparent: true, opacity: .16, depthWrite: false, side: THREE.DoubleSide });

    // ---------- 바닥: 회색 카펫 · 파란 길 · 잔디 ----------
    const cpt = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#626874'; c.fillRect(0, 0, w, h); noise(c, w, h, 3000, .09); c.strokeStyle = 'rgba(0,0,0,.16)'; c.lineWidth = 2; c.strokeRect(0, 0, w, h); });
    carpet.material = M(0xffffff, { map: rep(cpt, 1.7, 1.7), roughness: .95, emissive: 0x262a32, emissiveIntensity: .45 });
    const bluT = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#1c2fb0'; c.fillRect(0, 0, w, h); noise(c, w, h, 3500, .12); });
    const bluM = M(0xffffff, { map: rep(bluT, 1, 1), roughness: .95, emissive: 0x0c1870, emissiveIntensity: .55 });
    poly(bluM, [P(678, 205), P(220, 640), P(220, 665), P(330, 800), P(365, 792), P(678, 481)]);
    const C = [-7.52, 2.2], R = 10.0, F0 = -0.205, F1 = -1.455, FL = -0.85;            // 곡선 간판 원 (평면에서 맞춤)
    const onArc = (r, f) => [C[0] + r * Math.cos(f), C[1] + r * Math.sin(f)];
    const grassT = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#2f7a2c'; c.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { c.strokeStyle = `hsl(${95 + Math.random() * 30},${45 + Math.random() * 25}%,${20 + Math.random() * 25}%)`; c.lineWidth = 1.5; const x = Math.random() * w, y = Math.random() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.random() * 4 - 2, y - 4 - Math.random() * 6); c.stroke(); } });
    const gp = []; for (let i = 0; i <= 16; i++) gp.push(onArc(R - 0.28, FL + (F0 - FL) * i / 16));
    gp.push([gp[16][0], k.fz(gp[16][0]) - 0.05], [X(610), k.fz(X(610)) - 0.05]);
    poly(M(0xffffff, { map: rep(grassT, 1.2, 1.2), roughness: 1, emissive: 0x16380f, emissiveIntensity: .5 }), gp, 0.07);
    const bagGeo = new THREE.SphereGeometry(0.55, 18, 12).scale(1, 0.6, 1.05).translate(0, 0.3, 0);
    [[380, 120, 0x2433a8], [465, 120, 0x2433a8], [550, 128, 0x2433a8], [410, 175, 0x2c6a6a], [505, 170, 0x4b2a8a], [450, 225, 0x2433a8]].forEach(([a, b, col], i) => {
      const q = new THREE.Mesh(bagGeo, M(col, { roughness: .8, emissive: col, emissiveIntensity: .25 })); q.position.set(X(a), 0.06, Z(b)); q.rotation.set(-0.15, i * 1.3, 0); g.add(q);
      const bk = new THREE.Mesh(new THREE.SphereGeometry(0.42, 14, 10).scale(1, 0.75, 0.55), q.material); bk.position.set(0, 0.6, -0.42); q.add(bk);
    });

    // ---------- 곡선 간판 (흰 띠 3.35~4.6 m) + 그 아래 곡선 LED ----------
    const ring = (r0, r1, f0, f1, y0, h, m) => {
      const s = new THREE.Shape(), n = 56, pt = (r, f) => [C[0] + r * Math.cos(f), -(C[1] + r * Math.sin(f))];
      for (let i = 0; i <= n; i++) { const [x, y] = pt(r1, f0 + (f1 - f0) * i / n); i ? s.lineTo(x, y) : s.moveTo(x, y); }
      for (let i = n; i >= 0; i--) s.lineTo(...pt(r0, f0 + (f1 - f0) * i / n));
      const geo = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false }); geo.rotateX(-Math.PI / 2);
      const q = new THREE.Mesh(geo, m); q.position.y = y0; g.add(q); return q;
    };
    const cyl = (r, f0, f1, y0, h, m) => { const q = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 64, 1, true, Math.PI / 2 - f0, f0 - f1), m); q.position.set(C[0], y0 + h / 2, C[1]); g.add(q); return q; };
    ring(R - 0.27, R + 0.27, F0, F1, 3.35, 1.25, whG);
    ring(R - 0.3, R - 0.25, F0, F1, 3.3, 0.04, led); ring(R + 0.25, R + 0.3, F0, F1, 3.3, 0.04, led);
    const arcSign = canvasTex(4096, 420, (c, w, h) => {
      const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#e6ebf2'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      ['- Prescription Desk', '- Precision Health Screening Center', '- Mind-Body Wellness Center', '- Rehabilitation Medicine Center'].forEach((t, i) => T(c, t, w * 0.12, 96 + i * 74, `600 54px ${FONT}`, '#7a8392'));
      c.shadowColor = 'rgba(0,0,0,.35)'; c.shadowOffsetX = 6; c.shadowOffsetY = 8; c.shadowBlur = 10;
      atom(c, w * 0.44, h * 0.5, 150, '#1b1f2a', 13); T(c, '바이오헬스', w * 0.495, h * 0.53, `900 250px ${FONT}`, '#1b1f2a');
    });
    arcSign.repeat.set(-1, 1); arcSign.offset.set(1, 0);
    cyl(R - 0.28, F0, F1, 3.35, 1.25, GLOW(arcSign, 0.95, { side: THREE.BackSide }));
    ring(R - 0.25, R + 0.25, F0, FL, 0, 3.35, wh);                                       // LED 뒤 벽
    const ledT = canvasTex(1024, 512, (c, w, h) => {                                    // 대형 LED: 빛 번짐 (시안 화면)
      const bg = c.createLinearGradient(0, 0, w, 0); bg.addColorStop(0, '#7a0f6a'); bg.addColorStop(.35, '#e0306e'); bg.addColorStop(.6, '#f0802a'); bg.addColorStop(1, '#5a24c8'); c.fillStyle = bg; c.fillRect(0, 0, w, h);
      c.globalCompositeOperation = 'lighter';
      [['#ffe04a', .52, .5, .38], ['#ffffff', .5, .5, .12], ['#3fd0ff', .82, .25, .26], ['#ff4fd8', .22, .7, .3], ['#7a5cff', .9, .8, .25]].forEach(([col, x, y, r]) => { const gr = c.createRadialGradient(w * x, h * y, 0, w * x, h * y, w * r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
      for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2 + Math.random() * .05; c.strokeStyle = `rgba(255,${200 + Math.random() * 55 | 0},${150 + Math.random() * 100 | 0},${.08 + Math.random() * .12})`; c.lineWidth = 2 + Math.random() * 10; c.beginPath(); c.moveTo(w * .5, h * .5); c.lineTo(w * .5 + Math.cos(a) * w, h * .5 + Math.sin(a) * w); c.stroke(); }
      c.globalCompositeOperation = 'source-over'; c.fillStyle = 'rgba(0,0,0,.22)'; for (let x = 0; x < w; x += 6) c.fillRect(x, 0, 1, h); for (let y = 0; y < h; y += 6) c.fillRect(0, y, w, 1);
    });
    cyl(R - 0.27, F0 - 0.02, FL + 0.02, 0.2, 3.05, GLOW(ledT, 1.15, { side: THREE.BackSide }));
    { const lamps = []; for (let i = 0; i < 8; i++) { const f = -0.47 - i * 0.116, [x, z] = onArc(R - 0.55, f); lamps.push([x, 4.72, z, -f + Math.PI]); } k.inst(new THREE.BoxGeometry(0.16, 0.12, 0.3), blk, lamps); }
    // 간판 양 끝 기둥: 앞(로고 벽 옆, 흰) · 끝(처방 데스크 옆, 흰)
    { const [x0, z0] = onArc(R, F0), [x1, z1] = onArc(R, F1); box(0.6, 4.6, 0.6, whG, x0 + 0.15, z0 - 0.2); box(0.6, 4.6, 0.7, whG, Math.max(x1, -WW + 0.3), z1 + 0.15); }

    // ---------- 앞 왼쪽: 은색 로고 벽 (바이오헬스) ----------
    { const x0 = 2.7, x1 = WW, wv = x1 - x0, cx = (x0 + x1) / 2;
      box(wv, 3.05, 0.3, gy, cx, -0.2, 0, fr); box(wv, 0.4, 0.34, wh, cx, -0.2, 3.05, fr);
      k.pl(GLOW(logoPanel(1024, 780), 0.95), wv - 0.1, 2.85, cx, 1.55, -0.04, 0, fr);
      k.inst(new THREE.BoxGeometry(0.14, 0.12, 0.28), blk, [98, 145, 200].map(p => [X(p), 3.55, k.fz(X(p)) + 0.2])); }

    // ---------- 처방 데스크 (통합처방센터) — 파란 길 위 섬 카운터 ----------
    const IS = [P(440, 492), P(527, 578), P(630, 480), P(630, 360), P(605, 335)];      // 바깥 윤곽 (끝은 통로 쪽으로 깎임)
    const icx = IS.reduce((s, p) => s + p[0], 0) / 5, icz = IS.reduce((s, p) => s + p[1], 0) / 5;
    const segQ = (a, b, off = 0) => {                                                   // 두 점 사이 묶음: +z = 섬 바깥쪽
      const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), nx = -dz / L, nz = dx / L, mx = (a[0] + b[0]) / 2, mz = (a[1] + b[1]) / 2;
      const sgn = (icx - mx) * nx + (icz - mz) * nz > 0 ? -1 : 1, q = new THREE.Group();
      q.position.set(mx + sgn * nx * off, 0, mz + sgn * nz * off); q.rotation.y = Math.atan2(sgn * nx, sgn * nz); g.add(q); return [q, L];
    };
    const deskFace = (L, word) => canvasTex(1024, Math.round(1024 * 0.9 / (L - 0.12)), (c, w, h) => { c.drawImage(brushed.userData.canvas, 0, 0, w, h); c.fillStyle = 'rgba(60,66,78,.22)'; c.fillRect(0, 0, w, h); c.shadowColor = 'rgba(0,0,0,.4)'; c.shadowBlur = 6; atom(c, w - h * 0.6, h * 0.5, h * 0.3, '#fff', h * 0.03); if (word) T(c, '바이오헬스', w * 0.36, h * 0.5, `800 ${h * 0.3}px ${FONT}`, '#fff', 'center'); });
    const counter = [[4, 0, 1], [0, 1, 0], [1, 2, 2], [2, 3, 0]];                     // [시작, 끝, 앞면 종류] — 3→4(통로 쪽 입구)는 열어 둠
    counter.forEach(([i, j, kind]) => {
      const [q, L] = segQ(IS[i], IS[j], -0.3);
      box(L - 0.1, 0.95, 0.6, gy, 0, 0, 0, q); box(L + 0.02, 0.06, 0.72, whG, 0, 0.02, 0.95, q); box(L - 0.1, 0.03, 0.03, led, 0, 0.31, 0.88, q);
      if (kind) k.pl(GLOW(deskFace(L, kind === 2), 0.9), L - 0.12, 0.9, 0, 0.47, 0.305, 0, q);
      if (kind === 1) k.pl(GLOW(prodTex, 0.95), 1.4, 0.68, -0.2, 0.47, 0.33, 0, q);       // 가운데 열린 진열칸
      if (kind) [-0.3, 0.3].forEach(o => { const r = new THREE.Group(); r.position.set(o * (L - 1), 1.0, -0.05); q.add(r); box(0.55, 0.62, 0.3, M(0xc8cdd4, { metalness: .6, roughness: .3, transparent: true, opacity: .55 }), 0, 0, 0, r); k.pl(GLOW(prodTex, 0.95), 0.53, 0.58, 0, 0.31, 0.16, 0, r); });
    });
    [[620, 382], [575, 470], [545, 503]].forEach(([a, b]) => { const [x, z] = P(a, b); box(0.5, 0.8, 0.5, whG, x, z); box(0.46, 0.25, 0.46, M(0xffffff, { map: prodTex }), x, z, 0.8); });
    // 지붕 틀 (회색 · 아래 흰 빛줄 · 다운라이트) + 「✚ Prescription Desk (통합처방센터)」
    const rx = canvasTex(1024, 110, (c, w, h) => { c.drawImage(brushed.userData.canvas, 0, 0, w, h); c.fillStyle = 'rgba(60,66,78,.35)'; c.fillRect(0, 0, w, h); c.fillStyle = '#2fd05a'; c.fillRect(w * .1, h * .3, 46, 14); c.fillRect(w * .1 + 16, h * .3 - 16, 14, 46); T(c, 'Prescription Desk', w * .1 + 70, h * .52, `800 54px ${FONT}`, '#fff'); T(c, '(통합처방센터)', w * .1 + 560, h * .56, `600 34px ${FONT}`, '#fff'); });
    IS.forEach((a, i) => {
      const b = IS[(i + 1) % 5], [q, L] = segQ(a, b, 0.15);
      box(L + 0.3, 0.36, 0.4, gy, 0, 0, 2.8, q); box(L + 0.3, 0.03, 0.03, led, 0, 0.21, 2.79, q);
      if (i === 4 || i === 1) k.pl(GLOW(rx, 0.95), Math.min(L, 3.4), 0.31, 0, 2.98, 0.205, 0, q);
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.8, 8), whG); p.position.set(a[0], 1.9, a[1]); g.add(p);
    });
    { const dl = [], lp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      for (let t = 0.15; t < 0.95; t += 0.23) { const a = lp(IS[4], IS[0], t), b = lp(IS[2], IS[1], t); [0.25, 0.75].forEach(s => { const [x, z] = lp(a, b, s); dl.push([x, 2.79, z]); }); } k.inst(new THREE.CylinderGeometry(0.07, 0.07, 0.02, 12), E(0xffffff, 3), dl); }

    // ---------- 옆 통로 쪽 문 (흰 기둥 + 은색 보 「바이오헬스」) ----------
    { const z0 = Z(400), z1 = Z(690), x = -WW + 0.3; box(0.5, 4.0, 0.5, whG, x, z1 + 0.15); box(0.8, 0.85, z0 - z1, whG, -WW + 0.4, (z0 + z1) / 2, 3.15);
      const sg = logoPanel(1024, 300); [[-WW - 0.01, -Math.PI / 2], [-WW + 0.81, Math.PI / 2]].forEach(([px, ry]) => k.pl(GLOW(sg, 0.9), 2.6, 0.76, px, 3.58, (z0 + z1) / 2, ry)); }

    // ---------- 벽 · 센터 게이트 ----------
    const wallQ = (a, b) => {                                                           // 두 점 사이 벽 묶음 (+z = 홀 쪽)
      let [ax, az] = a, [bx, bz] = b; const mx = (ax + bx) / 2, mz = (az + bz) / 2;
      if (-(bz - az) * (HC[0] - mx) + (bx - ax) * (HC[1] - mz) < 0) [ax, az, bx, bz] = [bx, bz, ax, az];
      const q = new THREE.Group(); q.position.set(mx, 0, mz); q.rotation.y = -Math.atan2(bz - az, bx - ax); g.add(q); return [q, Math.hypot(bx - ax, bz - az)];
    };
    const wall = (a, b, t = 0.3, h = H, m = wh) => { const [q, L] = wallQ(a, b); box(L, h, t, m, 0, 0, 0, q); return [q, L]; };
    const gate = (a, b, en, ko) => {                                                    // 흰 바깥 틀 3.5 m · 은색 안 틀 · 글자 머리판 · 유리문 2짝
      const [q, L] = wallQ(a, b), gw = 4.4, hf = gw / 2;
      [[-L / 2, -hf], [hf, L / 2]].forEach(([x0, x1]) => x1 - x0 > 0.05 && box(x1 - x0, H, 0.4, wh, (x0 + x1) / 2, 0, 0, q));
      [-1, 1].forEach(s => { box(0.4, 3.5, 0.7, whG, s * (hf - 0.2), 0.05, 0, q); box(0.3, 2.95, 0.55, gy, s * (hf - 0.55), 0.05, 0, q); box(0.03, 2.95, 0.03, led, s * (hf - 0.415), 0.42, 0, q); });
      box(gw, 0.55, 0.7, whG, 0, 0.05, 2.95, q); box(gw - 0.8, 0.6, 0.55, gy, 0, 0.05, 2.35, q); box(gw - 0.8, 0.03, 0.03, led, 0, 0.42, 2.93, q);
      k.pl(GLOW(gateHead(en, ko), 0.95), gw - 0.86, 0.58, 0, 2.65, 0.335, 0, q);
      [-1, 1].forEach(s => k.pl(glassM, 0.72, 2.3, s * (hf - 1.08), 1.17, -0.02, 0, q));
      return [q, L];
    };
    gate(P(372, 345), P(100, 612), 'Precision Health Screening Center', '바이오 정밀 검진 센터');
    gate(P(100, 705), P(325, 912), 'Mind-Body Wellness Center', '웰니스케어센터');
    gate(P(630, 695), P(395, 912), 'Rehabilitation Medicine Center', '재활의학센터');
    wall(P(70, 190), P(205, 190), 0.15); wall(P(205, 190), P(345, 350), 0.15);         // 정밀검진 방 앞 벽
    const xf = X(100), zc = (Z(615) + Z(700)) / 2, zn = Z(905);
    box(WW - 0.3 - xf, H, 1.9, wh, (xf + WW - 0.3) / 2, zc);                            // 홀 왼쪽 짧은 벽
    box(1.5, H, 0.3, wh, 0, zn); box(1.2, H, Z(915) - Z(1185), wh, 0, (Z(915) + Z(1185)) / 2);   // 홀 끝 짧은 벽 · 뒤 두 방 사이 벽
    { const zt = k.fz(WW) - 0.35, zb = -D - 0.2; box(0.3, H, zt - zb, wh, WW - 0.15, (zt + zb) / 2); }   // 왼쪽 바깥 벽 (전시장 벽 쪽)
    box(2 * WW, H, 0.3, wh, 0, -D - 0.05);                                              // 뒤 벽
    // TV 「BIOHEALTH CURRICULUM」 + 화분 (홀 쪽 짧은 벽 둘)
    const lbl = canvasTex(512, 64, (c, w, h) => T(c, 'BIOHEALTH CURRICULUM', w / 2, h / 2, `800 34px ${FONT}`, '#1f2633', 'center'));
    const tv = (x, y, z, ry, w = 1.25, h = 0.72, map = cellTex) => { const q = new THREE.Group(); q.position.set(x, y, z); q.rotation.y = ry; g.add(q); box(w + 0.06, h + 0.06, 0.06, blk, 0, 0, -h / 2 - 0.03, q); k.pl(GLOW(map, 1.05), w, h, 0, 0, 0.035, 0, q); return q; };
    const plant = (x, z) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.45, 14), whG); p.position.set(x, 0.225, z); g.add(p); const lf = M(0x2e7d32, { roughness: .7, emissive: 0x123a14, emissiveIntensity: .5 }); for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6).scale(1, 4, 0.4), lf); const a = i / 7 * Math.PI * 2; l.position.set(x + Math.cos(a) * 0.12, 0.85, z + Math.sin(a) * 0.12); l.rotation.set(Math.sin(a) * 0.5, a, Math.cos(a) * 0.5); g.add(l); } };
    [[0, 1.7, zn + 0.185, 0, 0.45, zn + 0.55], [xf - 0.035, 1.7, zc, -Math.PI / 2, xf - 0.45, zc + 0.6]].forEach(([x, y, z, ry, px, pz]) => {
      tv(x, y, z, ry); const t = k.pl(GLOW(lbl, 0.9, { transparent: true }), 1.3, 0.16, x, 2.25, z, ry); t.position.add(new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry)).multiplyScalar(0.005)); plant(px, pz); });

    // ---------- 방 안: 짙은 초록 안내판 · 은색 로고 기둥 ----------
    const gpanel = (t, s, x, z, ry, w = 3.0, h = 1.6, y = 1.75) => k.pl(GLOW(green(t, s, w, h), 0.85, { transparent: true }), w, h, x, y, z, ry);
    const pillarT = logoPanel(256, 1024, true);
    [[WW - 0.45, Z(350), -Math.PI / 2], [WW - 0.45, Z(970), -Math.PI / 2], [-WW + 0.15, Z(950), -Math.PI / 2]].forEach(([x, z, ry], i) => {
      const hh = i === 2 ? 2.6 : H; box(0.5, hh, 0.6, gy, x + (i === 2 ? 0 : 0.15), z); k.pl(GLOW(pillarT, 0.9), 0.5, hh - 0.1, x + (i === 2 ? -0.26 : -0.11), hh / 2, z, ry); });

    // 정밀 검진 센터 (앞 왼쪽 방): 디지털 해부 테이블 · 높은 테이블 3 · 해부 화면 · 유전자 분석
    { const [ax, az] = P(140, 456), q = new THREE.Group(); q.position.set(ax, 0, az); g.add(q);
      box(0.6, 0.78, 1.7, blk, 0, 0, 0, q); box(0.95, 0.1, 2.1, blk, 0, 0, 0.78, q); const s = k.pl(GLOW(anatTex, 1.0), 0.86, 2.0, 0, 0.885, 0, 0, q); s.rotation.x = -Math.PI / 2; }
    [[122, 292, 0], [195, 310, 0.45], [255, 360, 0.6]].forEach(([a, b, r]) => { const [x, z] = P(a, b), q = new THREE.Group(); q.position.set(x, 0, z); q.rotation.y = r; g.add(q); box(1.2, 0.04, 0.6, whG, 0, 0, 1.02, q); [-0.55, 0.55].forEach(o => box(0.05, 1.02, 0.55, whG, o, 0, 0, q)); k.inst(CHAIR, blk, [-0.35, 0.35].map(o => [x + Math.cos(r) * o + Math.sin(r) * 0.6, 0, z - Math.sin(r) * o + Math.cos(r) * 0.6, r + Math.PI])); });
    gpanel('디지털 해부학 클리닉', '아나토마지', WW - 0.31, Z(456), -Math.PI / 2, 3.6, 1.9);
    [-0.85, 0.85].forEach(o => k.pl(GLOW(B3('bio_anat2'), 1.0), 1.5, 0.76, WW - 0.32, 1.6, Z(456) + o, -Math.PI / 2));
    { const [q, L] = wallQ(P(205, 190), P(345, 350)); k.pl(GLOW(green('유전자 분석 클리닉', '구강세포 DNA 실험', 3.2, 1.6), 0.85, { transparent: true }), 3.2, 1.6, 0.2, 1.7, 0.085, 0, q); }
    tv(X(150), 1.9, Z(190) - 0.11, Math.PI, 1.1, 0.62);
    // 웰니스케어 센터 (뒤 왼쪽 방): 안마 의자 2 · 테이블 3 · 인바디 3
    const camo = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#f4f6f8'; c.fillRect(0, 0, w, h); for (let i = 0; i < 26; i++) { c.fillStyle = `rgba(150,160,175,${.2 + Math.random() * .25})`; c.beginPath(); c.ellipse(Math.random() * w, Math.random() * h, 12 + Math.random() * 30, 8 + Math.random() * 18, Math.random() * 3, 0, 7); c.fill(); } });
    const shellM = M(0xffffff, { map: camo, roughness: .5, emissive: 0x6e7684, emissiveIntensity: .45, side: THREE.DoubleSide });
    [802, 878].forEach(b => {
      const [mx, mz] = P(111, b); k.flat(bluM, mx - 0.85, mx + 0.85, mz - 0.62, mz + 0.62, 0.065);
      const q = new THREE.Group(); q.position.set(mx - 0.25, 0, mz); g.add(q);
      const sh = new THREE.Mesh(new THREE.SphereGeometry(0.62, 24, 14, -0.62 * Math.PI, 1.24 * Math.PI, 0, 0.72 * Math.PI), shellM); sh.scale.set(1, 1.15, 1); sh.position.y = 0.95; q.add(sh);
      box(0.6, 0.12, 0.6, shellM, 0.05, 0, 0.5, q); box(0.05, 0.42, 0.05, gy, 0, 0, 0.1, q); box(0.7, 0.04, 0.08, gy, 0, 0, 0.08, q); box(0.08, 0.04, 0.7, gy, 0, 0, 0.08, q);
      box(0.05, 0.9, 0.05, gy, 0.95, 0, 0, q); tv(mx + 0.72, 1.05, mz, -Math.PI / 2, 0.38, 0.26);
    });
    [986, 1057, 1130].forEach(b => { const [x, z] = P(282, b); box(0.72, 0.75, 1.25, whG, x, z); k.inst(CHAIR, blk, [[x + 0.75, 0, z - 0.3, -Math.PI / 2], [x + 0.75, 0, z + 0.3, -Math.PI / 2], [x - 0.75, 0, z - 0.3, Math.PI / 2], [x - 0.75, 0, z + 0.3, Math.PI / 2]]); });
    tv(0.635, 1.75, Z(1057), Math.PI / 2, 1.4, 0.8);
    [1022, 1085, 1147].forEach(b => { const [x, z] = P(105, b); k.flat(bluM, x - 0.45, x + 0.45, z - 0.28, z + 0.28, 0.065); box(0.4, 0.06, 0.5, blk, x, z, 0.06); box(0.05, 0.95, 0.05, gy, x + 0.22, z, 0.06); box(0.06, 0.04, 0.5, gy, x + 0.22, z, 1.0); tv(x + 0.2, 1.15, z, -Math.PI / 2 + 0.4, 0.24, 0.17); });
    gpanel('체성분 데이터 분석', '인바디', WW - 0.31, Z(1085), -Math.PI / 2, 3.2, 1.6);
    gpanel('디지털 생체 신호 분석', '', 3.4, -D + 0.11, 0, 3.0, 1.5);
    // 재활의학 센터 (뒤 오른쪽 방): 검정 운동 매트 · 휠체어 레이싱 2 · 키오스크
    k.flat(M(0x15171c, { roughness: .95 }), -WW + 0.3, X(558), -D + 0.1, Z(700), 0.065);
    [982, 1120].forEach(b => {
      const [x, z] = P(430, b); k.flat(M(0x0e0f12), x - 0.85, x + 0.85, z - 0.62, z + 0.62, 0.067);
      box(1.1, 0.12, 0.8, M(0xf2c200, { emissive: 0x806000, emissiveIntensity: .4 }), x, z, 0.07);
      const q = new THREE.Group(); q.position.set(x - 0.1, 0.12, z); g.add(q); box(0.45, 0.06, 0.45, blk, 0, 0, 0.45, q); box(0.05, 0.45, 0.45, blk, -0.22, 0, 0.5, q);
      [-1, 1].forEach(s => { const w = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 6, 22), gy); w.position.set(0, 0.32, s * 0.27); q.add(w); });
      tv(-0.635, 1.7, z, -Math.PI / 2, 1.35, 0.76, raceTex);
    });
    { const [x, z] = P(453, 1050); const c = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.0, 20), gy); c.position.set(x, 0.5, z); g.add(c); tv(-0.635, 1.6, z, -Math.PI / 2, 0.36, 0.62, raceTex); }
    const ball = new THREE.SphereGeometry(0.13, 12, 10); [[600, 820], [610, 1040], [590, 1100]].forEach(([a, b]) => { const [x, z] = P(a, b); const s = new THREE.Mesh(ball, blk); s.position.set(x, 0.2, z); g.add(s); });
    gpanel('재활 스포츠 챌린지', '휠체어 레이싱', -2.2, -D + 0.11, 0, 2.8, 1.5);
    gpanel('인바디 측정에 따른 미션', '신체 미션', -4.9, -D + 0.11, 0, 2.8, 1.5);
    // 옆 통로 쪽 낮은 벽 2.45 m (유리 창 2칸 · 가운데 로고 기둥)
    { const x = -WW + 0.15, zA = Z(690), zB = -D - 0.2;
      box(0.3, 0.55, zA - zB, wh, x, (zA + zB) / 2); box(0.3, 0.2, zA - zB, wh, x, (zA + zB) / 2, 2.25);
      [[zB, -24.4], [-19.9, -19.0], [-14.1, zA]].forEach(([a, b]) => box(0.3, 1.7, b - a, wh, x, (a + b) / 2, 0.55));
      [[-24.4, -19.9], [-19.0, -14.1]].forEach(([a, b]) => { k.pl(glass, b - a, 1.7, x, 1.4, (a + b) / 2, Math.PI / 2); box(0.34, 0.04, b - a, gy, x, (a + b) / 2, 0.55); box(0.34, 0.04, b - a, gy, x, (a + b) / 2, 2.21); }); }

    // ---------- 사람 (크기 비교) · 조명 ----------
    const pm = M(0xeef1f5, { roughness: .6, emissive: 0x5a6270, emissiveIntensity: .5 });
    [[600, 420], [560, 520], [350, 470], [120, 380], [180, 1000], [520, 1070], [610, 960], [500, 640]].forEach(([a, b]) => figure(g, X(a), Z(b), pm));
    k.spot([-4.5, 8, 1.5], [-1.2, 3.8, -4.6], 0xf4f8ff, 170, 0.55); k.spot([-1.5, 8, -9.5], [-1, 0, -11.5], 0xe6eeff, 120, 0.8);
    k.pool(-0.8, -11.5, 4.5, 0x9fc4ff, 0.25); k.pool(-2.2, -1.8, 3.4, 0xffb0e0, 0.28); k.pool(icx, icz, 2.6, 0xdfe8ff, 0.25);
  },
});
