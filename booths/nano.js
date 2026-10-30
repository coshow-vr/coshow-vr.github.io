/* 첨단소재나노융합 부스 3D — 10. 30. 다시 지음 (플로우 「컨소시엄 전시 부스」 글 86989519 · 강주영 10. 30. 14:50 댓글 204491562 첨부 「CO-SHOW_컨소시엄_부스시안(종합)_1030.zip」 15) 폴더: 투시도 1~6 · 평면도) */
// 자리 · 크기 = 평면도를 부스 칸에 그대로 옮김(평면도 부스 비율 1 : 1.7 ≈ VR 칸 1 : 1.7, 앞선 기울기도 같음). P(X, Y) = 평면도 원본 좌표(2000 × 1125) → 부스 안 좌표
// 그림 = 시안에서 자름(_work/첨단소재_1030/build_nano2.py): 뒤 그래픽 벽(투시도4) · 왼쪽 참가대학 판(투시도5) · 오른쪽 판(투시도6) · 바닥 회로선 · START(평면도)
// 높이(옆 벽 2.7 · 뒤 벽 3.6 · 창고 2.9 m) · 판 수(왼 7 · 오 7) · 큐브 쌓기 · 데스크 앞 그림 · 시험관 · 키트는 투시도를 보고 어림한 유나 판단
// 이전 판(시안 없을 때 남색 기본형): _work/이전판/nano_v1027_시안없을때.js
export default ({ THREE, M, E, GLOW, canvasTex, tex, B3, boothKit, CHAIR, FONT, truss }) => {
  const NAME = '첨단소재나노융합';
  const P = (X, Y) => [(X - 1027) / 45.4, -(1065 - Y) / 43.2];
  const deskTex = canvasTex(1024, 384, (c, w, h) => {                            // 안내데스크 앞면 (투시도1: 「!」 원 · 파랑 점무늬 · 「첨단소재 . 나노융합」)
    const cols = ['#1a3d8f', '#cfe3fb', '#1a3d8f', '#5d9ce8', '#cfe3fb'];
    cols.forEach((cc, i) => { c.fillStyle = cc; c.fillRect(i * w / 5, 0, w / 5 + 1, h); });
    c.fillStyle = 'rgba(80,150,235,.85)';
    for (let i = 0; i < 5; i++) for (let y = 0; y < 4; y++) for (let x = 0; x < 3; x++) { if ((i + x + y) % 3 === 0) continue; c.beginPath(); c.arc(i * w / 5 + 40 + x * 62, 90 + y * 76, 20, 0, 7); c.fill(); }
    c.fillStyle = '#fff'; c.fillRect(0, 0, w, 64);
    c.fillStyle = '#0d1f4a'; c.beginPath(); c.arc(92, 170, 62, 0, 7); c.fill(); c.strokeStyle = '#fff'; c.lineWidth = 8; c.stroke();
    c.fillStyle = '#fff'; c.font = `900 96px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('!', 92, 176);
    c.fillStyle = '#0d1f4a'; c.fillRect(w * .52, 92, w * .46, 84);
    c.fillStyle = '#fff'; c.font = `800 58px ${FONT}`; c.fillText('첨단소재 . 나노융합', w * .75, 136);
  });

  return {
    [NAME](g, W, D, carpet, slope) {
      const k = boothKit(g, slope);
      carpet.material = M(0xf2f3f5, { roughness: .9, emissive: 0x9a9da4, emissiveIntensity: .6 });
      const wht = M(0xf3f4f6, { roughness: .5, emissive: 0x6e7076, emissiveIntensity: .4 });
      const blk = M(0x141416, { roughness: .45 });
      const navy = M(0x0f1d8e, { roughness: .8, emissive: 0x0a1460, emissiveIntensity: .35 });
      const steel = M(0xa8adb5, { roughness: .35, metalness: .6, emissive: 0x30343a, emissiveIntensity: .4 });
      const pic = (t, i = .55) => M(0xffffff, { map: t, roughness: .55, emissive: 0xffffff, emissiveMap: t, emissiveIntensity: i });
      const seg = (ax, az, bx, bz, w, h, m, y0 = 0) => { const q = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(bx - ax, bz - az), h, w), m); q.position.set((ax + bx) / 2, y0 + h / 2, (az + bz) / 2); q.rotation.y = -Math.atan2(bz - az, bx - ax); g.add(q); return q; };

      // ── 바닥 회로선 · START (평면도 X 718~1336 · Y 60~1090) ──
      { const [x0, z0] = P(718, 60), [x1, z1] = P(1336, 1090);
        const f = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), new THREE.MeshBasicMaterial({ map: tex('img/b3d/nano2_floor.png'), transparent: true, depthWrite: false, toneMapped: false, color: new THREE.Color().setScalar(.95) }));
        f.rotation.x = -Math.PI / 2; f.position.set((x0 + x1) / 2, 0.075, (z0 + z1) / 2); g.add(f); }

      // ── 뒤 그래픽 벽 (꺾인 3면: 평면도 왼 빗면 · 가운데 · 오른 빗면) ──
      { const pts = [P(720, 215), P(800, 140), P(1150, 140), P(1336, 215)], HB = 3.6;
        const L = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1])), T = L.reduce((a, b) => a + b, 0);
        const back = tex('img/b3d/nano2_back.jpg'); let u = 0;
        pts.slice(1).forEach(([bx, bz], i) => {
          const [ax, az] = pts[i], ang = -Math.atan2(bz - az, bx - ax);
          seg(ax, az, bx, bz, 0.16, HB, wht).position.add(new THREE.Vector3(Math.sin(ang) * -0.1, 0, Math.cos(ang) * -0.1));
          const geo = new THREE.PlaneGeometry(L[i], HB), uv = geo.attributes.uv, u1 = u + L[i] / T;
          for (let j = 0; j < uv.count; j++) uv.setXY(j, uv.getX(j) ? u1 : u, uv.getY(j) ? 0.985 : 0);
          const q = new THREE.Mesh(geo, pic(back, .75)); q.position.set((ax + bx) / 2, HB / 2, (az + bz) / 2); q.rotation.y = ang; g.add(q);
          for (let s = 0.6; s < L[i] - 0.3; s += 1.15) { const t = s / L[i]; k.box(0.26, 0.08, 0.14, wht, ax + (bx - ax) * t + Math.sin(ang) * .12, az + (bz - az) * t + Math.cos(ang) * .12, HB + 0.02); }   // 위 조명
          u = u1;
        });
        k.pool(-1.2, -19.6, 5, 0xffffff, 0.25); }

      // ── 양옆 판 벽 (왼 = 분홍 기둥 · 「참가대학」 웹디자인 판 7 / 오 = 하늘 기둥 · 「Advanced Nanomaterials」 판 7) ──
      const sideWall = (s, xIn, z0, z1, n, img, aspect, glowHex) => {
        const lw = (z0 - z1) / n, xb = xIn + s * 0.09, mg = E(glowHex, 1.7), arms = [];
        k.bxz(Math.min(xIn, xIn + s * 0.18), Math.max(xIn, xIn + s * 0.18), z1, z0, 2.7, blk);
        for (let i = 0; i <= n; i++) k.box(0.22, 2.75, 0.14, mg, xb - s * 0.04, z0 - i * lw);
        const pw = lw * 0.84, ph = pw / aspect;
        for (let i = 0; i < n; i++) {
          const zc = z0 - (i + 0.5) * lw;
          k.pl(pic(B3(img), .7), pw, ph, xIn - s * 0.01, 2.62 - ph / 2, zc, s < 0 ? Math.PI / 2 : -Math.PI / 2);
          [-.25, .25].forEach(f => arms.push([xIn - s * 0.12, 2.78, zc + f * lw]));
        }
        k.inst(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 10).rotateX(Math.PI / 2), M(0x3a3d44, { metalness: .5, roughness: .4 }), arms);
      };
      const [xl] = P(740, 0), [, zl0] = P(0, 905), [, zl1] = P(0, 225);
      const [xr] = P(1300, 0), [, zr0] = P(0, 840), [, zr1] = P(0, 225);
      sideWall(-1, xl, zl0, zl1, 7, 'nano2_mag', 1024 / 700, 0xff22dd);
      sideWall(1, xr, zr0, zr1, 7, 'nano2_cyan', 1024 / 740, 0x22e8ff);

      // ── 높은 흰 탁자 (왼 2 · 오 7, 판 앞) ──
      { const list = [[P(771, 450)[0], P(0, 450)[1]], [P(771, 712)[0], P(0, 712)[1]]], lw = (zr0 - zr1) / 7;
        for (let i = 0; i < 7; i++) list.push([xr - 0.55, zr0 - (i + 0.5) * lw]);
        const tops = [], legs = [], rails = [];
        list.forEach(([x, z]) => { tops.push([x, 1.08, z]); [[-.27, -.27], [.27, -.27], [.27, .27], [-.27, .27]].forEach(([a, b]) => legs.push([x + a, 0, z + b])); rails.push([x, 0.06, z]); });
        k.inst(new THREE.BoxGeometry(0.6, 0.04, 0.6), wht, tops);
        k.inst(new THREE.BoxGeometry(0.035, 1.08, 0.035).translate(0, 0.54, 0), wht, legs);
        k.inst(new THREE.BoxGeometry(0.58, 0.03, 0.58), wht, rails); }

      // ── 가운데 ㄷ자 탁자 2묶음 (남색 탁자보 · 노랑/파랑 매트 · 시험관 · 바깥쪽 의자) ──
      { const groups = [[250, 465, 502], [562, 785, 815]];
        const mats = { b: [], y: [] }, chairs = [], tubesP = [], tubesW = [], kits = [];
        const [ax0] = P(990, 0), [ax1] = P(1030, 0), [bx0] = P(1105, 0), [bx1] = P(1145, 0);
        groups.forEach(([y0, yb, y1], gi) => {
          const [, z0] = P(0, y0), [, zb] = P(0, yb), [, z1] = P(0, y1);
          k.bxz(ax0, ax1, z0, z1, 0.75, navy); k.bxz(bx0, bx1, z0, z1, 0.75, navy); k.bxz(ax1, bx0, zb, z1, 0.75, navy);
          const n = 6, step = (zb - z0) / n;
          for (let i = 0; i < n; i++) {
            const z = z0 + (i + 0.5) * step;
            (i % 2 ? mats.y : mats.b).push([ax0 + 0.26, 0.752, z]); ((i + gi) % 2 ? mats.b : mats.y).push([bx1 - 0.26, 0.752, z]);
            chairs.push([ax0 - 0.42, 0, z, -Math.PI / 2], [bx1 + 0.42, 0, z, Math.PI / 2]);
            if (i % 2) [ax1 - 0.12, bx0 + 0.12].forEach(x => [-.12, 0, .12].forEach((d, j) => (j === 1 ? tubesW : tubesP).push([x, 0.75, z + d])));
            if (!gi && i % 2 === 0) [ax1 - 0.14, bx0 + 0.14].forEach(x => kits.push([x, 0.75, z]));
          }
          const xm = (ax0 + bx1) / 2;
          mats.b.push([xm - 0.38, 0.752, (zb + z1) / 2]); mats.y.push([xm + 0.38, 0.752, (zb + z1) / 2]);
          chairs.push([xm - 0.38, 0, z1 + 0.42, 0], [xm + 0.38, 0, z1 + 0.42, 0]);
        });
        k.inst(new THREE.BoxGeometry(0.42, 0.006, 0.42), M(0x2a6ae6, { roughness: .6, emissive: 0x1a48b0, emissiveIntensity: .4 }), mats.b);
        k.inst(new THREE.BoxGeometry(0.42, 0.006, 0.42), M(0xf7d931, { roughness: .6, emissive: 0xb89a10, emissiveIntensity: .4 }), mats.y);
        k.inst(CHAIR, M(0x17181c, { roughness: .5 }), chairs);
        k.inst(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 10).translate(0, 0.075, 0), M(0xe23d9c, { roughness: .3, emissive: 0x801850, emissiveIntensity: .4 }), tubesP);
        k.inst(new THREE.CylinderGeometry(0.04, 0.04, 0.15, 10).translate(0, 0.075, 0), M(0xf4f4f6, { roughness: .3 }), tubesW);
        k.inst(new THREE.BoxGeometry(0.16, 0.14, 0.24).translate(0, 0.07, 0), M(0x7a6c66, { roughness: .7 }), kits); }

      // ── 앞 왼쪽: 안내데스크(ㄱ자) · 흰 의자 2 · 큐브 쌓기 ──
      { const [x0, zf] = P(745, 1035), [x1, zb] = P(875, 1010), [xr0, zr] = P(855, 980), dt = GLOW(deskTex, .95);
        k.bxz(x0, x1, zb, zf, 1.0, wht); k.bxz(xr0, x1, zr, zb, 1.0, wht); k.bxz(x0 - 0.03, x1 + 0.03, zb, zf + 0.03, 0.05, wht, 1.0); k.bxz(xr0 - 0.03, x1 + 0.03, zr - 0.03, zb, 0.05, wht, 1.0);
        k.pl(dt, x1 - x0 - 0.06, 0.9, (x0 + x1) / 2, 0.5, zf + 0.012);
        k.pl(dt, zb - zr, 0.9, x1 + 0.012, 0.5, (zb + zr) / 2, Math.PI / 2);
        k.inst(new THREE.SphereGeometry(0.26, 16, 10).scale(1, .9, 1).translate(0, 0.45, 0), wht, [P(782, 998), P(822, 998)].map(([x, z]) => [x, 0, z]));
        const [, zc] = P(0, 963), cs = 0.5, cub = [];
        const cols = [0xe0b03a, 0xe0b03a, 0xd9883a, 0x6b7380];
        [[4, 0], [3, 1], [2, 2]].forEach(([n, lv]) => { for (let i = 0; i < n; i++) cub.push([P(760, 0)[0] + cs / 2 + (i + lv * 0.5) * cs, lv * cs, zc - lv * 0.05, (i + lv) % 4]); });
        [0, 1, 2, 3].forEach(ci => { const l = cub.filter(c => c[3] === ci); if (l.length) k.inst(new THREE.BoxGeometry(cs - 0.02, cs - 0.02, cs - 0.02).translate(0, cs / 2, 0), M(cols[ci], { roughness: .95, emissive: cols[ci], emissiveIntensity: .25 }), l.map(([x, y, z]) => [x, y, z])); }); }

      // ── 앞 오른쪽: 창고(앞면 검정 · 흰 옆면 · 문 · 위 트러스) · 파랑 매트 ──
      { const [x0, zf] = P(1072, 1030), [x1, zb] = P(1335, 965), HS = 2.9;
        const box = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, HS, zf - zb), [wht, wht, M(0x2a2c30), wht, blk, wht]);
        box.position.set((x0 + x1) / 2, HS / 2, (zf + zb) / 2); g.add(box);
        k.pl(M(0xdfe1e4, { roughness: .5 }), 0.9, 2.1, x0 - 0.01, 1.05, (zf + zb) / 2, -Math.PI / 2);
        [zf, zb].forEach(z => truss(k.W(x0, HS + 0.15, z), k.W(x1, HS + 0.15, z), 0.3));
        const [mx0, mz1] = P(1137, 922), [mx1, mz0] = P(1267, 965);
        k.flat(M(0x2a5cc8, { roughness: .9, emissive: 0x16388a, emissiveIntensity: .4 }), mx0, mx1, mz1, mz0, 0.08); }

      // ── 바깥 철제 펜스 (왼쪽 벽 바깥 · 오른쪽 창고와 벽 사이) ──
      { const posts = [], rails = [], fence = (x, za, zb) => { const n = Math.max(1, Math.round(Math.abs(zb - za) / 2)); for (let i = 0; i < n; i++) { const z0 = za + (zb - za) * i / n, z1 = za + (zb - za) * (i + 1) / n; for (let j = 0; j <= 12; j++) posts.push([x, 0.08, z0 + (z1 - z0) * j / 12]); rails.push([x, 1.08, (z0 + z1) / 2, Math.abs(z1 - z0)], [x, 0.12, (z0 + z1) / 2, Math.abs(z1 - z0)]); } };
        fence(-W + 0.05, P(0, 1045)[1], zl1); fence(W - 0.05, P(0, 965)[1], zr0);
        k.inst(new THREE.CylinderGeometry(0.012, 0.012, 1.0, 6).translate(0, 0.5, 0), steel, posts);
        rails.forEach(([x, y, z, l]) => k.box(0.035, 0.035, l, steel, x, z, y)); }

      // 조명
      k.spot([1, 6.2, -6], [1, 0.8, -9.5], 0xf2f5ff, 110, 0.7);
      k.spot([1, 6.2, -13], [1, 0.8, -16], 0xf2f5ff, 110, 0.7);
      k.pool(0.9, -9.5, 4.5, 0xffffff, 0.22); k.pool(0.9, -16, 4.5, 0xffffff, 0.22);
    },
  };
};
