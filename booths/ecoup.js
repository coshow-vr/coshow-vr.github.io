/* 에코업 부스 3D (부스시안_1027 ecoup_01·02·04·05·06·07·08·09·10·11 보고 지음, 10. 27.) */
// 도면 ecoup_01 = 13,500 × 26,508 mm → 부스 칸(13.1 × 26.0 m)과 거의 같아 1 : 1로 옮김 (21.7 px = 1 m)
export default ({ THREE, M, E, GLOW, box, canvasTex, B3, boothKit, CHAIR, FONT, LOW }) => {
  // 물줄기 LED · 안내 LED 그림 (시안 화면을 보고 그림, 사람 있는 부분은 그리기)
  const infoTex = canvasTex(1024, 1100, (c, w, h) => {
    const bg = c.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#04103a'); bg.addColorStop(.6, '#0a2a8a'); bg.addColorStop(1, '#06205e'); c.fillStyle = bg; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { c.globalAlpha = .08 + Math.random() * .2; c.fillStyle = '#5fc8ff'; c.fillRect(Math.random() * w, 0, 1 + Math.random() * 3, h); }
    c.globalAlpha = 1; c.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 3; k++) { c.strokeStyle = ['#2fd8ff', '#7fe8ff', '#1f7bff'][k]; c.lineWidth = 10 - k * 3; c.beginPath(); for (let x = 0; x <= w; x += 8) { const y = 760 + Math.sin(x * .008 + k) * 60 + k * 14; x ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); }
    [[220, 760, 120], [520, 740, 95]].forEach(([x, y, r]) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, '#9fe3ff'); g.addColorStop(.7, '#2a8f6a'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); });
    for (let i = 0; i < 40; i++) { c.strokeStyle = 'rgba(160,230,255,.5)'; c.lineWidth = 2; c.beginPath(); c.arc(Math.random() * w, 560 + Math.random() * 420, 4 + Math.random() * 16, 0, 7); c.stroke(); }
    c.globalCompositeOperation = 'source-over'; c.fillStyle = '#fff'; c.textBaseline = 'top';
    c.font = `700 34px ${FONT}`; c.fillText('첨단분야 혁신융합대학사업단', 70, 205);
    c.font = `900 66px ${FONT}`; c.fillStyle = '#7ff0ff'; c.fillText("환경을 '업(業)'으로 만듭니다", 60, 268);
    c.fillStyle = '#e8f4ff'; c.font = `500 31px ${FONT}`;
    ['에코업 혁신융합대학사업단은', '물과 환경 분야의 융합 인재를 양성하고,', '지속가능한 미래사회를 위한 혁신 기술을 개발합니다.'].forEach((t, i) => c.fillText(t, 70, 380 + i * 46));
    c.font = `600 26px ${FONT}`; c.textAlign = 'center';
    ['물의 지속 가능한 보전', '자원순환', '오염방지 및 관리', '생물다양성 보전'].forEach((t, i) => { const x = 140 + i * 245; c.strokeStyle = '#9fe9ff'; c.lineWidth = 4; c.beginPath(); c.arc(x, 960, 34, 0, 7); c.stroke(); c.fillStyle = '#fff'; c.fillText(t, x, 1010); });
  });
  const cycleTex = canvasTex(1536, 1024, (c, w, h) => {                       // 「물의 순환」 LED (3칸)
    const bg = c.createLinearGradient(0, 0, w, 0); bg.addColorStop(0, '#061a5a'); bg.addColorStop(1, '#0a3aa0'); c.fillStyle = bg; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 110; i++) { c.globalAlpha = .06 + Math.random() * .18; c.fillStyle = '#6fd2ff'; c.fillRect(Math.random() * w, 0, 1 + Math.random() * 3, h); }
    c.globalAlpha = 1; c.fillStyle = '#fff'; c.textBaseline = 'top';
    c.font = `900 84px ${FONT}`; c.fillText('물의 순환', 70, 90);
    [[540, '지표수·지하수', []], [1040, '우리의 생활과 산업', ['자연의 물은 가정, 농업, 산업 등', '다양한 곳에서 사용되며,', '다시 처리되어 자연으로 돌아갑니다.']]].forEach(([x, t, L]) => {
      c.fillStyle = '#fff'; c.font = `800 46px ${FONT}`; c.fillText(t, x, 110);
      c.font = `500 28px ${FONT}`; L.forEach((s, i) => c.fillText(s, x, 180 + i * 40));
      if (!L.length) { c.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 3; i++) c.fillRect(x, 190 + i * 40, 360, 12); }
      const g = c.createRadialGradient(x + 200, 560, 0, x + 200, 560, 190); g.addColorStop(0, '#bfe8ff'); g.addColorStop(.55, '#2c7a8a'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(x + 200, 560, 190, 0, 7); c.fill();
    });
    c.strokeStyle = '#9fe9ff'; c.lineWidth = 6; c.beginPath(); c.moveTo(200, 720); c.bezierCurveTo(500, 900, 900, 520, 1450, 760); c.stroke();
  });
  const floorTex = canvasTex(512, 128, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1b5fd8'); g.addColorStop(1, '#06205e'); c.fillStyle = g; c.fillRect(0, 0, w, h); for (let i = 0; i < 12; i++) { c.strokeStyle = 'rgba(160,230,255,.4)'; c.beginPath(); c.arc(Math.random() * w, Math.random() * h, 4 + Math.random() * 10, 0, 7); c.stroke(); } });
  const plateTex = canvasTex(512, 160, (c, w, h) => { c.fillStyle = '#07080c'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `800 64px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('에코업(業)', w / 2, h / 2 + 4); });
  const awardTex = canvasTex(512, 640, (c, w, h) => { c.fillStyle = '#f6f8fc'; c.fillRect(0, 0, w, h); c.fillStyle = '#0d2a8a'; c.font = `900 78px ${FONT}`; c.textAlign = 'center'; c.fillText('경진대회', w / 2, 120); c.fillText('수상작', w / 2, 210); const g = c.createLinearGradient(0, 300, 0, 560); g.addColorStop(0, '#5aa6e8'); g.addColorStop(1, '#1d4fa8'); c.fillStyle = g; c.fillRect(50, 290, w - 100, 270); });

  return {
    '에코업'(g, W, D, carpet, slope) {
      const k = boothKit(g, slope), fr = k.fr;
      const wh = M(0xf3f6fb, { roughness: .45, emissive: 0x6a7488, emissiveIntensity: .5 }), blu = M(0x1450c8, { roughness: .6, emissive: 0x0a2a80, emissiveIntensity: .35 });
      const blk = M(0x0a0b10, { roughness: .6 }), cy = E(0x3fb8ff, 2.4), blueC = M(0x1546b8, { roughness: .95 });
      carpet.material = M(0x5f6268, { roughness: .95 });                         // 회색 카펫
      const add = (m, p = g) => { p.add(m); return m; };
      const shapeFlat = (sh, mat, y = 0.05) => { const m = new THREE.Mesh(new THREE.ShapeGeometry(sh, 24), mat); m.rotation.x = -Math.PI / 2; m.position.y = y; return add(m); };
      const extr = (sh, h, mat, y0 = 0) => { const m = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: h, bevelEnabled: false, curveSegments: 24 }), mat); m.rotation.x = -Math.PI / 2; m.position.y = y0; return add(m); };  // 도형 y = -z, 높이로 세움
      const arc = (cx, cz, r, a0, a1, n = 14) => Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [cx + r * Math.cos(a), cz + r * Math.sin(a)]; });
      const ribbon = (P, h, mat, y0 = 0, us = 3) => {                          // 곡선 벽 (점 [x, z] 이어 세움)
        const pos = [], uv = [], idx = []; let L = 0;
        P.forEach(([x, z], i) => { if (i) L += Math.hypot(x - P[i - 1][0], z - P[i - 1][1]); pos.push(x, y0, z, x, y0 + h, z); uv.push(L / us, 0, L / us, 1); if (i) { const a = (i - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } });
        const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
        return add(new THREE.Mesh(geo, mat));
      };

      // ① 앞 아치 게이트 (파랑 바깥 띠 + 흰 안쪽 띠 + 하늘색 빛줄) · 위 「에코업(業)」 글자
      const AX = 0.15, A = 4.55, Bh = 4.5, T1 = 0.6, T2 = 0.8, ZD = 1.4;
      const band = (a0, b0, a1, b1) => { const s = new THREE.Shape(), n = 48; for (let i = 0; i <= n; i++) { const t = Math.PI * i / n; s[i ? 'lineTo' : 'moveTo'](AX + a0 * Math.cos(t), b0 * Math.sin(t)); } for (let i = n; i >= 0; i--) { const t = Math.PI * i / n; s.lineTo(AX + a1 * Math.cos(t), b1 * Math.sin(t)); } return s; };
      [[band(A, Bh, A - T1, Bh - T1), blu], [band(A - T1, Bh - T1, A - T1 - T2, Bh - T1 - T2), wh]].forEach(([s, m]) => { const q = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: ZD, bevelEnabled: false }), m); q.position.z = -0.3 - ZD; fr.add(q); });
      const eTube = (a, b, z, r = 0.04) => { const P = []; for (let i = 0; i <= 40; i++) { const t = Math.PI * i / 40; P.push(new THREE.Vector3(AX + a * Math.cos(t), b * Math.sin(t), z)); } fr.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(P), 80, r, 6), cy)); };
      eTube(A - T1 + 0.06, Bh - T1 + 0.06, -0.28); eTube(A - T1 - T2 + 0.04, Bh - T1 - T2 + 0.04, -0.28); eTube(A - T1 - T2 + 0.04, Bh - T1 - T2 + 0.04, -0.3 - ZD - 0.02);
      k.pl(GLOW(B3('ecoup_logo'), 1.25), 3.2, 0.78, AX, Bh + 0.42, -0.95, 0, fr);
      k.flat(blueC, AX - A, AX + A, -1.75, -0.25, 0.055, fr);
      k.box(1.6, 3.4, 0.25, wh, -W + 0.8, -0.55, 0, fr);                        // 아치 왼쪽 흰 벽
      // ② 오른쪽 앞 검정 상자 (경진대회 수상 화면)
      { const q = new THREE.Group(); q.position.set(W - 1.3, 0, -2.9); q.rotation.y = -0.35; g.add(q);
        box(2.2, 2.7, 0.5, blk, 0, 0, 0, q);
        const s = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), GLOW(B3('ecoup_tv'), 1.1)); s.position.set(0, 1.55, 0.26); q.add(s);
        const t1 = k.txt(['경진대회 수상'], 1.3, 0.22, { fg: '#fff', size: 150 }, 1.0); t1.position.set(0, 2.3, 0.26); q.add(t1);
        const t2 = k.txt(['에코업(業)'], 1.1, 0.26, { fg: '#fff', size: 170 }, 1.0); t2.position.set(0, 0.7, 0.26); q.add(t2); }
      // ③ 왼쪽 앞 흰 낮은 카운터 + 검정 「에코업(業)」 판 2개 (안쪽 보기)
      k.bxz(-W, -W + 0.6, -5.6, -1.2, 1.0, wh); k.bxz(-W + 0.6, -W + 0.62, -5.6, -1.2, 0.05, cy, 0.9);
      [-2.3, -4.3].forEach(z => { k.box(0.06, 0.55, 1.6, blk, -W + 0.64, z, 0.25); k.pl(GLOW(plateTex, 0.95), 1.5, 0.47, -W + 0.68, 0.52, z, Math.PI / 2); });

      // ④ 왼쪽 안내 LED 벽 (꺾인 면) · 어두운 기둥 · 「물의 순환」 곡면 LED
      const seg = (x0, z0, x1, z1, h, mat, y0 = 0) => { const L = Math.hypot(x1 - x0, z1 - z0), q = new THREE.Mesh(new THREE.PlaneGeometry(L, h), mat); q.position.set((x0 + x1) / 2, y0 + h / 2, (z0 + z1) / 2); q.rotation.y = -Math.atan2(z1 - z0, x1 - x0); return add(q); };
      const wallBack = (x0, z0, x1, z1, h) => { const L = Math.hypot(x1 - x0, z1 - z0), p = new THREE.Group(), q = box(L, h, 0.3, blk, 0, 0, 0, p); p.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2); p.rotation.y = -Math.atan2(z1 - z0, x1 - x0); q.position.z = -0.17; g.add(p); };
      // 면 방향: 점 순서를 앞→뒤로 두면 안쪽(+x)을 봄
      const IA = [-W + 0.1, -5.9], IB = [-4.4, -9.4], onI = t => [IA[0] + (IB[0] - IA[0]) * t + 0.016, IA[1] + (IB[1] - IA[1]) * t + 0.008];
      wallBack(...IA, ...IB, 4.4); seg(...IA, ...IB, 4.2, GLOW(infoTex, 1.05), 0.1);
      seg(...onI(0.06), ...onI(0.62), 0.5, GLOW(B3('ecoup_logo'), 1.15), 3.55);   // 안내 LED 위 로고 (시안 그림)
      k.bxz(-4.55, -4.05, -10.6, -9.4, 4.6, M(0x0b1a52, { roughness: .5, emissive: 0x0a2a90, emissiveIntensity: .6 }));
      const cyc = Array.from({ length: 13 }, (_, i) => { const t = i / 12, u = 1 - t; return [u * u * -4.3 + 2 * u * t * -4.7 + t * t * (-W + 0.25), u * u * -10.6 + 2 * u * t * -13.3 + t * t * -15.4]; });  // 살짝 굽은 면
      const cm = GLOW(cycleTex, 1.05, { side: THREE.DoubleSide }); const r1 = ribbon(cyc, 4.1, cm, 0.15, 99); { const uv = r1.geometry.attributes.uv, n = uv.count / 2, P = cyc; let L = [0]; for (let i = 1; i < P.length; i++) L.push(L[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); for (let i = 0; i < n; i++) { uv.setX(2 * i, L[i] / L[n - 1]); uv.setX(2 * i + 1, L[i] / L[n - 1]); } uv.needsUpdate = true; }
      ribbon(cyc.map(([x, z]) => [x - 0.2, z]), 4.4, blk, 0);
      // ⑤ 뒤 구름 모양 물줄기 LED 벽 (가운데 파랑 기둥) · 위아래 파랑 띠
      const fallT = B3('ecoup_fall'); fallT.wrapS = THREE.RepeatWrapping;
      const P1 = [[-W + 0.25, -15.4], ...arc(-3.2, -19.8, 3.1, 160, 340, 18)], P2 = arc(3.4, -19.6, 2.9, 200, 390, 18);
      [P1, P2].forEach(P => {
        ribbon(P, 3.5, GLOW(fallT, 1.15, { side: THREE.DoubleSide }), 0.15, 2.6);
        ribbon(P, 0.3, blu, 3.65); ribbon(P, 0.15, blu, 0);
        const out = P.map(([x, z], i) => { const [x2, z2] = P[Math.min(i + 1, P.length - 1)], [x1, z1] = P[Math.max(i - 1, 0)], dx = x2 - x1, dz = z2 - z1, l = Math.hypot(dx, dz) || 1; return [x + dz / l * 0.25, z - dx / l * 0.25]; });
        ribbon(out, 4.0, blk, 0);
      });
      k.box(1.3, 4.3, 1.0, blu, 0.2, -21.6); k.pl(GLOW(fallT, 1.15), 1.1, 3.6, 0.2, 2.0, -21.09);
      // 오른쪽 뒤 「물, 그리고 더 나은 내일」 LED (위 = 시안 그림, 아래 = 물빛 바닥)
      { const q = new THREE.Group(); q.position.set(W - 0.55, 0, -16.1); q.rotation.y = -Math.PI / 2 + 0.45; g.add(q);
        box(3.6, 4.6, 0.3, blk, 0, -0.18, 0, q);
        const a = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.5), GLOW(B3('ecoup_water'), 1.1)); a.position.set(0, 2.85, 0.01); q.add(a);
        const b = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.0), GLOW(floorTex, 1.0)); b.position.set(0, 0.6, 0.01); q.add(b); }
      // 바깥 검정 큰 벽 (왼쪽 · 뒤, 시안 조감 그대로 높게)
      k.bxz(-W - 0.15, -W + 0.05, -D, -5.9, 5.0, blk); k.bxz(-W, W, -D - 0.2, -D, 5.0, blk);
      k.flat(M(0x111318, { roughness: .9 }), -W, W, -D, -22.6, 0.05);

      // ⑥ 가운데 파랑 카펫 길 (안내데스크 ~ 체험 섬)
      { const s = new THREE.Shape(), R = 2.05; s.moveTo(R, 6.05); s.lineTo(R, 17.35); s.absarc(0, 17.35, R, 0, Math.PI, false); s.lineTo(-R, 6.05); s.absarc(0, 6.05, R, Math.PI, 2 * Math.PI, false); shapeFlat(s, blueC, 0.05); }
      // 안내데스크 (흰 반원 · 파랑 윗판 빛줄) + 뒤 흰 판(앞 로고 · 뒤 화면 4개)
      const half = (cx, cz, r0, r1, a0, a1) => { const s = new THREE.Shape(); s.absarc(cx, -cz, r1, a0, a1, false); s.absarc(cx, -cz, r0, a1, a0, true); return s; };
      extr(half(0, -6.6, 1.15, 1.6, Math.PI * 1.08, Math.PI * 1.92), 1.0, wh);
      extr(half(0, -6.6, 1.1, 1.65, Math.PI * 1.08, Math.PI * 1.92), 0.06, blu, 1.0);
      { const t = new THREE.Mesh(new THREE.TorusGeometry(1.64, 0.025, 6, 40, Math.PI * 0.84), cy); t.rotation.x = Math.PI / 2; t.rotation.z = Math.PI * 0.08; t.position.set(0, 0.98, -6.6); g.add(t); }
      k.pl(new THREE.MeshBasicMaterial({ map: B3('ecoup_mark'), toneMapped: false, color: new THREE.Color().setScalar(0.8) }), 1.5, 0.42, 0, 0.55, -4.96);
      k.box(3.4, 2.5, 0.25, wh, 0, -7.7); k.pl(new THREE.MeshBasicMaterial({ map: B3('ecoup_mark'), toneMapped: false, color: new THREE.Color().setScalar(0.8) }), 2.2, 0.61, 0, 2.0, -7.56);
      k.inst(new THREE.BoxGeometry(0.6, 0.9, 0.04), M(0x05060a, { roughness: .3 }), [-1.2, -0.4, 0.4, 1.2].map(x => [x, 1.35, -7.84]));
      // ⑦ 체험 섬: 양 끝 흰 C 카운터 · 가운데 물결 아치 진열대 2줄 · 수상작 판 · 태블릿 받침
      extr(half(0, -11.7, 1.15, 1.6, Math.PI, 2 * Math.PI), 1.0, wh); extr(half(0, -17.4, 1.15, 1.6, 0, Math.PI), 1.0, wh);
      const prof = (() => { const L = 4.4, n = 150, c = []; for (let i = 0; i <= n; i++) { const s = L * i / n; c.push([s, 0.04 + 1.15 * Math.pow(Math.abs(Math.sin(3 * Math.PI * s / L)), 0.4)]); }
        const o = [], inn = []; c.forEach(([x, y], i) => { const [x2, y2] = c[Math.min(i + 1, n)], [x1, y1] = c[Math.max(i - 1, 0)], dx = x2 - x1, dy = y2 - y1, l = Math.hypot(dx, dy) || 1; o.push([x - dy / l * 0.05, y + dx / l * 0.05]); inn.push([x + dy / l * 0.05, Math.max(0, y - dx / l * 0.05)]); });
        const s = new THREE.Shape(); o.forEach(([x, y], i) => s[i ? 'lineTo' : 'moveTo'](x, y)); inn.reverse().forEach(([x, y]) => s.lineTo(x, y)); return new THREE.ExtrudeGeometry(s, { depth: 0.55, bevelEnabled: false }); })();
      [-1.75, 1.2].forEach(x => { const m = new THREE.Mesh(prof, wh); m.rotation.y = Math.PI / 2; m.position.set(x, 0, -12.35); g.add(m); });
      k.inst(new THREE.BoxGeometry(0.26, 0.04, 0.2), M(0x1a2a50, { emissive: 0x2a74ff, emissiveIntensity: .7 }), [-1.48, 1.48].flatMap(x => [-13.08, -14.55, -16.02].map(z => [x, 1.27, z])));
      k.inst(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 8), M(0xdfe3ea), [[-0.7, 0.55, -12.6], [0.7, 0.55, -12.6], [-0.7, 0.55, -16.4], [0.7, 0.55, -16.4]]);
      k.inst(new THREE.BoxGeometry(0.34, 0.46, 0.03), M(0x0c1530, { emissive: 0x6a4cff, emissiveIntensity: .6 }), [[-0.7, 1.25, -12.6], [0.7, 1.25, -12.6], [-0.7, 1.25, -16.4], [0.7, 1.25, -16.4]]);
      k.box(0.06, 1.2, 0.06, wh, 0.1, -16.9); k.pl(M(0xffffff, { map: awardTex, emissive: 0xffffff, emissiveMap: awardTex, emissiveIntensity: .45 }), 0.9, 1.12, 0.1, 1.85, -16.86);
      // 매다는 LED 상자 (네 면 물방울 화면 · 아래 흰 빛) + 줄
      { const s = 2.6, yc = 4.6, h = 1.0, sm = GLOW(B3('ecoup_cube'), 1.15), mats = [sm, sm, M(0x101318), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffffff).multiplyScalar(1.6), toneMapped: false }), sm, sm];
        const c = new THREE.Mesh(new THREE.BoxGeometry(s, h, s), mats); c.position.set(0, yc, -14.3); g.add(c);
        const top = yc + h / 2, apex = [0, top + 1.2, -14.3];
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b]) => { const p = new THREE.Vector3(a * s / 2, top, -14.3 + b * s / 2), q = new THREE.Vector3(...apex), L = p.distanceTo(q), m = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, L, 4), M(0x9aa3b2)); m.position.copy(p).add(q).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), q.clone().sub(p).normalize()); g.add(m); });
        k.box(0.03, 11.6 - apex[1], 0.03, M(0x3a3f4a), 0, -14.3, apex[1]); }
      // ⑧ 오른쪽: 흰 탁자 4개 · 흰 의자 · 벽쪽 흰 낮은 진열대(파랑 빛)
      const tz = [-12.85, -10.7, -7.55, -5.45];
      k.inst(new THREE.BoxGeometry(1.4, 0.05, 1.8), wh, tz.map(z => [4.3, 0.74, z]));
      k.inst(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 6), M(0xd8dce4), tz.flatMap(z => [[3.7, 0.36, z - 0.8], [4.9, 0.36, z - 0.8], [3.7, 0.36, z + 0.8], [4.9, 0.36, z + 0.8]]));
      k.inst(CHAIR, wh, tz.flatMap(z => [[3.25, 0, z - 0.45, -Math.PI / 2], [3.25, 0, z + 0.45, -Math.PI / 2], [5.35, 0, z - 0.45, Math.PI / 2], [5.35, 0, z + 0.45, Math.PI / 2]]));
      k.bxz(W - 0.55, W, -14.2, -3.9, 1.05, wh); k.inst(new THREE.BoxGeometry(0.02, 0.55, 2.3), E(0x2f9bff, 1.6), [-12.9, -10.3, -7.7, -5.1].map(z => [W - 0.56, 0.55, z]));
      // ⑨ 하늘색 빛 기둥 램프 (LED 벽 앞)
      k.inst(new THREE.CylinderGeometry(0.12, 0.12, 1.1, 16), E(0x5fe6ff, 1.8), [[-4.7, 1.0, -8.9], [-4.3, 1.0, -11.2], [-5.6, 1.0, -14.9]]);
      k.inst(new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6), M(0x9aa3b2), [[-4.7, 0.22, -8.9], [-4.3, 0.22, -11.2], [-5.6, 0.22, -14.9]]);
      // 조명 (부스 자체 2개)
      k.spot([AX, 7.5, 5], [AX, 2.6, -1.0], 0xe6f0ff, 150, 0.6); k.spot([0, 8, -11], [0, 0, -15], 0xd8e8ff, 120, 0.8);
      k.pool(0, -6.4, 3.2, 0x8fc8ff, 0.3); k.pool(-2.5, -19.3, 5, 0x3f9bff, 0.35); k.pool(3.2, -19, 4, 0x3f9bff, 0.3); k.pool(-4, -10.5, 3.5, 0x4fa0ff, 0.3); k.pool(4.3, -9, 4, 0xa8c8ff, 0.18);
    },
  };
};
