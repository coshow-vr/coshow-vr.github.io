/* ---------- 실감미디어 부스 3D (부스시안_1027 media_01 · 03 · 05 · 06 · 07 · 12 · 13 · 14 · 15 보고 지음, 10. 27.) ---------- */
// 앞: 가운데 곡면 LED 블록 + 양옆 문틀(파란 빛줄) · 안: 가운데 파란 카펫(안내데스크 · 유리방 2) · 둘레 전시 칸 10 · 왼쪽 실감타로 · 오른쪽 큐브 쉼터
export default ({ THREE, M, E, GLOW, box, canvasTex, B3, boothKit, CHAIR, FONT, mergeGeometries }) => {
  // 실감미디어 로고 (모니터 아이콘 + 글자, 파란 네온)
  const logoTex = (txt = '실감미디어', bg = null) => canvasTex(1024, 232, (c, w, h) => {
    if (bg) { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, bg[0]); gr.addColorStop(1, bg[1]); c.fillStyle = gr; c.fillRect(0, 0, w, h); }
    const s = h * 0.78, x0 = h * 0.2, y0 = h * 0.1;
    c.shadowColor = '#2f8bff'; c.shadowBlur = 26; c.strokeStyle = '#9fd8ff'; c.lineWidth = 9; c.lineJoin = 'round';
    c.strokeRect(x0, y0, s * 1.1, s * 0.7);
    c.beginPath(); c.moveTo(x0 + s * 0.55, y0 + s * 0.7); c.lineTo(x0 + s * 0.55, y0 + s * 0.86); c.moveTo(x0 + s * 0.25, y0 + s * 0.88); c.lineTo(x0 + s * 0.85, y0 + s * 0.88); c.stroke();
    c.fillStyle = '#cdeeff'; c.font = `700 ${s * 0.2}px monospace`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('1010011', x0 + s * 0.55, y0 + s * 0.24); c.fillText('0110101', x0 + s * 0.55, y0 + s * 0.48);
    c.font = `900 ${h * 0.56}px ${FONT}`; c.textAlign = 'left'; c.fillStyle = '#5fb4ff'; c.fillText(txt, x0 + s * 1.3, h * 0.53);
    c.shadowBlur = 0; c.fillStyle = '#e6f5ff'; c.fillText(txt, x0 + s * 1.3, h * 0.53);
  });
  // 옆 낮은 LED 벽 (청록 원근 격자 + 로고)
  const tealTex = canvasTex(2048, 300, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#02121a'); gr.addColorStop(1, '#043a44'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(60,240,230,.55)'; c.lineWidth = 2;
    for (let i = -40; i <= 40; i++) { c.beginPath(); c.moveTo(w / 2 + i * 8, h * 0.35); c.lineTo(w / 2 + i * 120, h); c.stroke(); }
    for (let j = 0; j < 9; j++) { const y = h * 0.35 + Math.pow(j / 8, 1.8) * h * 0.65; c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(90,255,240,${0.2 + Math.random() * 0.6})`; c.fillRect(Math.random() * w, Math.random() * h * 0.5, 2 + Math.random() * 60, 2); }
    c.globalCompositeOperation = 'source-over';
    c.shadowColor = '#3ff0e0'; c.shadowBlur = 24; c.fillStyle = '#eaffff'; c.font = `900 150px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
    [0.25, 0.75].forEach(u => c.fillText('실감미디어', w * u, h * 0.55));
  });
  // 바닥 투사 (AR·XR 게임존)
  const projTex = canvasTex(512, 512, (c, w, h) => {
    c.translate(w / 2, h / 2); c.shadowColor = '#7fffd0'; c.shadowBlur = 20;
    const gr = c.createRadialGradient(0, 0, 10, 0, 0, 240); gr.addColorStop(0, 'rgba(255,220,120,.55)'); gr.addColorStop(.7, 'rgba(40,160,120,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 240, 0, 7); c.fill();
    c.strokeStyle = '#a8ffd8'; [[232, 6], [205, 3], [150, 2]].forEach(([r, l]) => { c.lineWidth = l; c.beginPath(); c.arc(0, 0, r, 0, 7); c.stroke(); });
    c.fillStyle = '#ffffff'; c.font = `900 58px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('AR·XR 게임존', 0, -40);
    [0, 1, 2, 3].forEach(i => { const a = -Math.PI / 2 + i * Math.PI / 2; c.fillStyle = '#ffe27a'; c.beginPath(); c.arc(Math.cos(a) * 218, Math.sin(a) * 218, 16, 0, 7); c.fill(); });
  });
  // 실감타로 커튼 · 모니터
  const curtainTex = canvasTex(512, 256, (c, w, h) => { for (let x = 0; x < w; x++) { const v = 0.5 + 0.5 * Math.sin(x * 0.19) * Math.sin(x * 0.05 + 1); const l = 26 + v * 36; c.fillStyle = `rgb(${l * 0.75},${l * 0.82},${l * 1.15})`; c.fillRect(x, 0, 1, h); } });
  curtainTex.wrapS = THREE.RepeatWrapping;
  const sunTex = canvasTex(512, 320, (c, w, h) => {
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0d1f6a'); gr.addColorStop(1, '#2a4fc0'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { c.fillStyle = 'rgba(255,255,255,.8)'; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    c.translate(w / 2, h / 2); c.fillStyle = '#ffc840'; for (let i = 0; i < 16; i++) { c.rotate(Math.PI / 8); c.beginPath(); c.moveTo(-14, 0); c.lineTo(0, -120); c.lineTo(14, 0); c.fill(); }
    c.fillStyle = '#ffdf70'; c.beginPath(); c.arc(0, 0, 62, 0, 7); c.fill(); c.fillStyle = '#1d2f8a'; c.beginPath(); c.arc(18, -6, 44, 0, 7); c.fill();
  });
  const tarotTex = canvasTex(128, 200, (c, w, h) => { c.fillStyle = '#10121a'; c.fillRect(0, 0, w, h); c.strokeStyle = '#d8b25a'; c.lineWidth = 5; c.strokeRect(8, 8, w - 16, h - 16); c.beginPath(); c.arc(w / 2, h / 2, 30, 0, 7); c.stroke(); c.beginPath(); c.moveTo(w / 2, 30); c.lineTo(w / 2, h - 30); c.stroke(); });

  return {
    '실감미디어'(g, W, D, carpet, slope) {
      const k = boothKit(g, slope), fr = k.fr;
      const ring = (x0, x1, z0, z1, h, t, m, y0) => { k.bxz(x0, x1, z1 - t, z1, h, m, y0); k.bxz(x0, x1, z0, z0 + t, h, m, y0); k.bxz(x0, x0 + t, z0, z1, h, m, y0); k.bxz(x1 - t, x1, z0, z1, h, m, y0); };   // 속 빈 네모 띠
      const blk = M(0x16181f, { roughness: .5 }), dk = M(0x0a0b10, { roughness: .6 }), gry = M(0x5d6472, { roughness: .5 }), wht = M(0xf2f4f8, { roughness: .45 }), blu = E(0x2f7bff, 2.6);
      const bluC = M(0x1f3fe0, { roughness: .95 }), wood = M(0x9a5a2c, { roughness: .6 });
      carpet.material = M(0x4b5364, { roughness: .95 });                     // 회색 카펫 (시안 바닥)
      const lg = logoTex(), H = 3.2;
      // ── 앞 게이트 (fr) ─────────────────────────────
      const BX = 3.1, BD = 2.5, BH = 4.8, RD = 0.9;                            // 가운데 블록 반폭 · 깊이 · 높이 · 화면 들어간 깊이
      k.box(2 * BX, BH, BD - RD, blk, 0, -RD - (BD - RD) / 2, 0, fr);          // 블록 몸통
      k.box(2 * BX, BH - 3.7, RD, blk, 0, -RD / 2, 3.7, fr);                   // 화면 위 보
      [-1, 1].forEach(s => k.box(0.45, 3.7, RD, blk, s * (BX - 0.225), -RD / 2, 0, fr));
      k.flat(bluC, -BX + 0.45, BX - 0.45, -RD, 0, 0.06, fr);
      { // 곡면 LED (오목) — 숲 화면
        const hc = 2.65, sg = 0.5, r = (hc * hc + sg * sg) / (2 * sg), a = Math.asin(hc / r), sh = 3.35;
        const geo = new THREE.CylinderGeometry(r, r, sh, 32, 1, true, Math.PI - a, 2 * a), uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setX(i, 1 - uv.getX(i));
        const m = new THREE.Mesh(geo, GLOW(B3('media_screen'), 0.95, { side: THREE.BackSide })); m.position.set(0, 0.25 + sh / 2, -RD + r + 0.02); fr.add(m);
      }
      k.pl(GLOW(lg, 1.3, { transparent: true }), 3.9, 0.88, 0, 4.25, 0.01, 0, fr);
      k.pl(GLOW(B3('media_board'), 1.0), 2.0, 1.86, -BX - 0.01, 2.1, -1.5, -Math.PI / 2, fr);   // 블록 왼쪽 면 안내판
      [-1, 1].forEach(s => {                                                   // 양옆 문틀 (파란 빛줄)
        const x1 = s * W, xi = s * (W - 0.6), xm = (s * BX + xi) / 2;
        k.box(0.6, 4.0, 1.3, blk, s * (W - 0.3), -0.65, 0, fr);
        k.box(Math.abs(xi - s * BX) + 0.6, 0.8, 1.3, blk, (s * BX + x1) / 2, -0.65, 3.2, fr);
        k.box(0.05, 3.2, 0.05, blu, xi - s * 0.02, 0.01, 0, fr); k.box(Math.abs(xi - s * BX), 0.05, 0.05, blu, xm, 0.01, 3.17, fr);
        k.box(0.05, 0.05, 1.3, blu, xi - s * 0.02, -0.65, 3.17, fr);
        const p = k.pl(GLOW(projTex, 1.0, { transparent: true, depthWrite: false }), 1.6, 1.6, s * 5.3, 0.08, -0.75, 0, fr); p.rotation.x = -Math.PI / 2;
      });
      // 블록 뒤: Mind Care Experience 벽 + 체험 부스 3칸 (fr)
      k.pl(GLOW(B3('media_mind'), 1.0), 4.6, 1.14, 0, 3.75, -BD - 0.01, Math.PI, fr);
      k.box(2 * BX, 0.05, 0.05, blu, 0, -BD - 0.03, BH - 0.06, fr);
      [-1.95, 0, 1.95].forEach(x => {
        k.box(1.8, 2.3, 1.5, gry, x, -BD - 0.75, 0, fr);
        k.pl(wood, 0.72, 1.9, x - 0.25, 0.98, -BD - 1.51, Math.PI, fr);
        k.pl(GLOW(B3('media_mon'), 0.9), 0.3, 0.19, x + 0.45, 1.7, -BD - 1.51, Math.PI, fr);
      });
      // ── 바닥: 가운데 파란 카펫 ─────────────────────
      k.flat(bluC, -2.95, 2.95, -17.0, -2.6);
      // 안내데스크 (테 · 캐노피 · 인형뽑기)
      const dx = 1.95, dz0 = -6.4, dz1 = -9.5, dh = 1.05, dc = M(0x2a2f3c, { roughness: .4 });
      k.bxz(-dx, dx, dz0 - 0.5, dz0, dh, dk); k.bxz(-dx, -dx + 0.5, dz1, dz0 - 0.5, dh, dk); k.bxz(dx - 0.5, dx, dz1, dz0 - 0.5, dh, dk);
      k.bxz(-dx, -0.55, dz1, dz1 + 0.5, dh, dk); k.bxz(0.55, dx, dz1, dz1 + 0.5, dh, dk);
      [[-dx - 0.04, dx + 0.04, dz0 - 0.54, dz0 + 0.04], [-dx - 0.04, -dx + 0.54, dz1 - 0.04, dz0], [dx - 0.54, dx + 0.04, dz1 - 0.04, dz0]].forEach(([a, b, c, d]) => k.bxz(a, b, c, d, 0.05, dc, dh));
      k.pl(GLOW(lg, 1.0, { transparent: true }), 1.9, 0.43, 0.6, 0.58, dz0 + 0.01);
      k.pl(GLOW(B3('media_stamp'), 0.95), 1.3, 0.92, -1.1, 0.55, dz1 - 0.01, Math.PI);
      const sb = canvasTex(128, 192, (c, w, h) => { c.fillStyle = '#0c1a5a'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = `700 15px ${FONT}`; c.textAlign = 'center'; c.fillText('스탬프투어', w / 2, 24); c.fillStyle = '#3f6bff'; for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) c.fillRect(14 + i * 26, 40 + j * 28, 20, 22); });
      [[-1.3, dz0 - 0.25], [0.2, dz0 - 0.25], [1.5, dz0 - 0.25], [-dx + 0.25, -8.2]].forEach(([x, z], i) => { const m = k.pl(GLOW(sb, 0.9), 0.3, 0.45, x, dh + 0.28, z + (i < 3 ? 0.02 : 0), i < 3 ? 0 : -Math.PI / 2); });
      k.inst(new THREE.BoxGeometry(0.06, 2.9 - dh, 0.06), dk, [[-dx + 0.1, dz0 - 0.1], [dx - 0.1, dz0 - 0.1], [-dx + 0.1, dz1 + 0.1], [dx - 0.1, dz1 + 0.1]].map(([x, z]) => [x, dh + (2.9 - dh) / 2, z]));
      const cx0 = -dx - 0.1, cx1 = dx + 0.1, cz0 = dz0 + 0.1, cz1 = dz1 - 0.1, cy = 2.9, ch = 0.42;   // 캐노피 띠
      ring(cx0, cx1, cz1, cz0, ch, 0.12, dk, cy);
      const fas = (t, w) => k.txt([t], w, 0.3, { fg: '#e8f2ff', size: 120 }, 1.0);
      [[0, cz0 + 0.01, 0, 'Information', 2.2], [cx0 - 0.01, (cz0 + cz1) / 2, -Math.PI / 2, 'Event Zone - 미니핀볼 인형뽑기', 3.0], [cx1 + 0.01, (cz0 + cz1) / 2, Math.PI / 2, '내가 뽑는 최고의 실감미디어 작품', 3.0]].forEach(([x, z, r, t, w]) => {
        const m = fas(t, w); m.position.set(x, cy + ch / 2, z); m.rotation.y = r; g.add(m);
      });
      [cz0, cz1].forEach(z => k.box(cx1 - cx0 + 0.04, 0.04, 0.04, blu, 0, z, cy + ch));
      [cx0, cx1].forEach(x => k.box(0.04, 0.04, cz0 - cz1, blu, x, (cz0 + cz1) / 2, cy + ch));
      k.box(0.8, 1.2, 0.8, wht, -2.45, -7.0); k.box(0.8, 0.75, 0.8, new THREE.MeshStandardMaterial({ color: 0xbfe0ff, transparent: true, opacity: .35, roughness: .1 }), -2.45, -7.0, 1.2); k.box(0.84, 0.1, 0.84, wht, -2.45, -7.0, 1.95);
      k.inst(mergeGeometries([new THREE.CylinderGeometry(0.17, 0.17, 0.04, 16).translate(0, 0.74, 0), new THREE.CylinderGeometry(0.025, 0.025, 0.74, 6).translate(0, 0.37, 0), new THREE.CylinderGeometry(0.16, 0.16, 0.02, 16).translate(0, 0.01, 0)]), wht, [-1.5, -0.5, 0.5, 1.5].map(x => [x, 0, dz0 + 0.55]));
      // 유리방 2칸 (VR 그래픽 유리 · 검정 틀 · 타원 간판)
      const gx = 2.37, gzs = [[-12.05, -14.55], [-14.55, -17.05]], gh = 3.0;
      const glass = new THREE.MeshStandardMaterial({ color: 0x9fd0ff, transparent: true, opacity: .16, roughness: .05, metalness: .2, side: THREE.DoubleSide, depthWrite: false });
      const gArt = GLOW(B3('media_glass'), 0.85, { transparent: true, opacity: .8, side: THREE.DoubleSide, depthWrite: false });
      const posts = [], tvs = [];
      gzs.forEach(([za, zb], ri) => {
        const zc = (za + zb) / 2, L = za - zb;
        [-1, 1].forEach(s => { [za - L / 4, zb + L / 4].forEach(z => k.pl(gArt, L / 2 - 0.04, gh - 0.1, s * gx, gh / 2, z, Math.PI / 2)); });
        (ri ? [zb] : [za, zb]).forEach(z => k.pl(glass, 2 * gx, gh, 0, gh / 2, z));
        k.pl(glass, L, gh, 0, gh / 2, zc, Math.PI / 2);
        for (let i = 0; i <= 5; i++) { const x = -gx + i * 2 * gx / 5; posts.push([x, gh / 2, za], [x, gh / 2, zb]); }
        [-1, 1].forEach(s => [za - L / 2].forEach(z => posts.push([s * gx, gh / 2, z])));
        ring(-gx - 0.03, gx + 0.03, zb - 0.03, za + 0.03, 0.06, 0.06, dk, gh); k.box(0.06, 0.06, L, dk, 0, zc, gh);
        [[za, 0.6], [zb, -0.6]].forEach(([z, o]) => k.box(0.04, 0.4, 0.04, dk, o, z, gh + 0.06));
        k.pl(GLOW(B3('media_oval'), 1.15, { transparent: true }), 1.9, 0.92, 0, gh + 0.5 + ri * 0.3, za + 0.03);
        [-1, 1].forEach(s => tvs.push([0.03 * s, 1.45, zc, s]));
        k.inst(new THREE.BoxGeometry(0.46, 0.46, 0.46), wht, [[-1.2, 0.23, zc + 0.5], [1.2, 0.23, zc - 0.4]]);
      });
      k.inst(new THREE.BoxGeometry(0.05, gh, 0.05), dk, posts);
      tvs.forEach(([x, y, z, s]) => k.pl(GLOW(B3('media_mon'), 1.0), 1.15, 0.7, x * 2, y, z, s * Math.PI / 2));
      k.box(0.06, 1.1, 1.2, dk, 0, -13.3); k.box(0.06, 1.1, 1.2, dk, 0, -15.8);
      [[gx, -12.05], [-gx, -12.05]].forEach(([x, z]) => k.box(0.05, gh, 0.05, blu, x, z + 0.03));
      k.box(2 * gx, 0.05, 0.05, blu, 0, -12.02, gh - 0.05);
      // ── 둘레: 옆 낮은 LED 벽 · 전시 칸 10 · 뒷벽 · 로고판 ─────────
      const ZS = -10.7;                                                         // 이 줄 안쪽 = 전시 칸 벽(3.2 m)
      [-1, 1].forEach(s => {
        const x = s * W, z0 = k.fz(x) - 1.3;
        k.bxz(x - 0.12, x + 0.12, ZS, z0, 1.4, blk);
        k.pl(GLOW(tealTex, 1.15), z0 - ZS - 0.05, 1.28, x - s * 0.125, 0.7, (z0 + ZS) / 2, -s * Math.PI / 2);
        k.box(0.26, 0.04, z0 - ZS, blu, x, (z0 + ZS) / 2, 1.4);
        k.bxz(x - 0.12, x + 0.12, -D, ZS, H, blk);
      });
      k.bxz(-W, W, -D, -D + 0.2, H, blk);
      const NAMES = ['Project MG', 'Maru', 'WeChair'], SCR = [B3('media_mg'), B3('media_maru')], monM = GLOW(B3('media_mon'), 1.0);
      const seat = [], legs = [];
      const station = (x, z, ry, i) => {
        const q = new THREE.Group(); q.position.set(x, 0, z); q.rotation.y = ry; g.add(q);
        const at = (lx, lz) => [x + lx * Math.cos(ry) + lz * Math.sin(ry), z - lx * Math.sin(ry) + lz * Math.cos(ry)];
        box(2.3, H, 0.3, blk, 0, -0.15, 0, q);
        k.pl(GLOW(SCR[i % 2], 1.05), 2.05, 1.2, 0, 2.2, 0.01, 0, q);
        box(1.6, 1.0, 0.62, dk, 0, 0.36, 0, q);
        const lb = k.txt([NAMES[i % 3]], 1.2, 0.26, { fg: '#ffffff', size: 150 }, 1.0); lb.position.set(0, 0.62, 0.68); q.add(lb);
        k.pl(monM, 0.72, 0.44, -0.2, 1.33, 0.4, 0, q); box(0.08, 0.1, 0.08, dk, -0.2, 0.4, 1.0, q);
        const lt = box(0.32, 0.2, 0.02, M(0x0a1230, { emissive: 0x3a7dff, emissiveIntensity: .7 }), 0.42, 0.45, 1.0, q); lt.rotation.x = -0.3;
        k.flat(bluC, -0.8, 0.8, 0.7, 1.7, 0.05, q);
        const [sx, sz] = at(1.05, 0.85); seat.push([sx, 0.62, sz, ry]); legs.push([sx, 0, sz, ry]);
      };
      [-12.0, -15.0, -18.0].forEach((z, i) => { station(-W + 0.42, z, Math.PI / 2, i); station(W - 0.42, z, -Math.PI / 2, i + 1); });
      [-4.27, -1.42, 1.42, 4.27].forEach((x, i) => station(x, -D + 0.5, 0, i + 2));
      k.inst(new THREE.BoxGeometry(0.42, 0.05, 0.34), wood, seat);
      k.inst(mergeGeometries([[-.17, -.13], [-.17, .13], [.17, -.13], [.17, .13]].map(([a, b]) => new THREE.BoxGeometry(0.025, 0.62, 0.025).translate(a, 0.31, b))), dk, legs);
      // 뒷벽 가운데 머리 간판 · 양끝 로고판
      k.box(4.6, 1.3, 0.3, blk, 0, -D + 0.15, H);
      k.pl(GLOW(logoTex('실감미디어', ['#0a2a8a', '#1f6bff']), 1.15), 4.4, 1.0, 0, H + 0.65, -D + 0.31);
      [-1, 1].forEach(s => k.pl(GLOW(lg, 1.0, { transparent: true }), 1.5, 0.34, s * 6.45, 2.5, -D + 0.21));
      // ── 왼쪽 앞: 실감타로 커튼 부스 (반원 파란 카펫) ─────────
      const half = (cx, cz, r, t0) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 40, t0, Math.PI), bluC); m.rotation.x = -Math.PI / 2; m.position.set(cx, 0.05, cz); g.add(m); };
      half(-W + 0.12, -5.8, 2.5, -Math.PI / 2);
      const cuM = M(0xffffff, { map: curtainTex, roughness: .9, side: THREE.DoubleSide, emissive: 0x1a2240, emissiveIntensity: .5 }), tx0 = -W + 0.3, tx1 = -5.0, tz0 = -4.6, tz1 = -7.0, th = 2.7;
      [[tx0, tx0, tz1, tz0], [tx0, tx1, tz0, tz0], [tx0, tx1, tz1, tz1]].forEach(([a, b, c, d]) => {
        const len = Math.hypot(b - a, d - c), p = k.pl(cuM, len, th - 0.35, (a + b) / 2, (th - 0.35) / 2, (c + d) / 2, a === b ? Math.PI / 2 : 0);
      });
      [-1, 1].forEach(s => { const p = k.pl(cuM, 0.5, th - 0.35, tx1 - 0.02, (th - 0.35) / 2, (s < 0 ? tz1 + 0.25 : tz0 - 0.25), Math.PI / 2); });
      ring(tx0, tx1, tz1, tz0, 0.4, 0.15, M(0xffffff, { map: curtainTex, roughness: .9, emissive: 0x1a2240, emissiveIntensity: .5 }), th - 0.4);
      k.box(0.05, 0.05, tz0 - tz1 + 0.2, wht, tx1 + 0.05, (tz0 + tz1) / 2, th);
      { const t = k.txt(['실감타로 : 미래를 만나다'], 1.9, 0.3, { fg: '#bfe6ff', size: 120 }, 1.25); t.position.set(tx1 + 0.02, th - 0.2, (tz0 + tz1) / 2); t.rotation.y = Math.PI / 2; g.add(t); }
      k.inst(new THREE.PlaneGeometry(0.2, 0.32), GLOW(tarotTex, 0.9), [[tx1 + 0.01, 1.7, tz0 - 0.15, Math.PI / 2], [tx1 + 0.01, 1.3, tz0 - 0.3, Math.PI / 2], [tx1 + 0.01, 1.7, tz1 + 0.15, Math.PI / 2], [tx1 + 0.01, 1.3, tz1 + 0.3, Math.PI / 2]]);
      { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.05, 28, 1, false, 0, Math.PI), M(0x2a2a20, { roughness: .5 })); t.position.set(tx0 + 0.15, 0.75, (tz0 + tz1) / 2); g.add(t); k.box(0.3, 0.73, 0.6, M(0x2a2a20), tx0 + 0.35, (tz0 + tz1) / 2, 0); }
      [-0.4, 0.4].forEach(o => k.pl(GLOW(sunTex, 1.0), 0.6, 0.38, tx0 + 0.25, 1.05, (tz0 + tz1) / 2 + o, Math.PI / 2));
      k.inst(CHAIR, M(0x1c1f2a), [[tx0 + 1.4, 0, (tz0 + tz1) / 2 - 0.4, Math.PI / 2], [tx0 + 1.4, 0, (tz0 + tz1) / 2 + 0.4, Math.PI / 2]]);
      // 오른쪽 앞: 큐브 쉼터 (반원 파란 카펫 · 흰 · 검정 큐브)
      half(W - 0.12, -5.8, 2.5, Math.PI / 2);
      const cw = [], cb = [];
      [[0.7, -4.1], [1.4, -4.7], [0.6, -5.4], [1.6, -5.9], [0.9, -6.5], [1.9, -7.0], [0.5, -7.3], [2.0, -4.0], [1.3, -7.8]].forEach(([d, z], i) => (i % 2 ? cb : cw).push([W - d, 0.22, z, i * 0.4]));
      [[-W + 1.2, -8.4], [-W + 0.8, -9.3], [-W + 1.7, -9.6]].forEach(([x, z], i) => (i % 2 ? cb : cw).push([x, 0.22, z, i]));
      k.inst(new THREE.BoxGeometry(0.44, 0.44, 0.44), wht, cw); k.inst(new THREE.BoxGeometry(0.44, 0.44, 0.44), M(0x14161c, { roughness: .6 }), cb);
      // 조명 (부스 자체 2개)
      k.spot([0, 7.5, -3.5], [0, 1, -8], 0xe6eeff, 150, 0.6);
      k.spot([0, 7.5, -10.5], [0, 0.5, -14.6], 0xd8e6ff, 130, 0.6);
      k.pool(0, -8, 3.2, 0x8fb8ff, 0.3); k.pool(0, -14.6, 4, 0x5f8cff, 0.25); k.pool(-W + 1.8, -5.8, 2.2, 0x6fa0ff, 0.3); k.pool(W - 1.5, -5.8, 2.2, 0x6fa0ff, 0.3); k.pool(0, 1.2, 3.2, 0xb8e6c8, 0.22);
    },
  };
};
