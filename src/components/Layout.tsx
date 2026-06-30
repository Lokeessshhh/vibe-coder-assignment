import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useInfluencerStore } from "@/store/influencerStore";
import { Sun, Moon, Sparkles } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const { theme, toggleTheme } = useInfluencerStore();

  // Apply dark mode class to html document element reactively
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6fc] dark:bg-[#0b0d19] text-zinc-950 dark:text-zinc-200 transition-colors duration-250 pb-8">
      {/* Brand Header */}
      <header className="px-6 py-5 flex items-center justify-between">
        <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between px-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-black text-lg tracking-tight text-zinc-950 dark:text-white hover:opacity-85 transition-opacity"
          >
            {/* Colorful Brand Icon Badge */}
            <div className="bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white p-1.5 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>VibeCoder</span>
          </Link>
          
          <div className="flex items-center gap-3.5">
            <span className="text-[10px] bg-white/80 dark:bg-[#13172a]/70 text-zinc-500 dark:text-zinc-400 px-3.5 py-1 rounded-full font-mono border border-zinc-200/50 dark:border-zinc-800/50 font-extrabold shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
              console v1.4
            </span>
            
            {/* Theme Toggle Capsule Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#13172a] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-zinc-650 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer theme-icon-rotate shadow-sm"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? (
                <Moon className="w-3.5 h-3.5" />
              ) : (
                <Sun className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Floating Main Workspace Container */}
      <main className="flex-grow max-w-[1600px] w-full mx-auto px-4 md:px-6 flex flex-col min-w-0">
        <div className="flex-grow bg-white dark:bg-[#13172a] rounded-[28px] md:rounded-[32px] p-6 md:p-10 border border-zinc-200/70 dark:border-[#20253f]/80 shadow-lg flex flex-col min-w-0 animate-dashboard-fade">
          {title && (
            <div className="mb-6 text-left border-b border-zinc-100 dark:border-zinc-900 pb-3">
              <h1 className="text-xl font-extrabold tracking-tighter text-zinc-955 dark:text-white m-0">
                {title}
              </h1>
            </div>
          )}
          <div className="flex-grow w-full flex flex-col min-w-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
export default Layout;
