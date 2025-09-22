(() => {
  const PIXELS = 32;
  const TARGET_FPS = 12;
  const VIDEO_SRC = "nyancat.mp4";
  
  const canvas = document.getElementById('cat');
  canvas.witdh = PIXELS;
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
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      } catch (e) {

      }
    }
  }
  requestAnimationFrame(render);

  function onFirstTouch() {
    if (video.paused) video.play().catch(()=>{});
    window.removeEventListner('touchstart', onFirstTouch);

  }
  window.addEventListner('touchstart', onFirstTouch, {once:true});

  window.addEventListner('dragover', e => e.preventDefault());
  window.addEventListner('drop', e => {
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
