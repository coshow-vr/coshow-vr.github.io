/* 항공드론 부스 3D (부스시안_1027 drone_02 평면 · 03 · 05 보고 지음, 10. 27.) */
// 앞(통로)면: 왼쪽 창고 상자(지구 LED) · 앞벽 + 가운데 출입문(하늘색 네온) · 위 간판 「항공 · 드론 컨소시엄 ZONE」 · 터빈 2개 · 라이트박스 2개 · 오른쪽 KAU 벽(흰 창)
// 안: 안내데스크 · 왼쪽 VR 존(흰 ㄷ자 벽) · 벤치 5 · 흰 테이블 6 / 오른쪽 UAM 존 · 코딩 존(인조잔디) · 테이블 3 → 맨 안쪽 드론 케이지(초록 그물, 3칸)
export default ({ THREE, M, E, GLOW, canvasTex, textTex, B3, boothKit, CHAIR, FONT }) => ({
  '항공드론'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr;
    const blk = M(0x121318, { roughness: .45 }), wht = M(0xf2f3f5, { roughness: .45 }), lg = M(0xd6d9de, { roughness: .6 });
    const cyn = E(0x39e3ff, 2.3), turf = M(0x2f8a3a, { roughness: .95 });
    carpet.material = M(0x34363c, { roughness: .9 });
    k.flat(M(0x303238, { roughness: .9 }), -W, W, -D, -0.8, 0.05);
    // ── 앞면 (fr: 앞선 기준) ──
    const FZ = -0.7, FH = 2.8;
    // 왼쪽 창고 상자 + 지구 LED (시안 그림)
    k.bxz(-W, -4.1, -3.6, 0, 2.9, blk, 0, fr);
    k.pl(GLOW(B3('drone_led'), 1.15), 3.7, 2.2, -6.1, 1.5, 0.01, 0, fr);
    // 앞벽 (출입문 x −0.4 ~ 1.2 비움)
    const D0 = -0.4, D1 = 1.2;
    k.bxz(-4.1, D0, FZ, 0, FH, blk, 0, fr); k.bxz(D1, 2.8, FZ, 0, FH, blk, 0, fr);
    // 출입문 틀 (폭 2.6) + 하늘색 네온
    [[-0.9, D0], [D1, 1.7]].forEach(([a, b]) => k.bxz(a, b, FZ - 0.05, 0.08, 3.0, M(0x1a1c22, { roughness: .35 }), 0, fr));
    k.bxz(-0.9, 1.7, FZ - 0.05, 0.08, 0.25, M(0x1a1c22), 2.75, fr);
    [[D0 - 0.03, D0], [D1, D1 + 0.03]].forEach(([a, b]) => k.bxz(a, b, -0.02, 0.1, 2.75, cyn, 0, fr));
    k.bxz(D0, D1, -0.02, 0.1, 0.03, cyn, 2.72, fr);
    // 위 간판 띠 (4.9 m, y 3.0 ~ 3.7)
    k.bxz(-2.05, 2.85, -0.45, -0.15, 0.75, blk, 2.98, fr);
    k.pl(GLOW(B3('drone_sign'), 1.1), 4.9, 0.73, 0.4, 3.35, -0.14, 0, fr);
    // 터빈 2개 (지름 1.7, 깊이 1.2) — 앞면 = 시안 팬 그림
    const fanM = GLOW(B3('drone_fan'), 1.05), rimM = M(0xb9bec6, { roughness: .3, metalness: .7 });
    [-2.85, 3.5].forEach(x => {
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.85, 1.2, 40, 1, true), rimM); cyl.rotation.x = Math.PI / 2; cyl.position.set(x, 3.65, -0.45); fr.add(cyl);
      const back = new THREE.Mesh(new THREE.CircleGeometry(0.84, 40), blk); back.position.set(x, 3.65, -1.04); fr.add(back);
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.8, 40), fanM); face.position.set(x, 3.65, 0.13); fr.add(face);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.5, 24), rimM); tip.rotation.x = -Math.PI / 2; tip.position.set(x, 3.65, -1.3); fr.add(tip);
    });
    // 라이트박스 2개 (왼쪽 = 시안에 사람이 있어 하늘 · 드론 그림으로 그림, 오른쪽 = 시안 그림)
    const sky = canvasTex(256, 384, (c, w, h) => {
      const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#0d3d8f'); gr.addColorStop(1, '#7cc6ff'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.strokeStyle = '#fff'; c.fillStyle = '#fff'; c.lineWidth = 6; const cx = w / 2, cy = h * .42;
      c.fillRect(cx - 26, cy - 12, 52, 24); [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { c.beginPath(); c.moveTo(cx + a * 20, cy + b * 8); c.lineTo(cx + a * 62, cy + b * 40); c.stroke(); c.beginPath(); c.ellipse(cx + a * 62, cy + b * 40, 34, 8, 0, 0, 7); c.stroke(); });
    });
    [[-1.83, GLOW(sky, 1.0)], [2.59, GLOW(B3('drone_panel'), 1.05)]].forEach(([x, m]) => {
      k.box(1.42, 2.03, 0.08, M(0xe8eaee), x, 0.05, 0.36, fr);
      k.pl(m, 1.32, 1.93, x, 1.375, 0.1, 0, fr);
    });
    // 오른쪽 KAU 벽 (검정, 위 KAU 글자 · 흰 창 + 하늘색 테두리)
    k.bxz(2.8, W, FZ, 0, 0.8, blk, 0, fr); k.bxz(2.8, 4.5, FZ, 0, FH - 0.8, blk, 0.8, fr); k.bxz(7.1, W, FZ, 0, FH - 0.8, blk, 0.8, fr);
    k.bxz(4.5, 7.1, FZ, 0, 0.6, blk, FH - 0.6, fr);
    [-2.6, -1.06, 1.84, 3.34].forEach(x => k.bxz(x - 0.03, x + 0.03, -0.02, 0.06, 2.4, cyn, 0.2, fr));                        // 라이트박스 양옆 하늘색 띠
    [[4.47, 4.53], [7.07, 7.13]].forEach(([a, b]) => k.bxz(a, b, -0.05, 0.03, 1.4, cyn, 0.8, fr));
    k.bxz(4.5, 7.1, -0.05, 0.03, 0.04, cyn, 0.8, fr); k.bxz(4.5, 7.1, -0.05, 0.03, 0.04, cyn, 2.16, fr);
    k.pl(GLOW(B3('drone_kau'), 1.0), 2.5, 0.69, 5.8, 2.48, 0.01, 0, fr);
    // ── 안 ──
    // 안내데스크
    k.bxz(-3.9, -2.5, -3.2, -1.0, 1.0, wht); k.bxz(-3.92, -2.48, -3.22, -0.98, 0.04, cyn, 1.0);
    // 왼쪽 VR 존: 흰 ㄷ자 벽 · 밝은 회색 바닥 · 하늘색 기둥 · KAU 글자
    const vx0 = -W, vx1 = -4.2, vz0 = -4.7, vz1 = -11.6;
    k.flat(lg, vx0, vx1, vz1, vz0, 0.055);
    k.bxz(vx0, vx0 + 0.15, vz1, vz0, 2.6, wht); k.bxz(vx0, vx1, vz0 - 0.15, vz0, 2.6, wht); k.bxz(vx0, vx1, vz1, vz1 + 0.15, 2.6, wht);
    [[vx1 - 0.1, vz0 - 0.1], [vx1 - 0.1, vz1 + 0.1]].forEach(([x, z]) => k.box(0.2, 2.6, 0.2, cyn, x, z));
    k.pl(GLOW(B3('drone_kau'), 0.9), 2.6, 0.72, vx0 + 0.16, 1.9, (vz0 + vz1) / 2, Math.PI / 2);
    k.inst(new THREE.BoxGeometry(0.9, 0.05, 0.9), M(0x1a1c22), [[-7.0, 0.08, -6.6], [-5.4, 0.08, -6.6], [-7.0, 0.08, -9.6], [-5.4, 0.08, -9.6]]);
    k.inst(CHAIR, M(0x1a1c22), [[-7.0, 0, -6.6, Math.PI / 2], [-5.4, 0, -6.6, Math.PI / 2], [-7.0, 0, -9.6, Math.PI / 2], [-5.4, 0, -9.6, Math.PI / 2]]);
    // 흰 벤치 5개
    k.inst(new THREE.BoxGeometry(0.4, 0.45, 1.6), wht, [[-1.5, 0.225, -5.9], [-0.5, 0.225, -6.9], [-1.5, 0.225, -8.2], [-0.5, 0.225, -9.4], [-1.5, 0.225, -10.6]]);
    // 흰 테이블 6개 (2줄 × 3) + 의자 6개씩
    const tb = [], ch = [];
    [-12.7, -14.6].forEach(z => [-7.0, -4.5, -2.0].forEach(x => { tb.push([x, 0.375, z]); [-0.55, 0, 0.55].forEach(dx => { ch.push([x + dx, 0, z - 0.6, Math.PI], [x + dx, 0, z + 0.6, 0]); }); }));
    // 오른쪽 테이블 3개
    [2.5, 4.9, 7.3].forEach(x => { tb.push([x, 0.375, -14.6]); [-0.55, 0.55].forEach(dx => ch.push([x + dx, 0, -14.0, 0], [x + dx, 0, -15.2, Math.PI])); });
    k.inst(new THREE.BoxGeometry(1.8, 0.75, 0.8), wht, tb); k.inst(CHAIR, M(0xe8e9ec, { roughness: .5 }), ch);
    // 오른쪽 UAM 존: 둥근 흰 데스크 + 시뮬레이터
    k.flat(M(0x1c2a44, { roughness: .8 }), 1.2, W, -6.0, -1.5, 0.055);
    const arc = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 0.95, 32, 1, true, Math.PI * 0.6, Math.PI * 0.8), wht); arc.position.set(4.8, 0.475, -4.2); g.add(arc);
    k.box(1.0, 0.7, 1.6, M(0x22252c, { roughness: .4 }), 6.6, -3.2); k.box(0.9, 0.9, 0.08, M(0x15161a), 6.6, -2.45, 0.7);
    const uam = canvasTex(256, 256, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2a6bd6'); gr.addColorStop(.6, '#9fd6ff'); gr.addColorStop(.61, '#5a7a4a'); gr.addColorStop(1, '#2d3f26'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
    k.pl(GLOW(uam, 1.0), 0.82, 0.82, 6.6, 1.15, -2.40);
    k.inst(new THREE.BoxGeometry(0.5, 0.32, 0.03), M(0x15161a), [[4.2, 1.12, -3.4], [5.4, 1.12, -3.4]]);
    // 오른쪽 옆벽 (z −6 ~ −8 보조 출입구) · 바깥면 공항 그림
    k.bxz(W - 0.15, W, -6.0, -1.0, FH, blk); k.bxz(W - 0.15, W, -15.5, -8.0, FH, blk);
    k.pl(GLOW(B3('drone_air'), 1.0), 3.9, 2.6, W + 0.01, 1.4, -3.5, Math.PI / 2);
    k.pl(GLOW(B3('drone_air'), 0.85), 3.9, 2.6, W - 0.16, 1.4, -3.5, -Math.PI / 2);
    // 코딩 존: 흰 낮은 칸막이 · 책상 · 인조잔디 띠
    k.flat(turf, 6.2, W - 0.15, -13.6, -8.0, 0.06);
    k.bxz(1.25, 1.35, -13.6, -8.0, 1.2, wht); k.bxz(1.25, 6.2, -8.1, -8.0, 1.2, wht); k.bxz(1.25, 6.2, -13.6, -13.5, 1.2, wht);
    k.inst(new THREE.BoxGeometry(1.4, 0.75, 0.6), wht, [[2.6, 0.375, -9.4], [4.6, 0.375, -9.4], [2.6, 0.375, -11.9], [4.6, 0.375, -11.9]]);
    k.inst(CHAIR, M(0x1a1c22), [[2.6, 0, -10.0, Math.PI], [4.6, 0, -10.0, Math.PI], [2.6, 0, -12.5, Math.PI], [4.6, 0, -12.5, Math.PI]]);
    k.inst(new THREE.BoxGeometry(0.34, 0.22, 0.02), E(0x4a9dff, 0.9), [[2.6, 0.9, -9.25], [4.6, 0.9, -9.25], [2.6, 0.9, -11.75], [4.6, 0.9, -11.75]]);
    k.inst(new THREE.BoxGeometry(0.3, 0.08, 0.3), M(0x2a2c33), [[6.9, 0.1, -9.5], [7.5, 0.1, -10.8], [6.8, 0.1, -12.2]]);
    // ── 맨 안쪽 드론 케이지 (인조잔디 · 흰 틀 · 초록 반투명 그물, 높이 3.8, 3칸) ──
    const cz0 = -15.6, cz1 = -D + 0.05, CH = 3.8;
    k.flat(turf, -W, W, cz1, cz0, 0.06);
    const net = new THREE.MeshStandardMaterial({ color: 0x47d76a, transparent: true, opacity: .22, roughness: .9, side: THREE.DoubleSide, depthWrite: false });
    const xs = [-W, -W / 3, W / 3, W], posts = [];
    xs.forEach(x => [cz0, cz1].forEach(z => posts.push([x, CH / 2, z])));
    k.inst(new THREE.BoxGeometry(0.1, CH, 0.1), wht, posts);
    [cz0, cz1].forEach(z => k.bxz(-W, W, z - 0.05, z + 0.05, 0.1, wht, CH - 0.1));
    xs.forEach(x => k.bxz(x - 0.05, x + 0.05, cz1, cz0, 0.1, wht, CH - 0.1));
    k.pl(net, 2 * W, CH, 0, CH / 2, cz0); k.pl(net, 2 * W, CH, 0, CH / 2, cz1 + 0.02);
    xs.forEach(x => k.pl(net, cz0 - cz1, CH, x, CH / 2, (cz0 + cz1) / 2, Math.PI / 2));
    const top = new THREE.Mesh(new THREE.PlaneGeometry(2 * W, cz0 - cz1), net); top.rotation.x = Math.PI / 2; top.position.set(0, CH, (cz0 + cz1) / 2); g.add(top);
    [['드론1 드론 트레킹', -2 * W / 3], ['드론2', 0], ['드론3 데모시연', 2 * W / 3]].forEach(([t, x]) => {
      const s = k.txt([t], 2.6, 0.42, { bg: '#ffffff', fg: '#1a2a4a', size: 120 }, 0.95); s.position.set(x, CH - 0.45, cz0 + 0.08); g.add(s);
    });
    k.inst(new THREE.BoxGeometry(0.35, 0.08, 0.35), M(0x22252c), [[-5.4, 1.6, -18.2], [0.3, 2.2, -17.6], [5.2, 1.4, -18.6]]);
    k.inst(new THREE.TorusGeometry(0.55, 0.05, 8, 24), E(0xffa02a, 1.4), [[-3.2, 1.4, -18.0], [2.4, 1.8, -18.4]]);
    // 조명 2개 + 바닥 빛
    k.spot([0.4, 8, 3.5], [0.4, 2.6, -0.4], 0xf2f6ff, 150, 0.5);
    k.spot([0, 8.5, -12.5], [0, 0, -18.1], 0xe6ffe8, 140, 0.7);
    k.pool(0, -18.1, 6, 0x7fffa0, 0.22); k.pool(-6.1, -8.2, 3.5, 0xbfe8ff, 0.3); k.pool(4.6, -3.6, 3.5, 0x6fb0ff, 0.3);
  },
});
