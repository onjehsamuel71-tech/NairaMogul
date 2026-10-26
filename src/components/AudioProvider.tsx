import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { isMuted, setMuted, startBackgroundMusic, toggleMuted as toggleMutedRaw } from "@/lib/audio";

type AudioContextValue = {
  muted: boolean;
  toggleMuted: () => void;
};

const Ctx = createContext<AudioContextValue>({ muted: false, toggleMuted: () => undefined });

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMutedState] = useState<boolean>(() => isMuted());

  useEffect(() => {
    const unlock = () => {
      startBackgroundMusic();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const toggleMuted = useCallback(() => {
    const next = toggleMutedRaw();
    setMutedState(next);
  }, []);

  useEffect(() => {
    setMuted(muted);
  }, [muted]);

  const value = useMemo(() => ({ muted, toggleMuted }), [muted, toggleMuted]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAudio(): AudioContextValue {
  return useContext(Ctx);
}