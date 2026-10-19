import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/Images/logo.svg";
import { navLinks } from "../../data/church";
import { useAuth } from "../../context/AuthContext";
import { backendEnabled } from "../../lib/api";

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, isAdmin, logout } = useAuth();
  // The menu remembers which page it was opened on, so it closes itself
  // automatically as soon as you navigate somewhere else. Starts closed.
  const [openOn, setOpenOn] = useState(null);
  const open = openOn === pathname;
  const setOpen = (value) => setOpenOn(value ? pathname : null);

  // Close with the Escape key and stop the page scrolling behind the menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const linkClass = ({ isActive }) =>
    `relative py-1 text-sm font-semibold transition-colors ${
      isActive ? "text-flame" : "text-stone/80 hover:text-stone"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-stone/10 bg-ink">
      <nav className="wrap flex h-16 items-center justify-between" aria-label="Main">
        <Link to="/" className="flex items-center gap-3" aria-label="Revive Gospel Embassy home">
          <img src={logo} alt="" className="h-9 w-9 invert" />
          <span className="font-anton text-xl uppercase tracking-wide text-stone">
            RGE <span className="text-stone/50">Global</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.slice(0, -1).map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}
          {backendEnabled && isAdmin && (
            <li>
              <NavLink to="/admin" className={linkClass}>
                Admin
              </NavLink>
            </li>
          )}
          {backendEnabled && (
            <li>
              {user ? (
                <button type="button" onClick={logout} className="text-sm font-semibold text-stone/80 hover:text-stone" title={`Logged in as ${user.name}`}>
                  Log out
                </button>
              ) : (
                <NavLink to="/login" state={{ from: pathname }} className={linkClass}>
                  Log in
                </NavLink>
              )}
            </li>
          )}
          <li>
            <Link to="/give" className="btn-flame py-2">
              Give
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="relative h-10 w-10 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span
            className={`absolute left-2 right-2 top-[13px] h-0.5 bg-stone transition-transform ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-2 right-2 top-[19px] h-0.5 bg-stone transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`absolute left-2 right-2 top-[25px] h-0.5 bg-stone transition-transform ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-ink md:hidden"
      >
        <ul className="wrap flex flex-col py-6">
          {navLinks.map((l) => (
            <li key={l.to} className="border-b border-stone/10">
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `display block py-4 text-4xl ${isActive ? "text-flame" : "text-stone"}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          {backendEnabled && isAdmin && (
            <li className="border-b border-stone/10">
              <NavLink to="/admin" className="display block py-4 text-4xl text-stone">
                Admin
              </NavLink>
            </li>
          )}
          {backendEnabled && (
            <li className="pt-6">
              {user ? (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-ash">Logged in as {user.name}</span>
                  <button type="button" onClick={() => { logout(); setOpen(false); }} className="btn-ghost-dark">
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" state={{ from: pathname }} className="btn-flame">
                    Log in
                  </Link>
                  <Link to="/register" state={{ from: pathname }} className="btn-ghost-dark">
                    Sign up
                  </Link>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
