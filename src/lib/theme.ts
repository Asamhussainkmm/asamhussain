export const THEME_STORAGE_KEY = "theme";

export type Theme = "light" | "dark";

export function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Inlined into <head> so the right class lands on <html> before first paint
 * — avoids a light/dark flash. The server always renders with the "dark"
 * class (matching the site's original default); this only removes it if the
 * visitor previously chose light.
 */
export const themeInitScript = `
(function () {
  try {
    if (localStorage.getItem("${THEME_STORAGE_KEY}") === "light") {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {}
})();
`;
