import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { prompt, context } = await req.json()

    const apiKey = Deno.env.get("GROQ_API_KEY")
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const systemPrompt = `You are Phaero AI, an expert website builder assistant for African businesses. You help users build and edit websites by describing what changes to make. Be concise, friendly, and specific. When a user describes a business or asks for a change, respond as if you've made the change, describing exactly what you did in 1-3 sentences. Use African business context naturally (Paystack, WhatsApp, Naira, local culture) when relevant. Keep responses short and confident.`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 300,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: context ? `Context: ${context}\n\nRequest: ${prompt}` : prompt }
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "Groq API error" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const text = data.choices?.[0]?.message?.content || "Done!"

    return new Response(JSON.stringify({ text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
