import { Bug, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
          <Bug size={18} />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight text-text">
          DebugPilot
        </span>
        <span className="ml-2 hidden rounded-full border border-border px-2 py-0.5 text-[11px] text-muted sm:inline">
          AI Bug Detection Assistant
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-text leading-tight">{user?.name}</p>
          <p className="text-xs text-muted leading-tight">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted transition hover:border-danger/50 hover:text-danger cursor-pointer"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </header>
  );
}
