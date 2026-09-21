(function () {
  // URLパラメータで新郎・新婦の名前を差し替え
  try {
    const params = new URLSearchParams(window.location.search);
    const groom = (params.get('groom') || '').trim();
    const bride  = (params.get('bride')  || '').trim();
    if (groom && bride) {
      const el = document.getElementById('names');
      // innerHTML を避け、DOM操作でXSSを防ぐ
      const ampSpan = document.createElement('span');
      ampSpan.className = 'amp';
      ampSpan.textContent = '&';
      el.textContent = '';
      el.append(document.createTextNode(groom), ampSpan, document.createTextNode(bride));
    }
  } catch (_) {}

  // フラワーシャワー演出:ドレープが開く瞬間に左右の下端から花びらと葉が舞う
  const confettiColors = ['#e8836a', '#f2ab8c', '#fff7ec', '#4f8f95', '#c9a24a'];
  const confettiContainer = document.getElementById('confetti');
  const confettiCount = window.innerWidth < 480 ? 34 : 46;
  for (let c = 0; c < confettiCount; c++) {
    const piece = document.createElement('span');
    const fromLeft = c % 2 === 0;
    piece.className = 'confetti-piece' + (Math.random() < 0.4 ? ' leaf' : '');
    piece.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    piece.style[fromLeft ? 'left' : 'right'] = (Math.random() * 4) + 'vw';

    const spreadX = 26 + Math.random() * 40;   // vw
    const riseY   = 55 + Math.random() * 30;   // vh 上昇量(上方向 = 負値)
    const dropY   = 15 + Math.random() * 25;   // vh 落下量(画面外へ落ちる = 正値)
    const dir = fromLeft ? 1 : -1;

    piece.style.setProperty('--mx',   (dir * spreadX * 0.8).toFixed(0) + 'vw');
    piece.style.setProperty('--my',   (-riseY).toFixed(0) + 'vh');          // 上昇
    piece.style.setProperty('--mrot', (dir * (180 + Math.random() * 180)).toFixed(0) + 'deg');
    piece.style.setProperty('--ex',   (dir * spreadX).toFixed(0) + 'vw');
    piece.style.setProperty('--ey',   dropY.toFixed(0) + 'vh');             // 落下(画面外へ)
    piece.style.setProperty('--erot', (dir * (360 + Math.random() * 360)).toFixed(0) + 'deg');
    piece.style.animationDelay = (0.85 + Math.random() * 0.3) + 's';
    confettiContainer.appendChild(piece);
  }

  // 落下する花びら
  const petalContainer = document.getElementById('petals');
  const petalColors = ['#e8836a', '#f2ab8c', '#4f8f95'];
  const petalShapes = [
    // 涙型(先が尖り、上が丸い基本形)
    '<path d="M8,20 C2,15 0,8 3,3 C5,0.5 8,0 8,0 C8,0 11,0.5 13,3 C16,8 14,15 8,20 Z" fill="__COLOR__"/>' +
    '<path d="M8,1.5 C8,7 8,13 8,18.5" stroke="rgba(107,61,36,0.15)" stroke-width="0.7" fill="none"/>',
    // 丸みの強い、バラの花びらのような形
    '<path d="M8,19 C3,16 0,11 1.5,6 C3,1.5 8,0.5 8,0.5 C8,0.5 13,1.5 14.5,6 C16,11 13,16 8,19 Z" fill="__COLOR__"/>' +
    '<path d="M8,2 C8,7.5 8,13 8,17.5" stroke="rgba(107,61,36,0.13)" stroke-width="0.8" fill="none"/>',
    // 細長い、ユリのような形
    '<path d="M8,20 C4,16 2,10 4,4 C5.5,1 8,0 8,0 C8,0 10.5,1 12,4 C14,10 12,16 8,20 Z" fill="__COLOR__"/>' +
    '<path d="M8,1 C8,7 8,13 8,19" stroke="rgba(107,61,36,0.14)" stroke-width="0.6" fill="none"/>',
    // 左右非対称の、風でよじれたような形
    '<path d="M8,19.5 C3,15 -0.5,9 2,4 C4,0.5 9,0 10.5,2 C13,5 15,11 12,15.5 C10.5,18 9,19 8,19.5 Z" fill="__COLOR__"/>' +
    '<path d="M7.5,2 C8,7.5 8.5,13 8,18" stroke="rgba(107,61,36,0.14)" stroke-width="0.7" fill="none"/>',
  ];
  const svgOpen  = '<svg viewBox="0 0 16 20" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">';
  const svgClose = '</svg>';
  const rand = (min, max) => Math.random() * (max - min) + min;
  const petalCount = window.innerWidth < 480 ? 18 : 24;
  const avgDuration = 11.5;
  const slot = avgDuration / petalCount;

  for (let i = 0; i < petalCount; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];
    const shape = petalShapes[Math.floor(Math.random() * petalShapes.length)];
    p.innerHTML = svgOpen + shape.replace('__COLOR__', color) + svgClose;

    const duration = 9 + Math.random() * 5;                   // 9〜14s
    const delay    = -(i * slot + Math.random() * slot);       // 均等割り+わずかなズレ
    const scale    = 0.6 + Math.random() * 0.7;               // 0.6〜1.3
    const spin     = Math.random() < 0.5 ? 1 : -1;

    p.style.left = (Math.random() * 100) + '%';
    p.style.setProperty('--scale', scale.toFixed(2));
    p.style.animationDuration = duration + 's';
    p.style.animationDelay    = delay + 's';

    p.style.setProperty('--startZ', rand(0, 360).toFixed(0) + 'deg');
    p.style.setProperty('--startY', rand(0, 360).toFixed(0) + 'deg');
    p.style.setProperty('--mx',     rand(-50, 50).toFixed(0) + 'px');
    p.style.setProperty('--ex',     rand(-70, 70).toFixed(0) + 'px');
    p.style.setProperty('--my',     (rand(140, 240) * spin).toFixed(0) + 'deg');
    p.style.setProperty('--ey',     (rand(320, 460) * spin).toFixed(0) + 'deg');
    p.style.setProperty('--peak',   rand(0.6, 0.9).toFixed(2));
    p.style.setProperty('--fade',   rand(0.3, 0.5).toFixed(2));

    petalContainer.appendChild(p);
  }

  // イラスト周りにきらめきを散らす
  const sparkleBox = document.getElementById('sparkles');
  if (sparkleBox) {
    const sparkleSpots = [
      { top: '6%',  left: '12%' }, { top: '14%', left: '86%' },
      { top: '70%', left: '4%'  }, { top: '82%', left: '90%' },
      { top: '2%',  left: '55%' }, { top: '90%', left: '50%' },
    ];
    for (const spot of sparkleSpots) {
      const sp = document.createElement('span');
      sp.className = 'sparkle';
      sp.textContent = '✦';
      sp.style.top  = spot.top;
      sp.style.left = spot.left;
      sp.style.animationDuration = (2.2 + Math.random() * 1.6) + 's';
      sp.style.animationDelay    = (Math.random() * 3) + 's';
      sparkleBox.appendChild(sp);
    }
  }
})();
