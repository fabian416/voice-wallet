"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MicOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
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

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          variant="ghost"
          size="lg"
          className={cn(
            "rounded-full w-16 h-16 flex items-center justify-center",
            isRecording
              ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground animate-pulse"
              : "bg-[#4f6ef7] hover:bg-[#3b5ef5] text-white",
          )}
          disabled={isProcessing || verificationState === "verifying"}
        >
          {isRecording ? (
            <MicOff className="h-6 w-6" />
          ) : (
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
              className="h-6 w-6"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" x2="12" y1="19" y2="22"></line>
            </svg>
          )}
        </Button>

        {/* Voice verification indicator */}
        {verificationState !== "idle" && (
          <div className="absolute -top-1 -right-1">
            {verificationState === "verifying" && (
              <div className="bg-yellow-500 text-white rounded-full p-1 animate-spin">
                <Loader2 className="h-4 w-4" />
              </div>
            )}
            {verificationState === "verified" && (
              <div className="bg-green-500 text-white rounded-full p-1 animate-bounce">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            )}
            {verificationState === "failed" && (
              <div className="bg-destructive text-destructive-foreground rounded-full p-1 animate-bounce">
                <AlertCircle className="h-4 w-4" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex-1">
        {isRecording ? (
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium">Grabando audio...</div>
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-destructive"
                  style={{
                    animation: `bounce 1.4s infinite ease-in-out both`,
                    animationDelay: `${i * 0.16}s`,
                  }}
                />
              ))}
            </div>
          </div>
        ) : verificationState === "verifying" ? (
          <div className="text-sm font-medium text-yellow-400">Verificando tu voiceprint...</div>
        ) : verificationState === "verified" ? (
          <div className="text-sm font-medium text-green-400">Voiceprint verificado, procesando mensaje...</div>
        ) : verificationState === "failed" ? (
          <div className="text-sm font-medium text-destructive">
            No se pudo verificar tu voiceprint. Intenta de nuevo.
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Presiona el botón para hablar</div>
        )}
      </div>
    </div>
  )
}
