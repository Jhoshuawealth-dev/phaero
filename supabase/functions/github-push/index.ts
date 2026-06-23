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

function generateComponentCode(block: any) {
  const { type, data } = block
  switch (type) {
    case "Hero Banner":
      return `export default function Hero() {
  return (
    <section style={{ background: "${data.bgColor}", padding: "60px 24px", textAlign: "center" }}>
      <h1 style={{ color: "#D4AF37" }}>${data.title}</h1>
      <p>${data.subtitle}</p>
      <button>${data.btnText}</button>
    </section>
  )
}`
    case "About Section":
      return `export default function About() {
  return (
    <section style={{ background: "${data.bgColor}", padding: "32px 24px" }}>
      <h2>${data.title}</h2>
      <p>${data.body}</p>
    </section>
  )
}`
    default:
      return `export default function ${type.replace(/\s/g, "")}() {
  return <div>${type}</div>
}`
  }
}

async function ghFetch(url: string, token: string, options: any = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  })
  const data = await res.json()
  return { ok: res.ok, status: res.status, data }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin")
  const corsHeaders = getCorsHeaders(origin)
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })

  try {
    const { githubToken, projectName, blocks, existingRepo } = await req.json()

    if (!githubToken) {
      return new Response(JSON.stringify({ error: "No GitHub token provided. Please reconnect GitHub." }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    const userRes = await ghFetch("https://api.github.com/user", githubToken)
    if (!userRes.ok) {
      return new Response(JSON.stringify({ error: "Failed to authenticate with GitHub" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }
    const authenticatedOwner = userRes.data.login

    let owner = authenticatedOwner
    let repoName

    if (existingRepo && existingRepo.includes("/")) {
      // Reuse existing repo
      const parts = existingRepo.split("/")
      owner = parts[0]
      repoName = parts[1]

      // Verify it still exists and is accessible
      const checkRes = await ghFetch(`https://api.github.com/repos/${owner}/${repoName}`, githubToken)
      if (!checkRes.ok) {
        // Fall back to creating fresh if it no longer exists
        repoName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 80) || "phaero-site"
        owner = authenticatedOwner
        const createRes = await ghFetch("https://api.github.com/user/repos", githubToken, {
          method: "POST",
          body: JSON.stringify({ name: repoName, description: "Built with Phaero", private: false, auto_init: true }),
        })
        if (!createRes.ok && !createRes.data.errors?.[0]?.message?.includes("already exists")) {
          return new Response(JSON.stringify({ error: createRes.data.message || "Failed to create repo" }), {
            status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }
      }
    } else {
      // First-time push — create a new repo
      repoName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 80) || "phaero-site"
      const createRes = await ghFetch("https://api.github.com/user/repos", githubToken, {
        method: "POST",
        body: JSON.stringify({ name: repoName, description: "Built with Phaero", private: false, auto_init: true }),
      })
      if (!createRes.ok && !createRes.data.errors?.[0]?.message?.includes("already exists")) {
        return new Response(JSON.stringify({ error: createRes.data.message || "Failed to create repo" }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
    }

    const files: Record<string, string> = {
      "README.md": `# ${projectName}\n\nBuilt with [Phaero](https://phaero.app) 👑\n\nLast updated: ${new Date().toISOString()}\n`,
    }
    ;(blocks || []).forEach((block: any, i: number) => {
      const fileName = `src/components/${block.type.replace(/\s/g, "")}_${i}.jsx`
      files[fileName] = generateComponentCode(block)
    })

    for (const [path, content] of Object.entries(files)) {
      const existing = await ghFetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${path}`, githubToken)
      const body: any = {
        message: `Update ${path} via Phaero`,
        content: btoa(unescape(encodeURIComponent(content as string))),
      }
      if (existing.ok && existing.data.sha) body.sha = existing.data.sha

      await ghFetch(`https://api.github.com/repos/${owner}/${repoName}/contents/${path}`, githubToken, {
        method: "PUT",
        body: JSON.stringify(body),
      })
    }

    return new Response(JSON.stringify({
      success: true,
      repoUrl: `https://github.com/${owner}/${repoName}`,
      repoName: `${owner}/${repoName}`,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
