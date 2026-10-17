
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'claybloom-theme';

function getInitialTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);

    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch {
      // Le thème fonctionne même si le stockage est indisponible.
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((previous) => !previous)}
      aria-label={dark ? 'Activer le thème clair' : 'Activer le thème sombre'}
      title={dark ? 'Thème clair' : 'Thème sombre'}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center
        rounded-full border border-pink-200 bg-white text-stone-700
        transition duration-200 hover:bg-pink-50
        dark:border-[#55445f] dark:bg-[#30293a] dark:text-amber-300
        dark:hover:bg-[#403448]"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
