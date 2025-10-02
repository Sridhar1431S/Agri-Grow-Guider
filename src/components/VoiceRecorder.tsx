import { useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isListening: boolean;
  onListeningChange: (listening: boolean) => void;
}

// Get browser-specific SpeechRecognition
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export function VoiceRecorder({ onTranscription, isListening, onListeningChange }: VoiceRecorderProps) {
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  const startRecording = useCallback(async () => {
    if (!SpeechRecognition) {
      toast({
        title: "Not Supported",
        description: "Speech Recognition is not supported by this browser. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Initialize recognition if not done already
      if (!recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          onListeningChange(true);
        };

        recognitionRef.current.onresult = (event: any) => {
          const result = event.results[0][0].transcript;
          onTranscription(result);
          toast({
            title: "Transcription Complete",
            description: "Your speech has been converted to text",
          });
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          onListeningChange(false);
          
          let errorMessage = "An error occurred during speech recognition";
          if (event.error === 'not-allowed') {
            errorMessage = "Microphone access denied. Please allow microphone access.";
          } else if (event.error === 'no-speech') {
            errorMessage = "No speech detected. Please try again.";
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          });
        };

        recognitionRef.current.onend = () => {
          onListeningChange(false);
        };
      }

      recognitionRef.current.start();
      
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      toast({
        title: "Error",
        description: "Failed to start listening. Please check microphone permissions.",
        variant: "destructive",
      });
      onListeningChange(false);
    }
  }, [toast, onTranscription, onListeningChange]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const toggleRecording = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      onClick={toggleRecording}
      className="flex-shrink-0"
    >
      {isListening ? (
        <Square className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </Button>
  );
}