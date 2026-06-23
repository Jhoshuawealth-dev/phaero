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
    const { prompt } = await req.json()
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY")

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const systemPrompt = `You generate website content for African businesses as structured JSON. Output ONLY valid JSON, no markdown, no explanation, no backticks. Use this exact schema:
{
  "businessName": "string, a realistic business name based on the prompt",
  "tagline": "string, short tagline under 8 words",
  "heroColor": "string, a hex color that fits the business vibe (warm earthy tones for African businesses, e.g. #8B4513, #2F4F4F, #1a3a5c, #B8860B, #3a1a3a)",
  "description": "string, one sentence describing the business, under 15 words",
  "location": "string, a realistic African city and country",
  "products": ["string, product/service 1", "string, product/service 2", "string, product/service 3"],
  "phone": "string, realistic African phone format",
  "email": "string, realistic email matching business name",
  "ctaText": "string, primary button text under 3 words",
  "responseMessage": "string, 1-2 sentence friendly message confirming what was built, mentioning the business name"
}`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 500,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "Claude API error" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const text = data.content?.find((c: any) => c.type === "text")?.text || "{}"

    let siteData
    try {
      const cleaned = text.replace(/```json|```/g, "").trim()
      siteData = JSON.parse(cleaned)
    } catch (e) {
      return new Response(JSON.stringify({ error: "Failed to parse site data" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ site: siteData }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
