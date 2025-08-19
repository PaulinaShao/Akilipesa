import { PropsWithChildren } from "react";
import TopBar from "./TopBar";
import BottomNav from "./BottomNav";
import "../styles/tanzanite.css";

export default function AppShell({children}: PropsWithChildren) {
  return (
    <div className="app-shell">
      {/* Top Bar */}
      <TopBar />

      {/* Main Content Area */}
      <main className="app-content">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
