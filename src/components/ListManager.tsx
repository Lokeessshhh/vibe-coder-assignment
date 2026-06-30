import { useState } from "react";
import { useInfluencerStore } from "@/store/influencerStore";
import { Plus, Trash2, Folder, X, Users, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import type { Platform } from "@/types";

export function ListManager() {
  const {
    lists,
    activeList,
    createList,
    deleteList,
    setActiveList,
    removeProfileFromList,
  } = useInfluencerStore();

  const [newListName, setNewListName] = useState("");

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (newListName.trim()) {
      createList(newListName.trim());
      setNewListName("");
    }
  };

  const activeProfiles = lists[activeList] || [];

  // Get ring colors matching platform
  const getPlatformRing = (plat: Platform | undefined) => {
    switch (plat) {
      case "instagram":
        return "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]";
      case "youtube":
        return "bg-gradient-to-tr from-[#ff0000] to-[#b30000]";
      case "tiktok":
        return "bg-gradient-to-tr from-[#00f2fe] to-[#4facfe]";
      default:
        return "bg-zinc-300 dark:bg-zinc-700";
    }
  };

  return (
    <div className="flat-card flex flex-col h-full p-5.5 text-left bg-white/70 dark:bg-[#13172a]/65">
      {/* Title */}
      <div className="flex items-center gap-2 mb-5 pb-2.5 border-b border-zinc-150 dark:border-zinc-800/60">
        <Compass className="text-indigo-600 dark:text-indigo-400 w-4 h-4 flex-shrink-0" />
        <h2 className="text-xs font-black uppercase tracking-wider text-zinc-950 dark:text-white m-0">
          Campaign Workspace
        </h2>
      </div>

      {/* Create New List Form - Capsule Gradient Style */}
      <form onSubmit={handleCreateList} className="flex gap-1.5 mb-6">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New list name..."
          className="flex-1 min-w-0 px-4 py-2 text-xs bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-full focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-zinc-955 dark:text-zinc-50 placeholder-zinc-450 dark:placeholder-zinc-550 transition-shadow"
        />
        <button
          type="submit"
          className="px-4 py-2 btn-gradient text-white rounded-full text-xs font-black flex items-center justify-center transition-all shadow-button cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Campaign List */}
      <div className="mb-6">
        <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">
          Select Active Campaign
        </p>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {Object.keys(lists).map((name) => {
            const isActive = activeList === name;
            const count = lists[name]?.length || 0;
            return (
              <div
                key={name}
                className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all relative ${
                  isActive
                    ? "bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-650 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60 shadow-sm"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-zinc-600 dark:text-zinc-400 border border-transparent"
                }`}
                onClick={() => setActiveList(name)}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-3.5 bottom-3.5 w-0.5 bg-gradient-to-b from-indigo-500 to-pink-500 rounded-full" />
                )}

                <div className="flex items-center gap-2.5 min-w-0 pl-1">
                  <Folder
                    className={`w-3.5 h-3.5 flex-shrink-0 ${
                      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-450"
                    }`}
                  />
                  <span className="text-xs font-bold truncate">{name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-semibold border ${
                    isActive 
                      ? "bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25"
                      : "bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200/20"
                  }`}>
                    {count}
                  </span>
                </div>
                
                {name !== "My Favorites" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (
                        confirm(
                          `Are you sure you want to delete campaign "${name}"?`
                        )
                      ) {
                        deleteList(name);
                      }
                    }}
                    className="opacity-0 group-hover:opacity-100 text-zinc-450 hover:text-red-500 transition-opacity p-0.5 cursor-pointer"
                    title="Delete campaign"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Profiles in Active List */}
      <div className="flex-grow flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold text-zinc-405 dark:text-zinc-500 uppercase tracking-widest m-0">
            Creators Saved
          </p>
          <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-550 font-bold">
            {activeProfiles.length} Total
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[180px]">
          {activeProfiles.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-10 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[20px] bg-zinc-50/20 dark:bg-zinc-950/20">
              <Users className="w-6 h-6 text-zinc-300 dark:text-zinc-700 mb-2" />
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 px-3 leading-normal font-bold">
                Browse influencers and click "Save" to build your roster here.
              </p>
            </div>
          ) : (
            activeProfiles.map((p) => (
              <div
                key={p.user_id}
                className="flex items-center justify-between p-2.5 bg-white/40 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-800/60 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
              >
                <Link
                  to={`/profile/${p.username}?platform=${p.platform || "instagram"}`}
                  className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-85"
                >
                  {/* Platform Colored Ring around Mini Avatar */}
                  <div className={`p-[1.5px] rounded-full flex-shrink-0 ${getPlatformRing(p.platform)}`}>
                    <img
                      src={p.picture}
                      alt={p.username}
                      className="w-7 h-7 rounded-full object-cover border border-white dark:border-[#13172a]"
                    />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-bold text-zinc-950 dark:text-zinc-100 truncate">
                      @{p.username}
                    </p>
                    <p className="text-[10px] text-zinc-450 dark:text-zinc-500 truncate font-semibold">
                      {p.fullname}
                    </p>
                  </div>
                </Link>
                <button
                  onClick={() => removeProfileFromList(activeList, p.user_id)}
                  className="text-zinc-400 hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                  title="Remove from campaign"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
export default ListManager;
