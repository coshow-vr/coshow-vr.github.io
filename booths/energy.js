/* 에너지신산업 부스 — 시안 「에너지신산업 Design Proposal」 energy_02~14 보고 지음 (10. 27.) */
// 평면도(energy_02, 13.0 × 27.5 m): 평면 아래 = 앞선(메인 입구), 평면 오른쪽 = +x. 놀이터 컨셉(주황 · 크림 · 줄무늬 · 전구)
export default ({ THREE, M, E, GLOW, canvasTex, B3, boothKit, CHAIR, FONT, mergeGeometries }) => ({
  '에너지신산업'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr, PI = Math.PI;
    const em = (c, e, i = .55, o = {}) => M(c, { roughness: .55, emissive: e, emissiveIntensity: i, ...o });
    const or = em(0xf27420, 0xd0580e, .75), cr = em(0xfff3e0, 0xd2c2a6, .75), bl = em(0x49b8e6, 0x1d5a78, .55);
    const wh = em(0xf6f7f9, 0xd6d4cc, .7), rd = em(0xd8402c, 0x7a1a0e, .6), rdk = em(0x9c2a22, 0x4a0e08, .5), dk = M(0x16171c, { roughness: .45 });
    const tm = (t, a = .45) => M(0xffffff, { map: t, roughness: .55, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: a });
    const stripe = (a, b, n, s = 256) => canvasTex(s, s, (c, w, h) => { c.fillStyle = a; c.fillRect(0, 0, w, h); c.fillStyle = b; for (let i = 0; i < n; i++) c.fillRect((i + .5) * w / n, 0, w / n / 2, h); });
    const strM = tm(stripe("#f27420", "#fff3e0", 4), .7);
    const a0 = -Math.atan(slope), F = (x, z) => [x * Math.cos(a0) + z * Math.sin(a0), -x * Math.sin(a0) + z * Math.cos(a0)];   // 앞선 그룹 좌표 → 부스 좌표
    const bulbs = [], bulbF = (x, y, z) => { const [a, b] = F(x, z); bulbs.push([a, y, b]); };
    const poly = (m, pts, y = 0.065) => { const s = new THREE.Shape(); pts.forEach(([x, z], i) => i ? s.lineTo(x, -z) : s.moveTo(x, -z)); const q = new THREE.Mesh(new THREE.ShapeGeometry(s), m); q.rotation.x = -PI / 2; q.position.y = y; g.add(q); return q; };
    const marq = (txt, fs = 64) => canvasTex(768, 200, (c, w, h) => {
      c.fillStyle = '#f27420'; c.beginPath(); c.roundRect(4, 4, w - 8, h - 8, 40); c.fill();
      c.fillStyle = '#fff3e0'; c.beginPath(); c.roundRect(36, 36, w - 72, h - 72, 22); c.fill();
      c.fillStyle = '#fff6c8'; for (let x = 30; x < w - 10; x += 44) [19, h - 19].forEach(y => { c.beginPath(); c.arc(x, y, 7, 0, 7); c.fill(); });
      let s = fs; c.font = `800 ${s}px ${FONT}`; while (c.measureText(txt).width > w - 120 && s > 20) { s -= 2; c.font = `800 ${s}px ${FONT}`; }
      c.fillStyle = '#5a2a0c'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w / 2, h / 2 + 3); });

    // 바닥: 주황 카펫 + 양옆 하늘색 띠 (energy_02 · 05)
    carpet.material = em(0xf5a04e, 0xc06a22, .7, { roughness: .95 });
    const x1 = -W + 0.85, x2 = W - 0.75;
    poly(bl, [[-W, k.fz(-W)], [x1, k.fz(x1)], [x1, -D], [-W, -D]]); poly(bl, [[x2, k.fz(x2)], [W, k.fz(W)], [W, -D], [x2, -D]]);

    // 1. 메인 게이트 (energy_03 · 05): 크림 ∩ 틀 + 안쪽 주황 기둥(아래 줄무늬) + 전구 간판
    { const s = new THREE.Shape(), xo = 4.45, xi = 3.7, yt = 3.85, yi = 3.2, r = .7, ri = .35;
      s.moveTo(-xo, 0); s.lineTo(-xo, yt - r); s.quadraticCurveTo(-xo, yt, -xo + r, yt); s.lineTo(xo - r, yt); s.quadraticCurveTo(xo, yt, xo, yt - r); s.lineTo(xo, 0);
      s.lineTo(xi, 0); s.lineTo(xi, yi - ri); s.quadraticCurveTo(xi, yi, xi - ri, yi); s.lineTo(-xi + ri, yi); s.quadraticCurveTo(-xi, yi, -xi, yi - ri); s.lineTo(-xi, 0); s.closePath();
      const ga = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 1.1, bevelEnabled: false, curveSegments: 8 }), [cr, or]); ga.position.z = -1.4; fr.add(ga);
      [-1, 1].forEach(sg => { k.box(0.55, 1.8, 0.9, or, sg * 3.42, -0.85, 1.4, fr); k.box(0.55, 1.4, 0.9, strM, sg * 3.42, -0.85, 0, fr); });
      [-0.55, -0.85, -1.15].forEach(z => k.box(5.6, 0.03, 0.06, E(0xfff6e0, 1.1), 0, z, 3.15, fr));
      for (let x = -4.1; x <= 4.11; x += 0.41) if (Math.abs(x + 0.4) > 2.05) bulbF(x, 3.78, -0.26);
      k.box(4.0, 1.38, 0.16, or, -0.4, -0.32, 2.98, fr);
      k.pl(GLOW(B3('energy_sign'), 1.1), 3.75, 1.12, -0.4, 3.67, -0.235, 0, fr);
      for (let x = -2.3; x <= 1.51; x += 0.38) bulbF(x, 4.4, -0.3);
      k.box(0.03, 0.6, 0.03, wh, -0.4, -0.32, 4.36, fr); k.box(0.36, 0.22, 0.01, wh, -0.2, -0.32, 4.72, fr);
      // 인포데스크 + ENTRANCE · EXIT 화살표
      k.box(1.9, 0.95, 0.65, or, -0.35, -1.9, 0.16, fr); k.box(1.9, 0.16, 0.65, strM, -0.35, -1.9, 0, fr); k.box(1.98, 0.05, 0.72, cr, -0.35, -1.9, 1.11, fr);
      const it = k.txt(['INFORMATION'], 1.0, 0.18, { fg: '#ffffff', size: 110 }, 1.1); it.position.set(-0.05, 0.86, -1.57); fr.add(it);
      const arw = (txt, left, col) => canvasTex(512, 128, (c, w, h) => { const P = left ? [[44, 10], [w - 8, 10], [w - 8, h - 10], [44, h - 10], [6, h / 2]] : [[8, 10], [w - 44, 10], [w - 6, h / 2], [w - 44, h - 10], [8, h - 10]];
        c.beginPath(); P.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fillStyle = '#3aa6dc'; c.fill(); c.lineWidth = 8; c.strokeStyle = '#e8f6ff'; c.stroke();
        c.fillStyle = col; c.font = `800 62px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, w / 2 + (left ? 16 : -16), h / 2 + 3); });
      [[-1.6, 'ENTRANCE', true, '#ff3d8b'], [1.2, 'EXIT', false, '#ffffff']].forEach(([x, t, l, col]) => { k.box(0.07, 2.85, 0.07, or, x, -1.95, 0, fr); k.pl(GLOW(arw(t, l, col), 1.05, { transparent: true, side: THREE.DoubleSide }), 1.05, 0.26, x + (l ? -0.42 : 0.42), 2.55, -1.9, 0, fr); });
      // 앞 울타리 (투명판 + 주황 틀 · 「에너지신산업 X COSS」)
      const gl = new THREE.MeshStandardMaterial({ color: 0xffe8d6, transparent: true, opacity: .32, roughness: .1, metalness: .1 });
      [-1, 1].forEach(sg => { const a = 4.5, b = W - 0.08, n = 2, pw = (b - a) / n;
        for (let i = 0; i < n; i++) { const xc = sg * (a + pw * (i + .5)); k.box(pw - 0.06, 1.05, 0.03, gl, xc, -0.35, 0.12, fr); const t = k.txt(['에너지신산업', 'X', 'COSS'], pw * 0.85, 0.8, { fg: '#ffffff', size: 92 }, 0.85); t.position.set(xc, 0.7, -0.33); fr.add(t); }
        for (let i = 0; i <= n; i++) k.box(0.07, 1.25, 0.07, or, sg * (a + pw * i), -0.35, 0, fr);
        k.box(b - a, 0.06, 0.08, or, sg * (a + b) / 2, -0.35, 1.2, fr); k.box(b - a, 0.08, 0.08, or, sg * (a + b) / 2, -0.35, 0.04, fr); });
      // ENERGY ISLAND 안내판 (앞 왼쪽, energy_05)
      k.box(0.6, 0.04, 0.4, bl, -5.35, -0.05, 0, fr); const po = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.4, 10), bl); po.position.set(-5.35, 0.7, -0.05); fr.add(po);
      k.pl(GLOW(B3('energy_island'), 1.05), 1.25, 0.9, -5.35, 1.85, 0.0, 0, fr); }

    // 2. 매표소 (F, energy_03 · 14): 주황 격자 카운터 · 빨간 뒷벽 · 줄무늬 차양 · TIKET 간판
    { const grid = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#f27420'; c.fillRect(0, 0, w, h); c.strokeStyle = '#ffcf9e'; c.lineWidth = 3; for (let i = 0; i <= 8; i++) { c.beginPath(); c.moveTo(i * w / 8, 0); c.lineTo(i * w / 8, h); c.moveTo(0, i * h / 8); c.lineTo(w, i * h / 8); c.stroke(); } });
      grid.wrapS = grid.wrapT = THREE.RepeatWrapping; grid.repeat.set(3, 1);
      k.bxz(-1.2, 1.27, -5.45, -5.0, 0.12, strM); k.bxz(-1.2, 1.27, -5.45, -5.0, 0.88, tm(grid), 0.12); k.bxz(-1.25, 1.32, -5.5, -4.95, 0.05, cr, 1.0);
      [[-1.32, -4.97], [1.39, -4.97], [-1.32, -7.14], [1.39, -7.14]].forEach(([x, z]) => k.box(0.16, 2.6, 0.16, or, x, z));
      k.bxz(-1.3, 1.37, -7.2, -7.08, 2.5, rd); [-1.27, 1.34].forEach(x => k.bxz(x - 0.05, x + 0.05, -7.08, -5.5, 2.4, rdk));
      k.bxz(-1.45, 1.52, -7.28, -4.9, 0.15, or, 2.6);
      const aw = new THREE.Mesh(new THREE.PlaneGeometry(2.95, 0.7), M(0xffffff, { map: stripe('#d8402c', '#ffffff', 8), side: THREE.DoubleSide, roughness: .6, emissive: 0x555555, emissiveIntensity: .5 }));
      aw.position.set(0.03, 2.4, -4.72); aw.rotation.x = -0.9; g.add(aw);
      k.bxz(-0.85, 0.91, -4.98, -4.88, 0.5, cr, 2.75); k.pl(GLOW(B3('energy_tiket'), 1.1), 1.62, 0.42, 0.03, 3.0, -4.87);
      for (let x = -0.75; x <= 0.82; x += 0.26) bulbs.push([x, 3.27, -4.93]);
      // 포토존 (G): 매표소 뒷면, 안쪽을 향함 — 유나 판단
      const ph = canvasTex(512, 480, (c, w, h) => { c.fillStyle = '#f27420'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff3e0';
        c.beginPath(); c.moveTo(70, h - 30); c.lineTo(70, 200); c.arc(w / 2, 200, w / 2 - 70, PI, 0); c.lineTo(w - 70, h - 30); c.closePath(); c.fill();
        for (let a = 0; a <= 12; a++) { const t = PI + a * PI / 12; c.beginPath(); c.arc(w / 2 + Math.cos(t) * (w / 2 - 70), 200 + Math.sin(t) * (w / 2 - 70), 16, 0, 7); c.fill(); }
        c.fillStyle = '#fff6c8'; for (let y = 40; y < h - 20; y += 40) [32, w - 32].forEach(x => { c.beginPath(); c.arc(x, y, 8, 0, 7); c.fill(); }); });
      k.pl(GLOW(ph, 1.0), 2.6, 2.4, 0.03, 1.25, -7.215, PI);
      k.bxz(-1.15, 1.21, -7.42, -7.28, 0.75, or, 2.75); k.pl(GLOW(B3('energy_photo'), 1.05), 2.2, 0.65, 0.03, 3.12, -7.43, PI); }

    // 3. 머리 위 주황 빔 고리 (energy_14) + 줄무늬 기둥 + 체험물 간판
    { const yb = 2.85, hb = 0.32, xl = -5.0, xr = 5.3, zf = -5.25, zb = -19.5, R = 0.8;
      k.bxz(xl - 0.15, xl + 0.15, zb, zf - R, hb, or, yb); k.bxz(xr - 0.15, xr + 0.15, zb, zf - R, hb, or, yb); k.bxz(xl + R, xr - R, zf - 0.15, zf + 0.15, hb, or, yb);
      [[xl + R, PI], [xr - R, -PI / 2]].forEach(([cx, rz]) => { const t = new THREE.Mesh(new THREE.TorusGeometry(R, 0.16, 8, 16, PI / 2), or); t.rotation.set(-PI / 2, 0, rz); t.position.set(cx, yb + hb / 2, zf - R); g.add(t); });
      [[xl, -19.35], [xl, -15.5], [xl, -11.4], [xl, -7.4], [xr, -19.35], [xr, -12.6], [xr, -7.4], [-3.0, zf], [2.7, zf]].forEach(([x, z]) => { k.box(0.34, 1.15, 0.34, strM, x, z); k.box(0.26, yb - 1.15, 0.26, or, x, z, 1.15); });
      [['수력풍력에너지 체험물', -17.6, xl, PI / 2], ['태양광회로 체험물', -13.5, xl, PI / 2], ['수소자동차 체험물', -9.4, xl, PI / 2], ['에너지신산업 교육관', -15.9, xr, -PI / 2]].forEach(([t, z, x, ry]) => {
        k.bxz(x - 0.06, x + 0.06, z - 0.95, z + 0.95, 0.52, or, yb + hb); k.pl(GLOW(marq(t), 1.05, { transparent: true }), 1.9, 0.5, x + Math.sign(-x) * 0.07, yb + hb + 0.26, z, ry); });

      // 왼쪽 체험물 3곳: 흰 카운터 + 반원 스탬프대(E) + 의자
      const half = new THREE.CylinderGeometry(0.25, 0.25, 0.9, 16, 1, false, 0, PI).translate(0, 0.45, 0);
      const stool = mergeGeometries([new THREE.CylinderGeometry(0.19, 0.19, 0.05, 14).translate(0, 0.72, 0), new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6).translate(0, 0.35, 0), new THREE.CylinderGeometry(0.18, 0.18, 0.02, 14).translate(0, 0.01, 0)]);
      const zs = [-17.0, -13.0, -8.9];
      zs.forEach(z => { k.bxz(-4.75, -4.1, z - 0.6, z + 0.6, 0.95, wh); k.bxz(-4.75, -4.1, z - 0.6, z + 0.6, 0.04, or, 0.95); });
      k.inst(half, or, [...zs.map(z => [-3.75, 0, z + 0.95, PI / 2]), [-0.2, 0, -22.5, PI / 2], [2.3, 0, -22.1, PI / 2]]);
      k.inst(half.clone().scale(1.04, 0.04, 1.04).translate(0, 0.88, 0), wh, [...zs.map(z => [-3.75, 0, z + 0.95, PI / 2]), [-0.2, 0, -22.5, PI / 2], [2.3, 0, -22.1, PI / 2]]);
      k.inst(stool, M(0x2a2b30, { roughness: .4, metalness: .4 }), zs.map(z => [-3.85, 0, z - 0.2]));

      // 교육공간 (C): 6인 테이블 5세트 + 스탠드 모니터 2대 (energy_02 표)
      const T = [[2.85, -16.6], [2.85, -13.4], [2.85, -10.2], [4.75, -17.2], [4.75, -10.0]];
      k.inst(new THREE.BoxGeometry(0.8, 0.05, 1.8).translate(0, 0.725, 0), wh, T.map(([x, z]) => [x, 0, z]));
      k.inst(new THREE.BoxGeometry(0.66, 0.7, 1.6).translate(0, 0.35, 0), or, T.map(([x, z]) => [x, 0, z]));
      const ch = []; T.forEach(([x, z]) => [-0.6, 0, 0.6].forEach(d => { ch.push([x - 0.68, 0, z + d, -PI / 2]); ch.push([x + 0.68, 0, z + d, PI / 2]); }));
      k.inst(CHAIR, wh, ch);
      [-19.6, -14.4].forEach(z => { k.box(0.5, 0.04, 0.5, dk, 4.85, z); k.box(0.08, 1.15, 0.08, dk, 4.85, z); k.box(0.06, 0.75, 1.3, dk, 4.85, z, 1.05); k.pl(M(0x0d1320, { emissive: 0x1d3f72, emissiveIntensity: .7, roughness: .2 }), 1.24, 0.69, 4.815, 1.425, z, -PI / 2); });

      // 홍보관 · 휴게공간 (D): 체크무늬 타원 + LED 큐브 + 양끝 둥근 벤치
      const cx = -0.7, cz = -14.8, rx = 1.65, rz = 4.3;
      const chk = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#fff3e0'; c.fillRect(0, 0, w, h); c.fillStyle = '#f7a24e'; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2) c.fillRect(i * 32, j * 32, 32, 32); });
      chk.wrapS = chk.wrapT = THREE.RepeatWrapping; chk.repeat.set(1.6, 4.2);
      const ov = new THREE.Mesh(new THREE.CircleGeometry(1, 48).scale(rx, rz, 1), tm(chk, .5)); ov.rotation.x = -PI / 2; ov.position.set(cx, 0.07, cz); g.add(ov);
      const bs = new THREE.Shape(); bs.absarc(0, 0, 1.55, 0, PI, false); bs.absarc(0, 0, 1.1, PI, 0, true); bs.closePath();
      const bg = new THREE.ExtrudeGeometry(bs, { depth: 0.45, bevelEnabled: false, curveSegments: 20 });
      [[cz - rz + 1.55, 0], [cz + rz - 1.55, PI]].forEach(([z, r]) => { const b = new THREE.Mesh(bg, or); b.rotation.set(-PI / 2, 0, r); b.position.set(cx, 0, z); g.add(b); });
      const pd = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.9, 0.75, 32), or); pd.scale.set(1, 1, 1.25); pd.position.set(cx, 0.375, cz); g.add(pd);
      const pt = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.92, 0.06, 32), wh); pt.scale.set(1, 1, 1.25); pt.position.set(cx, 0.78, cz); g.add(pt);
      const led = GLOW(B3('energy_led'), 1.2), cb = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 1.1), [led, led, dk, dk, led, led]); cb.position.set(cx, 1.36, cz); g.add(cb); }

    // 4. 뒤쪽: 메인 창고(A, 6.5 × 1.4 m) 앞 태양전지 자동차경주 무대 · 보조 창고(B, 3.25 × 1.0 m) 앞 압전에너지 발판 (energy_09 · 14)
    { const fac = (x0, x1, z0, sgn) => { k.bxz(x0, x1, -D, z0, 2.6, cr);
        [x0 + 0.17, x1 - 0.17].forEach(x => { k.box(0.34, 1.2, 0.34, strM, x, z0 + 0.17); k.box(0.3, 1.8, 0.3, or, x, z0 + 0.17, 1.2); });
        k.bxz(x0, x1, z0 - 0.1, z0 + 0.12, 0.4, or, 2.6); k.bxz(x0, x1, z0 + 0.12, z0 + 0.14, 0.4, strM, 2.6);
        for (let x = x0 + 0.2; x < x1 - 0.1; x += 0.36) bulbs.push([x, 2.63, z0 + 0.18]); };
      fac(-W + 0.1, 0.5, -25.3); fac(2.4, W - 0.4, -25.7);
      k.bxz(-3.95, -1.45, -25.25, -25.13, 0.85, or, 2.95); k.pl(GLOW(B3('energy_race'), 1.05), 2.4, 0.62, -2.7, 3.37, -25.12);
      k.box(0.03, 0.55, 0.03, wh, -2.7, -25.2, 3.8); k.box(0.34, 0.2, 0.01, wh, -2.52, -25.2, 4.12);
      k.bxz(3.0, 4.95, -25.67, -25.57, 0.6, or, 3.0); k.pl(GLOW(marq('압전에너지 체험물'), 1.05, { transparent: true }), 1.9, 0.5, 3.975, 3.3, -25.56);
      const trk = canvasTex(1024, 560, (c, w, h) => { c.fillStyle = '#f7f7f5'; c.fillRect(0, 0, w, h); c.strokeStyle = '#26262a'; c.lineWidth = 46; c.lineJoin = c.lineCap = 'round';
        c.beginPath(); c.moveTo(150, 280); c.bezierCurveTo(150, 90, 330, 90, 380, 220); c.bezierCurveTo(420, 330, 520, 130, 600, 210); c.bezierCurveTo(680, 300, 760, 90, 860, 200); c.bezierCurveTo(940, 300, 900, 470, 760, 440);
        c.bezierCurveTo(640, 410, 600, 470, 500, 440); c.bezierCurveTo(400, 410, 330, 480, 250, 450); c.bezierCurveTo(170, 420, 150, 380, 150, 280); c.stroke();
        c.strokeStyle = '#ffffff'; c.lineWidth = 3; c.setLineDash([18, 16]); c.stroke(); });
      k.bxz(-5.0, -0.6, -23.7, -21.3, 0.35, wh); k.flat(tm(trk, .5), -4.95, -0.65, -23.65, -21.35, 0.356);
      k.bxz(-5.0, -0.6, -21.33, -21.3, 0.08, or, 0.35);
      const pz = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#f4f5f7'; c.fillRect(0, 0, w, h); c.strokeStyle = '#c9ccd2'; c.lineWidth = 4; for (let i = 0; i <= 4; i++) { c.beginPath(); c.moveTo(i * w / 4, 0); c.lineTo(i * w / 4, h); c.moveTo(0, i * h / 4); c.lineTo(w, i * h / 4); c.stroke(); } });
      k.bxz(2.85, 5.05, -25.5, -22.8, 0.05, tm(pz, .5)); }

    k.inst(new THREE.SphereGeometry(0.055, 8, 6), E(0xfff0b8, 2.2), bulbs);
    k.spot([0, 7.2, 3.2], [0, 1.6, -1.2], 0xfff0dc, 110, 0.6);
    k.spot([-0.7, 7.5, -12.5], [-0.7, 0, -14.8], 0xfff4e0, 70, 0.6);
    k.pool(0, -2.2, 3.4, 0xffb060, 0.25); k.pool(-0.7, -14.8, 2.6, 0xffd090, 0.25); k.pool(-2.8, -22.5, 2.6, 0xffe0b0, 0.2);
  }
});
