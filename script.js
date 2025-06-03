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
  const display = document.getElementById('sentence-display-' + videoId);
  const spans = document.querySelectorAll(`#hidden-sentences-${videoId} span`);

  video.addEventListener('timeupdate', () => {
    const currentTime = video.currentTime;
    let found = false;
    spans.forEach(span => {
      const start = parseFloat(span.dataset.start);
      const end = parseFloat(span.dataset.end);
      if (currentTime >= start && currentTime < end) {
        display.textContent = span.textContent;
        display.classList.add('show');
        found = true;
      }
    });
    if (!found) {
      display.classList.remove('show');
    }
  });
}

// Initialize all video cells and sentence syncs
window.onload = function () {
  [
    ['v1', 'cell-v1'], ['a1', 'cell-a1'],
    ['v2', 'cell-v2'], ['a2', 'cell-a2']
  ].forEach(([videoId, cellId]) => monitorVolume(videoId, cellId));

  ['v1', 'v2'].forEach(videoId => setupSentences(videoId));
};
// Platform dropdown logic
document.addEventListener('DOMContentLoaded', function() {
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
});

// ... your togglePlay, monitorVolume, and setupSentences functions remain the same
