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
      en: "You are an expert agricultural disease detection AI. FIRST, determine if this image contains plants, crops, or agricultural content. If NOT related to farming/plants, respond with JSON: {\"not_farming\": true, \"message\": \"Please upload an image of crops or plants for disease detection.\"}. If it IS farming-related, analyze the crop image thoroughly and provide: 1) Disease name (or 'Healthy' if no disease detected), 2) Confidence percentage (0-100), 3) Severity level (Low/Moderate/High/None), 4) Detailed treatment recommendations (3-5 specific, actionable points), 5) Prevention tips (3-5 practical points). Be highly accurate and specific. Format response as JSON with keys: disease, confidence, severity, treatment (array), prevention (array).",
      hi: "आप एक विशेषज्ञ कृषि रोग पहचान AI हैं। पहले यह निर्धारित करें कि क्या इस छवि में पौधे, फसलें या कृषि सामग्री है। यदि खेती/पौधों से संबंधित नहीं है, तो JSON में उत्तर दें: {\"not_farming\": true, \"message\": \"कृपया रोग का पता लगाने के लिए फसलों या पौधों की छवि अपलोड करें।\"}। यदि यह खेती से संबंधित है, तो फसल की छवि का गहन विश्लेषण करें और प्रदान करें: 1) रोग का नाम (या 'स्वस्थ' यदि कोई रोग नहीं), 2) विश्वास प्रतिशत (0-100), 3) गंभीरता स्तर (कम/मध्यम/उच्च/कोई नहीं), 4) विस्तृत उपचार की सिफारिशें (3-5 विशिष्ट, कार्रवाई योग्य अंक), 5) रोकथाम के उपाय (3-5 व्यावहारिक अंक)। अत्यधिक सटीक और विशिष्ट रहें। JSON प्रारूप में उत्तर दें: disease, confidence, severity, treatment (array), prevention (array)।",
      te: "మీరు ఒక నిపుణ వ్యవసాయ వ్యాధి గుర్తింపు AI. మొదట, ఈ చిత్రంలో మొక్కలు, పంటలు లేదా వ్యవసాయ కంటెంట్ ఉందో లేదో నిర్ణయించండి. వ్యవసాయం/మొక్కలకు సంబంధించినది కాకపోతే, JSONలో ప్రతిస్పందించండి: {\"not_farming\": true, \"message\": \"వ్యాధి గుర్తింపు కోసం దయచేసి పంటలు లేదా మొక్కల చిత్రాన్ని అప్‌లోడ్ చేయండి।\"}। వ్యవసాయానికి సంబంధించినది అయితే, పంట చిత్రాన్ని క్షుణ్ణంగా విశ్లేషించండి మరియు అందించండి: 1) వ్యాధి పేరు (లేదా వ్యాధి లేకపోతే 'ఆరోగ్యకరమైనది'), 2) విశ్వాస శాతం (0-100), 3) తీవ్రత స్థాయి (తక్కువ/మితమైన/అధిక/ఏదీ లేదు), 4) వివరణాత్మక చికిత్స సిఫార్సులు (3-5 నిర్దిష్ట, చర్య తీసుకోదగిన పాయింట్లు), 5) నివారణ చిట్కాలు (3-5 ఆచరణాత్మక పాయింట్లు)। అత్యంత ఖచ్చితత్వం మరియు నిర్దిష్టంగా ఉండండి। JSON ఆకృతిలో సమాధానం ఇవ్వండి: disease, confidence, severity, treatment (array), prevention (array)।",
      ta: "நீங்கள் ஒரு நிபுணத்துவ வேளாண் நோய் கண்டறிதல் AI. முதலில், இந்த படத்தில் செடிகள், பயிர்கள் அல்லது விவசாய உள்ளடக்கம் உள்ளதா என்பதை தீர்மானிக்கவும். விவசாயம்/செடிகளுடன் தொடர்புடையதாக இல்லாவிட்டால், JSONஆல் பதிலளிக்கவும்: {\"not_farming\": true, \"message\": \"நோய் கண்டறிதலுக்காக பயிர்கள் அல்லது செடிகளின் படத்தை பதிவேற்றவும்।\"}। விவசாயத்துடன் தொடர்புடையதாக இருந்தால், பயிர் படத்தை முழுமையாக பகுப்பாய்வு செய்து வழங்குங்கள்: 1) நோய் பெயர் (அல்லது நோய் இல்லாவிட்டால் 'ஆரோக்கியமானது'), 2) நம்பிக்கை சதவீதம் (0-100), 3) தீவிரத்தன்மை (குறைவு/மிதமான/அதிக/எதுவுமில்லை), 4) விரிவான சிகிச்சை பரிந்துரைகள் (3-5 குறிப்பிட்ட, செயல்படக்கூடிய புள்ளிகள்), 5) தடுப்பு குறிப்புகள் (3-5 நடைமுறை புள்ளிகள்)। மிகவும் துல்லியமாகவும் குறிப்பாகவும் இருக்கவும். JSON வடிவத்தில் பதிலளிக்கவும்: disease, confidence, severity, treatment (array), prevention (array)।"
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

    console.log('AI Response:', analysisText);

    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    let analysis;
    
    if (jsonMatch) {
      analysis = JSON.parse(jsonMatch[0]);
      
      // Check if image is not farming-related
      if (analysis.not_farming) {
        return new Response(
          JSON.stringify({ 
            error: analysis.message || "Please upload an image related to crops or plants for accurate disease detection." 
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        );
      }
    } else {
      // Fallback parsing if not JSON format
      analysis = {
        disease: "Unable to analyze",
        confidence: 0,
        severity: "Unknown",
        treatment: ["Please upload a clear image of the crop or plant", "Ensure good lighting and focus on affected areas"],
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
