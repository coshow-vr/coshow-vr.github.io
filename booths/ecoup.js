/* 에코업 부스 3D — 10. 28. 새 시안(첨부 2026-10-28/131627_1~13, 담당자 수정 요청) 보고 처음부터 다시 지음 */
// 평면 = 2번 그림(13,500 × 26,508 mm)을 1.3배로 자른 것(_work/build_ecoup_1028.py 옆 메모): 가로 135~625 px = 부스 폭, 세로 108 px = 뒤 · 1052 px = 앞
// 앞판(10. 27. 옛 시안) _work/이전판/ecoup_v1027_새시안전.js. 화면 그림 img/b3d/ecoup2_*.jpg = 시안에서 잘라 붙임
export default ({ THREE, M, E, GLOW, box, canvasTex, B3, boothKit, truss, figure, CHAIR, FONT }) => {
  const BLUE = '#0b3fae';
  const mark = (c, x, y, s, col) => {                                           // 손 위 지구 로고 (시안 모양 따라 그림)
    c.save(); c.strokeStyle = col; c.lineWidth = s * 0.07; c.lineCap = 'round';
    const gy = y - s * 0.12, r = s * 0.3;
    c.beginPath(); c.arc(x, gy, r, 0, 7); c.stroke();
    c.beginPath(); c.ellipse(x, gy, r * 0.45, r, 0, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(x, gy - r); c.lineTo(x, gy + r); c.moveTo(x - r, gy); c.lineTo(x + r, gy); c.moveTo(x - r * 0.87, gy - r * 0.5); c.lineTo(x + r * 0.87, gy - r * 0.5); c.moveTo(x - r * 0.87, gy + r * 0.5); c.lineTo(x + r * 0.87, gy + r * 0.5); c.stroke();
    c.beginPath(); c.moveTo(x - s * 0.62, y + s * 0.12); c.lineTo(x - s * 0.35, y + s * 0.12); c.quadraticCurveTo(x - s * 0.1, y + s * 0.42, x + s * 0.28, y + s * 0.34); c.quadraticCurveTo(x + s * 0.5, y + s * 0.28, x + s * 0.5, y + s * 0.04); c.stroke();
    c.restore();
  };
  const T = (c, s, x, y, font, col, al = 'center') => { c.font = font; c.fillStyle = col; c.textAlign = al; c.textBaseline = 'middle'; c.fillText(s, x, y); };
  const faceLogo = canvasTex(1024, 480, (c, w, h) => { c.fillStyle = BLUE; c.fillRect(0, 0, w, h); c.strokeStyle = '#fff'; c.lineWidth = 18; c.strokeRect(9, 9, w - 18, h - 18); mark(c, w / 2, 150, 190, '#fff'); T(c, '에코업(業)', w / 2, 345, `900 150px ${FONT}`, '#fff'); });
  const faceProg = canvasTex(1024, 480, (c, w, h) => { c.fillStyle = BLUE; c.fillRect(0, 0, w, h / 2); c.fillStyle = '#fff'; c.fillRect(0, h / 2, w, h / 2); c.strokeStyle = '#fff'; c.lineWidth = 18; c.strokeRect(9, 9, w - 18, h - 18); T(c, '정수기 만들기', w / 2, h * 0.26, `800 118px ${FONT}`, '#fff'); T(c, '무드등 만들기', w / 2, h * 0.75, `800 118px ${FONT}`, BLUE); });
  const plateTex = canvasTex(512, 160, (c, w, h) => {                           // 검은 반짝이 판 + 로고
    c.fillStyle = '#0c0e14'; c.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { c.fillStyle = `rgba(200,210,230,${Math.random() * .35})`; c.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); }
    mark(c, 110, 84, 82, '#fff'); T(c, '에코업(業)', 300, 84, `800 64px ${FONT}`, '#fff');
  });
  const deskTex = canvasTex(2048, 400, (c, w, h) => { c.fillStyle = '#f6f8fc'; c.fillRect(0, 0, w, h); T(c, '안내 / Information', w * 0.42, h * 0.3, `600 50px ${FONT}`, '#2a3040'); T(c, '더러운 물은 어디로 갔지?', w * 0.5, h * 0.62, `800 112px ${FONT}`, '#0d3ea8'); });
  const uniTex = canvasTex(2048, 220, (c, w, h) => {                            // 참여 대학 이름 띠 (대학명단_영상팀용.txt, 로고 모양은 그림)
    c.fillStyle = '#fbfcfe'; c.fillRect(0, 0, w, h);
    [['고려대학교 세종캠퍼스', '#a3102a'], ['고려대학교', '#a3102a'], ['KU 건국대학교', '#036b3f'], ['영남대학교', '#1d3f8f'], ['전주비전대학교', '#1a3f9c']].forEach(([s, col], i) => {
      const x = w * (0.1 + i * 0.2); c.fillStyle = col; c.beginPath(); c.arc(x - 150, h / 2, 34, 0, 7); c.fill(); T(c, s, x - 104, h / 2, `800 ${s.length > 7 ? 46 : 56}px ${FONT}`, col, 'left');
    });
  });
  const cycleTex = canvasTex(1536, 1024, (c, w, h) => {                         // 「물의 순환」 LED (시안 13번 · 12번에서 글자 일부만 보임 → 보이는 글자만)
    const bg = c.createLinearGradient(0, 0, w, 0); bg.addColorStop(0, '#061a5a'); bg.addColorStop(1, '#0a3aa0'); c.fillStyle = bg; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 110; i++) { c.globalAlpha = .06 + Math.random() * .18; c.fillStyle = '#6fd2ff'; c.fillRect(Math.random() * w, 0, 1 + Math.random() * 3, h); }
    c.globalAlpha = 1; T(c, '물의 순환', 90, 120, `900 84px ${FONT}`, '#fff', 'left');
    [[560, '지표수 · 지하수'], [1060, '우리의 생활과 산업']].forEach(([x, s]) => { T(c, s, x, 140, `800 46px ${FONT}`, '#fff', 'left'); c.fillStyle = 'rgba(255,255,255,.35)'; for (let i = 0; i < 3; i++) c.fillRect(x, 200 + i * 40, 360, 12);
      const g = c.createRadialGradient(x + 200, 560, 0, x + 200, 560, 190); g.addColorStop(0, '#bfe8ff'); g.addColorStop(.55, '#2c7a8a'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.beginPath(); c.arc(x + 200, 560, 190, 0, 7); c.fill(); });
    c.strokeStyle = '#9fe9ff'; c.lineWidth = 6; c.beginPath(); c.moveTo(200, 720); c.bezierCurveTo(500, 900, 900, 520, 1450, 760); c.stroke();
  });
  const glowPanel = canvasTex(512, 256, (c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#d8f6ff'); g.addColorStop(1, '#9fe0ff'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(40,140,200,.5)'; c.lineWidth = 3; [[20, 30, 200, 140], [240, 30, 120, 200], [380, 30, 110, 200]].forEach(r => c.strokeRect(...r)); });

  return {
    '에코업'(g, W, D, carpet, slope) {
      const k = boothKit(g, slope), fr = k.fr;
      const X = p => (p - 380) / 245 * W, Z = p => (p - 1052) / 944 * D, P = L => L.map(([a, b]) => [X(a), Z(b)]);
      const wh = M(0xf3f6fb, { roughness: .45, emissive: 0x6a7488, emissiveIntensity: .5 }), blu = M(0x1450c8, { roughness: .6, emissive: 0x0a2a80, emissiveIntensity: .35 });
      const blk = M(0x0a0b10, { roughness: .6 }), cy = E(0x3fb8ff, 2.4), blueC = M(0x1546b8, { roughness: .95 }), chrome = M(0xc9ced8, { metalness: .8, roughness: .25 });
      const DS = { side: THREE.DoubleSide };
      carpet.material = M(0x5f6268, { roughness: .95 });                         // 회색 카펫
      const add = (m, p = g) => { p.add(m); return m; };
      const geo = (pos, uv, idx) => { const q = new THREE.BufferGeometry(); q.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); if (uv) q.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); q.setIndex(idx); q.computeVertexNormals(); return q; };
      const rib = (Q, y0, h, mat, us = 0) => {                                  // 곡선 벽: 점 [x, z]를 이어 세움. h = 수 또는 점마다 높이. us = 0이면 그림 한 장을 끝까지, 아니면 us m마다 반복
        const L = [0]; for (let i = 1; i < Q.length; i++) L.push(L[i - 1] + Math.hypot(Q[i][0] - Q[i - 1][0], Q[i][1] - Q[i - 1][1]));
        const pos = [], uv = [], idx = [];
        Q.forEach(([x, z], i) => { const hh = Array.isArray(h) ? h[i] : h, u = us ? L[i] / us : L[i] / L[L.length - 1]; pos.push(x, y0, z, x, y0 + hh, z); uv.push(u, 0, u, 1); if (i) { const a = (i - 1) * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); } });
        return add(new THREE.Mesh(geo(pos, uv, idx), mat));
      };
      const strip = (A, B, y, mat, hA = null) => {                               // 두 곡선 사이 가로 띠 (바닥 띠 · 벽 윗면)
        const pos = [], idx = []; A.forEach(([x, z], i) => { const yy = hA ? hA[i] : y; pos.push(x, yy, z, B[i][0], yy, B[i][1]); if (i) { const a = (i - 1) * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } });
        return add(new THREE.Mesh(geo(pos, null, idx), mat.clone ? Object.assign(mat.clone(), { side: THREE.DoubleSide }) : mat));
      };
      const off = (Q, d, C) => Q.map(([x, z], i) => {                           // 곡선을 d m 옮김 (+ = C 쪽)
        const [x2, z2] = Q[Math.min(i + 1, Q.length - 1)], [x1, z1] = Q[Math.max(i - 1, 0)]; let nx = z2 - z1, nz = -(x2 - x1); const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
        if (nx * (C[0] - x) + nz * (C[1] - z) < 0) { nx = -nx; nz = -nz; } return [x + nx * d, z + nz * d];
      });
      const shapeOf = Q => { const s = new THREE.Shape(); Q.forEach(([x, z], i) => s[i ? 'lineTo' : 'moveTo'](x, -z)); return s; };
      const flatShape = (s, mat, y = 0.055) => { const m = new THREE.Mesh(new THREE.ShapeGeometry(s, 24), mat); m.rotation.x = -Math.PI / 2; m.position.y = y; return add(m); };
      const extr = (s, h, mat, y0 = 0, p = g) => { const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 32 }), mat); m.rotation.x = -Math.PI / 2; m.position.y = y0; return add(m, p); };
      const ringS = (cx, cz, r0, r1, a0, a1) => { const s = new THREE.Shape(); s.absarc(cx, -cz, r1, a0, a1, false); s.absarc(cx, -cz, r0, a1, a0, true); return s; };   // a = π~2π 이면 앞(+z)쪽 반원
      const cylFace = (r, h, y, x, z, t0, tl, mat) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 40, 1, true, t0, tl), mat); m.position.set(x, y, z); return add(m); };
      const stool = (x, z) => { k.box(0.05, 0.72, 0.05, chrome, x, z); const s = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), wh); s.position.set(x, 0.75, z); g.add(s); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 16), chrome); b.position.set(x, 0.015, z); g.add(b); };

      // ① 앞 아치 (파랑 바깥 띠 + 흰 안쪽 띠 + 하늘색 빛줄) · 위 「에코업(業)」 글자 · 오른쪽 다리 「경진대회 수상」 화면
      const AX = X(420), A0 = W - AX - 0.02, B0 = 4.45, A1 = A0 - 1.25, B1 = B0 - 0.7, A2 = A1 - 0.6, B2 = B1 - 0.55, ZD = 1.2;
      const band = (a0, b0, a1, b1) => { const s = new THREE.Shape(), n = 56; for (let i = 0; i <= n; i++) { const t = Math.PI * i / n; s[i ? 'lineTo' : 'moveTo'](AX + a0 * Math.cos(t), b0 * Math.sin(t)); } for (let i = n; i >= 0; i--) { const t = Math.PI * i / n; s.lineTo(AX + a1 * Math.cos(t), b1 * Math.sin(t)); } return s; };
      [[band(A0, B0, A1, B1), blu], [band(A1, B1, A2, B2), wh]].forEach(([s, m]) => { const q = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: ZD, bevelEnabled: false }), m); q.position.z = -0.15 - ZD; fr.add(q); });
      const eTube = (a, b, z, r = 0.04) => { const Q = []; for (let i = 0; i <= 48; i++) { const t = Math.PI * i / 48; Q.push(new THREE.Vector3(AX + a * Math.cos(t), b * Math.sin(t), z)); } fr.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Q), 96, r, 6), cy)); };
      eTube(A1 + 0.08, B1 + 0.08, -0.13); eTube(A2 + 0.07, B2 + 0.07, -0.13); eTube(A2 + 0.07, B2 + 0.07, -0.17 - ZD);
      [-0.45, -0.75, -1.05].forEach(z => eTube(A2 - 0.02, B2 - 0.02, z, 0.025));  // 아치 안쪽 빛줄 3 (10번 시안)
      k.pl(GLOW(B3('ecoup_logo'), 1.25), 3.7, 0.9, AX, B0 + 0.5, -0.75, 0, fr);
      k.pl(GLOW(B3('ecoup_tv'), 1.1), 1.05, 0.6, AX + 4.3, 1.85, -0.14, 0, fr);
      { const t = k.txt(['경진대회 수상'], 1.0, 0.2, { fg: '#fff', size: 150 }, 1.0); t.position.set(AX + 3.9, 2.45, -0.14); fr.add(t); }
      { const t = k.txt(['에코업(業)'], 0.9, 0.2, { fg: '#fff', size: 160 }, 1.0); t.position.set(AX + 4.6, 1.2, -0.14); fr.add(t); }
      k.flat(blueC, AX - A0, AX + A0, -1.35, -0.15, 0.055, fr);
      k.box(AX - A0 + W, 3.6, 0.6, wh, (-W + AX - A0) / 2, -0.4, 0, fr);       // 아치 왼쪽 흰 큰 벽

      // ② 왼쪽 앞: 흰 옆벽 + 낮은 흰 진열대(검정 「에코업(業)」 판 3) — 4·13번
      k.bxz(-W, -W + 0.15, Z(1000), Z(778), 2.4, wh);
      k.bxz(-W + 0.15, -W + 0.75, Z(985), Z(800), 1.0, wh); k.bxz(-W + 0.74, -W + 0.76, Z(985), Z(800), 0.04, cy, 0.92);
      [Z(830), Z(880), Z(930)].forEach(z => k.pl(GLOW(plateTex, 0.95), 1.3, 0.4, -W + 0.77, 0.52, z, Math.PI / 2));

      // ③ 왼쪽 안내 벽 (위 물결 · 파랑) + 안내 LED(9번 시안 그림) + 「물의 순환」 LED
      const IW = P([[150, 776], [166, 752], [179, 714], [186, 670], [187, 630], [184, 585], [180, 540], [176, 490], [172, 440], [170, 412]]);
      const IH = [4.3, 4.35, 4.3, 4.1, 3.75, 3.45, 3.4, 3.55, 3.85, 4.0];
      const IC = [X(380), Z(600)], IWo = off(IW, -0.3, IC);
      rib(IW, 0, IH, M(0x1450c8, { roughness: .6, emissive: 0x0a2a80, emissiveIntensity: .35, ...DS })); rib(IWo, 0, IH, blu); strip(IW, IWo, 0, blu, IH);
      rib(off(P([[166, 750], [178, 716], [185, 680], [187, 640], [186, 600], [183, 562]]), 0.03, IC), 0.35, 2.9, GLOW(B3('ecoup2_info'), 1.1, DS));
      rib(off(P([[181, 545], [178, 505], [175, 466], [172, 430]]), 0.03, IC), 0.4, 2.6, GLOW(cycleTex, 1.05, DS));
      k.inst(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 10), E(0x5fe6ff, 2.0), off(P([[172, 735], [186, 610], [178, 500]]), 0.35, IC).map(([x, z]) => [x, 0.75, z]));   // 화면 앞 하늘색 빛 기둥
      k.box(0.7, 4.45, 0.7, blu, X(168), Z(405));                                // 안내 벽과 물줄기 벽 사이 파랑 기둥
      strip(IW, off(IW, 0.45, IC), 0.05, blueC);

      // ④ 물줄기 LED 벽 (뒤 물결 두 덩이, 가운데 파랑 기둥) — 1·3·12·13번
      const WV = P([[165, 412], [158, 370], [158, 330], [167, 290], [188, 260], [218, 240], [255, 228], [292, 226], [325, 233], [352, 244], [385, 250], [418, 244], [447, 232], [480, 224], [517, 226], [550, 240], [575, 265], [590, 300], [593, 335], [588, 365], [578, 392]]);
      const WC = [X(380), Z(420)], fallT = B3('ecoup_fall'); fallT.wrapS = THREE.RepeatWrapping;
      rib(WV, 0.1, 3.5, GLOW(fallT, 1.15, DS), 2.6);
      rib(off(WV, 0.01, WC), 3.6, 0.15, blu); rib(off(WV, 0.01, WC), 0, 0.1, blu);
      const WVo = off(WV, -0.3, WC); rib(WVo, 0, 3.95, blk); strip(WV, WVo, 3.95, blk);
      strip(WV, off(WV, 0.5, WC), 0.05, blueC);
      k.box(0.5, 3.95, 0.4, blu, X(385), Z(250) + 0.05);                         // 가운데 파랑 기둥
      { const s = new THREE.Shape(); s.absarc(X(385), -Z(248), X(425) - X(385), Math.PI, 2 * Math.PI, false); flatShape(s, blueC, 0.055); }
      // 물결 바깥 (검정 바닥 · 둘레 검정 벽)
      const dk = M(0x111318, { roughness: .9 });
      k.flat(dk, -W, W, -D, Z(232), 0.04); k.flat(dk, -W, X(165), Z(232), Z(412), 0.04); k.flat(dk, X(590), W, Z(232), Z(400), 0.04);
      k.bxz(-W, W, -D, -D + 0.2, 3.95, blk); k.bxz(-W, -W + 0.2, -D, Z(410), 3.95, blk); k.bxz(W - 0.2, W, -D, Z(400), 3.95, blk);

      // ⑤ 오른쪽 뒤 수도꼭지 진열장 (하늘색 빛 상자 · 부엌 그림 · 위 수도꼭지) — 11번
      { const x0 = X(578), z0 = Z(412), z1 = Z(525), zc = (z0 + z1) / 2, L = z1 - z0;
        k.bxz(x0, W - 0.05, z0, z1, 2.7, M(0x9fe6ff, { roughness: .4, emissive: 0x3fb8ff, emissiveIntensity: .55 }));
        k.pl(GLOW(B3('ecoup2_kitchen'), 1.05), L - 0.3, 1.05, x0 - 0.01, 2.05, zc, -Math.PI / 2);
        k.pl(GLOW(glowPanel, 0.95), L - 0.3, 1.25, x0 - 0.01, 0.9, zc, -Math.PI / 2);
        const fm = M(0x8fd8ff, { roughness: .35, emissive: 0x2a9be0, emissiveIntensity: .5 }), xf = x0 + 0.45;
        const cyl = (r, h, x, y, z, rz = 0) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 20), fm); m.position.set(x, y, z); m.rotation.z = rz; g.add(m); };
        cyl(0.13, 0.7, xf, 3.05, zc); cyl(0.11, 0.85, xf - 0.42, 3.2, zc, Math.PI / 2); cyl(0.13, 0.32, xf - 0.82, 3.02, zc);
        cyl(0.05, 0.25, xf, 3.5, zc); k.box(0.12, 0.08, 0.7, fm, xf, zc, 3.6); k.box(0.7, 0.08, 0.12, fm, xf, zc, 3.6);
        k.box(0.5, 3.95, 0.5, blu, X(575), Z(400));
        flatShape(shapeOf(P([[578, 398], [545, 402], [515, 420], [503, 455], [508, 495], [530, 518], [578, 528]])), blueC); }

      // ⑥ 가운데 섬 (파랑 바닥 · 뒤 진열장 · 양쪽 수상작 진열대 · C 바 테이블 · 대학 상담대 · 앞 안내데스크)
      const hw = X(440), zT = Z(440), zB = Z(838);
      { const s = new THREE.Shape(); s.moveTo(hw, -zB); s.lineTo(hw, -zT); s.absarc(0, -zT, hw, 0, Math.PI, false); s.lineTo(-hw, -zB); s.absarc(0, -zB, hw, Math.PI, 2 * Math.PI, false); flatShape(s, blueC, 0.06); }
      // 뒤 끝: 흰 진열장 + 「경진대회 수상작」 세움판 + 흰 원통
      k.box(1.25, 1.0, 0.8, wh, -0.1, Z(414)); k.inst(new THREE.CylinderGeometry(0.11, 0.13, 0.32, 16), wh, [[-0.45, 1.16, Z(414)], [0.0, 1.16, Z(414)], [0.3, 1.2, Z(414)]]);
      k.box(0.05, 1.3, 0.05, chrome, -0.55, Z(432)); k.pl(M(0xffffff, { map: B3('ecoup2_award'), emissive: 0xffffff, emissiveMap: B3('ecoup2_award'), emissiveIntensity: .45 }), 0.75, 0.9, -0.55, 1.75, Z(432) + 0.03);
      { const m = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.95, 20), wh); m.position.set(X(420), 0.47, Z(410)); g.add(m); }
      // 양쪽 수상작 진열대 (⊓ 높은 판 · 가운데 낮은 판 · 포스터 · 끝 태블릿)
      const poster = M(0xffffff, { map: B3('ecoup2_poster'), emissive: 0xffffff, emissiveMap: B3('ecoup2_poster'), emissiveIntensity: .4 });
      const za = Z(468), zb = Z(596), Lr = zb - za;
      [-1, 1].forEach(sd => {
        const x = sd * (hw - 0.4), xo = x + sd * 0.3;
        [[za + 0.15, za + 1.15], [zb - 1.15, zb - 0.15]].forEach(([z0, z1]) => {                // ⊓ 진열대 2
          k.bxz(x - 0.28, x + 0.28, z0, z1, 0.06, wh, 1.0); k.bxz(x - 0.28, x + 0.28, z0, z0 + 0.08, 1.0, wh); k.bxz(x - 0.28, x + 0.28, z1 - 0.08, z1, 1.0, wh);
          k.inst(new THREE.CylinderGeometry(0.09, 0.1, 0.26, 14), wh, [[x, 1.19, z0 + 0.3], [x, 1.19, z1 - 0.3]]);
        });
        k.bxz(x - 0.28, x + 0.28, za + 1.15, zb - 1.15, 0.45, wh);              // 가운데 낮은 판
        [za + 1.15 + (Lr - 2.3) * 0.28, za + 1.15 + (Lr - 2.3) * 0.72].forEach(z => k.pl(poster, 0.5, 1.0, xo + sd * 0.005, 0.95, z, sd * Math.PI / 2));
        [za - 0.05, zb + 0.05].forEach(z => { k.box(0.04, 1.1, 0.04, chrome, xo, z); k.pl(M(0x0c1530, { emissive: 0x6a8cff, emissiveIntensity: .7 }), 0.3, 0.4, xo + sd * 0.03, 1.2, z, sd * Math.PI / 2); const b = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.03, 16), wh); b.position.set(xo, 0.03, z); g.add(b); });
      });
      // C 바 테이블 (흰 바깥 · 파랑 안쪽) + 바 의자 4
      { const zc = Z(600), r1 = hw - 0.05, r0 = r1 - 0.5;
        extr(ringS(0, zc, r0, r1, Math.PI, 2 * Math.PI), 1.05, wh);
        cylFace(r0 - 0.005, 1.0, 0.52, 0, zc, -Math.PI / 2, Math.PI, M(0x1450c8, { roughness: .6, emissive: 0x0a2a80, emissiveIntensity: .35, side: THREE.BackSide }));
        k.inst(new THREE.CylinderGeometry(0.25, 0.25, 1.05, 18), wh, [[-(r0 + r1) / 2, 0.525, zc], [(r0 + r1) / 2, 0.525, zc]]);
        [[-0.55, 1.95], [-1.25, 1.45], [0.55, 1.95], [1.25, 1.45]].forEach(([a, b]) => stool(a, zc + b * 0.95)); }
      // 대학 상담대 4 (앞 = 참여 대학 이름 띠, 뒤 = 화면 · 흰 선반)
      { const zk = Z(792), xs = [-1.17, -0.39, 0.39, 1.17];
        xs.forEach(x => { k.box(0.74, 1.95, 0.1, wh, x, zk); k.pl(M(0x05070c, { emissive: 0x1a3a7a, emissiveIntensity: .5 }), 0.55, 0.8, x, 1.3, zk - 0.055, Math.PI); k.box(0.6, 0.04, 0.3, wh, x, zk - 0.2, 0.92); });
        k.pl(GLOW(uniTex, 0.95), 3.1, 0.33, 0, 1.5, zk + 0.055);
        k.pl(GLOW(B3('ecoup2_poster'), 0.9), 0.3, 0.5, xs[0], 1.35, zk - 0.056, Math.PI);
        stool(-0.8, zk - 0.75); stool(0.8, zk - 0.75); }
      // 앞 안내데스크 「안내 / Information · 더러운 물은 어디로 갔지?」 (흰 곡면 · 파랑 윗판 · 아랫단)
      { const r1 = hw - 0.12, r0 = r1 - 0.5;
        extr(ringS(0, zB, r0, r1, Math.PI, 2 * Math.PI), 0.95, wh, 0.08);
        extr(ringS(0, zB, r0 - 0.03, r1 + 0.04, Math.PI, 2 * Math.PI), 0.06, blu, 1.03); extr(ringS(0, zB, r0, r1 - 0.04, Math.PI, 2 * Math.PI), 0.08, blu);
        cylFace(r1 + 0.006, 0.9, 0.56, 0, zB, -Math.PI / 2, Math.PI, M(0xffffff, { map: deskTex, emissive: 0xffffff, emissiveMap: deskTex, emissiveIntensity: .45 }));
        { const t = new THREE.Mesh(new THREE.TorusGeometry(r1 + 0.04, 0.02, 6, 40, Math.PI), cy); t.rotation.x = Math.PI / 2; t.position.set(0, 1.0, zB); g.add(t); } }
      // 위 매단 마름모 간판 (네 면: 에코업(業) · 정수기 만들기 / 무드등 만들기)
      { const q = new THREE.Group(), s = 2.3, y0 = 4.2, h = 1.1; q.position.set(0, 0, Z(455)); q.rotation.y = Math.PI / 4; g.add(q);
        const inner = M(0x0b3fae, { roughness: .8, side: THREE.BackSide });         // 안쪽 면은 민무늬 (아래서 올려다볼 때 글자 뒤집혀 보이지 않게)
        [faceLogo, faceProg, faceLogo, faceProg].forEach((tx, i) => { const a = i * Math.PI / 2; [GLOW(tx, 1.05), inner].forEach(mt => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, h), mt); m.position.set(Math.sin(a) * s / 2, y0 + h / 2, Math.cos(a) * s / 2); m.rotation.y = a; q.add(m); }); });
        [y0, y0 + h].forEach(y => { [[0, s / 2, s, 0.05], [0, -s / 2, s, 0.05], [s / 2, 0, 0.05, s], [-s / 2, 0, 0.05, s]].forEach(([x, z, a, b]) => box(a + 0.04, 0.05, b + 0.04, M(0xdfe6f0, { metalness: .6, roughness: .3 }), x, z, y - 0.025, q)); });
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([a, b]) => box(0.02, 6.2 - y0 - h, 0.02, M(0x3a3f4a), a * s / 2, b * s / 2, y0 + h, q)); }

      // ⑦ 오른쪽 교육실 2칸 (흰 낮은 벽 · 검정 로고 판 · 긴 탁자 · 흰 의자) + 앞 개수대 — 2·3·13번
      const wl = M(0xf3f6fb, { roughness: .45, emissive: 0x6a7488, emissiveIntensity: .5 }), xL = X(497), xR = X(615);
      k.bxz(xL, W, Z(530), Z(538), 1.2, wl); k.bxz(xR, W, Z(538), Z(980), 1.2, wl);
      k.bxz(xL, xL + 0.2, Z(538), Z(645), 1.2, wl); k.bxz(xL, xR, Z(737), Z(748), 1.2, wl); k.bxz(xL, xL + 0.2, Z(864), Z(945), 1.2, wl);
      k.bxz(xL, xR, Z(945), Z(980), 0.95, wl);
      k.inst(new THREE.BoxGeometry(0.42, 0.03, 0.34), M(0x9aa3b0, { metalness: .7, roughness: .3 }), [[X(540), 0.96, (Z(945) + Z(980)) / 2], [X(578), 0.96, (Z(945) + Z(980)) / 2]]);
      k.pl(GLOW(plateTex, 0.95), 1.4, 0.44, (xL + xR) / 2, 0.55, Z(980) + 0.01);
      k.box(xR - xL - 0.2, 0.03, 0.02, cy, (xL + xR) / 2, Z(980) + 0.012, 0.18);
      [[Z(591)], [Z(904)]].forEach(([z]) => { k.pl(GLOW(plateTex, 0.95), 1.2, 0.38, xL - 0.01, 0.62, z, -Math.PI / 2); k.box(0.02, 0.03, 1.0, cy, xL - 0.012, z, 0.18); });
      k.pl(GLOW(plateTex, 0.95), 1.4, 0.44, (xL + W) / 2, 0.62, Z(530) - 0.01, Math.PI);
      [[Z(568), Z(706)], [Z(770), Z(905)]].forEach(([z0, z1]) => {
        const xa = X(545), xb = X(583), xm = (xa + xb) / 2, n = 6, zs = Array.from({ length: n }, (_, i) => z0 + 0.35 + (z1 - z0 - 0.7) * i / (n - 1));
        k.bxz(xa, xb, z0, z1, 0.05, wh, 0.72); k.inst(new THREE.BoxGeometry(0.05, 0.72, 0.05), chrome, [[xa + 0.1, 0.36, z0 + 0.1], [xb - 0.1, 0.36, z0 + 0.1], [xa + 0.1, 0.36, z1 - 0.1], [xb - 0.1, 0.36, z1 - 0.1]]);
        k.inst(CHAIR, wh, zs.flatMap(z => [[xa - 0.35, 0, z, -Math.PI / 2], [xb + 0.35, 0, z, Math.PI / 2]]));
        [[xa - 0.35, zs[1]], [xb + 0.35, zs[2]], [xa - 0.35, zs[4]], [xb + 0.35, zs[5]]].forEach(([x, z]) => figure(g, x, z, M(0xe8ecf4), 0.82));
        k.pool(xm, (z0 + z1) / 2, 2.4, 0xa8c8ff, 0.18);
      });

      // ⑧ 위 사각 트러스 + 조명 (13번)
      { const y = 6.2, xa = -2.1, xb = 2.1, z0 = Z(470), z1 = Z(960), zm = (z0 + z1) / 2;
        [[xa, z0, xa, z1], [xb, z0, xb, z1], [xa, z0, xb, z0], [xa, zm, xb, zm], [xa, z1, xb, z1]].forEach(([a, b, c, d]) => truss(k.W(a, y, b), k.W(c, y, d), 0.4));
        [[xa, z0], [xb, z0], [xa, z1], [xb, z1]].forEach(([x, z]) => k.box(0.025, 11.6 - y, 0.025, M(0x3a3f4a), x, z, y));
        const L = []; for (let i = 0; i < 6; i++) { const z = z0 + 0.8 + (z1 - z0 - 1.6) * i / 5; L.push([xa, y - 0.35, z], [xb, y - 0.35, z]); }
        k.inst(new THREE.CylinderGeometry(0.11, 0.09, 0.3, 10), M(0x1a1d24, { roughness: .5 }), L); }

      // ⑨ 사람 · 조명
      const fm = M(0xe8ecf4);
      [[0, zB + 0.05], [-0.55, Z(600) + 1.85], [1.25, Z(600) + 1.4], [-3.4, Z(640)], [-2.6, Z(360)], [2.2, Z(300)], [-3.0, Z(930)], [2.4, Z(700)]].forEach(([x, z]) => figure(g, x, z, fm));
      k.spot([AX, 7.5, 4], [AX, 2.6, -1.2], 0xe6f0ff, 150, 0.6); k.spot([0, 8, Z(620)], [0, 0, Z(640)], 0xd8e8ff, 130, 0.8); k.spot([0, 8, Z(330)], [-1, 0, Z(300)], 0xbfe0ff, 110, 0.9);
      k.pool(0, Z(640), 3.5, 0x8fc8ff, 0.3); k.pool(X(260), Z(300), 4.5, 0x3f9bff, 0.35); k.pool(X(500), Z(300), 4, 0x3f9bff, 0.3); k.pool(X(230), Z(650), 3.5, 0x4fa0ff, 0.3); k.pool(AX, -2.5, 3.5, 0x6fb0ff, 0.25);
    },
  };
};
