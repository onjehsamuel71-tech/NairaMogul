let ctx: AudioContext | null = null;
let musicEl: HTMLAudioElement | null = null;
let musicStarted = false;
let muted = false;

const MUTE_KEY = "naira-mogul:muted";

if (typeof window !== "undefined") {
  muted = window.localStorage.getItem(MUTE_KEY) === "1";
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(next: boolean): void {
  muted = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  }
  if (musicEl) {
    if (next) musicEl.pause();
    else if (musicStarted) void musicEl.play().catch(() => undefined);
  }
}

export function toggleMuted(): boolean {
  setMuted(!muted);
  return muted;
}

export function playClick(): void {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.06);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  osc.connect(gain).connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.1);
}

export function playCash(): void {
  if (muted) return;
  const audio = getCtx();
  if (!audio) return;

  const now = audio.currentTime;
  [1046, 1318, 1568].forEach((freq, i) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + i * 0.05);
    gain.gain.setValueAtTime(0.0001, now + i * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.14, now + i * 0.05 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.18);
    osc.connect(gain).connect(audio.destination);
    osc.start(now + i * 0.05);
    osc.stop(now + i * 0.05 + 0.2);
  });
}

export function startBackgroundMusic(src = "/audio/theme.mp3"): void {
  if (typeof window === "undefined") return;
  if (!musicEl) {
    musicEl = new Audio(src);
    musicEl.loop = true;
    musicEl.volume = 0.25;
    musicEl.preload = "auto";
  }
  musicStarted = true;
  if (!muted) void musicEl.play().catch(() => undefined);
}

export function stopBackgroundMusic(): void {
  musicStarted = false;
  musicEl?.pause();
}