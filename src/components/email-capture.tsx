"use client";

import { useCallback, useState } from "react";
import { useGlitchText } from "@/hooks/use-glitch-text";

interface EmailCaptureProps {
  className?: string;
  buttonText?: string;
  placeholder?: string;
}

export function EmailCapture({
  className = "",
  buttonText = "Get early access",
  placeholder = "your@email.com",
}: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");

  const statusText = formMessage || "No spam. One email when we launch.";
  const glitchedStatus = useGlitchText(statusText);

  const handleSubscribe = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setFormStatus("error");
      setFormMessage("Please enter a valid email address.");
      return;
    }

    setFormStatus("loading");
    setFormMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();

      if (res.ok) {
        setFormStatus("success");
        setFormMessage(data.message);
        setEmail("");
      } else if (res.status === 409) {
        setFormStatus("duplicate");
        setFormMessage(data.error);
      } else {
        setFormStatus("error");
        setFormMessage(data.error || "Something went wrong.");
      }
    } catch {
      setFormStatus("error");
      setFormMessage("Network error. Please try again.");
    }
  }, [email]);

  return (
    <div className={`group relative w-full max-w-lg ${className}`}>
      <form
        className="relative flex items-center border border-white/[0.06] bg-[rgba(0,0,0,.5)] backdrop-blur-3xl p-2 transition-all duration-300 focus-within:border-accent/20"
        onSubmit={handleSubscribe}
      >
        {/* Corner brackets */}
        <div className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-white/20" />
        <div className="absolute -top-px -right-px w-2.5 h-2.5 border-t border-r border-white/20" />
        <div className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b border-l border-white/20" />
        <div className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-white/20" />

        <div className="flex flex-1 items-center gap-3 pl-4">
          <span className="terminal-text text-white/15 text-sm shrink-0">&gt;</span>
          <input
            type="text"
            placeholder={placeholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (formStatus !== "idle" && formStatus !== "loading") {
                setFormStatus("idle");
                setFormMessage("");
              }
            }}
            disabled={formStatus === "loading"}
            className="terminal-text w-full bg-transparent py-3 text-base text-foreground outline-none placeholder:text-white/20 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={formStatus === "loading"}
          className="shrink-0 cursor-pointer border border-accent/60 px-6 py-3 font-accent text-xs uppercase tracking-[0.15em] text-accent transition-all duration-200 hover:bg-accent hover:text-white hover:border-accent active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
        >
          {formStatus === "loading" ? "Sending..." : buttonText}
        </button>
      </form>
      <p className={`terminal-text mt-3 text-[11px] tracking-[0.15em] uppercase ${formStatus === "success" ? "text-green-400/80" : formStatus === "duplicate" ? "text-pink-300/80" : formStatus === "error" ? "text-accent/80" : "text-white/15"}`}>
        {glitchedStatus}
      </p>
    </div>
  );
}
