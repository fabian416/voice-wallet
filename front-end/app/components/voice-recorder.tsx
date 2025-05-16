"use client"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onNewMessage: (content: string, role: "user" | "assistant") => void
}

export default function VoiceRecorder({ onNewMessage }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [verificationState, setVerificationState] = useState<"idle" | "verifying" | "verified" | "failed">("idle")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        processAudio(audioBlob)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setVerificationState("idle")
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setVerificationState("verifying")

      // Stop all tracks on the stream
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)

    // Simulate voice verification (in a real app, you would send the audio to your API)
    setTimeout(() => {
      // Simulate successful verification 90% of the time
      const isVerified = Math.random() > 0.1

      setVerificationState(isVerified ? "verified" : "failed")

      if (isVerified) {
        // Simulate transcription (in a real app, you would get this from your API)
        setTimeout(() => {
          const simulatedTranscription = "Este es un mensaje de prueba transcrito del audio."
          onNewMessage(simulatedTranscription, "user")
          setIsProcessing(false)
          setVerificationState("idle")
        }, 1000)
      } else {
        setIsProcessing(false)
        // Reset after a delay
        setTimeout(() => {
          setVerificationState("idle")
        }, 3000)
      }
    }, 2000)
  }

  // Iconos como componentes simples para evitar problemas de importación
  const MicIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" x2="12" y1="19" y2="22"></line>
    </svg>
  )

  const MicOffIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="1" y1="1" x2="23" y2="23"></line>
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"></path>
      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2c0 .25-.01.5-.04.75"></path>
      <line x1="12" y1="19" x2="12" y2="22"></line>
    </svg>
  )

  const LoaderIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
  )

  const CheckCircleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )

  const AlertCircleIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  )

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        {/* Botón simplificado sin usar el componente Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing || verificationState === "verifying"}
          className={cn(
            "rounded-full w-16 h-16 flex items-center justify-center",
            isRecording
              ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
              : "bg-[#4f6ef7] hover:bg-[#3b5ef5] text-white",
            (isProcessing || verificationState === "verifying") && "opacity-70 cursor-not-allowed",
          )}
          style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <span className="flex items-center justify-center" style={{ width: "24px", height: "24px" }}>
            {isRecording ? <MicOffIcon /> : <MicIcon />}
          </span>
        </button>

        {/* Voice verification indicator */}
        {verificationState !== "idle" && (
          <div className="absolute -top-1 -right-1">
            {verificationState === "verifying" && (
              <div className="bg-yellow-500 text-white rounded-full p-1">
                <LoaderIcon />
              </div>
            )}
            {verificationState === "verified" && (
              <div className="bg-green-500 text-white rounded-full p-1 animate-bounce">
                <CheckCircleIcon />
              </div>
            )}
            {verificationState === "failed" && (
              <div className="bg-red-500 text-white rounded-full p-1 animate-bounce">
                <AlertCircleIcon />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1">
        {isRecording ? (
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Recording audio...</div>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-red-500"
                  style={{
                    animation: `bounce 1.4s infinite ease-in-out both`,
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : verificationState === "verifying" ? (
          <div className="text-sm font-medium text-yellow-400">Verifying your voiceprint...</div>
        ) : verificationState === "verified" ? (
          <div className="text-sm font-medium text-green-400">Voiceprint verified, processing message...</div>
        ) : verificationState === "failed" ? (
          <div className="text-sm font-medium text-red-400">Your voiceprint could not be verified. Try again</div>
        ) : (
          <div className="text-sm text-muted-foreground">Press the button to speak</div>
        )}
      </div>
    </div>
  )
}
