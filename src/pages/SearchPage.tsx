import { useInfluencerStore } from "@/store/influencerStore";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { ListManager } from "@/components/ListManager";
import { extractProfiles, filterProfiles } from "@/utils/dataHelpers";
import { formatFollowers } from "@/utils/formatters";
import { BarChart3, ShieldCheck, FolderGit2 } from "lucide-react";

export function SearchPage() {
  const { platform, setPlatform, searchQuery, setSearchQuery, lists } =
    useInfluencerStore();

  const allProfiles = extractProfiles(platform);
  const filtered = filterProfiles(allProfiles, searchQuery);

  const handleProfileClick = (username: string) => {
    console.log("Clicked profile:", username);
  };

  // Calculate dynamic dashboard stats
  const totalReach = allProfiles.reduce((acc, curr) => acc + curr.followers, 0);
  const verifiedCount = allProfiles.filter((p) => p.is_verified).length;
  const verifiedPercentage = Math.round((verifiedCount / allProfiles.length) * 100);
  const campaignCount = Object.keys(lists).length;

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lists Sidebar */}
        <aside className="lg:col-span-3 h-full">
          <ListManager />
        </aside>

        {/* Search Results Area */}
        <div className="lg:col-span-9 flex flex-col min-w-0">
          
          {/* Header Description & Overview Stats */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8.5">
            <div className="text-left">
              <h2 className="text-2xl font-black text-zinc-950 dark:text-white m-0 tracking-tighter">
                Discover Console
              </h2>
              <p className="text-xs text-zinc-450 dark:text-zinc-500 mt-1 font-semibold">
                Search and analyze creators to compile lists for campaigns.
              </p>
            </div>

            {/* Dynamic Metric Overview Panels */}
            <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-950/65 border border-zinc-200/50 dark:border-zinc-800/60 rounded-full px-5 py-2.5 shadow-sm">
              <div className="flex items-center gap-2 pr-4 border-r border-zinc-200 dark:border-zinc-800">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
                <div className="text-left">
                  <p className="text-[8px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 leading-none">
                    Total Reach
                  </p>
                  <p className="text-[11.5px] font-black leading-none mt-1 text-gradient-primary font-mono">
                    {formatFollowers(totalReach)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pr-4 border-r border-zinc-200 dark:border-zinc-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <div className="text-left">
                  <p className="text-[8px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 leading-none">
                    Verified
                  </p>
                  <p className="text-[11.5px] font-black leading-none mt-1 text-gradient-accent font-mono">
                    {verifiedPercentage}%
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <FolderGit2 className="w-3.5 h-3.5 text-pink-500" />
                <div className="text-left">
                  <p className="text-[8px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 leading-none">
                    Campaigns
                  </p>
                  <p className="text-[11.5px] font-black leading-none mt-1 text-gradient-accent font-mono">
                    {campaignCount} lists
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Platform filter and search input */}
          <PlatformFilter
            selected={platform}
            onChange={(p) => {
              setPlatform(p);
              setSearchQuery("");
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Showing stats */}
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest text-left mb-4">
            Showing {filtered.length} of {allProfiles.length} creators on {platform}
          </p>

          {/* Results Grid */}
          <ProfileList
            profiles={filtered}
            platform={platform}
            searchQuery={searchQuery}
            onProfileClick={handleProfileClick}
          />
        </div>
      </div>
    </Layout>
  );
}
export default SearchPage;
