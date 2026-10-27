/* 데이터보안활용융합 부스 3D (부스시안_1027 「CO-SHOW 행사 공간 기획_v1.0」 2쪽 평면·조감 · 4~6쪽 · 9쪽 보고 지음, 10. 27.) */
// 자리 = 2쪽 평면도(13.5 × 25.455 m)를 부스 칸에 맞춰 옮김(x 0.933배). 존마다 짙은 바닥 + 파란 빛 테두리 + 검정 차단봉 · 줄
export default ({ THREE, M, E, GLOW, box, canvasTex, B3, boothKit, CHAIR, FONT }) => ({
  '데이터보안활용융합'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr;
    const blk = M(0x111318, { roughness: .5 }), wht = M(0xf2f4f8, { roughness: .35, emissive: 0x50566a, emissiveIntensity: .35 });
    const led = new THREE.MeshBasicMaterial({ color: 0x3f86ff, toneMapped: false });
    const navy = M(0x101a4a, { roughness: .5, emissive: 0x0a1240, emissiveIntensity: .5 });
    carpet.material = M(0x3a3e46, { roughness: .9 });
    const posts = [], ropes = [];
    // 존: 바닥색 + 빛 테두리 + 차단봉(gap = 열린 쪽 [면, 시작, 끝])
    const zone = (x0, x1, z0, z1, col, open = null, rope = true) => {
      k.flat(M(col, { roughness: .8, emissive: col, emissiveIntensity: .18 }), x0, x1, z0, z1, 0.05);
      [[x0, x1, z0, z0 + 0.06], [x0, x1, z1 - 0.06, z1], [x0, x0 + 0.06, z0, z1], [x1 - 0.06, x1, z0, z1]].forEach(([a, b, c, d]) => k.bxz(a, b, c, d, 0.03, led, 0.05));
      if (!rope) return;
      const side = (ax, bx, az, bz, name) => {
        const L = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(L / 1.4));
        for (let i = 0; i <= n; i++) {
          const t = i / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
          if (open && open[0] === name && (name === 'f' || name === 'b' ? x > open[1] && x < open[2] : z > open[1] && z < open[2])) continue;
          posts.push([x, 0.47, z]);
          if (i < n) { const x2 = ax + (bx - ax) * (i + 1) / n, z2 = az + (bz - az) * (i + 1) / n, mx = (x + x2) / 2, mz = (z + z2) / 2;
            if (open && open[0] === name && (name === 'f' || name === 'b' ? mx > open[1] && mx < open[2] : mz > open[1] && mz < open[2])) continue;
            ropes.push([mx, 0.86, mz, name === 'f' || name === 'b' ? 0 : Math.PI / 2, L / n]); }
        }
      };
      side(x0 + 0.15, x1 - 0.15, z1 - 0.15, z1 - 0.15, 'f'); side(x0 + 0.15, x1 - 0.15, z0 + 0.15, z0 + 0.15, 'b');
      side(x0 + 0.15, x0 + 0.15, z0 + 0.15, z1 - 0.15, 'l'); side(x1 - 0.15, x1 - 0.15, z0 + 0.15, z1 - 0.15, 'r');
    };
    // 존 이름판(남색 판 + 흰 글자, 기둥 위)
    const sign = (t, x, z, w = 2.2, y = 2.0, r = 0) => {
      const q = new THREE.Group(); q.position.set(x, 0, z); q.rotation.y = r; g.add(q);
      box(0.05, y, 0.05, blk, 0, 0, 0, q);
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.5), GLOW(canvasTex(1024, Math.round(1024 * 0.5 / w), (c, cw, ch) => { c.fillStyle = '#13235e'; c.fillRect(0, 0, cw, ch); c.strokeStyle = '#7fb0ff'; c.lineWidth = 8; c.strokeRect(4, 4, cw - 8, ch - 8); c.fillStyle = '#fff'; c.font = `700 ${Math.round(ch * 0.55)}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, cw / 2, ch / 2 + 2); }), 1.0, { side: THREE.DoubleSide }));
      p.position.set(0, y + 0.25, 0); q.add(p);
    };
    const floorTxt = (t, x, z, w, h, col = '#e8eeff') => { const m = k.txt([t], w, h, { fg: col, size: 200 }, 0.8); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.08, z); g.add(m); };
    const table = (x, z, w = 1.6, d = 0.6, r = 0, m = wht) => { const q = box(w, 0.75, d, m, x, z); q.rotation.y = r; return q; };
    const mon = [], chs = [];

    // ── 입구 게이트 (7.0 × 3.5 m, 안쪽 흰 빛) + 「SDU 데이터보안 활용융합」
    const gateTex = canvasTex(256, 1024, (c, w, h) => { c.fillStyle = '#0d1640'; c.fillRect(0, 0, w, h); c.lineWidth = 10; [['#7a4dff', 0.55], ['#3f86ff', 0.75]].forEach(([s, y]) => { c.strokeStyle = s; c.beginPath(); c.moveTo(0, h * y); c.lineTo(w, h * (y - 0.18)); c.stroke(); }); });
    const gOut = GLOW(gateTex, 0.9), gIn = new THREE.MeshBasicMaterial({ color: 0xf4f8ff, toneMapped: false });
    [-1, 1].forEach(s => {
      const f = [navy, navy, navy, navy, gOut, navy]; f[s < 0 ? 0 : 1] = gIn;
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.5, 3.5, 0.8), f); m.position.set(s * 3.25, 1.75, -0.8); fr.add(m);
    });
    { const m = new THREE.Mesh(new THREE.BoxGeometry(6.0, 0.6, 0.8), [navy, navy, navy, gIn, gOut, navy]); m.position.set(0, 3.2, -0.8); fr.add(m); }
    { const t = k.txt(['SDU 데이터보안 활용융합'], 6.6, 0.7, { fg: '#fff', size: 200 }, 1.3); t.position.set(0, 3.9, -0.8); fr.add(t); }
    // INFO DESK · STAMP MISSION (게이트 안 양옆)
    [['security_info', -2.6], ['security_stamp', 2.6]].forEach(([n, x]) => { k.box(1.0, 1.0, 0.5, wht, x, -2.0); k.pl(GLOW(B3(n), 1.0), 1.0, 1.0, x, 0.5, -1.74); });

    // ── 인형뽑기 존
    zone(-6.11, -0.51, -9.39, -4.33, 0x1d3fb0, ['f', -2.9, -0.6]);
    sign('인형뽑기 존', -4.4, -4.6);
    [-4.96, -3.94].forEach(x => { k.box(1.05, 1.725, 0.8, M(0xe8ecf4, { roughness: .3, emissive: 0x404a66, emissiveIntensity: .4 }), x, -8.0); k.pl(GLOW(B3('security_claw'), 1.05), 0.95, 1.7, x, 0.87, -7.59); });
    table(-4.45, -8.95, 1.4, 0.45); k.inst(new THREE.BoxGeometry(0.3, 0.25, 0.3), M(0xc9a676, { roughness: .9 }), [[-4.9, 0.875, -8.95], [-4.5, 0.875, -8.95], [-4.1, 0.875, -8.95]]);
    for (let z = -8.6; z <= -5.2; z += 1.1) [-2.5, -1.3].forEach(x => posts.push([x, 0.47, z]));
    [-2.5, -1.3].forEach(x => ropes.push([x, 0.86, -6.9, Math.PI / 2, 3.4]));
    floorTxt('대기공간', -1.9, -6.9, 1.6, 0.4);
    k.pl(GLOW(B3('security_xban'), 0.95), 0.6, 1.75, -5.75, 0.95, -6.4, Math.PI / 2);
    k.pl(GLOW(B3('security_guide'), 0.95), 0.7, 1.2, -3.0, 0.9, -8.9);
    k.box(0.04, 0.4, 0.04, blk, -3.0, -8.92);

    // ── OX 퀴즈 존
    zone(-6.11, -0.51, -14.85, -10.8, 0x2a56d8, ['f', -4.2, -2.6]);
    sign('OX 퀴즈 존', -5.0, -11.05, 2.0);
    { const o = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.09, 8, 40), new THREE.MeshBasicMaterial({ color: 0x5ff0ff, toneMapped: false })); o.rotation.x = -Math.PI / 2; o.position.set(-4.67, 0.1, -12.6); g.add(o); }
    [1, -1].forEach(s => { const m = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.18), new THREE.MeshBasicMaterial({ color: 0xe25cff, toneMapped: false })); m.rotation.y = s * Math.PI / 4; m.position.set(-2.05, 0.1, -12.6); g.add(m); });
    table(-3.36, -14.3, 1.4, 0.5, 0, blk);
    { const tv = canvasTex(512, 288, (c, w, h) => { c.fillStyle = '#0b1a5a'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = '700 96px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('OX 퀴즈', w / 2, h / 2); });
      k.box(1.3, 0.75, 0.06, blk, -3.36, -14.45, 1.2); k.pl(GLOW(tv, 1.1), 1.22, 0.68, -3.36, 1.575, -14.41); }

    // ── 모의해킹 존 (앞 = 대기공간)
    zone(-6.11, -0.51, -20.36, -16.3, 0x5a2fc0, ['f', -4.6, -2.2]);
    k.flat(M(0x6a6e78, { roughness: .8, emissive: 0x30333a, emissiveIntensity: .4 }), -6.0, -0.62, -17.3, -16.4, 0.06);
    floorTxt('대기공간', -3.36, -16.85, 1.6, 0.4);
    sign('모의해킹 존', -3.36, -18.0, 2.2, 2.3);
    table(-3.36, -19.95, 2.2, 0.6, 0, blk); [-3.9, -2.8].forEach(x => { mon.push([x, 0.75, -20.05, 0]); chs.push([x, 0, -19.35, Math.PI]); });
    [-5.25, -1.47].forEach((x, i) => { table(x, -18.35, 1.5, 0.6, Math.PI / 2, blk); mon.push([x + (i ? 0.1 : -0.1), 0.75, -18.35, i ? -Math.PI / 2 : Math.PI / 2]); chs.push([x + (i ? -0.65 : 0.65), 0, -18.35, i ? Math.PI / 2 : -Math.PI / 2]); });

    // ── 소개팅 심사공간 (왼쪽 뒤)
    zone(-6.11, -3.69, -24.2, -21.7, 0x8a8f99, ['f', -5.0, -4.2]);
    sign('소개팅 심사공간', -4.9, -21.95, 2.2);
    [-5.35, -4.45].forEach(x => { table(x, -23.1, 0.7, 1.4, 0); chs.push([x - 0.5, 0, -23.1, -Math.PI / 2], [x + 0.5, 0, -23.1, Math.PI / 2]); });
    k.bxz(-6.0, -3.8, -24.15, -24.1, 1.6, M(0x2a2f3a, { roughness: .6 }));

    // ── 소개팅 부스 1~11 (파란 뒷판 + 흰 데스크 「SDU」)
    const deskT = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#f4f7ff'; c.fillRect(0, 0, w, h); c.fillStyle = '#1e46c8'; c.font = '800 92px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('SDU', w / 2, h / 2); });
    const deskM = M(0xffffff, { map: deskT, roughness: .4, emissive: 0xffffff, emissiveMap: deskT, emissiveIntensity: .4 });
    const bwall = M(0x1f4fd8, { roughness: .4, emissive: 0x1a44c8, emissiveIntensity: .8 }), kpos = GLOW(B3('security_kiosk'), 1.0);
    const kiosk = (n, x, z, r) => {
      const q = new THREE.Group(); q.position.set(x, 0, z); q.rotation.y = r; g.add(q);
      box(1.1, 2.5, 0.12, bwall, 0, -0.35, 0, q); box(1.14, 0.04, 0.14, led, 0, -0.35, 2.5, q);
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.25), kpos); p.position.set(0, 1.5, -0.28); q.add(p);
      const h = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.26), GLOW(canvasTex(512, 140, (c, w, hh) => { c.fillStyle = '#ffffff'; c.fillRect(0, 0, w, hh); c.fillStyle = '#1a3fb8'; c.font = '800 84px ' + FONT; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('소개팅 ' + n, w / 2, hh / 2 + 3); }), 1.0)); h.position.set(0, 2.3, -0.28); q.add(h);
      box(1.0, 1.0, 0.5, wht, 0, 0.05, 0, q);
      const f = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.98), deskM); f.position.set(0, 0.5, 0.31); q.add(f);
    };
    [-1.56, -0.14, 1.31, 2.75, 4.15].forEach((x, i) => kiosk(i + 1, x, -24.55, 0));
    [-23.19, -21.62, -20.1, -18.58, -17.04, -15.52].forEach((z, i) => kiosk(i + 6, 5.6, z, -Math.PI / 2));

    // ── 대기공간(VR 앞 세로 줄) · VR 1 · VR 2 · 운영사무국
    k.flat(M(0x6a6e78, { roughness: .8, emissive: 0x30333a, emissiveIntensity: .4 }), 1.63, 2.57, -14.4, -6.44, 0.05);
    [1.7, 2.5].forEach(x => { for (let z = -14.2; z <= -6.6; z += 1.27) posts.push([x, 0.47, z]); ropes.push([x, 0.86, -10.4, Math.PI / 2, 7.6]); });
    { const t = k.txt(['대', '기', '공', '간'], 0.6, 1.8, { fg: '#e8eeff', size: 150 }, 0.8); t.rotation.x = -Math.PI / 2; t.position.set(2.1, 0.08, -10.4); g.add(t); }
    zone(2.64, 6.1, -14.4, -10.5, 0x6a35d0, ['l', -13.6, -11.3], false);
    zone(2.64, 6.1, -10.5, -6.5, 0x2a4fd0, ['l', -9.7, -7.3], false);
    [[-12.45, 'VR 1'], [-8.5, 'VR 2']].forEach(([z, t]) => {
      floorTxt(t, 3.5, z + 1.25, 1.2, 0.45);
      { const r = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.025, 4, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); r.rotation.x = -Math.PI / 2; r.position.set(3.9, 0.08, z); g.add(r); }
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 14, 0, Math.PI * 2, 0, Math.PI * 0.62), M(0x15171c, { roughness: .35, side: THREE.DoubleSide })); s.scale.set(1, 1.35, 1); s.rotation.x = -0.5; s.position.set(3.9, 0.55, z - 0.1); g.add(s);
      k.box(0.5, 0.4, 0.5, M(0x15171c, { roughness: .35 }), 3.9, z);
      table(5.45, z, 0.5, 1.0, 0, blk); mon.push([5.45, 0.75, z, -Math.PI / 2]);
    });
    k.pl(GLOW(B3('security_vrban'), 0.95), 0.6, 1.75, 2.0, 0.95, -5.95);
    k.flat(M(0xc9cdd4, { roughness: .7, emissive: 0x50545c, emissiveIntensity: .4 }), 2.66, 6.1, -6.38, -4.38, 0.05);
    sign('운영사무국', 4.4, -4.5, 1.8, 2.0);
    [3.6, 5.2].forEach(x => { k.box(1.4, 0.75, 0.5, wht, x, -4.95); k.pl(deskM, 0.6, 0.6, x, 0.4, -4.69); chs.push([x - 0.3, 0, -5.6, Math.PI], [x + 0.3, 0, -5.6, Math.PI]); });

    // 차단봉 · 줄 · 모니터 · 의자 한 번에
    k.inst(new THREE.CylinderGeometry(0.03, 0.035, 0.94, 8), blk, posts);
    k.inst(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 12), blk, posts.map(([x, , z]) => [x, 0.015, z]));
    ropes.forEach(([x, y, z, r, L]) => { const m = box(L, 0.03, 0.03, blk, x, z, y); m.rotation.y = r; });
    k.inst(new THREE.BoxGeometry(0.6, 0.38, 0.04).translate(0, 0.3, 0), M(0x0a0c12, { emissive: 0x2f6bff, emissiveIntensity: .7 }), mon);
    k.inst(CHAIR, blk, chs);

    // 조명
    k.spot([0, 7.5, 1.5], [0, 1.5, -1.5], 0xeaf0ff, 120, 0.5); k.spot([0, 8, -12], [0, 0, -15], 0x9fb4ff, 160, 0.75);
    k.pool(0, -1.5, 3.5, 0xdbe6ff, 0.3); k.pool(-3.3, -12.6, 3.5, 0x4f7bff, 0.2); k.pool(4.4, -10.4, 3, 0x8a5bff, 0.2);
  },
});
