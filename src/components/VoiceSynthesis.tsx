import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceSynthesisProps {
  text: string;
  onSpeakingChange?: (speaking: boolean) => void;
}

// Convert base64 audio data to ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Convert signed 16-bit PCM to WAV format
function pcmToWav(pcmData: Int16Array, sampleRate: number): Blob {
  const buffer = new ArrayBuffer(44 + pcmData.length * 2);
  const view = new DataView(buffer);
  let offset = 0;

  function writeString(s: string) {
    for (let i = 0; i < s.length; i++) {
      view.setUint8(offset + i, s.charCodeAt(i));
    }
    offset += s.length;
  }

  function writeUint32(val: number) {
    view.setUint32(offset, val, true);
    offset += 4;
  }

  function writeUint16(val: number) {
    view.setUint16(offset, val, true);
    offset += 2;
  }

  // RIFF header
  writeString('RIFF');
  writeUint32(36 + pcmData.length * 2);
  writeString('WAVE');

  // fmt sub-chunk
  writeString('fmt ');
  writeUint32(16);
  writeUint16(1);
  writeUint16(1);
  writeUint32(sampleRate);
  writeUint32(sampleRate * 2);
  writeUint16(2);
  writeUint16(16);

  // data sub-chunk
  writeString('data');
  writeUint32(pcmData.length * 2);

  for (let i = 0; i < pcmData.length; i++) {
    view.setInt16(offset, pcmData[i], true);
    offset += 2;
  }

  return new Blob([view], { type: 'audio/wav' });
}

export function VoiceSynthesis({ text, onSpeakingChange }: VoiceSynthesisProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const speak = useCallback(async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "No text to speak",
        variant: "destructive",
      });
      return;
    }

    setIsSpeaking(true);
    onSpeakingChange?.(true);

    try {
      const payload = {
        contents: [{
          parts: [{ text }]
        }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" }
            }
          }
        },
        model: "gemini-2.5-flash-preview-tts"
      };

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Gemini API key not configured");
      }

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

      let audioData: string | undefined;
      let mimeType: string | undefined;
      const maxRetries = 3;
      let delay = 1000;

      for (let i = 0; i < maxRetries; i++) {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const result = await response.json();
          const part = result?.candidates?.[0]?.content?.parts?.[0];
          audioData = part?.inlineData?.data;
          mimeType = part?.inlineData?.mimeType;

          if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
            break;
          } else {
            throw new Error("Invalid response structure or missing audio data");
          }
        } else if (response.status === 429 && i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          throw new Error(`API returned status code ${response.status}`);
        }
      }

      if (!audioData || !mimeType) {
        throw new Error("Failed to get audio data after retries");
      }

      // Convert and play
      const pcmData = base64ToArrayBuffer(audioData);
      const pcm16 = new Int16Array(pcmData);
      
      const rateMatch = mimeType.match(/rate=(\d+)/);
      const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 16000;

      const wavBlob = pcmToWav(pcm16, sampleRate);
      const audioUrl = URL.createObjectURL(wavBlob);
      
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      
      audio.onended = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
        URL.revokeObjectURL(audioUrl);
        setCurrentAudio(null);
      };

      audio.onerror = () => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
        URL.revokeObjectURL(audioUrl);
        setCurrentAudio(null);
        toast({
          title: "Error",
          description: "Failed to play audio",
          variant: "destructive",
        });
      };
      
      await audio.play();

    } catch (error) {
      console.error("TTS generation failed:", error);
      setIsSpeaking(false);
      onSpeakingChange?.(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate speech",
        variant: "destructive",
      });
    }
  }, [text, toast, onSpeakingChange]);

  const stopSpeaking = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    setIsSpeaking(false);
    onSpeakingChange?.(false);
  }, [currentAudio, onSpeakingChange]);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={isSpeaking ? stopSpeaking : speak}
      disabled={!text.trim()}
      className="p-1"
    >
      {isSpeaking ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </Button>
  );
}