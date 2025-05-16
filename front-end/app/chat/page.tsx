'use client'
import { useEffect, useState } from 'react';
import { getChat, getChats, sendMessage, createNewChat } from '../api';
import type { Chat, Message } from '../types/chatTypes';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';
import { Input } from '../components/ui/input';

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [chat, setChat] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  async function fetchChats() {
    const data = await getChats();
    setChats(data);
  }

  async function fetchChat(chatId: string) {
    const data = await getChat(chatId);
    setChat(data);
  }

  async function handleNewChat() {
    try {
      const newChatId = await createNewChat();
      await fetchChats();
      setSelectedChat(newChatId);
    } catch (error) {
      console.error('Error creating new chat:', error);
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    
    if (!selectedChat || !inputMessage.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      await sendMessage(selectedChat, inputMessage);
      setInputMessage('');
      await fetchChat(selectedChat);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchChat(selectedChat);
    }
  }, [selectedChat]);

  return (
    <div className="flex h-screen p-4 gap-4 mt-10">
      {/* Sidebar with chat list */}
      <Card className="w-64 h-[80vh]">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Chats
            <Button
              onClick={handleNewChat}
              size="sm"
              variant="outline"
            >
              New Chat
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-8rem)] px-4">
            <div className="flex flex-col gap-2">
              {chats.map((chat) => (
                <Button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat.id)}
                  variant={selectedChat === chat.id ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  {chat.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main chat area */}
      <Card className="flex-1 h-full flex flex-col">
        <CardHeader>
          <CardTitle>
            {selectedChat 
              ? chats.find(c => c.id === selectedChat)?.title || 'Chat'
              : 'Select a chat to start'
            }
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="flex flex-col gap-4">
              {selectedChat && chat.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-4'
                        : 'bg-muted mr-4'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={!selectedChat || isLoading}
              className="flex-1"
            />
            <Button 
              type="submit"
              disabled={!selectedChat || !inputMessage.trim() || isLoading}
            >
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

export default App
