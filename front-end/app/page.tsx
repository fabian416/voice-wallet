import { VoiceInterface } from './components/VoiceInterface'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-gradient-to-b from-gray-950 to-gray-900">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center text-white mb-12">
          Voice Wallet
        </h1>
        <VoiceInterface />
      </div>
    </main>
  )
} 