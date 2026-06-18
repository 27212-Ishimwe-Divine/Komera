export default function TypingIndicator() {
  return (
    <div className="flex justify-start gap-2.5">
      <div
        className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-hill to-lake text-sm text-white"
        aria-hidden
      >
        🌅
      </div>
      <div className="rounded-[1.25rem] rounded-tl-sm border border-[#E8DFD4] bg-card px-5 py-4 shadow-sm">
        <div className="flex gap-1.5" aria-label="Ndwira is thinking">
          <span className="typing-dot h-2 w-2 rounded-full bg-lake" />
          <span className="typing-dot h-2 w-2 rounded-full bg-lake" />
          <span className="typing-dot h-2 w-2 rounded-full bg-lake" />
        </div>
      </div>
    </div>
  );
}
