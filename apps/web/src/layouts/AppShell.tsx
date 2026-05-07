import { useEffect } from "react";
import { Outlet as RouterOutlet, useLocation, useNavigate } from "react-router-dom";
import { useAgentStore } from "../stores/agentStore";
import type { ScreenContext } from "../types/chemistry";
import { DEMO_JOB_ID } from "../constants/demo";

const Outlet = RouterOutlet as unknown as () => JSX.Element;

const nav: Array<{ to: string; label: string; screen: ScreenContext }> = [
  { to: "/", label: "Home", screen: "landing" },
  { to: "/input", label: "Input", screen: "input" },
  { to: "/draw", label: "Draw", screen: "draw" },
  { to: "/dock", label: "Docking lab", screen: "dock" },
  { to: `/results/${DEMO_JOB_ID}`, label: "Results", screen: "results" },
  { to: `/report/${DEMO_JOB_ID}`, label: "AI report", screen: "report" },
];

function screenFromPath(pathname: string): ScreenContext {
  if (pathname.startsWith("/dashboard")) return "dashboard";
  if (pathname.startsWith("/input")) return "input";
  if (pathname.startsWith("/draw")) return "draw";
  if (pathname.startsWith("/dock")) return "dock";
  if (pathname.startsWith("/results")) return "results";
  if (pathname.startsWith("/report")) return "report";
  if (pathname.startsWith("/batch")) return "batch";
  if (pathname.startsWith("/settings")) return "settings";
  return "landing";
}

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const { resetForScreen } = useAgentStore();
  const screen = screenFromPath(location.pathname);

  useEffect(() => {
    resetForScreen(screen);
  }, [screen, resetForScreen]);

  return (
    <div className="ad-shell">
      <header className="ad-topnav">
        <button className="ad-brand" type="button" onClick={() => navigate("/")}>
          Alpha<span>Dock</span>
        </button>
        <nav className="ad-nav">
          {nav.map(({ to, label, screen: navScreen }) => (
            <button
              key={to}
              type="button"
              className={screen === navScreen ? "ad-navlink is-active" : "ad-navlink"}
              onClick={() => navigate(to)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="ad-topnav-actions">
          <span className="beta-badge">BETA</span>
          <div className="avatar">KK</div>
        </div>
      </header>
      <main className="ad-main">
        <Outlet />
      </main>
    </div>
  );
}
