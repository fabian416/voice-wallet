'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { clearIdentityStorage } from '@/lib/utils';

export default function CreateAccountPage() {
    const [voiceprint, setVoiceprint] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedCredential = localStorage.getItem('credential');
        if (storedCredential && storedCredential !== "undefined") {
        router.push('/home');
        }
    }, [isLoading]);
    

    useEffect(() => {
        const stored = localStorage.getItem('voiceprint');
        if (stored && stored !== '') {
        setVoiceprint(stored);
        }

        const timeout = setTimeout(() => {
        setIsReady(true);
        }, 500); // Delay visual opcional

        return () => clearTimeout(timeout);
    }, []);


    useEffect(() => {
        const createAccount = async () => {
        if (!voiceprint) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URI}/account/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ voiceprint }),
            });

            const {did, linkedResource, credential} = await res.json();
            localStorage.setItem('did', did);
            localStorage.setItem('linkedResource', linkedResource);
            localStorage.setItem('credential', JSON.stringify(credential));
        } catch (error) {
            console.error('Error al crear la cuenta:', error);
        } finally {
            setIsLoading(false);
        }
        };

        if (isReady && voiceprint) {
        createAccount();
        }
    }, [isReady, voiceprint]);

    return (
        <div className="min-h-[calc(100vh-3.3rem)] flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
        <Image
            src="/logo.png"
            alt="Wally Logo"
            width={120}
            height={120}
            className="mb-6 animate-bounce"
        />
        <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-t-transparent border-green-400 rounded-full animate-spin" />
            <p className="text-xl font-medium text-green-200">
            Wally is linking your voice to your identity...
            </p>
        </div>
        </div>
    );
  
}
