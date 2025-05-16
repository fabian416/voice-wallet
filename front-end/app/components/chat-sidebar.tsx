"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { PlusCircle, X } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  lastUpdated: Date
}

interface ChatSidebarProps {
  chats: Chat[]
  selectedChatId: string | null
  onSelectChat: (id: string) => void
  onNewChat: () => void
  isOpen: boolean
  onClose: () => void
}

export default function ChatSidebar({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  isOpen,
  onClose,
}: ChatSidebarProps) {
  // Format date to relative time (today, yesterday, or date)
  const formatDate = (date: Date) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date >= today) {
      return "Hoy"
    } else if (date >= yesterday) {
      return "Ayer"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#4f6ef7] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-3.5l6-4.5-6-4.5z"
                  fill="white"
                />
              </svg>
            </div>
            <h2 className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#a78bfa] to-[#60a5fa]">
              Wally
            </h2>
          </div>
          <Button variant="ghost" size="sm" className="md:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-2">
          <Button onClick={onNewChat} className="w-full justify-start gap-2 bg-[#4f6ef7] hover:bg-[#3b5ef5] text-white">
            <PlusCircle className="h-4 w-4" />
            Nueva conversación
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-colors",
                    "hover:bg-accent",
                    selectedChatId === chat.id ? "bg-accent" : "bg-transparent",
                  )}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-medium truncate">{chat.title}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(chat.lastUpdated)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-1">
                    {chat.messages[chat.messages.length - 1]?.content}
                  </p>
                </button>
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground">No hay conversaciones</div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
