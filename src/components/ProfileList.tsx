import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  return (
    <div className="w-full">
      {profiles.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-slate-400 dark:text-slate-500 font-medium">
            No creators found matching "{searchQuery}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.user_id}
              profile={profile}
              platform={platform}
              searchQuery={searchQuery}
              onProfileClick={onProfileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
