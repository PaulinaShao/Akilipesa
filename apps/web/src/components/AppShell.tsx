import { PropsWithChildren } from "react";
import TopBar from "./layout/TopBar";
import BottomNav from "./layout/BottomNav";
import "../styles/tanzanite.css";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div id="app-root" className="app">
      <TopBar />
      <main id="feed" className="content">{children}</main>
      <BottomNav />
      <div className="app-footer-underlay" aria-hidden="true" />
    </div>
  );
}
