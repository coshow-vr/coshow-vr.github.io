/* 사물인터넷 부스 3D (부스시안_1027 iot_01 · 02 · 03 · 05 · 06 · 07 보고 지음, 10. 27.) */
// 앞(통로)에서 안쪽으로: 노란 게이트 · 로고 간판 · 검정 소파 → 가운데 노란 줄무늬 길 · 오른쪽 스마트 팩토리(노란 벽) · 왼쪽 반려식물 체험
// → 포토존 배너(빨간 카펫) · 대학 홍보 벽 → 맨 안쪽 무대(LED · 객석) · 오른쪽 안 대기실
export default ({ THREE, M, E, GLOW, box, canvasTex, B3, boothKit, CHAIR, FONT }) => ({
  '사물인터넷'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr;
    const blk = M(0x141519, { roughness: .45 }), gls = M(0x0b0c10, { roughness: .15, metalness: .4 }), wht = M(0xf1f2f4, { roughness: .45 });
    const navy = M(0x1b2464, { roughness: .9 }), red = M(0x7a1016, { roughness: .95 }), cy = E(0x3fe6ff, 2.2), Y = '#e6a915';
    carpet.material = M(0x3b3d42, { roughness: .85 });
    // 바닥: 짙은 회색 + 노란 동선 줄 · 바닥 글자 · 주의 띠 (시안 iot_02 바닥 그림)
    const Z1 = -0.6, cw = 1024, ch = 2048, px = x => (x + W) / (2 * W) * cw, py = z => (z + D) / (D + Z1) * ch, sx = cw / (2 * W), sz = ch / (D + Z1);
    const floor = canvasTex(cw, ch, (c) => {
      c.fillStyle = '#3a3c41'; c.fillRect(0, 0, cw, ch);
      c.globalAlpha = .06; for (let i = 0; i < 900; i++) { c.fillStyle = Math.random() > .5 ? '#fff' : '#000'; c.fillRect(Math.random() * cw, Math.random() * ch, 3, 3); } c.globalAlpha = 1;
      const ln = (x0, z0, x1, z1, w = 0.07) => { c.strokeStyle = Y; c.lineWidth = w * sx; c.beginPath(); c.moveTo(px(x0), py(z0)); c.lineTo(px(x1), py(z1)); c.stroke(); };
      [-1.43, -0.57, -0.29, 0.43].forEach(x => ln(x, -1.6, x, -14.6));                     // 두 체험 동선 (Companion Plant · Agentic IoT)
      ln(-2.6, -14.6, 2.6, -14.6); ln(-2.6, -14.6, -2.6, -20.0); ln(2.6, -14.6, 2.6, -20.0); // 가운데 E 구역 테두리
      ln(-5.6, -9.3, -2.4, -9.3); ln(-2.4, -9.3, -2.4, -15.4); ln(-5.6, -1.6, -2.0, -1.6);
      const vt = (t, x, z, s = 0.42) => { c.save(); c.translate(px(x), py(z)); c.rotate(-Math.PI / 2); c.fillStyle = Y; c.font = `700 ${s * sx}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, 0, 0); c.restore(); };
      vt('Companion Plant Experience', -1.0, -7.6, 0.4); vt('Agentic IoT Smart Factory', 0.07, -7.6, 0.4);
      [['E-1', -2.25, -15.4], ['E-2', -2.25, -17.0], ['E-3', -2.25, -18.6], ['E-4', 2.25, -15.4], ['E-5', 2.25, -17.0], ['E-6', 2.25, -18.6]].forEach(([t, x, z]) => vt(t, x, z, 0.3));
      vt('STAGE', -2.25, -21.5, 0.38);
      c.fillStyle = Y; c.font = `900 ${0.5 * sx}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle';
      [[-1.0, -3], [0.07, -12.5], [-1.0, -12.5], [-2.25, -19.6], [2.25, -19.6]].forEach(([x, z]) => c.fillText('^', px(x), py(z)));
      const tape = (x0, z0, x1, z1) => { const L = Math.hypot((x1 - x0) * sx, (z1 - z0) * sz); c.save(); c.translate(px(x0), py(z0)); c.rotate(Math.atan2((z1 - z0) * sz, (x1 - x0) * sx)); c.fillStyle = '#f2c21a'; c.fillRect(0, -9, L, 18); c.fillStyle = '#111'; c.font = `700 12px ${FONT}`; c.textBaseline = 'middle'; for (let i = 8; i < L; i += 90) c.fillText('CAUTION', i, 0); c.restore(); };
      tape(2.3, -1.4, W - 0.1, -1.4); tape(2.3, -1.4, 2.3, -6.2); tape(-5.6, -9.0, -2.6, -9.0); tape(-2.6, -9.0, -2.6, -15.6);
      [-3.4, -4.7].forEach(z => { c.strokeStyle = Y; c.lineWidth = 4; c.beginPath(); c.arc(px(W - 1.5), py(z), 0.3 * sx, 0, 7); c.stroke(); c.fillStyle = Y; c.font = `900 ${0.4 * sx}px ${FONT}`; c.fillText('→', px(W - 1.5), py(z)); });
    });
    k.flat(M(0xffffff, { map: floor, roughness: .75 }), -W, W, -D, Z1, 0.05);
    // 줄무늬 · 주의 그림
    const stripe = (n, a = '#f2b51c', b = '#121214', dia = true) => canvasTex(512, 128, (c, w, h) => { c.fillStyle = b; c.fillRect(0, 0, w, h); c.fillStyle = a; const s = w / n; for (let i = -2; i < n + 2; i++) { c.beginPath(); c.moveTo(i * s, h); c.lineTo(i * s + s / 2, h); c.lineTo(i * s + s / 2 + (dia ? h * .6 : 0), 0); c.lineTo(i * s + (dia ? h * .6 : 0), 0); c.fill(); } });
    const cautM = M(0xffffff, { map: stripe(10), roughness: .6 });
    // ── 앞: 노란 게이트 (반투명 노란 판 · 톱니 그림 · 아래 주의 띠) ──
    const gp = canvasTex(256, 512, (c, w, h) => { c.fillStyle = '#e9ad16'; c.fillRect(0, 0, w, h); c.globalAlpha = .35; c.fillStyle = '#fff3b0'; for (let x = 6; x < w; x += 22) c.fillRect(x, 0, 3, h); c.globalAlpha = .5; c.strokeStyle = '#8a5d00'; c.lineWidth = 3; for (let y = 64; y < h; y += 128) c.strokeRect(4, y, w - 8, 2); c.globalAlpha = .55; c.lineWidth = 4; c.beginPath(); c.arc(w * .5, h * .3, 26, 0, 7); c.stroke(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(w * .5 + Math.cos(a) * 26, h * .3 + Math.sin(a) * 26); c.lineTo(w * .5 + Math.cos(a) * 36, h * .3 + Math.sin(a) * 36); c.stroke(); } });
    const gm = GLOW(gp, 0.95), gx0 = -4.6, gx1 = 1.6, gc = (gx0 + gx1) / 2, pw = 1.1, gz = -1.05;
    [gx0 + pw / 2, gx1 - pw / 2].forEach(x => { k.box(pw, 2.8, 1.0, gm, x, gz, 0, fr); k.box(pw + 0.04, 0.22, 1.04, cautM, x, gz, 0, fr); });
    k.box(gx1 - gx0, 1.25, 1.0, gm, gc, gz, 2.8, fr);
    k.pl(GLOW(B3('iot_gate'), 1.0), gx1 - gx0, 1.22, gc, 3.42, gz + 0.51, 0, fr);
    // 앞 오른쪽: 로고 + 「사물인터넷 혁신융합대학사업단」 세움 간판 (아래 하늘색 빛)
    k.box(4.0, 0.3, 0.5, blk, 3.7, -0.95, 0, fr); k.box(4.02, 0.04, 0.52, cy, 3.7, -0.95, 0.02, fr);
    k.pl(GLOW(B3('iot_logo'), 1.0), 1.0, 1.0, 2.2, 0.85, -0.69, 0, fr);
    { const t = k.txt(['사물인터넷', '혁신융합대학사업단'], 2.6, 0.95, { fg: '#ffffff', size: 150 }, 1.0); t.position.set(4.05, 0.85, -0.69); fr.add(t); }
    k.pool(3.7, -0.5, 2.0, 0x3fe6ff, 0.45);
    // 앞 왼쪽: 검정 모듈 소파 (⊂ 모양, 아래 주의 띠)
    const sofa = [];
    for (let i = 0; i < 6; i++) sofa.push([-5.3, 0.225, -2.5 - i * 0.7]);
    [-4.6, -3.9].forEach(x => { sofa.push([x, 0.225, -2.5]); sofa.push([x, 0.225, -6.0]); });
    k.inst(new THREE.BoxGeometry(0.68, 0.45, 0.68), blk, sofa);
    k.inst(new THREE.BoxGeometry(0.7, 0.08, 0.7), cautM, sofa.map(([x, , z]) => [x, 0.06, z]));
    k.box(0.22, 0.4, 4.2, blk, -5.63, -4.25, 0.45);
    // ── 오른쪽: Agentic IoT 스마트 팩토리 (노란 벽 · 키오스크 · 상담 책상 · 큐브 전시대 · 로봇) ──
    const yw = canvasTex(2048, 464, (c, w, h) => {
      c.fillStyle = '#d99c12'; c.fillRect(0, 0, w, h); c.globalAlpha = .3; c.fillStyle = '#fff1a8'; for (let x = 0; x < w; x += 92) c.fillRect(x, 0, 4, h); c.globalAlpha = 1;
      c.strokeStyle = 'rgba(60,40,0,.55)'; c.lineWidth = 4;
      const gear = (x, y, r) => { c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke(); c.beginPath(); c.arc(x, y, r * .4, 0, 7); c.stroke(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; c.beginPath(); c.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); c.lineTo(x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3); c.stroke(); } };
      const arm = (x, y) => { c.beginPath(); c.moveTo(x, y + 110); c.lineTo(x + 40, y + 110); c.moveTo(x + 20, y + 110); c.lineTo(x + 20, y + 40); c.lineTo(x + 90, y); c.lineTo(x + 150, y + 40); c.lineTo(x + 150, y + 70); c.stroke(); [[x + 20, y + 40], [x + 90, y], [x + 150, y + 40]].forEach(([a, b]) => { c.beginPath(); c.arc(a, b, 10, 0, 7); c.stroke(); }); };
      [[150, 120, 30], [230, 160, 18], [760, 110, 26], [1320, 140, 34], [1400, 100, 16], [1880, 130, 28]].forEach(a => gear(...a)); [420, 1050, 1620].forEach(x => arm(x, 180));
    });
    const ywm = GLOW(yw, 0.8);
    k.box(0.1, 3.0, 13.2, ywm, W - 0.05, -7.9);
    k.box(1.3, 2.6, 0.12, blk, W - 0.65, -6.4);
    const kio = [[W - 0.55, -3.3], [W - 0.55, -4.6]];
    k.inst(new THREE.BoxGeometry(0.36, 1.75, 0.52), wht, kio.map(([x, z]) => [x, 0.875, z]));
    kio.forEach(([x, z]) => { k.pl(new THREE.MeshBasicMaterial({ color: 0x1c2f52 }), 0.4, 0.62, x - 0.19, 1.3, z, -Math.PI / 2); });
    const dk = [2.7, 3.6, 4.5];
    k.inst(new THREE.BoxGeometry(0.86, 0.75, 0.62), wht, dk.map(x => [x, 0.375, -8.1]));
    k.inst(new THREE.BoxGeometry(0.8, 0.45, 0.02), M(0xcfe6ff, { transparent: true, opacity: .35, roughness: .05 }), dk.map(x => [x, 0.98, -8.38]));
    k.inst(CHAIR, wht, dk.map(x => [x, 0, -7.4]));
    k.box(1.7, 0.15, 1.7, cautM, 3.6, -11.4); k.inst(new THREE.BoxGeometry(0.8, 0.75, 0.8), gls, [[3.2, 0.525, -11.0], [4.0, 0.525, -11.0], [3.2, 0.525, -11.8], [4.0, 0.525, -11.8]]);
    const tv = M(0x07080b, { roughness: .2 }), tvS = new THREE.MeshBasicMaterial({ color: 0x10141c });
    [-10.3, -12.6].forEach(z => { k.box(0.08, 0.95, 1.65, tv, W - 0.45, z, 1.15); k.box(0.06, 1.15, 0.06, tv, W - 0.45, z, 0); k.pl(tvS, 1.6, 0.9, W - 0.5, 1.62, z, -Math.PI / 2); });
    { const r = new THREE.Group(); r.position.set(2.6, 0, -12.9); g.add(r); box(0.7, 0.35, 0.5, wht, 0, 0, 0.05, r); box(0.12, 0.45, 0.12, wht, 0, 0, 0.4, r); const a = box(0.5, 0.08, 0.08, wht, 0.2, 0, 0.85, r); a.rotation.z = 0.4; }
    const posts = [[2.3, -9.4], [2.3, -10.8], [2.3, -12.2], [2.3, -13.6], [3.3, -9.4], [4.3, -9.4]];
    k.inst(new THREE.CylinderGeometry(0.03, 0.03, 0.95, 8), blk, posts.map(([x, z]) => [x, 0.475, z]));
    k.inst(new THREE.CylinderGeometry(0.16, 0.16, 0.03, 16), blk, posts.map(([x, z]) => [x, 0.015, z]));
    // 가운데 노란 · 검정 줄무늬 길 + 라바콘
    const walk = canvasTex(256, 1024, (c, w, h) => { c.fillStyle = '#0f0f11'; c.fillRect(0, 0, w, h); c.fillStyle = '#f2b51c'; for (let y = 0; y < h; y += 64) c.fillRect(0, y, w, 32); });
    k.flat(M(0xffffff, { map: walk, roughness: .7 }), 0.7, 2.2, -13.3, -2.7, 0.07);
    const coneT = canvasTex(64, 128, (c, w, h) => { c.fillStyle = '#f2b51c'; c.fillRect(0, 0, w, h); c.fillStyle = '#111'; [0.15, 0.45, 0.75].forEach(v => c.fillRect(0, v * h, w, h * .14)); });
    const cones = []; for (let z = -3.0; z > -13.4; z -= 2.1) cones.push([0.75, 0, z], [2.15, 0, z - 1.0]);
    k.inst(new THREE.ConeGeometry(0.14, 0.6, 14).translate(0, 0.34, 0), M(0xffffff, { map: coneT, roughness: .5 }), cones);
    k.inst(new THREE.BoxGeometry(0.36, 0.04, 0.36), blk, cones.map(([x, , z]) => [x, 0.02, z]));
    // Agentic IoT 스마트 팩토리 체험 배너 (윗부분은 시안 그림, 아래 4단계는 시안 글 그대로 그림)
    const agB = canvasTex(1024, 476, (c, w, h) => {
      c.fillStyle = '#0a1638'; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(80,130,220,.18)'; c.lineWidth = 1; for (let x = 0; x < w; x += 24) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); } for (let y = 0; y < h; y += 24) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
      [['1. 스마트 주문 & 분석', 'Smart Ordering & Analysis'], ['2. IoT 협업 로봇 조립', 'IoT Collaborative Assembly'], ['3. 지능형 물류 & 검수', 'Intelligent Logistics & Inspection'], ['4. 디지털 트윈 모니터링', 'Digital Twin & Control']].forEach(([a, b], i) => {
        const x = 20 + i * 250; c.fillStyle = 'rgba(40,90,190,.35)'; c.fillRect(x, 30, 230, 250); c.strokeStyle = '#3fb6ff'; c.lineWidth = 3; c.strokeRect(x + 40, 60, 150, 150);
        c.beginPath(); c.arc(x + 115, 135, 40, 0, 7); c.stroke();
        c.fillStyle = '#ffd84a'; c.font = `700 22px ${FONT}`; c.textAlign = 'center'; c.fillText(a, x + 115, 320); c.fillStyle = '#bcd4ff'; c.font = `500 15px ${FONT}`; c.fillText(b, x + 115, 348);
      });
      c.fillStyle = '#ffd84a'; c.font = `700 22px ${FONT}`; c.textAlign = 'left'; c.fillText('Agentic IoT 스마트 팩토리 체험', 24, h - 30);
    });
    const ax = 3.6, az = -14.4, aw = 3.4;
    k.box(aw + 0.1, 2.4, 0.08, blk, ax, az - 0.06, 0.15);
    k.pl(GLOW(B3('iot_agentic'), 0.95), aw, 0.72, ax, 2.15, az - 0.01);
    k.pl(GLOW(agB, 0.9), aw, 1.58, ax, 1.0, az - 0.01);
    k.inst(new THREE.BoxGeometry(0.24, 0.08, 0.14), wht, [-1.2, -0.4, 0.4, 1.2].map(o => [ax + o, 2.58, az + 0.05]));
    // ── 왼쪽: 반려식물 토양 센서 체험 (남색 긴 탁자 2줄 · 가운데 그림판 · 흰 의자) ──
    const pl = canvasTex(2048, 328, (c, w, h) => {
      c.fillStyle = '#f5efe2'; c.fillRect(0, 0, w, h); c.fillStyle = '#2b3a2a'; c.textBaseline = 'middle';
      c.font = `500 26px ${FONT}`; c.fillText('토양 센서로 알아보는 나의 반려식물 이야기', 40, 50); c.font = `900 64px ${FONT}`; c.fillText('반려식물', 40, 125); c.fillText('토양 센서 체험', 40, 200);
      c.font = `500 22px ${FONT}`; c.fillText('센서로 식물의 목소리를 듣고,', 40, 262); c.fillText('건강하게 가꾸는 법을 배워요!', 40, 292);
      ['1. 내 식물과 센서 준비', '2. 센서를 흙에 꽂기', '3. 상태 확인하기', '4. 알맞게 돌봐주기', '센서와 함께하는 똑똑한 반려식물 생활'].forEach((t, i) => {
        const x = 560 + i * 296; c.fillStyle = '#e4dccb'; c.beginPath(); c.arc(x + 130, 120, 80, 0, 7); c.fill();
        c.fillStyle = '#8a5a32'; c.fillRect(x + 100, 140, 60, 50); c.fillStyle = '#4e9a3f'; [[-30, 0], [0, -30], [30, 0]].forEach(([a, b]) => { c.beginPath(); c.ellipse(x + 130 + a, 120 + b, 26, 14, a / 40, 0, 7); c.fill(); });
        c.fillStyle = '#2b3a2a'; c.font = `700 26px ${FONT}`; c.textAlign = 'center'; c.fillText(t, x + 130, 245); c.textAlign = 'left';
      });
    });
    const plM = GLOW(pl, 0.85), tz0 = -10.6, tz1 = -15.2, tzc = (tz0 + tz1) / 2;
    k.bxz(-4.85, -4.05, tz1, tz0, 0.75, navy); k.bxz(-3.95, -3.15, tz1, tz0, 0.75, navy);
    k.box(0.06, 0.82, tz0 - tz1, blk, -4.0, tzc, 0.75);
    k.pl(plM, tz0 - tz1, 0.8, -4.04, 1.16, tzc, -Math.PI / 2); k.pl(plM, tz0 - tz1, 0.8, -3.96, 1.16, tzc, Math.PI / 2);
    const pc = []; for (let i = 0; i < 6; i++) { const z = tz0 - 0.4 - i * 0.75; pc.push([-5.25, 0, z, -Math.PI / 2], [-2.75, 0, z, Math.PI / 2]); }
    k.inst(CHAIR, wht, pc);
    // 앞 끝 검정 장 (로고 · 포스터 · 화면)
    k.box(2.4, 2.5, 0.6, gls, -4.0, -9.75);
    k.pl(GLOW(B3('iot_logo'), 0.95), 1.0, 1.0, -4.55, 1.55, -9.44);
    k.pl(GLOW(B3('iot_poster'), 0.9), 0.62, 0.9, -3.4, 1.6, -9.44);
    // 왼쪽 안: 검정 벽(노란 X 보강) · 검정 큐브 탁자 + 흰 의자
    k.bxz(-W, -W + 0.12, -D, -15.6, 3.0, blk);
    [1, -1].forEach(s => { const b = k.box(0.08, 3.6, 0.08, M(0xe6a915, { roughness: .5 }), -W + 0.17, -17.0, -0.3); b.rotation.x = s * 0.62; b.position.y = 1.5; });
    const lt = [[-4.9, -18.4], [-4.9, -19.8], [-3.6, -18.4], [-3.6, -19.8]];
    k.inst(new THREE.BoxGeometry(0.6, 0.72, 0.6), gls, lt.map(([x, z]) => [x, 0.36, z]));
    k.inst(CHAIR, wht, lt.map(([x, z]) => [x + 0.55, 0, z, Math.PI / 2]));
    // ── 가운데: 포토존 배너 (2026 CO-SHOW IoT COSS · 빨간 카펫 · 로고 세움 간판) ──
    const bz0 = -15.6, bz1 = -19.8, bzc = (bz0 + bz1) / 2, bx = 0.45;
    k.bxz(bx - 0.08, bx + 0.25, bz1, bz0, 2.65, blk);
    k.pl(GLOW(B3('iot_led'), 1.1), bz0 - bz1 - 0.1, 2.36, bx - 0.09, 1.33, bzc, -Math.PI / 2);
    k.flat(red, -1.7, bx - 0.08, bz1, bz0, 0.06);
    k.inst(new THREE.BoxGeometry(0.16, 0.06, 0.3), wht, [0.5, 1.5, 2.5, 3.5].map(o => [bx - 0.2, 2.72, bz0 - o]));
    { const q = new THREE.Group(); q.position.set(-0.9, 0, -16.6); q.rotation.y = -Math.PI / 2 + 0.25; g.add(q); box(1.9, 0.18, 0.4, blk, 0, 0, 0, q);
      const lg = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), GLOW(B3('iot_logo'), 1.0)); lg.position.set(-0.6, 0.55, 0.21); q.add(lg);
      const t = k.txt(['사물인터넷', '혁신융합대학사업단'], 1.2, 0.5, { fg: '#ffffff', size: 150 }, 1.0); t.position.set(0.35, 0.45, 0.21); q.add(t); }
    // ── 오른쪽 안: 대학 홍보 벽 3칸 (University name · 포스터 · 화면) + 검정 큐브 탁자 · 흰 의자 ──
    k.bxz(W - 0.12, W, -21.0, -14.5, 3.0, blk);
    const uName = k.txt(['University name'], 1.3, 0.3, { bg: '#f4f2ec', fg: '#222', size: 90 }, 1.0).material;
    [-15.9, -17.6, -19.3].forEach(z => {
      k.pl(uName, 1.3, 0.3, W - 0.13, 2.65, z, -Math.PI / 2);
      k.pl(GLOW(B3('iot_poster'), 0.9), 0.62, 0.92, W - 0.13, 1.75, z - 0.35, -Math.PI / 2);
      k.pl(tvS, 0.55, 0.92, W - 0.13, 1.75, z + 0.35, -Math.PI / 2);
    });
    const ut = [-15.9, -17.6, -19.3].map(z => [W - 1.15, 0.36, z]);
    k.inst(new THREE.BoxGeometry(1.2, 0.72, 0.6).rotateY(Math.PI / 2), gls, ut);
    k.inst(CHAIR, wht, [-15.9, -17.6, -19.3].flatMap(z => [[W - 0.55, 0, z - 0.3, -Math.PI / 2], [W - 0.55, 0, z + 0.3, -Math.PI / 2]]));
    // ── 맨 안쪽: 무대 (LED · 로고 · 단상 2 · 남색 탁자) + 객석 (빨간 카펫 · 회색 접이 의자) ──
    const RX = 3.4;                                                              // 오른쪽 안 대기실 왼벽 x
    k.bxz(-W, W, -D - 0.15, -D, 3.4, blk);
    k.pl(GLOW(B3('iot_led'), 1.25), 4.6, 2.6, -0.6, 2.25, -D + 0.02);
    k.box(4.8, 2.8, 0.06, M(0x050608), -0.6, -D + 0.01, 0.85);
    k.pl(GLOW(B3('iot_logo'), 1.0), 1.4, 1.4, -4.3, 2.1, -D + 0.02);
    k.bxz(-3.7, 2.5, -D, -24.6, 0.3, M(0x55575d, { roughness: .95 }));
    const acr = M(0xdfeaf5, { transparent: true, opacity: .55, roughness: .1 });
    [-2.8, 1.6].forEach(x => { k.box(0.55, 1.15, 0.45, acr, x, -25.5, 0.3); });
    k.box(1.8, 0.75, 0.7, navy, -0.6, -25.9, 0.3);
    k.inst(new THREE.BoxGeometry(0.5, 0.45, 0.4), blk, [[-3.4, 0.3, -24.9], [2.2, 0.3, -24.9], [-3.4, 0.3, -27.1], [2.2, 0.3, -27.1]]);
    k.inst(new THREE.CylinderGeometry(0.16, 0.2, 0.36, 12), blk, [[-2.0, 0.3, -24.85], [0.8, 0.3, -24.85], [-3.0, 0, -24.3], [2.1, 0, -24.3]]);
    k.flat(red, -3.7, 2.6, -24.4, -20.0, 0.06);
    k.inst(new THREE.BoxGeometry(1.8, 0.75, 0.6), navy, [-2.6, -0.6, 1.4].map(x => [x, 0.375, -23.75]));
    k.inst(CHAIR, wht, [-2.6, -0.6, 1.4].flatMap(x => [[x - 0.45, 0, -23.05], [x + 0.45, 0, -23.05]]));
    const fold = []; for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) fold.push([-3.25 + c * 0.75, 0, -22.25 + r * 0.7]);
    k.inst(CHAIR, M(0xa9aeb6, { roughness: .4, metalness: .5 }), fold);
    const sp = [-20.2, -21.4, -22.6, -23.8]; k.inst(new THREE.CylinderGeometry(0.03, 0.03, 0.95, 8), blk, sp.map(z => [2.85, 0.475, z]));
    k.box(0.02, 0.03, 3.6, M(0x222222), 2.85, -22.0, 0.9);
    // 오른쪽 안 대기실 (검정 벽 · 큰 글자 · 흰 문 · 남색 의자)
    k.bxz(RX, RX + 0.12, -D, -21.0, 3.0, blk); k.bxz(RX, W, -21.12, -21.0, 3.0, blk);
    const wt = canvasTex(2048, 360, (c, w, h) => { c.fillStyle = '#ffffff'; c.textBaseline = 'middle'; c.font = `700 130px ${FONT}`; c.fillText('사물인터넷 혁신융합대학사업단', 330, 130); c.font = `500 86px Georgia,serif`; c.fillText('IoT Convergence & Open Sharing System', 330, 265); });
    k.pl(GLOW(wt, 0.9, { transparent: true }), 5.2, 0.92, RX - 0.01, 2.05, -24.5, -Math.PI / 2);
    k.pl(GLOW(B3('iot_logo'), 1.0), 0.9, 0.9, RX - 0.01, 2.1, -22.0, -Math.PI / 2);
    k.box(0.92, 2.1, 0.04, wht, 4.3, -20.98);
    k.inst(CHAIR, navy, [-22.0, -22.8, -23.6, -24.4].map(z => [W - 0.5, 0, z, -Math.PI / 2]));
    // 벽 위 나무색 마감 줄
    const trim = M(0xb07a3a, { roughness: .6 });
    k.bxz(-W, W, -D - 0.16, -D + 0.01, 0.04, trim, 3.4); k.bxz(-W, -W + 0.13, -D, -15.6, 0.04, trim, 3.0); k.bxz(W - 0.13, W, -21.0, -14.5, 0.04, trim, 3.0);
    // 조명 (부스 자체 2개)
    k.spot([-1.5, 7.5, 3.5], [-1.5, 2.6, -1.2], 0xfff2d6, 160, 0.5);
    k.spot([-0.6, 7.8, -18.5], [-0.6, 1.0, -24.0], 0xe6eeff, 150, 0.6);
    k.pool(-1.5, -1.2, 3.6, 0xffc640, 0.35); k.pool(1.4, -8.0, 4.5, 0xffd060, 0.22); k.pool(-0.6, -22.0, 4.5, 0x9fb8ff, 0.25); k.pool(-0.6, -17.7, 2.6, 0xff5070, 0.2);
  },
});
