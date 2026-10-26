let themeMusic: HTMLAudioElement | null = null;
let started = false;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!themeMusic) {
    themeMusic = new Audio("/audio/theme.mp3");
    themeMusic.loop = true;
    themeMusic.volume = 0.25;
    themeMusic.preload = "auto";
  }
  return themeMusic;
}

export function playThemeMusic(): void {
  const audio = getAudio();
  if (!audio || started) return;
  started = true;
  audio.play().catch((err) => {
    // Autoplay blocked — reset so the next user gesture can retry.
    started = false;
    console.log("Autoplay prevented by browser until user clicks:", err);
  });
}

export function pauseThemeMusic(): void {
  started = false;
  themeMusic?.pause();
}

export function setThemeVolume(v: number): void {
  if (themeMusic) themeMusic.volume = Math.max(0, Math.min(1, v));
}