"use client"

import { useState, useRef, useEffect } from "react"
import VoiceRecorder from "@/components/voice-recorder"
import ChatMessage from "@/components/chat-message"
import ChatSidebar from "@/components/chat-sidebar"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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

export default function VoiceChat() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "Conversation about marketing",
      messages: [
        { id: "1-1", role: "user", content: "How can I improve my marketing strategy?" },
        {
          id: "1-2",
          role: "assistant",
          content: "You can start by analyzing your target audience and creating relevant content for them.",
        },
      ],
      lastUpdated: new Date(2023, 5, 15),
    },
    {
      id: "2",
      title: "Trip planning",
      messages: [
        { id: "2-1", role: "user", content: "What places should I visit in Barcelona?" },
        {
          id: "2-2",
          role: "assistant",
          content:
            "Barcelona has many interesting places such as the Sagrada Familia, Park Güell, and the Gothic Quarter.",
        },
      ],
      lastUpdated: new Date(2023, 5, 10),
    }
  ])
  

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedChatId, chats])

  const selectedChat = selectedChatId ? chats.find((chat) => chat.id === selectedChatId) : null

  const handleNewMessage = (content: string, role: "user" | "assistant") => {
    if (!selectedChatId) {
      // Create a new chat if none is selected
      const newChat: Chat = {
        id: Date.now().toString(),
        title: content.length > 30 ? `${content.substring(0, 30)}...` : content,
        messages: [
          {
            id: Date.now().toString(),
            role,
            content,
          },
        ],
        lastUpdated: new Date(),
      }

      setChats((prev) => [newChat, ...prev])
      setSelectedChatId(newChat.id)
      return
    }

    // Add message to existing chat
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                id: Date.now().toString(),
                role,
                content,
              },
            ],
            lastUpdated: new Date(),
          }
        }
        return chat
      }),
    )

    // If this is a user message, simulate an assistant response
    if (role === "user") {
      // In a real app, you would send the message to your API here
      setTimeout(() => {
        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id === selectedChatId) {
              return {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: "I'm doing good and you?",
                  },
                ],
                lastUpdated: new Date(),
              }
            }
            return chat
          }),
        )
      }, 2000)
    }
  }

  const createNewChat = () => {
    setSelectedChatId(null)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-7.3rem)] pt-16 bg-background text-foreground dark">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelectChat={(id) => {
          setSelectedChatId(id)
          setIsMobileMenuOpen(false)
        }}
        onNewChat={createNewChat}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-[calc(100vh-7.3rem)]">
        <header className="p-4 border-b border-border flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
          <h1 className="text-2xl font-bold text-center flex-1 bg-clip-text text-transparent bg-gradient-to-r from-[#a78bfa] to-[#60a5fa]">
            Wally
          </h1>
          <Button variant="ghost" size="sm" onClick={createNewChat} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </header>

        <main className="flex-1 p-4 overflow-hidden flex flex-col">
          {selectedChat ? (
            <Card className="flex-1 bg-card/50 border border-border rounded-lg overflow-hidden flex flex-col shadow-lg">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map((message) => (
                  <ChatMessage key={message.id} role={message.role} content={message.content} />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border">
                <VoiceRecorder onNewMessage={handleNewMessage} />
              </div>
            </Card>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <Card className="p-8 bg-card/50 border border-border rounded-lg max-w-md mx-auto text-center shadow-lg">
                <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#a78bfa] to-[#60a5fa]">
                  Select a chat to get started
                </h2>
                <p className="text-muted-foreground mb-6">
                  Choose an existing conversation from the sidebar or start a new one.
                </p>
                <Button
                  onClick={createNewChat}
                  className="mx-auto flex items-center gap-2 bg-[#4f6ef7] hover:bg-[#3b5ef5] text-white"
                >
                  <PlusCircle className="h-5 w-5" />
                  Start new conversation
                </Button>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
