import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useInfluencerStore } from "@/store/influencerStore";
import { FolderPlus, Check, Users, Flame, ChevronRight } from "lucide-react";
import { formatFollowers } from "@/utils/formatters";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

export function ProfileCard({
  profile,
  platform,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const { lists, addProfileToList } = useInfluencerStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCardClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}`);
  };

  const handleAddToList = (listName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    addProfileToList(listName, { ...profile, platform });
    setJustAdded(listName);
    setTimeout(() => setJustAdded(null), 2000);
    setDropdownOpen(false);
  };

  const getPlatformConfig = (plat: Platform) => {
    switch (plat) {
      case "instagram":
        return {
          label: "Instagram",
          ringClass: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]",
          tagClass: "text-fuchsia-600 dark:text-fuchsia-400 bg-fuchsia-500/5 dark:bg-fuchsia-500/10 border-fuchsia-500/10 dark:border-fuchsia-500/20",
        };
      case "youtube":
        return {
          label: "YouTube",
          ringClass: "bg-gradient-to-tr from-[#ff0000] to-[#b30000]",
          tagClass: "text-red-655 dark:text-red-405 bg-red-500/5 dark:bg-red-500/10 border-red-500/10 dark:border-red-500/20",
        };
      case "tiktok":
        return {
          label: "TikTok",
          ringClass: "bg-gradient-to-tr from-[#00f2fe] to-[#4facfe]",
          tagClass: "text-cyan-600 dark:text-cyan-455 bg-cyan-50/5 dark:bg-cyan-500/10 border-cyan-500/10 dark:border-cyan-500/20",
        };
      default:
        return {
          label: "Creator",
          ringClass: "bg-zinc-200 dark:bg-zinc-800",
          tagClass: "text-zinc-650 bg-zinc-100",
        };
    }
  };

  const platConfig = getPlatformConfig(platform);

  return (
    <div
      onClick={handleCardClick}
      className="flat-card flex flex-col p-5.5 cursor-pointer relative w-full h-full text-left bg-white/70 dark:bg-[#13172a]/65"
    >
      {/* Top row: Platform Tag & Campaign Selector */}
      <div className="flex items-center justify-between mb-4.5">
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${platConfig.tagClass}`}>
          {platConfig.label}
        </span>

        {/* Campaign Adder Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen(!dropdownOpen);
            }}
            className={`px-3.5 py-1.5 rounded-full border text-[10px] font-extrabold transition-all flex items-center gap-1 cursor-pointer btn-animate ${
              justAdded
                ? "bg-emerald-500/10 border-emerald-500/20 dark:bg-emerald-950/20 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                : dropdownOpen
                ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-350 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50"
                : "btn-gradient text-white shadow-button"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Save</span>
              </>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-48 bg-white dark:bg-zinc-900 border border-zinc-200/85 dark:border-zinc-800 rounded-xl shadow-menu py-1 z-20 animate-fade">
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest px-2.5 py-1 border-b border-zinc-105 dark:border-zinc-800/80 mb-1">
                Save to List
              </p>
              <div className="max-h-36 overflow-y-auto">
                {Object.keys(lists).map((listName) => {
                  const isAdded = lists[listName]?.some((p) => p.user_id === profile.user_id);
                  return (
                    <button
                      key={listName}
                      disabled={isAdded}
                      onClick={(e) => handleAddToList(listName, e)}
                      className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between transition-colors ${
                        isAdded
                          ? "text-zinc-300 dark:text-zinc-650 cursor-not-allowed bg-zinc-50/50 dark:bg-zinc-800/20"
                          : "text-zinc-700 dark:text-zinc-305 hover:bg-indigo-50/50 dark:hover:bg-zinc-850 hover:text-indigo-600 dark:hover:text-indigo-400"
                      }`}
                    >
                      <span className="truncate pr-2">{listName}</span>
                      {isAdded && <Check className="w-3.5 h-3.5 text-zinc-300 dark:text-zinc-650 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile summary info */}
      <div className="flex items-center gap-3.5 mb-5">
        {/* Platform Colored Ring around Avatar */}
        <div className={`p-[1.5px] rounded-full flex-shrink-0 shadow-sm ${platConfig.ringClass}`}>
          <img
            src={profile.picture}
            alt={profile.username}
            className="w-13 h-13 rounded-full object-cover border-2 border-white dark:border-[#13172a]"
          />
        </div>
        <div className="min-w-0">
          <div className="text-sm font-extrabold text-zinc-950 dark:text-zinc-50 truncate flex items-center gap-1">
            @{profile.username}
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500 truncate mt-0.5 font-semibold">
            {profile.fullname}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-auto flex justify-between items-center pt-3.5 border-t border-zinc-150 dark:border-zinc-800/60">
        <div className="flex gap-5">
          <div>
            <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider leading-none mb-1 flex items-center gap-1">
              <Users className="w-2.5 h-2.5 text-indigo-550" />
              <span>Reach</span>
            </p>
            <p className="text-xs font-black mt-1 leading-none text-gradient-primary font-mono">
              {formatFollowers(profile.followers)}
            </p>
          </div>

          {profile.engagement_rate !== undefined && (
            <div>
              <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider leading-none mb-1 flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-pink-500" />
                <span>Engagement</span>
              </p>
              <p className="text-xs font-black mt-1 leading-none text-gradient-accent font-mono">
                {(profile.engagement_rate * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </div>
        
        {/* Navigation Indicator */}
        <ChevronRight className="w-4 h-4 text-zinc-350 dark:text-zinc-700 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </div>
  );
}
export default ProfileCard;
