// Simple sound effects using Web Audio API - no external files needed
let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

export function playCorrectSound() {
  // Happy ascending notes
  playTone(523, 0.12, 'sine', 0.12);  // C5
  setTimeout(() => playTone(659, 0.12, 'sine', 0.12), 100);  // E5
  setTimeout(() => playTone(784, 0.2, 'sine', 0.15), 200);   // G5
}

export function playWrongSound() {
  // Gentle low tone
  playTone(280, 0.25, 'sine', 0.08);
}

export function playClickSound() {
  playTone(600, 0.06, 'sine', 0.08);
}

export function playStageCompleteSound() {
  // Victory fanfare
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.2, 'sine', 0.12), i * 150);
  });
}

export function playComboSound() {
  playTone(880, 0.15, 'sine', 0.1);
  setTimeout(() => playTone(1100, 0.2, 'sine', 0.12), 100);
}
