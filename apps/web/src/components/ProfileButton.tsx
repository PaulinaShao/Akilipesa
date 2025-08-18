import { UserCircle2 } from "lucide-react";
import { useAuthStatus } from "@/auth/useAuthStatus";

export default function ProfileButton({ onClick }: { onClick: () => void }) {
  const { isAuthed, loading } = useAuthStatus();

  return (
    <button
      onClick={onClick}
      className="relative h-10 w-10 rounded-full tz-glass grid place-items-center"
      aria-label={isAuthed ? "Open profile" : "Sign in"}
    >
      <UserCircle2 className="h-6 w-6 text-white/90" />
      {!loading && !isAuthed && (
        <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow tz-gem-border">
          SIGN&nbsp;IN
        </span>
      )}
    </button>
  );
}
