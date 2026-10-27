/* ---------- 빅데이터 부스 3D (부스시안_1027 bigdata_01 앞 · 02 우측 · 03 좌측 = 원본 PDF 3장 보고 지음, 10. 27.) ---------- */
// 「FOREST OF BIGDATA」: 덩굴 덮인 퍼걸러 기둥 · 지붕 트러스 + 흰 천 · 앞 나무 아치 · 곡선 나무 안내데스크 · 나무 · 이끼 언덕 · COSS 청록 네온
export default ({ THREE, M, E, GLOW, box, canvasTex, boothKit, CHAIR, FONT, truss }) => {
  const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();   // 늘 같은 배치
  const woodTex = canvasTex(256, 256, (c, w, h) => {                            // 짙은 나뭇결
    c.fillStyle = '#6b4429'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { c.strokeStyle = `rgba(${90 + rnd() * 50},${55 + rnd() * 30},${30 + rnd() * 20},.5)`; c.lineWidth = 1 + rnd() * 3; const x = rnd() * w; c.beginPath(); c.moveTo(x, 0); c.bezierCurveTo(x + 8, h * .3, x - 8, h * .7, x + 4, h); c.stroke(); }
  });
  woodTex.wrapS = woodTex.wrapT = THREE.RepeatWrapping;
  const lightWood = canvasTex(256, 256, (c, w, h) => { c.fillStyle = '#b08a64'; c.fillRect(0, 0, w, h); for (let i = 0; i < 50; i++) { c.strokeStyle = `rgba(120,85,55,${0.2 + rnd() * 0.3})`; c.lineWidth = 1 + rnd() * 2; const y = rnd() * h; c.beginPath(); c.moveTo(0, y); c.lineTo(w, y + rnd() * 6 - 3); c.stroke(); } });
  lightWood.wrapS = lightWood.wrapT = THREE.RepeatWrapping;
  const vineTex = canvasTex(256, 256, (c, w, h) => {                            // 덩굴 잎 (투명 바탕)
    for (let i = 0; i < 520; i++) { const x = rnd() * w, y = rnd() * h, g = 70 + rnd() * 90; c.fillStyle = `rgb(${g * 0.35},${g},${g * 0.4})`; c.beginPath(); c.ellipse(x, y, 4 + rnd() * 5, 2 + rnd() * 3, rnd() * 3, 0, 7); c.fill(); }
  });
  vineTex.wrapS = vineTex.wrapT = THREE.RepeatWrapping;
  const bandTex = canvasTex(2048, 96, (c, w, h) => {                            // 아치 위 띠 글자
    c.fillStyle = '#3a2416'; c.fillRect(0, 0, w, h); c.fillStyle = '#e9dcc4'; c.font = `700 40px ${FONT}`; c.textBaseline = 'middle';
    const tw = c.measureText('FOREST OF BIGDATA').width + 70; for (let x = 20; x + tw - 70 < w; x += tw) c.fillText('FOREST OF BIGDATA', x, h / 2);
  });
  const deskTex = canvasTex(1024, 160, (c, w, h) => {                           // 곡선 데스크 앞면
    c.fillStyle = '#b08a64'; c.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(120,85,55,${rnd() * 0.25})`; c.fillRect(0, rnd() * h, w, 1 + rnd() * 2); }
    c.fillStyle = '#efe6d6'; c.font = `800 46px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('FOREST OF BIGDATA', w * 0.4, h * 0.45);
  });
  const neonTex = canvasTex(512, 420, (c, w, h) => {                            // COSS 청록 네온 (선 그림)
    c.shadowColor = '#3fffe8'; c.shadowBlur = 18; c.strokeStyle = '#5ff6e6'; c.lineWidth = 6; c.lineJoin = 'round';
    c.beginPath(); c.ellipse(w / 2, h * 0.5, w * 0.36, h * 0.27, -0.25, 0, 7); c.stroke();
    c.beginPath(); c.moveTo(w * 0.08, h * 0.22); c.lineTo(w * 0.92, h * 0.12); c.moveTo(w * 0.2, h * 0.3); c.lineTo(w * 0.34, h * 0.14); c.moveTo(w * 0.7, h * 0.2); c.lineTo(w * 0.86, h * 0.3); c.stroke();
    c.font = `900 120px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineWidth = 5; c.strokeText('COSS', w / 2, h * 0.55);
    c.fillStyle = '#7ffff0'; c.font = `700 40px ${FONT}`; c.fillText('빅데이터', w / 2, h * 0.86);
  });
  const dataTex = canvasTex(1024, 420, (c, w, h) => {                           // 뒷벽 화면 (짙은 초록 데이터 숲 그래픽)
    const gr = c.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#04241e'); gr.addColorStop(1, '#0a4a3a'); c.fillStyle = gr; c.fillRect(0, 0, w, h);
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 26; i++) { const x = rnd() * w, y0 = h, y1 = h * (0.2 + rnd() * 0.5); c.strokeStyle = 'rgba(80,255,190,.35)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke(); for (let j = 0; j < 5; j++) { const y = y1 + rnd() * (y0 - y1); c.beginPath(); c.moveTo(x, y); c.lineTo(x + (rnd() - .5) * 120, y - 40 - rnd() * 40); c.stroke(); } }
    for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(120,255,210,${rnd()})`; c.beginPath(); c.arc(rnd() * w, rnd() * h, 1 + rnd() * 3, 0, 7); c.fill(); }
    c.globalCompositeOperation = 'source-over';
  });

  return {
    '빅데이터'(g, W, D, carpet, slope) {
      const k = boothKit(g, slope), fr = k.fr;
      const steel = M(0x2a2c30, { roughness: .5, metalness: .4 }), wood = M(0xffffff, { map: woodTex, roughness: .7 }), lw = M(0xffffff, { map: lightWood, roughness: .7 });
      const vine = M(0xffffff, { map: vineTex, alphaTest: .45, side: THREE.DoubleSide, roughness: .9, emissive: 0x0d2a12, emissiveIntensity: .6 });
      const leaf = M(0x6f9a5a, { roughness: .9, flatShading: true, emissive: 0x1d3a17, emissiveIntensity: .8 }), leaf2 = M(0x9aa595, { roughness: .9, flatShading: true, emissive: 0x262c25, emissiveIntensity: .8 }), moss = M(0x8fae2a, { roughness: 1, emissive: 0x2a3a08, emissiveIntensity: .6 });
      const stone = M(0xb9bcbf, { roughness: .9 }), wht = M(0xf3f4f6, { roughness: .5 });
      carpet.material = M(0xd9dcdf, { roughness: .9 });                       // 흰 바닥 (시안)
      const PH = 4.4, TY = 4.75;                                               // 퍼걸러 높이 · 지붕 트러스 가운데 높이
      // ── 퍼걸러: 양옆 기둥 줄 · 위 보 · 덩굴 ─────────
      const ZP = [-1.2, -5.6, -10.0, -14.4, -18.8, -D + 0.25], posts = [], vposts = [];
      [-1, 1].forEach(s => {
        const x = s * (W - 0.2);
        ZP.forEach(z => { posts.push([x, PH / 2, z]); vposts.push([x, PH / 2, z]); });
        k.bxz(x - 0.18, x + 0.18, -D + 0.07, ZP[0] + 0.18, 0.3, steel, PH - 0.3);
        k.bxz(x - 0.26, x + 0.26, -D + 0.07, ZP[0] + 0.18, 0.5, vine, PH - 0.4);
        k.pl(vine, D + ZP[0], 0.9, x - s * 0.27, PH - 0.7, (ZP[0] - D) / 2, Math.PI / 2);   // 늘어진 덩굴
      });
      [-3.6, -1.2, 1.2, 3.6].forEach(x => { posts.push([x, PH / 2, -D + 0.25]); vposts.push([x, PH / 2, -D + 0.25]); });
      k.inst(new THREE.BoxGeometry(0.3, PH, 0.3), steel, posts);
      k.inst(new THREE.BoxGeometry(0.48, PH - 0.3, 0.48), vine, vposts);
      k.bxz(-W + 0.2, W - 0.2, -D + 0.1, -D + 0.4, 0.3, steel, PH - 0.3); k.bxz(-W + 0.2, W - 0.2, -D + 0.02, -D + 0.48, 0.5, vine, PH - 0.4);
      // 지붕: 둘레 · 가로 트러스 + 흰 천
      const TZ = [ZP[0], -6.6, -12.4, -18.2, -D + 0.25], tx = W - 0.2;
      [-1, 1].forEach(s => truss(k.W(s * tx, TY, TZ[0]), k.W(s * tx, TY, TZ[4]), 0.4));
      TZ.forEach(z => truss(k.W(-tx, TY, z), k.W(tx, TY, z), 0.4));
      const cloth = M(0xc9cdd2, { roughness: 1, side: THREE.DoubleSide, transparent: true, opacity: .42, depthWrite: false, emissive: 0x15181c, emissiveIntensity: .5 });
      for (let i = 0; i < 4; i++) { const p = k.flat(cloth, -tx, tx, TZ[i + 1] + 0.2, TZ[i] - 0.2, TY + 0.22); }
      // ── 앞: 나무 아치 (fr) · 띠 글자 · 양옆 퍼걸러 앞틀 ─────
      { const sh = new THREE.Shape(), aw = 3.6, ow = 2.8, oh = 4.0, r = 1.0, ah = 5.0;
        sh.moveTo(-aw, 0); sh.lineTo(-ow, 0); sh.lineTo(-ow, oh - r); sh.absarc(-ow + r, oh - r, r, Math.PI, Math.PI / 2, true); sh.lineTo(ow - r, oh); sh.absarc(ow - r, oh - r, r, Math.PI / 2, 0, true); sh.lineTo(ow, 0); sh.lineTo(aw, 0); sh.lineTo(aw, ah); sh.lineTo(-aw, ah); sh.closePath();
        const geo = new THREE.ExtrudeGeometry(sh, { depth: 0.6, bevelEnabled: false }); geo.translate(0, 0, -0.75);
        const wm = M(0xffffff, { map: woodTex.clone(), roughness: .7, emissive: 0x2a1a0e, emissiveIntensity: .5 }); wm.map.repeat.set(0.35, 0.35); wm.map.needsUpdate = true;
        fr.add(new THREE.Mesh(geo, wm));
        k.pl(GLOW(bandTex, 0.85), 2 * aw - 0.3, 0.32, 0, oh + 0.42, -0.14, 0, fr);
        [-1, 1].forEach(s => { const p = k.pl(GLOW(bandTex, 0.85), oh - 0.3, 0.26, s * (ow + 0.4), (oh - 0.3) / 2 + 0.15, -0.14, 0, fr); p.rotation.z = Math.PI / 2; });
        const vh = k.pl(vine, 2 * ow - 0.2, 1.0, 0, oh - 0.5, -0.45, 0, fr);   // 아치 안 늘어진 덩굴
        [-1, 1].forEach(s => {                                                 // 양옆 앞틀 (기둥 · 보 · 덩굴)
          const x0 = s * aw, x1 = s * (W - 0.2), xm = (x0 + x1) / 2, L = Math.abs(x1 - x0);
          k.box(L, 0.3, 0.3, steel, xm, -0.6, PH - 0.3, fr); k.box(L, 0.5, 0.45, vine, xm, -0.6, PH - 0.4, fr);
          k.pl(vine, L, 0.8, xm, PH - 0.75, -0.6, 0, fr);
          k.box(L - 0.4, 0.4, 0.5, wood, xm, -0.6, 0, fr);                      // 앞 나무 화분 상자
        });
      }
      // ── 곡선 나무 안내데스크 · 둥근 나무 기둥 ─────────
      { const cx = -0.6, cz = -6.4, r0 = 1.9, r1 = 2.4, t0 = -1.15, tl = 2.3, h = 1.0;
        const out = new THREE.Mesh(new THREE.CylinderGeometry(r1, r1, h, 40, 1, true, t0, tl), M(0xffffff, { map: deskTex, roughness: .7 })); out.position.set(cx, h / 2, cz); g.add(out);
        const inn = new THREE.Mesh(new THREE.CylinderGeometry(r0, r0, h, 40, 1, true, t0, tl), M(0xffffff, { map: lightWood, roughness: .7, side: THREE.BackSide })); inn.position.set(cx, h / 2, cz); g.add(inn);
        const top = new THREE.Mesh(new THREE.RingGeometry(r0 - 0.05, r1 + 0.05, 40, 1, t0 - Math.PI / 2, tl), M(0xf0ece4, { roughness: .4, side: THREE.DoubleSide })); top.rotation.x = -Math.PI / 2; top.position.set(cx, h + 0.01, cz); g.add(top);
        [t0, t0 + tl].forEach(t => { const m = k.box(r1 - r0, h, 0.06, lw, cx + Math.sin(t) * (r0 + r1) / 2, cz + Math.cos(t) * (r0 + r1) / 2); m.rotation.y = t + Math.PI / 2; });
        const pl = []; for (let i = 0; i < 9; i++) { const t = t0 + 0.2 + i * (tl - 0.4) / 8, rr = (r0 + r1) / 2; pl.push([cx + Math.sin(t) * rr, h + 0.12, cz + Math.cos(t) * rr]); }
        k.inst(new THREE.IcosahedronGeometry(0.2, 0), leaf, pl);
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 1.5, 24), wood); col.position.set(cx + Math.sin(t0) * 2.15 - 0.4, 0.75, cz + Math.cos(t0) * 2.15); g.add(col);
        k.inst(CHAIR, M(0x3a3f4a), [[cx - 0.5, 0, cz + 0.6, Math.PI], [cx + 0.5, 0, cz + 0.6, Math.PI]]);
      }
      // 「FOREST OF BIGDATA」 매단 흰 글자 (지붕 트러스에 줄로)
      { const t = k.txt(['FOREST OF BIGDATA'], 5.2, 0.6, { fg: '#f4f6f8', size: 200 }, 0.9); t.position.set(0, 2.9, -10.2); g.add(t);
        [-2.2, 2.2].forEach(x => k.box(0.015, TY - 3.2, 0.015, steel, x, -10.2, 3.2)); }
      // ── 나무 · 덤불 · 풀 · 돌 · 이끼 언덕 ───────────
      const trees = [[-5.4, -4.6], [-2.4, -12.6], [-5.6, -13.4], [2.8, -15.0], [5.4, -9.0], [-4.6, -20.4], [1.6, -20.6], [5.2, -17.8], [-1.2, -16.6], [4.6, -1.8], [-4.8, -1.6]];
      k.inst(new THREE.CylinderGeometry(0.06, 0.09, 2.0, 6).translate(0, 1.0, 0), M(0x5a4636), trees.map(([x, z]) => [x, 0, z]));
      const crown = new THREE.IcosahedronGeometry(0.95, 1).scale(1, 0.9, 1);
      k.inst(crown, leaf2, trees.filter((_, i) => i % 2).map(([x, z]) => [x, 2.55, z, rnd() * 3]));
      k.inst(crown, leaf, trees.filter((_, i) => !(i % 2)).map(([x, z]) => [x, 2.55, z, rnd() * 3]));
      const bush = [], grass = [], st = [];
      trees.forEach(([x, z]) => { for (let i = 0; i < 3; i++) bush.push([x + (rnd() - .5) * 1.4, 0.18, z + (rnd() - .5) * 1.4, rnd() * 3]); for (let i = 0; i < 4; i++) grass.push([x + (rnd() - .5) * 1.8, 0.3, z + (rnd() - .5) * 1.8, rnd() * 3]); st.push([x + 0.7, 0.18, z - 0.5]); });
      for (let i = 0; i < 18; i++) { const x = (i % 2 ? 1 : -1) * (3.9 + rnd() * 2.7); grass.push([x, 0.7, k.fz(x) - 0.6 + (rnd() - .5) * 0.2, rnd() * 3]); }
      k.inst(new THREE.IcosahedronGeometry(0.32, 0).scale(1, 0.7, 1), leaf, bush);
      k.inst(new THREE.ConeGeometry(0.14, 0.6, 5), M(0xb7c49a, { roughness: 1, emissive: 0x3a4430, emissiveIntensity: .7 }), grass.map(([x, y, z, r]) => [x, y, z, r]));
      k.inst(new THREE.SphereGeometry(0.2, 10, 8), stone, st);
      [[1.8, -9.0, 1.3], [-3.6, -3.4, 1.0], [3.0, -6.2, 0.8]].forEach(([x, z, r]) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), moss); m.scale.set(1, 0.55, 0.8); m.position.set(x, 0.04, z); g.add(m); });
      // ── 앞 양쪽 칸: COSS 청록 네온 ───────────────
      [-1, 1].forEach(s => k.pl(GLOW(neonTex, 1.25, { transparent: true, depthWrite: false }), 1.9, 1.56, s * 5.3, 1.7, k.fz(s * 5.3) - 2.0));
      // 오른쪽 앞: 계단식 청록 화면 진열대
      { const tw = M(0xe9ebee, { roughness: .5 }), scr = E(0x33d6c8, 1.4);
        for (let i = 0; i < 5; i++) { const z = -2.9 - i * 0.42, h = 0.35 + i * 0.38; k.box(1.1, h, 0.42, tw, W - 1.05, z); const p = k.box(0.9, 0.02, 0.3, scr, W - 1.05, z + 0.02, h); p.rotation.x = 0.35; } }
      // 오른쪽 가운데: 나무 선반 (자료 상자)
      { const bx = [], sx = W - 0.65;
        [-6.4, -9.0, -11.6].forEach(z => {
          k.box(0.5, 2.1, 2.4, lw, sx, z); [0.45, 1.05, 1.65].forEach(y => { for (let i = 0; i < 6; i++) bx.push([sx - 0.02, y, z - 1.0 + i * 0.4]); });
        });
        k.inst(new THREE.BoxGeometry(0.42, 0.42, 0.34).translate(0, 0.21, 0), M(0xd8c9ae, { roughness: .8 }), bx); }
      // 왼쪽 가운데: 원탁 · 접이의자 / 흰 키오스크 2
      { const tb = [[-4.6, -7.0], [-4.4, -9.6]], chs = [];
        tb.forEach(([x, z]) => { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.04, 20), lw); t.position.set(x, 0.74, z); g.add(t); k.box(0.06, 0.72, 0.06, steel, x, z); chs.push([x - 0.75, 0, z, -Math.PI / 2], [x + 0.75, 0, z, Math.PI / 2]); });
        k.inst(CHAIR, M(0xcfd2d6, { roughness: .5 }), chs);
        [[-2.6, -14.6], [-1.4, -14.6]].forEach(([x, z]) => { k.box(0.6, 1.9, 0.35, wht, x, z); k.pl(M(0x05070b, { emissive: 0x1f6a7a, emissiveIntensity: .8 }), 0.48, 0.8, x, 1.3, z + 0.18); }); }
      // 왼쪽 앞: 초록 빈백
      k.beans([[-4.2, -2.6], [-5.6, -3.2]], moss);
      // ── 뒤: 창고 2칸 · 짙은 초록 화면 ───────────────
      const gry = M(0xb7babd, { roughness: .7 });
      [-1, 1].forEach(s => k.bxz(s < 0 ? -W + 0.4 : W - 3.2, s < 0 ? -W + 3.2 : W - 0.4, -D + 0.5, -D + 3.6, 3.3, gry));
      k.box(3.5, 2.9, 0.2, M(0x0a0c10), 0, -D + 0.6, 0.2); k.pl(GLOW(dataTex, 1.0), 3.3, 2.6, 0, 1.65, -D + 0.71);
      // 조명 (부스 자체 2개)
      k.spot([0, 4.5, 2.5], [0, 1.0, -4.0], 0xfff2e0, 110, 0.7);
      k.spot([0, 4.6, -9], [0, 0, -13], 0xf2f6ff, 110, 0.9);
      k.pool(-0.6, -5.2, 3.2, 0xffe6c0, 0.3); k.pool(0, -12, 5, 0xd8f0e0, 0.25); k.pool(0, -D + 2.5, 3.5, 0x6fffd0, 0.2);
    },
  };
};
