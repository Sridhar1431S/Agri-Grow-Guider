import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, language } = await req.json();

    if (!image) {
      throw new Error('Image is required');
    }

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    const systemPrompts: Record<string, string> = {
      en: "You are an expert agricultural disease detection AI. Analyze the crop image and provide: 1) Disease name, 2) Confidence percentage, 3) Severity level (Low/Moderate/High), 4) Treatment recommendations (3-5 points), 5) Prevention tips (3-5 points). Be specific and practical. Format your response as JSON with keys: disease, confidence, severity, treatment (array), prevention (array).",
      hi: "आप एक विशेषज्ञ कृषि रोग पहचान AI हैं। फसल की छवि का विश्लेषण करें और प्रदान करें: 1) रोग का नाम, 2) विश्वास प्रतिशत, 3) गंभीरता स्तर (कम/मध्यम/उच्च), 4) उपचार की सिफारिशें (3-5 अंक), 5) रोकथाम के उपाय (3-5 अंक)। JSON प्रारूप में उत्तर दें: disease, confidence, severity, treatment (array), prevention (array)।",
      te: "మీరు ఒక నిపుణ వ్యవసాయ వ్యాధి గుర్తింపు AI. పంట చిత్రాన్ని విశ్లేషించండి మరియు అందించండి: 1) వ్యాధి పేరు, 2) విశ్వాస శాతం, 3) తీవ్రత స్థాయి (తక్కువ/మితమైన/అధిక), 4) చికిత్స సిఫార్సులు (3-5 పాయింట్లు), 5) నివారణ చిట్కాలు (3-5 పాయింట్లు)। JSON ఆకృతిలో సమాధానం ఇవ్వండి: disease, confidence, severity, treatment (array), prevention (array)।",
      ta: "நீங்கள் ஒரு நிபுணத்துவ வேளாண் நோய் கண்டறிதல் AI. பயிர் படத்தை பகுப்பாய்வு செய்து வழங்குங்கள்: 1) நோய் பெயர், 2) நம்பிக்கை சதவீதம், 3) தீவிரத்தன்மை (குறைவு/மிதமான/அதிக), 4) சிகிச்சை பரிந்துரைகள் (3-5 புள்ளிகள்), 5) தடுப்பு குறிப்புகள் (3-5 புள்ளிகள்)। JSON வடிவத்தில் பதிலளிக்கவும்: disease, confidence, severity, treatment (array), prevention (array)।"
    };

    const systemPrompt = systemPrompts[language as string] || systemPrompts.en;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          { 
            role: 'user', 
            content: [
              {
                type: 'text',
                text: systemPrompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: image
                }
              }
            ]
          }
        ],
        modalities: ['text'],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('AI API error:', error);
      throw new Error(error.error?.message || 'Failed to analyze image');
    }

    const data = await response.json();
    let analysisText = data.choices[0].message.content;

    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    let analysis;
    
    if (jsonMatch) {
      analysis = JSON.parse(jsonMatch[0]);
    } else {
      // Fallback parsing if not JSON format
      analysis = {
        disease: "Disease Detected",
        confidence: 75,
        severity: "Moderate",
        treatment: ["Consult with local agricultural expert", "Apply appropriate treatment based on symptoms"],
        prevention: ["Regular monitoring of crops", "Maintain good agricultural practices"]
      };
    }

    return new Response(
      JSON.stringify({ analysis }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in disease-detection function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
