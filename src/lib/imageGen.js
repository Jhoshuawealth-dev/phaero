export function generateImageUrl(prompt, width = 800, height = 600) {
  const cleanPrompt = encodeURIComponent(prompt.trim())
  const seed = Math.floor(Math.random() * 100000)
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`
}
