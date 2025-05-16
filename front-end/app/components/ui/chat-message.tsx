import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  return (
    <div className={cn("flex items-start gap-4 max-w-[80%]", role === "user" ? "ml-auto" : "mr-auto")}>
      {role === "assistant" && (
        <Avatar>
          <AvatarFallback className="bg-[#4f6ef7]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-3.5l6-4.5-6-4.5z"
                fill="white"
              />
            </svg>
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "rounded-lg p-3",
          role === "user"
            ? "bg-[#4f6ef7] text-white rounded-tr-none"
            : "bg-accent text-accent-foreground rounded-tl-none",
        )}
      >
        <p>{content}</p>
      </div>

      {role === "user" && (
        <Avatar>
          <AvatarFallback className="bg-[#8b5cf6]">TÚ</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}
