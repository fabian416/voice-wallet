'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { clearIdentityStorage } from '@/lib/utils';
import { Download } from "lucide-react"

export default function CredentialPage() {
  const router = useRouter()
  const [credential, setCredential] = useState<any | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('credential')

    if (!stored || stored === 'undefined') {
      clearIdentityStorage();
      router.push('/')
      return
    }

    try {
      const parsed = JSON.parse(stored)
      setCredential(parsed)
    } catch {
      clearIdentityStorage();
      router.push('/')
    }
  }, [])




  const handleDownloadVoiceprint = async () => {
    const did = localStorage.getItem("did");
    const resourceId = localStorage.getItem("linkedResource");
    if (!did || !resourceId) {
        console.warn("Missing DID or Linked Resource ID in localStorage");
        return;
      }
    
    const resourceRes = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_URI +
        `/did-linked-resource/get?did=${encodeURIComponent(did)}&resourceId=${encodeURIComponent(resourceId)}`
    );
    if (!resourceRes.ok) {
        console.error("Failed to fetch linked resource");
        return;
    }

    const { content } = await resourceRes.json();
    if (!content) {
        console.warn("No ipfs URL returned");
        return;
    }

    const res = await fetch(content);
    const base64 = await res.text();
  
    const blob = new Blob([base64], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "voiceprint.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  
    URL.revokeObjectURL(url);
  };


  return (
    <div className="min-h-[calc(100vh-3.3rem)] pt-24 bg-gray-950 text-white flex flex-col items-center px-4">
      <h1 className="text-2xl font-bold mb-2">This is your Credential</h1>
      <p className="mb-6">Your identity is now linked to your voice.</p>

      <Button onClick={handleDownloadVoiceprint} className="mb-6  flex items-center gap-2">
        <Download size={18} />
        Download Voiceprint
      </Button>

      {credential && (
        <div className="bg-gray-900 rounded-2xl shadow-lg border border-gray-800 p-6 overflow-auto max-w-4xl w-full text-sm font-mono whitespace-pre-wrap mb-12 scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-gray-800">
            <pre>{JSON.stringify(credential, null, 2)}</pre>
        </div>
      )}
    </div>
  );

}
