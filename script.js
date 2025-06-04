// Play/Pause both videos in a row
function togglePlay(id1, id2) {
  const v1 = document.getElementById(id1);
  const v2 = document.getElementById(id2);
  if (v1.paused || v2.paused) {
    v1.play();
    v2.play();
  } else {
    v1.pause();
    v2.pause();
  }
}

// Highlight cell if volume threshold is exceeded
function monitorVolume(videoId, cellId) {
  const video = document.getElementById(videoId);
  const cell = document.getElementById(cellId);
  if (!video) return;

  // Prevent duplicate AudioContext on each call
  let audioCtx, analyser, source, dataArray;

  function setupAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      try {
        source = audioCtx.createMediaElementSource(video);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
      } catch (e) {
        // Prevent multiple source errors
        return;
      }
    }
  }

  function checkVolume() {
    analyser.getByteFrequencyData(dataArray);
    const volume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    if (volume > 5) {
      cell.classList.add('highlight');
    } else {
      cell.classList.remove('highlight');
    }
    requestAnimationFrame(checkVolume);
  }

  video.addEventListener('play', () => {
    setupAudio();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    checkVolume();
  });
}

// Synchronize displayed sentences with video time
function setupSentences(videoId) {
  const video = document.getElementById(videoId);
  if (!video) return;
  const display = document.getElementById('sentence-display-' + videoId);
  if (!display) return;
  const spans = document.querySelectorAll(`#hidden-sentences-${videoId} span`);
  if (!spans.length) return;
  // track last shown span index to detect new subtitle
  let lastSpanIndex = -1;

  // initial display for captions starting at or before 0
  spans.forEach(span => {
    if (parseFloat(span.dataset.start) <= 0) {
      display.textContent = span.textContent;
      display.classList.add('show');
    }
  });

  video.addEventListener('timeupdate', () => {
    const currentTime = video.currentTime;
    let found = false;
    let foundIndex = -1;
    spans.forEach((span, idx) => {
      const start = parseFloat(span.dataset.start);
      const end = parseFloat(span.dataset.end);
      if (currentTime >= start && currentTime < end) {
        foundIndex = idx;
        display.textContent = span.textContent;
        display.classList.add('show');
        found = true;
      }
    });
    if (!found) {
      display.classList.remove('show');
      lastSpanIndex = -1;
    } else if (foundIndex !== lastSpanIndex) {
      // only pause for new subtitles that start after time 0
      const newSpan = spans[foundIndex];
      const startTime = parseFloat(newSpan.dataset.start);
      if (startTime > 0) {
        video.pause();
        const pairId = videoId.replace('-v', '-a');
        const paired = document.getElementById(pairId);
        if (paired) paired.pause();
        // animate the timeline marker at this timestamp
        const timeline = document.getElementById('timeline-' + videoId);
        if (timeline) {
          const marker = timeline.querySelector(`.timeline-marker[data-start='${startTime}']`);
          if (marker) {
            marker.classList.add('active');
            setTimeout(() => marker.classList.remove('active'), 600);
          }
        }
      }
      lastSpanIndex = foundIndex;
    }
  });
}

// Add synchronized timeline seeking for paired videos
function setupTimelineSync(id1, id2, timelineId) {
  const video1 = document.getElementById(id1);
  const video2 = document.getElementById(id2);
  const timeline = document.getElementById(timelineId);
  if (!video1 || !video2 || !timeline) return;
  const bar = timeline.querySelector('.timeline-bar');
  const pointer = timeline.querySelector('.timeline-pointer');
  // remove existing background click handlers
  // let isDragging = false;
  // timeline.addEventListener('mousedown', e => { isDragging = true; seek(e); });
  // document.addEventListener('mousemove', e => { if (isDragging) seek(e); });
  // document.addEventListener('mouseup', () => { if (isDragging) isDragging = false; });
  // timeline background is not clickable

  function updatePointer(fraction) {
    pointer.style.left = (fraction * 100) + '%';
    bar.style.width = (fraction * 100) + '%';
  }

  function seekTo(time) {
    video1.currentTime = time;
    video2.currentTime = time;
    updatePointer(time / (video1.duration || 1));
  }

  // Smooth pointer update via RAF instead of timeupdate
  let rafId;
  function animatePointer() {
    const frac = (video1.currentTime / (video1.duration || 1));
    updatePointer(frac);
    rafId = requestAnimationFrame(animatePointer);
  }
  video1.addEventListener('play', () => animatePointer());
  video1.addEventListener('pause', () => cancelAnimationFrame(rafId));

  // render clickable markers for each data-start timestamp
  video1.addEventListener('loadedmetadata', () => {
    const duration = video1.duration || 1;
    const spans = document.querySelectorAll(`#hidden-sentences-${id1} span`);
    spans.forEach(span => {
      const start = parseFloat(span.dataset.start);
      if (isNaN(start) || start < 0 || start > duration) return;
      const frac = start / duration;
      const marker = document.createElement('div');
      marker.classList.add('timeline-marker');
      marker.style.left = (frac * 100) + '%';
      marker.dataset.start = start;  // added dataset for delegation
      // individual click handler retained
      marker.addEventListener('click', e => {
        e.stopPropagation();
        seekTo(start);
      });
      timeline.appendChild(marker);
    });
    // Delegate clicks on timeline markers to seek videos
    timeline.addEventListener('click', e => {
      if (e.target.classList.contains('timeline-marker')) {
        const time = parseFloat(e.target.dataset.start);
        if (!isNaN(time)) seekTo(time);
      }
    });
  });
}

// Platform dropdown logic
document.addEventListener('DOMContentLoaded', function() {
  // Disable preloading for all videos initially
  document.querySelectorAll('video').forEach(v => v.preload = 'none');

  // Platform selector logic
  document.querySelectorAll('.platform-card').forEach(card => {
    card.addEventListener('click', function() {
      // Remove active from all
      document.querySelectorAll('.platform-card').forEach(c => c.classList.remove('active'));
      // Hide all platform attacks
      document.querySelectorAll('.platform-attacks').forEach(pa => pa.classList.remove('show'));
      // Activate clicked
      card.classList.add('active');
      const platform = card.dataset.platform;
      const platformAttacks = document.querySelector('.platform-' + platform + '-attacks');
      if(platformAttacks) platformAttacks.classList.add('show');
    });
  });

  // After toggling and before play, load videos on hover
  document.querySelectorAll('.controls button').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      // extract video IDs from inline onclick
      const onclick = btn.getAttribute('onclick');
      const match = onclick && onclick.match(/togglePlay\(['"](.*?)['"],\s*['"](.*?)['"]\)/);
      if (match) {
        [match[1], match[2]].forEach(id => {
          const vid = document.getElementById(id);
          if (vid && vid.preload === 'none') {
            vid.preload = 'auto';
            vid.load();
          }
        });
      }
    });
  });

  // Helper: load video if not already loaded
  function loadVideoIfNeeded(vid) {
    if (vid && vid.preload === 'none') {
      vid.preload = 'auto';
      vid.load();
    }
  }

  // Load videos on play button hover or click
  document.querySelectorAll('.controls button').forEach(btn => {
    const onclick = btn.getAttribute('onclick');
    const match = onclick && onclick.match(/togglePlay\(['"](.*?)['"],\s*['"](.*?)['"]\)/);
    if (match) {
      const v1 = document.getElementById(match[1]);
      const v2 = document.getElementById(match[2]);
      btn.addEventListener('mouseenter', () => {
        loadVideoIfNeeded(v1);
        loadVideoIfNeeded(v2);
      });
      btn.addEventListener('click', () => {
        loadVideoIfNeeded(v1);
        loadVideoIfNeeded(v2);
      });
    }
  });

  // Load videos on timeline or caption hover/click
  document.querySelectorAll('.timeline, .sentence-display').forEach(el => {
    el.addEventListener('mouseenter', () => {
      // Try to extract video IDs from parent context
      let timelineId = el.id || (el.classList.contains('timeline') && el.parentElement && el.parentElement.querySelector('video')?.id);
      let videoId = null, audioId = null;
      if (timelineId && timelineId.startsWith('timeline-')) {
        videoId = timelineId.replace('timeline-', '');
        audioId = videoId.replace('-v', '-a');
      } else if (el.classList.contains('sentence-display')) {
        const sid = el.id.replace('sentence-display-', '');
        videoId = sid;
        audioId = sid.replace('-v', '-a');
      }
      loadVideoIfNeeded(document.getElementById(videoId));
      loadVideoIfNeeded(document.getElementById(audioId));
    });
    el.addEventListener('click', (e) => {
      // Same as above
      let timelineId = el.id || (el.classList.contains('timeline') && el.parentElement && el.parentElement.querySelector('video')?.id);
      let videoId = null, audioId = null;
      if (timelineId && timelineId.startsWith('timeline-')) {
        videoId = timelineId.replace('timeline-', '');
        audioId = videoId.replace('-v', '-a');
      } else if (el.classList.contains('sentence-display')) {
        const sid = el.id.replace('sentence-display-', '');
        videoId = sid;
        audioId = sid.replace('-v', '-a');
      }
      loadVideoIfNeeded(document.getElementById(videoId));
      loadVideoIfNeeded(document.getElementById(audioId));
    });
  });

  // Load videos when they enter the viewport (IntersectionObserver)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadVideoIfNeeded(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('video').forEach(vid => {
    observer.observe(vid);
  });

  // Add your existing video monitoring & setupSentences logic below
  const videoCells = [
    // Roblox
    ['roblox-v1', 'cell-roblox-v1'], ['roblox-a1', 'cell-roblox-a1'],
    ['roblox-v2', 'cell-roblox-v2'], ['roblox-a2', 'cell-roblox-a2'],
    ['roblox-v3', 'cell-roblox-v3'], ['roblox-a3', 'cell-roblox-a3'],
    ['roblox-v4', 'cell-roblox-v4'], ['roblox-a4', 'cell-roblox-a4'],
    ['roblox-v5', 'cell-roblox-v5'], ['roblox-a5', 'cell-roblox-a5'],
    // VRChat
    ['vrchat-v1', 'cell-vrchat-v1'], ['vrchat-a1', 'cell-vrchat-a1'],
    ['vrchat-v2', 'cell-vrchat-v2'], ['vrchat-a2', 'cell-vrchat-a2'],
    ['vrchat-v3', 'cell-vrchat-v3'], ['vrchat-a3', 'cell-vrchat-a3'],
    ['vrchat-v4', 'cell-vrchat-v4'], ['vrchat-a4', 'cell-vrchat-a4'],
    ['vrchat-v5', 'cell-vrchat-v5'], ['vrchat-a5', 'cell-vrchat-a5'],
    // Spatial
    ['spatial-v1', 'cell-spatial-v1'], ['spatial-a1', 'cell-spatial-a1'],
    ['spatial-v2', 'cell-spatial-v2'], ['spatial-a2', 'cell-spatial-a2'],
    ['spatial-v3', 'cell-spatial-v3'], ['spatial-a3', 'cell-spatial-a3'],
    // Horizon Worlds
    ['horizon-v1', 'cell-horizon-v1'], ['horizon-a1', 'cell-horizon-a1'],
    ['horizon-v2', 'cell-horizon-v2'], ['horizon-a2', 'cell-horizon-a2'],
    // Frame
    ['frame-v1', 'cell-frame-v1'], ['frame-a1', 'cell-frame-a1'],
    ['frame-v2', 'cell-frame-v2'], ['frame-a2', 'cell-frame-a2'],
  ];
  videoCells.forEach(([videoId, cellId]) => monitorVolume(videoId, cellId));

  [
    'roblox-v1', 'roblox-v2', 'roblox-v3', 'roblox-v4', 'roblox-v5',
    'vrchat-v1', 'vrchat-v2', 'vrchat-v3', 'vrchat-v4', 'vrchat-v5',
    'spatial-v1', 'spatial-v2', 'spatial-v3',
    'horizon-v1', 'horizon-v2',
    'frame-v1', 'frame-v2'
  ].forEach(videoId => setupSentences(videoId));

  // After setting up sentences, initialize timeline sync for each attack
  const timelinePairs = [
    ['roblox-v1','roblox-a1','timeline-roblox-v1'],
    ['roblox-v2','roblox-a2','timeline-roblox-v2'],
    ['roblox-v3','roblox-a3','timeline-roblox-v3'],
    ['roblox-v4','roblox-a4','timeline-roblox-v4'],
    ['roblox-v5','roblox-a5','timeline-roblox-v5'],

    ['vrchat-v1','vrchat-a1','timeline-vrchat-v1'],
    ['vrchat-v2','vrchat-a2','timeline-vrchat-v2'],
    ['vrchat-v3','vrchat-a3','timeline-vrchat-v3'],
    ['vrchat-v4','vrchat-a4','timeline-vrchat-v4'],
    ['vrchat-v5','vrchat-a5','timeline-vrchat-v5'],

    ['spatial-v1','spatial-a1','timeline-spatial-v1'],
    ['spatial-v2','spatial-a2','timeline-spatial-v2'],
    ['spatial-v3','spatial-a3','timeline-spatial-v3'],

    ['horizon-v1','horizon-a1','timeline-horizon-v1'],
    ['horizon-v2','horizon-a2','timeline-horizon-v2'],

    ['frame-v1','frame-a1','timeline-frame-v1'],
    ['frame-v2','frame-a2','timeline-frame-v2']
  ];
  timelinePairs.forEach(([v1,v2,tId]) => setupTimelineSync(v1,v2,tId));

  // Setup button initial text and dynamic Play/Pause/Continue behavior
  document.querySelectorAll('.controls button').forEach(btn => {
    btn.textContent = 'Play';
    btn.dataset.clicked = 'false';
    // Extract video IDs from inline onclick
    const onclick = btn.getAttribute('onclick');
    const match = onclick && onclick.match(/togglePlay\(['"](.*?)['"],\s*['"](.*?)['"]\)/);
    let v1, v2;
    if (match) {
      v1 = document.getElementById(match[1]);
      v2 = document.getElementById(match[2]);
    }
    // Update button text on click and video events
    btn.addEventListener('click', () => {
      if (btn.dataset.clicked === 'false') {
        btn.textContent = 'Continue';
        btn.dataset.clicked = 'true';
      }
      // Toggle Play/Pause label immediately after click
      if (v1 && v2) {
        setTimeout(() => {
          if (!v1.paused && !v2.paused) {
            btn.textContent = 'Pause';
          } else {
            btn.textContent = 'Continue';
          }
        }, 50);
      }
    });
    // Listen for play/pause events to update button text
    if (v1 && v2) {
      const updateBtn = () => {
        if (!v1.paused && !v2.paused) {
          btn.textContent = 'Pause';
        } else {
          btn.textContent = btn.dataset.clicked === 'true' ? 'Continue' : 'Play';
        }
      };
      v1.addEventListener('play', updateBtn);
      v2.addEventListener('play', updateBtn);
      v1.addEventListener('pause', updateBtn);
      v2.addEventListener('pause', updateBtn);
    }
  });
}); // end DOMContentLoaded listener



// ... your togglePlay, monitorVolume, setupSentences, and setupTimelineSync functions remain the same
