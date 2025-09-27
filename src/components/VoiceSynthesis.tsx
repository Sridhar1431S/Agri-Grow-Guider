import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceSynthesisProps {
  text: string;
  onSpeakingChange?: (speaking: boolean) => void;
}

export function VoiceSynthesis({ text, onSpeakingChange }: VoiceSynthesisProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const speak = useCallback(async () => {
    if (!text.trim()) return;

    try {
      setIsSpeaking(true);
      onSpeakingChange?.(true);

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text, voice: 'alloy' }
      });

      if (error) {
        throw error;
      }

      if (data?.audioContent) {
        // Convert base64 to audio blob
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setIsSpeaking(false);
          onSpeakingChange?.(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setIsSpeaking(false);
          onSpeakingChange?.(false);
          URL.revokeObjectURL(audioUrl);
          toast({
            title: "Audio Error",
            description: "Could not play audio response.",
            variant: "destructive"
          });
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing text-to-speech:', error);
      setIsSpeaking(false);
      onSpeakingChange?.(false);
      toast({
        title: "Speech Error",
        description: "Could not generate speech. Please try again.",
        variant: "destructive"
      });
    }
  }, [text, onSpeakingChange, toast]);

  const stopSpeaking = useCallback(() => {
    // Note: We can't easily stop the AI-generated audio, but we can stop browser TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    onSpeakingChange?.(false);
  }, [onSpeakingChange]);

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