/* 반도체소부장 부스 3D (부스시안_1027 sobu_02·03·04·06·07·08 보고 지음, 10. 27.) */
// 도면 sobu_08 (위에서 본 그림) → x = (px − 702.5) / 41 · z = −(870 − py) / 34.7 (부스 칸 13.6 × 23.3 m)
export default ({ THREE, M, E, GLOW, canvasTex, B3, boothKit, CHAIR, FONT }) => {
  const pathTex = canvasTex(128, 256, (c, w, h) => {                            // 바닥 LED 길 (남색 띠 + 하늘색 줄 + 화살표)
    c.fillStyle = '#0a2a9a'; c.fillRect(0, 0, w, h); c.fillStyle = '#39c8ff'; c.fillRect(8, 0, 12, h); c.fillRect(w - 20, 0, 12, h);
    c.strokeStyle = 'rgba(160,230,255,.8)'; c.lineWidth = 6; c.beginPath(); c.moveTo(48, 150); c.lineTo(64, 120); c.lineTo(80, 150); c.stroke();
  });
  pathTex.wrapS = pathTex.wrapT = THREE.RepeatWrapping;
  const chipTex = canvasTex(512, 512, (c, w, h) => {                            // 육각 바닥 가운데 칩 그림
    c.strokeStyle = '#ffffff'; c.lineWidth = 16; c.strokeRect(156, 156, 200, 200); c.lineWidth = 10; c.strokeRect(196, 196, 120, 120);
    for (let i = 0; i < 5; i++) { const t = 176 + i * 40; [[t, 156, t, 110], [t, 356, t, 402], [156, t, 110, t], [356, t, 402, t]].forEach(([a, b, d, e]) => { c.beginPath(); c.moveTo(a, b); c.lineTo(d, e); c.stroke(); }); }
  });
  const bannerTex = canvasTex(2048, 192, (c, w, h) => {                         // 양옆 낮은 현수막 벽 (시안 글: 반도체소부장 / 반도체 장비 분해 VR 체험존)
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0d1f6a'); g.addColorStop(1, '#08144a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(90,170,255,.55)'; c.lineWidth = 3;
    for (let i = 0; i < 4; i++) { const x = 60 + i * 512; c.beginPath(); c.moveTo(x + 300, 30); c.lineTo(x + 360, 30); c.lineTo(x + 390, 70); c.lineTo(x + 470, 70); c.moveTo(x + 300, 160); c.lineTo(x + 380, 160); c.lineTo(x + 410, 120); c.lineTo(x + 480, 120); c.stroke(); c.strokeRect(x + 30, 60, 50, 50); }
    c.fillStyle = '#fff'; c.textBaseline = 'middle';
    for (let i = 0; i < 4; i++) { const x = 100 + i * 512; c.font = `800 40px ${FONT}`; c.fillText('반도체소부장', x, 68); c.font = `600 26px ${FONT}`; c.fillText('반도체 장비 분해 VR 체험존', x - 6, 126); }
  });
  bannerTex.wrapS = THREE.RepeatWrapping;
  const navyTex = canvasTex(512, 512, (c, w, h) => {                            // 게이트 옆·뒷면 (남색 회로 무늬)
    c.fillStyle = '#0c1d66'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(90,170,255,.45)'; c.lineWidth = 4;
    for (let i = 0; i < 9; i++) { const y = 40 + i * 52; c.beginPath(); c.moveTo(0, y); c.lineTo(160 + (i % 3) * 40, y); c.lineTo(220 + (i % 3) * 40, y + 30); c.lineTo(w, y + 30); c.stroke(); }
  });
  const tableTex = canvasTex(256, 128, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#1a3ad8'); g.addColorStop(.5, '#4f8cff'); g.addColorStop(1, '#1a3ad8'); c.fillStyle = g; c.fillRect(0, 0, w, h); });
  const arenaTex = (a, b) => canvasTex(256, 384, (c, w, h) => {                 // 무대 위 경기판 (빛나는 칸 판)
    c.fillStyle = a; c.fillRect(0, 0, w, h); c.strokeStyle = b; c.lineWidth = 10;
    for (let x = 0; x <= 2; x++) { c.beginPath(); c.moveTo(16 + x * 112, 16); c.lineTo(16 + x * 112, h - 16); c.stroke(); }
    for (let y = 0; y <= 3; y++) { c.beginPath(); c.moveTo(16, 16 + y * 117); c.lineTo(w - 16, 16 + y * 117); c.stroke(); }
  });
  const AR = [arenaTex('#ffd8f4', '#ffffff'), arenaTex('#fff7c8', '#ffffff')];

  return {
    '반도체소부장'(g, W, D, carpet, slope) {
      const k = boothKit(g, slope), fr = k.fr;
      const wh = M(0xf1f3f7, { roughness: .4, emissive: 0x5a6070, emissiveIntensity: .4 }), blk = M(0x0c0d12, { roughness: .55 }), dk = M(0x1b1d24, { roughness: .6 });
      const cy = E(0x3fe0ff, 1.5), blu = E(0x2a7bff, 2.2), frame = M(0x2a2e38, { roughness: .4, metalness: .5 }), glass = M(0x9fd8ff, { transparent: true, opacity: .14, roughness: .05 });
      const nav = M(0xffffff, { map: navyTex, roughness: .5, emissive: 0x0a1a5a, emissiveIntensity: .3 });
      carpet.material = M(0x2c2e33, { roughness: .9 });                            // 짙은 회색 바닥
      const add = (m, p = g) => { p.add(m); return m; };

      // ① 정문 게이트 (시안 03 앞면 잘라 붙임, 폭 5.6 · 높이 4.58 · 깊이 0.9) + 흰 네모 장식
      const GC = -0.8, GW = 5.6, LEG = 0.85, OH = 2.76, HH = 1.82, GD = 0.9, x0 = GC - GW / 2, x1 = GC + GW / 2;
      k.bxz(x0, x0 + LEG, -GD, 0, OH, nav, 0, fr); k.bxz(x1 - LEG, x1, -GD, 0, OH, nav, 0, fr); k.bxz(x0, x1, -GD, 0, HH, nav, OH, fr);
      k.pl(GLOW(B3('sobu_gateT'), 0.8), GW, HH, GC, OH + HH / 2, 0.006, 0, fr);
      k.pl(GLOW(B3('sobu_gateL'), 0.75), LEG, OH, x0 + LEG / 2, OH / 2, 0.006, 0, fr);
      k.pl(GLOW(B3('sobu_gateR'), 0.75), LEG, OH, x1 - LEG / 2, OH / 2, 0.006, 0, fr);
      k.pl(GLOW(B3('sobu_gateT'), 0.7), GW, HH, GC, OH + HH / 2, -GD - 0.006, Math.PI, fr);
      [[x0 + LEG, x0 + LEG + 0.04], [x1 - LEG - 0.04, x1 - LEG]].forEach(([a, b]) => { k.bxz(a, b, -GD + 0.02, -0.02, OH, wh, 0, fr); k.bxz(a, b, -0.04, 0.0, OH, cy, 0, fr); });
      k.bxz(x0 + LEG, x1 - LEG, -0.04, 0, 0.04, cy, OH - 0.04, fr);
      [x0 - 0.02, x1 - 0.02].forEach(x => k.bxz(x, x + 0.04, -0.04, 0.02, OH + HH, cy, 0, fr)); k.bxz(x0, x1, -0.04, 0.02, 0.04, cy, OH + HH - 0.02, fr);
      const cube = new THREE.BoxGeometry(0.42, 0.36, 0.42);
      { const L = []; for (let i = 0; i < 6; i++) L.push([x0 + 0.5 + i * (GW - 1) / 5, OH + HH + 0.18, -GD / 2]);
        [0.9, 1.7, 2.5, 3.6].forEach(y => { L.push([x0 - 0.2, y, -GD / 2]); L.push([x1 + 0.2, y, -GD / 2]); });
        const im = new THREE.InstancedMesh(cube, wh, L.length), o = new THREE.Object3D(); L.forEach((p, i) => { o.position.set(...p); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }); fr.add(im); }
      k.spot([-4.5, 5.8, -3.0], [-1.0, 0.2, -6.5], 0xbfd8ff, 80, 0.6);

      // ② 바닥 LED 길 (1 · 2번 길 + 오른쪽 길) · 육각 칩 바닥
      const seg = (a, b, wd = 0.5) => { const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz); const geo = new THREE.PlaneGeometry(wd, L); const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) * L / 1.0); const m = new THREE.Mesh(geo, GLOW(pathTex, 1.05)); m.rotation.order = 'YXZ'; m.rotation.x = -Math.PI / 2; m.rotation.y = Math.atan2(-dx, -dz); m.position.set((a[0] + b[0]) / 2, 0.06, (a[1] + b[1]) / 2); add(m); };
      const path = P => { P.forEach((p, i) => { if (i) seg(P[i - 1], p); }); P.slice(1, -1).forEach(([x, z]) => k.flat(GLOW(pathTex, 1.0), x - 0.25, x + 0.25, z - 0.25, z + 0.25, 0.058)); };
      const F = x => k.fz(x) - 0.1;
      path([[-2.6, -7.55], [-2.6, -5.19], [-1.28, -3.46], [-1.28, F(-1.28)]]);
      path([[-0.3, F(-0.3)], [-0.3, -3.75], [1.65, -3.75], [1.65, -5.9], [0.23, -5.9], [0.23, -8.4]]);
      path([[5.6, -8.4], [5.6, F(5.6) - 0.6]]);
      { const ring = (r0, r1, m, y) => { const q = new THREE.Mesh(new THREE.RingGeometry(r0, r1, 6), m); q.rotation.x = -Math.PI / 2; q.position.set(-2.6, y, -8.88); add(q); };
        ring(1.42, 1.55, cy, 0.062); ring(1.2, 1.42, GLOW(pathTex, 0.9), 0.061); ring(1.12, 1.2, cy, 0.062); ring(0, 1.12, M(0x15171c), 0.06);
        const q = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), GLOW(chipTex, 1.0, { transparent: true })); q.rotation.x = -Math.PI / 2; q.position.set(-2.6, 0.065, -8.88); add(q); }

      // ③ 방진복 체험 (바닥 매트 · 에어샤워 문틀 · 유리 탈의실 · 사물함) · 검정 클린룸
      k.flat(M(0x7f9fe0, { roughness: .7 }), 0.26, 2.0, -6.92, -4.9, 0.057); k.flat(M(0xc77fb8, { roughness: .7 }), 0.26, 2.0, -4.9, -2.74, 0.057);
      { const p = [[-0.26, -8.27], [0.79, -8.27], [-0.26, -7.06], [0.79, -7.06]]; p.forEach(([x, z]) => k.box(0.08, 2.3, 0.08, wh, x, z));
        k.bxz(-0.26, 0.79, -8.31, -7.02, 0.08, wh, 2.3); [-8.27, -7.66, -7.06].forEach(z => k.bxz(-0.26, 0.79, z - 0.03, z + 0.03, 0.05, wh, 1.15)); }
      k.box(0.5, 1.7, 0.06, frame, 1.3, -6.95); k.pl(M(0xcfe4ff, { roughness: .05, metalness: .9 }), 0.42, 1.5, 1.3, 0.95, -6.915);
      { const X0 = 2.06, X1 = 3.84, Z0 = -6.92, Z1 = -2.68, H = 2.6;
        k.bxz(X0, X1, Z0, Z1, H, glass);
        [[X0, Z0], [X1, Z0], [X0, Z1], [X1, Z1]].forEach(([x, z]) => k.box(0.05, H, 0.05, cy, x, z));
        k.bxz(X0, X1, Z0 - 0.02, Z0 + 0.02, 0.05, cy, H); k.bxz(X0, X1, Z1 - 0.02, Z1 + 0.02, 0.05, cy, H); k.bxz(X0 - 0.02, X0 + 0.02, Z0, Z1, 0.05, cy, H); k.bxz(X1 - 0.02, X1 + 0.02, Z0, Z1, 0.05, cy, H);
        k.box(0.03, 0.03, 3.6, frame, 2.95, -4.8, 1.9);
        k.inst(new THREE.BoxGeometry(0.5, 1.05, 0.12).translate(0, -0.55, 0), M(0xeef2f8, { roughness: .7 }), [-6.3, -5.7, -4.0, -3.4].map(z => [2.95, 1.88, z, Math.PI / 2]));
        k.bxz(3.96, 4.33, -5.24, -4.27, 1.8, blk); }
      { const H = 2.8; k.bxz(-0.26, 2.45, -9.5, -8.4, H, blk); k.bxz(2.45, 6.08, -10.5, -8.4, H, blk);
        [[-0.26, 2.45, -8.4], [2.45, 6.08, -8.4]].forEach(([a, b, z]) => k.bxz(a, b, z - 0.02, z + 0.02, 0.05, cy, H));
        k.bxz(2.43, 2.47, -9.5, -8.4, 0.05, cy, H); k.bxz(-0.28, -0.24, -9.5, -8.4, 0.05, cy, H);
        k.bxz(5.0, 5.9, -8.41, -8.38, 2.1, M(0x2a2d36, { roughness: .4 })); }

      // ④ 안내 데스크 (시안 information 앞면) + 흰 둥근 의자 3 · 앞 왼쪽 이젤 TV
      k.bxz(2.08, 4.08, -1.07, -0.58, 1.0, wh); k.pl(GLOW(B3('sobu_info'), 1.05), 2.0, 1.0, 3.08, 0.5, -0.575);
      { const egg = new THREE.SphereGeometry(0.28, 16, 12).scale(1, 1.25, 1); k.inst(egg, wh, [2.45, 3.07, 3.68].map(x => [x, 0.42, -1.44])); }
      { const q = new THREE.Group(); q.position.set(-5.78, 0, -1.2); q.rotation.y = 0.35; g.add(q);
        [[-0.5, 0.12], [0.5, 0.12], [-0.5, -0.4], [0.5, -0.4]].forEach(([x, z]) => k.box(0.05, 1.9, 0.05, blk, x, z, 0, q));
        k.box(1.25, 0.72, 0.06, blk, 0, 0.05, 1.25, q); k.pl(GLOW(B3('sobu_screen'), 1.15), 1.18, 0.65, 0, 1.61, 0.085, 0, q); }

      // ⑤ 왼쪽 VR 체험 칸 4 (파란 바닥 · 틀 · 하늘색 위 테두리 · 헤드셋 걸이)
      { const X0 = -6.77, X1 = -5.0, ZS = [-10.58, -8.5, -6.35, -4.29, -2.22], H = 2.6;
        k.flat(M(0x1a3fb8, { roughness: .6, emissive: 0x0a2280, emissiveIntensity: .5 }), X0, X1, ZS[0], ZS[4], 0.058);
        const post = new THREE.BoxGeometry(0.05, H, 0.05).translate(0, H / 2, 0);
        k.inst(post, frame, ZS.flatMap(z => [[X0, 0, z], [X1, 0, z]]));
        k.bxz(X1 - 0.02, X1 + 0.02, ZS[0], ZS[4], 0.05, cy, H); k.bxz(X0 - 0.02, X0 + 0.02, ZS[0], ZS[4], 0.05, cy, H);
        ZS.forEach(z => k.bxz(X0, X1, z - 0.02, z + 0.02, 0.05, cy, H));
        k.inst(new THREE.TorusGeometry(0.09, 0.03, 6, 12), M(0xf4f6fa, { roughness: .3 }), ZS.slice(0, 4).map(z => [X1, 1.5, z - 1.04, Math.PI / 2])); }

      // ⑥ 양옆 낮은 현수막 벽 (1.2 m) · 뒷벽 검정 + 로고판
      { const L = D - 0.6; const m = GLOW(bannerTex, 0.9); m.map = bannerTex.clone(); m.map.repeat.set(L / 13, 1); m.map.needsUpdate = true;
        const zc = -D / 2 - 0.3;
        k.bxz(-W, -W + 0.12, -D, -0.6, 1.2, blk); k.pl(m, L, 1.1, -W + 0.125, 0.6, zc, Math.PI / 2);
        k.bxz(W - 0.12, W, -D, k.fz(W) - 0.6, 1.2, blk); k.pl(m, L, 1.1, W - 0.125, 0.6, zc, -Math.PI / 2);
        k.bxz(-W + 0.12, -W + 0.16, -D, -0.6, 0.04, blu, 1.2); k.bxz(W - 0.16, W - 0.12, -D, k.fz(W) - 0.6, 0.04, blu, 1.2); }
      k.bxz(-W, W, -D, -D + 0.25, 3.0, blk);
      [-4.6, 4.6].forEach(x => k.pl(GLOW(B3('sobu_logo'), 1.0), 2.6, 1.1, x, 2.1, -D + 0.26));
      k.bxz(-W, -W + 0.2, -D, -D + 0.6, 3.0, M(0x3a2a7a, { roughness: .5, emissive: 0x5a2ad0, emissiveIntensity: .5 }));
      k.bxz(W - 0.2, W, -D, -D + 0.6, 3.0, M(0x3a2a7a, { roughness: .5, emissive: 0x5a2ad0, emissiveIntensity: .5 }));

      // ⑦ 경진대회 무대 (빨간 무대 · 경기판 2 · LED 화면 · 위 대회 이름 · 스피커)
      k.bxz(-2.67, 2.67, -20.9, -17.5, 0.4, M(0x7a0e14, { roughness: .7 })); k.bxz(-2.67, 2.67, -17.52, -17.48, 0.05, E(0xff3040, 1.2), 0.36);
      [[-1.9, -0.84, 0], [1.04, 2.08, 1]].forEach(([a, b, i]) => { k.bxz(a, b, -19.8, -17.9, 0.72, wh, 0.4); k.flat(GLOW(AR[i], 1.2), a + 0.03, b - 0.03, -19.77, -17.93, 1.125); });
      k.bxz(-2.45, 2.45, -21.5, -21.2, 4.25, blk);
      k.pl(GLOW(B3('sobu_screen'), 1.25), 4.6, 2.6, 0, 2.85, -21.19);
      { const t = k.txt(['반도체 소부장', '웨이퍼 이송로봇 경진대회'], 3.6, 0.8, { size: 180 }, 1.3); t.position.set(0, 4.75, -21.2); g.add(t); }
      [-2.95, 2.95].forEach(x => { k.box(0.4, 1.5, 0.4, blk, x, -20.6); k.box(0.3, 0.05, 0.3, x < 0 ? E(0xb040ff, 1.6) : E(0x3060ff, 1.6), x, -20.6, 1.5); });
      k.spot([0, 5.8, -14.5], [0, 0.4, -19.0], 0xffe2e6, 110, 0.55);

      // ⑧ 심사석 3 · 관람석 2줄 × 9
      [[-2.4, -0.82], [-0.8, 0.8], [0.82, 2.4]].forEach(([a, b]) => { k.bxz(a, b, -16.4, -15.6, 0.75, blk); k.pl(GLOW(tableTex, 0.9), b - a - 0.06, 0.5, (a + b) / 2, 0.45, -15.595); });
      const ch = M(0x23252c, { roughness: .6 });
      k.inst(CHAIR, ch, [-2.4, -0.82, 0.8].flatMap(a => [a + 0.4, a + 1.15].map(x => [x, 0, -15.2, 0])));
      k.inst(CHAIR, ch, [-14.35, -13.37].flatMap(z => Array.from({ length: 9 }, (_, i) => [-2.2 + i * 0.565, 0, z, 0])));

      // ⑨ 참가팀 책상 12 (양옆 지그재그, 바닥 색 빛)
      { const T = [], C = [], PO = [[-5.67, -20.2, 0xffd040], [-4.4, -18.2, 0x8a40ff], [-5.67, -16.1, 0x40ff80], [-4.4, -14.1, 0xc040ff], [4.52, -22.2, 0xffd040], [5.67, -20.2, 0xff40c0], [4.52, -18.2, 0x40ff80], [5.67, -16.1, 0x9a40ff]];
        [[-4.4, -22.2], [-5.67, -20.2], [-4.4, -18.2], [-5.67, -16.1], [-4.4, -14.1], [-5.67, -12.1], [4.52, -22.2], [5.67, -20.2], [4.52, -18.2], [5.67, -16.1], [4.52, -14.1], [5.67, -12.1]].forEach(([x, z]) => {
          T.push([x, 0, z]); [-0.35, 0.35].forEach(dx => { C.push([x + dx, 0, z - 0.62, Math.PI]); C.push([x + dx, 0, z + 0.62, 0]); }); });
        k.inst(new THREE.BoxGeometry(1.4, 0.75, 0.75).translate(0, 0.375, 0), blk, T);
        k.inst(new THREE.BoxGeometry(0.3, 0.2, 0.02).translate(0, 0.85, 0), E(0x6fd0ff, 1.3), T);
        k.inst(CHAIR, ch, C);
        PO.forEach(([x, z, c]) => k.pool(x, z, 1.2, c, 0.55)); }
      k.pool(0, -19.2, 3.0, 0xff3050, 0.4); k.pool(-0.8, -1.5, 2.2, 0x2a8cff, 0.5);
    },
  };
};
