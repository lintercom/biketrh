import { initials } from "@/lib/format";
import type { Profile } from "@/lib/types";

type AvatarProps = {
  profile: Pick<Profile, "display_name" | "avatar_url">;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "h-9 w-9 text-sm",
  md: "h-11 w-11 text-base",
  lg: "h-16 w-16 text-xl"
};

export function Avatar({ profile, size = "md" }: AvatarProps) {
  if (profile.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={profile.display_name}
        className={`${sizeClass[size]} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass[size]} flex shrink-0 items-center justify-center rounded-full bg-ink text-white`}
      aria-hidden="true"
    >
      {initials(profile.display_name)}
    </div>
  );
}
