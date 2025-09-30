import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language, sessionId, messages: conversationHistory } = await req.json();

    if (!message && !conversationHistory) {
      throw new Error('Message or conversation history is required');
    }

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get Lovable AI key
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable AI key not configured');
    }

    // Create system prompt based on language
    const systemPrompts: Record<string, string> = {
      en: "You are an expert agricultural assistant. Provide practical, actionable farming advice. Keep responses concise and helpful. You can answer questions about crops, soil management, pest control, irrigation, weather patterns, and sustainable farming practices.",
      hi: "आप एक विशेषज्ञ कृषि सहायक हैं। व्यावहारिक, क्रियान्वित करने योग्य कृषि सलाह प्रदान करें। आप फसलों, मृदा प्रबंधन, कीट नियंत्रण, सिंचाई, मौसम के पैटर्न और टिकाऊ कृषि प्रथाओं के बारे में प्रश्नों का उत्तर दे सकते हैं।",
      te: "మీరు ఒక నిపుణ వ్యవసాయ సహాయకుడు. ఆచరణాత్మక, అమలు చేయగల వ్యవసాయ సలహా అందించండి। మీరు పంటలు, నేల నిర్వహణ, పెస్ట్ కంట్రోల్, నీటిపారుదల, వాతావరణ నమూనాలు మరియు స్థిరమైన వ్యవసాయ పద్ధతుల గురించి ప్రశ్నలకు సమాధానం ఇవ్వగలరు.",
      ta: "நீங்கள் ஒரு நிபுணத்துவ வேளாண் உதவியாளர். நடைமுறை, செயல்படுத்தக்கூடிய வேளாண் ஆலோசனை வழங்குங்கள். நீங்கள் பயிர்கள், மண் மேலாண்மை, பூச்சி கட்டுப்பாடு, நீர்ப்பாசனம், வானிலை முறைகள் மற்றும் நிலையான விவசாய நடைமுறைகள் பற்றிய கேள்விகளுக்கு பதிலளிக்க முடியும்."
    };

    const systemPrompt = systemPrompts[language as string] || systemPrompts.en;

    // Prepare messages for conversation
    let messages = [{ role: 'system', content: systemPrompt }];
    
    if (conversationHistory && conversationHistory.length > 0) {
      messages = [...messages, ...conversationHistory];
    }
    
    if (message) {
      messages.push({ role: 'user', content: message });
    }

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      if (response.status === 402) {
        throw new Error('Insufficient credits. Please add credits to your workspace.');
      }
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Store conversation in database if sessionId provided
    if (sessionId && message) {
      // Check if session exists
      const { data: session } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .single();

      // Create session if it doesn't exist
      if (!session) {
        const { error: sessionError } = await supabase
          .from('chat_sessions')
          .insert({
            id: sessionId,
            user_id: user.id,
            title: message.slice(0, 50) + (message.length > 50 ? '...' : '')
          });

        if (sessionError) {
          console.error('Error creating session:', sessionError);
        }
      }

      // Store user message
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'user',
          content: message
        });

      // Store assistant response
      await supabase
        .from('chat_messages')
        .insert({
          session_id: sessionId,
          role: 'assistant',
          content: aiResponse
        });
    }

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});