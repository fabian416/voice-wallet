'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearIdentityStorage } from '@/lib/utils';

export default function HomePage() {
  const [credential, setCredential] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const storedCredential = localStorage.getItem('credential');
    if (!storedCredential || storedCredential == "") {
      clearIdentityStorage();
      router.push('/');
    } else {
      setCredential(JSON.parse(storedCredential));
    }
  }, []);

  if (!credential) {
    return (
      <div className="min-h-[calc(100vh-3.3rem)] flex items-center justify-center bg-gray-900 text-white">
        <p className="text-lg">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.3rem)] flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white px-4">
      <h1 className="text-4xl font-bold text-green-400 mb-6 text-center">
        🎉 Congratulations!
      </h1>
      <p className="text-xl text-center max-w-xl">
        You’ve successfully created your Verifiable Credential. <br />
        Your identity is now securely linked to your voice.
      </p>
    </div>
  );
}
