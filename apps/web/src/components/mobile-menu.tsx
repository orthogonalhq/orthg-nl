"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { GlitchLogo } from "./glitch-logo";
import { NAV_ITEMS, type NavLink } from "@/lib/nav";
import { NavIcon } from "./nav-icon";

function MobileLink({
  item,
  onClose,
}: {
  item: NavLink;
  onClose: () => void;
}) {
  const inner = (
    <>
      <span className="flex items-center gap-2">
        <NavIcon name={item.icon} size={14} className="t-ghost" />
        <span className="font-mono text-ui font-semibold t-card-title">
          {item.label}
        </span>
        {item.external && (
          <svg
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            className="opacity-40"
          >
            <path
              d="M1 8L8 1M8 1H3M8 1V6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {item.description && (
        <span className="text-caption t-ghost leading-snug mt-1 block">
          {item.description}
        </span>
      )}
    </>
  );

  const cls =
    "block px-5 py-3 transition-colors hover:bg-white/[0.03] rounded";

  return item.external ? (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      onClick={onClose}
    >
      {inner}
    </a>
  ) : (
    <Link href={item.href} className={cls} onClick={onClose}>
      {inner}
    </Link>
  );
}

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  function handleOpen() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    document.body.style.overflow = "hidden";
    setOpen(true);
    setExpanded(null);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }

  function handleClose() {
    setVisible(false);
    document.body.style.overflow = "";
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
      setExpanded(null);
    }, 300);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.body.style.overflow = "";
    },
    []
  );

  const sections = NAV_ITEMS.filter(
    (item): item is Extract<typeof item, { type: "mega" }> =>
      item.type === "mega"
  );

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => (open ? handleClose() : handleOpen())}
        className="md:hidden ml-auto cursor-pointer px-5 py-3 transition-colors hover:text-accent"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <svg
          width="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.35719 3H14.6428C15.7266 2.99999 16.6007 2.99998 17.3086 3.05782C18.0375 3.11737 18.6777 3.24318 19.27 3.54497C20.2108 4.02433 20.9757 4.78924 21.455 5.73005C21.7568 6.32234 21.8826 6.96253 21.9422 7.69138C22 8.39925 22 9.27339 22 10.3572V13.6428C22 14.7266 22 15.6008 21.9422 16.3086C21.8826 17.0375 21.7568 17.6777 21.455 18.27C20.9757 19.2108 20.2108 19.9757 19.27 20.455C18.6777 20.7568 18.0375 20.8826 17.3086 20.9422C16.6008 21 15.7266 21 14.6428 21H9.35717C8.27339 21 7.39925 21 6.69138 20.9422C5.96253 20.8826 5.32234 20.7568 4.73005 20.455C3.78924 19.9757 3.02433 19.2108 2.54497 18.27C2.24318 17.6777 2.11737 17.0375 2.05782 16.3086C1.99998 15.6007 1.99999 14.7266 2 13.6428V10.3572C1.99999 9.27341 1.99998 8.39926 2.05782 7.69138C2.11737 6.96253 2.24318 6.32234 2.54497 5.73005C3.02433 4.78924 3.78924 4.02433 4.73005 3.54497C5.32234 3.24318 5.96253 3.11737 6.69138 3.05782C7.39926 2.99998 8.27341 2.99999 9.35719 3ZM6.85424 5.05118C6.24907 5.10062 5.90138 5.19279 5.63803 5.32698C5.07354 5.6146 4.6146 6.07354 4.32698 6.63803C4.19279 6.90138 4.10062 7.24907 4.05118 7.85424C4.00078 8.47108 4 9.26339 4 10.4V13.6C4 14.7366 4.00078 15.5289 4.05118 16.1458C4.10062 16.7509 4.19279 17.0986 4.32698 17.362C4.6146 17.9265 5.07354 18.3854 5.63803 18.673C5.90138 18.8072 6.24907 18.8994 6.85424 18.9488C7.17922 18.9754 7.55292 18.9882 8 18.9943V5.0057C7.55292 5.01184 7.17922 5.02462 6.85424 5.05118ZM10 5V19H14.6C15.7366 19 16.5289 18.9992 17.1458 18.9488C17.7509 18.8994 18.0986 18.8072 18.362 18.673C18.9265 18.3854 19.3854 17.9265 19.673 17.362C19.8072 17.0986 19.8994 16.7509 19.9488 16.1458C19.9992 15.5289 20 14.7366 20 13.6V10.4C20 9.26339 19.9992 8.47108 19.9488 7.85424C19.8994 7.24907 19.8072 6.90138 19.673 6.63803C19.3854 6.07354 18.9265 5.6146 18.362 5.32698C18.0986 5.19279 17.7509 5.10062 17.1458 5.05118C16.5289 5.00078 15.7366 5 14.6 5H10Z"
            fill="currentColor"
            className="transition-opacity duration-300 ease-out"
            style={{ opacity: open ? 0 : 1 }}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.35719 3H14.6428C15.7266 2.99999 16.6007 2.99998 17.3086 3.05782C18.0375 3.11737 18.6777 3.24318 19.27 3.54497C20.2108 4.02433 20.9757 4.78924 21.455 5.73005C21.7568 6.32234 21.8826 6.96253 21.9422 7.69138C22 8.39925 22 9.27339 22 10.3572V13.6428C22 14.7266 22 15.6008 21.9422 16.3086C21.8826 17.0375 21.7568 17.6777 21.455 18.27C20.9757 19.2108 20.2108 19.9757 19.27 20.455C18.6777 20.7568 18.0375 20.8826 17.3086 20.9422C16.6008 21 15.7266 21 14.6428 21H9.35717C8.27339 21 7.39925 21 6.69138 20.9422C5.96253 20.8826 5.32234 20.7568 4.73005 20.455C3.78924 19.9757 3.02433 19.2108 2.54497 18.27C2.24318 17.6777 2.11737 17.0375 2.05782 16.3086C1.99998 15.6007 1.99999 14.7266 2 13.6428V10.3572C1.99999 9.27341 1.99998 8.39926 2.05782 7.69138C2.11737 6.96253 2.24318 6.32234 2.54497 5.73005C3.02433 4.78924 3.78924 4.02433 4.73005 3.54497C5.32234 3.24318 5.96253 3.11737 6.69138 3.05782C7.39926 2.99998 8.27341 2.99999 9.35719 3ZM6.85424 5.05118C6.24907 5.10062 5.90138 5.19279 5.63803 5.32698C5.07354 5.6146 4.6146 6.07354 4.32698 6.63803C4.19279 6.90138 4.10062 7.24907 4.05118 7.85424C4.00078 8.47108 4 9.26339 4 10.4V13.6C4 14.7366 4.00078 15.5289 4.05118 16.1458C4.10062 16.7509 4.19279 17.0986 4.32698 17.362C4.6146 17.9265 5.07354 18.3854 5.63803 18.673C5.90138 18.8072 6.24907 18.8994 6.85424 18.9488C7.47108 18.9992 8.26339 19 9.4 19H14.6C15.7366 19 16.5289 18.9992 17.1458 18.9488C17.7509 18.8994 18.0986 18.8072 18.362 18.673C18.9265 18.3854 19.3854 17.9265 19.673 17.362C19.8072 17.0986 19.8994 16.7509 19.9488 16.1458C19.9992 15.5289 20 14.7366 20 13.6V10.4C20 9.26339 19.9992 8.47108 19.9488 7.85424C19.8994 7.24907 19.8072 6.90138 19.673 6.63803C19.3854 6.07354 18.9265 5.6146 18.362 5.32698C18.0986 5.19279 17.7509 5.10062 17.1458 5.05118C16.5289 5.00078 15.7366 5 14.6 5H9.4C8.26339 5 7.47108 5.00078 6.85424 5.05118ZM7 7C7.55229 7 8 7.44772 8 8V16C8 16.5523 7.55229 17 7 17C6.44772 17 6 16.5523 6 16V8C6 7.44772 6.44772 7 7 7Z"
            fill="currentColor"
            className="transition-opacity duration-300 ease-out"
            style={{ opacity: open ? 1 : 0 }}
          />
        </svg>
      </button>

      {/* Full-screen overlay */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 z-60 flex flex-col overflow-y-auto"
            style={{
              backgroundColor: "#0a0a0a",
              opacity: visible ? 1 : 0,
              transition: "opacity 0.3s ease-out",
              willChange: "opacity",
            }}
          >
            {/* Top bar */}
            <div className="flex items-center border-b border-white/6 shrink-0">
              <div className="px-5 py-3 border-r border-white/6">
                <Link href="/" onClick={handleClose}>
                  <GlitchLogo />
                </Link>
              </div>
              <button
                onClick={handleClose}
                className="cursor-pointer ml-auto px-5 py-3 transition-colors hover:text-accent"
                aria-label="Close menu"
              >
                <svg
                  width="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.35719 3H14.6428C15.7266 2.99999 16.6007 2.99998 17.3086 3.05782C18.0375 3.11737 18.6777 3.24318 19.27 3.54497C20.2108 4.02433 20.9757 4.78924 21.455 5.73005C21.7568 6.32234 21.8826 6.96253 21.9422 7.69138C22 8.39925 22 9.27339 22 10.3572V13.6428C22 14.7266 22 15.6008 21.9422 16.3086C21.8826 17.0375 21.7568 17.6777 21.455 18.27C20.9757 19.2108 20.2108 19.9757 19.27 20.455C18.6777 20.7568 18.0375 20.8826 17.3086 20.9422C16.6008 21 15.7266 21 14.6428 21H9.35717C8.27339 21 7.39925 21 6.69138 20.9422C5.96253 20.8826 5.32234 20.7568 4.73005 20.455C3.78924 19.9757 3.02433 19.2108 2.54497 18.27C2.24318 17.6777 2.11737 17.0375 2.05782 16.3086C1.99998 15.6007 1.99999 14.7266 2 13.6428V10.3572C1.99999 9.27341 1.99998 8.39926 2.05782 7.69138C2.11737 6.96253 2.24318 6.32234 2.54497 5.73005C3.02433 4.78924 3.78924 4.02433 4.73005 3.54497C5.32234 3.24318 5.96253 3.11737 6.69138 3.05782C7.39926 2.99998 8.27341 2.99999 9.35719 3ZM6.85424 5.05118C6.24907 5.10062 5.90138 5.19279 5.63803 5.32698C5.07354 5.6146 4.6146 6.07354 4.32698 6.63803C4.19279 6.90138 4.10062 7.24907 4.05118 7.85424C4.00078 8.47108 4 9.26339 4 10.4V13.6C4 14.7366 4.00078 15.5289 4.05118 16.1458C4.10062 16.7509 4.19279 17.0986 4.32698 17.362C4.6146 17.9265 5.07354 18.3854 5.63803 18.673C5.90138 18.8072 6.24907 18.8994 6.85424 18.9488C7.47108 18.9992 8.26339 19 9.4 19H14.6C15.7366 19 16.5289 18.9992 17.1458 18.9488C17.7509 18.8994 18.0986 18.8072 18.362 18.673C18.9265 18.3854 19.3854 17.9265 19.673 17.362C19.8072 17.0986 19.8994 16.7509 19.9488 16.1458C19.9992 15.5289 20 14.7366 20 13.6V10.4C20 9.26339 19.9992 8.47108 19.9488 7.85424C19.8994 7.24907 19.8072 6.90138 19.673 6.63803C19.3854 6.07354 18.9265 5.6146 18.362 5.32698C18.0986 5.19279 17.7509 5.10062 17.1458 5.05118C16.5289 5.00078 15.7366 5 14.6 5H9.4C8.26339 5 7.47108 5.00078 6.85424 5.05118Z"
                    fill="currentColor"
                  />
                  <rect
                    x="6"
                    y="7"
                    width="2"
                    height="10"
                    rx="1"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>

            {/* Accordion nav */}
            <nav className="flex flex-col mx-2 divide-y divide-white/6 mt-2">
              {/* Home link */}
              <Link
                href="/"
                onClick={handleClose}
                className="flex items-center px-3 py-4 font-mono text-sm uppercase tracking-[0.15em] font-semibold t-nav transition-colors hover:text-white"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(8px)",
                  transition: "opacity 0.3s ease-out 40ms, transform 0.3s ease-out 40ms",
                }}
              >
                Home
              </Link>
              {sections.map((section, sIdx) => {
                const isOpen = expanded === section.label;
                return (
                  <div key={section.label}>
                    {/* Section trigger */}
                    <button
                      onClick={() =>
                        setExpanded(isOpen ? null : section.label)
                      }
                      className="w-full flex items-center justify-between px-3 py-4 cursor-pointer"
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible
                          ? "translateY(0)"
                          : "translateY(8px)",
                        transition: `opacity 0.3s ease-out ${
                          80 + sIdx * 60
                        }ms, transform 0.3s ease-out ${80 + sIdx * 60}ms`,
                      }}
                    >
                      <span
                        className={`font-mono text-sm uppercase tracking-[0.15em] font-semibold transition-colors ${
                          isOpen ? "text-white" : "t-nav"
                        }`}
                      >
                        {section.label}
                      </span>
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 8 8"
                        fill="none"
                        className={`t-ghost transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M1.5 3L4 5.5L6.5 3"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Expanded panel */}
                    <div
                      className="overflow-hidden transition-all duration-250 ease-out"
                      style={{
                        maxHeight: isOpen
                          ? `${section.items.length * 80 + 16}px`
                          : "0px",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <div className="px-3 pb-4">
                        {section.items.map((item) => (
                          <MobileLink
                            key={item.href}
                            item={item}
                            onClose={handleClose}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>,
          document.body
        )}
    </>
  );
}
