/* 차세대통신 부스 3D (부스시안_1027 「CO-SHOW 컨소시엄 부스 디자인_261026」 1쪽 평면 · 2쪽 3D 조감 보고 지음, 10. 27.) */
// 뒷벽 그림 3장 · COSS 판 = 2쪽 3D 조감에서 잘라 씀. 길(트랙) · 자리 = 평면도를 부스 칸에 맞춰 옮김
export default ({ THREE, M, GLOW, box, canvasTex, B3, boothKit, CHAIR }) => ({
  '차세대통신'(g, W, D, carpet, slope) {
    const k = boothKit(g, slope), fr = k.fr;
    const blk = M(0x101216, { roughness: .45 }), wht = M(0xf0f2f6, { roughness: .35, emissive: 0x50566a, emissiveIntensity: .35 });
    const wwl = M(0xf4f5f7, { roughness: .5, envMapIntensity: 0, emissive: 0xcfd3da, emissiveIntensity: .45 });
    const cyan = new THREE.MeshBasicMaterial({ color: 0x2ee6f0, toneMapped: false });
    carpet.material = M(0x3a3d44, { roughness: .9 });
    // 바닥: 회색 바탕 + 검정 길(흰 테두리) 두 고리
    const Z0 = -D, Z1 = -0.3, CW = 512, CH = 1024;
    const px = x => (x + W) / (2 * W) * CW, py = z => (z - Z0) / (Z1 - Z0) * CH, mx = m => m / (2 * W) * CW;
    const floor = canvasTex(CW, CH, c => {
      c.fillStyle = '#3d4047'; c.fillRect(0, 0, CW, CH);
      const loop = (x0, x1, z0, z1, r) => {
        const a = px(x0), b = px(x1), t = py(z0), u = py(z1), rr = mx(r);
        const path = () => { c.beginPath(); c.moveTo(a + rr, t); c.arcTo(b, t, b, u, rr); c.arcTo(b, u, a, u, rr); c.arcTo(a, u, a, t, rr); c.arcTo(a, t, b, t, rr); c.closePath(); };
        c.strokeStyle = '#e8ecf2'; c.lineWidth = mx(1.12); path(); c.stroke();
        c.strokeStyle = '#26282d'; c.lineWidth = mx(1.0); path(); c.stroke();
      };
      loop(-3.85, 3.85, -20.6, -9.9, 1.7);
      loop(-1.75, 1.75, -9.9, -0.6, 1.2);
      c.fillStyle = '#26282d'; c.fillRect(px(-2.25), py(-10.4), mx(4.5), mx(1.0));      // 두 고리 잇는 곳
      c.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < 400; i++) c.fillRect(Math.random() * CW, Math.random() * CH, 3, 3);
    });
    k.flat(M(0xffffff, { map: floor, roughness: .85, emissive: 0xffffff, emissiveMap: floor, emissiveIntensity: .22 }), -W, W, Z0, Z1, 0.05);

    // 뒷벽(운영사무국 · 창고 앞 가림벽) + 옆벽
    const BW = -23.0;
    k.bxz(-W, W, BW - 0.2, BW, 3.0, blk); k.bxz(-W, W, -D, -D + 0.2, 3.0, blk);
    [-1, 1].forEach(s => k.bxz(s * W - 0.1, s * W + 0.1, -D, -20.8, 3.0, blk));
    k.bxz(-W, W, BW - 0.25, BW + 0.05, 0.1, M(0xa8783a, { roughness: .6, emissive: 0x3a2008, emissiveIntensity: .4 }), 3.0);
    k.pl(GLOW(B3('comm_sat'), 1.1), 4.3, 1.12, -3.75, 2.2, BW + 0.01);
    k.pl(GLOW(B3('comm_vrar'), 1.1), 3.6, 1.32, 3.85, 2.2, BW + 0.01);
    k.bxz(-1.75, 1.75, BW, BW + 0.12, 1.9, blk, 1.05); k.pl(GLOW(B3('comm_pqc'), 1.25), 3.3, 1.65, 0, 2.0, BW + 0.13);
    // 이름판(나무 띠 아래 베이지 판)
    [['VR 인공위성 통신', -3.75], ['PQC 보안 디펜스', 0], ['VR/AR 상호작용', 3.85]].forEach(([t, x]) => { const m = k.txt([t], 1.5, 0.24, { bg: '#efe6d2', fg: '#222', size: 120 }, 0.9); m.position.set(x, 2.84, BW + 0.08); g.add(m); });
    // LED 위 트러스 틀
    { const tr = M(0x9aa0aa, { metalness: .6, roughness: .3 }); k.bxz(-1.8, 1.8, BW + 0.2, BW + 0.26, 0.05, tr, 3.3); [-1.8, 1.8].forEach(x => k.box(0.05, 0.4, 0.05, tr, x, BW + 0.23, 2.95)); }

    // 체험 카운터(검정 + 위 하늘빛) · VR 기기 받침
    const ctr = [], tops = [], stands = [];
    const cnt = (x, z, r = 0, w = 0.9, d = 0.6) => { ctr.push([x, 0, z, r]); tops.push([x, 0.9, z, r]); };
    cnt(-4.6, -22.5); cnt(-3.4, -22.5); cnt(-5.6, -21.5, Math.PI / 2);
    cnt(-3.6, -20.5); cnt(-2.4, -20.5); cnt(2.5, -20.5); cnt(5.6, -22.0, Math.PI / 2); cnt(5.6, -21.0, Math.PI / 2);
    [-3.6, -2.4, 2.5].forEach(x => stands.push([x, 0.9, -20.5]));
    k.inst(new THREE.BoxGeometry(0.9, 0.9, 0.6).translate(0, 0.45, 0), blk, ctr);
    k.inst(new THREE.BoxGeometry(0.92, 0.03, 0.62), cyan, tops);
    k.inst(new THREE.CylinderGeometry(0.16, 0.05, 0.28, 12).translate(0, 0.14, 0), wht, stands);
    k.inst(CHAIR, wht, [[-3.6, 0, -21.2, Math.PI], [-2.4, 0, -21.2, Math.PI], [2.5, 0, -21.2, Math.PI]]);
    // PQC: 가운데 테이블 + 비스듬한 검정 블록 2개(하늘빛 줄)
    k.box(1.4, 0.8, 0.6, blk, 0, -22.4);
    const stripe = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#0d0f14'; c.fillRect(0, 0, w, h); c.fillStyle = '#2ee6f0'; [[0.1, 0.3, 0.5], [0.45, 0.55, 0.35], [0.2, 0.8, 0.4]].forEach(([x, y, l]) => c.fillRect(x * w, y * h, l * w, 7)); });
    const stM = M(0xffffff, { map: stripe, roughness: .4, emissive: 0xffffff, emissiveMap: stripe, emissiveIntensity: .9 });
    [-1, 1].forEach(s => { const m = box(1.3, 1.1, 0.9, [blk, blk, blk, blk, stM, blk], s * 1.45, -21.8); m.rotation.y = -s * 0.6; });

    // 가운데 흰 기둥 줄(하늘빛 마디) + 흰 가림벽
    k.bxz(-0.25, 0.25, -21.4, -11.6, 1.2, wwl);
    [[-20.4, -19.6], [-17.4, -16.8], [-12.6, -11.6]].forEach(([a, b]) => k.bxz(-0.26, 0.26, a, b, 0.6, cyan, 0.3));
    k.bxz(-2.6, 2.6, -11.5, -11.3, 1.4, wwl);
    [-2.6, 2.6].forEach(x => k.bxz(x - 0.08, x + 0.08, -11.5, -10.2, 1.4, wwl));

    // COSS 판 2개 · 빨간 RC카
    const cm = GLOW(B3('comm_coss'), 1.0, { blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, side: THREE.DoubleSide });
    [-4.8, 4.8].forEach(x => { k.box(1.4, 0.25, 0.45, wht, x, -5.0); k.pl(cm, 1.6, 1.4, x, 0.97, -5.0); });
    k.box(0.35, 0.22, 0.95, M(0xc81e24, { roughness: .4, emissive: 0x500808, emissiveIntensity: .6 }), 1.95, -6.4, 0.05);

    // 앞 게이트: 말굽 고리 2개(안쪽 흰 빛 · 앞 하늘빛 선) + 가운데 「차세대통신」 머리 · 화면 · 안내데스크
    const A0 = -1.1, A1 = Math.PI + 1.1, R = 2.0, r = 1.7, GY = 1.95, GZ = -1.0;
    const arc = (R1, R2, dep) => { const s = new THREE.Shape(); s.absarc(0, 0, R1, A0, A1, false); s.absarc(0, 0, R2, A1, A0, true); return new THREE.ExtrudeGeometry(s, { depth: dep, bevelEnabled: false, curveSegments: 40 }).translate(0, 0, -dep / 2); };
    const ringG = arc(R, r, 1.2), inG = arc(r + 0.01, r - 0.03, 1.18), lnG = arc(R - 0.12, R - 0.18, 0.02);
    const inM = new THREE.MeshBasicMaterial({ color: 0xd8fbff, toneMapped: false });
    [-3.6, 3.6].forEach(x => {
      const a = new THREE.Mesh(ringG, blk); a.position.set(x, GY, GZ); fr.add(a);
      const b = new THREE.Mesh(inG, inM); b.position.set(x, GY, GZ); fr.add(b);
      const l = new THREE.Mesh(lnG, cyan); l.position.set(x, GY, GZ + 0.61); fr.add(l);
    });
    k.bxz(-1.75, 1.75, GZ - 0.5, GZ + 0.5, 1.1, blk, 2.65, fr);
    { const t = k.txt(['차세대통신'], 2.9, 0.62, { fg: '#5ff4ff', size: 220 }, 1.3); t.position.set(0, 3.2, GZ + 0.52); fr.add(t); }
    k.pl(M(0x05070b, { roughness: .2, emissive: 0x0c1a2a, emissiveIntensity: .6 }), 1.6, 0.9, 0, 2.05, GZ + 0.02, 0, fr);
    k.bxz(-0.9, 0.9, -0.95, -0.35, 1.0, blk, 0, fr); k.pl(stM, 1.8, 0.95, 0, 0.5, -0.34, 0, fr);

    // 조명
    k.spot([0, 7.5, 2.5], [0, 1.5, -1.0], 0xe6fbff, 130, 0.55); k.spot([0, 8, -14], [0, 1.5, BW], 0xdfe8ff, 150, 0.6);
    k.pool(0, -1.5, 4, 0x5fe8ff, 0.25); k.pool(0, -15, 5, 0x6f9fff, 0.15);
  },
});
