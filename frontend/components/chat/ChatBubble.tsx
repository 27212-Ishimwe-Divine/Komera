interface ChatBubbleProps {
  role: 'user' | 'model' | string;
  content: string;
}

export default function ChatBubble({ role, content }: ChatBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} gap-2.5`}>
      {!isUser && (
        <div
          className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-hill to-lake text-sm text-white shadow-sm"
          aria-hidden
        >
          🌅
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
          isUser
            ? 'rounded-[1.25rem] rounded-tr-sm bg-hill text-white'
            : 'rounded-[1.25rem] rounded-tl-sm border border-[#E8DFD4] bg-card text-foreground'
        }`}
      >
        {!isUser && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-lake">Ndwira</p>
        )}
        {content}
      </div>
    </div>
  );
}
