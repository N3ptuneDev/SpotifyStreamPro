import { useState, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Library from "@/pages/Library";
import LikedSongs from "@/pages/LikedSongs";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import { useSpotify } from "./hooks/use-spotify-auth";
import { PlayerProvider } from "./context/PlayerContext";
import { SpotifyProvider } from "./context/SpotifyContext";

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden font-poppins text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
      <MusicPlayer />
    </div>
  );
}

function Router() {
  const [, setLocation] = useLocation();
  
  // Handle authentication callback
  useEffect(() => {
    // Check if URL has Spotify auth tokens from callback
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get('access_token');
    const refreshToken = url.searchParams.get('refresh_token');
    const expiresIn = url.searchParams.get('expires_in');
    
    if (accessToken && refreshToken) {
      // Store tokens in localStorage
      localStorage.setItem('spotify_token', accessToken);
      localStorage.setItem('spotify_refresh_token', refreshToken);
      if (expiresIn) {
        localStorage.setItem('spotify_token_expiry', 
          String(Date.now() + (Number(expiresIn) * 1000))
        );
      }
      
      // Clean URL parameters to avoid exposing tokens
      window.history.replaceState({}, document.title, window.location.pathname);
      
      console.log("Successfully authenticated with Spotify!");
      
      // Force a reload to update all components with the new authentication state
      window.location.reload();
    }
  }, [setLocation]);
  
  return (
    <Switch>
      <Route path="/">
        <AppLayout>
          <Home />
        </AppLayout>
      </Route>
      <Route path="/search">
        <AppLayout>
          <Search />
        </AppLayout>
      </Route>
      <Route path="/library">
        <AppLayout>
          <Library />
        </AppLayout>
      </Route>
      <Route path="/liked-songs">
        <AppLayout>
          <LikedSongs />
        </AppLayout>
      </Route>
      <Route path="/error">
        <div className="flex h-screen items-center justify-center bg-dark-bg text-white">
          <div className="max-w-md rounded-xl bg-card p-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-500">Authentication Error</h1>
            <p className="mb-4">There was a problem connecting to Spotify. Please try again.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
            >
              Return Home
            </button>
          </div>
        </div>
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  // Initialize Spotify authentication
  useSpotify();
  
  return (
    <SpotifyProvider>
      <PlayerProvider>
        <Router />
      </PlayerProvider>
    </SpotifyProvider>
  );
}

export default App;
