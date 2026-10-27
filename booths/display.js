/* 차세대디스플레이 부스 3D (부스시안_1027 display_01 · 02 · 03 보고 지음, 10. 27.) */
// 앞(통로)에서 안쪽으로: 무지개 LED 게이트 · 오른쪽 앞 빨간 글자 LED · 오른쪽 긴 은하수 LED 벽
// → 유리 진열장 4개(CRT · PDP · LCD / LED · OLED) + 안내판 5개 → 집 모양 검정 전시관 2동(왼쪽 원리·응용 / 오른쪽 안내데스크) · 가운데 LED 구
// → 맨 안쪽 ㄷ자 검정 벽 「차세대 디스플레이」 + 방 3개(양쪽 FAB 공정 XR · 가운데 교육장)
export default ({ THREE, M, E, GLOW, canvasTex, textTex, B3, boothKit, CHAIR, FONT }) => ({
  '차세대디스플레이'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr;
    const blk = M(0x111216, { roughness: .4 }), wht = M(0xf0f1f4, { roughness: .45 }), gold = M(0xc9a24a, { roughness: .35, metalness: .6 });
    const blu = E(0x2f7bff, 2.4), cyn = E(0x3fe0ff, 2.0);
    const glass = new THREE.MeshStandardMaterial({ color: 0xbfd8ff, roughness: .05, metalness: .1, transparent: true, opacity: .18 });
    carpet.material = M(0x2c2d33, { roughness: .9 });
    k.flat(M(0x26272c, { roughness: .9 }), -W, W, -D, -0.3, 0.05);
    // 그림 도우미
    const grad = (stops, w = 256, h = 512, vert = true) => canvasTex(w, h, (c) => { const gr = vert ? c.createLinearGradient(0, 0, 0, h) : c.createLinearGradient(0, 0, w, 0); stops.forEach((s, i) => gr.addColorStop(i / (stops.length - 1), s)); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.globalAlpha = .18; c.fillStyle = '#000'; for (let x = 0; x < w; x += 8) c.fillRect(x, 0, 2, h); for (let y = 0; y < h; y += 8) c.fillRect(0, y, w, 2); });
    const rainbow = ['#ff3b3b', '#ff9a1f', '#ffe23a', '#3be36b', '#2fb6ff', '#3a57ff', '#a03bff'];
    const galaxy = canvasTex(1024, 256, (c, w, h) => {
      const gr = c.createLinearGradient(0, 0, w, 0); rainbow.concat(['#ff3b9a']).forEach((s, i, a) => gr.addColorStop(i / (a.length - 1), s)); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      const v = c.createLinearGradient(0, 0, 0, h); v.addColorStop(0, 'rgba(10,8,40,.75)'); v.addColorStop(.5, 'rgba(10,8,40,.05)'); v.addColorStop(1, 'rgba(10,8,40,.8)'); c.fillStyle = v; c.fillRect(0, 0, w, h);
      for (let i = 0; i < 500; i++) { c.fillStyle = `rgba(255,255,255,${Math.random() * .9})`; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
    });
    // ── 앞: 무지개 LED 게이트 (보 앞면 = 시안 그림, 왼쪽 기둥 파랑 · 오른쪽 기둥 주황) ──
    const gx0 = -5.8, gx1 = 5.4, gw = gx1 - gx0, gcx = (gx0 + gx1) / 2, gz = -0.9, gd = 1.5, pw = 1.0, gh = 4.0;
    const lp = GLOW(grad(['#1b3cff', '#2aa8ff', '#47f0ff']), 1.1), rp = GLOW(grad(['#ff7a1a', '#ff3b2a', '#c4123a']), 1.1);
    [[gx0 + pw / 2, lp], [gx1 - pw / 2, rp]].forEach(([x, m]) => {
      k.box(pw, gh - 1.0, gd, blk, x, gz, 0, fr);
      k.pl(m, pw - 0.04, gh - 1.05, x, (gh - 1.0) / 2, gz + gd / 2 + 0.01, 0, fr);                       // 앞면
      k.pl(m, gd - 0.04, gh - 1.05, x + pw / 2 + 0.01, (gh - 1.0) / 2, gz, Math.PI / 2, fr);               // 안쪽 옆면
      k.pl(m, gd - 0.04, gh - 1.05, x - pw / 2 - 0.01, (gh - 1.0) / 2, gz, -Math.PI / 2, fr);
    });
    k.box(gw, 1.0, gd, blk, gcx, gz, gh - 1.0, fr);
    k.pl(GLOW(B3('display_beam'), 1.1), gw, 0.92, gcx, gh - 0.5, gz + gd / 2 + 0.01, 0, fr);
    k.pl(GLOW(B3('display_beam'), 0.9), gw, 0.92, gcx, gh - 0.5, gz - gd / 2 - 0.01, Math.PI, fr);
    k.box(gw + 0.04, 0.05, gd + 0.04, blk, gcx, gz, gh, fr);
    // 오른쪽 앞 모서리: 작은 빨간 글자 LED판 (시안 글자 판독 불가 → 글줄 무늬만)
    const redLed = canvasTex(512, 256, (c, w, h) => { c.fillStyle = '#06060a'; c.fillRect(0, 0, w, h); c.fillStyle = '#ff2a2a'; for (let r = 0; r < 4; r++) for (let x = 20; x < w - 20; x += 14) if (Math.random() > .35) c.fillRect(x, 30 + r * 52, 9, 22); });
    k.box(1.5, 2.4, 0.25, blk, W - 0.85, -0.5, 0, fr); k.pl(GLOW(redLed, 1.2), 1.36, 0.8, W - 0.85, 1.85, -0.37, 0, fr);
    // 오른쪽 가장자리: 긴 은하수 무지개 LED 벽 (높이 2.6)
    k.bxz(W - 0.25, W - 0.05, -10.5, -1.6, 2.7, blk);
    k.pl(GLOW(galaxy, 1.15), 8.8, 2.5, W - 0.26, 1.35, -6.05, -Math.PI / 2);
    // ── 유리 진열장 4개 (흰 받침 · 유리 · 검정 지붕 + 파란 테두리 빛) ──
    const cases = [[-4.95, 'CRT'], [-1.65, 'PDP'], [1.65, 'LCD / LED'], [4.95, 'OLED']], cz = -5.6;
    const scr = (hue) => canvasTex(256, 160, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, `hsl(${hue},90%,55%)`); gr.addColorStop(1, `hsl(${hue + 80},90%,45%)`); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    cases.forEach(([x, t], i) => {
      k.box(1.5, 0.95, 1.1, wht, x, cz);
      k.box(1.46, 1.0, 1.06, glass, x, cz, 0.95);
      k.box(0.9 - i * 0.05, 0.55, i === 0 ? 0.5 : 0.08 + i * 0.01, M(0x1a1b20, { roughness: .4 }), x, cz, 1.0);
      k.pl(GLOW(scr(200 + i * 40), 1.0), 0.8 - i * 0.05, 0.45, x, 1.28, cz + (i === 0 ? 0.26 : 0.06 + i * 0.01));
      [-0.68, 0.68].forEach(dx => k.box(0.06, 1.25, 0.06, blk, x + dx, cz + 0.5, 0.95));
      k.box(1.7, 0.18, 1.3, blk, x, cz, 2.2); k.box(1.72, 0.04, 1.32, blu, x, cz, 2.2);
      const lb = k.txt([t], 1.5, 0.3, { fg: '#ffffff', size: 150 }, 1.05); lb.position.set(x, 2.58, cz + 0.66); g.add(lb);
      k.box(1.5, 0.3, 0.06, blk, x, cz + 0.63, 2.43);
    });
    // 진열장 앞 작은 흰 안내판 5개
    k.inst(new THREE.BoxGeometry(0.5, 1.1, 0.08), wht, [-5.2, -2.6, 0, 2.6, 5.2].map(x => [x, 0.55, -3.6, 0]));
    k.inst(new THREE.BoxGeometry(0.44, 0.3, 0.01), E(0x9fd4ff, 0.9), [-5.2, -2.6, 0, 2.6, 5.2].map(x => [x, 0.9, -3.555, 0]));
    // ── 집 모양 검정 전시관 2동 (파란 네온 테두리) ──
    // 시안: 옆 · 뒤 · 지붕이 막힌 검정 집, 앞만 열리고 앞 테두리에 파란 네온
    const house = (cx, z0, z1, hw, eave = 2.5, ridge = 3.9) => {
      const zc = (z0 + z1) / 2, dz = z0 - z1, slopeL = Math.hypot(hw, ridge - eave) + 0.12, ang = Math.atan2(ridge - eave, hw);
      [-1, 1].forEach(s => {
        k.bxz(cx + s * hw - 0.08, cx + s * hw + 0.08, z1, z0, eave, blk);                                   // 옆벽
        const r = new THREE.Mesh(new THREE.BoxGeometry(slopeL, 0.12, dz), blk); r.position.set(cx + s * hw / 2, (eave + ridge) / 2, zc); r.rotation.z = -s * ang; g.add(r);   // 지붕
        const n = new THREE.Mesh(new THREE.BoxGeometry(slopeL, 0.05, 0.05), blu); n.position.set(cx + s * hw / 2, (eave + ridge) / 2 - 0.08, z0 + 0.03); n.rotation.z = -s * ang; g.add(n);
        k.box(0.05, eave, 0.05, blu, cx + s * (hw - 0.1), z0 + 0.03);
      });
      const tri = new THREE.Shape(); tri.moveTo(-hw, 0); tri.lineTo(hw, 0); tri.lineTo(0, ridge - eave); tri.closePath();
      const gab = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 0.12, bevelEnabled: false }), blk); gab.position.set(cx, eave, z1); g.add(gab);   // 뒤 박공
      return { zc };
    };
    const hz0 = -8.4, hz1 = -12.8, hw = 1.9;
    // 왼쪽 동: 「디스플레이의 원리와 응용」 화면 (시안엔 사람이 있어 그림으로 그림) + 작은 컬러 화면 · 체험대
    house(-4.7, hz0, hz1, hw);
    k.bxz(-4.7 - hw, -4.7 + hw, hz1 - 0.12, hz1, 2.5, blk);
    const prin = canvasTex(1024, 512, (c, w, h) => {
      c.fillStyle = '#071233'; c.fillRect(0, 0, w, h);
      c.fillStyle = '#fff'; c.font = `800 64px ${FONT}`; c.textAlign = 'center'; c.fillText('디스플레이의 원리와 응용', w / 2, 92);
      ['#ff3344', '#33dd66', '#3377ff'].forEach((col, i) => { c.fillStyle = col; c.globalAlpha = .9; c.beginPath(); c.arc(w / 2 - 90 + i * 90, 300, 110, 0, 7); c.fill(); }); c.globalAlpha = 1;
    });
    k.pl(GLOW(prin, 1.05), 3.2, 1.6, -4.7, 1.75, hz1 + 0.07);
    k.inst(new THREE.BoxGeometry(0.7, 0.45, 0.05), M(0x15161a), [[-6.0, 1.35, -10.6, Math.PI / 2], [-3.4, 1.35, -10.6, -Math.PI / 2]]);
    [[-6.0, -10.6, Math.PI / 2, 0], [-3.4, -10.6, -Math.PI / 2, 120]].forEach(([x, z, r, h]) => k.pl(GLOW(scr(h), 1.0), 0.64, 0.4, x + (r > 0 ? 0.03 : -0.03), 1.35, z, r));
    k.box(2.6, 0.9, 0.6, wht, -4.7, -9.0); k.box(2.62, 0.04, 0.62, blu, -4.7, -9.0, 0.9);
    // 오른쪽 동: 안내데스크 (앞판 = 시안 그림) · 파란 빛 카운터
    house(4.7, hz0, hz1, hw);
    k.bxz(4.7 - hw, 4.7 + hw, hz1 - 0.12, hz1, 2.5, blk);
    k.pl(GLOW(galaxy, 0.9), 3.4, 1.4, 4.7, 1.7, hz1 + 0.07);
    k.box(2.6, 1.0, 0.7, M(0x0b0c10, { roughness: .3 }), 4.7, -9.3);
    k.pl(GLOW(B3('display_sign'), 1.05), 1.8, 0.72, 4.7, 0.52, -8.94);
    k.box(2.64, 0.05, 0.74, blu, 4.7, -9.3, 0.0); k.box(2.64, 0.04, 0.74, cyn, 4.7, -9.3, 1.0);
    k.inst(CHAIR, M(0x1c1d22), [[4.1, 0, -10.0, Math.PI], [5.3, 0, -10.0, Math.PI]]);
    // ── 가운데: 1.5 m LED 구 + 둥근 받침 ──
    const sph = canvasTex(1024, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, 0); rainbow.concat(['#ff3b3b']).forEach((s, i, a) => gr.addColorStop(i / (a.length - 1), s)); c.fillStyle = gr; c.fillRect(0, 0, w, h); const v = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2); v.addColorStop(0, 'rgba(255,255,255,.55)'); v.addColorStop(1, 'rgba(0,0,40,.35)'); c.fillStyle = v; c.fillRect(0, 0, w, h); c.globalAlpha = .25; c.fillStyle = '#000'; for (let x = 0; x < w; x += 6) c.fillRect(x, 0, 1, h); for (let y = 0; y < h; y += 6) c.fillRect(0, y, w, 1); });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.75, 40, 24), GLOW(sph, 1.25)); ball.position.set(0, 1.7, -13.9); g.add(ball);
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.85, 0.9, 32), blk); ped.position.set(0, 0.45, -13.9); g.add(ped);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.04, 32), blu); ring.position.set(0, 0.88, -13.9); g.add(ring);
    // ── 맨 안쪽: ㄷ자 검정 벽 + 「차세대 디스플레이」 머리띠 + 방 3개 ──
    const RZ = -16.4, H = 4.6;
    k.bxz(-W, W, -D, -D + 0.3, H, blk);
    k.bxz(-W, -W + 0.3, -D, RZ + 0.6, H, blk); k.bxz(W - 0.3, W, -D, RZ + 0.6, H, blk);
    k.bxz(-W, W, RZ, RZ + 0.3, 1.0, blk, H - 1.0);
    const head = textTex(['차세대 디스플레이'], { w: 2048, h: 160, bg: '#05060c', fg: '#ffffff', size: 104 });
    k.pl(GLOW(head, 1.05), 2 * W - 0.4, 0.78, 0, H - 0.5, RZ + 0.31);
    k.box(2 * W - 0.4, 0.04, 0.04, blu, 0, RZ + 0.33, H - 0.92);
    // 방 칸막이 · 앞벽 (금색 테두리 흰 방 2 · 가운데 교육장)
    const rooms = [[-W + 0.3, -2.5], [-2.3, 2.3], [2.5, W - 0.3]];
    [-2.5, -2.3, 2.3, 2.5].forEach(x => k.bxz(x - 0.06, x + 0.06, -D + 0.3, RZ, H - 1.0, wht));
    rooms.forEach(([a, b], i) => {
      const c = (a + b) / 2, w = b - a;
      if (i === 1) { k.flat(M(0xd9dbe0, { roughness: .6 }), a, b, -D + 0.3, RZ, 0.055); return; }
      const door = 1.2, dx = c;
      k.bxz(a, dx - door / 2, RZ - 0.15, RZ, H - 1.0, wht); k.bxz(dx + door / 2, b, RZ - 0.15, RZ, H - 1.0, wht);
      k.bxz(dx - door / 2, dx + door / 2, RZ - 0.15, RZ, H - 1.0 - 2.3, wht, 2.3);
      [[a, a + 0.08], [b - 0.08, b]].forEach(([p, q]) => k.bxz(p, q, RZ - 0.02, RZ + 0.02, H - 1.0, gold));
      k.bxz(a, b, RZ - 0.02, RZ + 0.02, 0.08, gold, H - 1.08); k.bxz(dx - door / 2 - 0.06, dx + door / 2 + 0.06, RZ - 0.02, RZ + 0.01, 0.06, gold, 2.3);
      const lb = k.txt(['차세대디스플레이', 'FAB 공정 XR'], 2.4, 0.62, { fg: '#2a2416', size: 96 }, 1.0); lb.position.set(dx, 2.95, RZ + 0.03); g.add(lb);
      k.flat(M(0xe9eaee, { roughness: .6 }), a, b, -D + 0.3, RZ - 0.15, 0.055);
      k.inst(new THREE.BoxGeometry(0.9, 0.75, 0.6), wht, [[c - w / 4, 0.375, -D + 1.6], [c + w / 4, 0.375, -D + 1.6]]);
    });
    // 가운데 교육장: 흰 책상 3 × 2줄 · 의자 · 앞 화면
    const desks = [], chs = [];
    [-18.0, -19.6].forEach(z => [-1.4, 0, 1.4].forEach(x => { desks.push([x, 0.375, z]); chs.push([x - 0.3, 0, z + 0.6], [x + 0.3, 0, z + 0.6]); }));
    k.inst(new THREE.BoxGeometry(1.2, 0.75, 0.55), wht, desks); k.inst(CHAIR, M(0xf6f6f8, { roughness: .5 }), chs);
    k.pl(GLOW(galaxy, 1.0), 3.6, 1.6, 0, 2.1, -D + 0.31);
    // 뒤 모서리 짧은 LED 띠
    [-W + 0.31, W - 0.31].forEach((x, i) => k.pl(GLOW(grad(i ? ['#ff7a1a', '#ff3b2a'] : ['#1b3cff', '#47f0ff']), 1.1), 1.6, 3.2, x, 1.9, RZ + 1.5, i ? -Math.PI / 2 : Math.PI / 2));
    // 조명 2개 + 바닥 빛
    k.spot([0, 8, 2.5], [0, 2.8, -1.0], 0xf2f6ff, 150, 0.55);
    k.spot([0, 8, -7.5], [0, 1.2, -13.9], 0xe8eeff, 140, 0.5);
    k.pool(0, -13.9, 3.2, 0xb48cff, 0.35); k.pool(0, -5.6, 5.5, 0x5f9cff, 0.25); k.pool(0, -19, 4, 0xdfe6ff, 0.18);
  },
});
