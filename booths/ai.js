/* 인공지능 부스 3D — 10. 30. 다시 지음 (플로우 「인공지능」 글 86989520 · 강주영 10. 30. 13:40 댓글 첨부 「co-show 인공지능 컨소시움 3D 제안시안.pdf」 11쪽 보고 지음) */
// 콘셉트 = 공항 「AICOSS RE:LOCAL」: 검정 모듈 큐브 + 노랑 테. 왼쪽 팀 벽(비행기 창) · 가운데 지붕 보 + 키오스크 5 · 오른쪽 활주로 라운지 · 뒤 입국심사 배경 · 파랑 LED
// 폭 = 시안 2쪽(위에서 본 그림) 비율(왼쪽 팀 25% · 통로 15% · 가운데 21% · 활주로 37%). 시안 부스는 약 1 : 2.7, VR 칸은 1 : 1.8 → 길이를 줄여 맞춤(유나 판단)
// 높이 · 팀 수 · 키오스크 면 배치 · 파랑 LED 그림(시안의 윈도 바탕화면 대신 빛줄기) · 재질은 유나 판단. 그림 ai2_immig = 시안 9쪽 입국심사 배경(TV · 가구 가린 곳 빼고 이어 붙임)
// 시안 댓글(10. 30. 13:42): 「인공지능 부스는 차주에 구조가 변경될 예정」 → 바뀐 시안 오면 다시 지음. 이전 판: _work/이전판/ai_v1027_시안재작업전.js
export default ({ THREE, M, GLOW, canvasTex, B3, boothKit, CHAIR, FONT, mergeGeometries }) => {
  const NAME = '인공지능', YEL = '#f2b51c';
  const icon = (c, x, y, s) => {                                                 // 노랑 네모 + 비행기
    c.fillStyle = YEL; c.fillRect(x, y, s, s); c.save(); c.translate(x + s / 2, y + s / 2); c.rotate(Math.PI / 4); c.fillStyle = '#111'; const u = s / 10;
    c.fillRect(-0.6 * u, -3.8 * u, 1.2 * u, 7.6 * u);
    c.beginPath(); c.moveTo(0, -1.2 * u); c.lineTo(3.6 * u, 0.9 * u); c.lineTo(-3.6 * u, 0.9 * u); c.fill();
    c.beginPath(); c.moveTo(0, 2.4 * u); c.lineTo(1.7 * u, 3.7 * u); c.lineTo(-1.7 * u, 3.7 * u); c.fill(); c.restore();
  };
  const arrow = (c, x, y, a) => { c.save(); c.translate(x, y); c.rotate(a); c.strokeStyle = '#fff'; c.lineWidth = 7; c.beginPath(); c.moveTo(0, -26); c.lineTo(0, 24); c.moveTo(-16, 8); c.lineTo(0, 26); c.lineTo(16, 8); c.stroke(); c.restore(); };
  const signTex = (t, arrs) => canvasTex(640, 128, (c, w, h) => {                // 매다는 안내판 (Arrivals · AI Travel Studio · VR Experience)
    c.fillStyle = '#0d0e11'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3d4048'; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4);
    icon(c, 18, 18, 92); c.fillStyle = '#fff'; c.font = `600 52px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(t, 132, h / 2 + 2);
    let x = 132 + c.measureText(t).width + 36; arrs.forEach(a => { arrow(c, x, h / 2, a); x += 46; });
  });
  const gridTex = canvasTex(128, 128, (c, w, h) => {                             // 모듈 큐브 한 칸 (이음선 · 모서리 볼트)
    c.fillStyle = '#141519'; c.fillRect(0, 0, w, h); c.strokeStyle = '#3d4048'; c.lineWidth = 4; c.strokeRect(2, 2, w - 4, h - 4);
    c.fillStyle = '#9aa0a8'; [[10, 10], [w - 10, 10], [10, h - 10], [w - 10, h - 10]].forEach(([x, y]) => { c.beginPath(); c.arc(x, y, 3.5, 0, 7); c.fill(); });
  });
  gridTex.wrapS = gridTex.wrapT = THREE.RepeatWrapping;
  const depTex = canvasTex(768, 1024, (c, w, h) => {                             // 출발 안내판 (시안 4쪽 글자 그대로, PARIS 편명은 안 읽혀 비움)
    c.fillStyle = '#14233f'; c.fillRect(0, 0, w, h);
    icon(c, 44, 46, 88); c.fillStyle = '#fff'; c.font = `800 66px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText('DEPARTURES', 156, 92);
    c.fillStyle = '#2a3d63'; c.fillRect(36, 166, w - 72, 4);
    c.fillStyle = '#9fb0c8'; c.font = `600 30px ${FONT}`; c.fillText('TIME', 48, 206); c.fillText('DESTINATION', 196, 206); c.fillText('FLIGHT', 590, 206);
    const rows = [['13:10', 'NEW YORK', 'R4 450'], ['13:15', 'BERLIN', 'EB 713'], ['13:20', 'HONG KONG', 'HP 689'], ['13:25', 'PARIS', ''], ['13:30', 'TOKYO', 'HP 689'], ['13:35', 'FRANKFURT', 'EB 343'], ['13:40', 'AMSTERDAM', 'IC 901']];
    c.fillStyle = '#f3d77a'; c.font = `600 44px "Courier New", monospace`;
    rows.forEach(([t, d, f], i) => { const y = 290 + i * 104; c.fillText(t, 44, y); c.fillText(d, 196, y); c.fillText(f, 576, y); });
  });
  const grayTex = canvasTex(1024, 716, (c, w, h) => {                            // 왼쪽 앞 공항 벽 (시안 6쪽: 출국 · FLIGHTS · BAGGAGE CLAIM 안내 + 모니터 줄)
    c.fillStyle = '#b4b6b9'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#9a9da1'; c.beginPath(); c.moveTo(0, h * .44); c.lineTo(w, h * .30); c.lineTo(w, h * .52); c.lineTo(0, h * .62); c.fill();
    c.fillStyle = '#d9dbde'; c.fillRect(0, h * .72, w, h * .28);
    const sg = (x, y, sw, sh, t, fs) => { c.fillStyle = '#26231f'; c.fillRect(x, y, sw, sh); icon(c, x + 8, y + 8, sh - 16); c.fillStyle = '#e9c77b'; c.font = `600 ${fs}px ${FONT}`; c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillText(t, x + sh + 6, y + sh / 2 + 2); };
    sg(40, 150, 250, 50, 'DEPARTURES / 출국', 28); sg(320, 136, 220, 54, 'FLIGHTS', 32); sg(570, 80, 420, 86, 'BAGGAGE CLAIM', 52);
    c.fillStyle = '#0c0d10'; for (let i = 0; i < 9; i++) c.fillRect(30 + i * 110, 236, 100, 64);
  });
  const teamTex = canvasTex(512, 614, (c, w, h) => {                             // 팀 벽 한 칸 (시안 8쪽: Team name · 비행기 창 · 세로 모니터)
    c.fillStyle = '#eef0f2'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#1a1b1e'; c.font = `500 46px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('Team name', w * .5, 62);
    const rr = (x, y, rw, rh, r) => { c.beginPath(); c.roundRect(x, y, rw, rh, r); };
    c.fillStyle = '#dde0e4'; rr(56, 140, 170, 300, 80); c.fill(); c.strokeStyle = '#c3c7cc'; c.lineWidth = 6; c.stroke();
    const gr = c.createLinearGradient(0, 170, 0, 410); gr.addColorStop(0, '#eaf2f8'); gr.addColorStop(1, '#a9c3d8'); c.fillStyle = gr; rr(82, 170, 118, 240, 56); c.fill();
    c.fillStyle = '#f4f5f6'; rr(82, 170, 118, 96, 40); c.fill(); c.fillStyle = '#c3c7cc'; c.fillRect(120, 258, 42, 6);
    c.fillStyle = '#0d0e11'; c.fillRect(290, 140, 160, 280);
  });
  const ledTex = canvasTex(1024, 896, (c, w, h) => {                             // 파랑 LED (시안은 윈도 바탕화면 → 로고 없이 파랑 빛줄기, 유나 판단)
    const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#021446'); gr.addColorStop(.6, '#0a3fb0'); gr.addColorStop(1, '#06215f'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    const ox = w * .68, oy = h * .45; c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 10; i++) { const a = Math.PI * (0.78 + i * 0.05); c.fillStyle = `rgba(90,170,255,${.07 + (i % 3) * .03})`; c.beginPath(); c.moveTo(ox, oy); c.lineTo(ox + Math.cos(a) * 1600, oy + Math.sin(a) * 1600); c.lineTo(ox + Math.cos(a + .03) * 1600, oy + Math.sin(a + .03) * 1600); c.fill(); }
    const rg = c.createRadialGradient(ox, oy, 10, ox, oy, w * .45); rg.addColorStop(0, 'rgba(170,215,255,.9)'); rg.addColorStop(.3, 'rgba(60,140,255,.35)'); rg.addColorStop(1, 'rgba(0,40,140,0)'); c.fillStyle = rg; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'source-over';
  });

  return {
    [NAME](g, W, D, carpet, slope) {
      const k = boothKit(g, slope);
      carpet.material = M(0x2c2d31, { roughness: .95, emissive: 0x141518, emissiveIntensity: .5 });
      const cub = M(0xffffff, { map: gridTex, roughness: .45, emissive: 0xffffff, emissiveMap: gridTex, emissiveIntensity: .3, envMapIntensity: .12 });
      const yel = M(0xf2b51c, { roughness: .4, emissive: 0xf2b51c, emissiveIntensity: .5, envMapIntensity: .1 });
      const lite = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false });
      const wht = M(0xf1f2f4, { roughness: .5, emissive: 0x77797e, emissiveIntensity: .45 });
      const scr = M(0x0b0c10, { roughness: .15, metalness: .4, emissive: 0x0a0e18, emissiveIntensity: .6 });
      const blk = M(0x111215, { roughness: .4 });
      const slv = M(0xb8bec8, { roughness: .3, metalness: .6, emissive: 0x30343c, emissiveIntensity: .5 });
      const pic = (t, i = .45) => M(0xffffff, { map: t, roughness: .6, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: i });
      // 모듈 큐브: 면마다 0.55 m 한 칸씩 이음선이 보이게 uv 늘림
      const cubeGeo = (w, h, d, s = 0.55) => { const gm = new THREE.BoxGeometry(w, h, d), uv = gm.attributes.uv, dm = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
        for (let f = 0; f < 6; f++) for (let i = 0; i < 4; i++) { const j = f * 4 + i; uv.setXY(j, uv.getX(j) * Math.max(1, Math.round(dm[f][0] / s)), uv.getY(j) * Math.max(1, Math.round(dm[f][1] / s))); }
        return gm; };
      const cb = (w, h, d, x, z, y0 = 0, m = cub) => { const q = new THREE.Mesh(cubeGeo(w, h, d), m); q.position.set(x, y0 + h / 2, z); g.add(q); return q; };
      // 보 한 줄 (점 사이 큐브 토막, ax = 'z' 앞뒤로 · 'x' 옆으로 가는 보). mats 면 순서 +x −x +y −y +z −z
      const run = (P, ax, mats, s = 0.5) => P.slice(1).forEach((b, i) => { const a = P[i], dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], L = Math.hypot(dx, dy, dz) + 0.02;
        const q = new THREE.Mesh(ax === 'z' ? cubeGeo(s, s, L) : cubeGeo(L, s, s), mats); q.position.set((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2);
        if (ax === 'z') q.rotation.x = Math.atan2(-dy, dz); else q.rotation.z = Math.atan2(dy, dx); g.add(q); });

      // ── 폭 나누기 (시안 2쪽 비율) ─────────
      const RX0 = 1.4, RX1 = W - 0.2, zF0 = Math.min(0, slope * RX1);           // 활주로 (앞선이 기운 만큼 잘라 냄)
      const xL = -2.85, xR = -0.15, Y = 3.65, R = 0.9, zF = -1.7, zB = -D + 6.2;  // 가운데 지붕 보

      // ── 왼쪽: 앞 공항 벽 + 팀 벽 (비행기 창 · Team name · 모니터) + 팀 책상 · 흰 의자 · 칸막이 ──
      k.bxz(-W, -W + 0.12, -4.6, -0.3, 3.0, wht); k.pl(pic(grayTex, .5), 4.3, 3.0, -W + 0.125, 1.5, -2.45, Math.PI / 2);
      const TL = D - 4.6, nT = Math.max(5, Math.round(TL / 2.5));
      teamTex.wrapS = THREE.RepeatWrapping; teamTex.repeat.x = nT;
      k.bxz(-W, -W + 0.12, -D, -4.6, 3.0, wht); k.pl(pic(teamTex, .5), TL, 3.0, -W + 0.125, 1.5, (-4.6 - D) / 2, Math.PI / 2);
      { const L = D - 1.0, n = Math.round(L / 2.5), m = L / n, ch = [];
        for (let i = 0; i < n; i++) { const zc = -0.6 - (i + 0.5) * m; cb(0.55, 0.9, m - 0.5, -W + 1.35, zc); ch.push([-W + 0.62, 0, zc - 0.5, -Math.PI / 2], [-W + 0.62, 0, zc + 0.5, -Math.PI / 2]); }
        k.inst(CHAIR, wht, ch);
        for (let j = 2; j < n - 1; j += 2) { const zf = -0.6 - j * m; k.bxz(-W + 0.12, -W + 1.75, zf - 0.04, zf + 0.04, 2.4, wht); } }

      // ── 앞 가운데: 출발 안내판 큐브 벽(양옆 흰 빛 기둥) · 「2026 CO-SHOW 인공지능컨소시엄」 큐브 벽 · INFORMATION 데스크 ──
      cb(2.2, 2.75, 0.55, -1.6, -0.95);
      k.pl(GLOW(depTex, 1.0), 1.55, 2.07, -1.6, 1.4, -0.67);
      [-2.62, -0.58].forEach(x => k.box(0.16, 2.75, 0.04, lite, x, -0.66));
      cb(1.5, 2.75, 0.5, 0.3, -1.75);
      { const t = k.txt(['2026', 'CO-SHOW', '인공지능컨소시엄'], 1.4, 1.3, { fg: '#3fe0ff', size: 150 }, 1.2); t.position.set(0.3, 1.9, -1.49); g.add(t); }
      cb(1.1, 1.0, 0.55, 0.55, -0.75); k.box(1.14, 0.04, 0.6, yel, 0.55, -0.75, 1.0);
      { const t = k.txt(['INFORMATION'], 0.9, 0.12, { fg: YEL, size: 150 }, 1.0); t.position.set(0.55, 0.88, -0.47); g.add(t); }

      // ── 가운데 지붕 보 (검정 큐브 + 바깥 노랑 테): 앞은 옆 보가 오른쪽에서 꺾여 내려오고, 뒤는 두 보가 아치로 바닥까지 ──
      const cubs = [cub, cub, cub, cub, cub, cub], side = s => s < 0 ? [cub, yel, cub, cub, cub, cub] : [yel, cub, cub, cub, cub, cub];
      const arc = (f, n = 14) => Array.from({ length: n + 1 }, (_, i) => f(i / n * Math.PI / 2));
      [[xL, -1], [xR, 1]].forEach(([x, s]) => run([[x, Y, zF + 0.25], [x, Y, zB], ...arc(a => [x, Y - R + R * Math.cos(a), zB - R * Math.sin(a)]).slice(1), [x, 0, zB - R]], 'z', side(s)));
      const xC = 0.3;
      run([[xL - 0.25, Y, zF], [xC, Y, zF], ...arc(a => [xC + R * Math.sin(a), Y - R + R * Math.cos(a), zF]).slice(1), [xC + R, 0, zF]], 'x', [cub, cub, yel, cub, yel, cub]);
      { const t = k.txt(['AICOSS RE:LOCAL'], 3.3, 0.5, { fg: '#fff', size: 170 }, 1.25); t.position.set(-1.3, Y + 0.55, zF); g.add(t); }
      k.inst(new THREE.CylinderGeometry(0.05, 0.05, Y - 0.25, 8).translate(0, (Y - 0.25) / 2, 0), blk, [-5.4, -10.4, -15.4].flatMap(z => [[xL, 0, z], [xR, 0, z]]));
      // 보 사이 매단 검정 상자 + TV (앞뒤)
      [-6.0, -11.0].forEach(z => { cb(xR - xL, 0.3, 0.3, (xL + xR) / 2, z, Y - 0.25); cb(1.2, 0.7, 0.5, -1.5, z, 2.55);
        k.inst(new THREE.CylinderGeometry(0.015, 0.015, 0.6, 6).translate(0, 0.3, 0), blk, [[-1.9, 3.1, z], [-1.1, 3.1, z]]);
        [1, -1].forEach(f => k.pl(scr, 1.0, 0.56, -1.5, 2.9, z + f * 0.255, f > 0 ? 0 : Math.PI)); });
      { const s = k.pl(GLOW(signTex('Arrivals', [Math.PI / 4]), 1.0), 1.3, 0.26, -1.5, 3.0, zF + 0.27); s.renderOrder = 1; }

      // ── 키오스크 5 (왼쪽 보 아래): 큐브 몸통 · 노랑 판 · 흰 빛 3칸 · 흰 세로 화면 · 「AI Travel Studio ↓」 · 통로 쪽 TV ──
      const st = GLOW(signTex('AI Travel Studio', [0]), 1.0);
      [-4.2, -6.7, -9.2, -11.7, -14.2].forEach(z => { const px = -2.35;
        cb(1.0, 2.5, 1.4, px, z); k.box(1.04, 2.6, 0.14, yel, px, z - 0.77);
        for (let i = 0; i < 3; i++) k.box(0.04, 0.76, 0.26, lite, px + 0.52, z - 0.54, 0.08 + i * 0.82);
        k.pl(lite, 0.55, 1.0, px + 0.505, 1.25, z + 0.18, Math.PI / 2);
        k.pl(st, 0.8, 0.16, px + 0.51, 2.2, z + 0.18, Math.PI / 2);
        k.pl(scr, 0.9, 0.52, px - 0.505, 1.7, z, -Math.PI / 2); });
      // VR 체험 큐브 벽 (뒤 아치 앞, TV 2) + 「VR Experience」 안내판
      cb(0.5, 2.6, 2.8, -1.2, -D + 6.6);
      [-D + 7.3, -D + 5.9].forEach(z => k.pl(scr, 1.1, 0.62, -0.945, 1.7, z, Math.PI / 2));
      k.pl(GLOW(signTex('VR Experience', [Math.PI / 4, 0]), 1.0), 1.5, 0.3, 0.12, 3.1, -D + 6.6, Math.PI / 2);
      // 흰 높은 탁자 2 (가운데 보 오른쪽)
      const hiT = (x, z) => { k.box(0.7, 0.04, 0.7, wht, x, z, 1.05); [[-.31, -.31], [.31, -.31], [-.31, .31], [.31, .31]].forEach(([a, b]) => k.box(0.03, 1.05, 0.03, wht, x + a, z + b)); };
      hiT(0.55, -D + 7.4); hiT(0.55, -D + 9.0);

      // ── 뒤: 입국심사 배경(시안 9쪽 사진) · 큰 TV · 흰 높은 탁자 · 남색 탁자 + 프린터 + 흰 의자 2 ──
      { const bx0 = -W + 0.12, bx1 = 1.5, bw = bx1 - bx0, bh = Math.min(3.4, bw * 439 / 1024);
        k.bxz(bx0, bx1, -D, -D + 0.12, bh, M(0x2a2b2e)); k.pl(pic(B3('ai2_immig'), .5), bw, bh, (bx0 + bx1) / 2, bh / 2, -D + 0.125); }
      k.box(2.0, 1.15, 0.08, scr, -3.0, -D + 1.8, 1.35); k.box(0.06, 1.4, 0.06, slv, -3.0, -D + 1.86); k.box(0.9, 0.04, 0.5, slv, -3.0, -D + 1.86);
      hiT(-1.6, -D + 2.3);
      k.box(1.6, 0.76, 0.8, M(0x14205a, { roughness: .9, emissive: 0x0a1030, emissiveIntensity: .5 }), 0.3, -D + 1.4);
      k.box(0.55, 0.3, 0.45, wht, 0.65, -D + 1.4, 0.76);
      k.inst(CHAIR, wht, [[-0.1, 0, -D + 0.62, Math.PI], [0.65, 0, -D + 0.62, Math.PI]]);

      // ── 오른쪽 활주로: 바닥 그림(가장자리 · 가운데 점선 · 문턱 줄무늬 · WELCOME · 횡단보도 · 노랑 꺾쇠) ──
      { const rw = RX1 - RX0, PX = 100, cw = Math.round(rw * PX), chh = Math.round((D + zF0) * PX), Yc = z => (z + D) * PX;
        const run2 = canvasTex(cw, chh, (c, w, h) => {
          c.fillStyle = '#25262a'; c.fillRect(0, 0, w, h);
          for (let i = 0; i < 5000; i++) { c.fillStyle = `rgba(255,255,255,${Math.random() * .05})`; c.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
          c.fillStyle = '#e8e8e8'; c.fillRect(0.15 * PX, 0, 0.12 * PX, h); c.fillRect(w - 0.27 * PX, 0, 0.12 * PX, h);
          const cx = w / 2; for (let z = -5.6; z > -D + 4.2; z -= 2.4) c.fillRect(cx - 6, Yc(z) - 60, 12, 120);
          for (let i = 0; i < 8; i++) c.fillRect(0.5 * PX + i * (w - 1.0 * PX) / 8 + 6, Yc(-5.0), 0.26 * PX, 1.1 * PX);
          [-8.5, -13.5].forEach(z => [-1, 1].forEach(s => c.fillRect(cx + s * 0.9 * PX - 0.15 * PX, Yc(z) - 0.75 * PX, 0.3 * PX, 1.5 * PX)));
          for (let x = 0.4; x < 2.9; x += 0.5) c.fillRect(x * PX, Yc(-D + 3.4), 0.28 * PX, 1.2 * PX);
          c.fillStyle = YEL; c.font = `800 ${0.6 * PX}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('W E L C O M E', cx, Yc(-1.35));
          c.strokeStyle = YEL; c.lineWidth = 0.12 * PX; [w - 1.6 * PX, w - 0.9 * PX].forEach(x => { c.beginPath(); c.moveTo(x - 0.3 * PX, Yc(-D + 1.5)); c.lineTo(x, Yc(-D + 0.9)); c.lineTo(x + 0.3 * PX, Yc(-D + 1.5)); c.stroke(); });
          c.fillRect(w - 2.2 * PX, Yc(-D + 0.4), 2.0 * PX, 0.1 * PX);
        });
        k.flat(M(0xffffff, { map: run2, roughness: .8, emissive: 0xffffff, emissiveMap: run2, emissiveIntensity: .7, envMapIntensity: .08 }), RX0, RX1, -D, zF0, 0.065); }
      // 2연 아치 게이트 「AICOSS RE:LOCAL」 (큐브 기둥 3 · 안쪽 흰 빛 테)
      { const GZ = -3.4, px = [RX0 + 0.3, (RX0 + RX1) / 2, RX1 - 0.3], gh = 3.3;
        px.forEach(x => cb(0.55, gh, 0.55, x, GZ)); cb(RX1 - RX0, 0.6, 0.55, (RX0 + RX1) / 2, GZ, gh);
        [1, -1].forEach(f => { const z = GZ + f * 0.29;
          [px[0] + 0.3, px[1] - 0.3, px[1] + 0.3, px[2] - 0.3].forEach(x => k.box(0.05, gh, 0.03, lite, x, z));
          [[px[0], px[1]], [px[1], px[2]]].forEach(([a, b]) => k.box(b - a - 0.55, 0.05, 0.03, lite, (a + b) / 2, z, gh - 0.05)); });
        const t = k.txt(['AICOSS RE:LOCAL'], 3.6, 0.42, { fg: '#fff', size: 170 }, 1.25); t.position.set((RX0 + RX1) / 2, gh + 0.3, GZ + 0.285); g.add(t); }
      // 둥근 유리 탁자 5 + 빨강 의자 20 · 화분 상자 · 난간 · 긴 벤치 3
      { const tx = RX0 + (RX1 - RX0) * 0.6, tzs = [-6.5, -9.1, -11.7, -14.3, -16.9], chs = [], tbs = [], pls = [], leaves = [];
        tzs.forEach(z => { tbs.push([tx, 0, z]); for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2; chs.push([tx + Math.sin(a) * 0.72, 0, z + Math.cos(a) * 0.72, a]); }
          [-0.55, 0.55].forEach(o => { pls.push([W - 0.75, 0, z + o]); for (let j = 0; j < 9; j++) leaves.push([W - 0.75 + (Math.random() - .5) * 0.26, 0.85, z + o + (Math.random() - .5) * 0.8, Math.random() * 6]); }); });
        k.inst(new THREE.CylinderGeometry(0.45, 0.45, 0.03, 24).translate(0, 0.74, 0), M(0xcfe6ee, { transparent: true, opacity: .45, roughness: .05, metalness: .2 }), tbs);
        k.inst(new THREE.CylinderGeometry(0.03, 0.2, 0.73, 10).translate(0, 0.365, 0), slv, tbs);
        const shell = mergeGeometries([new THREE.CylinderGeometry(0.27, 0.2, 0.07, 16).translate(0, 0.46, 0), new THREE.CylinderGeometry(0.31, 0.27, 0.42, 16, 1, true, -Math.PI * 0.6, Math.PI * 1.2).translate(0, 0.7, 0)]);
        k.inst(shell, M(0xd0141c, { roughness: .45, emissive: 0xc0101a, emissiveIntensity: .45, envMapIntensity: .1, side: THREE.DoubleSide }), chs);
        k.inst(new THREE.CylinderGeometry(0.02, 0.12, 0.44, 8).translate(0, 0.22, 0), slv, chs);
        k.inst(new THREE.BoxGeometry(0.36, 0.32, 0.92).translate(0, 0.69, 0), blk, pls);
        k.inst(new THREE.BoxGeometry(0.025, 0.53, 0.025).translate(0, 0.265, 0), blk, pls.flatMap(([x, , z]) => [[x - .16, 0, z - .43], [x + .16, 0, z - .43], [x - .16, 0, z + .43], [x + .16, 0, z + .43]]));
        k.inst(new THREE.ConeGeometry(0.04, 0.4, 4).translate(0, 0.2, 0), M(0x3f8a2e, { roughness: .8, emissive: 0x1a3a12, emissiveIntensity: .5 }), leaves);
        const fx = W - 0.12, zs = [];
        for (let z = -4.0; z > -D + 0.2; z -= 1.6) zs.push([fx, 0, z]);
        for (let x = fx - 1.6; x > 4.4; x -= 1.6) zs.push([x, 0, -D + 0.2]);
        k.inst(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 6).translate(0, 0.5, 0), blk, zs);
        [0.98, 0.55].forEach(y => { k.bxz(fx - 0.02, fx + 0.02, -D + 0.2, -4.0, 0.03, blk, y); k.bxz(4.4, fx, -D + 0.18, -D + 0.22, 0.03, blk, y); });
        [[W - 0.6, -D + 3.0], [W - 1.25, -D + 4.2], [W - 0.6, -D + 5.4]].forEach(([x, z]) => cb(0.45, 0.45, 2.0, x, z)); }
      // 파랑 LED (뒤, 앞을 봄) + 뒤 비계 트러스
      { const lx = 3.1, lz = -D + 1.0;
        k.box(2.9, 2.6, 0.12, blk, lx, lz, 0.2); k.pl(GLOW(ledTex, 1.05), 2.8, 2.45, lx, 1.5, lz + 0.065);
        const zz = [lz - 0.1, -D + 0.25], xx = [lx - 1.35, lx + 1.35];
        xx.forEach(x => zz.forEach(z => k.box(0.05, 3.6, 0.05, slv, x, z)));
        [0.3, 1.6, 2.9, 3.55].forEach(y => { zz.forEach(z => k.box(2.75, 0.04, 0.04, slv, lx, z, y)); xx.forEach(x => k.box(0.04, 0.04, zz[0] - zz[1], slv, x, (zz[0] + zz[1]) / 2, y)); });
        { const d = k.box(0.04, 0.04, Math.hypot(2.7, 1.3), slv, lx, -D + 0.25, 2.25); d.rotation.set(0, Math.PI / 2, Math.atan2(1.3, 2.7)); } }

      // 조명
      k.spot([-1.2, 7.5, 2.5], [-1.0, 1.2, -1.5], 0xeef2ff, 140, 0.6);
      k.spot([4.2, 7.5, -9], [4.2, 0, -12], 0xeef2ff, 150, 0.75);
      k.spot([-2.5, 7.5, -D + 7], [-2.0, 1.0, -D + 1], 0xeef2ff, 130, 0.7);
      k.pool(-1.4, -9, 4, 0xffe6a0, 0.25); k.pool(3.9, -11, 5, 0xbfd6ff, 0.25); k.pool(-2, -D + 3, 4, 0xbfd6ff, 0.25);
    },
  };
};
