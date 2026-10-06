// Web Audio API tactile feedback synthesizer (subtle, luxury clicks, no external assets needed)

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('kuro_sound_enabled', enabled ? 'true' : 'false');
  }
};

export const getSoundEnabled = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kuro_sound_enabled');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  }
  return soundEnabled;
};

// Subtle tactile micro-click
export const playTactileClick = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Ignore audio context errors
  }
};

// Subtle low thump for add-to-cart confirmation
export const playSuccessChime = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Ignore
  }
};

// Gentle swoosh for drawer/slide transitions
export const playSwoosh = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Buffer noise
    const bufferSize = ctx.sampleRate * 0.06;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1000, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.06);
    filter.Q.value = 3;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();
    noise.stop(ctx.currentTime + 0.06);
  } catch {
    // Ignore
  }
};

// Low resonant sonic thump for logo burst / particle detonation
export const playDetonationSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(36, ctx.currentTime + 0.2);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  } catch {
    // Ignore
  }
};

// Tokyo neon streetlamp ignition sound sequence (starter clicks + warm fluorescent gas hum)
export const playTokyoLightsOn = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Starter spark 1 (quick electrical tick)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(860, t);
    gain1.gain.setValueAtTime(0.04, t);
    gain1.gain.exponentialRampToValueAtTime(0.0001, t + 0.015);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.015);

    // Starter spark 2 (re-strike arc)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(980, t + 0.045);
    gain2.gain.setValueAtTime(0.05, t + 0.045);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(t + 0.045);
    osc2.stop(t + 0.07);

    // Warm neon ballast hum surge
    const oscHum = ctx.createOscillator();
    const gainHum = ctx.createGain();
    oscHum.type = 'sine';
    oscHum.frequency.setValueAtTime(140, t + 0.07);
    oscHum.frequency.exponentialRampToValueAtTime(280, t + 0.22);
    gainHum.gain.setValueAtTime(0.05, t + 0.07);
    gainHum.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    oscHum.connect(gainHum);
    gainHum.connect(ctx.destination);
    oscHum.start(t + 0.07);
    oscHum.stop(t + 0.35);
  } catch {
    // Ignore
  }
};

// Tokyo nocturnal dimming sound (gentle warm decrescendo as streetlights power down)
export const playTokyoLightsDim = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.28);

    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.28);
  } catch {
    // Ignore
  }
};

// Luxury analog camera shutter snap with hydraulic sub-bass
export const playShutterSnap = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    // High mechanical blade click
    const oscClick = ctx.createOscillator();
    const gainClick = ctx.createGain();
    oscClick.type = 'triangle';
    oscClick.frequency.setValueAtTime(1400, t);
    oscClick.frequency.exponentialRampToValueAtTime(320, t + 0.035);
    gainClick.gain.setValueAtTime(0.06, t);
    gainClick.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);
    oscClick.connect(gainClick);
    gainClick.connect(ctx.destination);
    oscClick.start(t);
    oscClick.stop(t + 0.035);

    // Deep hydraulic resonance thump
    const oscSub = ctx.createOscillator();
    const gainSub = ctx.createGain();
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(110, t + 0.01);
    oscSub.frequency.exponentialRampToValueAtTime(28, t + 0.18);
    gainSub.gain.setValueAtTime(0.08, t + 0.01);
    gainSub.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    oscSub.connect(gainSub);
    gainSub.connect(ctx.destination);
    oscSub.start(t + 0.01);
    oscSub.stop(t + 0.18);
  } catch {
    // Ignore
  }
};

// Delicate optical glass / crystal resonance shimmer
let lastPrismSoundTime = 0;
export const playPrismRefract = (intensity = 0.5) => {
  if (!soundEnabled) return;
  const now = performance.now();
  if (now - lastPrismSoundTime < 90) return; // Throttle to prevent audio pileup
  lastPrismSoundTime = now;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 840 + Math.random() * 260;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.06);

    const targetGain = Math.min(0.035, 0.015 * intensity);
    gain.gain.setValueAtTime(targetGain, t);
    gain.gain.exponentialRampToValueAtTime(0.00001, t + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  } catch {
    // Ignore
  }
};

// Tactical laser scan sweep tone
export const playScanlinePulse = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2200, t);
    osc.frequency.exponentialRampToValueAtTime(450, t + 0.08);

    gain.gain.setValueAtTime(0.02, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1600;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  } catch {
    // Ignore
  }
};

// Luxury textile unroll flutter (soft silk / French Terry rolling from bolt)
let lastFabricSoundTime = 0;
export const playFabricRollSound = () => {
  if (!soundEnabled) return;
  const now = performance.now();
  if (now - lastFabricSoundTime < 80) return;
  lastFabricSoundTime = now;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, t);
    filter.frequency.exponentialRampToValueAtTime(700, t + 0.05);
    filter.Q.value = 1.8;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.025, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + 0.05);
  } catch {
    // Ignore
  }
};

// Delicate needle thread stitch tick
export const playThreadStitchSound = () => {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.02);

    gain.gain.setValueAtTime(0.035, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.02);
  } catch {
    // Ignore
  }
};




