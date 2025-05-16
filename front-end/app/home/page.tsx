'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { clearIdentityStorage } from '@/lib/utils';
import { Stars } from "lucide-react";

const DEFAULT_SCOPES: string[] = [
  "api:ds-query",
  "api:llm-agent-prompt",
  "api:llm-profile-prompt",
  "api:search-universal",
  "ds:social-email"
];

const VAULT_WEB_APP_AUTH_PAGE_URL = 'https://app.verida.ai/auth';
const REQUESTING_DID = 'did:vda:polpos:0xDe6888ecc7a9F4F8a75527B5d66DaBF6D95AF237';

const buildConnectUrl = () => {
  const redirectUrl = typeof window !== 'undefined' ? window.location.origin + "/home" : '';
  const authPageUrl = new URL(VAULT_WEB_APP_AUTH_PAGE_URL);

  for (const scope of DEFAULT_SCOPES) {
    authPageUrl.searchParams.append('scopes', scope);
  }
  authPageUrl.searchParams.append('redirectUrl', redirectUrl);
  authPageUrl.searchParams.append('appDID', REQUESTING_DID);
  return authPageUrl.toString();
};

export default function HomePage() {
  const [credential, setCredential] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('veridaAuthToken');
    if (token) {
      router.push('/chat');
    }
  }, []);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("auth_token");
      if (token) {
        setAuthToken(token);
        localStorage.setItem('veridaAuthToken', token);
      }
    }

    const storedCredential = localStorage.getItem('credential');
    if (!storedCredential || storedCredential === 'undefined') {
      clearIdentityStorage();
      router.push('/');
    } else {
      setCredential(JSON.parse(storedCredential));
    }
  }, []);

  const handleConnect = () => {
    window.location.href = buildConnectUrl();
  };

  if (!credential) {
    return (
      <div className="min-h-[calc(100vh-3.3rem)] flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.3rem)] flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white px-4">
     <h1 className="text-4xl font-bold text-green-400 mb-6 text-center flex items-center gap-2">
        <Stars className="inline-block mr-2 text-green-400" size={28} />
        Congratulations!
      </h1>
      <p className="text-xl text-center max-w-xl mb-6">
        You&#39;ve successfully linked your voice to your identity.
      </p>
      <p className="text-lg text-center max-w-xl mb-6">
        Now connect to Verida to use your voiceprint and start controlling Wally, your personal AI agent.
      </p>

      {!authToken ? (
        <Button
          onClick={handleConnect}
          className="flex items-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100"
        >
          Connect with Verida
        </Button>
      ) : (
        <Button variant="outline">Connected</Button>
      )}
    </div>
  );
}
