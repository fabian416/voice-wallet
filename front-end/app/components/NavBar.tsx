'use client'

import Link from "next/link"
import { Menu } from "lucide-react"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/app/components/ui/sheet"
import Image from "next/image"; 
import { clearIdentityStorage } from "@/lib/utils"
import { useRouter } from 'next/navigation';

const navLinks = [
  { name: "Home", href: "/home" },
  { name: "Credential", href: "/credential" },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [hasCredential, setHasCredential] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const token = url.searchParams.get("auth_token");
      if (token) {
        setAuthToken(token);
        localStorage.setItem('veridaAuthToken', token);
      }
    }
  }),[];

  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem('credential');
      setHasCredential(!!stored && stored !== 'undefined');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const startDemoAgain = () => {
    clearIdentityStorage();
    router.push("/");
  }

  return (
    <nav className="bg-gray-900 absolute top-0 left-0 right-0 z-50 shadow-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo + Links */}
        <div className="flex items-center gap-6">
          <Link href={(authToken && hasCredential) ? "/chat" : hasCredential ? "/home" : "/"} className="flex items-center gap-3">
            <Image src="/isotipo.png" alt="Wally Logo" width={40} height={40} />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">Wally</span>
          </Link>

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

        {/* Mobile menu */}
        <div className="lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </button>
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
                {hasCredential && (
                  <button
                    onClick={startDemoAgain}
                    className="text-sm font-medium mt-4 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Start Demo Again
                  </button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
