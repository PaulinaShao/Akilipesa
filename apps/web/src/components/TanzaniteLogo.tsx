export default function TanzaniteLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`px-2 py-1 rounded-md tz-gem-border text-xs text-white/90 ${className}`}>
      <span className="tz-shimmer font-semibold tracking-wider">A K I L I P E S A</span>
    </div>
  );
}
