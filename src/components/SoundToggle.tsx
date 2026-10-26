import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudio } from "@/components/AudioProvider";

export function SoundToggle() {
  const { muted, toggleMuted } = useAudio();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleMuted}
      aria-label={muted ? "Unmute sound" : "Mute sound"}
      className="border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </Button>
  );
}