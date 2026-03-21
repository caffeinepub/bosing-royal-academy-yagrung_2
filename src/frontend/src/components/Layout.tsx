import { ChevronDown, Menu, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { navigate } from "../App";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type NavItem = { label: string; href: string };
type NavGroup = { label: string; items: NavItem[] };

const DEFAULT_NAV_GROUPS: NavGroup[] = [
  {
    label: "About",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Principal's Message", href: "/principals-message" },
      { label: "From the Desk of Chairman", href: "/chairmans-desk" },
      {
        label: "Message from Managing Director",
        href: "/managing-directors-message",
      },
      { label: "Staff & Faculty", href: "/staff" },
    ],
  },
  {
    label: "Academics",
    items: [
      { label: "Academics", href: "/academics" },
      { label: "Admissions", href: "/admissions" },
      { label: "Student Life", href: "/student-life" },
    ],
  },
  {
    label: "News & Events",
    items: [
      { label: "News & Announcements", href: "/news" },
      { label: "Events", href: "/events" },
      { label: "Achievements", href: "/achievements" },
    ],
  },
  {
    label: "More",
    items: [
      { label: "Gallery", href: "/gallery" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

function isValidNavGroups(data: unknown): data is NavGroup[] {
  if (!Array.isArray(data)) return false;
  return data.every(
    (g) =>
      g &&
      typeof g === "object" &&
      typeof g.label === "string" &&
      Array.isArray(g.items) &&
      g.items.every(
        (item: unknown) =>
          item &&
          typeof item === "object" &&
          typeof (item as NavItem).label === "string" &&
          typeof (item as NavItem).href === "string",
      ),
  );
}

export default function Layout({
  children,
  currentRoute,
}: { children: ReactNode; currentRoute: string }) {
  const { identity, login, clear } = useInternetIdentity();
  const { actor } = useActor();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [navGroups, setNavGroups] = useState<NavGroup[]>(DEFAULT_NAV_GROUPS);
  const isLoggedIn = !!identity;

  useEffect(() => {
    if (!actor) return;
    actor
      .getLogoBlob()
      .then((blob: any) => {
        if (blob) setLogoUrl(blob?.getDirectURL?.() ?? null);
      })
      .catch(() => {});
    (actor as any)
      .getMenuConfig()
      .then((result: string | null) => {
        if (result && typeof result === "string") {
          try {
            const parsed: unknown = JSON.parse(result);
            if (isValidNavGroups(parsed) && parsed.length > 0) {
              setNavGroups(parsed);
            } else {
              setNavGroups(DEFAULT_NAV_GROUPS);
            }
          } catch {
            setNavGroups(DEFAULT_NAV_GROUPS);
          }
        }
      })
      .catch(() => {
        setNavGroups(DEFAULT_NAV_GROUPS);
      });
  }, [actor]);

  const safeNavGroups: NavGroup[] = Array.isArray(navGroups)
    ? navGroups
    : DEFAULT_NAV_GROUPS;

  const handleNav = (href: string) => {
    navigate(href);
    setMobileOpen(false);
    setOpenDropdown(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top utility bar */}
      <div className="bg-navy-dark text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-4">
            <span>📞 +975-XXXX-XXXX</span>
            <span>✉️ info@bosing-royal-academy.edu.bt</span>
          </div>
          <div className="flex gap-3 items-center">
            <button
              type="button"
              onClick={() => handleNav("/admin")}
              className="hover:text-yellow-300 transition-colors"
              data-ocid="nav.admin_login.link"
            >
              ADMIN LOGIN
            </button>
            {isLoggedIn ? (
              <button
                type="button"
                onClick={clear}
                className="hover:text-yellow-300 transition-colors ml-3 border-l border-white/30 pl-3"
              >
                LOGOUT
              </button>
            ) : (
              <button
                type="button"
                onClick={login}
                className="hover:text-yellow-300 transition-colors ml-3 border-l border-white/30 pl-3"
              >
                LOGIN
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleNav("/")}
            className="flex items-center gap-3 text-left"
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Bosing Royal Academy Yagrung"
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-bold text-lg">
                BRA
              </div>
            )}
            <div>
              <div className="font-serif text-lg font-bold text-gray-900 leading-tight">
                Bosing Royal Academy
              </div>
              <div className="text-xs text-gray-500 tracking-widest uppercase">
                Yagrung
              </div>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleNav("/")}
              className={`px-3 py-2 text-sm font-medium uppercase tracking-wide transition-colors ${
                currentRoute === "/"
                  ? "text-amber-700"
                  : "text-gray-700 hover:text-amber-700"
              }`}
            >
              Home
            </button>
            {safeNavGroups.map((group) => (
              <div
                key={group.label ?? "group"}
                className="relative"
                onMouseEnter={() => setOpenDropdown(group.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium uppercase tracking-wide text-gray-700 hover:text-amber-700 transition-colors"
                >
                  {group.label} <ChevronDown className="w-3 h-3" />
                </button>
                {openDropdown === group.label && Array.isArray(group.items) && (
                  <div className="absolute top-full left-0 bg-white shadow-lg border border-gray-100 rounded py-1 min-w-48 z-50">
                    {group.items.map((item, idx) => (
                      <button
                        type="button"
                        key={item.href ?? idx}
                        onClick={() => handleNav(item.href ?? "/")}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav("/admissions")}
              className="hidden sm:inline-flex px-4 py-2 bg-amber-600 text-white text-sm font-semibold uppercase tracking-wide rounded hover:bg-amber-700 transition-colors"
            >
              Apply Now
            </button>
            <button
              type="button"
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-3">
            <button
              type="button"
              onClick={() => handleNav("/")}
              className="block py-2 text-sm font-medium text-gray-700"
            >
              Home
            </button>
            {safeNavGroups
              .flatMap((g) => (Array.isArray(g.items) ? g.items : []))
              .map((item, idx) => (
                <button
                  type="button"
                  key={item.href ?? idx}
                  onClick={() => handleNav(item.href ?? "/")}
                  className="block py-2 text-sm text-gray-700"
                >
                  {item.label}
                </button>
              ))}
            <button
              type="button"
              onClick={() => handleNav("/admissions")}
              className="mt-2 px-4 py-2 bg-amber-600 text-white text-sm font-semibold rounded"
            >
              Apply Now
            </button>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-navy text-white">
        <div className="border-t-4 border-gold" />
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white font-bold">
                BRA
              </div>
              <div>
                <div className="font-serif text-base font-bold">
                  Bosing Royal Academy
                </div>
                <div className="text-xs text-white/60 tracking-widest">
                  YAGRUNG
                </div>
              </div>
            </div>
            <p className="text-sm text-white/70">
              Excellence in education, rooted in tradition and heritage.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gold">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              {[
                ["Home", "/"],
                ["About Us", "/about"],
                ["Admissions", "/admissions"],
                ["News", "/news"],
                ["Events", "/events"],
                ["Contact", "/contact"],
                ["Admin Login", "/admin"],
              ].map(([l, h]) => (
                <li key={h}>
                  <button
                    type="button"
                    onClick={() => handleNav(h)}
                    className="hover:text-gold transition-colors"
                    data-ocid={
                      l === "Admin Login"
                        ? "footer.admin_login.link"
                        : undefined
                    }
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4 text-gold">
              Contact
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Yagrung, Bhutan</li>
              <li>+975-XXXX-XXXX</li>
              <li>info@bosing-royal-academy.edu.bt</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-3 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Bosing Royal Academy Yagrung. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
