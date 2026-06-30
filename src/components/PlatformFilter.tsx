import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search } from "lucide-react";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  // Platform inline SVGs mapper
  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case "instagram":
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        );
      case "youtube":
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.56 49.56 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
            <polygon points="10 15 15 12 10 9 10 15"/>
          </svg>
        );
      case "tiktok":
        return (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Color-coded tab highlights matching platform gradients
  const getSelectedStyles = (platform: Platform) => {
    switch (platform) {
      case "instagram":
        return "bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-650 text-white shadow-md";
      case "youtube":
        return "bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md";
      case "tiktok":
        return "bg-gradient-to-r from-cyan-450 via-teal-500 to-blue-600 text-white shadow-md";
      default:
        return "bg-zinc-950 dark:bg-white text-white dark:text-zinc-950";
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      {/* Platform Segmented Capsule Switcher */}
      <div className="flex p-1 bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/40 rounded-full w-fit">
        {PLATFORMS.map((p) => {
          const isSelected = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-full text-xs font-bold tracking-tight transition-all duration-200 cursor-pointer ${
                isSelected
                  ? getSelectedStyles(p)
                  : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
              }`}
            >
              {getPlatformIcon(p)}
              <span>{getPlatformLabel(p)}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input Box */}
      <div className="relative flex-1 max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-450 dark:text-zinc-500">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search creators..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-950/40 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-zinc-955 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-550 transition-all shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
        />
      </div>
    </div>
  );
}
export default PlatformFilter;
