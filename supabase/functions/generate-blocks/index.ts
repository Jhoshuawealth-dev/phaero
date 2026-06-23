import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const VALID_BLOCKS = ["Hero Banner", "About Section", "Services", "Pricing Table", "Testimonials", "Contact Form", "Photo Gallery", "Team Section", "FAQ Accordion", "WhatsApp CTA", "Paystack Button", "Footer"]

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const { prompt } = await req.json()
    const apiKey = Deno.env.get("GROQ_API_KEY")

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const systemPrompt = `You generate website structure for African businesses as JSON ONLY (no markdown, no explanation, no backticks).

Available block types (use ONLY these exact names): ${VALID_BLOCKS.join(", ")}

Output this exact schema:
{
  "businessName": "realistic business name based on the prompt",
  "tagline": "short tagline under 8 words",
  "bgColor": "hex color fitting the business vibe (warm earthy tones, e.g. #8B4513, #2F4F4F, #1a3a5c, #B8860B, #3a1a3a, #1a3a2a)",
  "blocks": ["Hero Banner", "About Section", "...choose 5-8 relevant blocks in a sensible order, always include Footer last, include Photo Gallery and Testimonials when relevant, ALWAYS include Pricing Table if this is a restaurant/food/cafe/bar business (it will become the menu)"],
  "heroTitle": "the business name again, stylized",
  "heroSubtitle": "compelling one-line subtitle",
  "aboutBody": "2-sentence about text",
  "services": ["service 1", "service 2", "service 3"],
  "menuItems": [{"name": "item name", "price": 2500}, {"name": "item name", "price": 3500}, {"name": "item name", "price": 4000}] OR null if not a food/restaurant business - if it IS a restaurant, cafe, suya spot, bar, or food business, generate 3-5 REAL, SPECIFIC menu items with realistic Naira prices that fit the cuisine (e.g. for suya: 'Beef Suya', 'Chicken Suya', 'Kilishi' with prices 1500-5000; for a restaurant: actual dish names),
  "imagePrompt": "a short visual description for AI image generation matching this business, e.g. 'grilled suya skewers on a charcoal grill, Nigerian street food' or 'modern ankara fashion dress display' - be specific and visual, under 15 words",
  "responseMessage": "1-2 sentence friendly confirmation mentioning the business name and what was built"
}`

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 700,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || "Groq API error" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const text = data.choices?.[0]?.message?.content || "{}"
    let site
    try {
      site = JSON.parse(text)
    } catch {
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    site.blocks = (site.blocks || []).filter((b: string) => VALID_BLOCKS.includes(b))
    if (site.blocks.length === 0) site.blocks = ["Hero Banner", "About Section", "Footer"]

    return new Response(JSON.stringify({ site }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
