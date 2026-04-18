import { NavLink, Outlet } from "react-router-dom";

const nav = [
  ["/", "Home"],
  ["/input", "Input"],
  ["/draw", "Draw"],
  ["/dock", "Dock"],
  ["/results/demo", "Results"],
  ["/report/demo", "Report"],
  ["/batch/demo", "Batch"],
  ["/dashboard", "Dashboard"],
  ["/settings", "Settings"],
] as const;

export function AppShell() {
  return (
    <div className="ad-shell">
      <header className="ad-topnav">
        <strong className="ad-brand">AlphaDock</strong>
        <nav className="ad-nav">
          {nav.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                isActive ? "ad-navlink is-active" : "ad-navlink"
              }
              end={to === "/"}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="ad-main">
        <Outlet />
      </main>
    </div>
  );
}
