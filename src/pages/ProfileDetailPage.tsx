import { useEffect, useState, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse, Platform, UserProfileSummary } from "@/types";
import { formatEngagementRate, formatFollowers } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useInfluencerStore } from "@/store/influencerStore";
import {
  ChevronLeft,
  FolderPlus,
  Check,
  ExternalLink,
  Users,
  Flame,
  Layers,
  ThumbsUp,
  MessageSquare,
  Eye,
  BarChart3,
} from "lucide-react";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const queryPlatform = (searchParams.get("platform") as Platform) || "instagram";

  const { lists, addProfileToList } = useInfluencerStore();

  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);
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

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500 font-bold mb-4">Invalid profile</p>
          <Link
            to="/"
            className="px-5 py-2.5 btn-gradient text-white rounded-full text-xs font-black transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-button"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-24 gap-2">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-400 dark:text-zinc-500 text-xs font-bold">
            Loading profile...
          </p>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="text-center py-12 max-w-md mx-auto">
          <p className="text-red-655 dark:text-red-405 font-bold mb-4">
            Could not load profile details for {username}
          </p>
          <Link
            to="/"
            className="px-5 py-2.5 btn-gradient text-white rounded-full text-xs font-black transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-button"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  const handleAddToList = (listName: string) => {
    const summaryProfile: UserProfileSummary = {
      user_id: user.user_id,
      username: user.username,
      url: user.url,
      picture: user.picture,
      fullname: user.fullname,
      is_verified: user.is_verified,
      followers: user.followers,
      engagements: user.engagements,
      engagement_rate: user.engagement_rate,
      platform: queryPlatform,
    };
    addProfileToList(listName, summaryProfile);
    setJustAdded(listName);
    setTimeout(() => setJustAdded(null), 2000);
    setDropdownOpen(false);
  };

  const getPlatformConfig = (p: Platform) => {
    switch (p) {
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
          tagClass: "text-zinc-650 bg-zinc-105",
        };
    }
  };

  const platConfig = getPlatformConfig(queryPlatform);

  return (
    <Layout>
      <div className="max-w-[1600px] w-full mx-auto flex flex-col text-left">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Discover
          </Link>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Creator Profile Banner */}
          <div className="md:col-span-4 flex flex-col p-6.5 flat-card bg-white/70 dark:bg-[#13172a]/65">
            <div className="flex flex-col items-center text-center">
              {/* Platform Ring Large Avatar */}
              <div className={`p-[2px] rounded-full shadow-md ${platConfig.ringClass} mb-4`}>
                <img
                  src={user.picture}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover border-2 border-white dark:border-[#13172a]"
                />
              </div>

              <h2 className="text-lg font-black text-zinc-955 dark:text-white m-0 flex items-center justify-center gap-1.5">
                @{user.username}
                <VerifiedBadge verified={user.is_verified} />
              </h2>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-semibold">{user.fullname}</p>
              
              <div className={`mt-3.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${platConfig.tagClass}`}>
                {platConfig.label}
              </div>

              {/* Actions row */}
              <div className="flex flex-col gap-2 w-full mt-6">
                {/* Save Dropdown button */}
                <div className="relative w-full" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`w-full py-2.5 rounded-full border text-xs font-black tracking-tight transition-all flex items-center justify-center gap-1.5 cursor-pointer btn-animate shadow-button ${
                      justAdded
                        ? "bg-emerald-50 border-emerald-250 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400"
                        : dropdownOpen
                        ? "bg-zinc-100 dark:bg-zinc-800 border-zinc-350 dark:border-zinc-700 text-zinc-955 dark:text-zinc-50"
                        : "btn-gradient text-white shadow-button"
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved to {justAdded}</span>
                      </>
                    ) : (
                      <>
                        <FolderPlus className="w-4 h-4" />
                        <span>Save to Campaign</span>
                      </>
                    )}
                  </button>

                  {dropdownOpen && (
                    <div className="absolute left-0 right-0 mt-1.5 w-full bg-white dark:bg-zinc-900 border border-zinc-200/85 dark:border-zinc-800 rounded-xl shadow-menu py-1 z-20 animate-fade">
                      <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest px-2.5 py-1 border-b border-zinc-105 dark:border-zinc-800/80 mb-1">
                        Select Campaign
                      </p>
                      <div className="max-h-36 overflow-y-auto">
                        {Object.keys(lists).map((listName) => {
                          const isAdded = lists[listName]?.some((p) => p.user_id === user.user_id);
                          return (
                            <button
                              key={listName}
                              disabled={isAdded}
                              onClick={() => handleAddToList(listName)}
                              className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between transition-colors ${
                                isAdded
                                  ? "text-zinc-300 dark:text-zinc-650 cursor-not-allowed bg-zinc-50/50 dark:bg-zinc-800/20"
                                  : "text-zinc-700 dark:text-zinc-305 hover:bg-indigo-50 dark:hover:bg-zinc-850 hover:text-indigo-650 dark:hover:text-indigo-400"
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

                {/* View on platform */}
                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-indigo-50/50 dark:hover:bg-zinc-850 text-zinc-650 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <span>View Profile Page</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
            
            {user.description && (
              <div className="mt-5 border-t border-zinc-150 dark:border-zinc-800/60 pt-4.5">
                <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed m-0 font-semibold">
                  {user.description}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Statistics Grid */}
          <div className="md:col-span-8 flex flex-col gap-4">
            <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest m-0">
              Metric Indicators
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              
              {/* Followers */}
              <div className="flat-card flex items-start gap-4 p-5 bg-white/70 dark:bg-[#13172a]/65 hover:-translate-y-0.5">
                <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-2.5 rounded-2xl flex-shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">
                    Audience
                  </p>
                  <p className="text-xl font-black leading-none text-gradient-primary font-mono">
                    {formatFollowers(user.followers)}
                  </p>
                </div>
              </div>

              {/* Engagement Rate */}
              <div className="flat-card flex items-start gap-4 p-5 bg-white/70 dark:bg-[#13172a]/65 hover:-translate-y-0.5">
                <div className="bg-violet-500/10 text-violet-600 dark:text-violet-400 p-2.5 rounded-2xl flex-shrink-0">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">
                    Engagement
                  </p>
                  <p className="text-xl font-black leading-none text-gradient-accent font-mono">
                    {formatEngagementRate(user.engagement_rate)}
                  </p>
                </div>
              </div>

              {/* Engagements */}
              {user.engagements !== undefined && (
                <div className="flat-card flex items-start gap-4 p-5 bg-white/70 dark:bg-[#13172a]/65 hover:-translate-y-0.5">
                  <div className="bg-rose-500/10 text-rose-600 dark:text-rose-455 p-2.5 rounded-2xl flex-shrink-0">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">
                      Total Eng.
                    </p>
                    <p className="text-xl font-black leading-none text-gradient-primary font-mono">
                      {formatFollowersDetail(user.engagements)}
                    </p>
                  </div>
                </div>
              )}

              {/* Total Posts */}
              {user.posts_count !== undefined && (
                <div className="flat-card flex items-start gap-4 p-5 bg-white/70 dark:bg-[#13172a]/65 hover:-translate-y-0.5">
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-405 p-2.5 rounded-2xl flex-shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">
                      Total Posts
                    </p>
                    <p className="text-xl font-black leading-none text-gradient-accent font-mono">
                      {user.posts_count}
                    </p>
                  </div>
                </div>
              )}

              {/* Avg Likes */}
              {user.avg_likes !== undefined && (
                <div className="flat-card flex items-start gap-4 p-5 bg-white/70 dark:bg-[#13172a]/65 hover:-translate-y-0.5">
                  <div className="bg-amber-500/10 text-amber-600 dark:text-amber-400 p-2.5 rounded-2xl flex-shrink-0">
                    <ThumbsUp className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">
                      Avg Likes
                    </p>
                    <p className="text-xl font-black leading-none text-gradient-primary font-mono">
                      {formatFollowersDetail(user.avg_likes)}
                    </p>
                  </div>
                </div>
              )}

              {/* Avg Comments */}
              {user.avg_comments !== undefined && (
                <div className="flat-card flex items-start gap-4 p-5 bg-white/70 dark:bg-[#13172a]/65 hover:-translate-y-0.5">
                  <div className="bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 p-2.5 rounded-2xl flex-shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">
                      Avg Comments
                    </p>
                    <p className="text-xl font-black leading-none text-gradient-accent font-mono">
                      {formatFollowersDetail(user.avg_comments)}
                    </p>
                  </div>
                </div>
              )}

              {/* Avg Views */}
              {user.avg_views !== undefined && user.avg_views > 0 && (
                <div className="flat-card flex items-start gap-4 p-5 bg-white/70 dark:bg-[#13172a]/65 hover:-translate-y-0.5 col-span-2 sm:col-span-1">
                  <div className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 p-2.5 rounded-2xl flex-shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">
                      Avg Views
                    </p>
                    <p className="text-xl font-black leading-none text-gradient-primary font-mono">
                      {formatFollowersDetail(user.avg_views)}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
          
        </div>
      </div>
    </Layout>
  );
}
export default ProfileDetailPage;
