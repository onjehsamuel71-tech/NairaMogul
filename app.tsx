// In your App.tsx (or root layout):
import { AudioProvider } from "@/components/AudioProvider";
import { SoundToggle } from "@/components/SoundToggle";

export default function App() {
  return (
    <AudioProvider>
      {/* your existing UI */}
      <SoundToggle />
    </AudioProvider>
  );
}