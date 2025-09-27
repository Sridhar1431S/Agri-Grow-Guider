import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message, language } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Create system prompt based on language
    const systemPrompts: Record<string, string> = {
      en: "You are an expert agricultural assistant. Provide practical, actionable farming advice. Keep responses concise and helpful.",
      hi: "आप एक विशेषज्ञ कृषि सहायक हैं। व्यावहारिक, क्रियान्वित करने योग्य कृषि सलाह प्रदान करें।",
      te: "మీరు ఒక నిపుణ వ్యవసాయ సహాయకుడు. ఆచరణాత్మక, అమలు చేయగల వ్యవసాయ సలహా అందించండి।",
      ta: "நீங்கள் ஒரு நிபுணத்துவ வேளாண் உதவியாளர். நடைமுறை, செயல்படுத்தக்கூடிய வேளாண் ஆலோசனை வழங்குங்கள்।"
    };

    const systemPrompt = systemPrompts[language as string] || systemPrompts.en;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get AI response');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

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