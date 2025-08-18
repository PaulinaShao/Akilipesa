import { UserCircle2 } from "lucide-react";
import { useAuthStatus } from "@/auth/useAuthStatus";

export default function ProfileButton({ onClick }: { onClick: () => void }) {
  const { isAuthed, loading } = useAuthStatus();

  return (
    <button
      onClick={onClick}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur text-white touch-target"
      style={{ minHeight: '44px', minWidth: '44px' }} // Ensure minimum tap target
      aria-label={isAuthed ? "Open profile" : "Sign in"}
    >
      <UserCircle2 className="h-6 w-6" />
      {!loading && !isAuthed && (
        <span
          className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white shadow"
          role="status"
        >
          SIGN&nbsp;IN
        </span>
      )}
    </button>
  );
}
