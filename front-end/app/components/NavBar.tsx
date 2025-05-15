"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/router'

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
  { name: "Home", href: "/" },
  { name: "Connections", href: "/connections" },
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
  const [authToken, setAuthToken] = useState<string | null>(null)

    const showNavLinks = false

  useEffect(() => {
    // Check for auth token in URL when component mounts
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href)
      const token = currentUrl.searchParams.get("auth_token")
      if (token) {
        setAuthToken(token)
        // You might want to store this token in localStorage or your app's state management
        localStorage.setItem('veridaAuthToken', token)
      }
    }
  }, [])

  const handleConnect = () => {
    window.location.href = buildConnectUrl()
  }

  return (
    <nav className="bg-transparent absolute top-0 left-0 right-0 z-50">
      <div className="flex h-16 items-center px-4 container mx-auto">
        {/* Logo on the left */}
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-white">Wall-E</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden ml-auto">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col gap-4 mt-8">
              {showNavLinks && navLinks.map((link) => (
                <Link key={link.name} href={link.href} className="text-lg font-medium" onClick={() => setOpen(false)}>
                  {link.name}
                </Link>
              ))}
              <Button className="mt-4" onClick={() => setOpen(false)}>
                Login
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop navigation links in the middle */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-center">
          <div className="flex gap-6">
            {showNavLinks && navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Login button on the right */}
        <div className="hidden lg:flex lg:items-center lg:justify-end">
          {!authToken ? (
            <Button 
              onClick={handleConnect}
              className="flex items-center gap-2"
            >
              Connect with Verida
            </Button>
          ) : (
            <Button variant="outline">Connected</Button>
          )}
        </div>
      </div>
    </nav>
  )
}
