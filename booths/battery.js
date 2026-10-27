/* 이차전지 부스 3D (부스시안_1027 battery_01 도면 · battery_02 조감 보고 지음, 10. 27.) */
// 도면 battery_01 = 28,497 × 14,252 mm, MAIN GATE가 짧은 왼쪽 → 우리 앞(+z). 도면 위쪽 = 부스 왼쪽(−x)
// 옮기는 식: z = −(px − 47) × 0.0192 · x = (py − 599.5) × 0.0206 (부스 칸 13.1 × 24.4 m에 맞춰 줄임)
// 시안 그림이 작고 사람이 많아 화면은 모두 그려서 씀 (잘라 쓴 그림 없음)
export default ({ THREE, M, E, GLOW, canvasTex, boothKit, CHAIR, FONT }) => {
  const rnd = (s => () => (s = (s * 16807) % 2147483647) / 2147483647)(7);
  const planet = (hue = 0) => canvasTex(1024, 576, (c, w, h) => {              // 시안 벽 LED: 짙은 남색 + 푸른 행성 · 빛줄기
    const bg = c.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#020a2a'); bg.addColorStop(1, '#0a2f8a'); c.fillStyle = bg; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 160; i++) { c.fillStyle = `rgba(150,210,255,${.2 + rnd() * .6})`; c.fillRect(rnd() * w, rnd() * h * .7, 2, 2); }
    const cx = w * (.5 + hue * .18), cy = h * 1.55, r = h * 1.05;
    const g = c.createRadialGradient(cx, cy, r * .9, cx, cy, r * 1.12); g.addColorStop(0, 'rgba(40,120,255,.0)'); g.addColorStop(.45, 'rgba(90,190,255,.95)'); g.addColorStop(.6, 'rgba(30,90,255,.5)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    const p = c.createRadialGradient(cx, cy, 0, cx, cy, r); p.addColorStop(0, '#0a3fae'); p.addColorStop(.92, '#0e56d8'); p.addColorStop(1, '#6fd0ff'); c.fillStyle = p; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill();
    for (let i = 0; i < 6; i++) { c.strokeStyle = `rgba(120,220,255,${.25 + rnd() * .3})`; c.lineWidth = 2 + rnd() * 3; c.beginPath(); c.moveTo(0, h * (.3 + rnd() * .4)); c.bezierCurveTo(w * .3, h * rnd(), w * .7, h * rnd(), w, h * (.3 + rnd() * .4)); c.stroke(); }
    const s = c.createRadialGradient(cx, cy - r, 0, cx, cy - r, w * .25); s.addColorStop(0, 'rgba(255,255,255,.95)'); s.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = s; c.fillRect(0, 0, w, h);
  });
  const PL = [planet(0), planet(-1), planet(1)];
  const kioskTex = canvasTex(256, 512, (c, w, h) => {                          // 세운 키오스크 화면 (파란 아이콘 칸)
    c.fillStyle = '#0a2f8a'; c.fillRect(0, 0, w, h); c.fillStyle = '#3fa8ff'; c.fillRect(0, 0, w, 70);
    for (let y = 0; y < 4; y++) for (let x = 0; x < 2; x++) { c.fillStyle = `rgba(160,220,255,${.35 + rnd() * .4})`; c.fillRect(24 + x * 112, 100 + y * 96, 96, 80); }
  });
  const shelfTex = canvasTex(512, 512, (c, w, h) => {                          // 이벤트 선반 (칸마다 상자)
    c.fillStyle = '#f2f5fa'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c9d2e0'; c.lineWidth = 8;
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { c.strokeRect(x * 128 + 4, y * 128 + 4, 120, 120); c.fillStyle = ['#1f6fe0', '#e8edf5', '#5fb8ff', '#203a7a'][(x + y) % 4]; c.fillRect(x * 128 + 30, y * 128 + 50, 68, 70); }
  });
  const monTex = canvasTex(256, 160, (c, w, h) => { const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#0b3a9a'); g.addColorStop(1, '#2fb0ff'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(255,255,255,.7)'; c.fillRect(20, 20, 90, 14); c.fillRect(20, 44, 140, 8); });
  const gateTex = canvasTex(2048, 256, (c, w, h) => {                          // 게이트 머리 LED (사업명은 시안 쪽 머리글)
    const g = c.createLinearGradient(0, 0, w, 0); g.addColorStop(0, '#0a2a8a'); g.addColorStop(.5, '#1d6dff'); g.addColorStop(1, '#0a2a8a'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#fff'; c.font = `800 120px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('이차전지혁신융합대학사업', w / 2, h / 2 + 6);
  });

  return {
    '이차전지'(g, W, D, carpet, slope) {
      const k = boothKit(g, slope), fr = k.fr;
      const wh = M(0xeef2f8, { roughness: .4, emissive: 0x5a6680, emissiveIntensity: .45 }), wh2 = M(0xdfe5ee, { roughness: .5 });
      const navy = M(0x0c1a44, { roughness: .6 }), blk = M(0x15181f, { roughness: .5 }), glass = M(0xbfe0ff, { transparent: true, opacity: .22, roughness: .05 });
      const blu = E(0x2f86ff, 2.2), cy = E(0x5fd0ff, 2.6), silver = M(0x9aa7ba, { roughness: .35, metalness: .6 });
      carpet.material = M(0xc6ccd6, { roughness: .32 });                         // 밝고 반들한 바닥 (시안)
      const scr = (map, w, h, x, y, z, ry = 0, p = g, kk = 1.15) => {            // 테 두른 LED 화면
        const q = new THREE.Group(); q.position.set(x, y, z); q.rotation.y = ry; p.add(q);
        k.box(w + 0.16, h + 0.16, 0.08, blk, 0, -0.04, -h / 2 - 0.08, q);
        k.pl(GLOW(map, kk), w, h, 0, 0, 0.005, 0, q);
        k.box(w + 0.2, 0.04, 0.1, blu, 0, 0.02, -h / 2 - 0.14, q); return q;
      };
      const cyl = (r0, r1, h, m, x, y, z, n = 24) => { const q = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, n), m); q.position.set(x, y + h / 2, z); g.add(q); return q; };

      // ① 메인 게이트 (흰 기둥 2 + 머리, 파란 빛줄) · 양옆 흰 앞벽
      const GX0 = -2.26, GX1 = 1.45, GH = 3.4;
      k.bxz(GX0 - 0.7, GX0, -1.0, 0, GH + 0.7, wh, 0, fr); k.bxz(GX1, GX1 + 0.7, -1.0, 0, GH + 0.7, wh, 0, fr);
      k.bxz(GX0 - 0.7, GX1 + 0.7, -1.0, 0, 0.7, wh, GH, fr);
      k.pl(GLOW(gateTex, 1.2), GX1 - GX0 + 1.2, 0.5, (GX0 + GX1) / 2, GH + 0.35, 0.01, 0, fr);
      k.bxz(GX0, GX1, -0.9, -0.1, 0.04, blu, GH - 0.04, fr);                     // 머리 아래 빛줄
      [GX0 - 0.02, GX1 + 0.02].forEach(x => k.bxz(x - 0.02, x + 0.02, -0.95, -0.05, GH, blu, 0, fr));
      [GX0 - 0.35, GX1 + 0.35].forEach(x => k.bxz(x - 0.04, x + 0.04, 0, 0.02, GH - 0.2, cy, 0.1, fr));
      k.bxz(-W, GX0 - 0.7, -0.3, 0, 3.0, wh, 0, fr); k.bxz(GX1 + 0.7, W, -0.3, 0, 3.0, wh, 0, fr);
      k.bxz(-W, GX0 - 0.7, -0.32, -0.28, 0.05, blu, 2.95, fr); k.bxz(GX1 + 0.7, W, -0.32, -0.28, 0.05, blu, 2.95, fr);
      k.flat(M(0x1d4fb8, { roughness: .6 }), GX0, GX1, -1.0, 0.0, 0.055, fr);

      // ② 둘레 흰 벽 (3.2 m) + 벽 LED
      const fzL = k.fz(-W), fzR = k.fz(W);
      k.bxz(-W, -W + 0.25, -D, fzL - 0.3, 3.2, wh); k.bxz(W - 0.25, W, -D, fzR - 0.3, 3.2, wh); k.bxz(-W, W, -D, -D + 0.25, 3.2, wh);
      k.bxz(-W + 0.25, -W + 0.29, -D, fzL - 0.3, 0.05, blu, 3.12); k.bxz(W - 0.29, W - 0.25, -D, fzR - 0.3, 0.05, blu, 3.12);
      [[-3.6, 0], [-11.5, 1], [-16.6, 2]].forEach(([z, i]) => scr(PL[i], 2.3, 1.3, -W + 0.27, 1.95, z, Math.PI / 2));
      [[-8.1, 2], [-11.5, 1], [-16.6, 0]].forEach(([z, i]) => scr(PL[i], 2.3, 1.3, W - 0.27, 1.95, z, -Math.PI / 2));

      // ③ 안내 데스크 (오른쪽 앞, 둥근 흰 데스크 + 아래 파란 빛)
      { const sh = new THREE.Shape(); sh.absarc(0, 0, 1.6, Math.PI * 0.08, Math.PI * 0.92, false); sh.absarc(0, 0, 1.05, Math.PI * 0.92, Math.PI * 0.08, true);
        const q = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 1.05, bevelEnabled: false, curveSegments: 24 }), wh); q.rotation.x = -Math.PI / 2; q.position.set(4.35, 0, -0.35); g.add(q);
        const t = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.03, 6, 40, Math.PI * 0.84), cy); t.rotation.x = -Math.PI / 2; t.rotation.z = Math.PI * 0.08; t.position.set(4.35, 0.1, -0.35); g.add(t); }

      // ④ EVENT ZONE (x −6.25 ~ −1.41, z −2.57 ~ −7.28): 키오스크 3 · 둥근 높은 탁자 3 · 선반
      k.flat(M(0xb8c0cd, { roughness: .4 }), -6.25, -1.41, -7.28, -2.57, 0.055);
      [-5.4, -3.8, -2.2].forEach(x => { k.box(0.62, 0.08, 0.4, wh, x, -6.2); k.box(0.56, 1.8, 0.1, wh, x, -6.2, 0.08); k.pl(GLOW(kioskTex, 1.1), 0.48, 0.95, x, 1.35, -6.14); k.box(0.04, 1.8, 0.12, blu, x - 0.3, -6.2, 0.08); });
      [-5.45, -3.86, -2.26].forEach(x => { cyl(0.22, 0.28, 0.04, wh, x, 0, -5.4); cyl(0.05, 0.05, 1.0, silver, x, 0, -5.4); cyl(0.36, 0.36, 0.04, wh, x, 1.0, -5.4); });
      { k.bxz(-2.67, -1.83, -5.05, -4.13, 1.9, wh); k.pl(new THREE.MeshStandardMaterial({ map: shelfTex, roughness: .6 }), 0.84, 1.8, -2.25, 0.95, -4.12); }

      // ⑤ BATTERY VR ZONE (z −8.83 ~ −14.1): 바닥판 2 · VR 기둥 · 앞 화면
      [[-6.03, -4.11], [-3.66, -1.72]].forEach(([x0, x1]) => {
        k.bxz(x0, x1, -13.15, -11.1, 0.12, navy); k.bxz(x0, x1, -11.13, -11.08, 0.13, cy);
        const xc = (x0 + x1) / 2; cyl(0.04, 0.04, 1.5, silver, xc - 0.6, 0.12, -12.6); k.box(0.5, 0.06, 0.06, silver, xc - 0.35, -12.6, 1.6);
        cyl(0.18, 0.18, 0.12, blk, xc, 0.12, -12.2); k.box(0.2, 0.1, 0.12, M(0xf4f6fa, { roughness: .3 }), xc - 0.15, -12.6, 1.42);
        k.box(0.05, 1.0, 0.05, silver, xc, -13.65, 0); scr(PL[(x0 < -5) ? 0 : 2], 1.6, 0.9, xc, 1.5, -13.62);
      });
      [[-5.4, -9.4], [-2.6, -9.4]].forEach(([x, z]) => { k.box(0.5, 1.7, 0.08, wh, x, z); k.pl(GLOW(kioskTex, 1.05), 0.42, 0.85, x, 1.25, z + 0.045); });

      // ⑥ 이차전지 전시 디오라마 (x 0.84 ~ 6.25, z −2.57 ~ −7.28): 유리 칸 안 고전압 배터리 차대 · 오른쪽 벽 LED
      { const x0 = 2.52, x1 = 5.49, z0 = -5.95, z1 = -3.96, xc = (x0 + x1) / 2, zc = (z0 + z1) / 2;
        k.bxz(x0, x1, z0, z1, 0.18, wh); k.bxz(x0 - 0.02, x1 + 0.02, z1 - 0.02, z1 + 0.02, 0.04, cy, 0.16);
        k.bxz(x0, x1, z1 - 0.03, z1, 0.95, glass, 0.18); k.bxz(x0, x1, z0, z0 + 0.03, 0.95, glass, 0.18); k.bxz(x0, x0 + 0.03, z0, z1, 0.95, glass, 0.18); k.bxz(x1 - 0.03, x1, z0, z1, 0.95, glass, 0.18);
        [[x0, z0], [x0, z1], [x1, z0], [x1, z1]].forEach(([x, z]) => k.box(0.06, 1.0, 0.06, silver, x, z, 0.18));
        k.box(1.3, 0.12, 2.3, blk, xc, zc, 0.42);                                 // 차대 (가로로 놓음)
        const W4 = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 20).rotateZ(Math.PI / 2);
        k.inst(W4, blk, [[xc - 0.75, 0.48, zc - 0.85], [xc + 0.75, 0.48, zc - 0.85], [xc - 0.75, 0.48, zc + 0.85], [xc + 0.75, 0.48, zc + 0.85]]);
        k.inst(new THREE.BoxGeometry(0.55, 0.16, 0.44), M(0x8fa4c4, { roughness: .3, metalness: .5 }), [-0.75, -0.25, 0.25, 0.75].flatMap(dz => [-0.3, 0.3].map(dx => [xc + dx, 0.62, zc + dz])));
        k.inst(new THREE.BoxGeometry(0.5, 0.02, 0.06), cy, [-0.75, -0.25, 0.25, 0.75].flatMap(dz => [-0.3, 0.3].map(dx => [xc + dx, 0.71, zc + dz])));
        scr(PL[1], 3.2, 1.6, W - 0.27, 2.0, -4.95, -Math.PI / 2);
        k.box(0.5, 1.7, 0.08, wh, 1.7, -6.5); k.pl(GLOW(kioskTex, 1.05), 0.42, 0.85, 1.7, 1.25, -6.455);
      }

      // ⑦ CO-PLAY BATTERY ZONE (z −8.83 ~ −14.1): 긴 탁자 2 · 모니터 · 흰 의자 · 뒤 칸막이 LED
      { const XS = [3.07, 4.38, 5.72];
        [[-10.64, -9.91], [-12.83, -12.1]].forEach(([z0, z1]) => { k.bxz(2.63, 6.13, z0, z1, 0.06, wh, 0.72); k.bxz(2.68, 6.08, z0 + 0.05, z1 - 0.05, 0.72, wh2); });
        const mons = [[-10.64, -9.91], [-12.83, -12.1]].flatMap(([z0, z1]) => XS.map(x => [x, 0.78, (z0 + z1) / 2]));
        const mg = new THREE.BoxGeometry(0.5, 0.32, 0.04).translate(0, 0.16, 0), sm = GLOW(monTex, 1.1);
        k.inst(mg, [blk, blk, blk, blk, sm, sm], mons);
        const ch = M(0xf6f7fa, { roughness: .4 });
        k.inst(CHAIR, ch, [[-9.5, 0], [-11.05, Math.PI], [-11.7, 0], [-13.25, Math.PI]].flatMap(([z, r]) => XS.map(x => [x, 0, z, r])));
        k.bxz(2.07, W - 0.25, -14.0, -13.65, 2.6, wh); scr(PL[2], 3.4, 1.5, 4.15, 1.75, -13.62);
        k.bxz(2.07, 2.37, -14.0, -8.83, 1.1, wh); k.bxz(2.07, 2.37, -14.0, -8.83, 0.04, blu, 1.1);
      }

      // ⑧ 경진대회 LED 중계 · 휴게 (원탁 3 + 의자 3씩)
      [-3.49, 0.46, 4.03].forEach(x => { cyl(0.05, 0.05, 0.72, silver, x, 0, -17.05); cyl(0.25, 0.3, 0.03, wh, x, 0, -17.05); cyl(0.48, 0.48, 0.04, wh, x, 0.72, -17.05); });
      k.inst(CHAIR, M(0xf6f7fa, { roughness: .4 }), [-3.49, 0.46, 4.03].flatMap(x => [[x - 0.72, 0, -17.05, Math.PI / 2], [x + 0.72, 0, -17.05, -Math.PI / 2], [x, 0, -16.3, Math.PI]]));

      // ⑨ BATTERY FACTORY (z −19.26 ~ 끝, x −W ~ 2.07): 전·좌·우 3면 대형 스크린 · 앞벽 바깥 중계 LED · 왼쪽 입구
      { const z0 = -19.26, X1 = 2.07;
        k.bxz(-4.62, X1, z0 - 0.25, z0, 3.2, wh); k.bxz(X1, X1 + 0.25, -D, z0, 3.2, wh);
        k.flat(navy, -W + 0.25, X1, -D + 0.25, z0 - 0.25, 0.055);
        scr(PL[0], 6.0, 2.4, -1.28, 1.75, z0 + 0.02, 0, g, 1.2);                   // 바깥 중계 LED
        const L = -W + 0.27, bz = -D + 0.27, iz = (z0 - 0.25 + bz) / 2, il = z0 - 0.25 - bz - 0.3;
        k.pl(GLOW(PL[2], 1.2), il, 2.7, L, 1.65, iz, Math.PI / 2);
        k.pl(GLOW(PL[0], 1.25), X1 - L - 0.3, 2.7, (L + X1) / 2, 1.65, bz);
        k.pl(GLOW(PL[1], 1.2), il, 2.7, X1 - 0.02, 1.65, iz, -Math.PI / 2);
        k.box(0.1, 3.2, 0.25, blu, -4.62, z0 - 0.125); k.box(0.1, 3.2, 0.25, blu, -W + 0.3, z0 - 0.125);
        [[-3.6, -21.0], [-1.5, -22.6], [0.4, -21.2]].forEach(([x, z]) => cyl(0.2, 0.2, 0.45, wh, x, 0, z));
        k.spot([-1.3, 5.6, -16.5], [-1.3, 0, -22.5], 0x8fc4ff, 90, 0.7);
      }

      // ⑩ 운영지원 및 창고 (x 2.07 ~ W, z −19.26 ~ 끝): 문 2 · 선반
      { const z0 = -19.26;
        k.bxz(2.32, W - 0.25, z0 - 0.25, z0, 3.2, wh);
        [[2.8, 3.9], [4.0, 5.2]].forEach(([a, b]) => k.bxz(a, b, z0 + 0.0, z0 + 0.03, 2.2, M(0xc0c8d4, { roughness: .4 })));
        k.bxz(W - 0.85, W - 0.3, -D + 0.6, z0 - 0.6, 2.0, M(0x6a7383, { roughness: .6 }));
        k.bxz(3.0, W - 1.0, -D + 0.3, -D + 0.85, 1.6, M(0x6a7383, { roughness: .6 }));
        k.flat(M(0x5a606b, { roughness: .8 }), 2.32, W - 0.25, -D + 0.25, z0 - 0.25, 0.055);
      }

      // 조명 · 바닥 빛
      k.spot([3.9, 5.6, -2.0], [4.0, 0.4, -5.0], 0xdfe9ff, 110, 0.55);
      k.pool(-0.4, -1.2, 2.2, 0x2f7bff, 0.5); k.pool(4.0, -5.0, 2.0, 0x4fa0ff, 0.45); k.pool(-1.3, -17.6, 3.0, 0x2a6aff, 0.4);
    },
  };
};
