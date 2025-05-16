import axios from 'axios';
import type { Chat, Message } from './types/chatTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URI || 'http://localhost:5000';

const axiosBase = axios.create({
  baseURL: API_BASE_URL,
});

export async function createNewChat(): Promise<string> {
  const response = await axiosBase.post('/agent/new_chat');
  return response.data.id;
}

export async function sendMessage(conversationId: string, message: string): Promise<string> {
  const token = localStorage.getItem('veridaAuthToken');
  const response = await axiosBase.post(`/agent/chat/${conversationId}`, {
    message,
    veridaAuthToken: token,
  });
  return response.data;
} 

export async function getChats(): Promise<Chat[]> {
  const response = await axiosBase.get('/agent/chat');
  return response.data;
}

export async function getChat(chatId: string): Promise<Message[]> {
  const response = await axiosBase.get(`/agent/chat/${chatId}`);
  return response.data;
}