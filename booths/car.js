/* 미래자동차 부스 3D — 10. 30. 다시 지음 (부스시안_1027 「4) 미래자동차」: 조감 · 옆(부스2) · 정면(부스3) · 평면(부스4) 보고 지음) */
// 자리 = 평면(부스4, 603 × 810) 화소를 부스 칸에 옮김: X = (px − 320) / 30 × W / 7.0 · Z = −(755 − py) / 30 × D / 24.33 (아래 P)
// 그림 = 시안 묶음(미래자동차컨소시엄 부스.zip) 안 텍스처 그대로 (car_* · car2_*). 높이 · 재질 · 책상 앞판 무늬는 유나 판단
// 이전 판: _work/이전판/car_v1027_재작업전.js
export default ({ THREE, M, E, GLOW, box, canvasTex, B3, boothKit, CHAIR, mergeGeometries }) => ({
  '미래자동차'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr;
    const P = (px, py) => [(px - 320) / 30 * W / 7.0, -(755 - py) / 30 * D / 24.33];
    const blk = M(0x0c0e13, { roughness: .45, emissive: 0x05060a, emissiveIntensity: .5 });
    const blu = new THREE.MeshBasicMaterial({ color: 0x1f6dff, toneMapped: false }), cyan = new THREE.MeshBasicMaterial({ color: 0x3fd6ff, toneMapped: false });
    const wht = M(0xf3f5f9, { roughness: .25, metalness: .3, emissive: 0x7a8090, emissiveIntensity: .45 });
    const slv = M(0xb8bec8, { roughness: .3, metalness: .6, emissive: 0x30343c, emissiveIntensity: .5 });
    const dblu = M(0x1a4fc4, { roughness: .5, emissive: 0x0b2a80, emissiveIntensity: .7 });
    const mat = (t, i = .35, o = {}) => M(0xffffff, { map: t, roughness: .6, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: i, ...o });
    const crop = (t, rx, ry = 1) => { t.repeat.set(rx, ry); t.offset.set((1 - rx) / 2, (1 - ry) / 2); return t; };
    carpet.material = M(0x2a2d33, { roughness: .9, emissive: 0x111318, emissiveIntensity: .5 });

    // ── 뒷벽 (평면 py 62, 뒤 1.2 m는 벽 뒤 공간) : 가운데 COSS LED 틀 + 「FUTURE MOBILITY」 · 양옆 AUTO RACE 포스터
    const BW = P(0, 62)[1];
    const CW = 2.98, SH = 4.85, CH = 5.45;
    k.bxz(-CW, CW, BW - 0.45, BW, CH, blk);
    [-1, 1].forEach(s => k.bxz(s < 0 ? -W : CW + 0.12, s < 0 ? -CW - 0.12 : W, BW - 0.3, BW, SH, blk));
    k.pl(GLOW(B3('car_coss'), 1.1), 4.3, 2.4, 0, 2.75, BW + 0.012);
    k.bxz(-2.3, 2.3, BW, BW + 0.06, 0.08, slv, 1.5); k.bxz(-2.3, 2.3, BW, BW + 0.06, 0.08, slv, 3.95);
    [-2.62, -2.46, 2.46, 2.62].forEach(x => k.box(0.07, 3.3, 0.03, blu, x, BW + 0.02, 0.95));
    { const t = k.txt(['F U T U R E   M O B I L I T Y'], 4.9, 0.42, { fg: '#fff', size: 150 }, 1.15); t.position.set(0, CH - 0.48, BW + 0.012); g.add(t); }
    const race = mat(B3('car2_race'), .5);
    [-1, 1].forEach(s => k.pl(race, 3.15, 4.42, s * (CW + 0.12 + (W - CW - 0.12) / 2), 2.48, BW + 0.01));
    // 벽 위 조명 (평면 py 77 흰 점 자리) : 팔 + 머리 + 빛
    const lx = [128, 157, 195, 268, 307, 337, 370, 405, 455, 490].map(px => P(px, 0)[0]);
    const lamp = lx.map(x => [x, Math.abs(x) < CW ? CH : SH, BW]);
    k.inst(new THREE.BoxGeometry(0.06, 0.06, 0.5).translate(0, 0.05, 0.25), blk, lamp);
    k.inst(new THREE.CylinderGeometry(0.09, 0.12, 0.26, 10).rotateX(-0.9).translate(0, -0.02, 0.52), M(0x15171c, { roughness: .4 }), lamp);
    k.inst(new THREE.CircleGeometry(0.085, 12).rotateX(Math.PI / 2 - 0.9).translate(0, -0.11, 0.63), E(0xf2f6ff, 2.2), lamp);
    // 벽 뒤 공간 + 오른쪽 뒤 창고 (흰 문은 +X 쪽, 부스2)
    k.bxz(W - 1.45, W, -D, BW - 0.3, 2.7, blk);
    k.pl(M(0xf0f1f3, { roughness: .5, emissive: 0x6a6c70, emissiveIntensity: .45 }), 0.9, 2.1, W + 0.005, 1.05, (BW - 0.3 - D) / 2, Math.PI / 2);
    k.box(0.03, 0.03, 0.14, slv, W + 0.03, (BW - 0.3 - D) / 2 + 0.3, 1.0);

    // ── 무대 (빨강 단 + 앞 낮은 단) + 연단 (평면 px 218~420 · py 68~122)
    const [sx0, sz1] = P(218, 122), [sx1] = P(420, 0), [lpx, lpz] = P(403, 90);
    const red = M(0x8a1a1f, { roughness: .75, emissive: 0x3a0508, emissiveIntensity: .6 });
    k.bxz(sx0, sx1, BW, sz1 - 0.45, 0.45, red);
    k.bxz(sx0, sx1, sz1 - 0.45, sz1, 0.22, red);
    k.flat(M(0xa3242b, { roughness: .9, emissive: 0x4a080d, emissiveIntensity: .6 }), sx0 + 0.05, sx1 - 0.05, BW + 0.05, sz1 - 0.5, 0.452);
    k.box(0.62, 1.05, 0.45, slv, lpx, lpz, 0.45);
    { const t = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.55), blk); t.position.set(lpx, 1.53, lpz + 0.02); t.rotation.x = 0.25; g.add(t); }
    k.box(0.5, 0.06, 0.02, blu, lpx, lpz + 0.235, 1.15);
    k.box(0.015, 0.4, 0.015, blk, lpx + 0.15, lpz + 0.1, 1.55);

    // ── 왼쪽 벽 LED 2곳 (+X 보고 섬, 부스2 · 조감): A = 차 터널 LED · B = 빛 번짐 LED + AUTO RACE 판. 아래 띠 = CJ대한통운 · SUPERRACE
    const cj = mat(crop(B3('car_cj'), 1, 0.5), .5);
    const unit = (z, w, scr, scrW, scrH, scrX, extra) => {
      const q = new THREE.Group(); q.position.set(-W + 0.3, 0, z); q.rotation.y = Math.PI / 2; g.add(q);
      box(w, 3.9, 0.3, blk, 0, 0, 0, q);
      k.pl(GLOW(scr, 1.1), scrW, scrH, scrX, 2.6, 0.152, 0, q);
      k.box(w, 0.03, 0.02, slv, 0, 0.16, 1.62, q);
      box(w, 0.95, 0.35, blk, 0, 0.32, 0, q); k.pl(cj, w - 0.12, 0.72, 0, 0.5, 0.496, 0, q);
      if (extra) extra(q);
    };
    unit(-11.45, 3.6, crop(B3('car2_tunnel'), 0.72), 3.2, 1.8, 0);
    unit(-18.7, 3.6, crop(B3('car_burst'), 0.57), 2.0, 1.15, -0.65, q => k.pl(mat(B3('car_banner'), .5), 1.15, 1.95, 1.05, 2.5, 0.152, 0, q));
    // 깃발 배너 4 (AUTO RACE, 옆면 보고 섬)
    const fs = new THREE.Shape(); fs.moveTo(0, 0); fs.lineTo(0, 2.45); fs.quadraticCurveTo(0.05, 2.62, 0.7, 2.5); fs.lineTo(0.66, 0.2); fs.lineTo(0, 0);
    const fg = new THREE.ShapeGeometry(fs, 8), fu = fg.attributes.uv; for (let i = 0; i < fu.count; i++) fu.setXY(i, fu.getX(i) / 0.7, fu.getY(i) / 2.62);
    const flagM = mat(B3('car_banner'), .5, { side: THREE.DoubleSide });
    [-4.6, -8.2, -13.7, -16.4].forEach(z => {
      const q = new THREE.Group(); q.position.set(-W + 0.55, 0, z); q.rotation.y = Math.PI / 2; g.add(q);
      box(0.035, 3.15, 0.035, slv, 0, 0, 0, q); box(0.5, 0.05, 0.05, slv, 0, 0, 0.02, q); box(0.05, 0.05, 0.5, slv, 0, 0, 0.02, q);
      const f = new THREE.Mesh(fg, flagM); f.position.set(0.02, 0.5, 0); q.add(f);
    });
    // 회색 조형물 (평면 px 120 · py 595, 점박이 회색)
    const speck = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#8f96a0'; c.fillRect(0, 0, w, h); for (let i = 0; i < 2600; i++) { const v = 90 + Math.random() * 120 | 0; c.fillStyle = `rgb(${v},${v + 4},${v + 10})`; c.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 3, 2 + Math.random() * 3); } });
    const gs = M(0xffffff, { map: speck, roughness: .9, emissive: 0x30343c, emissiveIntensity: .6 });
    { const [x, z] = [-W + 0.85, P(0, 595)[1]];
      k.box(1.0, 0.25, 0.8, blk, x, z); k.box(0.8, 0.75, 0.6, gs, x, z, 0.25); k.box(0.55, 0.35, 0.45, gs, x + 0.05, z, 1.0);
      const t = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.09, 8, 20), gs); t.position.set(x, 1.62, z); t.rotation.y = Math.PI / 2; g.add(t); }

    // ── 펜스 (양옆 은색 난간)
    const posts = [], fence = (x, z0, z1) => { for (let z = z0; z >= z1 - 0.01; z -= 1.8) posts.push([x, 0.5, z]); posts.push([x, 0.5, z1]); [0.98, 0.5].forEach(y => k.bxz(x - 0.02, x + 0.02, z1, z0, 0.035, slv, y)); };
    fence(-W + 0.08, -1.3, BW); fence(W - 0.08, -3.75, BW - 0.3);

    // ── WeGo 자율주행 트랙 (평면 px 210~512 · py 238~420): 검정 단 + 트랙 그림 + 테두리 · 앞 · 오른쪽 파랑 빛 띠
    const [wx0, wz0] = P(210, 238), [wx1, wz1] = P(512, 420);
    k.bxz(wx0, wx1, wz0, wz1, 0.3, blk);
    k.flat(mat(B3('car_wego'), .3), wx0 + 0.25, wx1 - 0.25, wz0 + 0.25, wz1 - 0.25, 0.302);
    [[wx0, wx0 + 0.25, wz0, wz1], [wx1 - 0.25, wx1, wz0, wz1], [wx0, wx1, wz0, wz0 + 0.25], [wx0, wx1, wz1 - 0.25, wz1]].forEach(([a, b, c, d]) => k.bxz(a, b, c, d, 0.07, blk, 0.3));
    k.bxz(wx0, wx1, wz1, wz1 + 0.02, 0.05, blu, 0.12); k.bxz(wx1, wx1 + 0.02, wz0, wz1, 0.05, blu, 0.12);
    // 트랙 앞 난간 + 오른쪽 난간의 「2026」 현수막 (바깥 보고 섬)
    for (let x = wx0; x <= W - 0.1; x += 1.8) posts.push([x, 0.5, wz1 + 0.35]);
    [0.98, 0.5].forEach(y => k.bxz(wx0, W - 0.1, wz1 + 0.33, wz1 + 0.37, 0.035, slv, y));
    const ban = mat(B3('car_led'), .45, { side: THREE.DoubleSide });
    [-12.4, -16.0].forEach(z => k.pl(ban, 1.45, 0.92, W - 0.05, 0.6, z, Math.PI / 2));
    k.inst(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 8), slv, posts);

    // ── 팀 책상 (파랑 앞판 · 흰 옆판 · 노트북 2, 의자는 뒤) — 평면 파란 칸 자리
    const deskTex = canvasTex(512, 192, (c, w, h) => {
      const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2457d6'); gr.addColorStop(1, '#123a9e'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
      c.fillStyle = 'rgba(255,255,255,.9)'; c.fillRect(0, 10, w, 4);
      [w * 0.3, w * 0.5, w * 0.7].forEach(x => { c.strokeStyle = '#fff'; c.lineWidth = 5; c.beginPath(); c.arc(x - 26, h * 0.52, 14, 0, 7); c.stroke(); c.fillStyle = '#fff'; c.fillRect(x - 6, h * 0.44, 46, 7); c.fillRect(x - 6, h * 0.56, 32, 5); });
    });
    const deskTop = mergeGeometries([new THREE.BoxGeometry(1.7, 0.04, 0.62).translate(0, 0.75, 0)]);
    const deskEnd = mergeGeometries([-0.83, 0.83].map(x => new THREE.BoxGeometry(0.04, 0.73, 0.6).translate(x, 0.365, 0)));
    const deskBack = new THREE.BoxGeometry(1.62, 0.6, 0.02).translate(0, 0.42, 0.28);
    const deskFace = new THREE.PlaneGeometry(1.62, 0.6).translate(0, 0.42, 0.292);
    const lap = mergeGeometries([-0.4, 0.4].flatMap(x => [new THREE.BoxGeometry(0.34, 0.02, 0.24).translate(x, 0.78, 0), new THREE.BoxGeometry(0.34, 0.23, 0.012).translate(0, 0.115, 0).rotateX(0.25).translate(x, 0.79, 0.12)]));
    const lapS = mergeGeometries([-0.4, 0.4].map(x => new THREE.PlaneGeometry(0.31, 0.2).rotateY(Math.PI).translate(0, 0.115, -0.008).rotateX(0.25).translate(x, 0.79, 0.12)));
    const dl = [], cl = [];
    const desk = (x, z, r = 0) => { dl.push([x, 0, z, r]); [-0.42, 0.42].forEach(o => { const oz = -0.62; cl.push([x + o * Math.cos(r) + oz * Math.sin(r), 0, z - o * Math.sin(r) + oz * Math.cos(r), r + Math.PI]); }); };
    [233.5, 294.5, 353.5, 412.5, 472.5].forEach(px => desk(P(px, 0)[0], P(0, 216)[1]));          // 트랙 뒤 5
    [237.5, 295.5, 353].forEach(py => desk(P(193.5, 0)[0], P(0, py)[1], Math.PI / 2));          // 트랙 왼쪽 3
    [176.5, 235, 293.5].forEach(px => desk(P(px, 0)[0], P(0, 505)[1]));                         // 가운데 왼쪽 1줄 3
    [233.5, 293.5].forEach(px => desk(P(px, 0)[0], P(0, 550)[1]));                              // 2줄 2
    [411.5, 471.5].forEach(px => desk(P(px, 0)[0], P(0, 530)[1]));                              // PHYSICAR 뒤 2
    k.inst(deskTop, M(0xeef1f6, { roughness: .4, emissive: 0x5a5e68, emissiveIntensity: .45 }), dl);
    k.inst(deskEnd, wht, dl); k.inst(deskBack, dblu, dl); k.inst(deskFace, mat(deskTex, .45), dl);
    k.inst(lap, M(0x3a3f48, { roughness: .4, metalness: .5, emissive: 0x15171c, emissiveIntensity: .5 }), dl);
    k.inst(lapS, new THREE.MeshBasicMaterial({ color: 0x4f8dff, toneMapped: false }), dl);
    k.inst(CHAIR, blk, cl);

    // ── PHYSICAR AI 트랙 (앞 오른쪽, 평면 px 383~515 · py 543~722): 초록 매트 + 검정 턱 · 옆 낮은 벽
    const [px0, pz0] = P(383, 543), [px1, pz1] = P(515, 722);
    k.flat(mat(B3('car_p'), .25), px0, px1, pz0, pz1, 0.05);
    [[px0 - 0.12, px0, pz0 - 0.12, pz1], [px1, px1 + 0.12, pz0 - 0.12, pz1], [px0, px1, pz0 - 0.12, pz0]].forEach(([a, b, c, d]) => k.bxz(a, b, c, d, 0.12, blk));
    k.bxz(px0 - 0.32, px0 - 0.12, pz0 - 0.12, pz1 + 0.3, 0.5, blk);
    // ── 앞: 낮은 벽 AUTO HACK (양옆) + 파랑 빛 MOBILITY 게이트 (평면 px 262~395)
    const hk = mat(B3('car_hack'), .55);
    const [gx0] = P(262, 0), [gx1] = P(395, 0), PW = 0.45, GD = 0.5, GH = 3.55;
    [[-W, gx0], [gx1, W]].forEach(([a, b]) => { k.bxz(a, b, -0.75, -0.45, 1.0, blk, 0, fr); const L = b - a - 0.3; k.pl(hk, L, Math.min(0.8, L / 5.4), (a + b) / 2, 0.52, -0.444, 0, fr); });
    { const z0 = k.fz(W) - 0.75, z1 = -3.75; k.bxz(W - 0.3, W, z1, z0, 1.0, blk); k.pl(hk, 3.0, 0.56, W + 0.003, 0.52, (z0 + z1) / 2, Math.PI / 2); }
    { const z0 = k.fz(-W) - 0.75; k.bxz(-W, -W + 0.3, -2.4, z0, 1.0, blk); }
    const pmL = [blu, blk, blk, blk, blu, blu], pmR = [blk, blu, blk, blk, blu, blu];
    [[gx0 + PW / 2, pmL], [gx1 - PW / 2, pmR]].forEach(([x, m]) => [[0, 1.74], [1.79, GH - 1.79]].forEach(([y, h]) => { const b = new THREE.Mesh(new THREE.BoxGeometry(PW, h, GD), m); b.position.set(x, y + h / 2, -0.45 - GD / 2); fr.add(b); }));
    { const b = new THREE.Mesh(new THREE.BoxGeometry(gx1 - gx0, 0.42, GD), [blk, blk, blk, blu, blu, blu]); b.position.set((gx0 + gx1) / 2, GH + 0.21, -0.45 - GD / 2); fr.add(b); }
    { const t = k.txt(['M O B I L I T Y'], 3.9, 0.55, { fg: '#fff', size: 170 }, 1.25); t.position.set((gx0 + gx1) / 2, GH + 0.72, -0.45 - GD / 2); fr.add(t); }

    // ── 전시 차량 (흰 세단, 평면 px 220 · py 640, 약 30° 돌림) + 빛 받침 (TIRE TRACKS 그림)
    const [cx, cz] = P(220, 640), cg = new THREE.Group(); cg.position.set(cx, 0, cz); cg.rotation.y = 1.02; g.add(cg);
    const tire = B3('car2_tire'); tire.center.set(.5, .5); tire.rotation = Math.PI / 2;
    box(2.6, 0.14, 5.1, M(0x0d1830, { roughness: .3, emissive: 0x06102a, emissiveIntensity: .6 }), 0, 0, 0, cg);
    { const p = new THREE.Mesh(new THREE.PlaneGeometry(2.48, 4.98), GLOW(tire, 0.8)); p.rotation.x = -Math.PI / 2; p.position.y = 0.143; cg.add(p); }
    [-1.3, 1.3].forEach(x => box(0.03, 0.04, 5.1, cyan, x, 0, 0.1, cg)); [-2.55, 2.55].forEach(z => box(2.6, 0.04, 0.03, cyan, 0, z, 0.1, cg));
    const prof = (pts) => { const s = new THREE.Shape(); s.moveTo(...pts[0]); pts.slice(1).forEach(p => s.lineTo(...p)); return s; };
    const ext = (s, w) => new THREE.ExtrudeGeometry(s, { depth: w, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 3 }).rotateY(-Math.PI / 2).translate(w / 2, 0, 0);
    const car = new THREE.Group(); car.position.y = 0.14; cg.add(car);
    const carW = M(0xffffff, { roughness: .22, metalness: .1, emissive: 0xc4c8d2, emissiveIntensity: .6 });
    car.add(new THREE.Mesh(ext(prof([[-2.36, 0.3], [2.36, 0.3], [2.43, 0.62], [2.26, 0.8], [1.08, 0.95], [-1.72, 0.95], [-2.36, 0.91], [-2.44, 0.6]]), 1.76), carW));
    car.add(new THREE.Mesh(ext(prof([[1.08, 0.93], [0.38, 1.36], [-0.88, 1.39], [-1.7, 0.93]]), 1.52), M(0x0f141d, { roughness: .1, metalness: .6, emissive: 0x0a1424, emissiveIntensity: .5 })));
    box(1.5, 0.05, 1.18, carW, 0, -0.26, 1.37, car);
    const wl = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.34, 0.34, 0.24, 20).rotateZ(Math.PI / 2), M(0x15171c), 4), rim = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.2, 0.2, 0.25, 12).rotateZ(Math.PI / 2), slv, 4), o = new THREE.Object3D();
    [[-0.86, 1.45], [0.86, 1.45], [-0.86, -1.45], [0.86, -1.45]].forEach(([x, z], i) => { o.position.set(x, 0.34, z); o.updateMatrix(); wl.setMatrixAt(i, o.matrix); o.position.x = x * 1.01; o.updateMatrix(); rim.setMatrixAt(i, o.matrix); }); car.add(wl, rim);
    [-0.6, 0.6].forEach(x => { box(0.38, 0.1, 0.04, E(0xe8f4ff, 2.2), x, 2.47, 0.62, car); box(0.32, 0.08, 0.04, E(0xff2a3a, 1.6), x, -2.5, 0.74, car); });
    box(0.7, 0.2, 0.04, M(0x14161b, { metalness: .6, roughness: .3 }), 0, 2.48, 0.42, car);
    // 검정 아치 (평면 px 150,690 → 290,610, 한쪽 다리에 파랑 LED)
    const [ax0, az0] = P(155, 688), [ax1, az1] = P(287, 612), half = Math.hypot(ax1 - ax0, az1 - az0) / 2;
    const ag = new THREE.Group(); ag.position.set((ax0 + ax1) / 2, 0, (az0 + az1) / 2); ag.rotation.y = Math.atan2(-(az1 - az0), ax1 - ax0); g.add(ag);
    { const t = 0.55, a = half + t / 2, H = 3.9, R = 1.0, s = new THREE.Shape();
      s.moveTo(-a, 0); s.lineTo(-a, H - R); s.quadraticCurveTo(-a, H, -a + R, H); s.lineTo(a - R, H); s.quadraticCurveTo(a, H, a, H - R); s.lineTo(a, 0);
      s.lineTo(a - t, 0); s.lineTo(a - t, H - R); s.quadraticCurveTo(a - t, H - t, a - R, H - t); s.lineTo(-a + R, H - t); s.quadraticCurveTo(-a + t, H - t, -a + t, H - R); s.lineTo(-a + t, 0); s.lineTo(-a, 0);
      const m = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 12 }).translate(0, 0, -t / 2), blk); ag.add(m);
      [-1, 1].forEach(sd => k.pl(blu, 0.4, 1.7, half, 1.15, sd * (t / 2 + 0.004), sd < 0 ? Math.PI : 0, ag)); }

    // ── 소화기 (평면 빨간 점)
    [[P(505, 0)[0], P(0, 540)[1] - 0.2], [P(258, 0)[0] - 0.15, -1.3], [W - 0.35, wz1 + 0.6]].forEach(([x, z]) => { k.box(0.18, 0.5, 0.18, M(0xc81e24, { roughness: .4, emissive: 0x500a0c, emissiveIntensity: .6 }), x, z); k.box(0.1, 0.1, 0.1, blk, x, z, 0.5); });

    // ── 조명
    k.spot([0, 7.5, -16.5], [0, 2.8, BW], 0xe8f0ff, 150, 0.55); k.spot([cx + 0.5, 7.5, cz + 2.5], [cx, 0.5, cz], 0xeaf2ff, 120, 0.45);
    k.pool(cx, cz, 3, 0x5fb8ff, 0.35); k.pool((wx0 + wx1) / 2, (wz0 + wz1) / 2, 5.5, 0x6fa0ff, 0.2); k.pool(0, BW + 1.2, 4.5, 0xff8a9a, 0.18); k.pool((px0 + px1) / 2, (pz0 + pz1) / 2, 3, 0x9fffc0, 0.12);
  },
});
