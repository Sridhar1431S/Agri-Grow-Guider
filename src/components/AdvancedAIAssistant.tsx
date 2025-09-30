import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, Send, MessageSquare, Trash2, Globe } from 'lucide-react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { VoiceSynthesis } from '@/components/VoiceSynthesis';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  updated_at: string;
}

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
];

export function AdvancedAIAssistant() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [showSessions, setShowSessions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user's preferred language
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('ai_language')
          .eq('user_id', user.id)
          .single();

        if (profile?.ai_language) {
          setCurrentLanguage(profile.ai_language);
        }
      } catch (error) {
        console.error('Error loading user language:', error);
      }
    };

    loadUserLanguage();
  }, [user]);

  // Load chat sessions
  useEffect(() => {
    const loadSessions = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase.functions.invoke('chat-history', {
          method: 'GET'
        });

        if (error) throw error;
        setSessions(data.sessions || []);
      } catch (error) {
        console.error('Error loading sessions:', error);
      }
    };

    loadSessions();
  }, [user]);

  // Update user's language preference
  const updateUserLanguage = async (language: string) => {
    if (!user) return;

    try {
      await supabase
        .from('profiles')
        .update({ ai_language: language })
        .eq('user_id', user.id);

      setCurrentLanguage(language);
    } catch (error) {
      console.error('Error updating language:', error);
      toast({
        title: 'Error',
        description: 'Failed to update language preference',
        variant: 'destructive',
      });
    }
  };

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const startNewSession = () => {
    setMessages([]);
    setCurrentSession(generateSessionId());
    setShowSessions(false);
  };

  const loadSession = async (sessionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-history', {
        method: 'GET',
        body: { sessionId }
      });

      if (error) throw error;

      const loadedMessages = data.messages.map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }));

      setMessages(loadedMessages);
      setCurrentSession(sessionId);
      setShowSessions(false);
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat session',
        variant: 'destructive',
      });
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await supabase.functions.invoke('chat-history', {
        method: 'DELETE',
        body: { sessionId }
      });

      setSessions(sessions.filter(s => s.id !== sessionId));
      
      if (currentSession === sessionId) {
        startNewSession();
      }

      toast({
        title: 'Success',
        description: 'Chat session deleted',
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete session',
        variant: 'destructive',
      });
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || !user) return;

    const sessionId = currentSession || generateSessionId();
    if (!currentSession) {
      setCurrentSession(sessionId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: messageText,
          language: currentLanguage,
          sessionId,
          messages: conversationHistory
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update sessions list if this is a new session
      if (!sessions.find(s => s.id === sessionId)) {
        const newSession: ChatSession = {
          id: sessionId,
          title: messageText.slice(0, 50) + (messageText.length > 50 ? '...' : ''),
          updated_at: new Date().toISOString()
        };
        setSessions(prev => [newSession, ...prev]);
      }

    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    sendMessage(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceTranscription = useCallback((transcription: string) => {
    setInputMessage(transcription);
  }, []);

  const getWelcomeMessage = () => {
    const welcomeMessages = {
      en: "Hello! I'm your AI farming assistant. How can I help you with your agricultural needs today?",
      hi: "नमस्ते! मैं आपका AI कृषि सहायक हूं। आज मैं आपकी कृषि आवश्यकताओं में कैसे मदद कर सकता हूं?",
      te: "హలో! నేను మీ AI వ్యవసాయ సహాయకుడను. ఈరోజు మీ వ్యవసాయ అవసరాలలో నేను ఎలా సహాయం చేయగలను?",
      ta: "வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். இன்று உங்கள் விவசாய தேவைகளில் நான் எப்படி உதவ முடியும்?"
    };
    return welcomeMessages[currentLanguage as keyof typeof welcomeMessages] || welcomeMessages.en;
  };

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Please sign in to use the AI Assistant.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header with Language Selector and Session Management */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">AI Farming Assistant</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Select value={currentLanguage} onValueChange={updateUserLanguage}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            onClick={() => setShowSessions(!showSessions)}
            className="w-full sm:w-auto"
          >
            Chat History
          </Button>
          
          <Button onClick={startNewSession} className="w-full sm:w-auto">
            New Chat
          </Button>
        </div>
      </div>

      {/* Chat Sessions Panel */}
      {showSessions && (
        <Card className="border-2">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Recent Conversations</h3>
            <ScrollArea className="h-48">
              {sessions.length === 0 ? (
                <p className="text-muted-foreground text-sm">No previous conversations</p>
              ) : (
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer group"
                    >
                      <div 
                        className="flex-1 text-sm truncate"
                        onClick={() => loadSession(session.id)}
                      >
                        {session.title}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteSession(session.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="min-h-[500px] flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{getWelcomeMessage()}</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {message.role === 'assistant' && (
                      <div className="mt-2 flex justify-end">
                        <VoiceSynthesis 
                          text={message.content}
                          onSpeakingChange={setIsSpeaking}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about farming, crops, soil management..."
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              
              <VoiceRecorder
                onTranscription={handleVoiceTranscription}
                isListening={isListening}
                onListeningChange={setIsListening}
              />
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {(isListening || isSpeaking) && (
              <div className="mt-2 text-sm text-muted-foreground text-center">
                {isListening && 'Listening...'}
                {isSpeaking && 'Speaking...'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}