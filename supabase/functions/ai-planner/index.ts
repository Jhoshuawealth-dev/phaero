import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const ALLOWED_ORIGINS = [
  "https://phaero.vercel.app",
  "http://localhost:5173",
]

function getCorsHeaders(origin: string | null) {
  const allowOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin")
  const corsHeaders = getCorsHeaders(origin)
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const { messages } = await req.json()
    const apiKey = Deno.env.get("GEMINI_API_KEY")

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const systemPrompt = `You are Osiris, Phaero's AI planning assistant. You help users figure out exactly what website or web app they want to build before handing it off to the builder.

Your job:
1. Ask short, focused clarifying questions about their business/idea — one or two at a time, never overwhelm them.
2. Cover: what the business does, who their customers are, key features/sections they need, and whether they need payments (Paystack), WhatsApp contact, or bookings.
3. After 2-4 exchanges, once you have enough detail, summarize a clear, complete plan.
4. When you give the final plan, end your message with the exact line: "PLAN_READY" on its own line, followed by a JSON block with this schema:
{"businessName": "...", "summary": "2-3 sentence plan summary", "blocks": ["Hero Banner", "About Section", ...pick 5-8 from: Hero Banner, About Section, Services, Pricing Table, Testimonials, Contact Form, Photo Gallery, Team Section, FAQ Accordion, WhatsApp CTA, Paystack Button, Footer], "imagePrompt": "short visual description for image generation"}

Keep your conversational messages warm, concise, and African-context aware (Paystack, WhatsApp, Naira, local business culture). Do not output the PLAN_READY block until you genuinely have enough information — usually after 2-4 user replies.`

    // Convert message history to Gemini's format
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }))

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: { maxOutputTokens: 500 },
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "Gemini API error" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""

    let plan = null
    if (text.includes("PLAN_READY")) {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        try {
          plan = JSON.parse(jsonMatch[0])
        } catch {}
      }
    }

    const displayText = text.split("PLAN_READY")[0].trim()

    return new Response(JSON.stringify({ text: displayText, plan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
