import { useEffect, useState } from "react";

export const themeStorageKey = "vst-review-theme";
/** Runs before styles/content paint; storage access may be blocked by the browser. */
export const themeInitializer = `(function(){var t='light';try{var s=localStorage.getItem('${themeStorageKey}');if(s==='dark'||s==='light')t=s}catch(e){}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t})()`;

export function ThemeSettings() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    setTheme(
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    );
    const sync = (event: StorageEvent) => {
      if (event.key !== themeStorageKey) return;
      const next = event.newValue === "dark" ? "dark" : "light";
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
      setTheme(next);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function choose(next: "light" | "dark") {
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    setTheme(next);
    try {
      localStorage.setItem(themeStorageKey, next);
    } catch {
      /* Preference still applies for this visit. */
    }
  }
  return (
    <details className="theme-settings">
      <summary>Settings</summary>
      <div className="theme-panel" role="group" aria-label="Color theme">
        <span>Appearance</span>
        <div className="theme-options">
          <button
            type="button"
            aria-pressed={theme === "light"}
            onClick={() => choose("light")}
          >
            Light
          </button>
          <button
            type="button"
            aria-pressed={theme === "dark"}
            onClick={() => choose("dark")}
          >
            Dark
          </button>
        </div>
      </div>
    </details>
  );
}
