/* 그린바이오 부스 — 시안 「2026 CO-SHOW : Green Bio Express 3D 시안(10. 19.)」 greenbio_02~30 보고 지음 (10. 27.) */
// 시안 평면도(28.5 × 12.5 m)를 90° 돌려 부스 칸에 맞춤: 평면 왼쪽(기운 변) = 앞선, 평면 아래(1관 플랫폼 · 4관 다이닝) = 오른쪽(+x)
export default ({ THREE, M, E, GLOW, canvasTex, textTex, B3, boothKit, CHAIR, FONT, mergeGeometries }) => ({
  '그린바이오'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr;
    const X = v => Math.max(-W, Math.min(W, (v - 557) * 0.0249)), Z = u => -(u - 182) * 0.0265;   // 평면도 픽셀 → 부스 좌표
    const wh = M(0xf2f5fa, { roughness: .5, emissive: 0x7a8290, emissiveIntensity: .5 }), gy = M(0xaab1bb, { roughness: .35, metalness: .5, emissive: 0x3a4048, emissiveIntensity: .4 });
    const dk = M(0x16181d, { roughness: .6 }), cy = E(0x4fe3ff, 2.2), grn = M(0x8fd13a, { roughness: .4, emissive: 0x5a9a14, emissiveIntensity: .8 });
    const wood = M(0x5a3820, { roughness: .45, emissive: 0x2a1608, emissiveIntensity: .5 });
    carpet.material = M(0x45484e, { roughness: .95 });
    const xT = X(495), zP = Z(485), z23 = Z(815), zC = Z(870), zS = Z(1150), z2 = Z(285);
    const rep = (t, a, b) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(a, b); return t; };
    const poly = (m, pts, y = 0.06) => { const s = new THREE.Shape(); pts.forEach(([x, z], i) => i ? s.lineTo(x, -z) : s.moveTo(x, -z)); const q = new THREE.Mesh(new THREE.ShapeGeometry(s), m); q.rotation.x = -Math.PI / 2; q.position.y = y; g.add(q); return q; };
    const leaf = canvasTex(512, 256, (c, w, h) => { c.fillStyle = '#16351a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 420; i++) { c.fillStyle = `hsl(${85 + Math.random() * 40},${50 + Math.random() * 30}%,${22 + Math.random() * 30}%)`; c.beginPath(); c.ellipse(Math.random() * w, Math.random() * h, 6 + Math.random() * 16, 3 + Math.random() * 7, Math.random() * 3, 0, 7); c.fill(); } });
    // 바닥: 플랫폼 흰 타일 · 열차 통로 흰 바닥 · 다이닝 검정+금색 무늬
    const tile = rep(canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#eef0f3'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c3c8cf'; c.lineWidth = 3; c.strokeRect(0, 0, w, h); }), 1 / 0.6, 1 / 0.6);
    poly(M(0xffffff, { map: tile, roughness: .35, emissive: 0x555a62, emissiveIntensity: .5 }), [[xT, k.fz(xT)], [W, k.fz(W)], [W, zP], [xT, zP]]);
    k.flat(M(0xeef0f3, { roughness: .4, emissive: 0x555a62, emissiveIntensity: .5 }), -W, xT, zS, z2);
    const arrow = canvasTex(256, 256, (c, w, h) => { c.strokeStyle = 'rgba(70,76,86,.9)'; c.lineWidth = 6; c.strokeRect(20, 20, w - 40, h - 40); c.lineWidth = 9; [70, 128, 186].forEach(x => { c.beginPath(); c.moveTo(x - 22, 150); c.lineTo(x, 110); c.lineTo(x + 22, 150); c.stroke(); }); });
    const arM = new THREE.MeshBasicMaterial({ map: arrow, transparent: true, color: 0xffffff });
    [-4.2, -7.4, -18.6, -21.4, -24.0].forEach(z => k.flat(arM, -3.6 - 0.9, -3.6 + 0.9, z - 0.8, z + 0.8, 0.07));
    const lat = canvasTex(128, 128, (c, w, h) => { c.fillStyle = '#0d0d10'; c.fillRect(0, 0, w, h); c.strokeStyle = '#b08a3a'; c.lineWidth = 4; c.strokeRect(24, 24, 80, 80); c.beginPath(); c.moveTo(64, 34); c.lineTo(94, 64); c.lineTo(64, 94); c.lineTo(34, 64); c.closePath(); c.stroke(); });
    k.flat(M(0xffffff, { map: rep(lat, 4, 13), roughness: .7, emissive: 0x202020, emissiveIntensity: .4 }), xT + 0.15, X(650), zC, zP);
    k.flat(M(0xf2c200, { emissive: 0x806000, emissiveIntensity: .6 }), xT + 0.15, xT + 0.45, zP, z2 + 0.2, 0.07);   // 노란 승강장 선
    k.flat(M(0x6a7078), -0.95, -0.65, -7.6, -0.6, 0.07);

    // 1. 얼음 기관차 (앞쪽 왼쪽, 시안 11)
    const ice = M(0xbcd3e0, { roughness: .25, metalness: .2, emissive: 0x3a5868, emissiveIntensity: .55 });
    const L = new THREE.Group(); L.position.set((-W + xT) / 2, 0, 0); fr.add(L);
    const wL = xT + W - 0.3;
    k.box(wL + 0.1, 0.45, 2.5, dk, 0, -1.5, 0, L); k.box(wL, 2.6, 2.4, ice, 0, -1.55, 0.4, L);
    k.pl(GLOW(B3('greenbio_loco'), 0.9), wL, 3.0, 0, 1.5, -0.34, 0, L);
    [-1, 1].forEach(s => { k.pl(GLOW(B3('greenbio_side'), 0.85), 2.4, 3.0, s * (wL / 2 + 0.01), 1.5, -1.55, s * Math.PI / 2, L); k.box(0.04, 0.06, 2.4, cy, s * (wL / 2 + 0.02), -1.55, 0.5, L); });
    k.box(wL + 0.05, 0.06, 0.06, cy, 0, -0.32, 0.48, L);
    k.box(1.1, 0.3, 0.6, dk, 0, -1.0, 3.0, L);
    [-0.3, 0, 0.3].forEach(x => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), E(0xffffff, 2.5)); b.position.set(x, 3.15, -0.7); L.add(b); });
    // 2. 열차 칸 벽: 바깥 벽 · 플랫폼 쪽 벽(탑승 문) · 다이닝 쪽 벽
    k.bxz(-W, -W + 0.2, zS, z2, 3.6, wh);
    const car = M(0xc9d2da, { roughness: .35, metalness: .3, emissive: 0x4a525c, emissiveIntensity: .5 });
    k.bxz(xT - 0.15, xT + 0.15, -4.6, z2, 3.4, car); k.bxz(xT - 0.15, xT + 0.15, zP, -6.9, 3.4, car); k.bxz(xT - 0.15, xT + 0.15, -6.9, -4.6, 1.0, car, 2.4);
    [-4.6, -6.9].forEach(z => k.box(0.06, 2.4, 0.08, cy, xT + 0.17, z, 0));
    k.bxz(xT - 0.15, xT + 0.15, zC, zP, 3.6, wh);
    // 조종실: 기후 관제 화면 + 조종 콘솔 (시안 13)
    k.pl(GLOW(B3('greenbio_climate'), 1.05), 3.6, 1.9, -W + 0.21, 2.15, -5.8, Math.PI / 2);
    k.box(0.75, 0.95, 3.4, gy, -W + 0.6, -5.8);
    const scr = M(0x0a0f18, { emissive: 0x2f7dff, emissiveIntensity: .9 });
    k.inst(new THREE.BoxGeometry(0.3, 0.2, 0.03), scr, [-6.9, -6.2, -5.4, -4.7].map(z => [-W + 0.45, 1.05, z, Math.PI / 2]));
    // 기후위기 시뮬레이션 키오스크
    k.box(0.6, 1.1, 1.4, wh, X(462), Z(518)); k.pl(GLOW(B3('greenbio_climate'), 0.9), 1.2, 0.62, X(462) - 0.31, 1.45, Z(518), -Math.PI / 2);
    // 3. 연료밸브존: 검정 파이프 벽 · 초록 파이프 · 바이오연료 탱크 (시안 17~20)
    const vz0 = Z(555), vz1 = z23, vL = vz0 - vz1;
    [0, 1, 2].forEach(i => { const z = vz0 - vL / 6 - i * vL / 3; k.pl(GLOW(B3('greenbio_pipe'), 0.85), vL / 3, 3.3, -W + 0.21, 1.7, z, Math.PI / 2); k.pl(GLOW(B3('greenbio_pipe'), 0.85), vL / 3, 3.3, xT - 0.16, 1.7, z, -Math.PI / 2); });
    const pipe = (len, x, y, z, rx = 0, rz = 0) => { const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, len, 10), grn); p.position.set(x, y, z); p.rotation.set(rx, 0, rz); g.add(p); };
    [-W + 0.35, xT - 0.3].forEach(x => { pipe(vL, x, 2.95, (vz0 + vz1) / 2, Math.PI / 2); pipe(vL, x, 0.35, (vz0 + vz1) / 2, Math.PI / 2); for (let i = 0; i <= 4; i++) pipe(2.6, x, 1.65, vz0 - i * vL / 4); });
    const tz = Z(690), tx = (-W + xT) / 2;
    k.box(xT - 0.15 + W - 0.2, 0.1, 0.22, grn, tx, tz, 0.06);
    { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.7, 28), wh); b.position.set(tx, 0.35, tz); g.add(b);
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.8, 28), new THREE.MeshStandardMaterial({ color: 0x8fdc3a, emissive: 0x5fcf2a, emissiveIntensity: 1.1, roughness: .2, transparent: true, opacity: .92 })); t.position.set(tx, 1.6, tz); g.add(t);
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.56, 0.14, 28), wh); c.position.set(tx, 2.57, tz); g.add(c);
      const r = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.04, 6, 40), wh); r.rotation.x = Math.PI / 2; r.position.set(tx, 0.08, tz); g.add(r); }
    // 4. 3관 미래식량 재배실: 곤충전시 · 식물 선반 · 아쿠아포닉스 · 수직농장 (시안 21~24)
    k.bxz(-W + 0.2, -W + 0.75, Z(1025), Z(830), 0.9, wh);
    k.inst(new THREE.BoxGeometry(0.42, 0.36, 0.42), new THREE.MeshStandardMaterial({ color: 0xd8f0ff, transparent: true, opacity: .35, roughness: .1 }), [0, 1, 2, 3, 4].map(i => [-W + 0.48, 1.08, Z(850) - i * 1.0]));
    [Z(860), Z(960)].forEach(z => { k.bxz(-W + 0.2, -W + 0.6, z - 1.3, z + 1.3, 0.04, wh, 1.75); k.bxz(-W + 0.2, -W + 0.6, z - 1.3, z + 1.3, 0.04, wh, 2.45); k.pl(GLOW(leaf, 0.75), 2.5, 0.5, -W + 0.22, 2.05, z, Math.PI / 2); k.pl(GLOW(leaf, 0.75), 2.5, 0.5, -W + 0.22, 2.75, z, Math.PI / 2); });
    const aq0 = -18.4, aq1 = Z(1040);
    k.bxz(X(467), X(503), aq1, aq0, 0.85, wh); k.flat(GLOW(rep(leaf.clone(), 1, 4), 0.8), X(467) + 0.05, X(503) - 0.05, aq1 + 0.05, aq0 - 0.05, 0.86);
    k.pl(GLOW(B3('greenbio_farm'), 0.95), xT - (-W) - 0.25, 3.05, (-W + xT) / 2, 1.6, zS + 0.01);
    // 5. 미세조류 실험실 (창고 앞면, 시안 25) · 창고
    k.bxz(-W, W, -D, zS, 3.3, wh);
    [0.2, 2.35, 4.5].forEach(x => k.pl(GLOW(B3('greenbio_algae'), 1.0), 2.0, 2.74, x, 1.45, zS + 0.01));
    { const t = k.txt(['MICROALGAE LAB CABIN'], 2.4, 0.3, { bg: '#1c1f26', fg: '#fff', size: 120 }, 1.0); t.position.set(2.35, 3.05, zS + 0.02); g.add(t); }
    // 6. 4관 다이닝칸: 나무 벽 + 기차 창(화면 3개) · 머리 띠 · 소파석 · 주문 카운터 (시안 27~30)
    k.pl(wood, zP - zC, 3.6, xT + 0.16, 1.8, (zP + zC) / 2, Math.PI / 2);
    [-9.9, -13.1, -16.3].forEach(z => k.pl(GLOW(B3('greenbio_dine'), 0.95), 2.7, 1.47, xT + 0.17, 1.75, z, Math.PI / 2));
    k.bxz(xT + 0.15, X(565), zC, zP, 0.45, wh, 2.95);
    { const t = k.txt(['FUTURE DINING CABIN'], 2.2, 0.3, { bg: '#1c1f26', fg: '#fff', size: 120 }, 1.0); t.position.set(X(565) + 0.01, 3.17, -13.1); t.rotation.y = Math.PI / 2; g.add(t); }
    const SOFA = mergeGeometries([new THREE.BoxGeometry(1.1, 0.45, 0.6).translate(0, 0.225, 0), new THREE.BoxGeometry(1.1, 1.0, 0.16).translate(0, 0.5, 0.3)]);
    const sx = X(583);
    k.inst(SOFA, wh, [[sx, 0, -8.75, 0], [sx, 0, -10.85, Math.PI], [sx, 0, -15.5, 0], [sx, 0, -17.6, Math.PI]]);
    k.inst(new THREE.BoxGeometry(1.0, 0.75, 0.8), wood, [[sx, 0.375, -9.8], [sx, 0.375, -16.55]]);
    const cz0 = Z(612), cz1 = Z(730), cxF = X(612);
    k.bxz(cxF - 0.3, cxF, cz1, cz0, 1.05, wood); k.bxz(X(567), cxF, cz0 - 0.3, cz0, 1.05, wood); k.bxz(X(567), cxF, cz1, cz1 + 0.3, 1.05, wood);
    const marble = M(0xf4f2ee, { roughness: .2, emissive: 0x6a6660, emissiveIntensity: .5 });
    k.bxz(cxF - 0.35, cxF + 0.05, cz1, cz0, 0.05, marble, 1.05);
    // 다이닝 아래쪽: 대체식품 전시 테이블 · 큐브 의자
    k.bxz(X(692), X(735), Z(750), Z(630), 0.9, wh);
    k.inst(new THREE.CylinderGeometry(0.14, 0.14, 0.03, 16), marble, [0, 1, 2, 3].flatMap(i => [[X(703), 0.92, Z(645) - i * 0.8], [X(724), 0.92, Z(645) - i * 0.8]]));
    k.inst(new THREE.BoxGeometry(0.05, 0.75, 0.5), wh, [0, 1, 2, 3].map(i => [X(714), 1.27, Z(645) - i * 0.8]));
    const st = [], stT = [];
    [-9.2, -11.0, -15.8, -17.5].forEach(z => { stT.push([4.6, 0.275, z]); [-1, 1].forEach(a => [-1, 1].forEach(b => st.push([4.6 + a * 0.6, 0.21, z + b * 0.28]))); });
    // 7. 클로렐라 체험존: ㄷ자 테이블 + 큐브 의자 (시안 26)
    const u0 = Z(955), u1 = Z(1075);
    k.bxz(X(615), X(635), u1, u0, 0.75, wh); k.bxz(X(615), X(725), u0 - 0.5, u0, 0.75, wh); k.bxz(X(615), X(725), u1, u1 + 0.5, 0.75, wh);
    for (let i = 0; i < 5; i++) st.push([X(603), 0.21, u0 - 0.3 - i * (u0 - u1 - 0.6) / 4]);
    [2.1, 2.8, 3.5, 4.2].forEach(x => st.push([x, 0.21, u0 + 0.45], [x, 0.21, u1 - 0.45]));
    k.inst(new THREE.BoxGeometry(0.42, 0.42, 0.42), wh, st); k.inst(new THREE.BoxGeometry(0.55, 0.55, 0.55), wh, stT);
    k.bxz(W - 0.15, W, zS, -4.2, 1.0, wh);                                       // 오른쪽 낮은 흰 벽
    // 8. 1관 플랫폼: 안내 데스크(COSS) · 아치 「GREENBIO EXPRESS」 · 출발 안내판 · 가챠머신 · 환영 화면 (시안 06~10)
    const U = (w, d, r, t) => { const s = new THREE.Shape(), a = w / 2, b = a - t, q = Math.max(r - t, 0.05);
      s.moveTo(-a, d); s.lineTo(-a, r); s.quadraticCurveTo(-a, 0, -a + r, 0); s.lineTo(a - r, 0); s.quadraticCurveTo(a, 0, a, r); s.lineTo(a, d); s.lineTo(b, d); s.lineTo(b, t + q); s.quadraticCurveTo(b, t, b - q, t); s.lineTo(-b + q, t); s.quadraticCurveTo(-b, t, -b, t + q); s.lineTo(-b, d); s.closePath(); return s; };
    const ds = U(2.5, 2.4, 0.45, 0.32), dg = new THREE.Group(); dg.position.set(X(647), 0, -0.55); g.add(dg);
    { const m = new THREE.Mesh(new THREE.ExtrudeGeometry(ds, { depth: 1.0, bevelEnabled: false }), gy); m.rotation.x = -Math.PI / 2; dg.add(m);
      const t = new THREE.Mesh(new THREE.ExtrudeGeometry(ds, { depth: 0.05, bevelEnabled: false }), wh); t.rotation.x = -Math.PI / 2; t.position.y = 1.0; dg.add(t); }
    k.pl(GLOW(B3('greenbio_desk'), 0.95), 1.6, 0.62, 0, 0.55, 0.01, 0, dg);
    const A = new THREE.Group(); A.position.set(2.25, 0, -3.75); A.rotation.y = 0.2; g.add(A);
    { const R = 3.35, a = new THREE.Mesh(new THREE.TorusGeometry(R, 0.22, 8, 48, Math.PI), wh); a.scale.set(1, 1.32, 2.4); A.add(a);
      [-1, 1].forEach(s => { const l = new THREE.Mesh(new THREE.TorusGeometry(R - 0.23, 0.025, 6, 48, Math.PI), cy); l.scale.set(1, 1.32, 1); l.position.z = s * 0.4; A.add(l); });
      const t = k.txt(['GREENBIO EXPRESS'], 4.0, 0.55, { fg: '#fff', size: 200 }, 1.15); t.position.set(0, 3.75, 0.56); A.add(t);
      k.box(0.05, 4.3 - 1.95, 0.05, dk, 0, 0, 1.95, A);
      k.box(2.7, 0.62, 0.08, dk, 0, -0.05, 2.75, A); k.pl(GLOW(B3('greenbio_board'), 1.1), 2.6, 0.55, 0, 3.06, 0.0, 0, A);
      const arw = (txt, left) => canvasTex(512, 96, (c, w, h) => { c.fillStyle = '#1d4fb8'; c.beginPath(); if (left) { c.moveTo(0, h / 2); c.lineTo(40, 6); c.lineTo(w - 6, 6); c.lineTo(w - 6, h - 6); c.lineTo(40, h - 6); } else { c.moveTo(w, h / 2); c.lineTo(w - 40, 6); c.lineTo(6, 6); c.lineTo(6, h - 6); c.lineTo(w - 40, h - 6); } c.closePath(); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 4; c.stroke(); c.fillStyle = '#fff'; c.font = `600 40px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w / 2, h / 2 + 2); });
      k.pl(GLOW(arw('<<  ENTRANCE   1', true), 1.0, { transparent: true }), 1.3, 0.24, -0.7, 2.2, 0.05, 0, A);
      k.pl(GLOW(arw('3   ENTRANCE  >', false), 1.0, { transparent: true }), 1.3, 0.24, 0.7, 2.2, 0.05, 0, A); }
    const gacha = canvasTex(256, 320, (c, w, h) => { c.fillStyle = '#dfe9ef'; c.fillRect(0, 0, w, h); const C = ['#ff5a7a', '#ffd23f', '#3fd0ff', '#7ee05a', '#b48bff', '#ff9a3c']; for (let i = 0; i < 70; i++) { c.fillStyle = C[i % 6]; c.beginPath(); c.arc(20 + Math.random() * (w - 40), 30 + Math.random() * (h - 50), 14, 0, 7); c.fill(); } c.strokeStyle = '#9aa4ad'; c.lineWidth = 10; c.strokeRect(0, 0, w, h); });
    [-5.05, -6.15].forEach(z => { k.box(0.9, 1.9, 1.0, gy, X(762), z); k.pl(GLOW(gacha, 0.95), 0.72, 0.95, X(762) - 0.46, 1.3, z, -Math.PI / 2); });
    k.bxz(xT + 0.15, X(640), zP - 0.15, zP + 0.15, 3.0, wh);
    const wel = canvasTex(640, 400, (c, w, h) => { c.fillStyle = '#f6f9fc'; c.fillRect(0, 0, w, h); c.fillStyle = '#16304f'; c.font = `700 34px ${FONT}`; c.textAlign = 'center'; c.fillText('Welcome to the Green Bio Express', w / 2, 56); c.strokeStyle = '#2fb8e8'; c.lineWidth = 10; c.beginPath(); c.moveTo(80, 300); c.bezierCurveTo(220, 120, 420, 340, 560, 150); c.stroke(); c.fillStyle = '#7ccf3a'; [[80, 300], [250, 230], [420, 250], [560, 150]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 18, 0, 7); c.fill(); }); });
    k.pl(GLOW(wel, 0.95), 1.7, 1.06, 0.1, 1.7, zP + 0.16);
    // 조명 (부스 자체)
    k.spot([2.2, 7.5, 2.5], [2.2, 1.2, -3.2], 0xeaf4ff, 110, 0.55);
    k.spot([0.8, 7.5, -12], [1.2, 0, -14], 0xfff0dc, 60, 0.75);
    k.pool(2.2, -2.4, 3.6, 0xbfe8ff, 0.3); k.pool(tx, tz, 2.2, 0x9fff70, 0.35); k.pool(2.8, -21.8, 3.6, 0xd8ffe0, 0.22); k.pool(-3.6, -6, 2.5, 0x9fd8ff, 0.25);
  },
});
