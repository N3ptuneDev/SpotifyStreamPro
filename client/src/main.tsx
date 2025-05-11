import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import App from "./App";
import "./index.css";
import { SpotifyProvider } from "./context/SpotifyContext";
import { PlayerProvider } from "./context/PlayerContext";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SpotifyProvider>
        <PlayerProvider>
          <Toaster />
          <App />
        </PlayerProvider>
      </SpotifyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
