import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Library from "@/pages/Library";
import LikedSongs from "@/pages/LikedSongs";
import Sidebar from "@/components/Sidebar";
import MusicPlayer from "@/components/MusicPlayer";
import { useSpotify } from "./hooks/use-spotify-auth";

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
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  // Initialize Spotify authentication
  useSpotify();
  
  return <Router />;
}

export default App;
