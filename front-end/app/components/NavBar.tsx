"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet"
import Image from "next/image"; 
import { clearIdentityStorage } from "@/lib/utils"
import { useRouter } from 'next/navigation';

// Configuration constants
const DEFAULT_SCOPES: string[] = [
    "api:ds-query", 
    "api:llm-agent-prompt", 
    "api:llm-profile-prompt", 
    "api:search-universal", 
    "ds:social-email"
]
const VAULT_WEB_APP_AUTH_PAGE_URL = 'https://app.verida.ai/auth'
const RETURN_URL = typeof window !== 'undefined' ? window.location.origin : ''
const REQUESTING_DID = 'did:vda:polpos:0xDe6888ecc7a9F4F8a75527B5d66DaBF6D95AF237'

// Navigation links array - can be expanded as needed
const navLinks = [
  { name: "Home", href: "/home" },
  { name: "Credential", href: "/credential" },
]

const buildConnectUrl = () => {
    const authPageUrl = new URL(VAULT_WEB_APP_AUTH_PAGE_URL)

    for (const scope of DEFAULT_SCOPES) {
        authPageUrl.searchParams.append('scopes', scope)
    }

        authPageUrl.searchParams.append('redirectUrl', RETURN_URL)

        if (REQUESTING_DID) {
            authPageUrl.searchParams.append('appDID', REQUESTING_DID)
        }
    return authPageUrl.toString()
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [hasCredential, setHasCredential] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for auth token in URL when component mounts
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href)
      const token = currentUrl.searchParams.get("auth_token")
      if (token) {
        setAuthToken(token)
        console.log("token", token)
        // You might want to store this token in localStorage or your app's state management
        localStorage.setItem('veridaAuthToken', token)
      }
    }
  }, [])
  
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem('credential');
      setHasCredential(!!stored && stored !== 'undefined');
    }, 1000); // cada 1 segundo
  
    return () => clearInterval(interval);
  }, []);
  
  const handleConnect = () => {
    window.location.href = buildConnectUrl()
  }

  const startDemoAgain = () => {
    clearIdentityStorage();
    router.push("/");
  }

  return (
    <nav className="bg-gray-900 absolute top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left section: Logo + nav links */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href={hasCredential ? "/home" : "/"} className="flex items-center gap-3">
            <Image
              src="/isotipo.png"
              alt="Wally Logo"
              width={40}
              height={40}
            />
            <span className="text-xl font-bold text-white">Wally</span>
          </Link>

          {/* Nav links */}
          <div className="hidden lg:flex gap-4 items-center ml-4">
            {hasCredential && navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white hover:text-green-400 hover:no-underline"
              >
                {link.name}
              </Link>
            ))}
            {hasCredential && (
              <button
                onClick={startDemoAgain}
                className="text-sm font-medium bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition"
              >
                Start Demo Again
              </button>
            )}
          </div>
        </div>

        {/* Right section: Verida button */}
        <div className="hidden lg:flex items-center gap-3">
          {!authToken ? (
            <Button onClick={handleConnect} className="flex items-center gap-2">
              Connect with Verida
            </Button>
          ) : (
            <Button variant="outline">Connected</Button>
          )}
        </div>
  
        {/* Mobile menu */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {hasCredential && navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="text-lg font-medium"
                      onClick={() => setOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
  
                {!authToken ? (
                  <Button className="mt-4" onClick={handleConnect}>
                    Connect with Verida
                  </Button>
                ) : (
                  <Button className="mt-4" variant="outline">
                    Connected
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}  