/* 미래자동차 부스 3D (부스시안_1027 car_02 조감 · car_03 옆 · car_04 정면 · car_05 평면 보고 지음, 10. 27.) */
// 화면 그림 = 시안 묶음(미래자동차컨소시엄 부스.zip) 안 텍스처(3. map)를 그대로 씀. 자리 = 평면도(car_05) 픽셀을 부스 칸에 맞춰 옮김
export default ({ THREE, M, E, GLOW, box, canvasTex, B3, boothKit, CHAIR }) => ({
  '미래자동차'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr;
    const blk = M(0x0c0e13, { roughness: .45 }), blu = new THREE.MeshBasicMaterial({ color: 0x1a66ff, toneMapped: false }), wht = M(0xf3f5f9, { roughness: .3, metalness: .25, emissive: 0x6a7080, emissiveIntensity: .35 });
    const tblu = M(0x1a4fc4, { roughness: .5, emissive: 0x0b2a80, emissiveIntensity: .6 }), slv = M(0xb8bec8, { roughness: .3, metalness: .6, emissive: 0x30343c, emissiveIntensity: .5 });
    const mat = (t, i = .35) => M(0xffffff, { map: t, roughness: .6, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: i });
    carpet.material = M(0x2a2d33, { roughness: .9 });
    const BW = -D + 0.35;                                                      // 뒷벽 앞면
    // 뒷벽: 가운데 COSS LED + 「FUTURE MOBILITY」 머리 · 양옆 AUTO RACE 포스터 · 위 조명
    k.bxz(-W, W, BW - 0.3, BW, 4.4, blk);
    k.bxz(-3.1, 3.1, BW - 0.3, BW + 0.1, 5.4, blk);
    k.pl(GLOW(B3('car_coss'), 1.1), 5.2, 2.82, 0, 2.75, BW + 0.11);
    [-1, 1].forEach(s => k.box(0.06, 3.0, 0.04, blu, s * 2.8, BW + 0.12, 1.25));
    { const t = k.txt(['F U T U R E   M O B I L I T Y'], 4.8, 0.42, { fg: '#fff', size: 150 }, 1.1); t.position.set(0, 4.75, BW + 0.12); g.add(t); }
    [-1, 1].forEach(s => k.pl(GLOW(B3('car_race'), 1.0), 3.0, 2.6, s * (W - 1.8), 2.6, BW + 0.01));
    k.inst(new THREE.BoxGeometry(0.16, 0.16, 0.22), M(0x22252c), [-5.6, -4.2, -2.4, -0.8, 0.8, 2.4, 4.2, 5.6].map(x => [x, x > -3.1 && x < 3.1 ? 5.5 : 4.5, BW - 0.05]));
    // 무대(빨강) + 연단
    k.bxz(-3.2, 3.2, BW, BW + 2.0, 0.4, M(0x8a1a1f, { roughness: .7, emissive: 0x3a0508, emissiveIntensity: .5 }));
    k.box(0.6, 1.1, 0.45, M(0x9aa1ad, { roughness: .35, metalness: .4 }), 2.5, BW + 1.2, 0.4);
    // 왼쪽 벽 쪽 LED 2곳 (+x 보고 섬): 가운데 = 차 그래픽 LED · 뒤 구석 = 빛 번짐 LED + AUTO RACE 판 · 앞에 CJ 대한통운 데스크
    const unit = (z, w, h, kind) => {
      const q = new THREE.Group(); q.position.set(-W + 0.25, 0, z); q.rotation.y = Math.PI / 2; g.add(q);
      box(w, h, 0.3, blk, 0, 0, 0, q);
      if (kind === 'mid') k.pl(GLOW(B3('car_led'), 1.1), w - 0.4, 2.4, 0, 2.45, 0.16, 0, q);
      else { k.pl(GLOW(B3('car_burst'), 1.15), 3.0, 1.7, -0.75, 2.3, 0.16, 0, q); k.pl(GLOW(B3('car_banner'), 0.95), 1.2, 2.04, 1.65, 1.95, 0.16, 0, q); }
      box(3.6, 0.9, 0.55, blk, 0, 0.75, 0, q); k.pl(GLOW(B3('car_cj'), 0.9), 3.5, 0.8, 0, 0.45, 1.03, 0, q);
    };
    unit(-12.0, 4.0, 3.9, 'mid'); unit(-19.6, 4.8, 3.8, 'corner');
    // 깃발 배너 (AUTO RACE)
    const bm = GLOW(B3('car_banner'), 0.9, { side: THREE.DoubleSide });
    [-3.4, -8.6, -15.2].forEach(z => { k.box(0.04, 2.95, 0.04, slv, -W + 0.5, z); k.pl(bm, 0.62, 2.0, -W + 0.5, 1.9, z + 0.33, Math.PI / 2); });
    // 둘레 은색 펜스 (왼쪽 · 오른쪽)
    const posts = [], fence = (x, z0, z1) => { for (let z = z0; z >= z1 - 0.01; z -= 2) posts.push([x, 0.5, z]); [0.98, 0.5].forEach(y => k.bxz(x - 0.02, x + 0.02, z1, z0, 0.04, slv, y)); };
    fence(-W + 0.08, -2.6, -22.0); fence(W - 0.08, -7.4, -22.0);
    // WeGo 트랙 앞 가로 난간
    for (let x = -3.5; x <= W - 0.4; x += 2) posts.push([x, 0.5, -10.75]);
    [0.98, 0.5].forEach(y => k.bxz(-3.5, W - 0.4, -10.77, -10.73, 0.04, slv, y));
    k.inst(new THREE.CylinderGeometry(0.03, 0.03, 1.0, 8), slv, posts);
    // WeGo 자율주행 트랙 (검정 둘레 턱) + 위 · 왼쪽 파란 테이블
    const wx0 = -3.5, wx1 = W - 0.4, wz0 = -17.1, wz1 = -10.9;
    k.flat(mat(B3('car_wego'), .3), wx0, wx1, wz0, wz1, 0.07);
    [[wx0 - 0.25, wx0, wz0 - 0.25, wz1 + 0.25], [wx1, wx1 + 0.25, wz0 - 0.25, wz1 + 0.25], [wx0, wx1, wz0 - 0.25, wz0], [wx0, wx1, wz1, wz1 + 0.25]].forEach(([a, b, c, d]) => k.bxz(a, b, c, d, 0.38, blk));
    k.bxz(wx0, wx1, wz1 + 0.24, wz1 + 0.27, 0.04, blu, 0.36);
    const TB = new THREE.BoxGeometry(1.8, 0.75, 0.6).translate(0, 0.375, 0), tb = [], ch = [];
    const row = (xs, z, cz, r = 0) => xs.forEach(x => { tb.push([x, 0, z, r]); [-0.45, 0.45].forEach(o => ch.push([x + o, 0, cz, Math.PI])); });
    row([-2.6, -0.7, 1.2, 3.1, 5.0], -17.75, -18.4);
    [-17.0, -15.1, -13.2].forEach(z => { tb.push([-4.0, 0, z, Math.PI / 2]); [-0.45, 0.45].forEach(o => ch.push([-4.65, 0, z + o, -Math.PI / 2])); });
    row([-4.6, -2.7, -0.8], -8.0, -8.65); row([-2.7, -0.8], -6.45, -7.1); row([3.0, 4.9], -7.2, -7.85);
    k.inst(TB, tblu, tb); k.inst(CHAIR, blk, ch);
    k.inst(new THREE.BoxGeometry(0.34, 0.22, 0.02), new THREE.MeshStandardMaterial({ color: 0x050812, emissive: 0x3a7dff, emissiveIntensity: .8 }), tb.map(([x, , z, r]) => [x, 0.87, z + (r ? 0 : -0.1), r]));
    // PHYSICAR AI 트랙 (앞 오른쪽, 검정 턱)
    const px0 = 2.1, px1 = W - 0.25, pz0 = -6.6, pz1 = -0.9;
    k.flat(mat(B3('car_p'), .15), px0, px1, pz0, pz1, 0.07);
    [[px0 - 0.22, px0, pz0 - 0.22, pz1], [px1, px1 + 0.2, pz0 - 0.22, pz1], [px0, px1, pz0 - 0.22, pz0]].forEach(([a, b, c, d]) => k.bxz(a, b, c, d, 0.38, blk));
    // 앞: 낮은 벽 AUTO HACK (양옆) + 파랑 빛 MOBILITY 게이트
    const hk = GLOW(B3('car_hack'), 1.0);
    [[-W, -2.0], [2.4, W]].forEach(([a, b]) => { k.bxz(a, b, -0.75, -0.45, 1.15, blk, 0, fr); k.pl(hk, b - a - 0.25, (b - a - 0.25) / 5.4, (a + b) / 2, 0.6, -0.44, 0, fr); });
    const pm = [blu, blu, blk, blk, blu, blu];
    [-1.7, 2.1].forEach(x => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.6, 0.5), pm); m.position.set(x, 1.8, -0.6); fr.add(m); });
    { const m = new THREE.Mesh(new THREE.BoxGeometry(4.3, 0.5, 0.5), [blk, blk, blk, blu, blu, blu]); m.position.set(0.2, 3.85, -0.6); fr.add(m); }
    { const t = k.txt(['M O B I L I T Y'], 3.8, 0.55, { fg: '#fff', size: 170 }, 1.2); t.position.set(0.2, 4.45, -0.6); fr.add(t); }
    // 전시 차량(흰 세단) + 빛 받침 + 검정 아치
    const cg = new THREE.Group(); cg.position.set(-3.0, 0, -3.35); cg.rotation.y = 0.99; g.add(cg);
    const plate = canvasTex(256, 512, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#1b8cff'); gr.addColorStop(1, '#3fe0a0'); c.fillStyle = gr; c.fillRect(0, 0, w, h); c.fillStyle = 'rgba(0,20,40,.45)'; for (let i = 0; i < 40; i++) c.fillRect(30 + (i % 2) * 120, i * 13, 70, 6); c.strokeStyle = '#bff'; c.lineWidth = 8; c.strokeRect(4, 4, w - 8, h - 8); });
    box(2.6, 0.12, 5.0, M(0x0d1830, { roughness: .3 }), 0, 0, 0, cg);
    { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 4.9), GLOW(plate, 0.7)); p.rotation.x = -Math.PI / 2; p.position.y = 0.125; cg.add(p); }
    box(1.85, 0.62, 4.7, wht, 0, 0, 0.3, cg); box(1.55, 0.5, 2.3, M(0x10141c, { roughness: .15, metalness: .5 }), 0, -0.2, 0.92, cg);
    const wl = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 18).rotateZ(Math.PI / 2), M(0x15171c), 4), o = new THREE.Object3D();
    [[-0.86, 1.45], [0.86, 1.45], [-0.86, -1.45], [0.86, -1.45]].forEach(([x, z], i) => { o.position.set(x, 0.46, z); o.updateMatrix(); wl.setMatrixAt(i, o.matrix); }); cg.add(wl);
    [-0.6, 0.6].forEach(x => box(0.36, 0.1, 0.04, E(0xe8f4ff, 2.2), x, 2.36, 0.68, cg));
    const ag = new THREE.Group(); ag.position.set(-3.1, 0, -3.03); ag.rotation.y = 0.585; g.add(ag);
    const arch = new THREE.Mesh(new THREE.TorusGeometry(2.76, 0.28, 4, 28, Math.PI), blk); arch.scale.y = 1.45; ag.add(arch);
    box(0.62, 1.6, 0.62, blu, 2.76, 0, 0, ag);
    // 엔진 모형(회색 덩어리, 왼쪽 벽 앞)
    const gs = M(0x8a9098, { roughness: .9, emissive: 0x2a2e36, emissiveIntensity: .5 });
    k.box(0.9, 0.55, 0.7, gs, -5.85, -5.5); k.box(0.7, 0.5, 0.55, gs, -5.85, -5.5, 0.55); k.box(0.3, 0.35, 0.3, gs, -5.7, -5.35, 1.05);
    // 조명
    k.spot([0, 7.5, -17], [0, 2.6, BW], 0xe8f0ff, 150, 0.55); k.spot([-3, 7.5, -0.5], [-3, 0.5, -3.4], 0xeaf2ff, 120, 0.45);
    k.pool(-3, -3.4, 3, 0x5fb8ff, 0.35); k.pool(1.3, -14, 5.5, 0x6fa0ff, 0.2); k.pool(0, BW + 1.5, 4.5, 0xff8a9a, 0.18);
  },
});
