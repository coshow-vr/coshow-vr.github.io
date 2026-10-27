/* ---------- 인공지능 부스 3D (시안 없음 — 전부 유나 판단, 10. 27.) ---------- */
// CO-SHOW 남색 · 하늘색 기본형: 앞 머리 간판(컨소시엄 이름 · 타일 아이콘) · 뒤 LED 벽 · 양옆 전시 테이블 · 가운데 체험 키오스크 · 뒤 상담석 · 매다는 큐브
// 쓴 정보는 컨소시엄 이름과 고유색(TILE_COL[0]) · 타일 아이콘(tiles/01.jpg)뿐. 문구 · 숫자는 넣지 않음
export default ({ THREE, M, E, GLOW, canvasTex, tex, boothKit, CHAIR, FONT, TILE_COL }) => {
  const NAME = '인공지능', COL = TILE_COL[0], TILE = 'tiles/01.jpg', NAVY = '#0b1440', SKY = '#5fc8ff';
  const rnd = (() => { let s = 11; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const pattern = (c, w, h, a) => {                                             // 점 · 선 연결 그래픽 (유나 판단)
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 70; i++) { const x = rnd() * w, y = rnd() * h; for (let j = 0; j < 2; j++) { c.strokeStyle = `rgba(120,210,255,${.12 * a})`; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (rnd() - .5) * 260, y + (rnd() - .5) * 200); c.stroke(); } c.fillStyle = `rgba(150,225,255,${(.4 + rnd() * .5) * a})`; c.beginPath(); c.arc(x, y, 2 + rnd() * 4, 0, 7); c.fill(); }
    c.globalCompositeOperation = 'source-over';
  };
  const headTex = canvasTex(2048, 256, (c, w, h) => {                           // 앞 머리 간판
    c.fillStyle = NAVY; c.fillRect(0, 0, w, h);
    const gr = c.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, COL); gr.addColorStop(1, NAVY); c.fillStyle = gr; c.fillRect(0, h - 26, w, 26);
    c.fillStyle = SKY; c.fillRect(0, 0, w, 6);
    c.fillStyle = '#fff'; c.font = `900 128px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(NAME, w / 2, h * 0.47);
  });
  const ledTex = canvasTex(1536, 640, (c, w, h) => {                            // 뒤 LED 벽 (그래픽 + 이름)
    const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#060c2a'); gr.addColorStop(0.55, NAVY); gr.addColorStop(1, COL); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    pattern(c, w, h, 1);
    c.shadowColor = SKY; c.shadowBlur = 30; c.fillStyle = '#fff'; c.font = `900 150px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(NAME, w / 2, h / 2);
  });
  const colTex = canvasTex(256, 768, (c, w, h) => {                             // 양옆 세로 LED
    const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, COL); gr.addColorStop(1, '#060c2a'); c.fillStyle = gr; c.fillRect(0, 0, w, h); pattern(c, w, h, .7);
  });
  const deskTex = canvasTex(1024, 384, (c, w, h) => {                           // 안내데스크 앞면
    c.fillStyle = COL; c.fillRect(0, 0, w, h); c.fillStyle = SKY; c.fillRect(0, h - 18, w, 18);
    c.fillStyle = '#fff'; c.font = `900 ${NAME.length > 5 ? 96 : 120}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(NAME, w / 2, h * 0.46);
  });
  const cubeTex = canvasTex(512, 512, (c, w, h) => {                            // 매다는 큐브 면
    c.fillStyle = NAVY; c.fillRect(0, 0, w, h); c.fillStyle = COL; c.fillRect(0, h * 0.68, w, h * 0.32); pattern(c, w, h * 0.68, .5);
    c.fillStyle = '#fff'; c.font = `900 ${NAME.length > 5 ? 58 : 96}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(NAME, w / 2, h * 0.84);
  });
  const scrTex = canvasTex(512, 320, (c, w, h) => { const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, NAVY); gr.addColorStop(1, COL); c.fillStyle = gr; c.fillRect(0, 0, w, h); pattern(c, w, h, .8); });

  return {
    [NAME](g, W, D, carpet, slope) {
      const k = boothKit(g, slope), fr = k.fr, colHex = new THREE.Color(COL).getHex();
      const navy = M(0x101a48, { roughness: .6 }), wht = M(0xf2f4f8, { roughness: .45 }), dark = M(0x0a0d18, { roughness: .5 });
      const sky = E(0x5fc8ff, 1.6), colE = E(colHex, 1.4), colM = M(colHex, { roughness: .6 });
      carpet.material = M(0x18245a, { roughness: .9 });
      // 가운데 통로 줄 (고유색) · 하늘색 테두리
      k.flat(colM, -1.0, 1.0, -D + 2.4, -0.9, 0.07);
      [-1.0, 1.0].forEach(x => k.flat(sky, x - 0.03, x + 0.03, -D + 2.4, -0.9, 0.075));
      // ── 앞: 기둥 2 · 머리 간판 · 타일 아이콘 (fr) ─────
      const HY = 4.0, HH = 1.0;
      [-1, 1].forEach(s => { k.box(0.5, HY, 0.5, navy, s * (W - 0.3), -0.6, 0, fr); k.box(0.06, HY, 0.52, sky, s * (W - 0.3) - s * 0.25, -0.6, 0, fr); });
      k.box(2 * W - 0.1, HH, 0.5, navy, 0, -0.6, HY, fr);
      k.pl(GLOW(headTex, 1.05), 2 * W - 0.3, HH - 0.08, 0, HY + HH / 2, -0.34, 0, fr);
      k.box(2 * W - 0.1, 0.05, 0.52, sky, 0, -0.6, HY - 0.05, fr);
      [-1, 1].forEach(s => k.pl(GLOW(tex(TILE), 1.0), 0.46, 0.86, s * (W - 0.3), 2.4, -0.34, 0, fr));   // 기둥 앞 타일 아이콘 (256 × 476)
      // ── 양옆 벽 (뒤쪽) · 세로 LED ───────────────
      const ZW = -3.2;
      [-1, 1].forEach(s => {
        const x = s * (W - 0.1);
        k.bxz(x - 0.1, x + 0.1, -D, ZW, 3.2, navy); k.bxz(x - 0.11, x + 0.11, -D, ZW, 0.05, sky, 3.15);
        k.bxz(x - 0.11, x + 0.11, -D, ZW, 0.18, colE, 2.55);
        [-7.4, -11.4].forEach(z => k.pl(GLOW(colTex, 1.0), 0.75, 2.2, x - s * 0.12, 1.3, z, -s * Math.PI / 2));
      });
      // ── 뒤 벽 · 큰 LED · 타일 아이콘 ─────────────
      k.bxz(-W, W, -D, -D + 0.25, 4.2, navy); k.bxz(-W, W, -D - 0.01, -D + 0.26, 0.05, sky, 4.15);
      const LW = 2 * W - 3.4, LH = Math.min(3.0, LW * 640 / 1536);
      k.box(LW + 0.2, LH + 0.2, 0.1, dark, 0, -D + 0.3, 2.2 - LH / 2 - 0.1); k.pl(GLOW(ledTex, 1.1), LW, LH, 0, 2.2, -D + 0.36);
      [-1, 1].forEach(s => k.pl(GLOW(tex(TILE), 1.0), 0.9, 1.67, s * (W - 0.95), 2.2, -D + 0.27));
      // ── 앞 안내데스크 ───────────────────────
      k.box(2.6, 1.05, 0.7, wht, 0, -3.0); k.box(2.7, 0.05, 0.8, sky, 0, -3.0, 1.05);
      k.pl(GLOW(deskTex, 0.95), 2.4, 0.86, 0, 0.52, -2.64);
      // ── 양옆 전시 테이블 6 (빛나는 윗판 · 모니터 · 태블릿) ──
      const tz = [-5.6, -9.4, -13.2], tabs = [], tops = [], mons = [], pads = [];
      [-1, 1].forEach(s => tz.forEach(z => { const x = s * (W - 1.15); tabs.push([x, 0.45, z]); tops.push([x, 0.92, z]); mons.push([x + s * 0.25, 1.36, z, -s * Math.PI / 2]); pads.push([x - s * 0.1, 0.95, z + 0.35, -s * Math.PI / 2]); }));
      k.inst(new THREE.BoxGeometry(0.9, 0.9, 1.5), wht, tabs);
      k.inst(new THREE.BoxGeometry(0.92, 0.04, 1.52), sky, tops);
      k.inst(new THREE.BoxGeometry(1.0, 0.6, 0.04), M(0x05070e, { emissive: colHex, emissiveIntensity: .9 }), mons);
      k.inst(new THREE.BoxGeometry(0.32, 0.02, 0.24), M(0x05070e, { emissive: 0x5fc8ff, emissiveIntensity: .7 }), pads);
      k.inst(new THREE.BoxGeometry(0.05, 0.4, 0.05), dark, mons.map(([x, , z]) => [x, 0.94, z]));
      // ── 가운데 섬: 낮은 단 + 양면 세로 키오스크 2 ─────
      { const zc = -9.4; k.box(2.4, 0.18, 1.6, wht, 0, zc); k.box(2.42, 0.03, 1.62, colE, 0, zc, 0.18);
        [-0.6, 0.6].forEach(x => { k.box(0.8, 1.9, 0.18, wht, x, zc, 0.18); [1, -1].forEach(f => k.pl(GLOW(scrTex, 1.0), 0.66, 1.1, x, 1.45, zc + f * 0.095, f > 0 ? 0 : Math.PI)); }); }
      // ── 뒤 상담석: 원탁 4 · 의자 12 · 낮은 칸막이 ─────
      { const zs = [-D + 6.6, -D + 3.6], chs = [], tbs = [];
        [-2.3, 2.3].forEach(x => zs.forEach(z => { tbs.push([x, 0, z]); [0, 2.1, 4.2].forEach(a => chs.push([x + Math.sin(a) * 0.85, 0, z + Math.cos(a) * 0.85, a + Math.PI])); }));
        k.inst(new THREE.CylinderGeometry(0.55, 0.55, 0.04, 24).translate(0, 0.74, 0), wht, tbs);
        k.inst(new THREE.CylinderGeometry(0.05, 0.05, 0.72, 8).translate(0, 0.36, 0), dark, tbs);
        k.inst(CHAIR, M(0x2a3a7a, { roughness: .6 }), chs);
        [-1, 1].forEach(s => { k.bxz(s < 0 ? -W + 0.3 : 1.1, s < 0 ? -1.1 : W - 0.3, -D + 8.36, -D + 8.44, 1.1, wht); k.bxz(s < 0 ? -W + 0.3 : 1.1, s < 0 ? -1.1 : W - 0.3, -D + 8.35, -D + 8.45, 0.04, colE, 1.1); });
        k.flat(M(0x22306e, { roughness: .9 }), -W + 0.3, W - 0.3, -D + 0.3, -D + 8.3, 0.072); }
      // ── 매다는 큐브 (고유색 · 이름) ─────────────
      k.cube(0, -8.0, 7.2, 2.4, [cubeTex], 1.1);
      // 조명 (부스 자체 2개)
      k.spot([0, 6.2, 1.5], [0, 1.0, -4.0], 0xe6eeff, 110, 0.7);
      k.spot([0, 5.5, -D + 9], [0, 1.0, -D + 2], 0xdfe8ff, 110, 0.8);
      k.pool(0, -6, 4, 0x8fd0ff, 0.3); k.pool(0, -D + 5, 4, 0x8fd0ff, 0.25);
    },
  };
};
