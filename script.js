(() => {
  const PIXELS = 32;
  const TARGET_FPS = 12;
  const VIDEO_SRC = "nyancat.mp4";
  
  const canvas = document.getElementById('cat');
  canvas.width = PIXELS;
  canvas.height = PIXELS;
  const ctx = canvas.getContext('2d', { alpha: false });

  ctx.imageSmoothingEnabled = false;

  const video = document.getElementById('vid');
  video.src = VIDEO_SRC;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;

  video.play().catch(() =>{});
  const frameInterval = 1000 / TARGET_FPS;
  let last = performance.now();

  function render(now) {
    requestAnimationFrame(render);
    const dt = now - last;
    if (dt < frameInterval) return;
    last = now - (dt % frameInterval);

    if (video.readyState >= 2 && !video.paused) {
      try {
        const tmp = document.createElement("canvas");
        tmp.width = PIXELS;
        tmp.height = PIXELS;
        const tctx = tmp.getContext("2d", { alpha: false });
        tctx.drawImage(video, 0, 0, PIXELS, PIXELS);
        const data = tctx.getImageData(0, 0, PIXELS, PIXELS).data;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cellSize = canvas.width / PIXELS;
        for (let y = 0; y < PIXELS; y++) {
          for (let x = 0; x < PIXELS; x++) {
            const idx = (y * PIXELS + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            ctx.fillStyle = `rgb(${r},${g},${b})`;

            // glow
            ctx.shadowColor = `rgba(${r},${g},${b},0.6)`;
            ctx.shadowBlur = 6;

            ctx.beginPath();
            ctx.arc(
              x * cellSize + cellSize / 2,
              y * cellSize + cellSize / 2,
              (cellSize / 2) * 0.8,
              0, Math.PI * 2
            );
            ctx.fill();
          }
        }

        ctx.shadowBlur = 0;
      } catch (e) {
        console.error(e);
      }
    }
  }
  requestAnimationFrame(render);

  function onFirstTouch() {
    if (video.paused) video.play().catch(()=>{});
    window.removeEventListener('touchstart', onFirstTouch);
  }
  window.addEventListener('touchstart', onFirstTouch, {once:true});

  window.addEventListener('dragover', e => e.preventDefault());
  window.addEventListener('drop', e => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      video.src = url;
      video.play().catch(()=>{});
      console.log(f.name);
    }
  });
})();
